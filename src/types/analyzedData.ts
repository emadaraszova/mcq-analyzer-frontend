export interface ClinicalQuestion {
  age: string;
  family_background: string;
  gender: string;
  symptoms: string;
}

export interface ClinicalAnalysisResult {
  questions: ClinicalQuestion[];
}

export interface DataAnalysisSummaryProps {
  analyzedData: ClinicalAnalysisResult;
}
