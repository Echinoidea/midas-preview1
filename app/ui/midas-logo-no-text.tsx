import Image from 'next/image';

export default function MidasLogoNoText() {
  return (
    <div className={`flex flex-row items-center leading-none text-white`}>
      <Image
            src="/midas-logo-no-text.png"
            width={1066}
            height={614}
            className="justify-center align-middle hidden md:block"
            alt="midas logo"
      />
    </div>
  ); 
}
