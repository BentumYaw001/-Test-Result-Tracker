import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import useRecordStore from "../components/Store";
import Modal from "./ModalPage";
import { tableHeadData } from "../components/DetailsStore";

function Records() {
  const navigate = useNavigate();
  const {
    tests,
    loading,
    setEditingTest,
    setFormData,
    fetchTests, // Use global fetch function
  } = useRecordStore();

  useEffect(() => {
    fetchTests();
  }, [fetchTests]); // Fetch data on component mount

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;
    try {
      await axios.delete(`${API_URL}/api/tests/${id}`);
      fetchTests(); // Fetch updated data after deletion
      alert("Record deleted successfully!");
    } catch (error) {
      console.error("Error deleting test:", error);
      alert("Failed to delete the record.");
    }
  };

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
                {tableHeadData.map((header, index) => (
                  <th key={index}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tests.map((test, index) => (
                <tr key={test._id}>
                  {[
                    index + 1,
                    test.patientName,
                    test.patientId,
                    test.testType,
                    test.result,
                    test.notes || "N/A",
                  ].map((value, idx) => (
                    <td key={idx}>{value}</td>
                  ))}
                  <td>
                    <button
                      onClick={() => handleEdit(test)}
                      className="EditButton"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(test._id)}
                      className="DeleteButton"
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

      <Modal />
    </div>
  );
}

export default Records;
