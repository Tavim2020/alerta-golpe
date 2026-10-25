import { RenderFormEditLawyer } from "./components/render-form-edit-lawyer";
import { IPageParamsProps } from "@/types/global.type";
import { BackButton } from "@/app/admin/shared/components/back-button";
import { APP_ROUTE } from "@/routes/app.route";
import { getLawyerById } from "@/libs/supabase/lawyers/get-lawyers";

export default async function EditLawyer({
  params,
}: IPageParamsProps<{ "lawyer-id"?: string }>) {
  const { "lawyer-id": lawyerId } = await params;

  if (!lawyerId) throw new Error("Parâmetro não encontrado!");

  const { lawyer } = await getLawyerById(lawyerId);

  return (
    <>
      <BackButton
        title="Edição de Advogado(a)"
        href={APP_ROUTE.ADMIN.LAWYERS.ROOT()}
      />

      <RenderFormEditLawyer lawyer={lawyer} lawyerId={lawyerId} />
    </>
  );
}
