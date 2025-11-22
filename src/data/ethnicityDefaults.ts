import { EthnicityCategoryConfig } from "@/types/analysisPage";

export const defaultEthnicityConfig: EthnicityCategoryConfig[] = [
  {
    id: "other",
    label: "Other",
    matchers: ["mixed white"],
    isFallback: true,
  },
  {
    id: "white",
    label: "White",
    matchers: ["white", "caucasian", "middle eastern", "arab"],
  },
  {
    id: "black",
    label: "Black",
    matchers: ["black", "african", "afro", "caribbean", "jamaican", "nigerian"],
  },
  {
    id: "asian",
    label: "Asian",
    matchers: [
      "asian",
      "chinese",
      "japanese",
      "korean",
      "indian",
      "pakistani",
      "bangladeshi",
    ],
  },
  {
    id: "hispanic",
    label: "Hispanic",
    matchers: ["hispanic", "latin"],
  },
];
