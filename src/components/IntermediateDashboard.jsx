import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Input } from '@/components/ui/input.jsx'
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
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingDown
} from 'lucide-react'

const IntermediateDashboard = ({ 
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

  // Calculate portfolio metrics
  const totalPnL = positions.reduce((sum, pos) => sum + (pos.current_pnl || 0), 0)
  const totalMaxProfit = positions.reduce((sum, pos) => sum + (pos.max_profit || 0), 0)
  const totalMaxLoss = positions.reduce((sum, pos) => sum + (pos.max_loss || 0), 0)
  const winningPositions = positions.filter(pos => (pos.current_pnl || 0) > 0).length
  const winRate = positions.length > 0 ? (winningPositions / positions.length * 100).toFixed(1) : '0'

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-3xl font-semibold text-gray-900">Intermediate Dashboard</h1>
              <p className="text-gray-600">Enhanced trading tools with risk management</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline"
              onClick={() => window.location.reload()}
              className="border-gray-300"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button 
              variant="outline"
              className="border-gray-300"
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        {/* Key Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total P&L</p>
                  <p className={`text-2xl font-bold ${totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${totalPnL.toFixed(2)}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${totalPnL >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                  <DollarSign className={`w-6 h-6 ${totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Positions</p>
                  <p className="text-2xl font-bold text-gray-900">{positions.length}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Win Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{winRate}%</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <Target className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">VIX Level</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {vixData?.price ? `${vixData.price}%` : '--'}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <Activity className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="positions">Positions</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="trading">Trading</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Market Conditions */}
              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-blue-600" />
                    Market Conditions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">VIX Level</span>
                        <Badge variant={vixData?.price > 20 ? "default" : vixData?.price > 15 ? "secondary" : "destructive"}>
                          {vixData?.price > 20 ? 'High Volatility' : 
                           vixData?.price > 15 ? 'Moderate' : 
                           vixData?.price ? 'Low Volatility' : 'Loading...'}
                        </Badge>
                      </div>
                      <div className="text-2xl font-bold text-gray-900">
                        {vixData?.price ? `${vixData.price}%` : 'Loading...'}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        {vixData?.change ? `${vixData.change >= 0 ? '+' : ''}${vixData.change.toFixed(2)}%` : 'No data'}
                      </p>
                    </div>
                    <Button 
                      onClick={fetchVixData}
                      disabled={loading}
                      variant="outline"
                      className="w-full"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Refresh Market Data
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Platform Status */}
              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {webullStatus?.is_running ? (
                      <Wifi className="w-5 h-5 text-green-600" />
                    ) : (
                      <WifiOff className="w-5 h-5 text-red-600" />
                    )}
                    Platform Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">Connection</span>
                      <Badge variant={webullStatus?.is_running ? "default" : "destructive"}>
                        {webullStatus?.is_running ? 'Connected' : 'Disconnected'}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">Automation</span>
                      <Badge variant={webullStatus?.has_automation ? "default" : "secondary"}>
                        {webullStatus?.has_automation ? 'Ready' : 'Not Available'}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">Positions Count</span>
                      <span className="font-medium">{webullStatus?.positions_count || 0}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        onClick={initializeWebull}
                        disabled={loading}
                        size="sm"
                        variant="outline"
                        className="flex-1"
                      >
                        Initialize
                      </Button>
                      <Button 
                        onClick={testWebullLogin}
                        disabled={loading}
                        size="sm"
                        variant="outline"
                        className="flex-1"
                      >
                        Test Login
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Portfolio Performance */}
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  Portfolio Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">
                      ${totalMaxProfit.toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-600">Max Profit Potential</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">
                      ${Math.abs(totalMaxLoss).toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-600">Max Risk</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {totalMaxLoss !== 0 ? (totalMaxProfit / Math.abs(totalMaxLoss)).toFixed(2) : '0.00'}:1
                    </div>
                    <div className="text-sm text-gray-600">Risk/Reward Ratio</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Positions Tab */}
          <TabsContent value="positions" className="space-y-6">
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                    Active Positions ({positions.length})
                  </span>
                  <Button 
                    onClick={createDemoData}
                    disabled={loading}
                    size="sm"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Demo Positions
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {positions.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                      <BarChart3 className="w-16 h-16 mx-auto" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Positions</h3>
                    <p className="text-gray-500 mb-4">Create your first Iron Condor position to get started</p>
                    <Button onClick={createDemoData} disabled={loading}>
                      <Plus className="w-4 h-4 mr-2" />
                      Generate Demo Data
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {positions.map((position, index) => (
                      <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <Target className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">{position.symbol || 'N/A'}</h3>
                              <p className="text-sm text-gray-500">
                                Iron Condor • {position.created_at ? new Date(position.created_at).toLocaleDateString() : 'N/A'}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`text-xl font-bold ${
                              (position.current_pnl || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              ${(position.current_pnl || 0).toFixed(2)}
                            </div>
                            <div className="text-sm text-gray-500">
                              {((position.current_pnl || 0) >= 0 ? '+' : '')}
                              {(((position.current_pnl || 0) / (position.max_profit || 1)) * 100).toFixed(1)}%
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Max Profit</span>
                            <div className="font-medium">${(position.max_profit || 0).toFixed(2)}</div>
                          </div>
                          <div>
                            <span className="text-gray-500">Max Loss</span>
                            <div className="font-medium text-red-600">${Math.abs(position.max_loss || 0).toFixed(2)}</div>
                          </div>
                          <div>
                            <span className="text-gray-500">Break Even</span>
                            <div className="font-medium">${(position.break_even_lower || 0).toFixed(2)} - ${(position.break_even_upper || 0).toFixed(2)}</div>
                          </div>
                          <div className="flex items-center justify-end">
                            <Button 
                              onClick={() => closePosition(position.id)}
                              disabled={loading}
                              size="sm"
                              variant="outline"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
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
              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Trades</span>
                      <span className="font-medium">{positions.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Winning Trades</span>
                      <span className="font-medium text-green-600">{winningPositions}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Losing Trades</span>
                      <span className="font-medium text-red-600">{positions.length - winningPositions}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Win Rate</span>
                      <span className="font-medium">{winRate}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Average P&L</span>
                      <span className="font-medium">
                        ${positions.length > 0 ? (totalPnL / positions.length).toFixed(2) : '0.00'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle>Risk Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Risk</span>
                      <span className="font-medium text-red-600">${Math.abs(totalMaxLoss).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Profit Potential</span>
                      <span className="font-medium text-green-600">${totalMaxProfit.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Risk/Reward</span>
                      <span className="font-medium">
                        {totalMaxLoss !== 0 ? (totalMaxProfit / Math.abs(totalMaxLoss)).toFixed(2) : '0.00'}:1
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Portfolio Beta</span>
                      <span className="font-medium">N/A</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Trading Tab */}
          <TabsContent value="trading" className="space-y-6">
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5 text-blue-600" />
                  Create New Position
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Input
                      type="text"
                      placeholder="Enter symbol (e.g., SPY, QQQ, IWM)"
                      value={newSymbol}
                      onChange={(e) => setNewSymbol(e.target.value.toUpperCase())}
                      className="w-60"
                    />
                    <Button 
                      onClick={() => createPosition(newSymbol)}
                      disabled={loading || !newSymbol}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {loading ? (
                        <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                      ) : (
                        <Plus className="w-4 h-4 mr-2" />
                      )}
                      Create Iron Condor
                    </Button>
                  </div>
                </div>
                
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button 
                    onClick={createDemoData}
                    disabled={loading}
                    variant="outline"
                    className="flex items-center justify-center gap-2"
                  >
                    <Target className="w-4 h-4" />
                    Generate Demo Data
                  </Button>
                  
                  <Button 
                    onClick={fetchPositions}
                    disabled={loading}
                    variant="outline"
                    className="flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Refresh Positions
                  </Button>
                  
                  <Button 
                    onClick={resetData}
                    disabled={loading}
                    variant="outline"
                    className="flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Reset All Data
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default IntermediateDashboard