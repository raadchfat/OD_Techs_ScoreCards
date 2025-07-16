import React, { useState, useRef } from 'react';
import { Upload, FileSpreadsheet, X, CheckCircle, AlertCircle } from 'lucide-react';

const FileUpload = ({ 
  onOpportunitiesFileUpload, 
  onLineItemsFileUpload, 
  loading, 
  error 
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [opportunitiesFile, setOpportunitiesFile] = useState(null);
  const [lineItemsFile, setLineItemsFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      handleFileSelect(file);
    }
  };

  const handleFileSelect = (file) => {
    if (!file.name.toLowerCase().endsWith('.xlsx') && !file.name.toLowerCase().endsWith('.xls')) {
      alert('Please select an Excel file (.xlsx or .xls)');
      return;
    }

    // Determine file type based on name or content
    const fileName = file.name.toLowerCase();
    if (fileName.includes('opportunity') || fileName.includes('opp')) {
      setOpportunitiesFile(file);
      onOpportunitiesFileUpload(file);
    } else if (fileName.includes('line') || fileName.includes('item')) {
      setLineItemsFile(file);
      onLineItemsFileUpload(file);
    } else {
      // Ask user to specify file type
      const fileType = prompt(
        'Please specify the file type:\n1 for Opportunities Report\n2 for Line Items Sold Report'
      );
      
      if (fileType === '1') {
        setOpportunitiesFile(file);
        onOpportunitiesFileUpload(file);
      } else if (fileType === '2') {
        setLineItemsFile(file);
        onLineItemsFileUpload(file);
      }
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const removeFile = (fileType) => {
    if (fileType === 'opportunities') {
      setOpportunitiesFile(null);
    } else {
      setLineItemsFile(null);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Upload Excel Files
        </h2>
        
        {/* Error Display */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
            <AlertCircle className="text-red-500 mr-2" size={20} />
            <span className="text-red-700">{error}</span>
          </div>
        )}

        {/* File Upload Area */}
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive 
              ? 'border-primary bg-primary/5' 
              : 'border-gray-300 hover:border-primary/50'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Upload className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-lg text-gray-600 mb-2">
            Drag and drop Excel files here, or{' '}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-primary hover:text-primary/80 font-medium"
            >
              browse files
            </button>
          </p>
          <p className="text-sm text-gray-500">
            Supports .xlsx and .xls files
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileInput}
            className="hidden"
          />
        </div>

        {/* File Status */}
        <div className="mt-6 space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <FileSpreadsheet className="text-gray-500 mr-3" size={20} />
              <span className="font-medium text-gray-700">Opportunities Report</span>
            </div>
            <div className="flex items-center">
              {opportunitiesFile ? (
                <>
                  <span className="text-sm text-gray-600 mr-2">
                    {opportunitiesFile.name}
                  </span>
                  <CheckCircle className="text-success" size={20} />
                  <button
                    onClick={() => removeFile('opportunities')}
                    className="ml-2 text-gray-400 hover:text-red-500"
                  >
                    <X size={16} />
                  </button>
                </>
              ) : (
                <span className="text-sm text-gray-500">No file uploaded</span>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <FileSpreadsheet className="text-gray-500 mr-3" size={20} />
              <span className="font-medium text-gray-700">Line Items Sold Report</span>
            </div>
            <div className="flex items-center">
              {lineItemsFile ? (
                <>
                  <span className="text-sm text-gray-600 mr-2">
                    {lineItemsFile.name}
                  </span>
                  <CheckCircle className="text-success" size={20} />
                  <button
                    onClick={() => removeFile('lineItems')}
                    className="ml-2 text-gray-400 hover:text-red-500"
                  >
                    <X size={16} />
                  </button>
                </>
              ) : (
                <span className="text-sm text-gray-500">No file uploaded</span>
              )}
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="mt-4 text-center">
            <div className="inline-flex items-center text-primary">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
              Processing files...
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-medium text-blue-800 mb-2">Instructions:</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Upload the Opportunities Report Excel file</li>
            <li>• Upload the Line Items Sold Report Excel file</li>
            <li>• Files will be automatically processed and merged</li>
            <li>• KPIs will be calculated based on the merged data</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FileUpload; 