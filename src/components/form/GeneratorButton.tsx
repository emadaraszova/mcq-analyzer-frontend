import { Button } from "@/components/ui/button";
import { GenerateButtonProps } from "@/types/form";


const GenerateButton = ({ disabled = false }: GenerateButtonProps) => (
  <div className="w-full flex justify-end mt-5">
    <Button
      type="submit"
      className="px-6 py-3 text-lg"
      disabled={disabled}
    >
      {disabled ? "Generating..." : "Generate"}
    </Button>
  </div>
);

export default GenerateButton;
