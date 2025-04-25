import React, { useState, useEffect, useRef } from 'react';
import { Progress, Card, Alert } from 'flowbite-react';
import { HiInformationCircle } from 'react-icons/hi';
import websocketService, { WebSocketEventType } from '../../../api/websocketService';
import { ImportProgressResponse, JobStatus, importExportApi } from '../../../api/importExportApi';

// Define the expected color prop type for Flowbite components
type FlowbiteColor = 'blue' | 'gray' | 'failure' | 'success' | 'warning' | 'info' | 'dark';

interface ImportProgressTrackerProps {
  jobId: string | null;
  onComplete: (jobId: string, status: JobStatus, errors?: any[]) => void;
  onError: (jobId: string, message: string) => void;
}

// Define a type for the error object within ImportProgressResponse
interface ImportError {
  row: number;
  field?: string;
  message: string;
}

const ImportProgressTracker: React.FC<ImportProgressTrackerProps> = ({ jobId, onComplete, onError }) => {
  const [progress, setProgress] = useState<ImportProgressResponse | null>(null);
  const [lastMessage, setLastMessage] = useState<string | null>(null);
  const hasCompleted = useRef(false);

  useEffect(() => {
    if (!jobId) {
      setProgress(null);
      setLastMessage(null);
      hasCompleted.current = false;
      return;
    }

    let isSubscribed = true;
    hasCompleted.current = false;
    setLastMessage('Connecting for progress updates...'); // Initial message
    setProgress(null);

    const handleProgress = (data: ImportProgressResponse) => {
      if (!isSubscribed || data.jobId !== jobId) return;

      setProgress(data);
      setLastMessage(data.message || `Processing: ${data.processedRecords ?? 0}/${data.totalRecords ?? 'unknown'}`);

      if ((data.status === 'completed' || data.status === 'failed') && !hasCompleted.current) {
        hasCompleted.current = true;
        onComplete(jobId, data.status, data.errors);
      }
    };

    const fetchInitialProgress = async () => {
      try {
        const initialData = await importExportApi.getImportProgress(jobId);
        if (isSubscribed && !hasCompleted.current) {
          handleProgress(initialData);
        }
      } catch (error: any) {
        console.error("Error fetching initial import progress:", error);
        if (isSubscribed) {
          const errorMsg = `Failed to fetch progress: ${error.message}`;
          setLastMessage(errorMsg);
          onError(jobId, errorMsg);
        }
      }
    };

    fetchInitialProgress();

    websocketService.connect() // Ensure connection before subscribing
        .then(() => {
            if (isSubscribed) {
                websocketService.subscribeToJobProgress(jobId, WebSocketEventType.IMPORT_PROGRESS, handleProgress);
            }
        })
        .catch((err: Error) => {
            console.error("Websocket connection failed:", err);
            if (isSubscribed) {
                 const errorMsg = 'Failed to connect for real-time updates.';
                 setLastMessage(errorMsg);
                 onError(jobId, errorMsg);
             }
        });

    return () => {
      isSubscribed = false;
      websocketService.unsubscribeFromJobProgress(jobId, WebSocketEventType.IMPORT_PROGRESS, handleProgress);
    };
  }, [jobId, onComplete, onError]);

  if (!jobId) {
    return null;
  }

  const percent = progress?.percentComplete ?? 0;
  const status = progress?.status ?? 'queued';
  
  // Map JobStatus to FlowbiteColor
  const statusColor: FlowbiteColor = 
      status === 'failed' ? 'failure' :
      status === 'cancelled' ? 'warning' :
      status === 'completed' ? 'success' :
      'info'; // Default for queued/processing

  return (
    <Card className="mt-4">
      <h5 className="text-lg font-medium mb-2 text-gray-900 dark:text-white">Import Progress (Job ID: {jobId})</h5>
      {lastMessage && (
        <Alert color={statusColor} icon={HiInformationCircle} rounded className="mb-3">
          <span>
            <span className="font-medium capitalize">{status}:</span> {lastMessage}
          </span>
        </Alert>
      )}
      <Progress
        progress={percent}
        size="lg"
        labelProgress={true}
        color={statusColor}
      />
      {status === 'failed' && progress?.errors && progress.errors.length > 0 && (
        <div className="mt-3 p-3 bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-600 rounded">
          <p className="font-semibold text-red-700 dark:text-red-200">Import Errors ({progress.errors.length}):</p>
          <ul className="list-disc list-inside text-sm text-red-600 dark:text-red-300 max-h-32 overflow-y-auto mt-1">
            {progress.errors.map((err: ImportError, index: number) => (
              <li key={index}>
                Row {err.row}: {err.message} {err.field ? <span className="font-mono text-xs bg-red-200 dark:bg-red-700 px-1 rounded">{err.field}</span> : ''}
              </li>
            ))}
          </ul>
        </div>
      )}
      {status === 'completed' && !progress?.errors?.length && (
        <p className="text-green-600 dark:text-green-400 font-medium mt-2">Import completed successfully!</p>
      )}
    </Card>
  );
};

export default ImportProgressTracker;