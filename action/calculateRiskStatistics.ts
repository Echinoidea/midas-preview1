import { SchoolData } from "@/hooks/useSchoolData";

export function calculateRiskPercentages(
  students: SchoolData[],
  riskType: 'midas' | 'student' | 'teacher'
) {
  let lowRisk = 0;
  let someRisk = 0;
  let highRisk = 0;

  const totalStudents = students.length;

  students.forEach(student => {
    const riskLevel = student.risk?.[riskType]?.risklevel;
    if (riskLevel === 'low') lowRisk++;
    if (riskLevel === 'some') someRisk++;
    if (riskLevel === 'high') highRisk++;
  });

  return {
    low: (lowRisk / totalStudents) * 100,
    some: (someRisk / totalStudents) * 100,
    high: (highRisk / totalStudents) * 100,
    total: totalStudents,
  };
}


export function calculateOccurancePercentages(students: SchoolData[], label: 'odr_f' | 'susp_f'): OccurancePercentage {
  let zero = 0;
  let oneplus = 0;

  const totalStudents = students.length;

  students.forEach(student => {
    const occuranceLevel = student[label as keyof typeof student];

    if (occuranceLevel === 'false') zero++;
    if (occuranceLevel === 'true') oneplus++;

  });

  //console.log("Calculated occurance percentages: " + zero.toString() + " " + oneplus.toString() + " " + totalStudents.toString())

  return {
    zero: (zero / totalStudents) * 100,
    oneplus: (oneplus / totalStudents) * 100
  };

}

export function calculateTestRiskPercentages(students: SchoolData[], label: 'math_f' | 'read_f'): { low: number, some: number, high: number, total: number } {

  let lowRisk = 0;
  let someRisk = 0;
  let highRisk = 0;

  const totalStudents = students.length;

  students.forEach(student => {
    const riskLevel = student[label as keyof typeof student];
    if (riskLevel === 'low') lowRisk++;
    if (riskLevel === 'some') someRisk++;
    if (riskLevel === 'high') highRisk++;
  });

  return {
    low: (lowRisk / totalStudents) * 100,
    some: (someRisk / totalStudents) * 100,
    high: (highRisk / totalStudents) * 100,
    total: totalStudents,
  };
}

// You can extend this function to add filters for gender, ethnicity, etc.
export function calculateRiskByDemographic(
  students: SchoolData[],
  riskType: 'midas' | 'student' | 'teacher',
  demographicKey: keyof SchoolData, // e.g., 'gender', 'ethnicity'
  demographicValue: string
) {
  const filteredStudents = students.filter(student => student[demographicKey] === demographicValue);
  return calculateRiskPercentages(filteredStudents, riskType);
}

export function calculateModeConfidence(
  students: SchoolData[],
  riskType: 'midas' | 'student' | 'teacher',
) {

  let frequency = {
    'low': 0,
    'some': 0,
    'high': 0
  }

  const lowLabel = 'low';
  const midLabel = 'some';
  const highLabel = 'high';

  students.forEach((student: SchoolData) => {
    if (student.risk![riskType]!.confidence === lowLabel) {
      frequency['low']++;
    }
    else if (student.risk![riskType]!.confidence === midLabel) {
      frequency['some']++;
    }
    else if (student.risk![riskType]!.confidence === highLabel) {
      frequency['high']++;
    }
  });

  // typescript moment
  let maxKey: keyof typeof frequency | null = null;
  let maxValue = 0;

  for (const key in frequency) {
    if (frequency[key as keyof typeof frequency] > maxValue) {
      maxValue++;
      maxKey = key as keyof typeof frequency;
    }
  }

  return maxKey;
}


