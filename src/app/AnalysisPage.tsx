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
import ReactMarkdown from "react-markdown";

const AnalyzedDataPage = () => {
  const location = useLocation();
  const { analyzedData, originalResponse, model } = location.state as {
    analyzedData: ClinicalAnalysisResult;
    originalResponse: string;
    model: string;
  };

  const flattenedData = Array.isArray(analyzedData)
    ? analyzedData.flatMap((item) => item.questions || [])
    : [];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center">
        Clinical Scenarios Analysis
      </h1>
      <h2 className="text-center font-semibold text-xl text-sky-700">
        Analysis done using {model}
      </h2>
      <p className="text-lg text-slate-600 font-semibold text-center">
        This analysis highlights how often key details are included in the
        generated scenarios. For example, "gender: 5/5" indicates that
        gender information is mentioned in all 5 scenarios.
      </p>

      <DataAnalysisSummary analyzedData={{ questions: flattenedData }} />

      <div className="flex flex-col lg:flex-row gap-6">
        {/* First Accordion */}
        <div className="w-full lg:w-1/2">
          <Accordion type="multiple">
            <AccordionItem value="analyzedData">
              <AccordionTrigger>
                View the data extracted from the generated questions and used
                for the analysis
              </AccordionTrigger>
              <AccordionContent>
                <div
                  className="bg-sky-100 rounded-lg p-4 overflow-auto"
                  style={{ maxHeight: "400px" }}
                >
                  <CodeBlock
                    text={JSON.stringify({ questions: flattenedData }, null, 2)}
                    language="json"
                    showLineNumbers={true}
                    theme={dracula}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Second Accordion */}
        <div className="w-full lg:w-1/2">
          <Accordion type="multiple">
            <AccordionItem value="originalResponse">
              <AccordionTrigger>View the original response</AccordionTrigger>
              <AccordionContent>
                <div
                  className="bg-sky-100 rounded-lg p-4 overflow-auto"
                  style={{ maxHeight: "400px" }}
                >
                  <ReactMarkdown
                    children={originalResponse}
                    components={{
                      strong: ({ children }) => (
                        <strong className="font-bold">{children}</strong>
                      ),
                      em: ({ children }) => (
                        <em className="italic text-gray-500">{children}</em>
                      ),
                    }}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default AnalyzedDataPage;
