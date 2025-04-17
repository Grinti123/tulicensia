export interface Procedure {
  id: string;
  name: string;
  description: string;
  steps: ProcedureStep[];
  requirements: string[];
  estimatedTime: string;
  cost: number;
}

export interface ProcedureStep {
  id: string;
  title: string;
  description: string;
  order: number;
}

export interface ProcedureCategory {
  id: string;
  name: string;
  procedures: Procedure[];
}
