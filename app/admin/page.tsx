"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

type PostResult = {
  error?: string;
};

type SignedUpload = PostResult & {
  path: string;
  token: string;
};

type SavedVideo = PostResult & {
  slug: string;
};

async function post<T extends PostResult>(
  body: Record<string, string>,
): Promise<T> {
  const response = await fetch("/api/admin/videos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const result = (await response.json()) as T;
  if (!response.ok)
    throw new Error(
      result.error ?? `Falha na requisição (${response.status}).`,
    );
  return result;
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

export default function Admin() {
  const router = useRouter();
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  async function publicar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const file = form.get("file");

    if (!(file instanceof File)) {
      setStatus("Selecione um arquivo de vídeo.");
      return;
    }

    setBusy(true);
    try {
      setStatus(
        "Enviando vídeo. Não feche a página, isso pode levar alguns minutos.",
      );
      const { path, token } = await post<SignedUpload>({
        step: "sign",
        filename: file.name,
      });
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error(
          "NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY devem estar configuradas.",
        );
      }
      const supa = createClient(supabaseUrl, supabaseAnonKey);
      const { error } = await supa.storage
        .from("frauds")
        .uploadToSignedUrl(path, token, file);
      if (error) throw error;
      const { slug } = await post<SavedVideo>({
        step: "save",
        title: String(form.get("title") ?? ""),
        description: String(form.get("description") ?? ""),
        path,
      });
      router.push(`/golpes/${slug}`);
    } catch (error: unknown) {
      setStatus(`Erro: ${errorMessage(error)}`);
      setBusy(false);
    }
  }

  async function sair() {
    await fetch("/api/login", { method: "DELETE" });
    router.push("/acesso-adm");
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-4xl">Publicar vídeo</h1>
        <button onClick={sair} className="text-sm font-semibold underline">
          Sair
        </button>
      </div>
      <form
        onSubmit={publicar}
        className="mt-6 space-y-4 border border-ink/15 bg-white p-6"
      >
        <input
          name="title"
          required
          maxLength={120}
          placeholder="Título (ex: Golpe da falsa central do banco)"
          className="w-full border border-ink/30 p-3"
        />
        <textarea
          name="description"
          rows={5}
          placeholder="Descreva como o golpe aconteceu e como evitar"
          className="w-full border border-ink/30 p-3"
        />
        <input
          name="file"
          type="file"
          accept="video/*"
          required
          className="w-full border border-dashed border-ink/40 p-4"
        />
        <button
          disabled={busy}
          className="w-full bg-sun py-3 font-bold hover:brightness-95 disabled:opacity-50"
        >
          {busy ? "Publicando…" : "Publicar vídeo"}
        </button>
        {status && <p className="text-sm font-semibold">{status}</p>}
      </form>
    </div>
  );
}
