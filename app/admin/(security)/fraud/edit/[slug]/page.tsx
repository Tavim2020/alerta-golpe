import { RenderFormEditFraud } from "./components/render-form-edit-fraud";
import { getFraudBySlug } from "@/utils/frauds/get-fraud-by-slug";
import { TSlugPageProps } from "@/types/global.type";

export default async function EditFraud({ params }: TSlugPageProps) {
  const { fraud } = await getFraudBySlug(params);

  return <RenderFormEditFraud fraud={fraud} />;
}
