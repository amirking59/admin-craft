import { useEffect } from 'react';

export const useOnDocumentVisible = (cb: () => void) => {
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) cb?.();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);
};
