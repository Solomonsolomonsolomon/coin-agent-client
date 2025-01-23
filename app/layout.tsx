import "./globals.css";
import { Inter } from "next/font/google";
import Header from "./components/Header";
import Providers from "@/app/providers";
import "@suiet/wallet-kit/style.css";
import "./walletCustomCss.css"
import Sidebar from "./components/ui/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`h-[100%] ${inter.className}`}>
        <Providers>
          <Sidebar>
            <div className="m-4">
              <Header />
              <div>{children}</div>
            </div>
          </Sidebar>
        </Providers>
      </body>
    </html>
  );
}
