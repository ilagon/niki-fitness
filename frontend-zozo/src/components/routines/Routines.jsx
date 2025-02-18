import "./Routines.css";
import { useQuery } from "@tanstack/react-query";

const Routines = () => {
  const backendUrl = import.meta.env.BACKEND_URL || 'http://localhost:3000';

  const getWorkoutList = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${backendUrl}/api/workouts`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  };

  const { data: workoutList, isLoading, isError } = useQuery({
    queryKey: ["workoutList"],
    queryFn: getWorkoutList,
  });

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Error loading workout list</p>;
  }

  return (
    <div className="container">
      {/* <header className="header"> */}
      <h1>Routines</h1>
      <div className="controls">
        <button className="filter-button">Filter</button>
        <button className="create-routine-button">Create routine</button>
      </div>
      {/* </header> */}
      <div className="routine-list">
        {workoutList.map((workout) => (
          <div className="card" key={workout.id}>
            <div className="routine-details">
              <h2>{workout.name}</h2>
              {workout.exerciseList.map((exercise, idx) => (
                <li key={idx}>{exercise}</li>
              ))}
            </div>
            <img src={workout.imageUrl} className="routine-image" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Routines;
