/**
 * This file contains api functions regarding downloading and loading school data from Supabase on 
 * user login. Will also be used during batch export to CSV.
 *
 * @author Gabriel Hooks
 * @since <2025-02-19 Wed>
 */


import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// Initialize Prisma client
const prisma = new PrismaClient();

export async function GET(request: Request, { params }: { params: { schoolId: string } }) {
  const { schoolId } = params;

  if (!schoolId) {
    return NextResponse.json({ error: 'Invalid school ID' }, { status: 400 });
  }

  try {
    // Fetch students for the given school ID
    const students = await prisma.student.findMany({
      where: {
        schoolId: Number(schoolId),
      },
    });

    // Send the fetched students as a response
    return NextResponse.json(students, { status: 200 });

  } catch (error) {
    console.error('Error fetching student data:', error);
    return NextResponse.json({ error: 'Failed to fetch student data' }, { status: 500 });
  }
}
