// classroom/page.tsx

'use client';

import { CardConfidenceVisualizer } from '@/app/ui/dashboard/cards/general/card-confidence';
import { useEffect, useState } from 'react';
import { Card } from '@nextui-org/react';
import MyBarChart from '@/app/ui/charts/bar-chart';
import { RiskCard } from '@/app/ui/dashboard/risk-card';
import useMidasStore, { SchoolData } from '@/hooks/useSchoolData';
import {
  calculateModeConfidence,
  calculateOccurancePercentages,
  calculateRiskByDemographic,
  calculateRiskPercentages,
  calculateTestRiskPercentages
} from '@/action/calculateRiskStatistics';
import ClassSearch from '@/app/ui/dashboard/cards/search/class-search-card';
import { GetClassroomOptions } from '@/action/getClassroomOptions';
import { getSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import MidasBarChart from '@/app/ui/charts/midas-bars';

export default function Page() {
  // Hook into midas data global context
  const midasStore = useMidasStore();

  // Get school ID from current user session
  const [schoolid, setSchoolid] = useState<number>(0);

  // Initialize states - empty array of school-wide and class-wide data (each object is a student)
  const [schoolData, setSchoolData] = useState<SchoolData[]>([]);
  const [classData, setClassData] = useState<SchoolData[]>([]);

  // Hook into Next.js search params to get classroom ID URL query
  const searchParams = useSearchParams();
  const classSearchParam = searchParams.get("classroom");

  // Use the classroom ID URL query param to filter schoolData state array to only those with classroomId == classroom ID URL parameter 
  const [selectedClass, setSelectedClass] = useState<string>(classSearchParam !== undefined ?
    classSearchParam! :
    schoolData.map(student => student.classroom)[0]);

  // useEffect hook to set SchoolData state 
  // Dependencies: midasStore, schoolid 
  useEffect(() => {
    const getSchoolId = async () => {
      // NextAuth get current user session 
      let session = await getSession();

      // Get the school_id from the session token
      setSchoolid(session?.user.school_id);
    }

    getSchoolId()

    // use the midasStore global state and get all students loaded in by school ID
    const school = midasStore.getStudentsBySchoolId(schoolid);

    // Set the local school data state 
    setSchoolData(school);
  }, [midasStore, schoolid]);



  // useEffect to populate the classData state derived from the schoolData state
  // Dependencies: midasStore, schoolData, schoolid, selectedClass
  useEffect(() => {
    if (schoolData.length === 0) return; // Wait until schoolData is loaded

    // Assert selectedClass != null|undefined
    if (!selectedClass) {
      const availableClassrooms = GetClassroomOptions(schoolData);
      if (availableClassrooms.length > 0) {
        setSelectedClass(availableClassrooms[0]);
      }
    }

    // set classData state
    const classroom = midasStore.getStudentsByClassroom(schoolid, selectedClass);
    setClassData(classroom);
  }, [midasStore, schoolData, schoolid, selectedClass]);


  // This object is what all of the components on the dashboard reads from.
  // It contains all of the calculated values and is ready to be displayed.
  const dashboardData: DashboardData = {
    midasRiskPercentages: calculateRiskPercentages(classData!, 'midas'),
    teacherRiskPercentages: calculateRiskPercentages(classData!, 'teacher'),
    studentRiskPercentages: calculateRiskPercentages(classData!, 'student'),

    midasConfidence: calculateModeConfidence(classData!, 'midas'),

    odrPercentages: calculateOccurancePercentages(classData!, 'odr_f'),
    suspPercentages: calculateOccurancePercentages(classData!, 'susp_f'),

    mathPercentages: calculateTestRiskPercentages(classData!, 'math_f'),
    readPercentages: calculateTestRiskPercentages(classData!, 'read_f'),

    // These risk objects can be expanded if we need more categories
    ethnicityRiskPercentages: {
      white: calculateRiskByDemographic(classData!, 'midas', 'ethnicity', 'white'),
      hispanic: calculateRiskByDemographic(classData!, 'midas', 'ethnicity', 'hispanic'),
      other: calculateRiskByDemographic(classData!, 'midas', 'ethnicity', 'other_poc'),
    },
    ellRiskPercentages: {
      ell: calculateRiskByDemographic(classData!, 'midas', 'ell', 'true'),
      nonEll: calculateRiskByDemographic(classData!, 'midas', 'ell', 'false'),
    },
    genderRiskPercentages: {
      male: calculateRiskByDemographic(classData!, 'midas', 'gender', 'male'),
      female: calculateRiskByDemographic(classData!, 'midas', 'gender', 'female'),
    },
  };

  // This is a scary and weird layout. I am sorry about the amount of Tailwind grid rules.
  return (
    <main
      className="
      h-[100vh] lg:max-h-[95vh] 
      grid gap-4 
      grid-cols-1 md:grid-cols-2 lg:grid-cols-4 
      grid-rows-none max-lg:grid-rows-1 md:grid-rows-6 max-md:grid-rows-none
    "
    >
      <ClassSearch
        selectedClass={selectedClass}
        setSelectedClass={setSelectedClass}
        classList={GetClassroomOptions(schoolData)}
        studentList={classData.map((student) => student.studentid)}
        className="flex max-md:row-span-4"
      />

      <Card
        className="
        row-span-4 md:col-span-3 
        max-md:row-span-8 max-md:order-2
        rounded-xl bg-neutral-50 pb-4
      "
      >
        <p className="-mb-8 p-2 text-xl lg:text-3xl font-medium font-nunito ">MIDAS Risk Scores</p>
        <MidasBarChart
          midasData={dashboardData.midasRiskPercentages}
          studentData={dashboardData.studentRiskPercentages}
          teacherData={dashboardData.teacherRiskPercentages}
        />
      </Card>

      <CardConfidenceVisualizer
        confidence={dashboardData.midasConfidence?.toUpperCase()!}
        missingVariables={0}
        className="items-center max-md:row-span-4"
      />

      <RiskCard
        title="Discipline Summary"
        assessments={[
          {
            name: 'Office Discipline Referrals',
            values: [dashboardData.odrPercentages.zero, dashboardData.odrPercentages.oneplus],
            labels: ['Zero', 'One +'],
            tooltipContent: 'ODR',
          },
          {
            name: 'Suspensions',
            values: [dashboardData.suspPercentages.zero, dashboardData.suspPercentages.oneplus],
            labels: ['Zero', 'One +'],
            tooltipContent: 'Suspensions',
          },
        ]}
        className="
        row-span-2 
        max-md:row-span-10
      "
      />

      <RiskCard
        title="Test Risk Scores"
        assessments={[
          {
            name: 'Math',
            values: [dashboardData.mathPercentages.low, dashboardData.mathPercentages.some, dashboardData.mathPercentages.high],
            labels: ['Low', 'Some', 'High'],
            tooltipContent: 'ODR',
          },
          {
            name: 'Reading',
            values: [dashboardData.mathPercentages.low, dashboardData.mathPercentages.some, dashboardData.mathPercentages.high],
            labels: ['Low', 'Some', 'High'],
            tooltipContent: '',
          },
        ]}
        className="
        row-span-2 
        max-md:row-span-10
      "
      />

      <Card
        className="
        lg:row-span-2 max-lg:col-span-2 max-md:row-span-3 
        max-md:col-span-1 max-lg:order-last 
        lg:order-6 
        rounded-xl bg-neutral-50
      "
        shadow="md"
      >
        <p className={`-mb-8 p-2 text-xl font-medium font-nunito`}>
          Ethnicity and Risk
        </p>
        <p className={`-mb-8 p-2 font-extralight mt-2 font-nunito`}>
          Distribution of risk for each ethnicity
        </p>
        <div className="mb-0 mt-auto flex h-full flex-col pt-6">
          <MyBarChart data={dashboardData.ethnicityRiskPercentages} />
        </div>
      </Card>

      <Card
        className="
        lg:row-span-2 max-lg:col-span-2 max-md:row-span-3 
        max-md:col-span-1 max-lg:order-last 
        lg:order-7 
        rounded-xl bg-neutral-50
      "
        shadow="md"
      >
        <p className={`-mb-8 p-2 text-xl font-medium font-nunito`}>
          English Learner and Risk
        </p>
        <p className={`-mb-8 p-2 font-extralight mt-2 font-nunito`}>
          Distribution of risk for English fluency status
        </p>
        <div className="mb-0 mt-auto flex h-full flex-col pt-6">
          <MyBarChart data={dashboardData.ellRiskPercentages} />
        </div>
      </Card>

      <Card
        className="
        lg:row-span-2 max-lg:col-span-2 max-md:row-span-10
        max-md:col-span-1 max-lg:order-last 
        lg:order-4 
        rounded-xl bg-neutral-50
      "
        shadow="md"
      >
        <p className={`-mb-8 p-2 text-xl font-medium font-nunito`}>
          Gender and Risk
        </p>
        <p className={`-mb-8 p-2 font-extralight mt-2 font-nunito`}>
          Distribution of risk for each gender
        </p>
        <div className="mb-0 mt-auto flex h-full flex-col pt-6">
          <MyBarChart data={dashboardData.genderRiskPercentages} />
        </div>
      </Card>
    </main>
  );
}
