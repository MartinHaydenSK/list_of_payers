import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import MainNavBar from "./components/nav_bar/main_nav";
import { LoginRegistrationProvider } from "./context/login_registration";
const roboto = Roboto({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Zoznam dlžníkov",
  description: "kto sa so mnou vozí musí platiť",
  icons: {
    icon: "/logo.svg", // relatívna cesta z /public
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sk">
      <body className={`${roboto}`}>
        <LoginRegistrationProvider>
          <MainNavBar />
          {children}
        </LoginRegistrationProvider>
      </body>
    </html>
  );
}
