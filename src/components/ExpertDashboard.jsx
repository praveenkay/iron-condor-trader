import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Switch } from '@/components/ui/switch.jsx'
import { 
  Settings, 
  BarChart3, 
  Target,
  Activity,
  TrendingUp,
  AlertTriangle,
  RefreshCw,
  Plus,
  X,
  Calculator,
  Code,
  Database,
  Zap,
  Filter,
  Download,
  Upload,
  Bell,
  Maximize2
} from 'lucide-react'

const ExpertDashboard = ({ 
  onBack,
  vixData,
  webullStatus,
  positions,
  loading,
  initializeWebull,
  testWebullLogin,
  createPosition,
  closePosition,
  createDemoData,
  resetData,
  fetchVixData,
  fetchWebullStatus,
  fetchPositions,
  newSymbol,
  setNewSymbol,
  showMessage
}) => {
  const [autoRefresh, setAutoRefresh] = useState(false)
  const [refreshInterval, setRefreshInterval] = useState(30)
  const [selectedPositions, setSelectedPositions] = useState(new Set())
  const [sortBy, setSortBy] = useState('opened_at')
  const [filterBy, setFilterBy] = useState('all')
  const [showAdvancedMetrics, setShowAdvancedMetrics] = useState(true)
  const [customSymbol, setCustomSymbol] = useState('')
  const [batchSize, setBatchSize] = useState(1)

  // Advanced calculations
  const portfolioMetrics = {
    totalPnL: positions.reduce((sum, pos) => sum + (pos.pnl || 0), 0),
    totalPremium: positions.reduce((sum, pos) => sum + (pos.premium_collected || 0), 0),
    totalRisk: positions.reduce((sum, pos) => sum + (pos.max_loss || 0), 0),
    winRate: positions.length > 0 ? (positions.filter(p => (p.pnl || 0) > 0).length / positions.length * 100) : 0,
    avgDTE: positions.length > 0 ? positions.reduce((sum, pos) => sum + pos.days_to_expiration, 0) / positions.length : 0,
    sharpeRatio: 0, // Simplified - would need historical data
    maxDrawdown: 0 // Simplified - would need historical data
  }

  portfolioMetrics.returnOnRisk = portfolioMetrics.totalRisk > 0 ? (portfolioMetrics.totalPnL / portfolioMetrics.totalRisk * 100) : 0
  portfolioMetrics.profitFactor = positions.length > 0 ? 
    Math.abs(positions.filter(p => (p.pnl || 0) > 0).reduce((sum, p) => sum + p.pnl, 0) / 
    Math.max(Math.abs(positions.filter(p => (p.pnl || 0) < 0).reduce((sum, p) => sum + p.pnl, 0)), 1)) : 0

  // Auto refresh effect
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        fetchVixData()
        fetchWebullStatus()
        fetchPositions()
      }, refreshInterval * 1000)
      return () => clearInterval(interval)
    }
  }, [autoRefresh, refreshInterval])

  // Position filtering and sorting
  const filteredPositions = positions
    .filter(pos => {
      switch (filterBy) {
        case 'profitable': return (pos.pnl || 0) > 0
        case 'losing': return (pos.pnl || 0) < 0
        case 'high-risk': return (pos.max_loss || 0) > 100
        case 'expiring-soon': return pos.days_to_expiration < 10
        default: return true
      }
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'pnl': return (b.pnl || 0) - (a.pnl || 0)
        case 'risk': return (b.max_loss || 0) - (a.max_loss || 0)
        case 'premium': return (b.premium_collected || 0) - (a.premium_collected || 0)
        case 'dte': return a.days_to_expiration - b.days_to_expiration
        default: return new Date(b.opened_at) - new Date(a.opened_at)
      }
    })

  const handleBulkClose = async () => {
    if (selectedPositions.size === 0) return
    
    for (const positionId of selectedPositions) {
      await closePosition(positionId)
    }
    setSelectedPositions(new Set())
    showMessage(`Closed ${selectedPositions.size} positions`)
  }

  const handleBulkCreate = async () => {
    const symbols = customSymbol.split(',').map(s => s.trim().toUpperCase()).filter(Boolean)
    if (symbols.length === 0) return

    for (let i = 0; i < batchSize; i++) {
      for (const symbol of symbols) {
        await createPosition(symbol)
      }
    }
    showMessage(`Created ${symbols.length * batchSize} positions`)
    setCustomSymbol('')
  }

  const exportData = () => {
    const data = {
      positions,
      metrics: portfolioMetrics,
      timestamp: new Date().toISOString()
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `iron-condor-data-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4">
      {/* Compact Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Expert Dashboard</h1>
          <p className="text-slate-600">Advanced trading interface with full control</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onBack}>
            Change Level
          </Button>
          <Button variant="outline" size="sm" onClick={exportData}>
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
        </div>
      </div>

      {/* Control Panel */}
      <Card className="bg-slate-50">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Switch 
                checked={autoRefresh}
                onCheckedChange={setAutoRefresh}
              />
              <Label className="text-sm">Auto-refresh</Label>
              {autoRefresh && (
                <Input
                  type="number"
                  value={refreshInterval}
                  onChange={(e) => setRefreshInterval(Number(e.target.value))}
                  className="w-16 h-8 text-xs"
                  min={5}
                  max={300}
                />
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <Label className="text-sm">Filter:</Label>
              <select 
                value={filterBy} 
                onChange={(e) => setFilterBy(e.target.value)}
                className="text-sm border rounded px-2 py-1"
              >
                <option value="all">All</option>
                <option value="profitable">Profitable</option>
                <option value="losing">Losing</option>
                <option value="high-risk">High Risk</option>
                <option value="expiring-soon">Expiring Soon</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <Label className="text-sm">Sort:</Label>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="text-sm border rounded px-2 py-1"
              >
                <option value="opened_at">Date</option>
                <option value="pnl">P&L</option>
                <option value="risk">Risk</option>
                <option value="premium">Premium</option>
                <option value="dte">DTE</option>
              </select>
            </div>

            <Button 
              onClick={() => { fetchVixData(); fetchWebullStatus(); fetchPositions(); }}
              disabled={loading}
              variant="outline"
              size="sm"
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5 text-xs">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="positions">Positions</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="trading">Trading</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Compact Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            <Card className="p-3">
              <div className="text-xs text-slate-600">P&L</div>
              <div className={`text-lg font-bold ${portfolioMetrics.totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {portfolioMetrics.totalPnL >= 0 ? '+' : ''}${portfolioMetrics.totalPnL.toFixed(0)}
              </div>
            </Card>
            <Card className="p-3">
              <div className="text-xs text-slate-600">Positions</div>
              <div className="text-lg font-bold">{positions.length}</div>
            </Card>
            <Card className="p-3">
              <div className="text-xs text-slate-600">Win Rate</div>
              <div className="text-lg font-bold text-blue-600">{portfolioMetrics.winRate.toFixed(0)}%</div>
            </Card>
            <Card className="p-3">
              <div className="text-xs text-slate-600">Premium</div>
              <div className="text-lg font-bold text-green-600">${portfolioMetrics.totalPremium.toFixed(0)}</div>
            </Card>
            <Card className="p-3">
              <div className="text-xs text-slate-600">Risk</div>
              <div className="text-lg font-bold text-red-600">${portfolioMetrics.totalRisk.toFixed(0)}</div>
            </Card>
            <Card className="p-3">
              <div className="text-xs text-slate-600">VIX</div>
              <div className="text-lg font-bold text-amber-600">{vixData?.vix || '--'}</div>
            </Card>
          </div>

          {/* Advanced Metrics */}
          {showAdvancedMetrics && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Card className="p-3">
                <div className="text-xs text-slate-600">Return on Risk</div>
                <div className="text-sm font-bold">{portfolioMetrics.returnOnRisk.toFixed(1)}%</div>
              </Card>
              <Card className="p-3">
                <div className="text-xs text-slate-600">Profit Factor</div>
                <div className="text-sm font-bold">{portfolioMetrics.profitFactor.toFixed(2)}</div>
              </Card>
              <Card className="p-3">
                <div className="text-xs text-slate-600">Avg DTE</div>
                <div className="text-sm font-bold">{portfolioMetrics.avgDTE.toFixed(0)} days</div>
              </Card>
              <Card className="p-3">
                <div className="text-xs text-slate-600">Connection</div>
                <Badge variant={webullStatus?.is_running ? "default" : "secondary"} className="text-xs">
                  {webullStatus?.is_running ? "Live" : "Offline"}
                </Badge>
              </Card>
            </div>
          )}

          {/* Market Status */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center justify-between">
                <span>Market Status</span>
                <Badge variant={vixData?.condition_met ? "default" : "secondary"}>
                  {vixData?.condition_met ? "Favorable" : "Unfavorable"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-slate-600">VIX Level:</span>
                  <span className="font-semibold ml-2">{vixData?.vix || 'Loading...'}</span>
                </div>
                <div>
                  <span className="text-slate-600">Market:</span>
                  <span className="font-semibold ml-2">{vixData?.market_open ? 'Open' : 'Closed'}</span>
                </div>
                <div>
                  <span className="text-slate-600">Platform:</span>
                  <span className="font-semibold ml-2">{webullStatus?.is_running ? 'Connected' : 'Disconnected'}</span>
                </div>
                <div>
                  <span className="text-slate-600">Last Update:</span>
                  <span className="font-semibold ml-2">{vixData ? new Date(vixData.timestamp).toLocaleTimeString() : '--'}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="positions" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  Active Positions ({filteredPositions.length})
                </CardTitle>
                <div className="flex gap-2">
                  {selectedPositions.size > 0 && (
                    <Button 
                      onClick={handleBulkClose}
                      disabled={loading}
                      variant="destructive"
                      size="sm"
                    >
                      Close Selected ({selectedPositions.size})
                    </Button>
                  )}
                  <Button 
                    onClick={() => setSelectedPositions(new Set(positions.map(p => p.id)))}
                    variant="outline"
                    size="sm"
                  >
                    Select All
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {filteredPositions.length > 0 ? (
                <div className="space-y-2">
                  {filteredPositions.map((position) => (
                    <div 
                      key={position.id} 
                      className={`border rounded p-3 transition-colors ${
                        selectedPositions.has(position.id) ? 'bg-blue-50 border-blue-300' : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={selectedPositions.has(position.id)}
                            onChange={(e) => {
                              const newSelected = new Set(selectedPositions)
                              if (e.target.checked) {
                                newSelected.add(position.id)
                              } else {
                                newSelected.delete(position.id)
                              }
                              setSelectedPositions(newSelected)
                            }}
                            className="rounded"
                          />
                          <div>
                            <div className="font-semibold">{position.symbol}</div>
                            <div className="text-xs text-slate-600">
                              {new Date(position.opened_at).toLocaleDateString()} • {position.days_to_expiration}d
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-4 gap-6 text-sm">
                          <div className="text-center">
                            <div className="text-xs text-slate-600">P&L</div>
                            <div className={`font-semibold ${(position.pnl || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              ${(position.pnl || 0).toFixed(0)}
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs text-slate-600">Premium</div>
                            <div className="font-semibold text-green-600">${position.premium_collected}</div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs text-slate-600">Risk</div>
                            <div className="font-semibold text-red-600">${position.max_loss}</div>
                          </div>
                          <div className="text-center">
                            <Button 
                              onClick={() => closePosition(position.id)}
                              disabled={loading}
                              variant="outline"
                              size="sm"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Strike Details */}
                      <div className="grid grid-cols-4 gap-1 text-xs mt-2 p-2 bg-slate-50 rounded">
                        <div className="text-center">
                          <div className="text-slate-600">Put L</div>
                          <div className="font-mono">{position.strikes.put_long}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-slate-600">Put S</div>
                          <div className="font-mono">{position.strikes.put_short}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-slate-600">Call S</div>
                          <div className="font-mono">{position.strikes.call_short}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-slate-600">Call L</div>
                          <div className="font-mono">{position.strikes.call_long}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500">
                  No positions match current filters
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Portfolio Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-slate-600">Total Return</div>
                    <div className={`text-lg font-bold ${portfolioMetrics.totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {portfolioMetrics.totalPnL >= 0 ? '+' : ''}${portfolioMetrics.totalPnL.toFixed(2)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-600">Return %</div>
                    <div className={`text-lg font-bold ${portfolioMetrics.returnOnRisk >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {portfolioMetrics.returnOnRisk >= 0 ? '+' : ''}{portfolioMetrics.returnOnRisk.toFixed(1)}%
                    </div>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Win Rate:</span>
                    <span className="font-semibold">{portfolioMetrics.winRate.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Profit Factor:</span>
                    <span className="font-semibold">{portfolioMetrics.profitFactor.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Avg DTE:</span>
                    <span className="font-semibold">{portfolioMetrics.avgDTE.toFixed(0)} days</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Risk Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Total Risk Exposure:</span>
                    <span className="font-semibold text-red-600">${portfolioMetrics.totalRisk.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Premium at Risk:</span>
                    <span className="font-semibold">{portfolioMetrics.totalRisk > 0 ? (portfolioMetrics.totalPremium / portfolioMetrics.totalRisk * 100).toFixed(1) : 0}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Largest Single Risk:</span>
                    <span className="font-semibold">
                      ${positions.length > 0 ? Math.max(...positions.map(p => p.max_loss || 0)).toFixed(0) : '0'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trading" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Trade</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label htmlFor="single-symbol" className="text-sm">Single Symbol</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      id="single-symbol"
                      value={newSymbol}
                      onChange={(e) => setNewSymbol(e.target.value.toUpperCase())}
                      placeholder="SPY"
                      className="flex-1"
                    />
                    <Button 
                      onClick={() => createPosition()}
                      disabled={loading || !webullStatus?.is_running || !newSymbol}
                    >
                      Create
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Batch Trading</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-sm">Multiple Symbols (comma-separated)</Label>
                  <Input
                    value={customSymbol}
                    onChange={(e) => setCustomSymbol(e.target.value)}
                    placeholder="SPY,QQQ,IWM"
                    className="mt-1"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Label className="text-sm">Quantity per symbol:</Label>
                  <Input
                    type="number"
                    value={batchSize}
                    onChange={(e) => setBatchSize(Math.max(1, Number(e.target.value)))}
                    className="w-20"
                    min={1}
                    max={10}
                  />
                </div>
                <Button 
                  onClick={handleBulkCreate}
                  disabled={loading || !webullStatus?.is_running || !customSymbol}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Batch Create
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Button onClick={createDemoData} disabled={loading} variant="outline">
                  Demo Data
                </Button>
                <Button onClick={initializeWebull} disabled={loading || webullStatus?.is_running} variant="outline">
                  Initialize
                </Button>
                <Button onClick={testWebullLogin} disabled={loading || !webullStatus?.is_running} variant="outline">
                  Test Login
                </Button>
                <Button onClick={resetData} disabled={loading} variant="outline" className="text-red-600">
                  Reset All
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  System Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>API Status:</span>
                  <Badge variant="default">Mock API Active</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Webull Connection:</span>
                  <Badge variant={webullStatus?.is_running ? "default" : "secondary"}>
                    {webullStatus?.is_running ? "Connected" : "Disconnected"}
                  </Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Data Persistence:</span>
                  <Badge variant="default">Local Storage</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Auto Refresh:</span>
                  <Badge variant={autoRefresh ? "default" : "secondary"}>
                    {autoRefresh ? `${refreshInterval}s` : "Disabled"}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Data Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button onClick={exportData} variant="outline" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Export Portfolio Data
                </Button>
                <Button 
                  onClick={() => {
                    const input = document.createElement('input')
                    input.type = 'file'
                    input.accept = '.json'
                    input.onchange = (e) => {
                      const file = e.target.files[0]
                      if (file) {
                        const reader = new FileReader()
                        reader.onload = (e) => {
                          try {
                            const data = JSON.parse(e.target.result)
                            showMessage('Import functionality would be implemented here')
                          } catch (err) {
                            showMessage('Invalid file format', true)
                          }
                        }
                        reader.readAsText(file)
                      }
                    }
                    input.click()
                  }}
                  variant="outline" 
                  className="w-full"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Import Portfolio Data
                </Button>
                <Button 
                  onClick={() => localStorage.clear()}
                  variant="outline"
                  className="w-full text-red-600"
                >
                  Clear All Local Data
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default ExpertDashboard