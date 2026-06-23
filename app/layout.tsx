import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export const metadata: Metadata = {
  title: "Evenly",
  description: "Split expenses, balances, and settlements with calm precision."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#171717",
          colorBackground: "#fbfaf7",
          borderRadius: "1.25rem"
        },
        elements: {
          cardBox: "shadow-none border border-[#e7e0d6]",
          formButtonPrimary: "bg-[#171717] hover:bg-[#171717]/90",
          footerActionLink: "text-[#171717]"
        }
      }}
    >
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
