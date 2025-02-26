export { default } from 'next-auth/middleware';

// Redirect to / if any of these are accessed when session is null
export const config = {
  matcher: [
    //'/dashboard',
    //'/dashboard/school', 
    //'/dashboard/grade',
    //'/dashboard/classroom',
    //'/dashboard/student'
  ]
};
