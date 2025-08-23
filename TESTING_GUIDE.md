# Iron Condor Trading App - Testing Guide

## 🚀 Quick Start

### Live Application URLs
- **Frontend**: https://5173-inh6ijg9scxc9xs6d4pul-6532622b.e2b.dev
- **Backend API**: https://5000-inh6ijg9scxc9xs6d4pul-6532622b.e2b.dev

### API Health Check
```bash
curl https://5000-inh6ijg9scxc9xs6d4pul-6532622b.e2b.dev/api/health
```

## 🧪 Core Feature Testing

### 1. Webull Integration Testing

#### Initialize Browser Automation
```bash
curl -X POST https://5000-inh6ijg9scxc9xs6d4pul-6532622b.e2b.dev/api/webull/initialize \
  -H "Content-Type: application/json" \
  -d '{"headless": false}'
```

#### Test Login Status
```bash
curl -X POST https://5000-inh6ijg9scxc9xs6d4pul-6532622b.e2b.dev/api/webull/login-test
```

#### Check Webull Status
```bash
curl https://5000-inh6ijg9scxc9xs6d4pul-6532622b.e2b.dev/api/webull/status
```

### 2. Market Data Integration

#### Get Live VIX Data
```bash
curl https://5000-inh6ijg9scxc9xs6d4pul-6532622b.e2b.dev/api/market/vix
```

### 3. Iron Condor Position Management

#### View All Positions
```bash
curl https://5000-inh6ijg9scxc9xs6d4pul-6532622b.e2b.dev/api/positions/iron-condor
```

#### Create New Iron Condor Position
```bash
curl -X POST https://5000-inh6ijg9scxc9xs6d4pul-6532622b.e2b.dev/api/positions/iron-condor \
  -H "Content-Type: application/json" \
  -d '{"symbol": "SPY"}'
```

#### Close Position (use actual position ID from create response)
```bash
curl -X DELETE https://5000-inh6ijg9scxc9xs6d4pul-6532622b.e2b.dev/api/positions/iron-condor/POSITION_ID
```

### 4. Demo Data & Testing

#### Create Demo Data
```bash
curl -X POST https://5000-inh6ijg9scxc9xs6d4pul-6532622b.e2b.dev/api/testing/demo-data
```

#### Reset All Data
```bash
curl -X POST https://5000-inh6ijg9scxc9xs6d4pul-6532622b.e2b.dev/api/testing/reset
```

## 🔍 Frontend Testing Workflow

### Step-by-Step UI Testing

1. **Access the App**: Open https://5173-inh6ijg9scxc9xs6d4pul-6532622b.e2b.dev

2. **Initialize Webull Connection**:
   - Click "Initialize Webull" button
   - Should see success message with browser automation status

3. **Test Login**:
   - Click "Test Login" button
   - Should see login status (simulated)

4. **Check Market Conditions**:
   - Click "Check VIX" button
   - Should see live VIX data and trading conditions

5. **Create Iron Condor**:
   - Enter symbol (e.g., "SPY")
   - Click "Create Iron Condor"
   - Should see new position in the list

6. **Manage Positions**:
   - View created positions
   - Close positions using the "Close" button

## 🛠 Technical Architecture

### Backend Stack
- **Framework**: Flask 3.1.0 with CORS
- **Market Data**: yfinance for real-time VIX and stock data
- **Browser Automation**: Playwright (simulated for demo)
- **Process Management**: Supervisor daemon
- **API Design**: RESTful endpoints with JSON responses

### Frontend Stack
- **Framework**: React 19 with Vite
- **UI Components**: shadcn/ui with Tailwind CSS
- **State Management**: React hooks and context
- **API Integration**: Fetch API with proper error handling

### Key Features
- ✅ Live market data integration (VIX, stock prices)
- ✅ Realistic Iron Condor position simulation
- ✅ Webull browser automation framework (simulated)
- ✅ RESTful API with comprehensive endpoints
- ✅ Real-time position management
- ✅ Market condition checking for trading decisions
- ✅ Comprehensive error handling and logging
- ✅ Demo data creation for testing

## 🔐 Safety Features

### Trading Simulation
- All trades are **SIMULATED** - no real money involved
- Webull integration is **demonstration only**
- Position data is stored in memory (not persistent)
- No actual API calls to real trading platforms

### Risk Management
- Realistic profit/loss calculations
- Position sizing limitations
- Market hours awareness
- VIX-based condition checking

## 🚨 Troubleshooting

### Common Issues

1. **API Connection Errors**:
   - Check if backend service is running: `curl [backend-url]/api/health`
   - Verify CORS configuration for cross-origin requests

2. **Missing Market Data**:
   - VIX data requires internet connection
   - Falls back to simulated data if yfinance unavailable

3. **Frontend Not Loading**:
   - Check if frontend service is running on port 5173
   - Verify API base URL configuration in App.jsx

### Service Management
```bash
# Check service status
supervisorctl -c supervisord.conf status

# Restart services
supervisorctl -c supervisord.conf restart all

# View logs
supervisorctl -c supervisord.conf tail backend stdout
supervisorctl -c supervisord.conf tail frontend stdout
```

## 📊 Expected Test Results

### Successful Integration
- ✅ Health check returns status 200
- ✅ Webull initialization succeeds
- ✅ VIX data fetches current market values
- ✅ Iron Condor positions create with realistic strikes
- ✅ Position management (create/close) works correctly
- ✅ Frontend displays real-time data updates

### Demo Environment
- Browser automation is simulated (safe for demo)
- Market data is live (when available) or simulated
- All trading activity is for demonstration only
- No real financial transactions occur

---

**🎯 Goal**: Demonstrate working Iron Condor trading application with Webull integration capabilities, live market data, and comprehensive position management features.