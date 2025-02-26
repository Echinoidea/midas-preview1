import {
  Card,
  CardBody,
  CardHeader,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button
} from "@nextui-org/react";
import { useSearchContext } from "@/app/context/navSearchContext";
import Link from "next/link";


/**
 * Card component for use in /app/dashboard/classroom/.
 * Contains two search features: classroom search and a "go to student" dropdown which contains 
 * an array of the students in the currently loaded classroom. Using this allows for an alternative and 
 * more direct navigation alternative rather than using the sidebar. 
 *
 * The classroom search dropdown takes a classlist string array which will contain each classroom ID in the 
 * currently loaded school. The dropdown simply displays the name of each classroom ID. On click, it will 
 * update the parent component's 'setSelectedClass' state method via prop drilling. The parent (the dashboard) 
 * will then be updated accordingly due to the useEffect with the selectedClass dependency.
 *
 * The student search dropdown maps each dropdown item as a next/link Link with the studentId URL query param.
 * 
 * @param selectedClass {string} (Prop drilling) The current classroomId which is being displayed. This is part of the 
 *  parent's (dashboard) selectedClass state.
 * @param setSelectedClass {React.Dispatch<React.SetStateAction<string>>} (Prop drilling) The setSelectedClass function 
 *  from the parent. This is updated upon clicking on the select classroom dropdown menu.
 * @param classList {string[]} Array of classroom IDs in the currently loaded school. These IDs will be displayed as-is 
 *  in the dropdown menu.
 * @param studentList {string[]} Array of student IDs in the currently loaded classroom. These IDs will be displayed as-is 
 *  in the dropdown menu.
 * @param className {string?} Optional Tailwind className prop which is applied to the outermost <Card> component of this component.
 * @returns JSX.Element
 */
export default function ClassSearch({
  selectedClass,
  setSelectedClass,
  classList,
  studentList,
  className
}: {
  selectedClass: string;
  setSelectedClass: React.Dispatch<React.SetStateAction<string>>;
  classList: string[];
  studentList: string[];
  className?: string;
}) {

  // Use the searchContext student hook to be updated when a student dropdown item is selected.
  const studentContext = useSearchContext('student');

  return (
    <Card className={`bg-neutral-100 ${className} font-nunito`} shadow='md'>
      <CardHeader className="font-nunito">
        <h3 className={`text-base 2xl:text-xl font-extralight  text-slate-800 font-nunito`}>
          Currently viewing classroom
        </h3>
        &nbsp;
        <span className={`font-medium underline 2xl:text-xl font-nunito`}>

          {selectedClass}
        </span>
      </CardHeader>

      <CardBody className='flex flex-row justify-center max-w-full gap-2 overflow-hidden'>
        <div className='flex flex-row  min-w-[50%] max-w-[50%]'>
          <div className='flex w-full h-full'>
            <Dropdown >
              <DropdownTrigger className='flex w-full h-full items-center'>
                <Button variant="bordered" className={`max-xl:text-[0.6rem] 2xl:text-[1.1rem] font-extralight font-nunito`}>
                  Classroom {selectedClass !== "" ? selectedClass : "Select grade"}
                </Button>
              </DropdownTrigger>

              <DropdownMenu aria-label="Static Actions">
                {classList.map((item, index) => (
                  <DropdownItem key={index} onPress={() => setSelectedClass(item)}>{item}</DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>


        {
          // Same logic as above, just also for hiding the student dropdown itself if classroom is not loaded
          selectedClass !== '' &&
          <div className='flex flex-row basis-1/2 w-full'>
            <Dropdown >
              <DropdownTrigger className='flex min-w-full h-full items-center'>
                <Button variant="bordered" className={`max-xl:text-[0.6rem] 2xl:text-[1.1rem] font-extralight font-nunito overflow-hidden`}>
                  Go to Student
                </Button>
              </DropdownTrigger>

              <DropdownMenu aria-label="Static Actions">
                {studentList.map((student: string) => {
                  return (
                    <DropdownItem key={student}>
                      <Link
                        key={student}
                        href={{
                          pathname: '/dashboard/student',
                          query: { student },
                        }}
                        onClick={() => { studentContext.set(student) }}
                      >
                        <div className="w-full">
                          {student}
                        </div>
                      </Link>
                    </DropdownItem>
                  );
                })}
              </DropdownMenu>
            </Dropdown>
          </div>}

      </CardBody>
    </Card>
  );
}
