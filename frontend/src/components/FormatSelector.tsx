import React from 'react';

export type OutputFormat = 'docx' | 'odt' | 'txt' | 'rtf' | 'html';

interface FormatSelectorProps {
  selectedFormats: OutputFormat[];
  onFormatChange: (formats: OutputFormat[]) => void;
}

const FormatSelector: React.FC<FormatSelectorProps> = ({ selectedFormats, onFormatChange }) => {
  const formats: { value: OutputFormat; label: string }[] = [
    { value: 'docx', label: 'DOCX (Microsoft Word)' },
    { value: 'odt', label: 'ODT (OpenDocument)' },
    { value: 'txt', label: 'TXT (Texto Simples)' },
    { value: 'rtf', label: 'RTF (Rich Text Format)' },
    { value: 'html', label: 'HTML (Web)' },
  ];

  const handleFormatToggle = (format: OutputFormat) => {
    if (selectedFormats.includes(format)) {
      onFormatChange(selectedFormats.filter(f => f !== format));
    } else {
      onFormatChange([...selectedFormats, format]);
    }
  };

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Select Output Formats</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-3">
        {formats.map((format) => (
          <div key={format.value} className="flex items-center">
            <input
              type="checkbox"
              id={`format-${format.value}`}
              checked={selectedFormats.includes(format.value)}
              onChange={() => handleFormatToggle(format.value)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-blue-600 dark:ring-offset-gray-800 rounded"
            />
            <label htmlFor={`format-${format.value}`} className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
              {format.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FormatSelector;
