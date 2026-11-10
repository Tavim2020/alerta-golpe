import { TPreviewCardVariant } from "@/components/previews-cards/components/preview-card/preview-card.type";
import { APP_INFO } from "@/constants/app.constant";
import { CLIENT_ENVIRONMENT } from "@/environments/client.environment";
import { APP_ROUTE } from "@/routes/app.route";
import { toast } from "react-toastify";

const { NEXT_PUBLIC_SITE_URL, NEXT_PUBLIC_SUPABASE_URL } = CLIENT_ENVIRONMENT;

interface IGenerateShareLink {
  title: string;
  slug: string;
  variant: TPreviewCardVariant;
}

const generateLinkUrl = ({
  slug,
  variant,
}: Pick<IGenerateShareLink, "slug" | "variant">) => {
  const correctLink =
    variant === "article"
      ? APP_ROUTE.ARTICLES.SLUG(slug)
      : APP_ROUTE.FRAUDS.SLUG(slug);
  return `${NEXT_PUBLIC_SITE_URL}${correctLink}`;
};

export const generateWhatsAppShareLink = ({
  title,
  slug,
  variant,
}: IGenerateShareLink) =>
  `https://wa.me/?text=${encodeURIComponent(`Olha esse ${variant === "fraud" ? "golpe" : "artigo"}: ${title} \n${generateLinkUrl({ slug, variant })}`)}`;

export const generateShareLink = async ({
  title,
  slug,
  variant,
}: IGenerateShareLink) => {
  if (!navigator?.share) {
    toast.error("Compartilhamento não suportado neste navegador");
    return;
  }

  await navigator?.share({
    title,
    text: `Olha esse golpe: ${title}`,
    url: generateLinkUrl({ slug, variant }),
  });
};

export const generateBucketUrl = (bucketInitialUrl: string) =>
  bucketInitialUrl.replace(NEXT_PUBLIC_SUPABASE_URL, "");

interface IGenerateWhatsAppLawyerLink {
  lawyerPhone: string;
  fraudTitle: string;
  fraudSlug: string;
}

export const generateWhatsAppLawyerLink = ({
  lawyerPhone,
  fraudTitle,
  fraudSlug,
}: IGenerateWhatsAppLawyerLink) =>
  `https://wa.me/55${lawyerPhone}?text=${encodeURIComponent(`Estou entrando em contato com você por meio do ${APP_INFO.name}. Estava vendo a respeito do artigo: ${fraudTitle} \n${generateLinkUrl({ slug: fraudSlug, variant: "fraud" })}`)}`;

export const generateContactAlertaGolpeLink = () =>
  `https://wa.me/55${APP_INFO.contactPhone}?text=${encodeURIComponent(`Olá, estou entrando em contato com você por meio do ${APP_INFO.name}.`)}`;
