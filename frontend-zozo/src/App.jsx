
import { Routes, Route } from "react-router";
import './App.css'
import Homepage from "../components/homepage/Homepage";
import Test from "../components/Test";

function App() {

  return (
    <>
     <Routes>
     <Route index element={<Homepage />} />
     <Route path="test" element={<Test />} />
    </Routes>

    </>
  )
}

export default App
