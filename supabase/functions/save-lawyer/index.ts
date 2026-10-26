import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const BUCKET = "lawyers_photos";
const MAX_SIZE = 3 * 1024 * 1024;

const MIME_TYPES: Record<string, string[]> = {
  jpg: ["image/jpeg", "image/jpg"],
  jpeg: ["image/jpeg", "image/jpg"],
  png: ["image/png"],
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type UploadedChange = {
  path: string;
  previousBlob: Blob | null;
  previousContentType: string | null;
};

type LawyerPayload = {
  id: string;
  name: string;
  bio: string | null;
  specialty: string[] | null;
  file_name: string | null;
  phone: string | null;
  instagram: string | null;
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}

function getString(form: FormData, key: string): string {
  const value = form.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function normalizeName(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9\s_-]/g, "")
    .trim()
    .replace(/\s+/g, "_")
    .replace(/_+/g, "_");
}

function getExtension(file: File): string {
  const extension = file.name.split(".").pop()?.toLowerCase();

  if (!extension || !MIME_TYPES[extension]) {
    throw new Error("Formato de imagem inválido. Utilize JPG, JPEG ou PNG.");
  }

  if (!MIME_TYPES[extension].includes(file.type)) {
    throw new Error("A extensão não corresponde ao tipo da imagem.");
  }

  if (file.size <= 0 || file.size > MAX_SIZE) {
    throw new Error("A imagem deve ter no máximo 3 MB.");
  }

  return extension;
}

function parseSpecialty(value: string): string[] | null {
  if (!value) return null;

  let parsed: unknown;

  try {
    parsed = JSON.parse(value);
  } catch {
    throw new Error("O campo specialty deve ser um array JSON de strings.");
  }

  if (
    !Array.isArray(parsed) ||
    !parsed.every((item) => typeof item === "string" && item.trim().length > 0)
  ) {
    throw new Error("O campo specialty deve conter apenas strings.");
  }

  return parsed.map((item: string) => item.trim());
}

function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}

async function objectExists(
  supabase: ReturnType<typeof createClient>,
  path: string,
): Promise<boolean> {
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .list("", { search: path, limit: 100 });

  if (error) throw error;

  return (data ?? []).some((item) => item.name === path);
}

async function uploadPhoto(
  supabase: ReturnType<typeof createClient>,
  lawyerId: string,
  lawyerName: string,
  file: File,
  changes: UploadedChange[],
): Promise<string> {
  const extension = getExtension(file);
  const safeName = normalizeName(lawyerName);

  if (!safeName) {
    throw new Error("Não foi possível gerar o nome da imagem.");
  }

  const path = `${lawyerId}_${safeName}.${extension}`;

  // Guardamos o arquivo anterior para possibilitar o rollback
  // caso o upload sobrescreva uma imagem já existente.
  const exists = await objectExists(supabase, path);

  let previousBlob: Blob | null = null;
  let previousContentType: string | null = null;

  if (exists) {
    const { data, error } = await supabase.storage.from(BUCKET).download(path);

    if (error) throw error;

    previousBlob = data;
    previousContentType = data.type || null;
  }

  // Registrar antes do upload permite compensar falhas posteriores.
  changes.push({
    path,
    previousBlob,
    previousContentType,
  });

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    upsert: true,
    contentType: file.type,
    cacheControl: "3600",
  });

  if (error) throw error;

  return path;
}

async function rollbackPhoto(
  supabase: ReturnType<typeof createClient>,
  changes: UploadedChange[],
): Promise<string[]> {
  const errors: string[] = [];

  for (const change of [...changes].reverse()) {
    try {
      if (change.previousBlob) {
        const { error } = await supabase.storage
          .from(BUCKET)
          .upload(change.path, change.previousBlob, {
            upsert: true,
            contentType:
              change.previousContentType || "application/octet-stream",
          });

        if (error) throw error;
      } else {
        const { error } = await supabase.storage
          .from(BUCKET)
          .remove([change.path]);

        if (error) throw error;
      }
    } catch (error) {
      errors.push(`${change.path}: ${String(error)}`);
    }
  }

  return errors;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return json({ error: "Método não permitido." }, 405);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !serviceRoleKey) {
    return json({ error: "Configuração do Supabase ausente." }, 500);
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  const changes: UploadedChange[] = [];

  try {
    const form = await req.formData();

    const idValue = getString(form, "id");
    const name = getString(form, "name");

    if (!name) {
      return json({ error: "O campo name é obrigatório." }, 400);
    }

    if (idValue && !isUuid(idValue)) {
      return json({ error: "O ID informado não é um UUID válido." }, 400);
    }

    const isUpdate = Boolean(idValue);

    // No cadastro, geramos o ID antes do upload.
    // Na edição, utilizamos o ID recebido.
    const lawyerId = idValue || crypto.randomUUID();

    let current: Record<string, unknown> | null = null;

    if (isUpdate) {
      const { data, error } = await supabase
        .from("lawyers")
        .select("*")
        .eq("id", lawyerId)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        return json({ error: "Advogado não encontrado." }, 404);
      }

      current = data as Record<string, unknown>;
    }

    const photoValue = form.get("photo");
    const photoFile =
      photoValue instanceof File && photoValue.size > 0 ? photoValue : null;

    const photoString = typeof photoValue === "string" ? photoValue.trim() : "";

    // Aceita file_name como alternativa para enviar uma referência
    // textual, caso o frontend ainda utilize esse nome de campo.
    const fileNameValue = form.get("file_name");
    const fileNameString =
      typeof fileNameValue === "string" ? fileNameValue.trim() : "";

    let fileName = current?.file_name ? String(current.file_name) : null;

    if (photoFile) {
      fileName = await uploadPhoto(
        supabase,
        lawyerId,
        name,
        photoFile,
        changes,
      );
    } else if (photoString || fileNameString) {
      // Strings são referências já existentes: não fazemos upload.
      fileName = photoString || fileNameString;
    }

    const payload: Record<string, unknown> = {
      id: lawyerId,
      name,
      file_name: fileName,
    };

    const fields = ["bio", "phone", "instagram", "specialty"] as const;

    for (const field of fields) {
      const value = form.get(field);

      // Campos omitidos na edição preservam os valores atuais.
      if (value === null && isUpdate) continue;
      if (value === null) {
        payload[field] = null;
        continue;
      }

      if (typeof value !== "string") {
        throw new Error(`Campo inválido: ${field}`);
      }

      payload[field] =
        field === "specialty" ? parseSpecialty(value) : value.trim() || null;
    }

    let lawyer: Record<string, unknown>;

    if (isUpdate) {
      const { data, error } = await supabase
        .from("lawyers")
        .update(payload)
        .eq("id", lawyerId)
        .select()
        .single();

      if (error) throw error;

      lawyer = data as Record<string, unknown>;
    } else {
      const { data, error } = await supabase
        .from("lawyers")
        .insert(payload)
        .select()
        .single();

      if (error) throw error;

      lawyer = data as Record<string, unknown>;
    }

    // O banco foi atualizado. Agora podemos remover a foto antiga,
    // mas somente quando um novo arquivo foi enviado.
    const oldFileName = current?.file_name ? String(current.file_name) : "";

    const cleanupErrors: string[] = [];

    if (
      photoFile &&
      oldFileName &&
      oldFileName !== fileName &&
      !oldFileName.includes("/storage/v1/object/")
    ) {
      const { error } = await supabase.storage
        .from(BUCKET)
        .remove([oldFileName]);

      if (error) {
        cleanupErrors.push(
          `Não foi possível remover a foto antiga: ${error.message}`,
        );
      }
    }

    return json({
      success: true,
      operation: isUpdate ? "update" : "create",
      lawyer,
      ...(cleanupErrors.length ? { cleanup_warning: cleanupErrors } : {}),
    });
  } catch (error) {
    const rollbackErrors = await rollbackPhoto(supabase, changes);

    return json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Erro inesperado ao salvar o advogado.",
        ...(rollbackErrors.length ? { rollback_errors: rollbackErrors } : {}),
      },
      500,
    );
  }
});
