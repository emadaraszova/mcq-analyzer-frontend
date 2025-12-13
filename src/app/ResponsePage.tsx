import { useMemo, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { ChatHeader } from "@/components/responsePage/ResponsePageHeader";
import Response from "@/components/responsePage/Response";
import { Button } from "@/components/ui/button";
import { triggerGeneration } from "@/api/analyzeClinical";
import { TriggerBody } from "@/types/responsePage";
import toast from "react-hot-toast";

/** --- Response Page (GPT-4o only) --- **/
const ResponsePage = () => {
  const { jobId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const { prompt, model } = useMemo(() => location.state, [location.state]);

  const [isResponseReady, setIsResponseReady] = useState(false);
  const [response, setResponse] = useState<string>("");
  const [note, setNote] = useState<string | undefined>(undefined);

  const { mutate, isPending } = useMutation({
    mutationFn: (body: TriggerBody) => triggerGeneration(body),
    onSuccess: (data) => {
      navigate(`/analyzed-data/${data.job_id}`, {
        state: {
          originalResponse: response,
          model: "gpt-4o",
        },
      });
    },
    onError: (err: unknown) => {
      console.error(err);
      toast.error("Failed to start analysis.");
    },
  });

  const handleAnalyze = () => {
    mutate({
      message: response,
      model: "gpt-4o",
    });
  };

  const handleDownloadTxt = () => {
    if (!response.trim()) return;

    const blob = new Blob([response], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const ts = new Date().toISOString().replace(/[:.]/g, "-");

    const a = document.createElement("a");
    a.href = url;
    a.download = `mcqs-${jobId}-${model}-${ts}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const blockAnalyze = note?.toLowerCase().includes("no xxx delimiters found");

  return (
    <div className="flex flex-col mx-auto px-6 py-2 h-full w-[90%] max-w-screen-xl">
      <ChatHeader model={model} prompt={prompt} />

      <Response
        jobId={jobId!}
        onResponseReady={() => setIsResponseReady(true)}
        onResponse={(text) => setResponse(text)}
        onNote={(n) => setNote(n ?? undefined)}
      />

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white shadow-md flex justify-center gap-4">
        <Button
          variant="outline"
          disabled={!isResponseReady || !response.trim()}
          onClick={handleDownloadTxt}
        >
          Download the MCQs
        </Button>

        <Button
          className="px-12"
          variant="outline"
          disabled={!isResponseReady || isPending || blockAnalyze}
          onClick={handleAnalyze}
        >
          {isPending ? "Analyzing" : "Analyze"}
        </Button>
      </div>
    </div>
  );
};

export default ResponsePage;
