'use client';

import SideNav from '@/app/ui/dashboard/sidenav';
import CaptureScreenshotButton from '../ui/CaptureScreenshotButton';
import ToasterProvider from '@/providers/ToastProvider';
import { SearchContextProvider } from '../context/navSearchProvider';
import { Nunito } from 'next/font/google';
import { getSession, SessionProvider } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { loadData } from '@/action/loadData';
import TopNav from '../ui/dashboard/topNav';

const nunito = Nunito({
  weight: ['200', '300'],
  subsets: ['latin'],
  style: ['normal', 'italic'],
});

export default function Layout({ children }: { children: React.ReactNode }) {

  const [schoolId, setSchoolId] = useState<number>(0);

  useEffect(() => {
    const getSchoolId = async () => {
      const session = await getSession();
      const schoolid = session?.user.school_id;
      setSchoolId(schoolid);  // Set the schoolId here
    };
    getSchoolId();
  }, []); // Empty dependency array to run only once on mount

  useEffect(() => {
    console.log(`SCHOOL ID: ${schoolId}`)
    if (schoolId !== null) {
      loadData();  // Only call loadData when schoolId has been set
    }
  }, [schoolId]);


  // State for if screen is tailwind small or less
  const [isSmall, setIsSmall] = useState<boolean>(false);

  // Check screen size on window resize event to display topnav vs sidenav
  useEffect(() => {
    const getScreenSize = () => {
      setIsSmall(window.innerWidth < 768);
    };

    getScreenSize();
    window.addEventListener('resize', getScreenSize);

    return () => {
      window.removeEventListener('resize', getScreenSize);
    }
  }, []);

  return (

    <SearchContextProvider>
      <SessionProvider>
        <div className={`${nunito.className} flex bg-neutral-50 h-screen flex-col md:flex-row md:overflow-hidden`}>
          <div className={`${nunito.className} font-medium md:absolute md:h-screen md:z-20`}>
            {isSmall ? <TopNav /> : <SideNav />}
          </div>

          <div className={`${nunito.className} md:ml-12 flex-grow md:p-6 md:overflow-y-auto`}>
            <ToasterProvider />
            {children}
          </div>

        </div>

      </SessionProvider >
    </SearchContextProvider>
  );
}
