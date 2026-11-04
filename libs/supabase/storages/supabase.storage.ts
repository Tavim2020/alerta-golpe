import { db } from "@/libs/supabase/server";

export const videoBucket = db().storage.from("videos");
export const thumbnailBucket = db().storage.from("thumbnails");
export const lawyersBucket = db().storage.from("lawyers_photos");
