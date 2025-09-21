import { Routes, Route } from "react-router-dom";
import NavBar from './components/navbar';
import Home from './pages/home';
import About from './pages/about';
import Settings from './pages/settings';
import Sudoku from './pages/sudoku';

function App() {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", textAlign: "center", margin: "0px" }}>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/sudoku" element={<Sudoku />} />
      </Routes>
    </div>
    
  );
}

export default App;
