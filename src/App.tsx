import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";

import Navbar from "./components/homePage/navbar";
import HomePage from "./app/HomePage";
import QuestionGeneratorPage from "./app/QuestionGeneratorPage";
import ResponsePage from "./app/ResponsePage";
import AnalysisPage from "./app/AnalysisPage";
import AnalyzerPage from "./app/AnalyzerPage";

const queryClient = new QueryClient();

/** --- Root application entry point with routing and providers --- **/
const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router>
          {/* Toast notifications */}
          <Toaster position="bottom-right" />

          {/* Global layout */}
          <div className="min-h-screen bg-blue-50">
            <Navbar />
            <main className="mx-auto px-4 py-6">
              {/* --- Route definitions --- */}
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/generator" element={<QuestionGeneratorPage />} />
                <Route path="/chat/:jobId" element={<ResponsePage />} />
                <Route
                  path="/analyzed-data/:jobId"
                  element={<AnalysisPage />}
                />
                <Route path="/analyzer" element={<AnalyzerPage />} />
              </Routes>
            </main>
          </div>
        </Router>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
