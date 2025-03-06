import { useNavigate } from "react-router-dom";

function Records() {
  const navigate = useNavigate();

  return (
    <>
      <div className="Records Commons">
        <h1>Patient Records</h1>
        <button onClick={() => navigate("/")}>Home</button>
        <button onClick={() => navigate("/NewPatient")}>Add New Result</button>
      </div>
    </>
  );
}

export default Records;
