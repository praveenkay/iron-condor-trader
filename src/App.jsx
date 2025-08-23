import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { AlertCircle, TrendingUp, Activity, Play, Loader2, RefreshCw, Plus, X, Globe } from 'lucide-react'
import mockApi from './services/mockApi.js'
import './App.css'

// Detect if we're in development (sandbox) or production
const isDevelopment = window.location.hostname.includes('e2b.dev') || window.location.hostname === 'localhost'

// API configuration
const API_BASE = isDevelopment 
  ? (window.location.hostname === 'localhost' 
    ? 'http://localhost:5001/api' 
    : `https://5001-${window.location.hostname.split('-').slice(1).join('-')}/api`)
  : null // Use mock API in production

console.log('Environment:', isDevelopment ? 'Development (Sandbox)' : 'Production (Standalone)')
console.log('API Base URL:', API_BASE || 'Mock API Service')

function App() {
  const [loading, setLoading] = useState(false)
  const [vixData, setVixData] = useState(null)
  const [webullStatus, setWebullStatus] = useState(null)
  const [positions, setPositions] = useState([])
  const [newSymbol, setNewSymbol] = useState('SPY')
  const [message, setMessage] = useState('')

  // Utility function to show messages
  const showMessage = (msg, isError = false) => {
    setMessage(msg)
    setTimeout(() => setMessage(''), 5000)
  }

  // API call wrapper - uses mock API in production, real API in development
  const apiCall = async (endpoint, options = {}) => {
    if (isDevelopment && API_BASE) {
      // Use real API in development
      const response = await fetch(`${API_BASE}${endpoint}`, options)
      return response.json()
    } else {
      // Use mock API in production
      switch (endpoint) {
        case '/market/vix':
          return await mockApi.getVixData()
        case '/webull/status':
          return await mockApi.getWebullStatus()
        case '/positions/iron-condor':
          if (options.method === 'POST') {
            return await mockApi.createPosition(options.body ? JSON.parse(options.body) : {})
          }
          return await mockApi.getPositions()
        case '/webull/initialize':
          return await mockApi.initializeWebull(options.body ? JSON.parse(options.body) : {})
        case '/webull/login-test':
          return await mockApi.testWebullLogin()
        case '/testing/demo-data':
          return await mockApi.createDemoData()
        case '/testing/reset':
          return await mockApi.resetData()
        default:
          if (endpoint.includes('/positions/iron-condor/') && options.method === 'DELETE') {
            const positionId = endpoint.split('/').pop()
            return await mockApi.closePosition(positionId)
          }
          throw new Error(`Unknown endpoint: ${endpoint}`)
      }
    }
  }

  // Fetch VIX data
  const fetchVixData = async () => {
    try {
      const data = await apiCall('/market/vix')
      if (data.success !== false) {
        setVixData(data)
      }
    } catch (error) {
      console.error('Error fetching VIX data:', error)
    }
  }

  // Fetch Webull status
  const fetchWebullStatus = async () => {
    try {
      const data = await apiCall('/webull/status')
      setWebullStatus(data)
    } catch (error) {
      console.error('Error fetching Webull status:', error)
    }
  }

  // Fetch positions
  const fetchPositions = async () => {
    try {
      const data = await apiCall('/positions/iron-condor')
      if (data.success !== false) {
        setPositions(data.positions || [])
      }
    } catch (error) {
      console.error('Error fetching positions:', error)
    }
  }

  // Initialize Webull
  const initializeWebull = async () => {
    setLoading(true)
    try {
      const data = await apiCall('/webull/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ headless: false })
      })
      
      if (data.success) {
        showMessage(data.message || 'Webull initialized successfully!')
        fetchWebullStatus()
      } else {
        showMessage(data.error || 'Failed to initialize Webull', true)
      }
    } catch (error) {
      console.error('Error initializing Webull:', error)
      showMessage('Error initializing Webull', true)
    } finally {
      setLoading(false)
    }
  }

  // Test Webull login
  const testWebullLogin = async () => {
    setLoading(true)
    try {
      const data = await apiCall('/webull/login-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
      
      if (data.success) {
        showMessage(data.message || 'Login test successful!')
      } else {
        showMessage(data.message || 'Login test failed', true)
      }
    } catch (error) {
      console.error('Error testing login:', error)
      showMessage('Error testing login', true)
    } finally {
      setLoading(false)
    }
  }

  // Create Iron Condor position
  const createPosition = async () => {
    setLoading(true)
    try {
      const data = await apiCall('/positions/iron-condor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbol: newSymbol })
      })
      
      if (data.success) {
        showMessage(`Iron Condor created for ${newSymbol}!`)
        fetchPositions()
        setNewSymbol('SPY')
      } else {
        showMessage(data.error || 'Failed to create position', true)
      }
    } catch (error) {
      console.error('Error creating position:', error)
      showMessage('Error creating position', true)
    } finally {
      setLoading(false)
    }
  }

  // Close position
  const closePosition = async (positionId) => {
    setLoading(true)
    try {
      const data = await apiCall(`/positions/iron-condor/${positionId}`, {
        method: 'DELETE'
      })
      
      if (data.success) {
        showMessage(`Position closed: ${data.message}`)
        fetchPositions()
      } else {
        showMessage(data.error || 'Failed to close position', true)
      }
    } catch (error) {
      console.error('Error closing position:', error)
      showMessage('Error closing position', true)
    } finally {
      setLoading(false)
    }
  }

  // Create demo data
  const createDemoData = async () => {
    setLoading(true)
    try {
      const data = await apiCall('/testing/demo-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
      
      if (data.success) {
        showMessage(`Demo data created: ${data.created_positions} positions`)
        fetchPositions()
        fetchWebullStatus()
        fetchVixData()
      } else {
        showMessage(data.error || 'Failed to create demo data', true)
      }
    } catch (error) {
      console.error('Error creating demo data:', error)
      showMessage('Error creating demo data', true)
    } finally {
      setLoading(false)
    }
  }

  // Reset all data
  const resetData = async () => {
    setLoading(true)
    try {
      const data = await apiCall('/testing/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
      
      if (data.success) {
        showMessage('All data reset successfully!')
        setPositions([])
        setWebullStatus(null)
        setVixData(null)
      } else {
        showMessage(data.error || 'Failed to reset data', true)
      }
    } catch (error) {
      console.error('Error resetting data:', error)
      showMessage('Error resetting data', true)
    } finally {
      setLoading(false)
    }
  }

  // Initialize data on component mount
  useEffect(() => {
    fetchVixData()
    fetchWebullStatus()
    fetchPositions()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      <div className="container mx-auto p-6 max-w-6xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Iron Condor Trader
          </h1>
          <p className="text-slate-600">Webull Integration & Options Trading Simulation</p>
          
          {/* Environment indicator */}
          <div className="mt-4 flex items-center justify-center gap-2">
            <Globe className="h-4 w-4" />
            <Badge variant={isDevelopment ? "default" : "secondary"}>
              {isDevelopment ? "Development Mode" : "Demo Mode"}
            </Badge>
            <span className="text-sm text-slate-500">
              {isDevelopment ? "Full API Integration" : "Standalone Demo"}
            </span>
          </div>
        </div>

        {/* Message Display */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg border ${
            message.includes('Error') || message.includes('Failed') 
              ? 'bg-red-50 border-red-200 text-red-800' 
              : 'bg-green-50 border-green-200 text-green-800'
          }`}>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              {message}
            </div>
          </div>
        )}

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                Market Data
              </CardTitle>
            </CardHeader>
            <CardContent>
              {vixData ? (
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-slate-900">
                    VIX: {vixData.vix}
                  </div>
                  <Badge variant={vixData.condition_met ? "default" : "secondary"}>
                    {vixData.condition_met ? "Good Conditions" : "Wait"}
                  </Badge>
                  <p className="text-sm text-slate-600">{vixData.message}</p>
                </div>
              ) : (
                <div className="text-slate-500">Loading market data...</div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="h-5 w-5 text-green-600" />
                Webull Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              {webullStatus ? (
                <div className="space-y-2">
                  <Badge variant={webullStatus.is_running ? "default" : "secondary"}>
                    {webullStatus.is_running ? "Connected" : "Disconnected"}
                  </Badge>
                  <p className="text-sm text-slate-600">
                    Automation: {webullStatus.has_automation ? "Ready" : "Not Ready"}
                  </p>
                  <p className="text-sm text-slate-600">
                    Positions: {webullStatus.positions_count || 0}
                  </p>
                </div>
              ) : (
                <div className="text-slate-500">Loading status...</div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Play className="h-5 w-5 text-purple-600" />
                Positions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-slate-900">
                  {positions.length}
                </div>
                <p className="text-sm text-slate-600">
                  Active Iron Condors
                </p>
                {positions.length > 0 && (
                  <div className="text-sm">
                    <span className="text-green-600">
                      Total P&L: ${positions.reduce((sum, pos) => sum + (pos.pnl || 0), 0).toFixed(2)}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="trading" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="trading">Trading</TabsTrigger>
            <TabsTrigger value="positions">Positions</TabsTrigger>
            <TabsTrigger value="testing">Testing</TabsTrigger>
          </TabsList>

          <TabsContent value="trading" className="space-y-6">
            {/* Webull Connection */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Webull Connection</CardTitle>
                <CardDescription>
                  {isDevelopment 
                    ? "Initialize and test your Webull browser automation"
                    : "Demo mode - simulates Webull connection for testing"
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-3">
                  <Button 
                    onClick={initializeWebull}
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                    Initialize Webull
                  </Button>
                  
                  <Button 
                    onClick={testWebullLogin}
                    disabled={loading || !webullStatus?.is_running}
                    variant="outline"
                  >
                    {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                    Test Login
                  </Button>
                  
                  <Button 
                    onClick={() => { fetchVixData(); fetchWebullStatus(); fetchPositions(); }}
                    disabled={loading}
                    variant="outline"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh Data
                  </Button>
                </div>

                {webullStatus?.is_running && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-800 font-medium">
                      ✅ Webull automation is ready{!isDevelopment ? ' (Demo Mode)' : ''}!
                    </p>
                    <p className="text-green-700 text-sm">
                      You can now create Iron Condor positions and test trading functionality.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Create Position */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Create Iron Condor Position</CardTitle>
                <CardDescription>
                  Enter a symbol to create a new Iron Condor position
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex-1">
                    <Label htmlFor="symbol">Symbol</Label>
                    <Input
                      id="symbol"
                      value={newSymbol}
                      onChange={(e) => setNewSymbol(e.target.value.toUpperCase())}
                      placeholder="SPY"
                      className="mt-1"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button 
                      onClick={createPosition}
                      disabled={loading || !webullStatus?.is_running || !newSymbol}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
                      Create Position
                    </Button>
                  </div>
                </div>
                
                {!webullStatus?.is_running && (
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-amber-800 text-sm">
                      ⚠️ Please initialize Webull connection first
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="positions" className="space-y-6">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Active Positions</CardTitle>
                <CardDescription>
                  Manage your Iron Condor positions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {positions.length > 0 ? (
                  <div className="space-y-4">
                    {positions.map((position) => (
                      <div key={position.id} className="border border-slate-200 rounded-lg p-4 space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold text-lg">{position.symbol} Iron Condor</h4>
                            <p className="text-sm text-slate-600">
                              Opened: {new Date(position.opened_at).toLocaleString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={position.status === 'open' ? "default" : "secondary"}>
                              {position.status}
                            </Badge>
                            {position.status === 'open' && (
                              <Button 
                                onClick={() => closePosition(position.id)}
                                disabled={loading}
                                size="sm"
                                variant="outline"
                              >
                                {loading ? <Loader2 className="h-4 w-4" /> : <X className="h-4 w-4" />}
                              </Button>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-slate-600">Underlying Price</p>
                            <p className="font-semibold">${position.underlying_price}</p>
                          </div>
                          <div>
                            <p className="text-slate-600">Premium Collected</p>
                            <p className="font-semibold text-green-600">${position.premium_collected}</p>
                          </div>
                          <div>
                            <p className="text-slate-600">Max Profit</p>
                            <p className="font-semibold text-green-600">${position.max_profit}</p>
                          </div>
                          <div>
                            <p className="text-slate-600">Max Loss</p>
                            <p className="font-semibold text-red-600">${position.max_loss}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-4 gap-2 text-xs bg-slate-50 p-2 rounded">
                          <div className="text-center">
                            <p className="text-slate-600">Put Long</p>
                            <p className="font-mono">${position.strikes.put_long}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-slate-600">Put Short</p>
                            <p className="font-mono">${position.strikes.put_short}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-slate-600">Call Short</p>
                            <p className="font-mono">${position.strikes.call_short}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-slate-600">Call Long</p>
                            <p className="font-mono">${position.strikes.call_long}</p>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-slate-600 text-sm">Days to Expiration: {position.days_to_expiration}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-slate-400 mb-4">
                      <Play className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      No active positions
                    </div>
                    <p className="text-slate-600">Create your first Iron Condor position to get started.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="testing" className="space-y-6">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Testing & Demo</CardTitle>
                <CardDescription>
                  Test the application with demo data and reset functionality
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-3">
                  <Button 
                    onClick={createDemoData}
                    disabled={loading}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                    Create Demo Data
                  </Button>
                  
                  <Button 
                    onClick={resetData}
                    disabled={loading}
                    variant="outline"
                    className="border-red-300 text-red-700 hover:bg-red-50"
                  >
                    {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                    Reset All Data
                  </Button>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Demo Data Information</h4>
                  <ul className="text-blue-800 text-sm space-y-1">
                    <li>• Creates sample Iron Condor positions for SPY, QQQ, and IWM</li>
                    <li>• Initializes Webull connection simulation</li>
                    <li>• {isDevelopment ? "Fetches live VIX data for realistic conditions" : "Provides simulated market data"}</li>
                    <li>• All trading is simulated - no real money involved</li>
                  </ul>
                </div>

                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <h4 className="font-semibold text-amber-900 mb-2">Safety Features</h4>
                  <ul className="text-amber-800 text-sm space-y-1">
                    <li>• All positions are simulated for demonstration</li>
                    <li>• {isDevelopment ? "Webull integration is browser automation only" : "Webull integration is fully simulated"}</li>
                    <li>• No real trading API connections</li>
                    <li>• Reset function clears all demo data</li>
                  </ul>
                </div>

                {!isDevelopment && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="font-semibold text-green-900 mb-2">Standalone Demo Mode</h4>
                    <p className="text-green-800 text-sm">
                      This app is running in standalone mode with a built-in mock API. 
                      All data is stored locally in your browser and all functionality is fully simulated.
                      Perfect for testing and demonstration without requiring a backend server.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default App