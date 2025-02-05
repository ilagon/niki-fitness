// import { useState } from "react";
import InputModal from "../InputModal/Modal";
import "./Exercises.css"; // Ensure you add the styling here
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

const Exercises = () => {

  /* React Query method */
  const {
    data = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["exercises"],
    queryFn: async () => {
      const response = await fetch("http://localhost:3000/api/exercises");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
  });

  const [isOpen, setIsOpen] = useState(false);

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="container">
      {/* <header className="header"> */}
      <h1>Exercises</h1>
      <div className="controls">
        <button className="filter-button">Filter</button>
        <button className="add-exercise-button" onClick={toggleModal}>Add exercise</button>
      </div>
      {/* </header> */}
      <div className="exercise-list">
        {isLoading && <p>Loading...</p>}
        {isError && <p>Error loading exercises</p>}
        {data.map((exercise) => (
          <div className="card" key={exercise.id}>
            <div className="exercise-details">
              <h2>{exercise.name}</h2>
              <p>{exercise.type}</p>
              <p>{exercise.focus}</p>
              <p>
                {exercise.weight} | {exercise.reps} reps | {exercise.time} |{" "}
                {exercise.sets}{" "}
              </p>
            </div>
            <img src={exercise.imageUrl} className="exercise-image" />
          </div>
        ))}
      </div>
      <InputModal isOpen={isOpen} setIsOpen={setIsOpen} inputType="exercises" />
    </div>
  );
};

export default Exercises;
