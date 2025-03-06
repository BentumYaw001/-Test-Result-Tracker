import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function Records() {
  const navigate = useNavigate();
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

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
                <th>Actions</th> {/* New column for delete button */}
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
    </div>
  );
}

export default Records;
