import { db } from "@/libs/supabase/server";

export const videoBucket = db().storage.from("videos");
export const thumbnailBucket = db().storage.from("thumbnails");
export const articlesThumbnail = db().storage.from("articles_thumbnails");
export const lawyersBucket = db().storage.from("lawyers_photos");
