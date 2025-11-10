import React, { useState, useEffect } from 'react';
import { Transaction } from '../interfaces';
import { v4 as uuidv4 } from 'uuid';

interface TransactionFormProps {
  show: boolean;
  onClose: () => void;
  onAddTransaction: (transaction: Transaction) => void;
  onUpdateTransaction: (transaction: Transaction) => void;
  transactionToEdit: Transaction | null;
}

const TransactionForm: React.FC<TransactionFormProps> = ({
  show,
  onClose,
  onAddTransaction,
  onUpdateTransaction,
  transactionToEdit,
}) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState<number | ''>('');
  const [type, setType] = useState<'income' | 'expense' | 'investment'>('expense');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const isEditMode = transactionToEdit !== null;

  useEffect(() => {
    if (show) {
      if (isEditMode) {
        setDescription(transactionToEdit.description);
        setAmount(transactionToEdit.amount);
        setType(transactionToEdit.type);
        setDate(transactionToEdit.date);
      } else {
        // Reset form for adding new transaction
        setDescription('');
        setAmount('');
        setType('expense');
        setDate(new Date().toISOString().split('T')[0]);
      }
    }
  }, [show, transactionToEdit, isEditMode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount || amount <= 0) {
      alert('Por favor, preencha todos os campos e insira um valor positivo.');
      return;
    }

    const transactionData = {
      id: isEditMode ? transactionToEdit.id : uuidv4(),
      description,
      amount: Number(amount),
      type,
      date,
    };

    if (isEditMode) {
      onUpdateTransaction(transactionData);
    } else {
      onAddTransaction(transactionData);
    }
    onClose();
  };

  if (!show) {
    return null;
  }

  return (
    <div className="modal show" tabIndex={-1} style={{ display: 'block' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{isEditMode ? 'Editar Transação' : 'Adicionar Nova Transação'}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="description" className="form-label">Descrição</label>
                <input
                  type="text"
                  className="form-control"
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ex: Aluguel, Salário, Ações da Tesla"
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="amount" className="form-label">Valor (R$)</label>
                <input
                  type="number"
                  className="form-control"
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(parseFloat(e.target.value) || '')}
                  min="0.01"
                  step="0.01"
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="type" className="form-label">Tipo</label>
                <select
                  className="form-select"
                  id="type"
                  value={type}
                  onChange={(e) => setType(e.target.value as 'income' | 'expense' | 'investment')}
                >
                  <option value="expense">Despesa</option>
                  <option value="income">Receita</option>
                  <option value="investment">Investimento</option>
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="date" className="form-label">Data</label>
                <input
                  type="date"
                  className="form-control"
                  id="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
                <button type="submit" className="btn btn-primary">{isEditMode ? 'Salvar Alterações' : 'Adicionar Transação'}</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionForm;
