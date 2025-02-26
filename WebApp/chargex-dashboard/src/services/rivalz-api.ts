/**
 * Rivalz.ai API Service
 * 
 * This service handles all interactions with the Rivalz.ai API for telemetry data,
 * AI predictions, and other battery-related analytics.
 */

// Base URL for Rivalz API
const RIVALZ_API_URL = process.env.RIVALZ_API_URL || 'https://api.rivalz.ai/v1';
const RIVALZ_API_KEY = process.env.RIVALZ_API_KEY;

// Check if API key is configured
if (!RIVALZ_API_KEY) {
  console.warn('RIVALZ_API_KEY is not defined in environment variables. Rivalz API calls will fail.');
}

/**
 * Send telemetry data to Rivalz.ai
 */
export async function sendTelemetryData(data: any) {
  try {
    const response = await fetch(`${RIVALZ_API_URL}/telemetry`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RIVALZ_API_KEY}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to send telemetry data: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending telemetry data to Rivalz:', error);
    throw error;
  }
}

/**
 * Get battery health prediction from Rivalz.ai
 */
export async function getBatteryHealthPrediction(batteryId: string) {
  try {
    const response = await fetch(`${RIVALZ_API_URL}/predictions/battery/${batteryId}/health`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${RIVALZ_API_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get battery health prediction: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting battery health prediction from Rivalz:', error);
    throw error;
  }
}

/**
 * Get battery maintenance prediction from Rivalz.ai
 */
export async function getBatteryMaintenancePrediction(batteryId: string) {
  try {
    const response = await fetch(`${RIVALZ_API_URL}/predictions/battery/${batteryId}/maintenance`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${RIVALZ_API_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get battery maintenance prediction: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting battery maintenance prediction from Rivalz:', error);
    throw error;
  }
}

/**
 * Get battery efficiency prediction from Rivalz.ai
 */
export async function getBatteryEfficiencyPrediction(batteryId: string) {
  try {
    const response = await fetch(`${RIVALZ_API_URL}/predictions/battery/${batteryId}/efficiency`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${RIVALZ_API_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get battery efficiency prediction: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting battery efficiency prediction from Rivalz:', error);
    throw error;
  }
}

/**
 * Get battery location history from Rivalz.ai
 */
export async function getBatteryLocationHistory(batteryId: string, startDate: string, endDate: string) {
  try {
    const response = await fetch(
      `${RIVALZ_API_URL}/telemetry/battery/${batteryId}/location?startDate=${startDate}&endDate=${endDate}`, 
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${RIVALZ_API_KEY}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to get battery location history: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting battery location history from Rivalz:', error);
    throw error;
  }
}

/**
 * Get aggregated fleet analytics from Rivalz.ai
 */
export async function getFleetAnalytics(params: any) {
  try {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${RIVALZ_API_URL}/analytics/fleet?${queryString}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${RIVALZ_API_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get fleet analytics: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting fleet analytics from Rivalz:', error);
    throw error;
  }
}
