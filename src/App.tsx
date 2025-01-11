import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import QuestionGeneratorForm from "./app/QuestionGeneratorForm";
import Chat from "./app/Chat";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import AnalyzedDataPage from "./app/AnalysisPage";
import Main from "./app/Main";
import UserQuestionInputPage from "./app/UserQuestioninput";

const App = () => {
  return (
    <TooltipProvider>
      <Router>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <Routes>
            <Route path="/" element={<Main />} />
            <Route
              path="/question-generation"
              element={<QuestionGeneratorForm />}
            />
            <Route path="/chat/:sessionId" element={<Chat />} />
            <Route path="/analyzed-data" element={<AnalyzedDataPage />} />
            <Route
              path="/input-questions"
              element={<UserQuestionInputPage />}
            />
          </Routes>
        </div>
      </Router>
    </TooltipProvider>
  );
};

export default App;
