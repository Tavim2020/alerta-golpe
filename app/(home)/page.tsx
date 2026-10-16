import { AlertHits } from "./components/alert-hits";
import { LastVideos } from "./components/last-videos/last-videos.comp";

export const revalidate = 60;
export const metadata = { alternates: { canonical: "/" } };

export default function Home() {
  return (
    <>
      <AlertHits />

      <LastVideos />
    </>
  );
}
