import React from 'react';
import { FaArrowUp, FaArrowDown, FaBalanceScale, FaChartLine } from 'react-icons/fa';

interface MonthlySummaryProps {
  totalIncome: number;
  totalExpense: number;
  totalInvestment: number;
  balance: number;
}

const MonthlySummary: React.FC<MonthlySummaryProps> = ({ totalIncome, totalExpense, totalInvestment, balance }) => {
  const balanceColor = balance >= 0 ? 'text-success' : 'text-danger';

  return (
    <div className="row mb-4">
      <div className="col-lg-3 col-md-6 mb-3">
        <div className="card text-center h-100">
          <div className="card-body">
            <h5 className="card-title text-success"><FaArrowUp className="me-2" />Receitas</h5>
            <p className="card-text fs-4">R$ {totalIncome.toFixed(2)}</p>
          </div>
        </div>
      </div>
      <div className="col-lg-3 col-md-6 mb-3">
        <div className="card text-center h-100">
          <div className="card-body">
            <h5 className="card-title text-danger"><FaArrowDown className="me-2" />Despesas</h5>
            <p className="card-text fs-4">R$ {totalExpense.toFixed(2)}</p>
          </div>
        </div>
      </div>
      <div className="col-lg-3 col-md-6 mb-3">
        <div className="card text-center h-100">
          <div className="card-body">
            <h5 className="card-title text-primary"><FaChartLine className="me-2" />Investimentos</h5>
            <p className="card-text fs-4">R$ {totalInvestment.toFixed(2)}</p>
          </div>
        </div>
      </div>
      <div className="col-lg-3 col-md-6 mb-3">
        <div className="card text-center h-100">
          <div className="card-body">
            <h5 className={`card-title ${balanceColor}`}><FaBalanceScale className="me-2" />Saldo</h5>
            <p className={`card-text fs-4 ${balanceColor}`}>R$ {balance.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthlySummary;
