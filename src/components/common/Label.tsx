import React from "react";

interface LabelProps {
  htmlFor: string;
  text: string;
}

const Label: React.FC<LabelProps> = ({ htmlFor, text }) => (
  <label
    htmlFor={htmlFor}
    className="block text-sm sm:text-base font-semibold mb-2"
  >
    {text}
  </label>
);

export default Label;
