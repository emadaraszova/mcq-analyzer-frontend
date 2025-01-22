export interface ClinicalQuestion {
  age: string;
  gender: string;
  ethnicity: string;
}

export interface ClinicalAnalysisResult {
  questions: ClinicalQuestion[];
}

export interface DataAnalysisSummaryProps {
  analyzedData: ClinicalAnalysisResult;
}
