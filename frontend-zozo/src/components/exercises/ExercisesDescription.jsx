import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import "./ExercisesDescription.css";

const ExercisesDescription = () => {

  const { id } = useParams();

  const getExercise = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`https://niki-backend.lorenzocoded.dev/api/exercises/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  };

  const { data: exercise, isLoading, isError } = useQuery({
    queryKey: ["exercise", id],
    queryFn: getExercise,
  });

  return (
    <div className="exercise-description-page">
      {isLoading && <p>Loading...</p>}
      {isError && <p>Error loading exercise</p>}
      {exercise && (
        <div className="exercise-description-container">
          <div className="exercise-description-header">
            <h1 className="exercise-description-name">{exercise.name}</h1>
            <span className="exercise-description-type">{exercise.type}</span>
          </div>

          <div className="exercise-description-image">
            <img src={exercise.imageUrl} alt={exercise.name} />
          </div>

          <div className="exercise-description-details">
            <div className="summary-section">
              <h3>Summary</h3>
              <ul>
                <li>{exercise.sets} sets</li>
                <li>{exercise.reps} reps</li>
                <li>{exercise.time}</li>
              </ul>
            </div>

            <div className="anatomy-section">
              <h3>Anatomy:</h3>
              <p>{exercise.focus}</p>
            </div>

            {/* <div className="description-section">
              <h3>Description</h3>
              <p>{exercise.description}</p>
            </div> */}

            {exercise.link && (
              <div className="link-section">
                <a href={exercise.link} target="_blank" rel="noopener noreferrer">
                  LINK
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExercisesDescription;
