// grade/page.tsx

'use client';

import { CardConfidenceVisualizer } from '@/app/ui/dashboard/cards/general/card-confidence';
import { useEffect, useState } from 'react';
import { Card, Spinner } from '@nextui-org/react';
import MyBarChart from '@/app/ui/charts/bar-chart';
import { RiskCard } from '@/app/ui/dashboard/risk-card';
import useMidasStore, { SchoolData } from '@/hooks/useSchoolData';
import { calculateModeConfidence, calculateOccurancePercentages, calculateRiskByDemographic, calculateRiskPercentages, calculateTestRiskPercentages } from '@/action/calculateRiskStatistics';
import GradeSearch from '@/app/ui/dashboard/cards/search/grade-search-card';
import { GetGradeOptions } from '@/action/getGradeOptions';
import { GetClassroomOptions } from '@/action/getClassroomOptions';
import { getSession } from 'next-auth/react';
import MidasBarChart from '@/app/ui/charts/midas-bars';


export default function Page() {
  // Hook into midas data global context
  const midasStore = useMidasStore();

  // Get school ID from current user session
  const [schoolid, setSchoolid] = useState<number>(0);

  // Initialize states - empty array of school-wide and grade-level data (each object is a student)
  const [gradeData, setGradeData] = useState<SchoolData[]>([]);
  const [schoolData, setSchoolData] = useState<SchoolData[]>([]);

  // todo)) Add check for if there are no grades available
  const [gradeSearch, setGradeSearch] = useState<number>(GetGradeOptions(schoolData!)[0]);


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



  // useEffect to populate the gradeData state derived from the schoolData state
  // Dependencies: midasStore, schoolData, schoolid, selectedClass
  useEffect(() => {
    if (schoolData.length === 0) return; // Wait until schoolData is loaded

    // If gradeSearch is undefined, set it to the first available grade
    if (gradeSearch === undefined) {
      const availableGrades = GetGradeOptions(schoolData);
      if (availableGrades.length > 0) {
        setGradeSearch(availableGrades[0]);
      }
    }

    // Fetch grade-specific data when gradeSearch is available
    console.log(`DEBUG: ${schoolid} ${gradeSearch}`)
    const grade = midasStore.getStudentsByGradeLevel(schoolid, gradeSearch);
    console.log("Grade search:", gradeSearch);
    console.log("Loaded grade level student data:", grade);

    setGradeData(grade);
  }, [midasStore, schoolData, schoolid, gradeSearch]);



  // This object is what all of the components on the dashboard reads from.
  // It contains all of the calculated values and is ready to be displayed.
  const dashboardData: DashboardData = {
    midasRiskPercentages: calculateRiskPercentages(gradeData!, 'midas'),
    teacherRiskPercentages: calculateRiskPercentages(gradeData!, 'teacher'),
    studentRiskPercentages: calculateRiskPercentages(gradeData!, 'student'),

    midasConfidence: calculateModeConfidence(gradeData!, 'midas'), // example value

    odrPercentages: calculateOccurancePercentages(gradeData!, 'odr_f'),
    suspPercentages: calculateOccurancePercentages(gradeData!, 'susp_f'),

    mathPercentages: calculateTestRiskPercentages(gradeData!, 'math_f'),
    readPercentages: calculateTestRiskPercentages(gradeData!, 'read_f'),


    // These risk objects can be expanded if we need more categories
    ethnicityRiskPercentages: {
      white: calculateRiskByDemographic(gradeData!, 'midas', 'ethnicity', 'white'),
      hispanic: calculateRiskByDemographic(gradeData!, 'midas', 'ethnicity', 'hispanic'),
      other: calculateRiskByDemographic(gradeData!, 'midas', 'ethnicity', 'other_poc'),
    },
    ellRiskPercentages: {
      ell: calculateRiskByDemographic(gradeData!, 'midas', 'ell', 'true'),
      nonEll: calculateRiskByDemographic(gradeData!, 'midas', 'ell', 'false'),
    },
    genderRiskPercentages: {
      male: calculateRiskByDemographic(gradeData!, 'midas', 'gender', 'male'),
      female: calculateRiskByDemographic(gradeData!, 'midas', 'gender', 'female'),
    },
  };


  if (!dashboardData.midasConfidence) {
    return (
      <main className="flex w-full h-full items-center justify-center">
        <Spinner />
      </main>
    )
  }


  return (
    <main
      className="
      h-[100vh] lg:max-h-[95vh] 
      grid gap-4 
      grid-cols-1 md:grid-cols-2 lg:grid-cols-4 
      grid-rows-none max-lg:grid-rows-1 md:grid-rows-6 max-md:grid-rows-none
    "
    >
      <GradeSearch
        selectedGrade={gradeSearch}
        setSelectedGrade={setGradeSearch}
        gradeList={GetGradeOptions(schoolData!)}
        classList={GetClassroomOptions(gradeData!)}
        className="flex max-md:row-span-4"
      />

      <Card
        className="
        row-span-4 md:col-span-3 
        max-md:row-span-8 max-md:order-2
        rounded-xl bg-neutral-50 pb-4
      "
      >
        <p className={`-mb-8 p-2 text-xl lg:text-3xl font-medium font-nunito`}>MIDAS Risk Scores</p>
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
            tooltipContent: 'Math test risk scores',
          },
          {
            name: 'Reading',
            values: [dashboardData.mathPercentages.low, dashboardData.mathPercentages.some, dashboardData.mathPercentages.high],
            labels: ['Low', 'Some', 'High'],
            tooltipContent: 'Reading test risk scores',
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
    </main >
  );
}
