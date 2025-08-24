import { Noto_Sans_Arabic } from "next/font/google";

export const NotoSans = Noto_Sans_Arabic({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-noto-sans",
  subsets: ["arabic"],
});
