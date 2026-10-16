import { revalidatePath } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/libs/supabase/server";

type SignRequest = {
  step: "sign";
  filename: string;
};

type SaveRequest = {
  step: "save";
  title: string;
  description?: string;
  path: string;
};

type VideoRequest = SignRequest | SaveRequest;

const rand = (): string => Math.random().toString(36).slice(2, 7);
const slugify = (value: string): string =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);

function isVideoRequest(body: unknown): body is VideoRequest {
  if (typeof body !== "object" || body === null || !("step" in body))
    return false;
  if (body.step === "sign")
    return "filename" in body && typeof body.filename === "string";
  if (body.step === "save") {
    return (
      "title" in body &&
      typeof body.title === "string" &&
      "path" in body &&
      typeof body.path === "string" &&
      (!("description" in body) || typeof body.description === "string")
    );
  }
  return false;
}

export async function POST(req: NextRequest) {
  const body: unknown = await req.json();
  if (!isVideoRequest(body)) {
    return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
  }

  const supabase = db();
  if (body.step === "sign") {
    const ext = (body.filename.split(".").pop() || "mp4")
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");
    const path = `${Date.now()}-${rand()}.${ext}`;
    const { data, error } = await supabase.storage
      .from("videos")
      .createSignedUploadUrl(path);
    if (error)
      return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ path, token: data.token });
  }

  if (!body.title || !body.path) {
    return NextResponse.json({ error: "Dados incompletos" }, { status: 400 });
  }

  const { data: publicFile } = supabase.storage
    .from("videos")
    .getPublicUrl(body.path);
  const slug = `${slugify(body.title)}-${rand()}`;
  const { error } = await supabase.from("videos").insert({
    slug,
    title: body.title,
    description: body.description || null,
    video_url: publicFile.publicUrl,
  });
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  revalidatePath("/", "layout");
  return NextResponse.json({ slug });
}
