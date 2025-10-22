import { useLocation, useParams } from "react-router-dom";
import { CodeBlock, dracula } from "react-code-blocks";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import DataAnalysisSummary from "@/components/analysisPage/DataAnalysisSummary";
import ReactMarkdown from "react-markdown";
import { getJobStatus } from "@/api/analyzeClinical";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "@/components/analysisPage/Loader";
import { JobStatusResponse } from "@/types/analysisPage";
import ChiSquareGoFCard from "@/components/analysisPage/chi-square/ChiSquareGoFCard";

const AnalysisPage = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const location = useLocation();
  const { originalResponse, model } = location.state as {
    originalResponse: string;
    model: string;
  };

  const { data, isLoading, isError, error } = useQuery<JobStatusResponse>({
    queryKey: ["jobStatus", jobId],
    queryFn: () => getJobStatus(jobId!),
    enabled: !!jobId,
    refetchInterval: (query) => {
      const d = query.state.data as JobStatusResponse | undefined;
      if (!d) return 2000;
      return d.status === "queued" || d.status === "started" || d.status === "running"
        ? 2000
        : false;
    },
  });

  const status = data?.status;

  if (isLoading || status === "queued" || status === "started" || status === "running") {
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

  if (status === "finished") {
    const result = data!.result;

    return (
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <h1 className="text-3xl font-bold text-center">Clinical Scenarios Analysis</h1>
        <h2 className="text-center font-semibold text-xl text-sky-700">
          Analysis done using {model}
        </h2>
        <p className="text-lg text-slate-600 font-semibold text-center">
          This analysis highlights how often key details are included in the
          generated scenarios. For example, "gender: 5/5" indicates that gender information
          is mentioned in all scenarios.
        </p>

        <DataAnalysisSummary analyzedData={result} />

        <div className="flex flex-col lg:flex-row gap-6">
          {/* First Accordion */}
          <div className="w-full lg:w-1/2">
            <Accordion type="multiple">
              <AccordionItem value="analyzedData">
                <AccordionTrigger>
                  View the data extracted from the generated questions and used for the analysis
                </AccordionTrigger>
                <AccordionContent>
                  <div
                    className="bg-sky-100 rounded-lg p-4 overflow-auto"
                    style={{ maxHeight: "400px" }}
                  >
                    <CodeBlock
                      text={JSON.stringify({ questions: result.questions }, null, 2)}
                      language="json"
                      showLineNumbers
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
                        strong: ({ children }) => <strong className="font-bold">{children}</strong>,
                        em: ({ children }) => <em className="italic text-gray-500">{children}</em>,
                      }}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        {/*Chi-Square Goodness-of-Fit calculator on the same page (expandable) */}
        <ChiSquareGoFCard />
      </div>
    );
  }

  return <div className="text-gray-500 text-center">No response yet.</div>;
};

export default AnalysisPage;