import { APP_INFO } from "@/constants/app.constant";
import { CLIENT_ENVIRONMENT } from "@/environments/client.environment";
import { APP_ROUTE } from "@/routes/app.route";

const { NEXT_PUBLIC_SITE_URL, NEXT_PUBLIC_SUPABASE_URL } = CLIENT_ENVIRONMENT;

interface IGenerateWhatsAppShareLink {
  fraudTitle: string;
  slug: string;
}

const generateFraudUrl = (slug: string) =>
  `${NEXT_PUBLIC_SITE_URL}${APP_ROUTE.FRAUDS.SLUG(slug)}`;

export const generateWhatsAppShareLink = ({
  fraudTitle,
  slug,
}: IGenerateWhatsAppShareLink) =>
  `https://wa.me/?text=${encodeURIComponent(`Olha esse golpe: ${fraudTitle} \n${generateFraudUrl(slug)}`)}`;

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
  `https://wa.me/55${lawyerPhone}?text=${encodeURIComponent(`Estou entrando em contato com você por meio do ${APP_INFO.name}. Estava vendo a respeito do artigo: ${fraudTitle} \n${generateFraudUrl(fraudSlug)}`)}`;
