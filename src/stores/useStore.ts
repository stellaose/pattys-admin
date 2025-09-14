import { State } from '@/models/application/state';
import { create } from 'zustand';

export const useAppStore = create<State>()((set) => ({
  setState: (key, value) => set(() => ({ [key]: value })),
  setAllState: (newState) => set(() => ({ ...newState })),
  resetForm: (newSate) =>
    set(() => {
      newSate.form?.resetFields();
      return { ...newSate };
    }),
}));
