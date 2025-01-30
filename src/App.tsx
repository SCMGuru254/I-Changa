import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Onboarding from "./pages/Onboarding";
import GroupPage from "./pages/GroupPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Onboarding />} />
        <Route path="/dashboard" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/group/:id" element={<GroupPage />} />
      </Routes>
    </Router>
  );
}

export default App;