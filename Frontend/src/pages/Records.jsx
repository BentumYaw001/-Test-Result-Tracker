import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function Records() {
  const navigate = useNavigate();
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTest, setEditingTest] = useState(null); // Stores the test being edited
  const [formData, setFormData] = useState({
    patientName: "",
    patientId: "",
    testType: "",
    result: "",
    notes: "",
  });

  // Fetch data from backend
  useEffect(() => {
    const fetchTests = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/tests");
        setTests(response.data);
      } catch (error) {
        console.error("Error fetching tests:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTests();
  }, []);

  // Handle delete request
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/tests/${id}`);
      setTests(tests.filter((test) => test._id !== id)); // Remove from UI
      alert("Record deleted successfully!");
    } catch (error) {
      console.error("Error deleting test:", error);
      alert("Failed to delete the record.");
    }
  };

  // Handle edit request
  const handleEdit = (test) => {
    setEditingTest(test);
    setFormData({
      patientName: test.patientName,
      patientId: test.patientId,
      testType: test.testType,
      result: test.result,
      notes: test.notes || "",
    });
  };

  // Handle input change in the edit form
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle save edit
  const handleSave = async () => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/tests/${editingTest._id}`,
        formData
      );
      setTests(
        tests.map((test) =>
          test._id === editingTest._id ? response.data : test
        )
      ); // Update UI
      setEditingTest(null); // Close edit form
      alert("Record updated successfully!");
      window.location.reload();
    } catch (error) {
      console.error("Error updating test:", error);
      alert("Failed to update the record.");
    }
  };

  return (
    <div className="Records Commons">
      <h1>Patient Records</h1>
      <div className="NewButtons">
        <button onClick={() => navigate("/")}>Home</button>
        <button onClick={() => navigate("/NewPatient")}>Add New Result</button>
      </div>

      <div className="RecordDisplay">
        {loading ? (
          <p>Loading...</p>
        ) : tests.length === 0 ? (
          <p>No data found.</p>
        ) : (
          <table border="1">
            <thead>
              <tr>
                <th>S/N</th>
                <th>Patient Name</th>
                <th>Patient ID</th>
                <th>Test Type</th>
                <th>Result</th>
                <th>Notes</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tests.map((test, index) => (
                <tr key={test._id}>
                  <td>{index + 1}</td>
                  <td>{test.patientName}</td>
                  <td>{test.patientId}</td>
                  <td>{test.testType}</td>
                  <td>{test.result}</td>
                  <td>{test.notes || "N/A"}</td>
                  <td>
                    <button
                      onClick={() => handleEdit(test)}
                      className="edit-button"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(test._id)}
                      className="delete-button"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Edit Modal */}
      {editingTest && (
        <div className="edit-modal">
          <div className="edit-form">
            <h2>Edit Record</h2>
            <label>Patient Name</label>
            <input
              type="text"
              name="patientName"
              value={formData.patientName}
              onChange={handleChange}
            />

            <label>Patient ID</label>
            <input
              type="text"
              name="patientId"
              value={formData.patientId}
              onChange={handleChange}
            />

            <label>Test Type</label>
            <input
              type="text"
              name="testType"
              value={formData.testType}
              onChange={handleChange}
            />

            <label>Result</label>
            <input
              type="text"
              name="result"
              value={formData.result}
              onChange={handleChange}
            />

            <label>Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
            ></textarea>

            <div className="edit-buttons">
              <button
                onClick={() => {
                  handleSave();
                }}
              >
                Save
              </button>
              <button onClick={() => setEditingTest(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Records;
