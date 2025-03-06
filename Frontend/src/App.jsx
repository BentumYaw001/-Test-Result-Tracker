import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import NewPatient from "./pages/New Patient";
import Records from "./pages/Records";

function App() {
  return (
    <>
      <div className="App">
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/NewPatient" element={<NewPatient />} />
            <Route path="/Records" element={<Records />} />
            <Route path="*" element={<HomePage />} />
          </Routes>
        </Router>
      </div>
    </>
  );
}

export default App;
