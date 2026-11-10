import { APP_ROUTE } from "@/routes/app.route";
import { AlertHits } from "./components/alert-hits";
import { LastVideos } from "./components/last-videos";
import { ReportCallout } from "./components/report-callout";
import { Articles } from "./components/articles";

export const revalidate = 3600;
export const metadata = { alternates: { canonical: APP_ROUTE.HOME.ROOT } };

export default function Home() {
  return (
    <>
      <AlertHits />

      <ReportCallout />

      <LastVideos />

      <Articles />
    </>
  );
}
