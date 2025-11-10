import React from 'react';
import { Transaction } from '../interfaces';
import { FaTrash, FaEdit } from 'react-icons/fa';

interface TransactionTableProps {
  transactions: Transaction[];
  onDeleteTransaction: (id: string) => void;
  onEditTransaction: (transaction: Transaction) => void;
}

const getTypeAttributes = (type: Transaction['type']) => {
  switch (type) {
    case 'income':
      return { label: 'Receita', badge: 'bg-success', sign: '+' };
    case 'expense':
      return { label: 'Despesa', badge: 'bg-danger', sign: '-' };
    case 'investment':
      return { label: 'Investimento', badge: 'bg-primary', sign: '-' };
    default:
      return { label: '', badge: 'bg-secondary', sign: '' };
  }
};

const TransactionTable: React.FC<TransactionTableProps> = ({ transactions, onDeleteTransaction, onEditTransaction }) => {
  return (
    <div className="card">
      <div className="card-header">
        Minhas Transações
      </div>
      <div className="card-body">
        {transactions.length === 0 ? (
          <p className="text-center">Nenhuma transação encontrada para o período selecionado.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Descrição</th>
                  <th>Tipo</th>
                  <th className="text-end">Valor (R$)</th>
                  <th className="text-center no-print">Ações</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => {
                  const { label, badge, sign } = getTypeAttributes(transaction.type);
                  const amountColor = transaction.type === 'income' ? 'text-success' : 'text-danger';

                  return (
                    <tr key={transaction.id}>
                      <td>{new Date(transaction.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</td>
                      <td>{transaction.description}</td>
                      <td>
                        <span className={`badge ${badge}`}>
                          {label}
                        </span>
                      </td>
                      <td className={`text-end ${amountColor}`}>
                        {sign} R$ {transaction.amount.toFixed(2)}
                      </td>
                      <td className="text-center no-print">
                        <button
                          className="btn btn-outline-primary btn-sm me-2"
                          onClick={() => onEditTransaction(transaction)}
                          title="Editar Transação"
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => onDeleteTransaction(transaction.id)}
                          title="Excluir Transação"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionTable;
