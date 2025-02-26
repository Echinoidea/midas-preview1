/**
 * Tech support form modal
 * @since 2024-07-22
 */

'use client';

import { Nunito } from "next/font/google";
const nunito = Nunito({weight: ['200', '200'], subsets:['latin'], style: ['normal', 'italic']})

import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Textarea} from "@nextui-org/react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";


export default function SupportModal({
  isOpen,
  onOpen,
  onOpenChange
}: {
  isOpen: boolean,
  onOpen: any,
  onOpenChange: any,
}) {

  //#region Input validation
  const [ emailValue, setEmailValue] = useState("");
  const [ nameValue, setNameValue ] = useState("");
  const [ descriptionValue, setDescriptionValue ] = useState("");

  const validateEmail = (value: string) => value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i);
  const isEmailInvalid = useMemo(() => {
    if (emailValue === "") return true;

    return validateEmail(emailValue) ? false : true;
  }, [emailValue]);

  const isNameInvalid = useMemo(() => {
    return nameValue === "";
  }, [nameValue]);

  const isDescriptionInvalid = useMemo(() => {
    return descriptionValue === "";
  }, [descriptionValue]);

  const [ submitButtonDisabled, setSubmitButtonDisabled ] = useState(false);
  useEffect(() => {
    setSubmitButtonDisabled(isEmailInvalid || isNameInvalid || isDescriptionInvalid)
  }, [isEmailInvalid, isNameInvalid, isDescriptionInvalid])
  //#endregion

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isEmailInvalid || isNameInvalid || isDescriptionInvalid) {
      toast.error("One or more fields are invalid!")
      return
    }

    try {
      const response = await fetch('/api/send/support', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emailFormat: {
            receiver: emailValue,
            name: nameValue,
            description: descriptionValue
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error:', errorData);
        toast.error("Error sending support request email : " + errorData)
      } else {
        const data = await response.json();
        console.log('Success:', data);
        toast.success("Support request sent!")
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error("Error sending support request email : " + error)
    }
  };

  return (
    <Modal className={nunito.className} isOpen={isOpen} onOpenChange={onOpenChange} scrollBehavior='inside'>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Contact Technical Support
            </ModalHeader>

            <ModalBody>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
                <Input 
                  label='Your email' 
                  name='email' 
                  isInvalid={isEmailInvalid}
                  onValueChange={setEmailValue}
                  errorMessage="Please enter a valid email"
                  required
                />

                <Input 
                  label='Name or Organization' 
                  name='name' 
                  isInvalid={isNameInvalid}
                  onValueChange={setNameValue}
                  errorMessage="Please enter a name"
                  required
                />

                <Textarea 
                  label="Issue Description"
                  name="description"
                  isInvalid={isDescriptionInvalid}
                  onValueChange={setDescriptionValue}
                  errorMessage="Please enter a description of the issue"
                  required
                />

                <Button type='submit' color="success" variant="faded" isDisabled={submitButtonDisabled}>
                  Submit Issue
                </Button>
              </form>
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