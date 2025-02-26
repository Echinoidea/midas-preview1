// school/page.tsx

'use client';

import { CardConfidenceVisualizer } from '@/app/ui/dashboard/cards/general/card-confidence';
import { useEffect, useState } from 'react';
import { Card, Spinner } from '@nextui-org/react';
import MyBarChart from '@/app/ui/charts/bar-chart';
import { RiskCard } from '@/app/ui/dashboard/risk-card';
import useMidasStore, { SchoolData } from '@/hooks/useSchoolData';
import { calculateModeConfidence, calculateOccurancePercentages, calculateRiskByDemographic, calculateRiskPercentages, calculateTestRiskPercentages } from '@/action/calculateRiskStatistics';
import { SchoolGreeter } from '@/app/ui/dashboard/cards/school-greeter';
import { getSession } from 'next-auth/react';
import MidasBarChart from '@/app/ui/charts/midas-bars';


export default function Page() {

  // Hook into midas data global context
  const midasStore = useMidasStore();

  // School data state
  const [schoolData, setSchoolData] = useState<SchoolData[]>([]);

  // Get school ID from current user session
  const [schoolid, setSchoolid] = useState<number>(0);


  // useEffect hook to set SchoolData state 
  // Dependencies: midasStore, schoolid 
  useEffect(() => {
    const getSchoolId = async () => {
      let session = await getSession();
      setSchoolid(session?.user.school_id);
    }

    getSchoolId()

    const school = midasStore.getStudentsBySchoolId(schoolid);
    console.log("Student data:", school);

    setSchoolData(school);
  }, [midasStore, schoolid]);

  // This object is what all of the components on the dashboard reads from.
  // It contains all of the calculated values and is ready to be displayed.
  const dashboardData: DashboardData = {
    midasRiskPercentages: calculateRiskPercentages(schoolData!, 'midas'),
    teacherRiskPercentages: calculateRiskPercentages(schoolData!, 'teacher'),
    studentRiskPercentages: calculateRiskPercentages(schoolData!, 'student'),

    midasConfidence: calculateModeConfidence(schoolData!, 'midas'),

    odrPercentages: calculateOccurancePercentages(schoolData!, 'odr_f'),
    suspPercentages: calculateOccurancePercentages(schoolData!, 'susp_f'),

    mathPercentages: calculateTestRiskPercentages(schoolData!, 'math_f'),
    readPercentages: calculateTestRiskPercentages(schoolData!, 'read_f'),


    // These risk objects can be expanded if we need more categories
    ethnicityRiskPercentages: {
      white: calculateRiskByDemographic(schoolData!, 'midas', 'ethnicity', 'white'),
      hispanic: calculateRiskByDemographic(schoolData!, 'midas', 'ethnicity', 'hispanic'),
      other: calculateRiskByDemographic(schoolData!, 'midas', 'ethnicity', 'other_poc'),

    },
    ellRiskPercentages: {
      ell: calculateRiskByDemographic(schoolData!, 'midas', 'ell', 'true'),
      nonEll: calculateRiskByDemographic(schoolData!, 'midas', 'ell', 'false'),
    },
    genderRiskPercentages: {
      male: calculateRiskByDemographic(schoolData!, 'midas', 'gender', 'male'),
      female: calculateRiskByDemographic(schoolData!, 'midas', 'gender', 'female'),
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
      {/* TODO: Add a number of students label in here */}
      <SchoolGreeter schoolId={schoolid} />

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
        confidence={dashboardData.midasConfidence!.toUpperCase()! || "LOW"}
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
        <p className={`-mb-8 p-2 text-xl font-medium font-nunito text-nowrap`}>
          Ethnicity and Risk
        </p>
        <p className={`-mb-8 p-2 font-extralight mt-2 font-nunito text-nowrap`}>
          Risk distribution for each ethnicity
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
        <p className={`-mb-8 p-2 text-xl font-medium font-nunito text-nowrap`}>
          English Learner and Risk
        </p>
        <p className={`-mb-8 p-2 font-extralight mt-2 font-nunito text-nowrap`}>
          Risk distribution for English fluency status
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
        <p className={`-mb-8 p-2 text-xl font-medium font-nunito text-nowrap`}>
          Gender and Risk
        </p>
        <p className={`-mb-8 p-2 font-extralight mt-2 font-nunito text-nowrap`}>
          Risk distribution for each gender
        </p>
        <div className="mb-0 mt-auto flex h-full flex-col pt-6">
          <MyBarChart data={dashboardData.genderRiskPercentages} />
        </div>
      </Card>
    </main>
  );
}
