import { Anton, Public_Sans } from "next/font/google";

export const fontAnton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--f-display",
});

export const fontPublicSans = Public_Sans({
  subsets: ["latin"],
  variable: "--f-body",
});
