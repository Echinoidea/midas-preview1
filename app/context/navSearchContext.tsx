import React, { createContext, useContext } from "react";

export interface ISearchContext {
  school: [ string, React.Dispatch<React.SetStateAction<string>> ],
  grade: [ string, React.Dispatch<React.SetStateAction<string>> ],
  classroom: [ string, React.Dispatch<React.SetStateAction<string>> ],
  student: [ string, React.Dispatch<React.SetStateAction<string>> ],
}

const defaultSetState: React.Dispatch<React.SetStateAction<string>> = () => {};


export const SearchContext = createContext<ISearchContext>({
  school: ['', defaultSetState],
  grade: ['', defaultSetState],
  classroom: ['', defaultSetState],
  student: ['', defaultSetState]
});

export const useSchoolSearchContext = () => useContext(SearchContext);

export const useSearchContext = (query : 'school' | 'grade' | 'classroom' | 'student') => {
  const states = {
    'getSchool':    useContext(SearchContext).school[0],
    'setSchool':    useContext(SearchContext).school[1],
    'getGrade':     useContext(SearchContext).grade[0],
    'setGrade':     useContext(SearchContext).grade[1],
    'getClassroom': useContext(SearchContext).classroom[0],
    'setClassroom': useContext(SearchContext).classroom[1],
    'getStudent':   useContext(SearchContext).student[0],
    'setStudent':   useContext(SearchContext).student[1],
  }

  if (query == 'school')         { return {get: states.getSchool,    set: states.setSchool } }
  else if (query == 'grade')     { return {get: states.getGrade,     set: states.setGrade } }
  else if (query == 'classroom') { return {get: states.getClassroom, set: states.setClassroom } }
  else                           { return {get: states.getStudent,   set: states.setStudent } }
}
