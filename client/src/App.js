import { Nav } from "./components/Nav/Nav";
import { TemplateContainer } from "./components/Templates/TemplateContainer";
import Login from "./components/Login";
import Signup from "./components/Signup";
import { Routes, Route, useLocation } from "react-router-dom";
import RoutineContainer from "./components/Routines/RoutineContainer";

export default function App() {
  const { pathname } = useLocation();

  return (
    <>
      <Nav activeNav={pathname.replace("/", "")} />
      <Routes>
        <Route path="/" element={<TemplateContainer />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Signup" element={<Signup />} />
        <Route path="/Templates" element={<TemplateContainer />} />
        <Route path="/Routines" element={<RoutineContainer />} />
      </Routes>
    </>
  );
}
