import React from "react";
import { useLocation } from "react-router-dom";

interface ClinicalAnalysisResult {
  question_number: number;
  gender: string;
  age: string;
  symptoms: string;
  family_background: string;
}

const AnalyzedDataPage = () => {
  const location = useLocation();
  const { analyzedData } = location.state as {
    analyzedData: ClinicalAnalysisResult[];
  };

  return (
    <div className="p-6 max-w-screen-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Clinical Scenarios Analysis</h1>
      <div className="bg-white p-4 rounded shadow">
        <pre>{JSON.stringify(analyzedData, null, 2)}</pre>
      </div>
    </div>
  );
};

export default AnalyzedDataPage;
