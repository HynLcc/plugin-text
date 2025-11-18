import type { Metadata } from "next";
import '@teable/ui-lib/dist/global.shadcn.css';

export const metadata: Metadata = {
  title: 'Todo List',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
