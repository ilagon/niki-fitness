import "./Modal.css";
import Modal from "react-modal";
import { useState } from "react";

function InputModal({isOpen, setIsOpen, inputType, refetch}) {

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
        { inputType === "exercises" && <ExercisesForm setIsOpen={setIsOpen}   refetch={refetch} /> }
        { inputType === "routines" && <RoutinesForm /> }
      </div>
    </Modal>
  )
}

function ExercisesForm({setIsOpen, refetch}) {
  const backendUrl = import.meta.env.BACKEND_URL || 'http://localhost:3000';

  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [focus, setFocus] = useState("");
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");
  const [time, setTime] = useState("");
  const [sets, setSets] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${backendUrl}/api/exercises`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name,
          type,
          focus,
          weight,
          reps,
          time,
          sets,
          imageUrl: 'https://via.placeholder.com/100x60', // Default placeholder image
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create exercise');
      }

      const data = await response.json();
      console.log('Exercise created:', data);
      refetch();
      setIsOpen(false);
    } catch (err) {
      console.error('Error creating exercise:', err);
      setError(err.message || 'Failed to create exercise. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="Modal-exercises">
      <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Add New Exercise</h2>
      {error && <div className="error-message">{error}</div>}
      
      <div className="input-group">
        <label>Name:</label>
        <input
          required
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="input-group">
        <label>Type:</label>
        <input
          required
          type="text"
          value={type}
          onChange={(e) => setType(e.target.value)}
        />
      </div>

      <div className="input-group">
        <label>Focus:</label>
        <input
          required
          type="text"
          value={focus}
          onChange={(e) => setFocus(e.target.value)}
        />
      </div>

      <div className="input-group">
        <label>Weight:</label>
        <input
          type="text"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
        />
      </div>

      <div className="input-group">
        <label>Reps:</label>
        <input
          type="text"
          value={reps}
          onChange={(e) => setReps(e.target.value)}
        />
      </div>

      <div className="input-group">
        <label>Time:</label>
        <input
          type="text"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
      </div>

      <div className="input-group">
        <label>Sets:</label>
        <input
          type="text"
          value={sets}
          onChange={(e) => setSets(e.target.value)}
        />
      </div>

      <button type="submit" disabled={isLoading}>
        {isLoading ? <div className="spinner" /> : 'Submit'}
      </button>
    </form>
  )
}

function RoutinesForm() {
  return (
    <div>RoutinesForm</div>
  )
}

export default InputModal