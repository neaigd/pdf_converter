import React, { useState } from 'react';
import axios from 'axios'; // Added axios
import FileUpload from './FileUpload';
import FormatSelector, { OutputFormat } from './FormatSelector';
import { useToast } from '@/hooks/use-toast'; // Added useToast

// Define a more detailed structure for completed results
interface ConversionResult {
    format: OutputFormat;
    fileName: string;
    success: boolean;
    message?: string;
}

interface ConversionStatus {
  isConverting: boolean;
  progress: number;
  error: string | null; // Overall error for the batch or specific errors
  completedResults: ConversionResult[]; // Changed from completedFormats
}

const ConversionForm: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFormats, setSelectedFormats] = useState<OutputFormat[]>(['docx']); // Default to docx or empty
  const { toast } = useToast(); // Initialize toast
  const [status, setStatus] = useState<ConversionStatus>({
    isConverting: false,
    progress: 0,
    error: null,
    completedResults: [], // Changed
  });

  const handleFileSelected = (file: File) => {
    setSelectedFile(file);
    setStatus({
      isConverting: false,
      progress: 0,
      error: null,
      completedResults: [], // Changed
    });
  };

  const handleConvert = async () => {
    if (!selectedFile || selectedFormats.length === 0) {
        toast({
            title: 'Missing Selections',
            description: 'Please select a file and at least one format.',
            variant: 'destructive',
        });
        return;
    }

    setStatus({
      isConverting: true,
      progress: 0,
      error: null,
      completedResults: [],
    });

    const totalFormatsToConvert = selectedFormats.length;
    let formatsSuccessfullyProcessed = 0;
    const currentCompletedResults: ConversionResult[] = [];
    let overallError = null;

    for (const format of selectedFormats) {
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('format', format);

        try {
            const response = await axios.post('/api/convert', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                responseType: 'blob',
            });

            const url = URL.createObjectURL(response.data);
            const link = document.createElement('a');
            link.href = url;
            const originalFilename = selectedFile.name.substring(0, selectedFile.name.lastIndexOf('.')) || selectedFile.name;
            const downloadFilename = `${originalFilename}.${format}`;
            link.setAttribute('download', downloadFilename);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            currentCompletedResults.push({ format, fileName: downloadFilename, success: true });
            formatsSuccessfullyProcessed++;

            toast({
                title: `Success: ${format.toUpperCase()}`,
                description: `${downloadFilename} downloaded.`,
                variant: 'success',
            });

        } catch (apiError: any) {
            let errorMessage = `Failed to convert to ${format}.`;
            if (apiError.response && apiError.response.data) {
                if (apiError.response.data instanceof Blob && apiError.response.data.type === "application/json") {
                    try {
                        const errorJsonText = await apiError.response.data.text();
                        const errorJson = JSON.parse(errorJsonText);
                        errorMessage = errorJson.error || errorMessage;
                    } catch (parseError) {
                        // Blob wasn't JSON or couldn't be parsed
                         errorMessage = `Failed to convert to ${format} (server error response could not be parsed).`;
                    }
                } else if (typeof apiError.response.data === 'string') {
                     errorMessage = apiError.response.data;
                } else if (apiError.response.status === 501) {
                    errorMessage = `Conversion to ${format} is not implemented yet.`;
                }
            } else if (apiError.message) {
                errorMessage = apiError.message;
            }

            currentCompletedResults.push({ format, fileName: `${selectedFile.name}.${format}`, success: false, message: errorMessage });
            overallError = overallError ? `${overallError}\n${errorMessage}` : errorMessage; // Append errors
            toast({
                title: `Error: ${format.toUpperCase()}`,
                description: errorMessage,
                variant: 'destructive',
            });
        }
        // Update progress after each attempt
        setStatus(prev => ({
            ...prev,
            progress: Math.round(((formatsSuccessfullyProcessed + (currentCompletedResults.length - formatsSuccessfullyProcessed)) / totalFormatsToConvert) * 100),
            completedResults: [...currentCompletedResults], // Update with current results
            error: overallError, // Show accumulated errors
        }));
    }

    setStatus(prev => ({
      ...prev,
      isConverting: false,
      // error: overallError, // Final error state is set progressively
    }));

    if (formatsSuccessfullyProcessed === totalFormatsToConvert && totalFormatsToConvert > 0) {
        // This toast is a bit redundant if individual toasts are shown, consider removing or making it a summary
        // toast({
        //     title: 'All Conversions Attempted',
        //     description: 'All selected files have been processed.',
        // });
    } else if (formatsSuccessfullyProcessed > 0 && formatsSuccessfullyProcessed < totalFormatsToConvert) {
         toast({
            title: 'Partial Success',
            description: 'Some formats converted successfully. Check messages for details.',
            variant: 'warning',
        });
    } else if (formatsSuccessfullyProcessed === 0 && totalFormatsToConvert > 0) {
        // This is also potentially redundant if individual errors are toasted
        // toast({
        //    title: 'All Conversions Failed',
        //    description: 'None of the selected formats could be converted. Check error messages.',
        //    variant: 'destructive',
        //});
    }
  };

  return (
    <div className="space-y-6">
      {!selectedFile ? (
        <FileUpload onFileSelected={handleFileSelected} />
      ) : (
        <div className="bg-slate-50 dark:bg-slate-800/30 p-4 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-grow min-w-0"> {/* Added for text truncation if needed */}
              <p className="font-medium text-slate-900 dark:text-slate-100 truncate">{selectedFile.name}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <button
              onClick={() => {
                setSelectedFile(null);
                // Also reset status when file is removed/changed
                setStatus({ isConverting: false, progress: 0, error: null, completedResults: [] });
              }}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 px-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200"
            >
              Change File
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
              className={`w-full py-2 px-4 rounded-md font-medium transition-colors
                ${
                  status.isConverting || selectedFormats.length === 0
                    ? 'bg-gray-400 text-gray-100 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900'
                }`}
            >
              {status.isConverting ? 'Converting...' : 'Convert PDF'}
            </button>
          </div>

          {status.isConverting && (
            <div className="space-y-2 pt-2">
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-in-out"
                  style={{ width: `${status.progress}%` }}
                ></div>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
                {status.progress}% complete
              </p>
            </div>
          )}

          {/* Display overall error if any, or individual errors can be shown per result */}
          {status.error && !status.isConverting && (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-300 p-3 rounded-md">
              <p className="font-bold mb-1">Conversion process encountered errors:</p>
              <pre className="whitespace-pre-wrap text-sm">{status.error}</pre>
            </div>
          )}

          {status.completedResults.length > 0 && !status.isConverting && (
            <div className="bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700 p-4 rounded-md">
              <h3 className="text-slate-800 dark:text-slate-100 font-medium mb-3">Conversion Results:</h3>
              <ul className="space-y-2">
                {status.completedResults.map(result => (
                  <li key={result.format}
                      className={`flex items-center justify-between p-3 rounded-md shadow-sm ${
                        result.success
                          ? 'bg-green-50 dark:bg-green-900/30 border-l-4 border-green-500 dark:border-green-400'
                          : 'bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 dark:border-red-400'
                      }`}
                  >
                    <div className="flex-grow min-w-0"> {/* Added for text truncation */}
                      <span className={`text-sm font-medium truncate ${result.success ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
                        {result.fileName}
                      </span>
                      {result.success ? (
                        <p className="text-xs text-green-600 dark:text-green-400">Downloaded successfully.</p>
                      ) : (
                        <p className="text-xs text-red-600 dark:text-red-400">Failed: {result.message || 'Unknown error'}</p>
                      )}
                    </div>
                    {/* Download button removed as it's automatic.
                        If re-download or saving blob is needed, this part would change.
                    */}
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
