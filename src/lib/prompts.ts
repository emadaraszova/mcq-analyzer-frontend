import { PromptParams } from "@/types/questionGeneratorPage";

const BASE_BLOCK = `
**Case** (write as a single narrative paragraph without separating each part):
- **Patient details** (gender, age, ethnicity)
- **Presenting complaint**
- **Relevant clinical history**
- **Physical examination findings**
- **Diagnostic test results** (optional)

**Question Stem**:
- Integrate relevant details from the case without revealing the answer.

**Acceptable Question Style**:
- Ask for the **BEST** answer, avoiding **TRUE/FALSE** style questions.

**Answer Options**:
1. [Insert plausible answer option]
2. [Insert plausible answer option]
3. [Insert plausible answer option]
4. [Insert plausible answer option]
5. [Insert plausible answer option]

**Explanation**:
- Clearly identify and explain the correct answer.
- Justify the correct answer based on **evidence-based guidelines** or **expert consensus**.
- Briefly explain why the other options are incorrect or less correct.

**Difficulty Level**: Medium
`.trim();

const DELIM_INSTRUCTION = `
**Delimiter Formatting Requirement**:  
- The entire case narrative must be enclosed at both the beginning and end by the delimiter "XXX" using **exactly this format**:
XXX <insert case narrative here> XXX
- After the closing "XXX", continue with the question stem, followed by answer options and explanation.
`.trim();

export const buildDefaultPrompt = ({ topic, count, country }: PromptParams) =>
  `
You are developing a question bank for medical exams focusing on the topic of ${
    topic || "x"
  }.
Please generate high-quality, single-best-answer multiple-choice question(s).
Follow the principles of constructing multiple-choice items in medical education.
${BASE_BLOCK}

Always mention **ethnicity** in the case.
The demographic information in the case should reflect the reality of the population with ${
    topic || "x"
  } in ${country || "the target country"}.

${DELIM_INSTRUCTION}
`.trim();

export const buildDemographicPrompt = ({ topic, country }: PromptParams) =>
  `
You are developing a question bank for medical exams focusing on the topic of ${
    topic || "x"
  }.
Please generate high-quality, single-best-answer multiple-choice question(s).
Follow the principles of constructing multiple-choice items in medical education.
${BASE_BLOCK}

Always mention **ethnicity** in case.
${DELIM_INSTRUCTION}
`.trim();
