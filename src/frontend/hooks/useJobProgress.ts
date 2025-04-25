import { useState, useEffect, useRef } from 'react';

export interface JobStatus {
  jobId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  message?: string;
  result?: {
    downloadUrl?: string;
    [key: string]: any;
  };
  error?: string;
}

interface UseJobProgressOptions {
  jobId: string;
  endpoint: string;
  pollingInterval?: number;
  useWebSocket?: boolean;
  onComplete?: (result: any) => void;
  onError?: (error: string) => void;
}

/**
 * Hook for tracking job progress in real-time
 * Can use WebSockets (preferred) or polling as a fallback
 */
const useJobProgress = ({
  jobId,
  endpoint,
  pollingInterval = 2000,
  useWebSocket = true,
  onComplete,
  onError,
}: UseJobProgressOptions) => {
  const [jobStatus, setJobStatus] = useState<JobStatus>({
    jobId,
    status: 'pending',
    progress: 0,
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const ws = useRef<WebSocket | null>(null);
  const pollingTimeout = useRef<NodeJS.Timeout | null>(null);
  
  // Cleanup function for both WebSocket and polling
  const cleanup = () => {
    if (ws.current) {
      ws.current.close();
      ws.current = null;
    }
    
    if (pollingTimeout.current) {
      clearTimeout(pollingTimeout.current);
      pollingTimeout.current = null;
    }
  };
  
  // Poll for job status
  const pollJobStatus = async () => {
    try {
      const response = await fetch(`${endpoint}/${jobId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch job status');
      }
      
      const data = await response.json();
      setJobStatus(data);
      setIsLoading(false);
      
      // Handle job completion or failure
      if (data.status === 'completed') {
        if (onComplete) onComplete(data.result);
      } else if (data.status === 'failed') {
        if (onError) onError(data.error || 'Job failed');
        setError(data.error || 'Job failed');
      } else {
        // Continue polling if job is still in progress
        pollingTimeout.current = setTimeout(pollJobStatus, pollingInterval);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      setIsLoading(false);
      if (onError) onError(errorMessage);
    }
  };
  
  // Initialize WebSocket or polling
  useEffect(() => {
    if (!jobId) return;
    
    setIsLoading(true);
    setError(null);
    
    if (useWebSocket) {
      // Use WebSocket for real-time updates
      try {
        const wsProtocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
        const wsEndpoint = `${wsProtocol}://${window.location.host}/api/ws/jobs/${jobId}`;
        
        ws.current = new WebSocket(wsEndpoint);
        
        ws.current.onopen = () => {
          console.log(`WebSocket connection established for job ${jobId}`);
        };
        
        ws.current.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            setJobStatus(data);
            setIsLoading(false);
            
            // Handle job completion or failure
            if (data.status === 'completed') {
              if (onComplete) onComplete(data.result);
              cleanup();
            } else if (data.status === 'failed') {
              if (onError) onError(data.error || 'Job failed');
              setError(data.error || 'Job failed');
              cleanup();
            }
          } catch (err) {
            console.error('Error parsing WebSocket message:', err);
          }
        };
        
        ws.current.onerror = (error) => {
          console.error('WebSocket error:', error);
          // Fall back to polling on WebSocket error
          if (ws.current) {
            ws.current.close();
            ws.current = null;
            
            // Start polling as fallback
            pollJobStatus();
          }
        };
        
        ws.current.onclose = () => {
          console.log(`WebSocket connection closed for job ${jobId}`);
        };
      } catch (err) {
        console.error('Error initializing WebSocket:', err);
        // Fall back to polling on WebSocket initialization error
        pollJobStatus();
      }
    } else {
      // Use polling as a fallback
      pollJobStatus();
    }
    
    // Clean up on unmount
    return cleanup;
  }, [jobId, endpoint, useWebSocket, pollingInterval, onComplete, onError]);
  
  return { jobStatus, isLoading, error };
};

export default useJobProgress; 