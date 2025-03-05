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
