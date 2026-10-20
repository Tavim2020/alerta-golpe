"use client";

import { useRouter } from "next/navigation";
import { API_ROUTE } from "@/routes/api.route";
import { FormFraud } from "../fraud/shared/components/form-fraud";

type PostResult = {
  error?: string;
};

async function post<T extends PostResult>(
  body: Record<string, string>,
): Promise<T> {
  const response = await fetch(API_ROUTE.FRAUDS, {
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

export default function AdminDashboard() {
  const router = useRouter();

  return <FormFraud isPending={false} submit={(data) => console.log(data)} />;
}
