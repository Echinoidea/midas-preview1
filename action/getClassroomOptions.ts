import { SchoolData } from "@/hooks/useSchoolData";

export function GetClassroomOptions(students: SchoolData[]): string[] {
  return Array.from(new Set(students.map(student => student.classroom)));
}
