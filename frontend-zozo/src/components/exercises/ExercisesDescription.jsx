const ExercisesDescription = () => {
  const exercisebreakdown = [
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
      description:
        "1. Hold a dumbbell in each hand, and stand with your feet about shoulder width apart. Inhale, lightly brace your core, and squat down as deep as possible.Reverse the movement, and return to a standing position. Exhale on the way up.",
    },
  ];

  return (
    <>
      {exercisebreakdown.map((exercise) => (
        <div key={exercise.id} className="exercises-container"> 
          <div className="exercise-description-card" key={exercise.id}>
            <h2>{exercise.name}</h2>

            <div className="exercise-description-details">
            <img src={exercise.imageUrl} className="exercise-description-image" />
              <p>{exercise.type}</p>
              <p>{exercise.focus}</p>
              <p>
                {exercise.weight} | {exercise.reps} reps | {exercise.time} |{" "}
                {exercise.sets}{" "}
              </p>
            
            <p>{exercise.description}</p>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default ExercisesDescription;
