import { NextResponse, type NextRequest } from "next/server";
import { handlerMiddleware, Middleware } from "@/app/api/utils/middleware";
import { db } from "@/libs/supabase/server";

const getFrauds: Middleware = async (req) => {
  const searchParams = req.nextUrl.searchParams;

  const pageString = searchParams.get("page") || "1";
  const limitString = searchParams.get("limit") || "1";
  const search = searchParams.get("search");

  const page = Number(pageString);
  const limit = Number(limitString);

  if (isNaN(page) || isNaN(limit))
    throw new Error("Parâmetros de busca inválidos.");

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = db()
    .from("frauds")
    .select("slug, title, description", { count: "exact" })
    .order("created_at", { ascending: false });

  if (search?.trim()) {
    const { data: matchingIds, error: searchError } = await db().rpc(
      "search_frauds",
      {
        search_term: search.trim(),
      },
    );

    if (searchError) throw searchError;

    const ids = (matchingIds ?? []) as string[];

    if (ids.length === 0)
      NextResponse.json({
        data: [],
        totalPages: 0,
        success: true,
      });

    query = query.in("id", ids);
  }

  const { data, error, count } = await query.range(from, to);

  if (error) throw error;

  const total = count ?? 0;

  return NextResponse.json({
    data: data || [],
    totalPages: Math.ceil(total / limit),
    success: true,
  });
};

export async function GET(req: NextRequest) {
  return await handlerMiddleware(getFrauds)(req);
}
