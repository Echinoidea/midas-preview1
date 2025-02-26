// app/api/auth/register/route.ts
import { NextResponse } from "next/server";
import { hash } from "bcrypt";
import prisma from "@/lib/prisma";

/**
 * This route creates a new user in the table.
 * User email and username must be unique
 * User school_id must be available in the school table. This prevents pointing to non-existant schools.
 */
export async function POST(request: Request) {
  try {
    const reqData = await request.json();
    console.log("Received data:", reqData);

    // Destructure using the same key as sent by the client.
    const { email, username, password, schoolId } = reqData;

    // Basic validation for required fields.
    if (!email || !username || !password) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Convert schoolid to a number.
    const schoolIdNumber = Number(schoolId);

    // Validate that a school with this id exists.
    const schoolExists = await prisma.school.findUnique({
      where: { id: schoolIdNumber },
    });
    if (!schoolExists) {
      return NextResponse.json(
        { message: `Invalid school id: ${schoolIdNumber} does not exist.` },
        { status: 400 }
      );
    }

    // Optionally check for an existing user.
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        username,
        hashedPassword,
        schoolId: schoolIdNumber,
      },
    });

    return NextResponse.json({ message: "SUCCESS", user: newUser });
  } catch (e: any) {
    console.error("Registration error:", e);
    return NextResponse.json(
      { message: "ERROR", error: e.message || e.toString() },
      { status: 500 }
    );
  }
}
