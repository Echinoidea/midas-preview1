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
import SimpleLineIconsMagnifier from "@/app/ui/icons/SimpleLineIconsMagnifier";
import Link from "next/link";
const nunito = Nunito({ weight: ['200', '200'], subsets: ['latin'], style: ['normal', 'italic'] })

export default function SchoolSearch({
  selectedSchool,
  setSelectedSchool
}: {
  selectedSchool: string;
  setSelectedSchool: React.Dispatch<React.SetStateAction<string>>;
}) {

  const [gradeList, setGradeList] = useState(["8", "7", "6"]);

  const SearchAction = async (formData: FormData) => {
    const id = formData.get('schoolId') || ""
    setSelectedSchool(id.toString())
  }

  return (
    <Card className="bg-neutral-100" shadow='md'>
      <CardHeader className={nunito.className}>
        <h3 className="text-xl font-medium text-slate-800">{selectedSchool == "" ? "Select School" : "Currently Viewing "} </h3>
        &nbsp;<span className="font-extrabold underline">{selectedSchool}</span>

      </CardHeader>
      <CardBody className='flex flex-row'>
        <div className='flex flex-row basis-1/2 w-full'>
          <form className="flex flex-row" action={SearchAction}>
            <div className='flex'>
              <Input name="schoolId" placeholder="Enter school ID" variant="underlined" />
              <Button className='min-w-fit' variant="flat" type="submit" >
                <SimpleLineIconsMagnifier />
              </Button>
            </div>
          </form>

        </div>

        <Divider orientation="vertical" className="mx-2" />

        <div className='flex flex-row basis-1/2 w-full'>
          <Dropdown >
            <DropdownTrigger className='flex min-w-full'>
              <Button
                variant="bordered"
              >
                Go to Grade
              </Button>
            </DropdownTrigger>

            <DropdownMenu aria-label="Static Actions">

              {gradeList.map((grade: string) => {
                return (

                  <DropdownItem key={grade}>
                    <Link
                      key={grade}
                      href={{
                        pathname: '/dashboard/grade',
                        query: { grade },
                      }}
                    >
                      <div className="w-full">
                        {grade}
                      </div>

                    </Link>
                  </DropdownItem>

                );
              })}

            </DropdownMenu>
          </Dropdown>
        </div>
      </CardBody>
    </Card>
  );
}
