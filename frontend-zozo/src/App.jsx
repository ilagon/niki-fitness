
import { Routes, Route } from "react-router";
import './App.css'
import Homepage from "./components/homepage/Homepage";
import Test from "./components/Test";
import Exercises from "./components/exercises/Exercises";
import Routines from "./components/Routines/Routines";
import ExercisesDescription from "./components/exercises/ExercisesDescription";


function App() {

  return (
    <>

     <Routes>
     <Route index element={<Homepage />} />
     <Route path="test" element={<Test />} />
     <Route path="routines" element={<Routines/>} />
     <Route path="exercises" element={<Exercises />} />
     <Route path="exercises/:id" element={<ExercisesDescription />}   />
    </Routes>

    </>
  )
}

export default App
