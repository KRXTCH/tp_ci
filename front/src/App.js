import UserManager from "./Pages/UserManager";
import Home from "./Pages/Home";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    
    <>
        <Routes>
            <Route path="/mongo" element={<UserManager port={3000} />}>
            </Route>
            <Route path="/mysql" element={<UserManager port={5000} />}>
            </Route>
            <Route path="/" element={<Home />}>
            </Route>
        </Routes>
    </>
  );
}

export default App;
