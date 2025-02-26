'use client';

import { Nunito } from 'next/font/google';
import LoginModal from './ui/modals/login';
import { Button, useDisclosure } from '@nextui-org/react';
import RegisterModal from './ui/modals/register';
import SupportModal from './ui/modals/tech-support';
import Image from 'next/image';
const nunito = Nunito({ weight: ['200', '200'], subsets: ['latin'], style: ['normal', 'italic'] })



function MidasLogo() {
  return (
    <div className={`flex flex-row items-center justify-center leading-none text-white`}>
      <Image
        src="/midas-login-logo.png"
        width={800}
        height={614}
        className="w-3/4"
        alt="midas logo"
      />
    </div>
  );
}

export default function Page() {
  const { isOpen: isOpenLogin, onOpen: onOpenLogin, onOpenChange: onOpenChangeLogin } = useDisclosure();
  const { isOpen: isOpenRegister, onOpen: onOpenRegister, onOpenChange: onOpenChangeRegister } = useDisclosure();
  const { isOpen: isOpenSupport, onOpen: onOpenSupport, onOpenChange: onOpenChangeSupport } = useDisclosure();

  return (
    <main className={`${nunito.className} flex min-h-screen flex-col justify-start items-center p-6 pt-[10%]`}>
      <LoginModal isOpen={isOpenLogin} onOpen={onOpenLogin} onOpenChange={onOpenChangeLogin} />
      <RegisterModal isOpen={isOpenRegister} onOpen={onOpenRegister} onOpenChange={onOpenChangeRegister} />
      <SupportModal isOpen={isOpenSupport} onOpen={onOpenSupport} onOpenChange={onOpenChangeSupport} />

      <div className="flex flex-col gap-4 justify-between items-center w-full">

        <MidasLogo />

        <div className='flex flex-col gap-2  w-1/2 items-center'>

          {/**<p className='text-3xl mb-2'>Welcome to the MIDAS dashboard</p>**/}

          <Button onPress={onOpenLogin} className='w-1/2' variant='flat' color='success'>
            <p className='text-2xl'>Login</p>
          </Button>

          <Button onPress={onOpenRegister} className='w-1/2' variant='flat' color='primary'>
            <p className='text-2xl'>Register</p>
          </Button>

          <Button onPress={onOpenSupport} className='w-1/2' variant='flat' color='secondary'>
            <p className='text-2xl'>Support</p>
          </Button>
        </div>

        <div className="absolute bottom-0 top-auto">
          <div className='flex flex-row w-screen justify-between px-4 pb-4'>
            <div className="flex flex-col basis-1/2 justify-end">
              <p>© Student Mental Health Collaborative 2025</p>
            </div>

            <div className="flex flex-col basis-1/2 items-end">
              <p>
                Project MIDAS:
              </p>
              <p className="text-right">
                Development
                of a Multi-Informant Decisional Assessment System;
              </p>
              <p>
                IES Funding #: R305A210019
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
