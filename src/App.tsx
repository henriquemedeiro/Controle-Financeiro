import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Transaction } from './interfaces';
import TransactionForm from './components/TransactionForm';
import TransactionTable from './components/TransactionTable';
import MonthlySummary from './components/MonthlySummary';
import FilterControls from './components/FilterControls';
import { FaDollarSign } from 'react-icons/fa';
import './App.css';

// Helper to get the start and end of the current month
const getMonthDateRange = () => {
  const date = new Date();
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).toISOString().split('T')[0];
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString().split('T')[0];
  return { firstDay, lastDay };
};

function App() {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const savedTransactions = localStorage.getItem('transactions');
    return savedTransactions ? JSON.parse(savedTransactions) : [];
  });

  const [showModal, setShowModal] = useState(false);
  const [transactionToEdit, setTransactionToEdit] = useState<Transaction | null>(null);
  const [startDate, setStartDate] = useState(getMonthDateRange().firstDay);
  const [endDate, setEndDate] = useState(getMonthDateRange().lastDay);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  const handleAddTransaction = (transaction: Transaction) => {
    setTransactions((prev) => [...prev, transaction].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  };

  const handleUpdateTransaction = (updatedTransaction: Transaction) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === updatedTransaction.id ? updatedTransaction : t))
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    );
  };

  const handleDeleteTransaction = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta transação?')) {
      setTransactions(transactions.filter((t) => t.id !== id));
    }
  };

  const handleOpenAddModal = () => {
    setTransactionToEdit(null);
    setShowModal(true);
  };

  const handleOpenEditModal = (transaction: Transaction) => {
    setTransactionToEdit(transaction);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setTransactionToEdit(null);
  };

  const handleGenerateReport = () => {
    window.print();
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(transactions, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `controle-financeiro-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImportFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result;
        if (typeof text !== 'string') throw new Error('File is not readable');
        const importedTransactions = JSON.parse(text);

        // Basic validation
        if (Array.isArray(importedTransactions) && (importedTransactions.length === 0 || (importedTransactions[0].id && importedTransactions[0].description))) {
          if (window.confirm('Isso substituirá todas as suas transações atuais. Deseja continuar?')) {
            setTransactions(importedTransactions);
          }
        } else {
          throw new Error('Invalid file format');
        }
      } catch (error) {
        alert('Erro ao importar o arquivo. Verifique se o formato é um JSON válido exportado por esta aplicação.');
      } finally {
        // Reset file input
        if(event.target) event.target.value = '';
      }
    };
    reader.readAsText(file);
  };

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const transactionDate = new Date(t.date);
      const start = new Date(startDate);
      const end = new Date(endDate);
      transactionDate.setUTCHours(0, 0, 0, 0);
      start.setUTCHours(0, 0, 0, 0);
      end.setUTCHours(0, 0, 0, 0);
      return transactionDate >= start && transactionDate <= end;
    });
  }, [transactions, startDate, endDate]);

  const { totalIncome, totalExpense, totalInvestment, balance } = useMemo(() => {
    const income = filteredTransactions.filter((t) => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expense = filteredTransactions.filter((t) => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const investment = filteredTransactions.filter((t) => t.type === 'investment').reduce((sum, t) => sum + t.amount, 0);
    return {
      totalIncome: income,
      totalExpense: expense,
      totalInvestment: investment,
      balance: income - expense - investment,
    };
  }, [filteredTransactions]);

  return (
    <>
      <header className="bg-dark text-white p-3">
        <div className="container d-flex align-items-center justify-content-center">
          <FaDollarSign size={30} className="me-3 no-print" />
          <h1>Controle Financeiro</h1>
        </div>
      </header>

      <main className="container mt-4">
        <input
          type="file"
          accept=".json"
          ref={fileInputRef}
          onChange={handleImportFile}
          className="d-none"
        />
        <div className="no-print">
          <FilterControls
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
            onGenerateReport={handleGenerateReport}
            onOpenAddModal={handleOpenAddModal}
            onExport={handleExport}
            onImport={handleImportClick}
          />
        </div>

        <MonthlySummary
          totalIncome={totalIncome}
          totalExpense={totalExpense}
          totalInvestment={totalInvestment}
          balance={balance}
        />

        <TransactionTable
          transactions={filteredTransactions}
          onDeleteTransaction={handleDeleteTransaction}
          onEditTransaction={handleOpenEditModal}
        />

        <TransactionForm
          show={showModal}
          onClose={handleCloseModal}
          onAddTransaction={handleAddTransaction}
          onUpdateTransaction={handleUpdateTransaction}
          transactionToEdit={transactionToEdit}
        />
        {showModal && <div className="modal-backdrop fade show no-print"></div>}
      </main>

      <footer className="text-center text-muted py-4 no-print">
        <p>&copy; {new Date().getFullYear()} Controle Financeiro. Todos os direitos reservados.</p>
      </footer>
    </>
  );
}

export default App;
