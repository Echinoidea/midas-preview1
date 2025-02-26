'use client';

/**
 * Remember to put this as the parent of the root layout if the search isn't working.
 */

import { ReactNode, useState } from "react";
import { SearchContext } from "./navSearchContext";

/**
 * Search context provider. This is a global context provider for school, grade, class, and student search 
 * functionality to load the correct page.
 *
 * Wrap root component in this provider.
 */
export const SearchContextProvider = ({ children }: { children: ReactNode }) => {
  const [selectedSchool, setSelectedSchool] = useState<string>('');
  const [selectedGrade, setSelectedGrade] = useState<string>('');
  const [selectedClassroom, setSelectedClassroom] = useState<string>('');
  const [selectedStudent, setSelectedStudy] = useState<string>('');

  return (
    <SearchContext.Provider value={{
      school: [selectedSchool, setSelectedSchool],
      grade: [selectedGrade, setSelectedGrade],
      classroom: [selectedClassroom, setSelectedClassroom],
      student: [selectedStudent, setSelectedStudy]
    }}>
      {children}
    </SearchContext.Provider>
  );
};
