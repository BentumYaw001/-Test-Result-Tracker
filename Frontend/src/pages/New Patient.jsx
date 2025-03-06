import { useNavigate } from "react-router-dom";

function NewPatient() {
  const navigate = useNavigate();
  const NewPatientData = [
    {
      label: "Patient Name",
    },
    {
      label: "Test Type",
    },
    {
      label: "Result",
    },
  ];

  return (
    <>
      <div className="NewPatient ">
        <div className="Commons">
          <h1>Add A New Patient</h1>
          <div>
            <button onClick={() => navigate("/")}>Home</button>
            <button onClick={() => navigate("/Records")}>
              Patients Record
            </button>
          </div>
          {NewPatientData.map((item) => {
            return (
              <>
                <label htmlFor="">{item.label}</label>
                <input type="text" name="" id="" />
              </>
            );
          })}
        </div>
        <div>
          <label htmlFor="">Notes</label>
          <textarea
            name="Notes"
            id=""
            placeholder="Start Typing ..."
          ></textarea>
        </div>
        <button>Save</button>
      </div>
    </>
  );
}

export default NewPatient;
