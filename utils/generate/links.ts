import { CLIENT_ENVIRONMENT } from "@/environments/client.environment";
import { APP_ROUTE } from "@/routes/app.route";

const { NEXT_PUBLIC_SITE_URL } = CLIENT_ENVIRONMENT;

interface IGenerateWhatsAppShareLink {
  videoTitle: string;
  fraudId: string;
}

export const generateWhatsAppShareLink = ({
  videoTitle,
  fraudId,
}: IGenerateWhatsAppShareLink) =>
  `https://wa.me/?text=${encodeURIComponent(`${videoTitle} ${NEXT_PUBLIC_SITE_URL}${APP_ROUTE.FRAUDS.SLUG(fraudId)}`)}`;
