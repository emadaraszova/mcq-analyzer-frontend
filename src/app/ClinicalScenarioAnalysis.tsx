import React from "react";
import { useLocation } from "react-router-dom";
import { CodeBlock, dracula } from "react-code-blocks";
import { ClinicalAnalysisResult } from "@/types";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import DataAnalysisSummary from "@/components/clinicalScenarionAnalysis/DataAnalysisSummary";

const AnalyzedDataPage = () => {
  const location = useLocation();
  const { analyzedData } = location.state as {
    analyzedData: ClinicalAnalysisResult[];
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center">
        Clinical Scenarios Analysis
      </h1>
      <p className="text-lg text-slate-600 font-semibold">
        This analysis highlights how often key details are included in the
        generated clinical scenarios. For example, "Gender: 5/5" indicates that
        gender information is mentioned in all 5 scenarios.
      </p>

      {/* Add the summary component */}
      <DataAnalysisSummary analyzedData={analyzedData} />

      <Accordion type="single" collapsible>
        <AccordionItem value="analyzedData">
          <AccordionTrigger className="font-semibold text-sky-700">
            View the data extracted from the generated questions and used for
            the analysis
          </AccordionTrigger>
          <AccordionContent>
            <div className="bg-sky-100 rounded-lg p-4 overflow-x-auto">
              <CodeBlock
                text={JSON.stringify(analyzedData, null, 2)}
                language="json"
                showLineNumbers={true}
                theme={dracula}
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default AnalyzedDataPage;
