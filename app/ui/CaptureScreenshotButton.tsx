'use client';
import { useState } from 'react';
import html2canvas from 'html2canvas';
import { Button } from './button';
import { CameraIcon } from '@radix-ui/react-icons';
import { error } from 'console';
import useEmailModal from '@/hooks/useEmailModal';

const CaptureScreenshotButton = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const emailModal = useEmailModal();
  const onClick = (img: string) => {
    emailModal.setImage(img);
    return emailModal.onOpen();
  };
  const handleCaptureClick = () => {
    setLoading(true);
    setError(null);
    html2canvas(document.body, {
      useCORS: true,
      scale: window.devicePixelRatio,
      width: window.innerWidth,
      height: window.innerHeight,
    })
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/jpeg');
        setLoading(false);
        const content = imgData.split(',')[1];
        onClick(content);
      })
      .catch((err) => {
        console.error('Error capturing screenshot:', err);
        setError('Failed to capture screenshot. Please try again.');
        setLoading(false);
      });
  };

  return (
    <div className="z-5 absolute bottom-10 right-10">
      <Button
        onClick={handleCaptureClick}
        disabled={loading}
        className="hover:opacity-2"
      >
        {loading ? (
          'Capturing...'
        ) : (
          <div className="flex items-center justify-center">
            {/* <p className=" font-semibold">Screenshot</p> */}
            <CameraIcon width={25} height={25} className=" font-bold" />
          </div>
        )}
      </Button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default CaptureScreenshotButton;
