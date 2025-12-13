import { useLocation, useParams } from "react-router-dom";
import { useState } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import DataAnalysisSummary from "@/components/analysisPage/DataAnalysisSummary";
import ReactMarkdown from "react-markdown";
import { getJobStatus } from "@/api/analyzeClinical";
import { Loader } from "@/components/analysisPage/Loader";
import {
  JobStatusResponse,
  EthnicityCategoryConfig,
  DistributionPoint,
} from "@/types/analysisPage";
import { useJobStatus } from "@/hook/useJobStatus";
import ChiSquareCalculatorCard from "@/components/analysisPage/chi-square/ChiSquareCalculatorCard";
import ChiSquareGoF from "@/components/analysisPage/chi-square/ChiSquareGoF";
import ChiSquareHomogeneity from "@/components/analysisPage/chi-square/ChiSquareHomogeneity";
import QuestionsTable from "@/components/analysisPage/QuestionsTable";
import { defaultEthnicityConfig } from "@/data/ethnicityDefaults";

/** --- Analysis Page --- **/
const AnalysisPage = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const location = useLocation();

  // Extract passed state (original response + model used)
  const { originalResponse, model } = location.state as {
    originalResponse: string;
    model: string;
  };

  // Shared ethnicity config state (used by charts + table)
  const [ethnicityConfig, setEthnicityConfig] = useState<
    EthnicityCategoryConfig[]
  >(defaultEthnicityConfig);

  // Sex & ethnicity distributions from charts (for Chi-Square GoF)
  const [sexDistribution, setSexDistribution] = useState<DistributionPoint[]>(
    []
  );
  const [ethnicityDistribution, setEthnicityDistribution] = useState<
    DistributionPoint[]
  >([]);

  // --- Fetch job status via reusable hook ---
  const { data, isLoading, isError, error } = useJobStatus<JobStatusResponse>(
    jobId,
    getJobStatus
  );

  const status = data?.status;

  // --- Loading & error states ---
  if (
    isLoading ||
    status === "queued" ||
    status === "started" ||
    status === "running"
  ) {
    return <Loader />;
  }

  if (isError) {
    return (
      <div className="text-red-900">
        Failed to fetch status. {(error as Error)?.message ?? ""}
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="text-red-900">
        Job failed. {data?.error ?? "Check worker logs."}
      </div>
    );
  }

  // --- Finished job: render results ---
  if (status === "finished") {
    const result = data!.result;

    return (
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Page header */}
        <h1 className="text-3xl font-bold text-center">
          Clinical Scenarios Analysis
        </h1>
        <h2 className="text-center font-semibold text-lg text-sky-700">
          Analysis done using {model}
        </h2>

        {/* Summary of analyzed data (charts + stats) */}
        <DataAnalysisSummary
          analyzedData={result}
          ethnicityConfig={ethnicityConfig}
          onEthnicityConfigChange={setEthnicityConfig}
          onSexDistributionChange={setSexDistribution}
          onEthnicityDistributionChange={setEthnicityDistribution}
        />

        {/* Accordions: show extracted data + original response */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Extracted data accordion */}
          <div className="w-full lg:w-1/2">
            <Accordion type="multiple">
              <AccordionItem value="analyzedData">
                <AccordionTrigger>
                  View the raw extracted data and the categories assigned to
                  each entry
                </AccordionTrigger>
                <AccordionContent>
                  <div
                    className="bg-sky-100 rounded-lg p-4 overflow-auto"
                    style={{ maxHeight: "400px" }}
                  >
                    <QuestionsTable
                      questions={result.questions}
                      ethnicityConfig={ethnicityConfig}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Original response accordion */}
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

        {/* Chi-Square calculators */}
        <div className="space-y-4">
          <ChiSquareCalculatorCard
            title="Chi-Square Goodness-of-Fit & TVD"
            subtitle="Compare observed counts to expected counts or probabilities."
          >
            <ChiSquareGoF
              sexObservedFromCharts={sexDistribution}
              ethnicityObservedFromCharts={ethnicityDistribution}
            />
          </ChiSquareCalculatorCard>

          <ChiSquareCalculatorCard
            title="Chi-Square Test of Homogeneity & TVD"
            subtitle="Compare category distributions across two or more groups."
          >
            <ChiSquareHomogeneity />
          </ChiSquareCalculatorCard>
        </div>
      </div>
    );
  }

  // --- Default fallback ---
  return <div className="text-gray-500 text-center">No response yet.</div>;
};

export default AnalysisPage;
