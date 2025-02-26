'use client';

import NavLinks from '@/app/ui/dashboard/nav-links';
import MidasLogoNoText from '@/app/ui/midas-logo-no-text';
import { PowerIcon, QuestionMarkCircleIcon, ArrowUpIcon } from '@heroicons/react/24/outline';
import ConfirmSignoutModal from '../modals/confirm-signout';
import { useDisclosure } from '@nextui-org/react';
import { useState } from 'react';
import clsx from 'clsx';
import SupportModal from '../modals/tech-support';
import useFileModal from '@/hooks/useFileModal';
import FileModal from '../modals/fileModal';


export default function SideNav() {
  const { isOpen: isOpenSignout, onOpen: onOpenSignout, onOpenChange: onOpenChangeSignout } = useDisclosure();
  const { isOpen: isOpenSupport, onOpen: onOpenSupport, onOpenChange: onOpenChangeSupport } = useDisclosure();
  const { isOpen: isOpenFile, onOpen: onOpenFile, onOpenChange: onOpenChangeFile } = useDisclosure();

  const [collapsed, setCollapsed] = useState(true);

  const handleHoverStart = () => {
    setCollapsed(false);
  }

  const handleHoverEnd = () => {
    setCollapsed(true);
  }


  return (
    < div className={
      clsx("flex sm:h-full flex-col px-3 py-4 md:px-2 bg-zinc-50 sm:transition-all sm:duration-100 rounded-md shadow-md",
        {
          'w-16': collapsed,
          'w-40': !collapsed,
        },
      )
    }
      onMouseEnter={handleHoverStart}
      onMouseLeave={handleHoverEnd}
    >
      <FileModal isOpen={isOpenFile} onOpen={onOpenFile} onOpenChange={onOpenChangeFile} />
      <ConfirmSignoutModal isOpen={isOpenSignout} onOpen={onOpenSignout} onOpenChange={onOpenChangeSignout} />
      <SupportModal isOpen={isOpenSupport} onOpen={onOpenSupport} onOpenChange={onOpenChangeSupport} />
      <div
        className="mb-2 flex h-20 items-center justify-center rounded-md bg-gray-50 max-md:hidden md:h-24"
      >
        <div className="w-32 text-white md:w-40 max-md:hidden">
          <MidasLogoNoText />
        </div>
      </div>

      <div className="flex flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2 ">
        <NavLinks collapsed={collapsed} />

        {/* <div className="hidden h-full w-full grow rounded-md bg-gray-50 md:block"></div> */}

        <div className='flex flex-row md:flex-col mt-auto mb-0'>

          <button
            onClick={onOpenFile}
            className='sidenav-navlink-button'
          >
            <ArrowUpIcon className='sidenav-navlink-icon ' />
            <div
              className={clsx(
                'hidden md:block transition-opacity duration-100 ease-in-out ml-auto mr-0',
                {
                  'opacity-0': collapsed,
                  'opacity-100 delay-100': !collapsed, // Delay text appearance to match background transition
                }
              )}
            >
              Upload
            </div>
          </button>

          <button
            onClick={onOpenSupport}
            className='sidenav-navlink-button'
          >
            < QuestionMarkCircleIcon className='sidenav-navlink-icon' />
            <div
              className={clsx(
                'hidden md:block transition-opacity duration-100 ease-in-out ml-auto mr-0',
                {
                  'opacity-0': collapsed,
                  'opacity-100 delay-100': !collapsed, // Delay text appearance to match background transition
                }
              )}
            >
              Support
            </div>
          </button>

          <button
            onClick={onOpenSignout}
            className='sidenav-navlink-button'
          >
            <PowerIcon className='sidenav-navlink-icon' />
            <div
              className={clsx(
                'hidden md:block transition-opacity duration-100 ease-in-out ml-auto mr-0',
                {
                  'opacity-0': collapsed,
                  'opacity-100 delay-100': !collapsed, // Delay text appearance to match background transition
                }
              )}
            >
              Signout
            </div>
          </button>
        </div>
      </div>
    </div >
  );
}
