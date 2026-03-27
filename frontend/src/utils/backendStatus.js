// Backend Status Checker
// This utility helps check if the backend API is available

import api from '../services/api';

export const checkBackendStatus = async () => {
  try {
    // Try to make a simple request to check if backend is available
    await api.get('/health');
    return { available: true, message: 'Backend is available' };
  } catch (error) {
    if (error.code === 'ERR_NETWORK' || error.response?.status >= 500) {
      return { 
        available: false, 
        message: 'Backend is unavailable - using local storage',
        error: error.message 
      };
    }
    return { 
      available: true, 
      message: 'Backend is available (authentication may be required)',
      error: error.message 
    };
  }
};

export const getBackendStatusMessage = (status) => {
  if (status.available) {
    return {
      severity: 'success',
      message: '✅ Connected to database',
      color: 'success'
    };
  } else {
    return {
      severity: 'warning',
      message: '⚠️ Using local storage (backend unavailable)',
      color: 'warning'
    };
  }
};

// Check backend status and update UI accordingly
export const updateBackendStatus = async (setStatus) => {
  const status = await checkBackendStatus();
  setStatus(getBackendStatusMessage(status));
  return status;
};
