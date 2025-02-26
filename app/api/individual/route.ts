// app/api/individual/route.ts

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

  // Extract the student id from the query parameters
  const { searchParams } = new URL(request.url);
  const studentIdParam = searchParams.get('student');
  if (!studentIdParam) {
    return NextResponse.json({ error: 'Missing student id' }, { status: 400 });
  }

  const schoolId = Number(session.user.school_id);

  try {
    // Find the unique student by studentId, including risk relations
    const student = await prisma.student.findUnique({
      where: { studentId: studentIdParam },
      include: {
        midasRisk: true,
        teacherRisk: true,
        studentRisk: true,
      },
    });

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    // Ensure that the student belongs to the authenticated school
    if (student.schoolId !== schoolId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Helper function to transform a risk record into the expected shape
    const transformRisk = (risk: any) => {
      if (!risk) return { risklevel: "", confidence: "" };
      return {
        risklevel: risk.riskLevel.toLowerCase(),
        confidence: risk.confidence.toLowerCase(),
      };
    };

    // Transform the student data to match the expected API shape
    const transformedStudent = {
      studentid: student.studentId,
      schoollevel: student.schoolLevel.toLowerCase(),
      gradelevel: student.gradeLevel,
      classroom: student.classroomId,
      gender: student.gender.toLowerCase(),
      ethnicity: student.ethnicity.toLowerCase(),
      ell: student.ell.toString(),
      odr_f: student.officeReferrals.toString(),
      susp_f: student.suspensions.toString(),
      math_f: student.mathRisk.toLowerCase(),
      read_f: student.readingRisk.toLowerCase(),
      school_id: student.schoolId,
      risk: {
        midas: transformRisk(student.midasRisk),
        teacher: transformRisk(student.teacherRisk),
        student: transformRisk(student.studentRisk),
      },
    };

    return NextResponse.json({ data: transformedStudent }, { status: 200 });
  } catch (error) {
    console.error("Error fetching student data:", error);
    return NextResponse.json({ error: 'Failed to fetch student data' }, { status: 500 });
  }
}
