// src/interfaces.ts
export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense' | 'investment'; // 'receita', 'despesa', or 'investimento'
  date: string; // YYYY-MM-DD format
}
