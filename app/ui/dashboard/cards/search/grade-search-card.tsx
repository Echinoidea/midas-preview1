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
import Link from "next/link";
import { useSearchContext } from "@/app/context/navSearchContext";


/**
 * Card component for use in /app/dashboard/grade/.
 * Contains two search features: grade search and a "go to classroom" dropdown which contains 
 * an array of the classrooms in the currently loaded grade. Using this allows for an alternative and 
 * more direct navigation alternative rather than using the sidebar. 
 *
 * The grade search dropdown takes a gradeList string array which will contain each grade level name in the 
 * currently loaded school. The dropdown simply displays the name of each grade name. On click, it will 
 * update the parent component's 'setSelectedGrade' state method via prop drilling. The parent (the dashboard) 
 * will then be updated accordingly due to the useEffect with the selectedGrade dependency.
 *
 * The student search dropdown maps each dropdown item as a next/link Link with the classroomId URL query param.
 * 
 * @param selectedGrade {string} (Prop drilling) The current grade which is being displayed. This is part of the 
 *  parent's (dashboard) selectedGrade state.
 * @param setSelectedGrade {React.Dispatch<React.SetStateAction<string>>} (Prop drilling) The setSelectedGrade function 
 *  from the parent. This is updated upon clicking on the select grade dropdown menu.
 * @param gradeList {string[]} Array of grade IDs in the currently loaded school. These IDs will be displayed as-is 
 *  in the dropdown menu.
 * @param classList {string[]} Array of classroom IDs in the currently loaded grade. These IDs will be displayed as-is 
 *  in the dropdown menu.
 * @param className {string?} Optional Tailwind className prop which is applied to the outermost <Card> component of this component.
 * @returns JSX.Element
 */
export default function GradeSearch({
  selectedGrade,
  setSelectedGrade,
  gradeList,
  classList,
  className
}: {
  selectedGrade: number;
  setSelectedGrade: React.Dispatch<React.SetStateAction<number>>;
  gradeList: number[];
  classList: string[];
  className?: string;
}) {

  const classContext = useSearchContext('classroom');

  return (
    <Card className={`bg-neutral-100 w-full ${className} font-nunito`} shadow='md'>
      <CardHeader className="font-nunito">
        <h3 className={`text-base 2xl:text-xl font-extralight text-slate-800 font-nunito text-nowrap`}>
          Currently viewing grade
        </h3>
        &nbsp;
        <span className={`font-medium underline text-base xl:text-xl font-nunito`}>
          {selectedGrade}
        </span>
      </CardHeader>
      <CardBody className='flex flex-row justify-center max-w-full gap-2 overflow-hidden'>
        <div className='flex flex-row  min-w-[50%] max-w-[50%]'>
          <Dropdown >
            <DropdownTrigger className='flex w-full h-full items-center'>
              <Button variant="bordered" className={`max-xl:text-[0.6rem] 2xl:text-[1.1rem] font-extralight font-nunito`}>
                Grade {selectedGrade !== 0 ? selectedGrade : "Select grade"}
              </Button>
            </DropdownTrigger>

            <DropdownMenu aria-label="Static Actions">
              {gradeList.map((item, index) => (
                <DropdownItem key={index} onPress={() => setSelectedGrade(item)}>{item}</DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        </div>

        {selectedGrade !== 0 &&
          (<div className='flex flex-row  min-w-[50%]  max-w-[50%]'>
            <Dropdown >
              <DropdownTrigger className='flex w-full  h-full items-center'>
                <Button variant="bordered" className={`max-xl:text-[0.6rem] 2xl:text-[1.1rem] font-extralight font-nunito overflow-hidden`}>
                  Go to Classroom
                </Button>
              </DropdownTrigger>

              <DropdownMenu aria-label="Static Actions">

                {classList.map((classroom: string) => {
                  return (

                    <DropdownItem key={classroom}>
                      <Link
                        key={classroom}
                        href={{
                          pathname: '/dashboard/classroom',
                          query: { classroom },
                        }}
                        onClick={() => { classContext.set(classroom) }}
                      >
                        <div className="w-full">
                          {classroom}
                        </div>

                      </Link>
                    </DropdownItem>

                  );
                })}

              </DropdownMenu>
            </Dropdown>
          </div>)}
      </CardBody>
    </Card >
  );
}
