export const fetchClinicalAnalysis = async (payload: {
  sessionId: string;
  prompt: string;
  model: string;
  numQuestions: string;
}) => {
  const { sessionId, prompt, model, numQuestions } = payload;
  const response = await fetch("http://localhost:8000/api/analyze-clinical", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      session_id: sessionId,
      message: prompt,
      model,
      number_of_questions: numQuestions,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch clinical analysis");
  }

  const data = await response.json();
  return data.structured_data;
};
