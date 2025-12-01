import { Routes, Route } from "react-router-dom";
import App from "./App";
import AddCard from "./AddCard";
import CardManager from "./CardManager";
import RewardHistory from "./RewardHistory";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/AddCard" element={<AddCard />} />
      <Route path="/CardManager" element={<CardManager />} />
      <Route path="/RewardHistory" element={<RewardHistory />} />
    </Routes>
  );
}
