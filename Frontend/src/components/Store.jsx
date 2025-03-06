import { create } from "zustand";

const useRecordStore = create((set) => ({
  tests: [],
  setTests: (tests) => set({ tests }),

  loading: true,
  setLoading: (loading) => set({ loading }),

  editingTest: null,
  setEditingTest: (test) => set({ editingTest: test }),

  formData: {
    patientName: "",
    patientId: "",
    testType: "",
    result: "",
    notes: "",
  },
  setFormData: (data) => set({ formData: data }),
}));

export default useRecordStore;
