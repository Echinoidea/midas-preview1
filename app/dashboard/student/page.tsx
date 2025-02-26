// student/page.ts

'use client';

import { SetStateAction, useEffect, useState } from 'react';
import useMidasStore, { SchoolData } from '@/hooks/useSchoolData';
import { RiskCard } from '@/app/ui/dashboard/risk-card';
import { MidasRiskScoreTooltip } from '@/app/ui/textblocks/tooltips';
import { RiskCardWithConfidence } from '@/app/ui/dashboard/risk-confidence-card';
import { StudentSearch } from '@/app/ui/dashboard/cards/search/student-search';
import { getSession, useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { Card, Spinner } from '@nextui-org/react';

export default function Page() {


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

  const searchParams = useSearchParams();
  const studentSearchParam = searchParams.get("student");

  const [studentId, setStudentId] = useState<string>(studentSearchParam ?? "");

  const [studentData, setStudentData] = useState<SchoolData | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/individual?student=${studentId}`);
        if (!res.ok) {
          throw new Error(`Error: ${res.status}`);
        }
        const json = await res.json();
        setStudentData(json.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (studentId) {
      fetchStudent();
    }
    setLoading(false);
  }, [studentId]);

  const dashboardData = {
    midasRiskLabel: studentData?.risk?.midas?.risklevel ?? "NA",
    teacherRiskLabel: studentData?.risk?.teacher?.risklevel ?? "NA",
    studentRiskLabel: studentData?.risk?.student?.risklevel ?? "NA",
    midasConfidence: studentData?.risk?.midas?.confidence ?? "NA",
    odrLabel: studentData?.odr_f ?? "NA",
    suspLabel: studentData?.susp_f ?? "NA",
    mathLabel: studentData?.math_f ?? "NA",
    readLabel: studentData?.read_f ?? "NA",
    gradelevel: studentData?.gradelevel ?? 0,
    gender: studentData?.gender ?? "NA",
    ethnicity: studentData?.ethnicity ?? "NA",
    ell: studentData?.ell ?? "NA"
  };

  if (!dashboardData.midasConfidence || loading) {
    return (
      <main className="flex w-full h-full items-center justify-center">
        <Spinner />
      </main>
    )
  }

  return (
    <main className="grid gap-4 grid-cols-1 md:grid-cols-2 p-4">
      <div className="md:col-span-2 ">
        <StudentSearch
          selectedStudent={studentId}
          setSelectedStudent={setStudentId}
          data={{
            gradeLevel: dashboardData.gradelevel.toString(),
            gender: dashboardData.gender,
            ethnicity: dashboardData.ethnicity,
            ell: dashboardData.ell
          }}
          studentList={schoolData.map(student => student.studentid)}
        />
      </div>

      {/* Risk Overview Cards */}
      <div className="md:col-span-2 lg:col-span-3 grid gap-4 grid-cols-1 md:grid-cols-3">
        <RiskCardWithConfidence
          title="MIDAS Risk"
          assessments={[
            {
              name: '',
              values: [dashboardData.midasRiskLabel],
              labels: [],
              tooltipContent: MidasRiskScoreTooltip()
            }
          ]}
          confidence={dashboardData.midasConfidence}
        />
        <RiskCard
          title="Teacher Risk"
          assessments={[
            {
              name: '',
              values: [dashboardData.teacherRiskLabel],
              labels: [],
              tooltipContent: 'Sub risk'
            }
          ]}
        />
        <RiskCard
          title="Student Risk"
          assessments={[
            {
              name: '',
              values: [dashboardData.studentRiskLabel],
              labels: [],
              tooltipContent: 'Sub risk'
            }
          ]}
          className="-px-8"
        />
      </div>

      {/* Discipline and Test Scores */}
      <div className="md:col-span-2 lg:col-span-2 grid gap-4 grid-cols-1 md:grid-cols-2">
        <RiskCard
          title="Discipline Summary"
          assessments={[
            {
              name: 'Office Discipline Referrals',
              values: [dashboardData.odrLabel.toLowerCase() == "true" ? "One +" : "Zero"],
              labels: [],
              tooltipContent: 'ODR'
            },
            {
              name: 'Suspensions',
              values: [dashboardData.suspLabel.toLowerCase() == "true" ? "One +" : "Zero"],
              labels: [],
              tooltipContent: 'Suspensions'
            }
          ]}
        />
        <RiskCard
          title="Test Risk Scores"
          assessments={[
            {
              name: 'Math',
              values: [dashboardData.mathLabel],
              labels: [],
              tooltipContent: 'Math test risk scores'
            },
            {
              name: 'Reading',
              values: [dashboardData.readLabel],
              labels: [],
              tooltipContent: 'Reading test risk scores'
            }
          ]}
        />
      </div>
    </main>
  );
}
