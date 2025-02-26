import useMidasStore, { SchoolData } from "@/hooks/useSchoolData";

export async function loadData() {
  try {
    const res = await fetch('/api/students', { credentials: 'include' });
    const json = await res.json();
    console.log("API response:", json);
    const schoolData: SchoolData[] = json.data;
    console.log("schoolData:", schoolData);

    // Directly load the students, which now already include risk data under the risk property.
    useMidasStore.getState().loadStudents(schoolData);
  } catch (error) {
    console.error("Error loading data:", error);
  }
}
