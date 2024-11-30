import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import QuestionGeneratorForm from "./app/QuestionGeneratorForm";

const App = () => {
  return (
    <Router>
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Routes>
          <Route path="/" element={<QuestionGeneratorForm />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
