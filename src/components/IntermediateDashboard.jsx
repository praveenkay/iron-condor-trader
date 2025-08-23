import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { 
  TrendingUp, 
  Activity, 
  BarChart3, 
  Settings, 
  Target,
  DollarSign,
  AlertTriangle,
  TrendingDown,
  RefreshCw,
  Plus,
  X,
  Calculator,
  PieChart,
  Clock
} from 'lucide-react'

const IntermediateDashboard = ({ 
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
  setNewSymbol
}) => {
  const [activeView, setActiveView] = useState('dashboard')
  const [showAdvanced, setShowAdvanced] = useState(false)

  // Calculate portfolio metrics
  const totalPnL = positions.reduce((sum, pos) => sum + (pos.pnl || 0), 0)
  const totalPremium = positions.reduce((sum, pos) => sum + (pos.premium_collected || 0), 0)
  const winRate = positions.length > 0 ? (positions.filter(p => (p.pnl || 0) > 0).length / positions.length * 100) : 0

  const riskLevels = {
    low: positions.filter(p => (p.max_loss || 0) < 50),
    medium: positions.filter(p => (p.max_loss || 0) >= 50 && (p.max_loss || 0) < 100),
    high: positions.filter(p => (p.max_loss || 0) >= 100)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Intermediate Dashboard</h1>
          <p className="text-slate-600">Enhanced trading tools with risk management</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={onBack}>
            Change Level
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            {showAdvanced ? 'Simplified View' : 'Advanced View'}
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-600 text-sm font-medium">Total P&L</p>
                <p className={`text-2xl font-bold ${totalPnL >= 0 ? 'text-emerald-700' : 'text-red-600'}`}>
                  {totalPnL >= 0 ? '+' : ''}${totalPnL.toFixed(2)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-emerald-600 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Active Positions</p>
                <p className="text-2xl font-bold text-blue-700">{positions.length}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-600 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">Win Rate</p>
                <p className="text-2xl font-bold text-purple-700">{winRate.toFixed(0)}%</p>
              </div>
              <Target className="h-8 w-8 text-purple-600 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-600 text-sm font-medium">VIX Level</p>
                <p className="text-2xl font-bold text-amber-700">
                  {vixData?.vix || '--'}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-amber-600 opacity-80" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeView} onValueChange={setActiveView} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="positions">Positions</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
          <TabsTrigger value="trading">Trading</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          {/* Market Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  Market Conditions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {vixData ? (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">VIX</span>
                      <span className="text-2xl font-bold">{vixData.vix}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Market Status</span>
                      <Badge variant={vixData.market_open ? "default" : "secondary"}>
                        {vixData.market_open ? "Open" : "Closed"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">IC Conditions</span>
                      <Badge variant={vixData.condition_met ? "default" : "destructive"}>
                        {vixData.condition_met ? "Favorable" : "Unfavorable"}
                      </Badge>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg">
                      <p className="text-sm text-slate-700">{vixData.message}</p>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8 text-slate-500">
                    Loading market data...
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-green-600" />
                  Platform Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Connection</span>
                  <Badge variant={webullStatus?.is_running ? "default" : "secondary"}>
                    {webullStatus?.is_running ? "Connected" : "Disconnected"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Automation</span>
                  <Badge variant={webullStatus?.has_automation ? "default" : "secondary"}>
                    {webullStatus?.has_automation ? "Ready" : "Not Ready"}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <Button 
                    onClick={initializeWebull}
                    disabled={loading || webullStatus?.is_running}
                    className="w-full"
                  >
                    {webullStatus?.is_running ? "Already Connected" : "Initialize Connection"}
                  </Button>
                  <Button 
                    onClick={testWebullLogin}
                    disabled={loading || !webullStatus?.is_running}
                    variant="outline"
                    className="w-full"
                  >
                    Test Login
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Risk Overview */}
          {showAdvanced && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                  Risk Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{riskLevels.low.length}</div>
                    <div className="text-sm text-green-700">Low Risk (&lt;$50)</div>
                  </div>
                  <div className="text-center p-4 bg-amber-50 rounded-lg">
                    <div className="text-2xl font-bold text-amber-600">{riskLevels.medium.length}</div>
                    <div className="text-sm text-amber-700">Medium Risk ($50-100)</div>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">{riskLevels.high.length}</div>
                    <div className="text-sm text-red-700">High Risk (&gt;$100)</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="positions" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Active Positions</CardTitle>
                <Button 
                  onClick={() => { fetchPositions(); fetchWebullStatus(); }}
                  disabled={loading}
                  variant="outline"
                  size="sm"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {positions.length > 0 ? (
                <div className="space-y-4">
                  {positions.map((position) => (
                    <div key={position.id} className="border rounded-lg p-4 space-y-3">
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
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                        <div>
                          <p className="text-slate-600">Underlying</p>
                          <p className="font-semibold">${position.underlying_price}</p>
                        </div>
                        <div>
                          <p className="text-slate-600">Premium</p>
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
                        <div>
                          <p className="text-slate-600">DTE</p>
                          <p className="font-semibold">{position.days_to_expiration}</p>
                        </div>
                      </div>

                      {showAdvanced && (
                        <div className="grid grid-cols-4 gap-2 text-xs bg-slate-50 p-3 rounded">
                          <div className="text-center">
                            <p className="text-slate-600">Put Long</p>
                            <p className="font-mono font-semibold">${position.strikes.put_long}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-slate-600">Put Short</p>
                            <p className="font-mono font-semibold">${position.strikes.put_short}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-slate-600">Call Short</p>
                            <p className="font-mono font-semibold">${position.strikes.call_short}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-slate-600">Call Long</p>
                            <p className="font-mono font-semibold">${position.strikes.call_long}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <BarChart3 className="h-12 w-12 mx-auto mb-3 text-slate-400" />
                  <p className="text-slate-600 mb-4">No active positions</p>
                  <Button onClick={createDemoData} disabled={loading}>
                    Create Demo Positions
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-purple-600" />
                  Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-slate-600 text-sm">Total Premium Collected</p>
                    <p className="text-xl font-bold text-green-600">${totalPremium.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-slate-600 text-sm">Realized P&L</p>
                    <p className={`text-xl font-bold ${totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {totalPnL >= 0 ? '+' : ''}${totalPnL.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-600 text-sm">Win Rate</p>
                    <p className="text-xl font-bold text-blue-600">{winRate.toFixed(1)}%</p>
                  </div>
                  <div>
                    <p className="text-slate-600 text-sm">Avg Position Size</p>
                    <p className="text-xl font-bold text-purple-600">
                      ${positions.length > 0 ? (totalPremium / positions.length).toFixed(0) : '0'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-indigo-600" />
                  Strategy Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                {positions.length > 0 ? (
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Best Performer</span>
                      <span className="font-semibold">
                        {positions.reduce((best, pos) => 
                          (pos.pnl || 0) > (best.pnl || 0) ? pos : best
                        ).symbol}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Avg Days Held</span>
                      <span className="font-semibold">
                        {Math.round(positions.reduce((sum, pos) => sum + pos.days_to_expiration, 0) / positions.length)} days
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Risk/Reward Ratio</span>
                      <span className="font-semibold">
                        1:{totalPremium > 0 ? (Math.abs(totalPnL) / totalPremium).toFixed(1) : '0'}
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="text-slate-500">No position data for analysis</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trading" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5 text-green-600" />
                  Create New Position
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="symbol">Stock Symbol</Label>
                  <Input
                    id="symbol"
                    value={newSymbol}
                    onChange={(e) => setNewSymbol(e.target.value.toUpperCase())}
                    placeholder="SPY, QQQ, AAPL, etc."
                    className="mt-1"
                  />
                </div>
                <Button 
                  onClick={createPosition}
                  disabled={loading || !webullStatus?.is_running || !newSymbol}
                  className="w-full"
                >
                  Create Iron Condor
                </Button>
                {!webullStatus?.is_running && (
                  <p className="text-sm text-amber-600">
                    Initialize Webull connection first
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-slate-600" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={createDemoData}
                  disabled={loading}
                  variant="outline"
                  className="w-full"
                >
                  Create Demo Data
                </Button>
                <Button 
                  onClick={() => { fetchVixData(); fetchWebullStatus(); fetchPositions(); }}
                  disabled={loading}
                  variant="outline"
                  className="w-full"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh All Data
                </Button>
                <Button 
                  onClick={resetData}
                  disabled={loading}
                  variant="outline"
                  className="w-full border-red-300 text-red-700 hover:bg-red-50"
                >
                  Reset All Data
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default IntermediateDashboard