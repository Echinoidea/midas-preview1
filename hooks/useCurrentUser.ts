import { create } from "zustand";

interface CurrentUser {
  id: number;
  username: string;
  email: string;
  isAdmin: boolean;
  schoolId: number;
  setId: (_id: number) => void;
  setUsername: (_username: string) => void;
  setEmail: (_email: string) => void;
  setIsAdmin: (_isAdmin: boolean) => void;
  setSchoolId: (_schoolId: number) => void;
}

const useCurrentUser = create<CurrentUser>((set) => ({
  id:       0,
  username: '',
  email:    '',
  isAdmin:  false,
  schoolId: 0,
  setId:       (_id: number)       => set({ id: _id }),
  setUsername: (_username: string) => set({ username: _username }),
  setEmail:    (_email: string)    => set({ email: _email }),
  setIsAdmin:  (_isAdmin: boolean) => set({ isAdmin: _isAdmin }),
  setSchoolId: (_schoolId: number) => set({ schoolId: _schoolId })
}));

export default useCurrentUser;