import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Progress } from '@/components/ui/progress.jsx'
import { Input } from '@/components/ui/input.jsx'
import { 
  ArrowLeft,
  Play, 
  CheckCircle, 
  TrendingUp, 
  DollarSign, 
  ArrowRight,
  Settings,
  Wifi,
  WifiOff,
  Plus,
  Target,
  BookOpen,
  Activity,
  AlertCircle,
  RefreshCw
} from 'lucide-react'

const BeginnerDashboard = ({ 
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
  const [currentStep, setCurrentStep] = useState(1)
  const [showTutorial, setShowTutorial] = useState(true)
  const [completedSteps, setCompletedSteps] = useState(new Set())

  const tutorialSteps = [
    {
      id: 1,
      title: "Understanding Iron Condors",
      description: "Learn about this neutral options strategy that profits when stocks trade sideways",
      action: "Learn More",
      completed: false
    },
    {
      id: 2,
      title: "Connect to Trading Platform",
      description: "Initialize connection to Webull for executing trades",
      action: "Connect Webull",
      completed: webullStatus?.is_running || false
    },
    {
      id: 3,
      title: "Check Market Conditions",
      description: "VIX shows market volatility - higher VIX means better opportunities",
      action: "Check VIX",
      completed: vixData !== null
    },
    {
      id: 4,
      title: "Create Your First Position",
      description: "Start with demo data to learn without risk",
      action: "Create Demo",
      completed: positions.length > 0
    }
  ]

  const handleStepAction = async (stepId) => {
    switch(stepId) {
      case 1:
        showMessage("💡 Iron Condor: Sell put spread + sell call spread. Profits when stock stays between strikes!")
        break
      case 2:
        await initializeWebull()
        break
      case 3:
        await fetchVixData()
        showMessage("📊 VIX data refreshed! Values above 20 are typically good for Iron Condors.")
        break
      case 4:
        await createDemoData()
        break
    }
    
    setCompletedSteps(prev => new Set([...prev, stepId]))
    if (stepId < tutorialSteps.length) {
      setCurrentStep(stepId + 1)
    }
  }

  const progressPercentage = (completedSteps.size / tutorialSteps.length) * 100

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
              <h1 className="text-3xl font-semibold text-gray-900">Beginner Dashboard</h1>
              <p className="text-gray-600">Learn Iron Condor trading step by step</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline"
              onClick={() => setShowTutorial(!showTutorial)}
              className="border-gray-300"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              {showTutorial ? 'Hide Guide' : 'Show Guide'}
            </Button>
            <Button 
              onClick={() => window.location.reload()}
              variant="outline"
              className="border-gray-300"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Progress Overview */}
        {showTutorial && (
          <div className="mb-8">
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-blue-900">
                      <Target className="w-5 h-5" />
                      Learning Progress
                    </CardTitle>
                    <CardDescription className="text-blue-700">
                      Complete these steps to master Iron Condor basics
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-900">
                      {completedSteps.size}/{tutorialSteps.length}
                    </div>
                    <div className="text-sm text-blue-700">steps completed</div>
                  </div>
                </div>
                <Progress value={progressPercentage} className="mt-4 h-2" />
              </CardHeader>
            </Card>
          </div>
        )}

        {/* Tutorial Steps */}
        {showTutorial && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Getting Started Guide</h2>
            <div className="grid gap-4">
              {tutorialSteps.map((step) => {
                const isCompleted = completedSteps.has(step.id) || step.completed
                const isCurrent = step.id === currentStep && !isCompleted
                
                return (
                  <Card 
                    key={step.id}
                    className={`transition-all duration-200 ${
                      isCompleted 
                        ? 'border-green-200 bg-green-50' 
                        : isCurrent 
                        ? 'border-blue-200 bg-blue-50 shadow-md' 
                        : 'border-gray-200'
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                            isCompleted ? 'bg-green-500 text-white' : 
                            isCurrent ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600'
                          }`}>
                            {isCompleted ? <CheckCircle className="w-5 h-5" /> : step.id}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900 mb-1">{step.title}</h3>
                            <p className="text-sm text-gray-600">{step.description}</p>
                          </div>
                        </div>
                        
                        {!isCompleted && (
                          <Button 
                            onClick={() => handleStepAction(step.id)}
                            disabled={loading}
                            variant={isCurrent ? "default" : "outline"}
                            size="sm"
                            className={isCurrent ? 'bg-blue-600 hover:bg-blue-700' : ''}
                          >
                            {loading ? (
                              <RefreshCw className="w-4 h-4 animate-spin" />
                            ) : (
                              step.action
                            )}
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        )}

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Market Status */}
          <Card className="border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Activity className="w-5 h-5 text-blue-600" />
                Market Conditions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">VIX Level</label>
                  <div className="text-2xl font-bold text-gray-900">
                    {vixData?.price ? `${vixData.price}%` : '--'}
                  </div>
                  <div className="text-sm text-gray-500">
                    {vixData?.price > 20 ? '🟢 Good for Iron Condors' : 
                     vixData?.price > 15 ? '🟡 Moderate conditions' : 
                     vixData?.price ? '🔴 Low volatility' : 'Loading...'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Platform Status */}
          <Card className="border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                {webullStatus?.is_running ? (
                  <Wifi className="w-5 h-5 text-green-600" />
                ) : (
                  <WifiOff className="w-5 h-5 text-red-600" />
                )}
                Platform Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">Connection</label>
                  <div className="flex items-center gap-2">
                    <Badge variant={webullStatus?.is_running ? "default" : "destructive"}>
                      {webullStatus?.is_running ? 'Connected' : 'Disconnected'}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Automation</label>
                  <div className="text-sm text-gray-600">
                    {webullStatus?.has_automation ? 'Ready' : 'Not available'}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={initializeWebull}
                    disabled={loading}
                    size="sm"
                    variant="outline"
                  >
                    Initialize
                  </Button>
                  <Button 
                    onClick={testWebullLogin}
                    disabled={loading}
                    size="sm"
                    variant="outline"
                  >
                    Test Login
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Portfolio Overview */}
          <Card className="border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="w-5 h-5 text-green-600" />
                Portfolio Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">Active Positions</label>
                  <div className="text-2xl font-bold text-gray-900">
                    {positions.length}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Total P&L</label>
                  <div className="text-lg font-semibold text-gray-900">
                    ${positions.reduce((sum, pos) => sum + (pos.current_pnl || 0), 0).toFixed(2)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Trading Actions */}
        <Card className="border-gray-200 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-blue-600" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <Input
                  type="text"
                  placeholder="Enter symbol (e.g., SPY)"
                  value={newSymbol}
                  onChange={(e) => setNewSymbol(e.target.value)}
                  className="w-40"
                />
                <Button 
                  onClick={() => createPosition(newSymbol)}
                  disabled={loading || !newSymbol}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Create Position
                </Button>
              </div>
              
              <Button 
                onClick={createDemoData}
                disabled={loading}
                variant="outline"
              >
                Generate Demo Data
              </Button>
              
              <Button 
                onClick={resetData}
                disabled={loading}
                variant="outline"
              >
                Reset All Data
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Active Positions */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              Active Positions ({positions.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {positions.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-400 mb-2">
                  <Target className="w-12 h-12 mx-auto" />
                </div>
                <p className="text-gray-500">No active positions</p>
                <p className="text-sm text-gray-400">Create your first Iron Condor position above</p>
              </div>
            ) : (
              <div className="space-y-4">
                {positions.map((position, index) => (
                  <div key={index} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">{position.symbol || 'N/A'}</h3>
                        <p className="text-sm text-gray-600">
                          Iron Condor • Created: {position.created_at ? new Date(position.created_at).toLocaleDateString() : 'N/A'}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className={`text-lg font-semibold ${
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
                    
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex gap-4 text-sm">
                        <span className="text-gray-600">
                          Max Profit: <span className="font-medium">${(position.max_profit || 0).toFixed(2)}</span>
                        </span>
                        <span className="text-gray-600">
                          Max Loss: <span className="font-medium">${(position.max_loss || 0).toFixed(2)}</span>
                        </span>
                      </div>
                      <Button 
                        onClick={() => closePosition(position.id)}
                        disabled={loading}
                        size="sm"
                        variant="outline"
                      >
                        Close Position
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default BeginnerDashboard