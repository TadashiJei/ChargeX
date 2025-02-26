'use client';

import { useState, useEffect } from 'react';
import { websocketService } from '@/services/websocket-service';
import { GlowingEffect } from '@/components/ui/GlowingEffect';

interface BatteryTelemetry {
  batteryId: string;
  serialNumber: string;
  chargeLevel: number;
  temperature: number;
  voltage: number;
  current: number;
  power: number;
  health: number;
  status: string;
  timestamp: string;
}

interface Alert {
  id: string;
  batteryId: string;
  serialNumber: string;
  type: string;
  severity: 'low' | 'medium' | 'high';
  message: string;
  timestamp: string;
  acknowledged: boolean;
}

const BatteryMonitor = () => {
  const [batteries, setBatteries] = useState<any[]>([]);
  const [selectedBattery, setSelectedBattery] = useState<string | null>(null);
  const [telemetry, setTelemetry] = useState<BatteryTelemetry | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  // Fetch all batteries
  const fetchBatteries = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/batteries');
      
      if (!response.ok) {
        throw new Error('Failed to fetch batteries');
      }
      
      const data = await response.json();
      setBatteries(data.batteries);
      
      // Select the first battery by default
      if (data.batteries.length > 0 && !selectedBattery) {
        setSelectedBattery(data.batteries[0]._id);
      }
    } catch (error) {
      console.error('Error fetching batteries:', error);
      setError('Failed to load batteries. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch initial telemetry for a battery
  const fetchInitialTelemetry = async (batteryId: string) => {
    try {
      const response = await fetch(`/api/batteries/${batteryId}/telemetry`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch telemetry');
      }
      
      const data = await response.json();
      setTelemetry(data.telemetry);
    } catch (error) {
      console.error('Error fetching telemetry:', error);
      setError('Failed to load telemetry. Please try again later.');
    }
  };

  // Fetch alerts for a battery
  const fetchAlerts = async (batteryId: string) => {
    try {
      const response = await fetch(`/api/batteries/${batteryId}/alerts`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch alerts');
      }
      
      const data = await response.json();
      setAlerts(data.alerts);
    } catch (error) {
      console.error('Error fetching alerts:', error);
      setError('Failed to load alerts. Please try again later.');
    }
  };

  // Acknowledge an alert
  const acknowledgeAlert = async (alertId: string) => {
    try {
      const response = await fetch(`/api/alerts/${alertId}/acknowledge`, {
        method: 'POST'
      });
      
      if (!response.ok) {
        throw new Error('Failed to acknowledge alert');
      }
      
      // Update the alerts list
      setAlerts(prevAlerts => 
        prevAlerts.map(alert => 
          alert.id === alertId 
            ? { ...alert, acknowledged: true } 
            : alert
        )
      );
    } catch (error) {
      console.error('Error acknowledging alert:', error);
      setError('Failed to acknowledge alert. Please try again.');
    }
  };

  // Handle battery selection
  const handleBatterySelect = (batteryId: string) => {
    if (selectedBattery) {
      // Unsubscribe from current battery telemetry
      websocketService.unsubscribeFromBatteryTelemetry(selectedBattery);
    }
    
    setSelectedBattery(batteryId);
    fetchInitialTelemetry(batteryId);
    fetchAlerts(batteryId);
    
    // Subscribe to new battery telemetry
    websocketService.subscribeToBatteryTelemetry(batteryId);
  };

  // Handle WebSocket connection
  useEffect(() => {
    // Subscribe to connection status
    const unsubscribeConnection = websocketService.on('connection', (data: any) => {
      setIsConnected(data.status === 'connected');
    });
    
    // Subscribe to telemetry updates
    const unsubscribeTelemetry = websocketService.on('telemetry', (data: BatteryTelemetry) => {
      if (data.batteryId === selectedBattery) {
        setTelemetry(data);
      }
    });
    
    // Subscribe to alerts
    const unsubscribeAlerts = websocketService.on('alert', (data: Alert) => {
      if (data.batteryId === selectedBattery) {
        setAlerts(prevAlerts => [data, ...prevAlerts]);
      }
    });
    
    // Connect to WebSocket server
    websocketService.connect();
    websocketService.subscribeToAlerts();
    
    // Subscribe to selected battery telemetry
    if (selectedBattery) {
      websocketService.subscribeToBatteryTelemetry(selectedBattery);
    }
    
    // Cleanup on unmount
    return () => {
      unsubscribeConnection();
      unsubscribeTelemetry();
      unsubscribeAlerts();
      
      if (selectedBattery) {
        websocketService.unsubscribeFromBatteryTelemetry(selectedBattery);
      }
      
      websocketService.unsubscribeFromAlerts();
      websocketService.disconnect();
    };
  }, [selectedBattery]);

  // Load batteries on mount
  useEffect(() => {
    fetchBatteries();
  }, []);

  return (
    <div className="space-y-6 p-6 relative">
      <GlowingEffect
        blur={20}
        disabled={false}
        glow
        className="absolute inset-0"
        variant="white"
        spread={80}
      />
      
      <div className="relative z-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Battery Monitoring</h1>
          
          <div className="flex items-center">
            <span className={`w-3 h-3 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
            <span className="text-sm">{isConnected ? 'Connected' : 'Disconnected'}</span>
          </div>
        </div>
        
        {error && (
          <div className="bg-red-500/20 backdrop-blur-sm p-4 rounded-lg mb-6">
            <p className="text-red-300">{error}</p>
            <button 
              className="text-white underline mt-2"
              onClick={() => setError('')}
            >
              Dismiss
            </button>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Battery List */}
          <div className="bg-gray-800/40 backdrop-blur-sm p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Batteries</h2>
            
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
              </div>
            ) : batteries.length === 0 ? (
              <p className="text-gray-400">No batteries available.</p>
            ) : (
              <div className="space-y-2">
                {batteries.map((battery) => (
                  <div 
                    key={battery._id}
                    className={`p-3 rounded-lg cursor-pointer transition-all ${
                      selectedBattery === battery._id 
                        ? 'bg-orange-500/20 border border-orange-500/50' 
                        : 'bg-gray-700/50 hover:bg-gray-700/70'
                    }`}
                    onClick={() => handleBatterySelect(battery._id)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">{battery.manufacturer}</h3>
                        <p className="text-sm text-gray-300">{battery.serialNumber}</p>
                      </div>
                      <div className="text-right">
                        <span className={`inline-block px-2 py-1 rounded text-xs ${
                          battery.status === 'active' 
                            ? 'bg-green-500/20 text-green-300' 
                            : battery.status === 'inactive'
                            ? 'bg-gray-500/20 text-gray-300'
                            : 'bg-red-500/20 text-red-300'
                        }`}>
                          {battery.status}
                        </span>
                        <p className="text-sm text-gray-300 mt-1">{battery.chargeLevel}%</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Telemetry Data */}
          <div className="bg-gray-800/40 backdrop-blur-sm p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Real-Time Telemetry</h2>
            
            {!selectedBattery ? (
              <p className="text-gray-400">Select a battery to view telemetry.</p>
            ) : !telemetry ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Charge Level */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-300">Charge Level</span>
                    <span className="text-sm font-medium">{telemetry.chargeLevel}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2.5">
                    <div 
                      className="bg-orange-500 h-2.5 rounded-full" 
                      style={{ width: `${telemetry.chargeLevel}%` }}
                    ></div>
                  </div>
                </div>
                
                {/* Battery Health */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-300">Battery Health</span>
                    <span className="text-sm font-medium">{telemetry.health}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2.5">
                    <div 
                      className={`h-2.5 rounded-full ${
                        telemetry.health > 80 
                          ? 'bg-green-500' 
                          : telemetry.health > 50 
                          ? 'bg-yellow-500' 
                          : 'bg-red-500'
                      }`}
                      style={{ width: `${telemetry.health}%` }}
                    ></div>
                  </div>
                </div>
                
                {/* Other Telemetry Data */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-700/50 backdrop-blur-sm p-3 rounded-lg">
                    <span className="text-sm text-gray-300">Temperature</span>
                    <p className="text-lg font-medium">{telemetry.temperature}°C</p>
                  </div>
                  
                  <div className="bg-gray-700/50 backdrop-blur-sm p-3 rounded-lg">
                    <span className="text-sm text-gray-300">Voltage</span>
                    <p className="text-lg font-medium">{telemetry.voltage}V</p>
                  </div>
                  
                  <div className="bg-gray-700/50 backdrop-blur-sm p-3 rounded-lg">
                    <span className="text-sm text-gray-300">Current</span>
                    <p className="text-lg font-medium">{telemetry.current}A</p>
                  </div>
                  
                  <div className="bg-gray-700/50 backdrop-blur-sm p-3 rounded-lg">
                    <span className="text-sm text-gray-300">Power</span>
                    <p className="text-lg font-medium">{telemetry.power}W</p>
                  </div>
                </div>
                
                <div className="text-sm text-gray-400">
                  Last updated: {new Date(telemetry.timestamp).toLocaleString()}
                </div>
              </div>
            )}
          </div>
          
          {/* Alerts */}
          <div className="bg-gray-800/40 backdrop-blur-sm p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Alerts</h2>
            
            {!selectedBattery ? (
              <p className="text-gray-400">Select a battery to view alerts.</p>
            ) : alerts.length === 0 ? (
              <p className="text-gray-400">No alerts for this battery.</p>
            ) : (
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                {alerts.map((alert) => (
                  <div 
                    key={alert.id}
                    className={`p-3 rounded-lg border ${
                      alert.severity === 'high' 
                        ? 'bg-red-500/20 border-red-500/50' 
                        : alert.severity === 'medium'
                        ? 'bg-yellow-500/20 border-yellow-500/50'
                        : 'bg-blue-500/20 border-blue-500/50'
                    } ${alert.acknowledged ? 'opacity-60' : ''}`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{alert.type}</h3>
                        <p className="text-sm text-gray-300 mt-1">{alert.message}</p>
                        <p className="text-xs text-gray-400 mt-2">
                          {new Date(alert.timestamp).toLocaleString()}
                        </p>
                      </div>
                      
                      {!alert.acknowledged && (
                        <button 
                          className="bg-gray-700/50 hover:bg-gray-700/70 text-xs px-2 py-1 rounded"
                          onClick={() => acknowledgeAlert(alert.id)}
                        >
                          Acknowledge
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BatteryMonitor;
