
import './Exercises.css'; // Ensure you add the styling here

const Exercises = () => {
  const exercises = [
      {
        id: 1,
        name: "Squats",
        type: "Strength",
        focus: "Legs",
        weight: "20kg",
        reps: "12",
        time: "60 seconds",
        sets: "3 sets",
        imageUrl: "https://via.placeholder.com/100x60", // Placeholder image URL
      },
      {
        id: 2,
        name: "Bench Press",
        type: "Strength",
        focus: "Chest",
        weight: "50kg",
        reps: "10",
        time: "45 seconds",
        sets: "3 sets",        
        imageUrl: "https://via.placeholder.com/100x60", // Placeholder image URL
      },
      {
        id: 3,
        name: "Deadlift",
        type: "Strength",
        focus: "Back",
        weight: "80kg",
        reps: "8",
        time: "90 seconds",
        sets: "3 sets",        
        imageUrl: "https://via.placeholder.com/100x60", // Placeholder image URL
      },
    ];

  return (
    <div className="exercises-container">
      {/* <header className="header"> */}
        <h1>Exercises</h1>
        <div className="controls">
          <button className="filter-button">Filter</button>
          <button className="add-exercise-button">Add exercise</button>
        </div>
      {/* </header> */}
      <div className="exercise-list">
        {exercises.map((exercise) => (
          <div className="exercise-card" key={exercise.id}>
            <div className="exercise-details">
              <h2>{exercise.name}</h2>
              <p>{exercise.type}</p>
              <p>{exercise.focus}</p>
              <p>{exercise.weight} | {exercise.reps} reps | {exercise.time} | {exercise.sets} </p>
            </div>
            <img
              src={exercise.imageUrl}
              className="exercise-image"
              />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Exercises;