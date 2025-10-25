import { ValidationMessagesProps } from "@/types/analysisPage";

/** --- Calculator input validation messages  --- **/
const ValidationMessages = ({ issues }: ValidationMessagesProps) => {
  if (!issues.length) return null;

  return (
    <ul className="space-y-1">
      {issues.map((i, idx) => (
        <li
          key={idx}
          className={`text-sm ${
            i.type === "error" ? "text-red-700" : "text-amber-700"
          }`}
        >
          {i.type === "error" ? "⚠️" : "💡"} {i.text}
        </li>
      ))}
    </ul>
  );
};

export default ValidationMessages;
