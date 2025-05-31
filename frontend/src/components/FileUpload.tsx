import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface FileUploadProps {
  onFileSelected: (file: File) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelected }) => {
  const [isDragging, setIsDragging] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      if (file.type === 'application/pdf') {
        onFileSelected(file);
      }
    }
  }, [onFileSelected]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: false,
    onDragEnter: () => setIsDragging(true),
    onDragLeave: () => setIsDragging(false),
  });

  return (
    <div 
      {...getRootProps()} 
      className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-all
        ${isDragging
            ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/30'
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800/30'
        }`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center space-y-4 text-gray-500 dark:text-gray-400">
        {/* Replaced inline SVG with Lucide icon for consistency if desired, or keep SVG and style it */}
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-12 w-12" // text-gray-400 dark:text-gray-500 removed, color from parent
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
          strokeWidth={1.5} // Adjusted stroke width slightly for aesthetics
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
          />
        </svg>
        {/* Alternative using Lucide Icon:
        <UploadCloudIcon className="h-12 w-12 text-gray-400 dark:text-gray-500" />
        */}
        <div className="space-y-1">
          <p className="text-lg font-medium text-gray-700 dark:text-gray-300">Drag and drop your PDF here</p>
          <p className="text-sm">or click to select a file</p>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
