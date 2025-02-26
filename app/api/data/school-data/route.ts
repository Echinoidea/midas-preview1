/** API endpoint for getting student data from the school table.
 *
 * @author Gabriel Hooks
 * @since 2024-10-05
 */
import { SchoolData } from "@/hooks/useSchoolData";
import { authOptions } from "@/lib/auth";
import { createClient } from "@supabase/supabase-js";
import { warn } from "console";
import { getServerSession } from "next-auth";
import { getSession } from "next-auth/react";
import { NextRequest, NextResponse } from "next/server";
const supabaseUrl = 'https://kalbwmivszjzlnepcebm.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey!);

/**
 * Fetch student data from public.schooldata
 * Includes student demographics, test scores, discplinary action data
 */
async function FetchSchoolData(schoolId: number): Promise<SchoolData[] | undefined> {
  const { data, error } = await supabase
    .from('schooldata')
    .select()
    .eq('school_id', schoolId)

  if (error) {
    console.log(error);
  }
  else {
    console.log("Successfully fetched schooldata rows")
    return data;
  }
}

export async function GET(req: Request): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const schoolId = session.user.school_id;
    //const { searchParams } = new URL(req.url);
    //const param = searchParams.get("school_id");
    //const schoolId = Number(param);

    if (!schoolId) {
      return NextResponse.json({ error: "school_id not found in user session. " }, { status: 400 });
    }

    const data = await FetchSchoolData(Number(schoolId));
    return NextResponse.json({ data }, { status: 200 });
  }
  catch (error) {
    return NextResponse.json({ error: "Failed to fetch school data." }, { status: 500 });
  }
}
