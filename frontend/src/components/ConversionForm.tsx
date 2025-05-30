import React, { useState } from 'react';
import FileUpload from './FileUpload';
import FormatSelector, { OutputFormat } from './FormatSelector';

interface ConversionStatus {
  isConverting: boolean;
  progress: number;
  error: string | null;
  completedFormats: OutputFormat[];
}

const ConversionForm: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFormats, setSelectedFormats] = useState<OutputFormat[]>(['docx', 'odt']);
  const [status, setStatus] = useState<ConversionStatus>({
    isConverting: false,
    progress: 0,
    error: null,
    completedFormats: [],
  });

  const handleFileSelected = (file: File) => {
    setSelectedFile(file);
    // Reset status when new file is selected
    setStatus({
      isConverting: false,
      progress: 0,
      error: null,
      completedFormats: [],
    });
  };

  const handleConvert = async () => {
    if (!selectedFile || selectedFormats.length === 0) return;

    setStatus({
      isConverting: true,
      progress: 0,
      error: null,
      completedFormats: [],
    });

    // Simulação de progresso - em produção, isso seria substituído pela integração real com o backend
    const totalSteps = selectedFormats.length;
    let currentStep = 0;

    for (const format of selectedFormats) {
      try {
        // Simular o tempo de conversão
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        currentStep++;
        setStatus(prev => ({
          ...prev,
          progress: Math.round((currentStep / totalSteps) * 100),
          completedFormats: [...prev.completedFormats, format],
        }));
      } catch (error) {
        setStatus(prev => ({
          ...prev,
          error: `Erro ao converter para ${format}: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
        }));
        break;
      }
    }

    setStatus(prev => ({
      ...prev,
      isConverting: false,
    }));
  };

  return (
    <div className="space-y-6">
      {!selectedFile ? (
        <FileUpload onFileSelected={handleFileSelected} />
      ) : (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">{selectedFile.name}</p>
              <p className="text-sm text-gray-500">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <button
              onClick={() => setSelectedFile(null)}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Trocar arquivo
            </button>
          </div>
        </div>
      )}

      {selectedFile && (
        <>
          <FormatSelector
            selectedFormats={selectedFormats}
            onFormatChange={setSelectedFormats}
          />

          <div className="pt-4">
            <button
              onClick={handleConvert}
              disabled={status.isConverting || selectedFormats.length === 0}
              className={`w-full py-2 px-4 rounded-md text-white font-medium 
                ${
                  status.isConverting || selectedFormats.length === 0
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
            >
              {status.isConverting ? 'Convertendo...' : 'Converter PDF'}
            </button>
          </div>

          {status.isConverting && (
            <div className="space-y-2">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${status.progress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 text-center">
                {status.progress}% concluído
              </p>
            </div>
          )}

          {status.error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md">
              {status.error}
            </div>
          )}

          {status.completedFormats.length > 0 && !status.isConverting && (
            <div className="bg-green-50 border border-green-200 p-4 rounded-md">
              <h3 className="text-green-800 font-medium">Conversão concluída!</h3>
              <ul className="mt-2 space-y-1">
                {status.completedFormats.map(format => (
                  <li key={format} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">
                      {selectedFile.name.replace('.pdf', `.${format}`)}
                    </span>
                    <button className="text-sm text-blue-600 hover:text-blue-800">
                      Baixar
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ConversionForm;
