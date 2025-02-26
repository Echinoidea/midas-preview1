'use client';

import { Nunito } from "next/font/google";
const nunito = Nunito({ weight: ['200', '200'], subsets: ['latin'], style: ['normal', 'italic'] })

import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

import { IoIosEye, IoIosEyeOff } from "react-icons/io";


export default function LoginModal({
  isOpen,
  onOpen,
  onOpenChange,
}:
  {
    isOpen: boolean,
    onOpen: any,
    onOpenChange: any,
  }) {
  const router = useRouter();

  // For displaying incorrect login message
  const [incorrectLogin, setIncorrectLogin] = useState(false);

  // Handle login submit button
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Clicked log in");
    const formData = new FormData(e.currentTarget);

    console.log(`!!! Log in form data: ${formData.get('username')} | ${formData.get('password')}`);
    // NextAuth signIn
    const response = await signIn('credentials', {
      username: formData.get('username'),
      password: formData.get('password'),
      redirect: false
    });

    if (response) {
      console.log("Found a response");
    }
    else {
      console.log("Found no response")
    }
    // console.log(await getServerSession())

    // If there was no error in the signIn function, go to dashboard/school
    if (!response?.error) {
      console.log("Routing to /dashboard/school/")
      router.push('/dashboard/school');
      router.refresh();
      setIncorrectLogin(false);
    }
    else {
      console.log("Incorrect login")
      setIncorrectLogin(true);
    }

  };

  // Reset the incorrect password message when updating the inputs
  const handleTextUpdate = () => {
    setIncorrectLogin(false);
  };

  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <Modal className={nunito.className} isOpen={isOpen} onOpenChange={onOpenChange} scrollBehavior='inside'>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Login
            </ModalHeader>

            <ModalBody>
              <div className='flex flex-col justify-center'>
                {incorrectLogin && <p className='text-red-500'>Username or password was incorrect.</p>}
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
                  <Input label='Username' name='username' required onKeyDown={handleTextUpdate} />
                  <Input
                    label='Password'
                    name='password'
                    type={isVisible ? "text" : "password"}
                    required
                    onKeyDown={handleTextUpdate}
                    endContent={
                      <button className="focus:outline-none" type="button" onMouseDown={toggleVisibility} onMouseUp={toggleVisibility} aria-label="toggle password visibility">
                        {isVisible ? (
                          <IoIosEye className="text-2xl text-default-400 pointer-events-none" />
                        ) : (
                          <IoIosEyeOff className="text-2xl text-default-400 pointer-events-none" />
                        )}
                      </button>
                    }
                  />

                  <Button type='submit' color="success" variant="faded">
                    Login
                  </Button>
                </form>
              </div>

            </ModalBody>

            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
