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
import SimpleLineIconsMagnifier from "@/app/ui/icons/SimpleLineIconsMagnifier";
const nunito = Nunito({weight: ['200', '200'], subsets:['latin'], style: ['normal', 'italic']})

export default function ClassSearchInputOnly({
  selectedClass,
  setSelectedClass
}: {
  selectedClass: string;
  setSelectedClass : React.Dispatch<React.SetStateAction<string>>;
}) {
  const SearchAction = async (formData: FormData) => {
    const id = formData.get('classroomId') || ""
    setSelectedClass(id.toString().toUpperCase())
  }

  return (
    <Card className="bg-neutral-100" shadow='md'>
        <CardBody className='flex flex-row w-full'>
          <div className='flex flex-row basis-full w-full'>
            <form className="flex flex-row w-full" action={SearchAction}>
              <div className='flex w-full'>
                <Input name="classroomId" placeholder="Enter classroom ID" variant="underlined"/>
                <Button className='min-w-fit' variant="flat" type="submit" >
                  <SimpleLineIconsMagnifier/>
                </Button>
              </div>
            </form>
          </div>
        </CardBody>
      </Card>
  );
}