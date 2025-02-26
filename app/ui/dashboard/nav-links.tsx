'use client';

import {
  UserGroupIcon,
  HomeIcon,
  AcademicCapIcon,
  UserIcon,
  ArrowUpTrayIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import clsx from 'clsx';
import { Input, useDisclosure } from '@nextui-org/react';
import { useContext, } from 'react';
import {
  SearchContext,
} from '@/app/context/navSearchContext';
import React from 'react';
import FileModal from '../modals/fileModal';

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  { name: 'School', href: '/dashboard/school', icon: HomeIcon },

  { name: 'Grade', href: '/dashboard/grade', icon: AcademicCapIcon },

  { name: 'Classroom', href: '/dashboard/classroom', icon: UserGroupIcon },

  { name: 'Student', href: '/dashboard/student', icon: UserIcon },

  {
    name: 'Upload',
    href: '',
    icon: ArrowUpTrayIcon,
  },
];

const NavSearchBox: React.FC<{ href: string }> = ({ href }) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const placeholders = {
    '/dashboard/school': 'Enter school ID',
    '/dashboard/grade': 'Enter grade level',
    '/dashboard/classroom': 'Enter classroom ID',
    '/dashboard/student': 'Enter student ID',
  };

  const formNames = {
    '/dashboard/school': 'schoolId',
    '/dashboard/grade': 'gradeId',
    '/dashboard/classroom': 'classroomId',
    '/dashboard/student': 'studentId',
  };

  const { school, grade, classroom, student } = useContext(SearchContext);

  // const sidenavContext = useContext(SidenavSearchContext);

  const SearchAction = async (formData: FormData) => {
    console.log('Searching...');
    if (href === '/dashboard/school') {
      const id = formData.get('schoolId') || '';
      school[1](id.toString());
      console.log('Searched school ' + id);
    } else if (href === '/dashboard/grade') {
      const id = formData.get('gradeId') || '';
      grade[1](id.toString().toUpperCase());
      console.log('Searched grade ' + id);
    } else if (href === '/dashboard/classroom') {
      const id = formData.get('classroomId') || '';
      classroom[1](id.toString().toUpperCase());
      console.log('Searched classroom ' + id);
    } else {
      const id = formData.get('studentId') || '';
      student[1](id.toString().toUpperCase());
      console.log('Searched student ' + student[0]);
    }
  };

  if (pathname === href) {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target as HTMLFormElement);
          SearchAction(formData);
        }}
      >
        <Input
          type="text"
          variant="bordered"
          name={formNames[pathname as keyof typeof formNames]}
          placeholder={placeholders[pathname as keyof typeof placeholders]}
          className="mb-4 h-8 max-md:hidden"
        />
      </form>
    );
  }

  return null;
};

function NavLinks({ collapsed }: { collapsed: boolean }) {
  const pathname = usePathname();
  const { isOpen: isOpenFile, onOpen: onOpenFile, onOpenChange: onOpenChangeFile } = useDisclosure();

  return (
    <>
      <FileModal isOpen={isOpenFile} onOpen={onOpenFile} onOpenChange={onOpenChangeFile} />
      {links.map((link, index) => {
        const LinkIcon = link.icon;
        const isActive = pathname === link.href;

        return link.href ? (<div key={link.name}>
          <Link
            href={link.href}
            className={clsx(
              'sidenav-navlink-button',
              { 'bg-green-100 text-green-600': isActive }
            )}
          >
            <LinkIcon key={index} className='sidenav-navlink-icon' />

            <div
              className={clsx(
                'hidden md:block transition-opacity duration-100 ease-in-out ml-auto mr-0',
                {
                  'opacity-0': collapsed,
                  'opacity-100 delay-100': !collapsed, // Delay text appearance to match background transition
                }
              )}
            >
              {!collapsed && link.name}
            </div>
          </Link>
        </div>
        ) : (
          <></>
        );
      })}
    </>
  );
}

// export default NavLinks;

const MemoizedNavLinks = React.memo(NavLinks);

export default MemoizedNavLinks
