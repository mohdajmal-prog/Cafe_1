import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { pauseStateService } from '../services/pauseStateService';

interface AppPauseContextType {
  isAppPaused: boolean;
  pauseReason: string;
  togglePause: (reason?: string) => void;
  setPauseStatus: (paused: boolean, reason?: string) => void;
  isSynced: boolean;
  syncError: string | null;
}

const AppPauseContext = createContext<AppPauseContextType | undefined>(undefined);

export function AppPauseProvider({ children }: { children: React.ReactNode }) {
  const [isAppPaused, setIsAppPaused] = useState(false);
  const [pauseReason, setPauseReasonState] = useState('');
  const [isSynced, setIsSynced] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  
  const unsubscribeRef = useRef<(() => void) | null>(null);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize pause state from backend and set up sync
  useEffect(() => {
    let isMounted = true;

    const initializePauseState = async () => {
      try {
        const state = await pauseStateService.getPauseState();
        if (isMounted) {
          setIsAppPaused(state.paused || false);
          setPauseReasonState(state.reason || '');
          setIsSynced(true);
          setSyncError(null);
        }
      } catch (error) {
        if (isMounted) {
          console.warn('Failed to initialize pause state, using local state:', error);
          setIsSynced(false);
          setSyncError(null); // Don't show error to user, just use local state
        }
      }
    };

    initializePauseState();

    // Set up polling interval (5 seconds)
    pollIntervalRef.current = setInterval(() => {
      syncPauseState().catch((error) => {
        // Silently fail - don't spam console
        console.debug('Pause state sync failed:', error);
      });
    }, 5000);

    // Set up WebSocket subscription for real-time updates
    try {
      unsubscribeRef.current = pauseStateService.subscribeToStateChanges(
        (state) => {
          if (isMounted) {
            setIsAppPaused(state.paused || false);
            setPauseReasonState(state.reason || '');
            setIsSynced(true);
            setSyncError(null);
          }
        },
        (error) => {
          // WebSocket error - not fatal, polling will handle it
          console.debug('WebSocket error, falling back to polling:', error);
          if (isMounted) {
            setSyncError(null); // Don't show user-facing error
          }
        }
      );
    } catch (error) {
      console.debug('Failed to set up WebSocket subscription:', error);
    }

    // Cleanup function
    return () => {
      isMounted = false;
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, []);

  // Sync pause state from backend
  const syncPauseState = useCallback(async () => {
    try {
      const state = await pauseStateService.getPauseState();
      setIsAppPaused(state.paused);
      setPauseReasonState(state.reason || '');
      setIsSynced(true);
      setSyncError(null);
    } catch (error) {
      console.error('Error syncing pause state:', error);
      setSyncError('Sync failed');
    }
  }, []);

  const togglePause = useCallback(async (reason: string = '') => {
    try {
      const newState = !isAppPaused;
      // Try to sync with backend, but don't fail if it's unavailable
      pauseStateService.setPauseState(newState, reason || 'Manual toggle').catch((error) => {
        console.debug('Failed to sync pause toggle with backend:', error);
      });
      // Update local state immediately
      setIsAppPaused(newState);
      setPauseReasonState(reason);
      setSyncError(null);
    } catch (error) {
      console.error('Failed to toggle pause:', error);
      // Still update local state even if backend fails
      setIsAppPaused((prev) => !prev);
    }
  }, [isAppPaused]);

  const setPauseStatus = useCallback(async (paused: boolean, reason: string = '') => {
    try {
      // Try to sync with backend, but don't fail if it's unavailable
      pauseStateService.setPauseState(paused, reason || 'Status update').catch((error) => {
        console.debug('Failed to sync pause status with backend:', error);
      });
      // Update local state immediately
      setIsAppPaused(paused);
      setPauseReasonState(reason);
      setSyncError(null);
    } catch (error) {
      console.error('Failed to set pause status:', error);
      // Still update local state even if backend fails
      setIsAppPaused(paused);
      setPauseReasonState(reason);
    }
  }, []);

  return (
    <AppPauseContext.Provider
      value={{
        isAppPaused,
        pauseReason,
        togglePause,
        setPauseStatus,
        isSynced,
        syncError,
      }}
    >
      {children}
    </AppPauseContext.Provider>
  );
}

export function useAppPause() {
  const context = useContext(AppPauseContext);
  if (!context) {
    throw new Error('useAppPause must be used within AppPauseProvider');
  }
  return context;
}
