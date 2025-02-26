import { create } from 'zustand';

interface FileModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useFileModal = create<FileModalStore>((set) => ({
  image: '',
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export default useFileModal;
