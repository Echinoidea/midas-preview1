'use client';

import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Divider,
  Tooltip,
} from '@nextui-org/react';

import { Nunito } from 'next/font/google';
import SimpleLineIconsMagnifier from '@/app/ui/icons/SimpleLineIconsMagnifier';
import { DonutChart } from '@/app/ui/charts/donut-chart';
import { StudentDemographics } from '@/app/types/student-demographics';
import { FormError } from '@/app/ui/form-error';
import { DemographicsType } from '@/app/ui/charts/demographics-type';
import { useEffect, useRef, useState } from 'react';
import { StudentAutocomplete } from '@/app/ui/autocomplete';
import { createPortal } from 'react-dom';
import { Capitalize } from '@/action/capitalize';

const nunito = Nunito({
  weight: ['200', '200'],
  subsets: ['latin'],
  style: ['normal', 'italic'],
});

const genderDataPlaceholder = [
  {
    label: 'Male',
    value: 500,
  },
  {
    label: 'Female',
    value: 548,
  },
];

const ethnicityDataPlaceholder = [
  {
    label: 'White',
    value: 358,
  },
  {
    label: 'Hispanic',
    value: 300,
  },
  {
    label: 'Other POC',
    value: 390,
  },
];

const englishLearnerDataPlaceholder: DemographicsType[] = [
  {
    label: 'Not ELL',
    value: 800,
  },
  {
    label: 'ELL',
    value: 248,
  },
];

function DemographicsBox({
  label,
  content,
}: {
  label: string;
  content: string;
}) {
  return (
    <div className="flex h-full w-full basis-1/4 flex-col items-center justify-center">
      <p className="font-nunito px-2 text-sm">{label}</p>

      <p className="font-nunito mt-2 text-xl">{content}</p>
    </div>
  );
}

function DemographicsRow({
  content,
  className,
}: {
  content: StudentDemographics;
  className?: string;
}) {
  return (
    <div className={`${nunito.className} flex flex-row ${className}`}>
      <DemographicsBox label="Grade" content={content.grade} />

      <Divider orientation="vertical" />

      {/* content.gender && (
        <Tooltip
          className="bg-neutral-100"
          content={
            <div className="h-96 w-96">
              <p className={`font-nunito text-xl`}>
                School Gender demographics
              </p>
              <DonutChart
                data={genderDataPlaceholder}
                colors={['#f87171', '#a5f3fc']}
              />
            </div>
          }
          placement="bottom"
        >
          <div className="basis-1/4">
            <DemographicsBox label="Gender" content={Capitalize(content.gender)} />
          </div>
        </Tooltip>
      )*/}
      <div className="basis-1/4">
        <DemographicsBox label="Gender" content={Capitalize(content.gender)} />
      </div>

      {/* !content.gender && (
        <div className="basis-1/4">
          <DemographicsBox label="Gender" content={Capitalize(content.gender)} />
        </div>
      ) */}

      <Divider orientation="vertical" />

      {/* content.ell && (
        <Tooltip
          className="bg-neutral-100"
          content={
            <div className="h-96 w-96">
              <p className={`${nunito.className} text-xl`}>
                School English-learner demographics
              </p>
              <DonutChart
                data={englishLearnerDataPlaceholder}
                colors={['#a3a3a3', '#4ade80']}
              />
            </div>
          }
          placement="bottom"
        >
        </Tooltip>
      )*/}

      <div className="basis-1/4">
        <DemographicsBox label="English Learner" content={Capitalize(content.ell)} />
      </div>

      {/* !content.ell && (
        <div className="basis-1/4">
          <DemographicsBox label="English Learner" content={Capitalize(content.ell)} />
        </div>
      ) */}

      <Divider orientation="vertical" />

      {/* content.ethnicity && (
        <Tooltip
          className="bg-neutral-100"
          content={
            <div className="h-96 w-96">
              <p className={`${nunito.className} text-xl`}>
                School Ethnicity demographics
              </p>
              <DonutChart
                data={ethnicityDataPlaceholder}
                colors={['#f87171', '#a5f3fc', '#4ade80']}
              />
            </div>
          }
          placement="bottom"
        >
          <div className="basis-1/4">
            <DemographicsBox label="Ethnicity" content={Capitalize(content.ethnicity)} />
          </div>
        </Tooltip>
      )*/}
      <div className="basis-1/4">
        <DemographicsBox label="Ethnicity" content={Capitalize(content.ethnicity)} />
      </div>

      {/* !content.ethnicity && (
        <div className="basis-1/4">
          <DemographicsBox label="Ethnicity" content={Capitalize(content.ethnicity)} />
        </div>
      ) */}
    </div>
  );
}


const PaginatedDropdown = ({ itemsPerPage, allItems, setSelectedStudent }: { itemsPerPage: number, allItems: any, setSelectedStudent: React.Dispatch<React.SetStateAction<string>> }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [paginatedItems, setPaginatedItems] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const totalPages = allItems.length / itemsPerPage;
  useEffect(() => {
    // Calculate the items to display based on the current page
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setPaginatedItems(allItems.slice(startIndex, endIndex));
  }, [currentPage, allItems, itemsPerPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleClickOutside = (event: any) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
      buttonRef.current && !buttonRef.current.contains(event.target)) {
      setIsDropdownOpen(false); // Close dropdown if click is outside both button and dropdown
    }
  };

  useEffect(() => {
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const toggleDropdown = (e: any) => {
    if (!isDropdownOpen) {
      const rect = buttonRef.current!.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
      });
    }
    setIsDropdownOpen(!isDropdownOpen); // Toggle dropdown open/close
  };

  const dropdownContent = (
    <div
      ref={dropdownRef}
      className="absolute w-48 bg-white border shadow-lg z-50"
      style={{ top: dropdownPosition.top, left: dropdownPosition.left }}
    >
      <ul>
        {paginatedItems.map((item, index) => (
          <li
            key={index}
            className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
            onClick={() => {
              setSelectedStudent(item);
              setIsDropdownOpen(false); // Close dropdown after selecting
            }}
          >
            {item}
          </li>
        ))}
      </ul>

      <div className="flex flex-row justify-evenly px-4 py-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`basis-1/3 px-2 py-1 ${currentPage === 1 ? 'text-gray-400' : 'text-blue-500'}`}
        >
          Prev
        </button>
        <span className='text-center basis-1/3'>{currentPage}</span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`basis-1/3 px-2 py-1 ${currentPage === totalPages ? 'text-gray-400' : 'text-blue-500'}`}
        >
          Next
        </button>
      </div>
    </div>
  );

  return (
    <div>
      <button
        ref={buttonRef}
        onClick={toggleDropdown}
        className="px-4 py-2 bg-zinc-200 text-slate-900 rounded text-nowrap"
      >
        List Students
      </button>

      {isDropdownOpen && createPortal(dropdownContent, document.body)}
    </div>
  );
};

export function StudentSearch({
  selectedStudent,
  setSelectedStudent,
  data,
  studentList,
  className
}: {
  selectedStudent: string;
  // Change the type to expect a string setter
  setSelectedStudent: React.Dispatch<React.SetStateAction<string>>;
  data: {
    gradeLevel: string;
    ethnicity: string;
    gender: string;
    ell: string;
  };
  studentList: string[];
  className?: string;
}) {
  const SearchAction = async (formData: FormData) => {
    const id = formData.get('studentId') || '';
    setSelectedStudent(id.toString().toUpperCase());
    console.log({ selectedStudent });
  };

  return (
    <Card className={`${className} bg-neutral-100 pb-1 max-h-64 overflow-hidden`} shadow="md">
      <CardHeader className={nunito.className}>
        <h3 className={`text-lg lg:text-2xl font-extralight  text-slate-800 font-nunito`}>
          Currently viewing student
        </h3>
        &nbsp;
        <span className="font-extrabold font-nunito underline">{selectedStudent}</span>
      </CardHeader>
      <CardBody className={`${nunito.className} -mt-4 flex w-full flex-row overflow-hidden`}>
        <div className="flex w-max basis-full flex-col gap-1">
          <form className="flex w-full flex-row" action={SearchAction}>
            <div className="flex w-full gap-2">
              <StudentAutocomplete options={[]} name={'studentId'} />
              <PaginatedDropdown itemsPerPage={8} allItems={studentList} setSelectedStudent={setSelectedStudent} />

              <Button className="min-w-fit" variant="flat" type="submit">
                <SimpleLineIconsMagnifier />
              </Button>
            </div>
          </form>

          {!data && data !== '' && (
            <FormError message="Student does not exist" />
          )}

          <DemographicsRow
            content={{
              grade: data?.gradeLevel,
              gender: data?.gender,
              ell: data?.ell,
              ethnicity: data?.ethnicity,
            }}
            className="mb-0 mt-auto h-full"
          />
        </div>
      </CardBody>
    </Card>
  );
}
