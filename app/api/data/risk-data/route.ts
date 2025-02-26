/**
 * API endpoint for getting data from the risk table.
 * @author Gabriel Hooks
 * @since 2024-10-05
 */
import { authOptions } from "@/lib/auth";
import { createClient } from "@supabase/supabase-js";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

const supabaseUrl = 'https://kalbwmivszjzlnepcebm.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey!);

/**
 * Fetch risk data from public.schooldata_join_risk
 * Columns: id(riskId), factor(student, teacher, midas), risklevel, confidence, schoolId, studentId
 */
async function FetchRiskData(schoolId: number) {
  const { data, error } = await supabase
    .from('schooldata_join_risk')
    .select()
    .eq('school_id', schoolId)
    .limit(1000000);

  if (error) {
    console.log(error);
  }
  else {
    console.log("Successfully fetched risk data rows");
    console.log(data);
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

    const data = await FetchRiskData(Number(schoolId));
    return NextResponse.json({ data }, { status: 200 });
  }
  catch (error) {
    return NextResponse.json({ error: "Failed to fetch school data." }, { status: 500 });
  }
}
