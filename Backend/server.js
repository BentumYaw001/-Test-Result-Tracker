import express from "express";
import { testSchema } from "./Test Validation/Validator.js";
import { connectionDB } from "./db/db.js";
import PatientTest from "./Data Model/test.model.js";
import mongoose from "mongoose";
import { configDotenv } from "dotenv";

const app = express();
app.use(express.json());
configDotenv();
const port = process.env.PORT || 5000;

// ✅ Get all tests
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

// ✅ Get test by ID (with MongoDB ObjectId validation)
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

// ✅ Create a new test
app.post("/api/tests", async (req, res) => {
  try {
    const validation = testSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ errors: validation.error.errors });
    }

    const newTest = new PatientTest(validation.data);
    await newTest.save();

    res.status(201).json({ message: "Data added successfully", test: newTest });
  } catch (error) {
    res.status(500).json({ error: `Error: ${error.message}` });
  }
});

// ✅ Update a test by ID
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

// ✅ Delete a test by ID
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

// ✅ Start server and connect to DB
app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
  connectionDB();
});
