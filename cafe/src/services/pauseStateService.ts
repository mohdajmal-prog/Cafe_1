/**
 * App Pause Service - Backend Integration
 * Handles global app pause state synchronization via backend API
 */

import { API_BASE_URL } from '../constants/api';

export interface PauseState {
  isAppPaused: boolean;
  pauseReason: string;
  pausedAt?: string;
  resumedAt?: string;
  adminId?: string;
}

export const pauseStateService = {
  /**
   * Get current pause state from backend API
   * Used to sync pause state across all connected clients
   */
  async getPauseState(): Promise<PauseState> {
    try {
      const res = await fetch(`${API_BASE_URL}/pause`);
      if (!res.ok) {
        console.debug('Pause state API returned non-OK, using default state');
        return { isAppPaused: false, pauseReason: '' };
      }
      const data = await res.json();
      return {
        isAppPaused: data.is_app_paused,
        pauseReason: data.pause_reason || '',
        pausedAt: data.paused_at,
        resumedAt: data.resumed_at,
        adminId: data.admin_id,
      };
    } catch (error: any) {
      console.debug('Failed to fetch pause state from API, returning default state:', error?.message || error);
      return { isAppPaused: false, pauseReason: '' };
    }
  },

  /**
   * Set app pause state
   * @param paused - Whether to pause the app
   * @param reason - Reason for pause (optional)
   * @param adminId - ID of admin who triggered pause
   */
  async setPauseState(
    paused: boolean,
    reason: string = '',
    adminId?: string
  ): Promise<PauseState> {
    try {
      const res = await fetch(`${API_BASE_URL}/pause`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          is_app_paused: paused,
          pause_reason: reason,
          paused_at: paused ? new Date().toISOString() : null,
          resumed_at: !paused ? new Date().toISOString() : null,
          admin_id: adminId,
        }),
      });

      if (!res.ok) throw new Error(`Pause API error: ${res.status}`);
      const data = await res.json();
      return {
        isAppPaused: data.is_app_paused,
        pauseReason: data.pause_reason || '',
        pausedAt: data.paused_at,
        resumedAt: data.resumed_at,
        adminId: data.admin_id,
      };
    } catch (error) {
      console.error('Pause state update failed:', error);
      throw error;
    }
  },

  /**
   * Pause the app
   * @param reason - Custom pause reason
   * @param adminId - Admin who initiated pause
   */
  async pauseApp(reason: string = 'Updating stock items', adminId?: string): Promise<PauseState> {
    return this.setPauseState(true, reason, adminId);
  },

  /**
   * Resume the app
   * @param adminId - Admin who initiated resume
   */
  async resumeApp(adminId?: string): Promise<PauseState> {
    return this.setPauseState(false, '', adminId);
  },

  /**
   * Get pause history for analytics
   * Shows all pause/resume events with timestamps and reasons
   */
  async getPauseHistory(limit: number = 50): Promise<Array<PauseState & { eventType: 'paused' | 'resumed' }>> {
    try {
      const res = await fetch(`${API_BASE_URL}/pause/history?limit=${limit}`);
      if (!res.ok) {
        console.error('Error fetching pause history from API');
        return [];
      }
      const data = await res.json();
      const history = (data || []).map((record: any) => ({
        isAppPaused: record.is_app_paused,
        pauseReason: record.pause_reason || '',
        pausedAt: record.paused_at,
        resumedAt: record.resumed_at,
        adminId: record.admin_id,
        eventType: record.is_app_paused ? 'paused' : 'resumed',
      }));
      return history;
    } catch (error) {
      console.error('Failed to fetch pause history from API:', error);
      return [];
    }
  },

  /**
   * Subscribe to pause state changes (Real-time)
   * For real-time pause/resume notifications across all devices
   * @param onStateChange - Callback when pause state changes
   * @param onError - Error callback
   * @returns Unsubscribe function
   */
  subscribeToStateChanges(
    onStateChange: (state: PauseState) => void,
    onError?: (error: Error) => void
  ): () => void {
    // Polling fallback - check every 30 seconds
    const interval = setInterval(async () => {
      try {
        const state = await this.getPauseState();
        onStateChange(state);
      } catch (error) {
        onError?.(error as Error);
      }
    }, 30000);

    return () => clearInterval(interval);
  },
};

