import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { NewPatientData } from "../components/DetailsStore";

function NewPatient() {
  const navigate = useNavigate();

  // State to store form data
  const [formData, setFormData] = useState({
    patientName: "",
    patientId: "",
    testType: "",
    result: "",
    notes: "",
  });

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/api/tests",
        formData
      );
      alert(response.data.message);
      navigate("/Records");
    } catch (error) {
      alert(error.response?.data?.message || "Error saving patient data");
    }
  };

  return (
    <div className="NewPatient">
      <h1>Add A New Patient</h1>
      <div className="NewButtons">
        <button onClick={() => navigate("/")}>Home</button>
        <button onClick={() => navigate("/Records")}>Patients Record</button>
      </div>

      <form onSubmit={handleSubmit}>
        {NewPatientData.map((item) => (
          <div key={item.name} className="InputSection">
            <label>{item.label}</label>
            <input
              type="text"
              name={item.name}
              value={formData[item.name]}
              onChange={handleChange}
              required
            />
          </div>
        ))}
        <div className="InputSection">
          <label>Notes</label>
          <textarea
            name="notes"
            placeholder="Start Typing ..."
            value={formData.notes}
            onChange={handleChange}
          ></textarea>
        </div>
        {/* Notes Textarea */}

        <button type="submit">Save</button>
      </form>
    </div>
  );
}

export default NewPatient;
