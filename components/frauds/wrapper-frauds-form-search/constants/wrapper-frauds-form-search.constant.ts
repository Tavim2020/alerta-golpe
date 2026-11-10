import { APP_ROUTE } from "@/routes/app.route";
import { TPagesWithGetAllFrauds } from "../wrapper-frauds-form-search.type";

export const wrapperFraudsConstants: Record<
  TPagesWithGetAllFrauds,
  (searchParams?: string) => string
> = {
  "public-frauds": (searchParams) =>
    APP_ROUTE.FRAUDS.ROOT({ search: searchParams }),
  dashboard: (searchParams) =>
    APP_ROUTE.ADMIN.DASHBOARD.ROOT({ search: searchParams }),
};
