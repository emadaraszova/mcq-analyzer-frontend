import CardMain from "@/components/main/CardMain";

const Main = () => {
  return (
    <div className="flex flex-col items-center px-6 py-4 space-y-10 max-w-screen-lg mx-auto">
      {/* Title */}
      <h1 className="text-5xl font-bold text-center text-sky-700">
        Welcome!
      </h1>

      {/* About Section */}
      <section
        className="bg-blue-50 p-6 rounded-lg border w-full max-w-4xl overflow-y-auto hover:bg-white"
        style={{ maxHeight: "250px" }}
      >
        <h2 className="text-2xl font-semibold mb-2">About this Tool</h2>
        <p className="text-slate-700 leading-relaxed">
          This application assists educators and students...
          <br /><br />
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ultrices mollis pulvinar. Morbi quam metus, eleifend in sem sit amet, imperdiet venenatis nunc. In at ipsum eros. Curabitur vulputate non lacus semper molestie. Ut convallis hendrerit nisl quis eleifend. Sed at orci nec risus iaculis vulputate. Nulla finibus tempor ante non efficitur.
          <br /><br />
          Praesent pellentesque nisl vel nisl ultrices euismod. Donec vel quam magna. Integer posuere magna vitae justo ultricies, non aliquet metus faucibus. Etiam fringilla posuere velit. Aliquam vitae leo sed enim interdum maximus vel non enim. Duis semper convallis congue. Pellentesque tempus vel enim suscipit pretium. Nam ac turpis dictum, convallis ipsum et, vehicula velit. Mauris pulvinar fringilla felis, nec aliquet odio pellentesque sagittis.
         
        </p>
      </section>

      {/* Cards */}
      <div className="flex flex-col lg:flex-row justify-center gap-6">
        <CardMain
          title="Generator"
          description="Generate text using one of the Gemini/GPT models."
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

export default Main;
