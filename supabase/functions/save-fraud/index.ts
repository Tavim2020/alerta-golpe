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

type FraudFile = {
  bucket: string;
  path: string;
  previousBlob: Blob | null;
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

function getString(form: FormData, key: string) {
  const value = form.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function parseTips(value: string): unknown {
  if (!value) return [];
  return JSON.parse(value);
}

function getExtension(file: File, bucket: string): string {
  const extension = file.name.split(".").pop()?.toLowerCase();

  if (!extension || extension === file.name.toLowerCase()) {
    throw new Error(`Arquivo sem extensão válida: ${file.name}`);
  }

  const allowedExtensions: Record<string, string[]> = {
    [VIDEO_BUCKET]: ["mp4", "webm"],
    [THUMBNAIL_BUCKET]: ["png", "jpg", "jpeg"],
  };

  const allowed = allowedExtensions[bucket];

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
function normalizePath(value: string, bucket: string) {
  if (!value) return "";

  // Aceita nome do arquivo ou URL pública do Storage.
  const marker = `/storage/v1/object/public/${bucket}/`;
  const index = value.indexOf(marker);

  const path =
    index >= 0 ? decodeURIComponent(value.slice(index + marker.length)) : value;

  if (path.startsWith("/") || path.split("/").some((part) => part === "..")) {
    throw new Error(`Caminho inválido no bucket ${bucket}.`);
  }

  return path;
}

async function objectExists(
  supabase: ReturnType<typeof createClient>,
  bucket: string,
  path: string,
) {
  const { data, error } = await supabase.storage
    .from(bucket)
    .list("", { search: path, limit: 100 });

  if (error) throw error;

  return (data ?? []).some((item) => item.name === path);
}

async function uploadFile(
  supabase: ReturnType<typeof createClient>,
  bucket: string,
  slug: string,
  file: File,
  changes: FraudFile[],
) {
  const allowedTypes = MIME_TYPES[bucket];

  if (!allowedTypes.includes(file.type)) {
    throw new Error(`Tipo de arquivo não permitido em ${bucket}: ${file.type}`);
  }

  if (file.size > MAX_SIZE[bucket]) {
    throw new Error(
      `O arquivo excede o limite de tamanho do bucket ${bucket}.`,
    );
  }

  const extension = getExtension(file, bucket);
  const path = `${slug}.${extension}`;

  // Guardamos o conteúdo anterior antes de sobrescrever.
  const exists = await objectExists(supabase, bucket, path);
  let previousBlob: Blob | null = null;

  if (exists) {
    const { data, error } = await supabase.storage.from(bucket).download(path);

    if (error) throw error;
    previousBlob = data;
  }

  // Registramos a operação antes do upload para possibilitar
  // o rollback mesmo se o upload retornar erro.
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
) {
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
      errors.push(`${change.bucket}/${change.path}: ${String(error)}`);
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

    let current: Record<string, unknown> | null = null;
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

      current = data as Record<string, unknown>;
      // Preservamos o slug atual durante a edição.
      slug = String(current.slug);
    } else {
      // Usa a função SQL já existente no projeto.
      const { data, error } = await supabase.rpc("generate_unique_slug", {
        title_text: title,
      });

      if (error) throw error;

      if (typeof data !== "string" || !data) {
        throw new Error("Não foi possível gerar o slug.");
      }

      slug = data;
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

    // Em edição, a ausência de arquivo mantém a mídia atual.
    // Em cadastro, ambos os arquivos ou referências devem ser enviados.
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

      // Campos omitidos na edição preservam o valor atual.
      if (value === null && isUpdate) continue;
      if (value === null) continue;

      if (typeof value !== "string") {
        throw new Error(`Campo inválido: ${field}`);
      }

      payload[field] = field === "tips" ? parseTips(value) : value || null;
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

    // A operação principal foi concluída.
    // Removemos arquivos antigos apenas se não forem mais referenciados.
    const oldVideo = current?.file_name ? String(current.file_name) : "";

    const oldThumbnail = current?.thumbnail ? String(current.thumbnail) : "";

    const cleanupErrors: string[] = [];

    const obsoleteFiles = [
      { bucket: VIDEO_BUCKET, oldPath: oldVideo, newPath: fileName },
      {
        bucket: THUMBNAIL_BUCKET,
        oldPath: oldThumbnail,
        newPath: thumbnail,
      },
    ];

    for (const item of obsoleteFiles) {
      if (!item.oldPath || item.oldPath === item.newPath) continue;

      try {
        const { error } = await supabase.storage
          .from(item.bucket)
          .remove([normalizePath(item.oldPath, item.bucket)]);

        if (error) throw error;
      } catch (error) {
        // A fraude já foi salva. Falha de limpeza não invalida
        // a operação principal; registramos para monitoramento.
        cleanupErrors.push(String(error));
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
