import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import NavBar from "@/components/navbar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";

export const metadata: Metadata = {
  title: "Zwitter",
  description: "A blog project task inspired by reddit",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  const navUser = user
    ? { id: (user as any).id as string, name: (user as any).name as string, email: user.email ?? "", image: user.image ?? "" }
    : undefined;


  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <NavBar user={navUser} />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
