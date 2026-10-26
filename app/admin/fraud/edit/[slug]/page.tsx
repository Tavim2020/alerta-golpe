import { RenderFormEditFraud } from "./components/render-form-edit-fraud";
import { IPageParamsProps } from "@/types/global.type";
import { BackButton } from "../../../shared/components/back-button";
import { getCategoriesOptions } from "@/libs/supabase/categories/get-categories";
import { getSubCategoriesOptions } from "@/libs/supabase/sub-categories/get-sub-categories";
import { APP_ROUTE } from "@/routes/app.route";
import { getFraudBySlug } from "@/libs/supabase/frauds/get-frauds";

export default async function EditFraud({
  params,
}: IPageParamsProps<{ slug?: string }>) {
  const { slug } = await params;

  if (!slug) throw new Error("Parâmetro não encontrado!");

  const [
    { fraud },
    { success: successCategoryOptions, data: allCategoriesOptions },
    { success: successSubCategoryOptions, data: allSubCategoriesOptions },
  ] = await Promise.all([
    getFraudBySlug(slug),
    getCategoriesOptions(),
    getSubCategoriesOptions(),
  ]);

  if (!successCategoryOptions || !successSubCategoryOptions)
    throw new Error("Tivemos problemas ao buscar as informações.");

  return (
    <>
      <BackButton
        title="Edição de Fraud"
        href={APP_ROUTE.ADMIN.DASHBOARD.ROOT()}
      />

      <RenderFormEditFraud
        fraud={fraud}
        slug={slug}
        allCategoriesOptions={allCategoriesOptions}
        allSubCategoriesOptions={allSubCategoriesOptions}
      />
    </>
  );
}
