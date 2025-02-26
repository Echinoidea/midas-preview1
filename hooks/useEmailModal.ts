import { create } from 'zustand';

interface EmailModalStore {
  setImage: (img: string) => void;
  image: string;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useEmailModal = create<EmailModalStore>((set) => ({
  image: '',
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
  setImage: (img: string) => set({ image: img }),
}));

export default useEmailModal;
