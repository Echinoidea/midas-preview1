'use client';

import React, { useState } from "react";
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Spinner } from "@nextui-org/react";
import Papa from "papaparse";

export default function FileModal({
  isOpen,
  onOpen,
  onOpenChange,
}: {
  isOpen: boolean;
  onOpen: any;
  onOpenChange: any;
}) {
  // Use state to store the selected file.
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isUploadError, setIsUploadError] = useState<boolean>(false);

  // Handler to capture file input changes.
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // Handler for the Upload button.
  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    setIsUploading(true);

    Papa.parse(selectedFile, {
      header: true,
      skipEmptyLines: true,
      complete: async function(results) {
        try {
          const response = await fetch("/api/csv/upload", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(results.data), // Send array of objects
          });
          const result = await response.json();
          console.log(result);

          if (response.ok) {
            console.log("File uploaded successfully.");
            onOpenChange(false);
          } else {
            console.error("Upload failed with status:", response.status);
            setIsUploadError(true);
          }
        } catch (error) {
          console.error("Error uploading file:", error);
          setIsUploadError(true);
        }
      },
    });

    setIsUploading(true);
  };

  return (
    <Modal className="font-nunito" isOpen={isOpen} onOpenChange={onOpenChange} scrollBehavior="inside">
      <ModalContent>
        <ModalHeader>
          <p className="text-base">Upload School Data</p>
        </ModalHeader>

        <ModalBody>
          <p className="font-nunito">
            Please select your Excel (.xlsx) or CSV file containing your student&apos;s data:
          </p>
          <Input type="file" className="mt-8 mb-4" onChange={handleFileChange} />
        </ModalBody>

        <ModalFooter className="w-full flex flex-col justify-center">
          {
            isUploadError &&
            <p className="text-lg text-red-400">Error during file upload</p>
          }

          {
            isUploading &&
            <Spinner />
          }

          {
            !isUploading &&
            <Button color="warning" variant="flat" onPress={handleUpload} disabled={isUploading}>
              Upload
            </Button>
          }
          <p className="italic mt-4">NOTE:</p>
          <ul className="list-disc">
            <li>
              Uploaded data will replace all currently saved data associated with this school.
            </li>
            <li>
              Uploading the file may take up to five minutes.
            </li>
          </ul>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
