import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Header from "@/components/components/Header";

export const metadata = {
  title: "Cosmic Event Tracker",
  description: "Track near-earth cosmic events",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Header />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
