import { useContext } from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

function App() {

  const { user } = useContext(AuthContext);
  console.log(user);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
          <Route path="/" element={user ? <Dashboard /> : <Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App