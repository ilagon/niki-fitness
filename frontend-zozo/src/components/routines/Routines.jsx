import './Routines.css'

const Routines = () => {
  const routines = [
    {
      id: 1,
      name: "Morning Routine",
      exercise1: "Squats",
      exercise2: "Squats",
      exercise3: "Squats",
      imageUrl: "https://via.placeholder.com/100x60", // Placeholder image URL
    },
    {
      id: 2,
      name: "After Work Routine",
      exercise1: "Squats",
      exercise2: "Squats",
      exercise3: "Squats",
      imageUrl: "https://via.placeholder.com/100x60", // Placeholder image URL
    },
    {
      id: 3,
      name: "Weekend Routine",
      exercise1: "Squats",
      exercise2: "Squats",
      exercise3: "Squats", 
      imageUrl: "https://via.placeholder.com/100x60", // Placeholder image URL
    },
  ];

return (
  <div className="routines-container">
    {/* <header className="header"> */}
      <h1>Routines</h1>
      <div className="controls">
        <button className="filter-button">Filter</button>
        <button className="create-routine-button">Create routine</button>
      </div>
    {/* </header> */}
    <div className="routine-list">
      {routines.map((routine) => (
        <div className="routine-card" key={routine.id}>
          <div className="routine-details">
            <h2>{routine.name}</h2>
            <li>{routine.exercise1}</li>
            <li>{routine.exercise2}</li>
            <li>{routine.exercise3}</li>
          </div>
          <img
            src={routine.imageUrl}
            className="routine-image"
            />
        </div>
      ))}
    </div>
  </div>
);
};

export default Routines 