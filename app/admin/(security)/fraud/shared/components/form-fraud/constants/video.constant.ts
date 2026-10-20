const maxVideoMB = 50;

export const videoPropsVerification = {
  mbSize: maxVideoMB,
  maxSize: 1024 * 1024 * maxVideoMB,
  formats: "mp4, webm",
  videosAccepts: ["video/mp4", "video/webm"],
};
