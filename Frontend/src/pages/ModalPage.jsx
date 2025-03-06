import useRecordStore from "../components/Store";
import axios from "axios";
import { formFields } from "../components/DetailsStore";

function Modal() {
  const {
    editingTest,
    setEditingTest,
    formData,
    setFormData,
    tests,
    setTests,
  } = useRecordStore();
  const API_URL = "https://testtracking-fods.onrender.com";
  if (!editingTest) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // const handleSave = async () => {
  //   try {
  //     const response = await axios.put(
  //       `${API_URL}/api/tests/${editingTest._id}`,
  //       formData
  //     );
  //     // setTests(
  //     //   tests.map((test) =>
  //     //     test._id === editingTest._id ? response.data : test
  //     //   )
  //     // );

  //     setTests((prevTests) =>
  //       prevTests.map((test) =>
  //         test._id === editingTest._id ? response.data : test
  //       )
  //     );

  //     setEditingTest(null);
  //   } catch (error) {
  //     console.error("Error updating test:", error);
  //     alert("Failed to update the record.");
  //   }
  // };

  const handleSave = async () => {
    try {
      await axios.put(`${API_URL}/api/tests/${editingTest._id}`, formData);

      const response = await axios.get(`${API_URL}/api/tests`);
      setTests(response.data);

      setEditingTest(null);
    } catch (error) {
      console.error("Error updating test:", error);
      alert("Failed to update the record.");
    }
  };
  return (
    <div className="EditModal">
      <div className="EditForm">
        <h2>Edit Record</h2>
        <div>
          {formFields.map((field) => (
            <div key={field.name} className="ModalInput">
              <label>{field.label}</label>
              {field.type === "textarea" ? (
                <textarea
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                ></textarea>
              ) : (
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                />
              )}
            </div>
          ))}
        </div>

        <div className="ModalEditButtons">
          <button onClick={handleSave}>Save</button>
          <button onClick={() => setEditingTest(null)}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default Modal;
