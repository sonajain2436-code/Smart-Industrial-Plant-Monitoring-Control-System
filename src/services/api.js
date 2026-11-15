const API_BASE = '/api';

export async function fetchPlantStatus() {
  try {
    const res = await fetch(`${API_BASE}/plant/status`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn("Backend API unavailable, utilizing client engine:", err);
    return null;
  }
}

export async function sendPlantControl(action, payload = {}) {
  try {
    const res = await fetch(`${API_BASE}/plant/control`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, payload })
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn("Control request failed:", err);
    return null;
  }
}

export async function fetchAlerts(status = null, department = null) {
  try {
    let url = `${API_BASE}/alerts`;
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (department) params.append('department', department);
    if (params.toString()) url += `?${params.toString()}`;
    
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn("Alerts fetch failed:", err);
    return null;
  }
}

export async function ackAlert(alertId) {
  try {
    const res = await fetch(`${API_BASE}/alerts/${alertId}/acknowledge`, { method: 'POST' });
    return await res.json();
  } catch (err) {
    console.warn("Ack alert failed:", err);
    return null;
  }
}

export async function resAlert(alertId) {
  try {
    const res = await fetch(`${API_BASE}/alerts/${alertId}/resolve`, { method: 'POST' });
    return await res.json();
  } catch (err) {
    console.warn("Resolve alert failed:", err);
    return null;
  }
}

export async function injectSimFault(faultType) {
  try {
    const res = await fetch(`${API_BASE}/faults/inject`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fault_type: faultType })
    });
    return await res.json();
  } catch (err) {
    console.warn("Fault injection failed:", err);
    return null;
  }
}

export async function clearSimFault(faultType = null) {
  try {
    const res = await fetch(`${API_BASE}/faults/clear`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fault_type: faultType })
    });
    return await res.json();
  } catch (err) {
    console.warn("Fault clear failed:", err);
    return null;
  }
}

export async function fetchAnalyticsData(timeframe = '24h') {
  try {
    const res = await fetch(`${API_BASE}/analytics?timeframe=${timeframe}`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn("Analytics fetch failed:", err);
    return null;
  }
}

export async function fetchSettings() {
  try {
    const res = await fetch(`${API_BASE}/settings`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn("Settings fetch failed:", err);
    return null;
  }
}

export async function saveSettings(settings) {
  try {
    const res = await fetch(`${API_BASE}/settings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    });
    return await res.json();
  } catch (err) {
    console.warn("Settings save failed:", err);
    return null;
  }
}
