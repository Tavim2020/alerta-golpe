"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { ControlledInputText } from "@/components/form/controlled-input-text";
import { toast } from "react-toastify";
import {
  adminLoginSchema,
  AdminLoginSchema,
} from "./schemas/admin-login.schema";
import { ButtonDefault } from "@/components/buttons/button-default";
import { zodResolver } from "@hookform/resolvers/zod";
import { API_ROUTE } from "@/routes/api.route";
import { APP_ROUTE } from "@/routes/app.route";
import { useMutation } from "@tanstack/react-query";

export default function AdminLogin() {
  const router = useRouter();

  const { control, handleSubmit } = useForm<AdminLoginSchema>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate: login, isPending } = useMutation({
    mutationFn: async (data: AdminLoginSchema) => {
      const response = await fetch(API_ROUTE.ADMIN_LOGIN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const result = await response.json().catch(() => null);

        throw new Error(result?.message ?? "E-mail ou senha inválidos.");
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success("Login efetuado com sucesso!");
      router.push(APP_ROUTE.ADMIN.DASHBOARD.ROOT());
    },
    onError: (error) =>
      toast.error(error?.message ?? "Não foi possível fazer o login."),
  });

  return (
    <form
      onSubmit={handleSubmit((data) => login(data))}
      className="mx-auto mt-20 max-w-sm space-y-4 border border-ink/15 bg-white p-8 flex-1 flex flex-col items-center justify-content-center"
    >
      <h1 className="font-display text-3xl">Acesso administrativo</h1>

      <ControlledInputText
        control={control}
        name="email"
        type="email"
        required
        placeholder="E-mail"
        maxLength={300}
      />

      <ControlledInputText
        control={control}
        name="password"
        type="password"
        required
        placeholder="Senha"
      />

      <ButtonDefault
        type="submit"
        className="w-full bg-sun text-black hover:brightness-95 hover:bg-sun hover:text-black"
        disabled={isPending}
      >
        Entrar
      </ButtonDefault>
    </form>
  );
}
