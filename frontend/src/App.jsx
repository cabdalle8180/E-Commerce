import { Routes, Route } from "react-router-dom"
import Homepage from "./pages/Homepage"
import Loginpage from "./pages/Loginpage"
import Registerpage from "./pages/Registerpage"
// Hubi in magacu ka bilaabmo xaraf weyn 'H'
import Header from "./components/Header" 

function App() {
  return (
    <div>
      {/* Header-ka halkan ayuu joogayaa si uu dhammaan bogyada uga muuqdo */}
      <Header />
      
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Loginpage />} />
        <Route path="/register" element={<Registerpage />} />
      </Routes>
    </div>
  )
}

export default App