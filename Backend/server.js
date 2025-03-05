import express from "express";
import { testSchema } from "./Test Validation/Validator.js";
import { DiagnosticTests } from "./db/db.js";

const app = express();
app.use(express.json());

app.listen(5000, () => {
  console.log("Listening on port 5000");
});

app.get("/api/tests", (req, res) => {
  try {
    if (DiagnosticTests.length === 0)
      return res.status(404).send("No data found");
    res.status(200).json(DiagnosticTests);
  } catch (error) {
    res.status(500).send(`Error: ${error.message}`);
  }
});

app.get("/api/tests/:id", (req, res) => {
  try {
    const test = DiagnosticTests.find((c) => c.id === req.params.id);
    if (!test)
      return res
        .status(404)
        .send(`No data found for test with id: ${req.params.id}`);
    res.status(200).json(test);
  } catch (error) {
    res.status(500).send(`Error: ${error.message}`);
  }
});

app.post("/api/tests", (req, res) => {
  try {
    const validation = testSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ errors: validation.error.errors });
    }

    const { patientName, testType, result, notes } = req.body;

    const newTest = {
      id: (DiagnosticTests.length + 1).toString(),
      patientName,
      testType,
      result,
      testDate: new Date().toISOString().split("T")[0],
      notes: notes || "",
    };

    DiagnosticTests.push(newTest);
    res.status(201).json({ message: "Test added successfully", test: newTest });
  } catch (error) {
    res.status(500).send(`Error: ${error.message}`);
  }
});

app.put("/api/tests/:id", (req, res) => {
  try {
    const test = DiagnosticTests.find((c) => c.id === req.params.id);
    if (!test)
      return res
        .status(404)
        .send(`No data found for test with id: ${req.params.id}`);

    const partialSchema = testSchema.partial();
    const validation = partialSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ errors: validation.error.errors });
    }

    const { patientName, testType, result, notes } = req.body;

    if (patientName) test.patientName = patientName;
    if (testType) test.testType = testType;
    if (result) test.result = result;
    if (notes) test.notes = notes;

    res.status(200).json({ message: "Test updated successfully", test });
  } catch (error) {
    res.status(500).send(`Error: ${error.message}`);
  }
});

app.delete("/api/tests/:id", (req, res) => {
  try {
    const index = DiagnosticTests.findIndex((c) => c.id === req.params.id);
    if (index === -1)
      return res
        .status(404)
        .send(`No data found for test with id: ${req.params.id}`);

    DiagnosticTests.splice(index, 1);
    res.status(200).json({ message: "Test deleted successfully" });
  } catch (error) {
    res.status(500).send(`Error: ${error.message}`);
  }
});
