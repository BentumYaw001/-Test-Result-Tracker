import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();
  return (
    <>
      <div className="HomePage Commons">
        <h1>Diagnostic Test Results</h1>
        <button onClick={() => navigate("/NewPatient")}>Add New Result</button>
        <button onClick={() => navigate("/Records")}>Patients Record</button>
      </div>
    </>
  );
}
export default HomePage;
