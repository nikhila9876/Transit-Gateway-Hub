/**
 * Global Frontend Configuration & Demo Mock Mode Controller
 *
 * Controls whether CloudNexus frontend operates in DEMO / MOCK DATA mode
 * or connects directly to the live Spring Boot backend & AWS SDK APIs.
 *
 * Configuration switch:
 * - VITE_USE_MOCK_DATA=true (in .env or environment)
 * - Can also be overridden at runtime via localStorage ('cloudnexus_use_mock_data')
 */

export const isMockMode = () => {
  // 1. Check runtime localStorage override if set
  if (typeof window !== 'undefined') {
    const localOverride = localStorage.getItem('cloudnexus_use_mock_data');
    if (localOverride === 'true') return true;
    if (localOverride === 'false') return false;
  }

  // 2. Check environment variable switch VITE_USE_MOCK_DATA
  const envMock = import.meta.env.VITE_USE_MOCK_DATA;
  if (envMock === 'false' || envMock === false || envMock === '0') {
    return false;
  }
  if (envMock === true || envMock === 'true' || envMock === '1') {
    return true;
  }

  // 3. Fallback flag if explicitly disabled
  const envFallback = import.meta.env.VITE_ENABLE_MOCK_FALLBACK;
  if (envFallback === 'false' || envFallback === false) {
    return false;
  }

  // Default to true for frontend review/demo out-of-the-box
  return true;
};

export const setMockMode = (enabled) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('cloudnexus_use_mock_data', enabled ? 'true' : 'false');
    window.dispatchEvent(
      new CustomEvent('cloudnexus:mock_mode_changed', { detail: { enabled } })
    );
  }
};

export default {
  isMockMode,
  setMockMode,
};
