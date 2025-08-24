import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { 
  ArrowLeft,
  TrendingUp, 
  DollarSign, 
  Activity,
  BarChart3,
  Settings,
  Wifi,
  WifiOff,
  Plus,
  Trash2,
  RefreshCw,
  Target,
  Download,
  Upload,
  Filter,
  SortAsc,
  SortDesc,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingDown,
  Zap,
  Database,
  Terminal
} from 'lucide-react'

const ExpertDashboard = ({ 
  onBack, 
  vixData, 
  webullStatus, 
  positions, 
  loading,
  initializeWebull,
  testWebullLogin,
  createDemoData,
  createPosition,
  closePosition,
  newSymbol,
  setNewSymbol,
  showMessage,
  fetchVixData,
  fetchWebullStatus,
  fetchPositions,
  resetData
}) => {
  const [activeTab, setActiveTab] = useState('overview')
  const [autoRefresh, setAutoRefresh] = useState(false)
  const [filterSymbol, setFilterSymbol] = useState('')
  const [sortBy, setSortBy] = useState('date')
  const [sortOrder, setSortOrder] = useState('desc')

  // Auto-refresh functionality
  useEffect(() => {
    let interval
    if (autoRefresh) {
      interval = setInterval(() => {
        fetchVixData()
        fetchWebullStatus()
        fetchPositions()
      }, 30000) // 30 seconds
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [autoRefresh])

  // Calculate advanced metrics
  const totalPnL = positions.reduce((sum, pos) => sum + (pos.current_pnl || 0), 0)
  const totalMaxProfit = positions.reduce((sum, pos) => sum + (pos.max_profit || 0), 0)
  const totalMaxLoss = positions.reduce((sum, pos) => sum + (pos.max_loss || 0), 0)
  const winningPositions = positions.filter(pos => (pos.current_pnl || 0) > 0).length
  const winRate = positions.length > 0 ? (winningPositions / positions.length * 100).toFixed(1) : '0'
  const avgPnL = positions.length > 0 ? (totalPnL / positions.length) : 0
  const profitFactor = positions.length > 0 ? 
    (positions.filter(p => (p.current_pnl || 0) > 0).reduce((sum, p) => sum + p.current_pnl, 0) /
     Math.abs(positions.filter(p => (p.current_pnl || 0) < 0).reduce((sum, p) => sum + p.current_pnl, 0))) || 0 : 0

  // Filter and sort positions
  const filteredPositions = positions
    .filter(pos => !filterSymbol || (pos.symbol && pos.symbol.toLowerCase().includes(filterSymbol.toLowerCase())))
    .sort((a, b) => {
      const multiplier = sortOrder === 'asc' ? 1 : -1
      switch (sortBy) {
        case 'symbol':
          return multiplier * ((a.symbol || '').localeCompare(b.symbol || ''))
        case 'pnl':
          return multiplier * ((a.current_pnl || 0) - (b.current_pnl || 0))
        case 'date':
        default:
          return multiplier * (new Date(b.created_at || 0) - new Date(a.created_at || 0))
      }
    })

  const bulkClosePositions = async (positionIds) => {
    for (const id of positionIds) {
      await closePosition(id)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-3xl font-semibold text-gray-900">Expert Dashboard</h1>
              <p className="text-gray-600">Advanced trading interface with full control</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant={autoRefresh ? "default" : "outline"}
              onClick={() => setAutoRefresh(!autoRefresh)}
              size="sm"
            >
              <Zap className="w-4 h-4 mr-2" />
              Auto-refresh
            </Button>
            <Button 
              variant="outline"
              onClick={() => window.location.reload()}
              size="sm"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Button 
              variant="outline"
              size="sm"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Advanced Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
          <Card className="p-4">
            <div className="text-sm text-gray-600">P&L</div>
            <div className={`text-xl font-bold ${totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${totalPnL.toFixed(2)}
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="text-sm text-gray-600">Positions</div>
            <div className="text-xl font-bold">{positions.length}</div>
          </Card>
          
          <Card className="p-4">
            <div className="text-sm text-gray-600">Win Rate</div>
            <div className="text-xl font-bold">{winRate}%</div>
          </Card>
          
          <Card className="p-4">
            <div className="text-sm text-gray-600">Premium</div>
            <div className="text-xl font-bold">${totalMaxProfit.toFixed(0)}</div>
          </Card>
          
          <Card className="p-4">
            <div className="text-sm text-gray-600">Risk</div>
            <div className="text-xl font-bold">${Math.abs(totalMaxLoss).toFixed(0)}</div>
          </Card>
          
          <Card className="p-4">
            <div className="text-sm text-gray-600">VIX</div>
            <div className="text-xl font-bold">{vixData?.price || '--'}</div>
          </Card>
        </div>

        {/* Advanced Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="positions">Positions</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="trading">Trading</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Performance Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Performance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Return on Risk</span>
                    <span className="font-medium">
                      {totalMaxLoss !== 0 ? ((totalPnL / Math.abs(totalMaxLoss)) * 100).toFixed(1) : '0.0'}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Profit Factor</span>
                    <span className="font-medium">{profitFactor.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Avg DTE</span>
                    <span className="font-medium">30 days</span>
                  </div>
                </CardContent>
              </Card>

              {/* Market Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Market Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Connection</span>
                    <Badge variant={webullStatus?.is_running ? "default" : "destructive"}>
                      {webullStatus?.is_running ? 'Live' : 'Disconnected'}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Market Status</span>
                    <Badge variant="secondary">
                      {new Date().getHours() >= 9 && new Date().getHours() < 16 ? 'Open' : 'Closed'}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">VIX Level</span>
                    <span className="font-medium">{vixData?.price || 'Loading...'}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Risk Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Risk Analysis</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Platform</span>
                    <Badge variant={webullStatus?.is_running ? "default" : "destructive"}>
                      {webullStatus?.is_running ? 'Connected' : 'Offline'}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last Update</span>
                    <span className="font-medium text-sm">
                      {webullStatus?.last_initialized_at ? 
                        new Date(webullStatus.last_initialized_at).toLocaleTimeString() : '--'}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Positions Tab */}
          <TabsContent value="positions" className="space-y-6">
            {/* Controls */}
            <div className="flex flex-wrap items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <Input
                  placeholder="Filter by symbol..."
                  value={filterSymbol}
                  onChange={(e) => setFilterSymbol(e.target.value)}
                  className="w-40"
                />
              </div>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="symbol">Symbol</SelectItem>
                  <SelectItem value="pnl">P&L</SelectItem>
                </SelectContent>
              </Select>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              >
                {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
              </Button>

              <div className="ml-auto flex gap-2">
                <Button 
                  onClick={() => bulkClosePositions(filteredPositions.map(p => p.id))}
                  disabled={loading || filteredPositions.length === 0}
                  variant="outline"
                  size="sm"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Close All ({filteredPositions.length})
                </Button>
              </div>
            </div>

            {/* Positions List */}
            <Card>
              <CardContent className="p-0">
                {filteredPositions.length === 0 ? (
                  <div className="text-center py-12">
                    <BarChart3 className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Positions Found</h3>
                    <p className="text-gray-500">
                      {positions.length === 0 ? 'Create positions to get started' : 'No positions match your filter'}
                    </p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {filteredPositions.map((position, index) => (
                      <div key={index} className="p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className={`w-3 h-3 rounded-full ${
                              (position.current_pnl || 0) >= 0 ? 'bg-green-500' : 'bg-red-500'
                            }`} />
                            <div>
                              <div className="font-semibold text-gray-900">{position.symbol || 'N/A'}</div>
                              <div className="text-sm text-gray-500">
                                {position.created_at ? new Date(position.created_at).toLocaleDateString() : 'N/A'}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-6">
                            <div className="text-right">
                              <div className="text-sm text-gray-500">Max Profit</div>
                              <div className="font-medium">${(position.max_profit || 0).toFixed(2)}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-gray-500">Max Loss</div>
                              <div className="font-medium text-red-600">${Math.abs(position.max_loss || 0).toFixed(2)}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-gray-500">Current P&L</div>
                              <div className={`text-lg font-bold ${
                                (position.current_pnl || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                              }`}>
                                ${(position.current_pnl || 0).toFixed(2)}
                              </div>
                            </div>
                            <Button 
                              onClick={() => closePosition(position.id)}
                              disabled={loading}
                              size="sm"
                              variant="outline"
                            >
                              Close
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Analytics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-gray-50 rounded">
                      <div className="text-2xl font-bold">{positions.length}</div>
                      <div className="text-sm text-gray-600">Total Trades</div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded">
                      <div className="text-2xl font-bold text-green-600">{winningPositions}</div>
                      <div className="text-sm text-gray-600">Winners</div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded">
                      <div className="text-2xl font-bold">{winRate}%</div>
                      <div className="text-sm text-gray-600">Win Rate</div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded">
                      <div className="text-2xl font-bold">{profitFactor.toFixed(2)}</div>
                      <div className="text-sm text-gray-600">Profit Factor</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>System Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">API Latency</span>
                    <span className="font-medium">~150ms</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Data Refresh Rate</span>
                    <span className="font-medium">
                      {autoRefresh ? '30s' : 'Manual'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Last Sync</span>
                    <span className="font-medium text-sm">
                      {new Date().toLocaleTimeString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Trading Tab */}
          <TabsContent value="trading" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Trade</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Symbol (e.g., SPY)"
                      value={newSymbol}
                      onChange={(e) => setNewSymbol(e.target.value.toUpperCase())}
                      className="flex-1"
                    />
                    <Button 
                      onClick={() => createPosition(newSymbol)}
                      disabled={loading || !newSymbol}
                    >
                      Create
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      onClick={createDemoData}
                      disabled={loading}
                      variant="outline"
                      size="sm"
                    >
                      Demo Data
                    </Button>
                    <Button 
                      onClick={resetData}
                      disabled={loading}
                      variant="outline"
                      size="sm"
                    >
                      Reset All
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Batch Operations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    onClick={() => bulkClosePositions(positions.map(p => p.id))}
                    disabled={loading || positions.length === 0}
                    variant="outline"
                    className="w-full"
                  >
                    Close All Positions ({positions.length})
                  </Button>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      onClick={fetchPositions}
                      disabled={loading}
                      variant="outline"
                      size="sm"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Refresh
                    </Button>
                    <Button 
                      variant="outline"
                      size="sm"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* System Tab */}
          <TabsContent value="system" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Terminal className="w-5 h-5" />
                    System Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Platform Connection</span>
                    <Badge variant={webullStatus?.is_running ? "default" : "destructive"}>
                      {webullStatus?.is_running ? 'Connected' : 'Disconnected'}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Automation Status</span>
                    <Badge variant={webullStatus?.has_automation ? "default" : "secondary"}>
                      {webullStatus?.has_automation ? 'Ready' : 'Not Available'}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Data Mode</span>
                    <Badge variant="secondary">Mock API</Badge>
                  </div>
                  
                  <div className="pt-4 border-t space-y-2">
                    <Button 
                      onClick={initializeWebull}
                      disabled={loading}
                      variant="outline"
                      className="w-full"
                    >
                      <Wifi className="w-4 h-4 mr-2" />
                      Initialize Platform
                    </Button>
                    <Button 
                      onClick={testWebullLogin}
                      disabled={loading}
                      variant="outline"
                      className="w-full"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Test Connection
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="w-5 h-5" />
                    Data Management
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Positions Loaded</span>
                    <span className="font-medium">{positions.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Market Data</span>
                    <Badge variant={vixData ? "default" : "secondary"}>
                      {vixData ? 'Current' : 'Stale'}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Auto Refresh</span>
                    <Badge variant={autoRefresh ? "default" : "secondary"}>
                      {autoRefresh ? 'Enabled' : 'Disabled'}
                    </Badge>
                  </div>
                  
                  <div className="pt-4 border-t space-y-2">
                    <Button 
                      onClick={() => {
                        fetchVixData()
                        fetchWebullStatus()
                        fetchPositions()
                      }}
                      disabled={loading}
                      variant="outline"
                      className="w-full"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Refresh All Data
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default ExpertDashboard