import { useMemo, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { ChatHeader } from "@/components/responsePage/ResponsePageHeader";
import Response from "@/components/responsePage/Response";
import { Button } from "@/components/ui/button";
import { triggerGeneration } from "@/api/analyzeClinical";
import AnalyzeDropdownButton from "@/components/responsePage/AnalyzeDropdownButton";
import { TriggerBody } from "@/types/responsePage";
import toast from "react-hot-toast";

/** --- Response Page --- **/
const ResponsePage = () => {
  const { jobId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Extract state passed from previous page
  const { prompt, model } = useMemo(() => location.state, [location.state]);

  // --- Local state ---
  const [isResponseReady, setIsResponseReady] = useState(false);
  const [response, setResponse] = useState<string>("");
  const [note, setNote] = useState<string | undefined>(undefined);
  const [selectedModel, setSelectedModel] = useState<string>("");

  // --- API mutation: analyze generated response ---
  const { mutate, isPending } = useMutation({
    mutationFn: (body: TriggerBody) => triggerGeneration(body),
    onSuccess: (data) => {
      navigate(`/analyzed-data/${data.job_id}`, {
        state: {
          originalResponse: response,
          model: selectedModel,
        },
      });
    },
    onError: (err: unknown) => {
      console.error(err);
      toast.error("Failed to start generation. Please try again.");
    },
  });

  // --- Handle analysis trigger ---
  const handleAnalyzeMCQs = (selected_model: string) => {
    setSelectedModel(selected_model);
    mutate({
      message: response,
      model: selected_model,
    });
  };

  // --- Handle response download ---
  const handleDownloadTxt = () => {
    if (!response?.trim()) return;

    const blob = new Blob([response], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    // descriptive filename (jobId + model + timestamp)
    const ts = new Date().toISOString().replace(/[:.]/g, "-");
    const filename = `mcqs-${jobId ?? "session"}-${model}-${ts}.txt`;

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a); // required for Safari
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  // Disable analyze when BE reports no delimiters
  const blockAnalyze = !!note
    ?.toLowerCase()
    .includes("no xxx delimiters found");

  // --- UI layout ---
  return (
    <div className="flex flex-col mx-auto px-6 py-2 h-full w-[90%] max-w-screen-xl relative">
      <ChatHeader model={model} prompt={prompt} />
      <Response
        jobId={jobId!}
        onResponseReady={() => setIsResponseReady(true)}
        onResponse={(text) => setResponse(text)}
        onNote={(n) => setNote(n ?? undefined)} // ← capture note from BE
      />

      {/* Footer actions */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white shadow-md flex flex-col items-center">
        <div className="flex gap-4">
          <Button
            variant="outline"
            disabled={!isResponseReady || !response.trim()}
            onClick={handleDownloadTxt}
          >
            Download the MCQs
          </Button>

          <AnalyzeDropdownButton
            isResponseReady={isResponseReady}
            onAnalyze={handleAnalyzeMCQs}
            isPending={isPending}
            blockAnalyze={blockAnalyze} // ← force-disable when no delimiters
          />
        </div>
      </div>
    </div>
  );
};

export default ResponsePage;
