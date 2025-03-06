import mongoose from "mongoose";

const TestSchema = new mongoose.Schema(
  {
    patientName: {
      type: String,
      required: true,
      trim: true,
    },
    testType: {
      type: String,
      required: true,
    },
    patientId: {
      type: String,
      required: true,
      unique: true,
    },
    result: {
      type: String,
      required: true,
    },
    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const PatientTest = mongoose.model("Test", TestSchema);
export default PatientTest;
