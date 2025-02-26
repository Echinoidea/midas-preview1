'use client';

import { Nunito } from "next/font/google";
const nunito = Nunito({ weight: ['200', '200'], subsets: ['latin'], style: ['normal', 'italic'] })

import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react";
import { FormEvent, useState } from "react";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function RegisterModal({
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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    console.log("About to fetch POST");
    console.log(`${formData.get("email")} ${formData.get("username")} ${formData.get("password")} ${Number(formData.get("schoolId"))}`);
    const response = await fetch('/api/auth/register', {
      method: "POST",
      body: JSON.stringify({
        email: formData.get("email"),
        username: formData.get("username"),
        password: formData.get("password"),
        schoolId: formData.get("schoolId")
      }),
    });

    // Toast success or error registration status
    if (response.ok) {
      toast.success("Successfully registered!")

      const loginRedirectResponse = await signIn('credentials', {
        username: formData.get('username'),
        password: formData.get('password'),
        redirect: false
      });

      if (!loginRedirectResponse?.error) {
        router.push('/dashboard/school');
        router.refresh();
      }
      else {
        toast.error("There was an error while trying to log you in after registration. Try the login button, if the error persists, please contact support.")
      }
    }
    else {
      toast.error("Account registration failed. Status: " + response.status + ", Status text: " + response.statusText + ". Please contact support from the home page.")
    }
  };

  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <Modal className={nunito.className} isOpen={isOpen} onOpenChange={onOpenChange} scrollBehavior='inside'>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Register new account
            </ModalHeader>

            <ModalBody>
              <div className='flex justify-center'>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
                  <Input label='Email' name='email' required={true} />
                  <Input label='Username' name='username' required={true} />
                  <Input
                    label='Password'
                    name='password'
                    type={isVisible ? "text" : "password"}
                    required
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
                  <Input label='School ID' name='schoolId' required={true} />
                  <Button type='submit' color="success" variant="faded" onPress={onClose}>
                    Register!
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
