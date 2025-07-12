import React, { useState } from 'react';
import { Upload, X, AlertCircle, CheckCircle, Download } from 'lucide-react';
import { parseCSV } from '../utils/exportUtils';

interface BulkImportProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (data: any[]) => Promise<{ imported: number; errors: string[] }>;
  templateData: any[];
  entityName: string;
}

const BulkImport: React.FC<BulkImportProps> = ({
  isOpen,
  onClose,
  onImport,
  templateData,
  entityName
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<{ imported: number; errors: string[] } | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setResult(null);
    }
  };

  const handleImport = async () => {
    if (!file) return;

    setImporting(true);
    try {
      const text = await file.text();
      let data;

      if (file.name.endsWith('.json')) {
        data = JSON.parse(text);
      } else if (file.name.endsWith('.csv')) {
        data = parseCSV(text);
      } else {
        throw new Error('Unsupported file format. Please use CSV or JSON.');
      }

      const result = await onImport(data);
      setResult(result);
    } catch (error) {
      setResult({
        imported: 0,
        errors: [error instanceof Error ? error.message : 'Import failed']
      });
    } finally {
      setImporting(false);
    }
  };

  const downloadTemplate = (format: 'csv' | 'json') => {
    if (templateData.length === 0) return;

    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `${entityName.toLowerCase()}_template_${timestamp}.${format}`;

    if (format === 'csv') {
      const headers = Object.keys(templateData[0]);
      const csvContent = [
        headers.join(','),
        ...templateData.map(row => 
          headers.map(header => row[header]).join(',')
        )
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);
    } else {
      const jsonContent = JSON.stringify(templateData, null, 2);
      const blob = new Blob([jsonContent], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-black">Bulk Import {entityName}</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-3">
              Upload a CSV or JSON file to import multiple {entityName.toLowerCase()}s at once.
            </p>
            
            <div className="flex gap-2 mb-3">
              <button
                onClick={() => downloadTemplate('csv')}
                className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-800"
              >
                <Download className="h-4 w-4" />
                <span>Download CSV Template</span>
              </button>
              <button
                onClick={() => downloadTemplate('json')}
                className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-800"
              >
                <Download className="h-4 w-4" />
                <span>Download JSON Template</span>
              </button>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <input
                type="file"
                accept=".csv,.json"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">
                  Click to select a CSV or JSON file
                </p>
              </label>
            </div>

            {file && (
              <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                Selected: {file.name}
              </div>
            )}
          </div>

          {result && (
            <div className="space-y-2">
              {result.imported > 0 && (
                <div className="flex items-center space-x-2 text-green-600 text-sm">
                  <CheckCircle className="h-4 w-4" />
                  <span>Successfully imported {result.imported} {entityName.toLowerCase()}(s)</span>
                </div>
              )}
              
              {result.errors.length > 0 && (
                <div className="space-y-1">
                  <div className="flex items-center space-x-2 text-red-600 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    <span>Errors ({result.errors.length}):</span>
                  </div>
                  <div className="max-h-32 overflow-y-auto text-xs text-red-600 bg-red-50 p-2 rounded">
                    {result.errors.map((error, index) => (
                      <div key={index}>{error}</div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex space-x-3 pt-4">
            <button
              onClick={handleImport}
              disabled={!file || importing}
              className="flex-1 bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {importing ? 'Importing...' : 'Import'}
            </button>
            <button
              onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkImport;