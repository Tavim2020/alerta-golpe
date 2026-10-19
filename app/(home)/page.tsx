import { APP_ROUTE } from "@/routes/app.route";
import { AlertHits } from "./components/alert-hits";
import { LastVideos } from "./components/last-videos";

export const revalidate = 3600;
export const metadata = { alternates: { canonical: APP_ROUTE.HOME.ROOT } };

export default function Home() {
  return (
    <>
      <AlertHits />

      <LastVideos />
    </>
  );
}
