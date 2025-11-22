import CardMain from "@/components/homePage/CardMain";

/**
 * Main landing page component displaying an overview of the tool
 * and navigation cards for the generator and analyzer features.
 */
const HomePage = () => {
  return (
    <div className="flex flex-col items-center px-6 py-4 space-y-10 mx-auto">
      {/* About Section */}
      <section className="bg-blue-50 p-6 rounded-3xl shadow hover:border-sky-700 transition-colors duration-300 border max-w-5xl overflow-y-auto hover:bg-white max-h-[45vh]">
        {/* Page Title */}
        <div className="flex items-center space-x-3">
          <h1 className="text-3xl font-bold text-center text-sky-700">
            Welcome!
          </h1>
        </div>

        <h2 className="text-2xl font-semibold mb-2">About this Tool</h2>

        <p className="text-slate-700 leading-relaxed">
          <span className="block mb-3">
            This application helps educators to generate and analyze
            multiple-choice questions using large language models (LLMs). The
            goal of the analysis is to examine potential{" "}
            <strong>biases in LLMs</strong>.
          </span>

          <span className="block mb-3">
            Specifically, the tool focuses on detecting and quantifying patterns
            of
            <strong> demographic (mis)representation</strong> within the
            clinical scenarios embedded in generated questions. These aspects
            can reveal subtle forms of bias in training data and model
            reasoning.
          </span>

          <span className="block mb-3">
            Understanding and addressing these biases is essential for ensuring
            that AI-generated educational materials are{" "}
            <strong>fair and reflective of real-world diversity</strong>.
            Certain conditions are more prevalent or present differently among
            specific demographic groups. If educational content fails to reflect
            this reality, students may develop a
            <strong> narrow or biased clinical perspective</strong>.
          </span>

          <span className="block mb-3">
            To support quantitative evaluation, the application includes a
            <strong> Chi-square goodness-of-fit calculator</strong> that allows
            users to statistically assess differences between the{" "}
            <strong>demographic distribution in generated questions</strong> and
            the <strong>expected distribution based on real-world data</strong>.
            This helps identify significant deviations that may indicate bias in
            model outputs.
          </span>

          <span className="block text-slate-600 italic">
            Note: This tool does not evaluate other qualities of the generated
            questions, such as accuracy, clarity, or clinical validity.
            AI-generated content can be <strong>incomplete or incorrect</strong>
            , and all educational materials should be carefully reviewed by
            qualified professionals before use.
          </span>
        </p>
      </section>

      {/* Navigation Cards */}
      <div className="flex flex-col lg:flex-row justify-center gap-6">
        <CardMain
          title="Generator"
          description="Generate text using one of the available models."
          redirectTo="/generator"
        />
        <CardMain
          title="Analyzer"
          description="Analyze text for demographic attributes such as gender, ethnicity, and age."
          redirectTo="/analyzer"
        />
      </div>
    </div>
  );
};

export default HomePage;
