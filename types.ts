export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  isStreaming?: boolean;
}

export interface TransactionSummary {
  id: number;
  date: string;
  description: string;
  amount: number;
  type: 'debit' | 'credit';
  category: string;
}

export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  AI_ASSISTANT = 'AI_ASSISTANT',
  JOURNAL = 'JOURNAL',
}

export interface ChartData {
  name: string;
  value: number;
}
