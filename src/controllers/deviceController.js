// Mock data for devices
const devices = [];

// Generate mock devices
for (let i = 1; i <= 20; i++) {
  const statuses = ['success', 'pending', 'failed'];
  const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
  const randomDays = Math.floor(Math.random() * 7);
  const lastSync = new Date();
  lastSync.setDate(lastSync.getDate() - randomDays);

  const idNumber = 122 + i;
  const deviceId = `PBX${String(idNumber).padStart(5, '0')}`;
  
  devices.push({
    id: deviceId,
    lastSyncTime: lastSync.toISOString(),
    status: randomStatus
  });
}

// Mock error logs
const errorLogs = [
  {
    id: 'PBX00124',
    timestamp: new Date('2025-08-27').toISOString(),
    message: 'Connection Timeout',
  },
  {
    id: 'PBX00156',
    timestamp: new Date('2025-08-26').toISOString(),
    message: 'Storage Full',
  },
  {
    id: 'PBX00178',
    timestamp: new Date('2025-08-25').toISOString(),
    message: 'Unknown Sync Error',
  },
  {
    id: 'PBX00182',
    timestamp: new Date('2025-08-24').toISOString(),
    message: 'Authentication Failure',
  },
  {
    id: 'PBX00191',
    timestamp: new Date('2025-08-23').toISOString(),
    message: 'Server Not Reachable',
  }
];

// Get all devices
exports.getDevices = (req, res) => {
  try {
    res.status(200).json(devices);
  } catch (error) {
    console.error('Error fetching devices:', error);
    res.status(500).json({ error: 'Failed to fetch devices' });
  }
};

// Trigger sync for a device
exports.triggerSync = (req, res) => {
  try {
    const { deviceId } = req.params;
    const device = devices.find(d => d.id === deviceId);
    
    if (!device) {
      return res.status(404).json({ error: 'Device not found' });
    }
    
    // Simulate sync operation
    setTimeout(() => {
      const isSuccess = Math.random() > 0.3; // 70% success rate
      const newStatus = isSuccess ? 'success' : 'failed';
      
      // Update device status
      device.status = newStatus;
      device.lastSyncTime = new Date().toISOString();
      
      // If sync failed, add to error logs
      if (!isSuccess) {
        errorLogs.unshift({
          id: `log-${Date.now()}`,
          deviceId: device.id,
          timestamp: new Date().toISOString(),
          errorCode: `SYNC_ERR_${Math.floor(100 + Math.random() * 900)}`,
          message: 'Sync failed',
          details: 'An error occurred during synchronization'
        });
        
        // Keep only the 50 most recent logs
        if (errorLogs.length > 50) {
          errorLogs.pop();
        }
      }
      
      res.status(200).json({
        message: `Sync ${isSuccess ? 'completed successfully' : 'failed'}`,
        status: newStatus
      });
    }, 1000); // Simulate 1 second delay
  } catch (error) {
    console.error('Error triggering sync:', error);
    res.status(500).json({ error: 'Failed to trigger sync' });
  }
};

// Get error logs
exports.getErrorLogs = (req, res) => {
  try {
    res.status(200).json(errorLogs);
  } catch (error) {
    console.error('Error fetching error logs:', error);
    res.status(500).json({ error: 'Failed to fetch error logs' });
  }
};