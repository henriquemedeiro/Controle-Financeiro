import React from 'react';
import { FaPrint, FaPlus, FaFileExport, FaFileImport } from 'react-icons/fa';

interface FilterControlsProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onGenerateReport: () => void;
  onOpenAddModal: () => void;
  onExport: () => void;
  onImport: () => void;
}

const FilterControls: React.FC<FilterControlsProps> = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onGenerateReport,
  onOpenAddModal,
  onExport,
  onImport,
}) => {
  return (
    <div className="card mb-4 no-print">
      <div className="card-header">
        Filtros e Ações
      </div>
      <div className="card-body">
        <div className="row align-items-center">
          <div className="col-md-4">
            <div className="row">
              <div className="col-sm-6">
                <label htmlFor="startDate" className="form-label">Data de Início</label>
                <input
                  type="date"
                  className="form-control"
                  id="startDate"
                  value={startDate}
                  onChange={(e) => onStartDateChange(e.target.value)}
                />
              </div>
              <div className="col-sm-6">
                <label htmlFor="endDate" className="form-label">Data de Fim</label>
                <input
                  type="date"
                  className="form-control"
                  id="endDate"
                  value={endDate}
                  onChange={(e) => onEndDateChange(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="col-md-8 d-flex justify-content-center justify-content-md-end flex-wrap mt-3 mt-md-0">
            <button className="btn btn-primary me-2 mb-2" onClick={onOpenAddModal}>
              <FaPlus className="me-1" /> Adicionar
            </button>
            <button className="btn btn-secondary me-2 mb-2" onClick={onGenerateReport}>
              <FaPrint className="me-1" /> Relatório
            </button>
            <button className="btn btn-success me-2 mb-2" onClick={onExport}>
              <FaFileExport className="me-1" /> Exportar JSON
            </button>
            <button className="btn btn-info mb-2" onClick={onImport}>
              <FaFileImport className="me-1" /> Importar JSON
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterControls;
