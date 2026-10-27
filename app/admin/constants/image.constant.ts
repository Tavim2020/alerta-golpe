const maxImageMB = 3;

export const imagePropsVerification = {
  mbSize: maxImageMB,
  maxSize: 1024 * 1024 * maxImageMB,
  formats: "png, jpg, jpeg",
  imagesAccepts: ["image/png", "image/jpg", "image/jpeg"],
};
