/**
 * Basic modal function to use for tooltips.
 * @since 2024-07-02
 */

'use client';

import { Nunito } from "next/font/google";
const nunito = Nunito({weight: ['200', '200'], subsets:['latin'], style: ['normal', 'italic']})

import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader} from "@nextui-org/react";

export default function TooltipModal({
  isOpen,
  onOpen,
  onOpenChange,
  title,
  content
}: {
  isOpen: boolean,
  onOpen: any,
  onOpenChange: any,
  title: string;
  content: React.ReactNode
}) {
  return (
    <Modal className={nunito.className} isOpen={isOpen} onOpenChange={onOpenChange} scrollBehavior='inside'>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {title}
            </ModalHeader>

            <ModalBody>
              {content}
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