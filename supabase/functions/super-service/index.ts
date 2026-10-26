import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const BATCH_SIZE = 10;
const MAX_ATTEMPTS = 10;
const MAX_BACKOFF_SECONDS = 3600;

const ALLOWED_BUCKETS = new Set(["videos", "thumbnails", "lawyers_photos"]);

type MediaDeletionJob = {
  id: string;
  source_id: string | null;
  media_type: "video" | "thumbnail" | "lawyer_photo";
  bucket_id: string;
  file_path: string;
  status: string;
  attempts: number;
};

function getBackoffSeconds(attempts: number): number {
  return Math.min(
    30 * 2 ** Math.min(Math.max(attempts - 1, 0), 7),
    MAX_BACKOFF_SECONDS,
  );
}

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  const secret = Deno.env.get("VIDEO_WORKER_SECRET");

  if (!secret || req.headers.get("x-worker-secret") !== secret) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !serviceRoleKey) {
    console.error("Missing Supabase environment variables.");

    return Response.json(
      { error: "Server configuration error" },
      { status: 500 },
    );
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  const { data: jobs, error: claimError } = await supabase.rpc(
    "claim_media_deletion_jobs",
    {
      p_limit: BATCH_SIZE,
    },
  );

  if (claimError) {
    console.error("Failed to claim media deletion jobs:", claimError.message);

    return Response.json({ error: "Failed to claim jobs" }, { status: 500 });
  }

  let processed = 0;
  let failed = 0;

  for (const job of (jobs ?? []) as MediaDeletionJob[]) {
    try {
      // Não permita que uma linha da fila escolha buckets arbitrários.
      if (!ALLOWED_BUCKETS.has(job.bucket_id)) {
        throw new Error(`Bucket not allowed: ${job.bucket_id}`);
      }

      if (!job.file_path?.trim()) {
        throw new Error("Empty file path");
      }

      // O caminho deve ser relativo ao bucket.
      // Não passe URLs públicas completas.
      const { error: storageError } = await supabase.storage
        .from(job.bucket_id)
        .remove([job.file_path]);

      if (storageError) {
        throw new Error(`Storage (${job.bucket_id}): ${storageError.message}`);
      }

      const now = new Date().toISOString();

      const { error: updateError } = await supabase
        .from("media_deletion_queue")
        .update({
          status: "processed",
          processed_at: now,
          updated_at: now,
          locked_at: null,
          last_error: null,
        })
        .eq("id", job.id)
        .eq("status", "processing");

      if (updateError) {
        throw new Error(`Queue update: ${updateError.message}`);
      }

      processed++;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);

      console.error(`Media deletion job ${job.id} failed:`, message);

      const nextAttempt = new Date(
        Date.now() + getBackoffSeconds(job.attempts) * 1000,
      ).toISOString();

      const { error: updateError } = await supabase
        .from("media_deletion_queue")
        .update({
          status: job.attempts >= MAX_ATTEMPTS ? "failed" : "pending",
          next_attempt_at: nextAttempt,
          updated_at: new Date().toISOString(),
          locked_at: null,
          last_error: message.slice(0, 2000),
        })
        .eq("id", job.id)
        .eq("status", "processing");

      if (updateError) {
        console.error(`Could not update job ${job.id}:`, updateError.message);
      }

      failed++;
    }
  }

  return Response.json({
    claimed: jobs?.length ?? 0,
    processed,
    failed,
  });
});
