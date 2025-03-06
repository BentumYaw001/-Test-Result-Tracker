import express from "express";
import { testSchema } from "./Test Validation/Validator.js";
import { connectionDB } from "./db/db.js";
import PatientTest from "./Data Model/test.model.js";
import mongoose from "mongoose";
import { configDotenv } from "dotenv";
import cors from "cors";

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:5174", "https://test-result-tracker.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

configDotenv();
const port = process.env.PORT || 5000;

app.get("/api/tests", async (req, res) => {
  try {
    const tests = await PatientTest.find();
    if (!tests.length) {
      return res.status(404).json({ message: "No data found" });
    }
    res.status(200).json(tests);
  } catch (error) {
    res.status(500).json({ error: `Error: ${error.message}` });
  }
});

app.get("/api/tests/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    const test = await PatientTest.findById(req.params.id);
    if (!test) {
      return res
        .status(404)
        .json({ message: `No data found for ID: ${req.params.id}` });
    }

    res.status(200).json(test);
  } catch (error) {
    res.status(500).json({ error: `Error: ${error.message}` });
  }
});

app.post("/api/tests", async (req, res) => {
  try {
    const validation = testSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ errors: validation.error.errors });
    }

    const { patientId } = validation.data;

    const existingTest = await PatientTest.findOne({ patientId });
    if (existingTest) {
      return res
        .status(400)
        .json({ message: "Test for this patient already exists." });
    }

    const newTest = new PatientTest(validation.data);
    await newTest.save();

    res.status(201).json({ message: "Data added successfully", test: newTest });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "Duplicate patient ID detected." });
    }

    res.status(500).json({ error: `Error: ${error.message}` });
  }
});

app.put("/api/tests/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    const partialSchema = testSchema.partial();
    const validation = partialSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ errors: validation.error.errors });
    }

    const updatedTest = await PatientTest.findByIdAndUpdate(
      req.params.id,
      validation.data,
      { new: true }
    );
    if (!updatedTest) {
      return res
        .status(404)
        .json({ message: `No data found for ID: ${req.params.id}` });
    }

    res
      .status(200)
      .json({ message: "Test updated successfully", test: updatedTest });
  } catch (error) {
    res.status(500).json({ error: `Error: ${error.message}` });
  }
});

app.delete("/api/tests/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    const deletedTest = await PatientTest.findByIdAndDelete(req.params.id);
    if (!deletedTest) {
      return res
        .status(404)
        .json({ message: `No data found for ID: ${req.params.id}` });
    }

    res.status(200).json({ message: "Test deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: `Error: ${error.message}` });
  }
});

app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
  connectionDB();
});
