import { db } from "../server";

export const videoBucket = db().storage.from("videos");
export const thumbnailBucket = db().storage.from("thumbnails");
