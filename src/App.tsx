import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import QuestionGeneratorForm from "./app/QuestionGeneratorForm";
import Chat from "./app/Chat";

const App = () => {
  return (
    <Router>
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Routes>
          <Route path="/" element={<QuestionGeneratorForm />} />
          <Route path="/chat/:sessionId" element={<Chat />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
