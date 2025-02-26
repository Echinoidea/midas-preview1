import clsx from "clsx";
import { 
  Card, 
  CardBody, 
  CardHeader, 
  Divider, 
  Input,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem, 
  Button
} from "@nextui-org/react";
import { Nunito } from "next/font/google";
import { useState } from "react";
import Link from "next/link";
const nunito = Nunito({weight: ['200', '200'], subsets:['latin'], style: ['normal', 'italic']})

export default function GradeSearchInputOnly({
  selectedGrade,
  setSelectedGrade,
  gradeList
}: {
  selectedGrade: string;
  setSelectedGrade : React.Dispatch<React.SetStateAction<string>>;
  gradeList: string[]
}) {

  return (
    <Card className="bg-neutral-100 w-full" shadow='md'>
        <CardBody className='flex flex-row'>
          <div className='flex flex-row w-full'>
            <Dropdown >
              <DropdownTrigger className='flex min-w-full'  placeholder="Select grade">
                <Button variant="bordered" >
                  {selectedGrade !== '' ? selectedGrade : "Select grade"}
                </Button>
              </DropdownTrigger>

              <DropdownMenu aria-label="Static Actions">
                {gradeList.map((item, index) => (
                  <DropdownItem key={index} onPress={() => setSelectedGrade(item)}>{item}</DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </div>
        </CardBody>
      </Card>
  );
}