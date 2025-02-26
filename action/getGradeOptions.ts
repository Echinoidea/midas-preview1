import { SchoolData } from "@/hooks/useSchoolData";

export function GetGradeOptions(students: SchoolData[]): number[] {
  return Array.from(new Set(students.map(student => student.gradelevel)));
}
