
import { Routes, Route } from "react-router";
import './App.css'
import Homepage from "./components/homepage/Homepage";
import Test from "./components/Test";
import Exercises from "./components/exercises/Exercises";
import Routines from "./components/Routines/Routines";


function App() {

  return (
    <>

     <Routes>
     <Route index element={<Homepage />} />
     <Route path="test" element={<Test />} />
     <Route path="Routines" element={<Routines/>} />
     <Route path="Exercises" element={<Exercises />}  />
    </Routes>

    </>
  )
}

export default App
