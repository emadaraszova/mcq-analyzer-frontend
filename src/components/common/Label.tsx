import { LabelProps } from "@/types/common";

const Label = ({ text }: LabelProps) => (
  <label
    className="block text-sm sm:text-base font-semibold mb-2"
  >
    {text}
  </label>
);

export default Label;
