export interface ClinicalQuestion {
  gender: string;
  ethnicity: string;
}

export interface ClinicalAnalysisResult {
  questions: ClinicalQuestion[];
}

export interface DataAnalysisSummaryProps {
  analyzedData: ClinicalAnalysisResult;
}

export interface PieChartComponentProps {
  title: string;
  data: { name: string; value: number }[];
}