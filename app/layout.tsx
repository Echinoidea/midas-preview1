import '@/app/ui/global.css';
import { nunito } from './ui/fonts';
import CaptureScreenshotButton from './ui/CaptureScreenshotButton';
import ModalProvider from '@/providers/ModalProvider';
import { getServerSession } from 'next-auth';
import ToasterProvider from '@/providers/ToastProvider';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();
  console.log({session})
  return (
    
    <html lang="en">
      <body className={`${nunito.className} antialiased`}>
        <ModalProvider />
        <ToasterProvider />
        <div>{children}</div>
      </body>
    </html>
  );
}
