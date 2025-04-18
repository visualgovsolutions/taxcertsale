import { ReactNode } from 'react';

interface NotFoundProps {
  children?: ReactNode;
}

function NotFound({ children }: NotFoundProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
      <h1 className="mb-4 text-4xl font-bold">404 Not Found</h1>
      {children || (
        <a href="/" className="px-5 py-2.5 text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 rounded-lg">
          Go Home
        </a>
      )}
    </div>
  );
}

export default NotFound; 