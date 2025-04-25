import React, { useState, useRef, useEffect } from 'react';
import { Alert, Button, FileInput, Progress, Spinner } from 'flowbite-react';
import { HiUpload, HiXCircle, HiCheck, HiExclamationCircle } from 'react-icons/hi';

export interface FileUploaderProps {
  // Required props
  accept?: string; // Accepted file extensions (e.g. '.csv,.xlsx')
  maxSizeInMB?: number; // Maximum file size in MB
  onFileSelected: (file: File) => void; // Callback when file is selected

  // Optional props
  onError?: (error: string) => void; // Callback when error occurs
  label?: string; // Label for the file input
  buttonText?: string; // Text for the upload button
  uploading?: boolean; // Whether file is being uploaded
  uploadProgress?: number; // Upload progress percentage
  error?: string; // Error message
  success?: boolean; // Whether upload was successful
  helperText?: string; // Helper text for the file input
  buttonOnly?: boolean; // Show only the button, not the file input
  className?: string; // Additional class names
}

const FileUploader: React.FC<FileUploaderProps> = ({
  accept = '.csv,.xlsx,.xls,.json',
  maxSizeInMB = 10,
  onFileSelected,
  onError,
  label = 'Upload File',
  buttonText = 'Select File',
  uploading = false,
  uploadProgress = 0,
  error,
  success = false,
  helperText,
  buttonOnly = false,
  className = '',
}) => {
  const [fileError, setFileError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Clear error when props change
  useEffect(() => {
    if (error) {
      setFileError(error);
    } else {
      setFileError(null);
    }
  }, [error]);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) {
      return;
    }

    validateAndProcessFile(files[0]);
  };

  // Handle file drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (!files || files.length === 0) {
      return;
    }

    validateAndProcessFile(files[0]);
  };

  // Validate and process the file
  const validateAndProcessFile = (file: File) => {
    // Reset state
    setFileError(null);

    // Validate file type
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
    const acceptedTypes = accept.split(',').map(type => type.trim().toLowerCase().replace('.', ''));

    if (!acceptedTypes.includes(fileExtension)) {
      const error = `Invalid file type. Accepted types: ${accept}`;
      setFileError(error);
      if (onError) onError(error);
      return;
    }

    // Validate file size
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      const error = `File is too large. Maximum size: ${maxSizeInMB}MB`;
      setFileError(error);
      if (onError) onError(error);
      return;
    }

    // Set the selected file and call the callback
    setSelectedFile(file);
    onFileSelected(file);
  };

  // Drag events
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  // Trigger file input click
  const triggerFileInputClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Format file size
  const formatFileSize = (sizeInBytes: number): string => {
    if (sizeInBytes < 1024) {
      return `${sizeInBytes} B`;
    } else if (sizeInBytes < 1024 * 1024) {
      return `${(sizeInBytes / 1024).toFixed(1)} KB`;
    } else {
      return `${(sizeInBytes / (1024 * 1024)).toFixed(1)} MB`;
    }
  };

  return (
    <div className={`file-uploader ${className}`}>
      {/* Button-only mode */}
      {buttonOnly ? (
        <div>
          <input
            type="file"
            className="hidden"
            ref={fileInputRef}
            accept={accept}
            onChange={handleFileChange}
          />
          <Button onClick={triggerFileInputClick} disabled={uploading}>
            {uploading ? (
              <>
                <Spinner size="sm" className="mr-2" />
                Uploading...
              </>
            ) : (
              <>
                <HiUpload className="mr-2 h-5 w-5" />
                {buttonText}
              </>
            )}
          </Button>
          {selectedFile && (
            <div className="mt-2 text-sm text-gray-500">
              Selected: {selectedFile.name} ({formatFileSize(selectedFile.size)})
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Standard file uploader */}
          <div className="mb-2 block">
            {label && (
              <label className="block mb-2 text-sm font-medium text-gray-900">{label}</label>
            )}
          </div>

          <div
            className={`border-2 border-dashed rounded-lg p-4 transition-colors ${
              isDragging
                ? 'border-blue-500 bg-blue-50'
                : fileError
                  ? 'border-red-500 bg-red-50'
                  : success
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center justify-center py-4">
              {!uploading && !success ? (
                <>
                  <HiUpload className="w-10 h-10 mb-3 text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">
                    {accept.replace(/\./g, '').toUpperCase()} (Max. {maxSizeInMB}MB)
                  </p>

                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    ref={fileInputRef}
                    accept={accept}
                    onChange={handleFileChange}
                  />

                  <Button size="sm" color="light" className="mt-4" onClick={triggerFileInputClick}>
                    <HiUpload className="mr-2 h-4 w-4" />
                    {buttonText}
                  </Button>
                </>
              ) : success ? (
                <div className="text-center">
                  <HiCheck className="w-10 h-10 mb-3 text-green-500 mx-auto" />
                  <p className="text-sm text-green-600 font-medium">File uploaded successfully!</p>
                </div>
              ) : (
                <div className="w-full max-w-md">
                  <p className="mb-2 text-sm text-gray-700 text-center">Uploading file...</p>
                  <Progress progress={uploadProgress} size="lg" />
                  <p className="mt-2 text-xs text-gray-500 text-center">
                    {uploadProgress}% complete
                  </p>
                </div>
              )}
            </div>

            {selectedFile && !uploading && !success && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    <span className="font-medium">{selectedFile.name}</span>
                    <span className="ml-2 text-gray-500">
                      ({formatFileSize(selectedFile.size)})
                    </span>
                  </div>
                  <Button
                    size="xs"
                    color="light"
                    onClick={() => {
                      setSelectedFile(null);
                      if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                      }
                    }}
                  >
                    <HiXCircle className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          {helperText && !fileError && <p className="mt-1 text-sm text-gray-500">{helperText}</p>}
        </>
      )}

      {/* Error message */}
      {fileError && (
        <Alert color="failure" className="mt-2">
          <div className="flex items-center">
            <HiExclamationCircle className="h-5 w-5 mr-2" />
            <span className="text-sm">{fileError}</span>
          </div>
        </Alert>
      )}
    </div>
  );
};

export default FileUploader;
