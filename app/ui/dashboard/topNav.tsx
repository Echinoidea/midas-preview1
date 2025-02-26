'use client';

import Link from 'next/link';
import ConfirmSignoutModal from '../modals/confirm-signout';
import { useDisclosure } from '@nextui-org/react';
import clsx from 'clsx';
import SupportModal from '../modals/tech-support';

import {
  UserGroupIcon,
  HomeIcon,
  AcademicCapIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import { usePathname } from 'next/navigation';

const links = [
  { name: 'School', href: '/dashboard/school', icon: HomeIcon },

  { name: 'Grade', href: '/dashboard/grade', icon: AcademicCapIcon },

  { name: 'Classroom', href: '/dashboard/classroom', icon: UserGroupIcon },

  { name: 'Student', href: '/dashboard/student', icon: UserIcon },
];

/**
 * Navigation bar at the top of the screen for mobile view.
 * Use in layout.tsx
 *
 * Does not include file upload button because it requires drag-and-drop currently, does not have a native file 
 * selector menu, and also is formatted differently. Let's assume that people on their phones are just trying
 * to show someone something from the website. Lol.
 *
 * If you need it to have file uploading on phones too, that's fine. The FileModal file needs to be updated to 
 * bring up the file selector default program by the browser or OS
 */
export default function TopNav() {
  const { isOpen: isOpenSignout, onOpen: onOpenSignout, onOpenChange: onOpenChangeSignout } = useDisclosure();
  const { isOpen: isOpenSupport, onOpen: onOpenSupport, onOpenChange: onOpenChangeSupport } = useDisclosure();

  const pathname = usePathname();

  return (
    < div className="flex flex-row bg-zinc-50 rounded-md shadow-md">
      <ConfirmSignoutModal isOpen={isOpenSignout} onOpen={onOpenSignout} onOpenChange={onOpenChangeSignout} />
      <SupportModal isOpen={isOpenSupport} onOpen={onOpenSupport} onOpenChange={onOpenChangeSupport} />

      {
        links.map((link, index) => {
          const LinkIcon = link.icon;
          const isActive = pathname === link.href;

          return (

            <Link
              key={index}
              href={link.href}
              className={clsx(
                'sidenav-navlink-button',
                { 'bg-green-100 text-green-600': isActive }
              )}
            >

              <LinkIcon className='sidenav-navlink-icon' />
            </Link>
          );
        })
      }
    </div >
  );
}
