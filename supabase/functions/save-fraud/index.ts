import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const VIDEO_BUCKET = "videos";
const THUMBNAIL_BUCKET = "thumbnails";

const MIME_TYPES: Record<string, string[]> = {
  [VIDEO_BUCKET]: ["video/mp4", "video/webm"],
  [THUMBNAIL_BUCKET]: ["image/png", "image/jpeg", "image/jpg"],
};

const MAX_SIZE: Record<string, number> = {
  [VIDEO_BUCKET]: 50 * 1024 * 1024,
  [THUMBNAIL_BUCKET]: 3 * 1024 * 1024,
};

const ALLOWED_EXTENSIONS: Record<string, string[]> = {
  [VIDEO_BUCKET]: ["mp4", "webm"],
  [THUMBNAIL_BUCKET]: ["png", "jpg", "jpeg"],
};

type FraudFile = {
  bucket: string;
  path: string;
  previousBlob: Blob | null;
};

type FraudRecord = {
  id: string;
  slug: string;
  file_name: string | null;
  thumbnail: string | null;
  lawyer_id: string | null;
  [key: string]: unknown;
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

function parseTips(value: string): unknown {
  if (!value) return [];

  const parsed: unknown = JSON.parse(value);

  if (!Array.isArray(parsed)) {
    throw new Error("O campo tips deve ser um array JSON.");
  }

  return parsed;
}

function isValidUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    value,
  );
}

function getExtension(file: File, bucket: string): string {
  const extension = file.name.split(".").pop()?.toLowerCase();

  if (!extension || extension === file.name.toLowerCase()) {
    throw new Error(`Arquivo sem extensão válida: ${file.name}`);
  }

  const allowed = ALLOWED_EXTENSIONS[bucket];

  if (!allowed) {
    throw new Error(`Bucket não suportado: ${bucket}`);
  }

  if (!allowed.includes(extension)) {
    throw new Error(
      `Extensão ".${extension}" não permitida para o bucket "${bucket}".`,
    );
  }

  return extension;
}

function normalizePath(value: string, bucket: string): string {
  if (!value) return "";

  const marker = `/storage/v1/object/public/${bucket}/`;
  const index = value.indexOf(marker);

  let path: string;

  try {
    path =
      index >= 0
        ? decodeURIComponent(value.slice(index + marker.length))
        : value;
  } catch {
    throw new Error(`URL inválida no bucket ${bucket}.`);
  }

  if (
    !path ||
    path.startsWith("/") ||
    path.includes("\\") ||
    path.split("/").some((part) => part === "..")
  ) {
    throw new Error(`Caminho inválido no bucket ${bucket}.`);
  }

  return path;
}

async function objectExists(
  supabase: ReturnType<typeof createClient>,
  bucket: string,
  path: string,
): Promise<boolean> {
  const { data, error } = await supabase.storage.from(bucket).list("", {
    search: path,
    limit: 100,
  });

  if (error) throw error;

  return (data ?? []).some((item) => item.name === path);
}

async function uploadFile(
  supabase: ReturnType<typeof createClient>,
  bucket: string,
  slug: string,
  file: File,
  changes: FraudFile[],
): Promise<string> {
  const allowedTypes = MIME_TYPES[bucket];

  if (!allowedTypes?.includes(file.type)) {
    throw new Error(`Tipo de arquivo não permitido em ${bucket}: ${file.type}`);
  }

  if (file.size > MAX_SIZE[bucket]) {
    throw new Error(
      `O arquivo excede o limite de tamanho do bucket ${bucket}.`,
    );
  }

  const extension = getExtension(file, bucket);
  const path = `${slug}.${extension}`;

  const exists = await objectExists(supabase, bucket, path);
  let previousBlob: Blob | null = null;

  if (exists) {
    const { data, error } = await supabase.storage.from(bucket).download(path);

    if (error) throw error;

    previousBlob = data;
  }

  // Registrar antes do upload permite restaurar o arquivo anterior
  // caso uma etapa posterior da operação falhe.
  changes.push({ bucket, path, previousBlob });

  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    upsert: true,
    contentType: file.type,
    cacheControl: "3600",
  });

  if (error) throw error;

  return path;
}

async function rollbackFiles(
  supabase: ReturnType<typeof createClient>,
  changes: FraudFile[],
): Promise<string[]> {
  const errors: string[] = [];

  for (const change of [...changes].reverse()) {
    try {
      if (change.previousBlob) {
        const { error } = await supabase.storage
          .from(change.bucket)
          .upload(change.path, change.previousBlob, {
            upsert: true,
            contentType: change.previousBlob.type || "application/octet-stream",
          });

        if (error) throw error;
      } else {
        const { error } = await supabase.storage
          .from(change.bucket)
          .remove([change.path]);

        if (error) throw error;
      }
    } catch (error) {
      errors.push(
        `${change.bucket}/${change.path}: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }
  }

  return errors;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return json({ error: "Método não permitido." }, 405);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !serviceRoleKey) {
    console.error("Missing Supabase environment variables.");

    return json({ error: "Configuração do Supabase ausente." }, 500);
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  const changes: FraudFile[] = [];

  try {
    const form = await req.formData();

    const title = getString(form, "title");
    const requestedSlug = getString(form, "slug");

    if (!title) {
      return json({ error: "O campo title é obrigatório." }, 400);
    }

    // A presença do slug indica edição.
    const isUpdate = Boolean(requestedSlug);

    let current: FraudRecord | null = null;
    let slug = requestedSlug;

    if (isUpdate) {
      const { data, error } = await supabase
        .from("frauds")
        .select("*")
        .eq("slug", requestedSlug)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        return json({ error: "Fraude não encontrada." }, 404);
      }

      current = data as FraudRecord;
      slug = current.slug;
    } else {
      const { data, error } = await supabase.rpc("generate_unique_slug", {
        title_text: title,
      });

      if (error) throw error;

      if (typeof data !== "string" || !data) {
        throw new Error("Não foi possível gerar o slug.");
      }

      slug = data;
    }

    // Validar lawyer_id antes de fazer upload de qualquer arquivo.
    // undefined significa preservar o vínculo durante a edição.
    // null significa salvar sem advogado.
    let lawyerIdToSave: string | null | undefined;

    const lawyerValue = form.get("lawyer_id");

    if (lawyerValue === null) {
      lawyerIdToSave = isUpdate ? undefined : null;
    } else {
      if (typeof lawyerValue !== "string") {
        return json({ error: "Campo inválido: lawyer_id." }, 400);
      }

      const lawyerId = lawyerValue.trim();

      if (!lawyerId) {
        lawyerIdToSave = null;
      } else {
        if (!isValidUuid(lawyerId)) {
          return json(
            { error: "O campo lawyer_id deve conter um UUID válido." },
            400,
          );
        }

        const { data: lawyer, error: lawyerError } = await supabase
          .from("lawyers")
          .select("id")
          .eq("id", lawyerId)
          .maybeSingle();

        if (lawyerError) throw lawyerError;

        if (!lawyer) {
          return json(
            { error: "O advogado informado não foi encontrado." },
            400,
          );
        }

        lawyerIdToSave = lawyer.id;
      }
    }

    const videoValue = form.get("video");
    const thumbnailValue = form.get("thumbnail");

    const videoFile =
      videoValue instanceof File && videoValue.size > 0 ? videoValue : null;

    const thumbnailFile =
      thumbnailValue instanceof File && thumbnailValue.size > 0
        ? thumbnailValue
        : null;

    const videoString = typeof videoValue === "string" ? videoValue.trim() : "";

    const thumbnailString =
      typeof thumbnailValue === "string" ? thumbnailValue.trim() : "";

    if (!isUpdate && !videoFile && !videoString) {
      return json({ error: "O vídeo é obrigatório." }, 400);
    }

    if (!isUpdate && !thumbnailFile && !thumbnailString) {
      return json({ error: "A thumbnail é obrigatória." }, 400);
    }

    let fileName = current?.file_name ? String(current.file_name) : "";

    let thumbnail = current?.thumbnail ? String(current.thumbnail) : "";

    if (videoFile) {
      fileName = await uploadFile(
        supabase,
        VIDEO_BUCKET,
        slug,
        videoFile,
        changes,
      );
    } else if (videoString) {
      fileName = normalizePath(videoString, VIDEO_BUCKET);
    }

    if (thumbnailFile) {
      thumbnail = await uploadFile(
        supabase,
        THUMBNAIL_BUCKET,
        slug,
        thumbnailFile,
        changes,
      );
    } else if (thumbnailString) {
      thumbnail = normalizePath(thumbnailString, THUMBNAIL_BUCKET);
    }

    const payload: Record<string, unknown> = {
      title,
      slug,
      file_name: fileName,
      thumbnail,
    };

    const fields = [
      "description",
      "context",
      "content",
      "tips",
      "sub_category_id",
    ] as const;

    for (const field of fields) {
      const value = form.get(field);

      // Na edição, campos omitidos preservam o valor atual.
      if (value === null) continue;

      if (typeof value !== "string") {
        throw new Error(`Campo inválido: ${field}`);
      }

      if (field === "tips") {
        payload[field] = parseTips(value);
      } else {
        payload[field] = value.trim() || null;
      }
    }

    // Não sobrescreve lawyer_id se o campo foi omitido na edição.
    if (lawyerIdToSave !== undefined) {
      payload.lawyer_id = lawyerIdToSave;
    }

    let fraud: unknown;

    if (isUpdate) {
      const { data, error } = await supabase
        .from("frauds")
        .update(payload)
        .eq("slug", slug)
        .select()
        .single();

      if (error) throw error;

      fraud = data;
    } else {
      const { data, error } = await supabase
        .from("frauds")
        .insert(payload)
        .select()
        .single();

      if (error) throw error;

      fraud = data;
    }

    // O registro foi salvo. Agora tentamos limpar arquivos substituídos.
    // Uma falha na limpeza não invalida o salvamento do registro.
    const oldVideo = current?.file_name ? String(current.file_name) : "";

    const oldThumbnail = current?.thumbnail ? String(current.thumbnail) : "";

    const cleanupErrors: string[] = [];

    const obsoleteFiles = [
      {
        bucket: VIDEO_BUCKET,
        oldPath: oldVideo,
        newPath: fileName,
      },
      {
        bucket: THUMBNAIL_BUCKET,
        oldPath: oldThumbnail,
        newPath: thumbnail,
      },
    ];

    for (const item of obsoleteFiles) {
      if (!item.oldPath || item.oldPath === item.newPath) continue;

      try {
        const path = normalizePath(item.oldPath, item.bucket);

        const { error } = await supabase.storage
          .from(item.bucket)
          .remove([path]);

        if (error) throw error;
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);

        console.error(
          `Failed to clean up ${item.bucket}/${item.oldPath}:`,
          message,
        );

        cleanupErrors.push(`${item.bucket}/${item.oldPath}: ${message}`);
      }
    }

    return json({
      success: true,
      operation: isUpdate ? "update" : "create",
      slug,
      fraud,
      ...(cleanupErrors.length > 0 ? { cleanup_warning: cleanupErrors } : {}),
    });
  } catch (error) {
    console.error("save-fraud failed:", error);

    const rollbackErrors = await rollbackFiles(supabase, changes);

    return json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Erro inesperado ao salvar a fraude.",
        ...(rollbackErrors.length > 0
          ? { rollback_errors: rollbackErrors }
          : {}),
      },
      500,
    );
  }
});
