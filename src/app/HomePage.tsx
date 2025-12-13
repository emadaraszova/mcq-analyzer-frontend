import CardMain from "@/components/homePage/CardMain";

/**
 * Main landing page component displaying an overview of the tool
 * and navigation cards for the generator and analyzer features.
 */
const HomePage = () => {
  return (
    <div className="flex flex-col items-center lg:px-36 px-4 py-10 space-y-10 mx-auto">
      {/* Heading */}
      <div className="text-center space-y-7 max-w-3xl">
        <h1 className="text-3xl font-bold">Welcome!</h1>
        <p className="text-slate-500 text-lg">
          A tool that generates and analyzes AI-created multiple-choice
          questions to identify demographic misrepresentation and support equity
          in education.
        </p>
      </div>

      {/* Navigation Cards */}
      <div className="flex flex-col items-center md:flex-row md:justify-center gap-6 w-full">
        <CardMain
          title="Generator"
          description="Generate multiple-choice questions using one of the available AI models (GPT, Gemini, LLaMA)."
          redirectTo="/generator"
        />
        <CardMain
          title="Analyzer"
          description="Analyze text for demographic attributes such as sex, ethnicity, and age."
          redirectTo="/analyzer"
        />
      </div>
    </div>
  );
};

export default HomePage;
