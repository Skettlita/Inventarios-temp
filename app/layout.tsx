import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { LanguageProvider } from '@/components/i18n/LanguageProvider';

export const metadata: Metadata = {
  title: 'Inventory Management System',
  description: 'Modern inventory management solution',
};

export const viewport: Viewport = {
  themeColor: '#1e293b',
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-background">
      <body>
        <AuthProvider>
          <LanguageProvider>{children}</LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}