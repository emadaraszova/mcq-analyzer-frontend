import CardMain from "@/components/main/CardMain";

const Main = () => {
  return (
    <div className="flex justify-center gap-6 p-6">
      <CardMain
        title="MCQs Generator"
        description="Generate MCQs using Gemini/GPT models."
        redirectTo="/question-generation"
      />
      <CardMain
        title="MCQs Analyzer"
        description="Analyze data in clinical scenarios within your MCQs."
        redirectTo={"/"}
      />
    </div>
  );
};

export default Main;
