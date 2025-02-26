'use client';
import EmailModal from '@/app/ui/EmailModal';
import React, { useEffect, useState } from 'react';

const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <EmailModal />
    </>
  );
};

export default ModalProvider;
