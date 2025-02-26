
/**
 * This file contains api functions regarding downloading and loading school data from Supabase on
 * user login. Will also be used during batch export to CSV.
 *
 * @author Gabriel Hooks
 * @since <2025-02-19 Wed>
 */


// app/api/students/route.ts
// app/api/students/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth'; // adjust path as needed
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.school_id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const schoolId = Number(session.user.school_id);

  try {
    // Include the risk relations in the query
    const students = await prisma.student.findMany({
      where: { schoolId },
      include: {
        midasRisk: true,
        teacherRisk: true,
        studentRisk: true,
      },
    });

    // Helper function to transform a risk record into your expected shape.
    const transformRisk = (risk: any) => {
      if (!risk) return { risklevel: "", confidence: "" };
      return {
        risklevel: risk.riskLevel.toLowerCase(),
        confidence: risk.confidence.toLowerCase(),
      };
    };

    const transformedStudents = students.map(student => ({
      studentid: student.studentId,           // assuming studentId in Prisma
      schoollevel: student.schoolLevel.toLowerCase(),
      gradelevel: student.gradeLevel,
      classroom: student.classroomId,           // mapping classroomId to classroom
      gender: student.gender.toLowerCase(),
      ethnicity: student.ethnicity.toLowerCase(),
      ell: student.ell.toString(),              // converting boolean to string if needed
      odr_f: student.officeReferrals.toString(),
      susp_f: student.suspensions.toString(),
      math_f: student.mathRisk.toLowerCase(),                 // assuming already in the expected format
      read_f: student.readingRisk.toLowerCase(),
      school_id: student.schoolId,
      risk: {
        midas: transformRisk(student.midasRisk),
        teacher: transformRisk(student.teacherRisk),
        student: transformRisk(student.studentRisk),
      },
    }));

    return NextResponse.json({ data: transformedStudents }, { status: 200 });
  } catch (error) {
    console.error("Error fetching student data:", error);
    return NextResponse.json({ error: 'Failed to fetch student data' }, { status: 500 });
  }
}
