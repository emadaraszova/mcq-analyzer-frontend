import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import Navbar from "./components/mainPage/navbar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import AnalysisPage from "./app/AnalysisPage";
import AnalyzerPage from "./app/AnalyzerPage";
import QuestionGeneratorPage from "./app/QuestionGeneratorPage";
import MainPage from "./app/MainPage";
import ResponsePage from "./app/ResponsePage";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router>
          <Toaster position="bottom-right" />
          <div className="min-h-screen bg-blue-50">
            <Navbar />
            <main className=" mx-auto px-4 py-6">
              <Routes>
                <Route path="/" element={<MainPage />} />
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
