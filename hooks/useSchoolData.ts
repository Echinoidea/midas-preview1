/**
 * Hook for global schoolData state. Contains student data where user.schoolId == student.school_id.
 */


import { create } from 'zustand';

/**
 * Interface to define the object which describes the main MIDAS risk, student sub-risk, and teacher sub-risk
 */
interface RiskData {
  risklevel: string;
  confidence: string;
}

/**
 * Interface to define the global context which contains all the loaded school data for the user.
 */
export interface SchoolData {
  studentid: string;
  schoollevel: string;
  gradelevel: number;
  classroom: string;
  gender: string;
  ethnicity: string;
  ell: string;
  odr_f: string;
  susp_f: string;
  math_f: string;
  read_f: string;
  school_id: number;
  risk: {
    student?: RiskData;
    teacher?: RiskData;
    midas?: RiskData;
  };
}

/**
 * Private interface to define the content of the useMidasStore context
 */
interface MidasState {
  students: Record<string, SchoolData>;
  loadStudents: (students: SchoolData[]) => void;
  getStudentById: (schoolId: number, studentId: string) => SchoolData[];
  getStudentsBySchoolId: (schoolId: number) => SchoolData[];
  getStudentsByGradeLevel: (schoolId: number, gradelevel: number) => SchoolData[];
  getStudentsByClassroom: (schoolId: number, classroom: string) => SchoolData[];
}

/**
 * Zustand global state to contain all the students in the school and functions regarding it.
 * Contains function like loadStudents, getStudentById, getStudentsBySchoolId, getStudentsByClassroom, getStudentsByGradeLevel
 */
const useMidasStore = create<MidasState>((set, get) => ({
  students: {},

  loadStudents: (students: SchoolData[]) => {
    const studentMap = students.reduce((acc, student) => {
      acc[student.studentid] = student;
      return acc;
    }, {} as Record<string, SchoolData>);

    set({ students: studentMap });
  },

  getStudentById: (schoolId: number, studentId: string) => {
    console.log("Getting students...")
    console.log(get().students)
    return Object.values(get().students).filter(
      student => Number(student.school_id) === Number(schoolId) && String(student.studentid) === String(studentId));
  },

  getStudentsBySchoolId: (schoolId: number) => {
    return Object.values(get().students).filter(student => student.school_id == schoolId);
  },

  getStudentsByGradeLevel: (schoolId: number, gradelevel: number) => {
    return (Object.values(get().students).filter(
      student => student.school_id == schoolId && student.gradelevel == gradelevel
    ));
  },

  getStudentsByClassroom: (schoolId: number, classroom: string) => {
    return Object.values(get().students).filter(
      student => student.school_id == schoolId && student.classroom == classroom
    );
  },
}));

export default useMidasStore;
