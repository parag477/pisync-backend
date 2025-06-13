const express = require('express');
const router = express.Router();
const { getDevices, triggerSync, getErrorLogs } = require('../controllers/deviceController');

// Device routes
router.get('/devices', getDevices);
router.post('/devices/:deviceId/sync', triggerSync);
router.get('/error-logs', getErrorLogs);

module.exports = router;