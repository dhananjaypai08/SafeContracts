import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Test from "./pages/Test";


function App() {
  return (
    <div>
      <BrowserRouter>
      
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/test" element={<Test/>} />
          
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;