import "./Modal.css";
import Modal from "react-modal";
import { useState } from "react";

function InputModal({isOpen, setIsOpen, inputType}) {

  Modal.setAppElement("#root");

  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
  };

  return (
    <Modal isOpen={isOpen} style={customStyles} onRequestClose={() => setIsOpen(false)}>
      <div className="Form-container">
        { inputType === "exercises" && <ExercisesForm setIsOpen={setIsOpen} /> }
        { inputType === "routines" && <RoutinesForm /> }
      </div>
    </Modal>
  )
}

function ExercisesForm({setIsOpen}) {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [focus, setFocus] = useState("");
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");
  const [time, setTime] = useState("");
  const [sets, setSets] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({
      name,
      type,
      focus,
      weight,
      reps,
      time,
      sets,
    });
    setIsOpen(false);
  }

  return (
    <form onSubmit={handleSubmit} className="Modal-exercises">
      <label>
        Name:
        <input required type="text" value={name} onChange={(e) => setName(e.target.value)}/>
      </label>
      <br/>
      <label>
        Type:
        <input required type="text" value={type} onChange={(e) => setType(e.target.value)}/>
      </label>
      <br/>
      <label>
        Focus:
        <input required type="text" value={focus} onChange={(e) => setFocus(e.target.value)}/>
      </label>
      <br/>
      <label>
        Weight:
        <input required type="text" value={weight} onChange={(e) => setWeight(e.target.value)}/>
      </label>
      <br/>
      <label>
        Reps:
        <input required type="text" value={reps} onChange={(e) => setReps(e.target.value)}/>
      </label>
      <br/>
      <label>
        Time:
        <input type="text" value={time} onChange={(e) => setTime(e.target.value)}/>
      </label>
      <br/>
      <label>
        Sets:
        <input type="text" value={sets} onChange={(e) => setSets(e.target.value)}/>
      </label>
      <br/>
      <button type="submit">Submit</button>
    </form>
  )
}

function RoutinesForm() {
  return (
    <div>RoutinesForm</div>
  )
}

export default InputModal