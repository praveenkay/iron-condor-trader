import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Switch } from '@/components/ui/switch.jsx'
import { Progress } from '@/components/ui/progress.jsx'
import { AlertCircle, TrendingUp, TrendingDown, Play, Square, Settings, BarChart3, Clock, DollarSign } from 'lucide-react'
import './App.css'

// API base URL
const API_BASE = import.meta.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api'

function App() {
  const [isTrading, setIsTrading] = useState(false)
  const [vixData, setVixData] = useState({
    current_vix: 18.45,
    previous_vix: 17.82,
    condition_met: true,
    market_open: false
  })
  const [currentTime, setCurrentTime] = useState(new Date())
  const [tradingConfig, setTradingConfig] = useState({
    profit_target: 25,
    time_limit: 120,
    delta_target: 20,
    auto_trade: false
  })
  const [positions, setPositions] = useState([])
  const [tradeHistory, setTradeHistory] = useState([])
  const [webullStatus, setWebullStatus] = useState({
    is_running: false,
    has_automation: false
  })
  const [accountType, setAccountType] = useState('paper') // 'live' or 'paper'

  // Fetch VIX data
  const fetchVixData = async () => {
    try {
      const response = await fetch(`${API_BASE}/vix`)
      if (response.ok) {
        const data = await response.json()
        setVixData(data)
      }
    } catch (error) {
      console.error('Error fetching VIX data:', error)
    }
  }

  // Fetch trading status
  const fetchTradingStatus = async () => {
    try {
      const response = await fetch(`${API_BASE}/trading/status`)
      if (response.ok) {
        const data = await response.json()
        setIsTrading(data.is_active)
      }
    } catch (error) {
      console.error('Error fetching trading status:', error)
    }
  }

  // Fetch positions
  const fetchPositions = async () => {
    try {
      const response = await fetch(`${API_BASE}/trading/positions`)
      if (response.ok) {
        const data = await response.json()
        setPositions(data)
      }
    } catch (error) {
      console.error('Error fetching positions:', error)
    }
  }

  // Fetch trade history
  const fetchTradeHistory = async () => {
    try {
      const response = await fetch(`${API_BASE}/trading/history`)
      if (response.ok) {
        const data = await response.json()
        setTradeHistory(data)
      }
    } catch (error) {
      console.error('Error fetching trade history:', error)
    }
  }

  // Fetch Webull status
  const fetchWebullStatus = async () => {
    try {
      const response = await fetch(`${API_BASE}/webull/status`)
      if (response.ok) {
        const data = await response.json()
        setWebullStatus(data)
      }
    } catch (error) {
      console.error('Error fetching Webull status:', error)
    }
  }

  // Fetch account type
  const fetchAccountType = async () => {
    try {
      const response = await fetch(`${API_BASE}/webull/account-type`)
      if (response.ok) {
        const data = await response.json()
        if (data.account_type) {
          setAccountType(data.account_type)
        }
      }
    } catch (error) {
      console.error('Error fetching account type:', error)
    }
  }

  // Initialize data on component mount
  useEffect(() => {
    fetchVixData()
    fetchTradingStatus()
    fetchPositions()
    fetchTradeHistory()
    fetchWebullStatus()
    fetchAccountType()

    // Set up intervals for real-time updates
    const vixInterval = setInterval(fetchVixData, 30000) // Every 30 seconds
    const statusInterval = setInterval(fetchTradingStatus, 10000) // Every 10 seconds
    const positionsInterval = setInterval(fetchPositions, 15000) // Every 15 seconds
    const accountInterval = setInterval(fetchAccountType, 20000) // Every 20 seconds

    return () => {
      clearInterval(vixInterval)
      clearInterval(statusInterval)
      clearInterval(positionsInterval)
      clearInterval(accountInterval)
    }
  }, [])

  // Update current time
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const handleStartTrading = async () => {
    try {
      const response = await fetch(`${API_BASE}/trading/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      if (response.ok) {
        setIsTrading(true)
        fetchPositions() // Refresh positions
      }
    } catch (error) {
      console.error('Error starting trading:', error)
    }
  }

  const handleStopTrading = async () => {
    try {
      const response = await fetch(`${API_BASE}/trading/stop`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      if (response.ok) {
        setIsTrading(false)
        fetchPositions() // Refresh positions
        fetchTradeHistory() // Refresh history
      }
    } catch (error) {
      console.error('Error stopping trading:', error)
    }
  }

  const handleSaveConfig = async () => {
    try {
      const response = await fetch(`${API_BASE}/trading/config`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(tradingConfig)
      })
      
      if (response.ok) {
        alert('Configuration saved successfully!')
      }
    } catch (error) {
      console.error('Error saving config:', error)
    }
  }

  const initializeWebull = async () => {
    try {
      const response = await fetch(`${API_BASE}/webull/initialize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ headless: false })
      })
      
      if (response.ok) {
        fetchWebullStatus()
        fetchAccountType()
        alert('Webull automation initialized! Please log in manually in the browser window.')
      }
    } catch (error) {
      console.error('Error initializing Webull:', error)
    }
  }

  const switchAccountType = async (targetType) => {
    try {
      const response = await fetch(`${API_BASE}/webull/switch-account`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ account_type: targetType })
      })
      
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setAccountType(targetType)
          alert(`Successfully switched to ${targetType} account`)
        } else {
          alert(`Failed to switch to ${targetType} account`)
        }
      }
    } catch (error) {
      console.error('Error switching account type:', error)
    }
  }

  const totalPnl = positions.reduce((sum, pos) => sum + (pos.pnl || 0), 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Iron Condor Trader
          </h1>
          <p className="text-slate-300">0DTE Trading Bot - Automated Treasure Hunting</p>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                VIX Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{vixData.current_vix}</div>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={vixData.condition_met ? "default" : "secondary"} className={vixData.condition_met ? "bg-green-600" : "bg-red-600"}>
                  {vixData.condition_met ? "Condition Met" : "Condition Not Met"}
                </Badge>
              </div>
              <p className="text-xs text-slate-400 mt-2">Previous: {vixData.previous_vix}</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Market Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {currentTime.toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit',
                  timeZone: 'America/New_York'
                })}
              </div>
              <Badge variant={vixData.market_open ? "default" : "secondary"} className={vixData.market_open ? "bg-green-600" : "bg-slate-600"}>
                {vixData.market_open ? "Market Open" : "Pre-Market"}
              </Badge>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Bot Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {isTrading ? "Active" : "Idle"}
              </div>
              <Badge variant={isTrading ? "default" : "secondary"} className={isTrading ? "bg-blue-600" : "bg-slate-600"}>
                {isTrading ? "Trading" : "Stopped"}
              </Badge>
              <p className="text-xs text-slate-400 mt-2">
                Webull: {webullStatus.is_running ? "Connected" : "Disconnected"}
              </p>
              <p className="text-xs text-slate-400">
                Account: {accountType === 'live' ? 'Live Trading' : 'Paper Trading'}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Today's P&L
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${totalPnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {totalPnl >= 0 ? '+' : ''}${totalPnl.toFixed(2)}
              </div>
              <div className="text-xs text-slate-400">{positions.length} Active Position{positions.length !== 1 ? 's' : ''}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="bg-slate-800/50 border-slate-700">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="positions">Positions</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Trading Controls */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Trading Controls
                </CardTitle>
                <CardDescription>
                  Manual controls for the trading bot
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <Button 
                    onClick={handleStartTrading}
                    disabled={isTrading || !vixData.condition_met}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Start Trading
                  </Button>
                  <Button 
                    onClick={handleStopTrading}
                    disabled={!isTrading}
                    variant="destructive"
                  >
                    <Square className="h-4 w-4 mr-2" />
                    Stop Trading
                  </Button>
                  <Button 
                    onClick={initializeWebull}
                    disabled={webullStatus.is_running}
                    variant="outline"
                  >
                    Initialize Webull
                  </Button>
                </div>

                {/* Account Type Selection */}
                {webullStatus.is_running && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Account Type</Label>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => switchAccountType('paper')}
                        variant={accountType === 'paper' ? 'default' : 'outline'}
                        size="sm"
                        className={accountType === 'paper' ? 'bg-blue-600' : ''}
                      >
                        Paper Trading
                      </Button>
                      <Button
                        onClick={() => switchAccountType('live')}
                        variant={accountType === 'live' ? 'default' : 'outline'}
                        size="sm"
                        className={accountType === 'live' ? 'bg-red-600' : ''}
                      >
                        Live Trading
                      </Button>
                    </div>
                    <p className="text-xs text-slate-400">
                      Current: {accountType === 'live' ? 'Live Trading (Real Money)' : 'Paper Trading (Simulated)'}
                    </p>
                  </div>
                )}
                
                {!vixData.condition_met && (
                  <div className="flex items-center gap-2 text-amber-400">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm">VIX condition not met. Trading disabled.</span>
                  </div>
                )}

                {accountType === 'live' && (
                  <div className="flex items-center gap-2 text-red-400 bg-red-900/20 p-2 rounded">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">⚠️ LIVE TRADING MODE - Real money at risk!</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Strategy Rules */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle>Strategy Rules</CardTitle>
                <CardDescription>
                  Current 0DTE Iron Condor configuration
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Entry Conditions</h4>
                    <ul className="text-sm text-slate-300 space-y-1">
                      <li>• VIX higher than previous close</li>
                      <li>• Market open at 9:30 AM ET</li>
                      <li>• {tradingConfig.delta_target} Delta strikes for calls/puts</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Exit Conditions</h4>
                    <ul className="text-sm text-slate-300 space-y-1">
                      <li>• {tradingConfig.profit_target}% profit target</li>
                      <li>• {tradingConfig.time_limit} minute time limit</li>
                      <li>• Automatic position closure</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="positions" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle>Current Positions</CardTitle>
                <CardDescription>
                  Active Iron Condor positions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {positions.length > 0 ? (
                  <div className="space-y-4">
                    {positions.map((position) => (
                      <div key={position.id} className="border border-slate-600 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-medium">{position.symbol} {position.type}</h4>
                            <p className="text-sm text-slate-400">Entry: {position.entry_time}</p>
                          </div>
                          <Badge variant={position.status === 'Open' ? 'default' : 'secondary'}>
                            {position.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-slate-400">P&L</p>
                            <p className={`font-medium ${position.pnl > 0 ? 'text-green-400' : 'text-red-400'}`}>
                              ${position.pnl}
                            </p>
                          </div>
                          <div>
                            <p className="text-slate-400">Credit</p>
                            <p className="font-medium">${position.credit}</p>
                          </div>
                          <div>
                            <p className="text-slate-400">Progress</p>
                            <Progress value={position.progress} className="mt-1" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400 text-center py-8">No active positions</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle>Trade History</CardTitle>
                <CardDescription>
                  Recent trading results
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {tradeHistory.map((trade) => (
                    <div key={trade.id} className="flex justify-between items-center border border-slate-600 rounded-lg p-3">
                      <div>
                        <p className="font-medium">{trade.symbol} {trade.type}</p>
                        <p className="text-sm text-slate-400">{trade.date} • {trade.duration}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant={trade.result === 'Win' ? 'default' : 'destructive'} className={trade.result === 'Win' ? 'bg-green-600' : 'bg-red-600'}>
                          {trade.result}
                        </Badge>
                        <p className={`text-sm font-medium mt-1 ${trade.pnl > 0 ? 'text-green-400' : 'text-red-400'}`}>
                          ${trade.pnl}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle>Trading Configuration</CardTitle>
                <CardDescription>
                  Adjust bot parameters and settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="profit-target">Profit Target (%)</Label>
                      <Input
                        id="profit-target"
                        type="number"
                        value={tradingConfig.profit_target}
                        onChange={(e) => setTradingConfig({...tradingConfig, profit_target: parseInt(e.target.value)})}
                        className="bg-slate-700 border-slate-600"
                      />
                    </div>
                    <div>
                      <Label htmlFor="time-limit">Time Limit (minutes)</Label>
                      <Input
                        id="time-limit"
                        type="number"
                        value={tradingConfig.time_limit}
                        onChange={(e) => setTradingConfig({...tradingConfig, time_limit: parseInt(e.target.value)})}
                        className="bg-slate-700 border-slate-600"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="delta-target">Delta Target</Label>
                      <Input
                        id="delta-target"
                        type="number"
                        value={tradingConfig.delta_target}
                        onChange={(e) => setTradingConfig({...tradingConfig, delta_target: parseInt(e.target.value)})}
                        className="bg-slate-700 border-slate-600"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="auto-trade"
                        checked={tradingConfig.auto_trade}
                        onCheckedChange={(checked) => setTradingConfig({...tradingConfig, auto_trade: checked})}
                      />
                      <Label htmlFor="auto-trade">Enable Auto Trading</Label>
                    </div>
                  </div>
                </div>
                <Button onClick={handleSaveConfig} className="w-full bg-blue-600 hover:bg-blue-700">
                  Save Configuration
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default App

