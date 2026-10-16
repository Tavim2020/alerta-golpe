import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return Response.json(
      { error: "Method not allowed" },
      { status: 405 },
    );
  }

  const secret = Deno.env.get("VIDEO_WORKER_SECRET");

  if (
    !secret ||
    req.headers.get("x-worker-secret") !== secret
  ) {
    return Response.json(
      { error: "Unauthorized" },
      { status: 401 },
    );
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    },
  );

  const { data: jobs, error: claimError } =
    await supabase.rpc("claim_video_deletion_jobs", {
      p_limit: 10,
    });

  if (claimError) {
    console.error("Failed to claim jobs:", claimError.message);

    return Response.json(
      { error: "Failed to claim jobs" },
      { status: 500 },
    );
  }

  let processed = 0;
  let failed = 0;

  for (const job of jobs ?? []) {
    try {
      // Remove o vídeo.
      const { error: videoError } = await supabase.storage
        .from("videos")
        .remove([job.video_path]);

      if (videoError) {
        throw new Error(`Video: ${videoError.message}`);
      }

      // Remove a thumbnail.
      const { error: thumbnailError } = await supabase.storage
        .from("thumbnails")
        .remove([job.thumbnail_path]);

      if (thumbnailError) {
        throw new Error(`Thumbnail: ${thumbnailError.message}`);
      }

      const { error: updateError } = await supabase
        .from("video_deletion_queue")
        .update({
          status: "processed",
          processed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
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
      const message =
        error instanceof Error ? error.message : String(error);

      console.error(`Job ${job.id} failed:`, message);

      // Backoff: 30s, 60s, 120s... máximo de 1 hora.
      const delaySeconds = Math.min(
        30 * 2 ** Math.min(job.attempts - 1, 7),
        3600,
      );

      const nextAttempt = new Date(
        Date.now() + delaySeconds * 1000,
      ).toISOString();

      const { error: updateError } = await supabase
        .from("video_deletion_queue")
        .update({
          status: job.attempts >= 10 ? "failed" : "pending",
          next_attempt_at: nextAttempt,
          updated_at: new Date().toISOString(),
          locked_at: null,
          last_error: message.slice(0, 2000),
        })
        .eq("id", job.id)
        .eq("status", "processing");

      if (updateError) {
        console.error(
          `Could not update job ${job.id}:`,
          updateError.message,
        );
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