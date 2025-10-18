import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import QuestionGeneratorForm from "./app/QuestionGeneratorForm";
import Chat from "./app/ResponsePage";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import AnalyzedDataPage from "./app/AnalysisPage";
import Main from "./app/Main";
import UserQuestionInputPage from "./app/AnalyzerPage";
import Navbar from "./components/main/navbar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";

const queryClient = new QueryClient();


const App = () => {
  return (
   <QueryClientProvider client={queryClient}> 
      <TooltipProvider>
        <Router>
           <Toaster position="bottom-right" />
          <div className="min-h-screen bg-blue-50">
            <Navbar />
            <main className="max-w-screen-xl mx-auto px-4 py-6">
              <Routes>
                <Route path="/" element={<Main />} />
                <Route path="/generator" element={<QuestionGeneratorForm />} />
                <Route path="/chat/:jobId" element={<Chat />} />
                <Route path="/analyzed-data" element={<AnalyzedDataPage />} />
                <Route path="/analyzer" element={<UserQuestionInputPage />} />
              </Routes>
            </main>
          </div>
        </Router>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
