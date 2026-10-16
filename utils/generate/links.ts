import { CLIENT_ENVIRONMENT } from "@/environments/client.environment";
import { APP_ROUTE } from "@/routes/app.route";

const { NEXT_PUBLIC_SITE_URL } = CLIENT_ENVIRONMENT;

interface IGenerateWhatsAppShareLink {
  videoTitle: string;
  slug: string;
}

export const generateWhatsAppShareLink = ({
  videoTitle,
  slug,
}: IGenerateWhatsAppShareLink) =>
  `https://wa.me/?text=${encodeURIComponent(`Olha esse golpe: ${videoTitle} \n${NEXT_PUBLIC_SITE_URL}${APP_ROUTE.FRAUDS.SLUG(slug)}`)}`;
