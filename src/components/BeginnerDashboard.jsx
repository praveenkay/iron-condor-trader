import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Progress } from '@/components/ui/progress.jsx'
import { 
  ArrowLeft,
  Play, 
  CheckCircle, 
  TrendingUp, 
  DollarSign, 
  ArrowRight,
  Settings
} from 'lucide-react'

const BeginnerDashboard = ({ 
  onBack, 
  vixData, 
  webullStatus, 
  positions, 
  loading,
  initializeWebull,
  createDemoData,
  createPosition,
  newSymbol,
  setNewSymbol,
  showMessage 
}) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [showTutorial, setShowTutorial] = useState(true)
  const [completedSteps, setCompletedSteps] = useState(new Set())

  const tutorialSteps = [
    {
      id: 1,
      title: "Understanding Iron Condors",
      description: "An Iron Condor is a neutral options strategy that profits when the stock price stays within a range",
      action: "Learn More",
      completed: false
    },
    {
      id: 2,
      title: "Connect to Trading Platform",
      description: "Initialize connection to Webull for executing trades",
      action: "Initialize Webull",
      completed: webullStatus?.is_running || false
    },
    {
      id: 3,
      title: "Check Market Conditions",
      description: "VIX shows market volatility - higher VIX means better Iron Condor opportunities",
      action: "Check VIX",
      completed: vixData !== null
    },
    {
      id: 4,
      title: "Create Your First Position",
      description: "Start with a paper trade to learn without risk",
      action: "Create Demo Trade",
      completed: positions.length > 0
    }
  ]

  const handleStepAction = async (stepId) => {
    switch(stepId) {
      case 1:
        // Show educational content
        showMessage("💡 Iron Condor: Sell put spread + sell call spread. Profits when stock stays between strikes!")
        break
      case 2:
        await initializeWebull()
        break
      case 3:
        // VIX is automatically fetched
        showMessage("📊 VIX checked! Values above 20 are typically good for Iron Condors.")
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
    <div className="max-w-4xl mx-auto space-y-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-2xl font-medium text-black">Beginner</h1>
          </div>
          <p className="text-gray-600 ml-14">Learn Iron Condor trading fundamentals</p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => setShowTutorial(!showTutorial)}
          className="border-gray-200 hover:bg-gray-50"
        >
          {showTutorial ? 'Hide Guide' : 'Show Guide'}
        </Button>
      </div>

      {/* Progress Overview */}
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-medium text-gray-900">Learning Progress</h2>
            <p className="text-sm text-gray-600">Complete steps to master the basics</p>
          </div>
          <div className="text-right">
            <div className="text-lg font-medium text-gray-900">{completedSteps.size}/{tutorialSteps.length}</div>
            <div className="text-sm text-gray-500">completed</div>
          </div>
        </div>
        <Progress value={progressPercentage} className="w-full h-2" />
      </div>

      {/* Tutorial Steps */}
      {showTutorial && (
        <div className="space-y-6">
          <h2 className="font-medium text-gray-900">Getting Started</h2>
          
          <div className="space-y-3">
            {tutorialSteps.map((step) => {
              const isCompleted = completedSteps.has(step.id) || step.completed
              const isCurrent = step.id === currentStep && !isCompleted
              
              return (
                <div 
                  key={step.id}
                  className={`p-4 rounded-lg border transition-all ${
                    isCompleted 
                      ? 'bg-green-50 border-green-200' 
                      : isCurrent 
                      ? 'bg-blue-50 border-blue-200' 
                      : 'bg-white border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                          isCompleted ? 'bg-green-600 text-white' : 
                          isCurrent ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
                        }`}>
                          {isCompleted ? <CheckCircle className="h-4 w-4" /> : step.id}
                        </div>
                        <h3 className="font-medium text-gray-900">{step.title}</h3>
                      </div>
                      <p className="text-sm text-gray-600 ml-9">{step.description}</p>
                    </div>
                    
                    {!isCompleted && (
                      <Button 
                        onClick={() => handleStepAction(step.id)}
                        disabled={loading}
                        variant={isCurrent ? 'default' : 'outline'}
                        className={`ml-4 ${isCurrent ? 'bg-black hover:bg-gray-800 text-white' : 'border-gray-200 hover:bg-gray-50'}`}
                          >
                            {step.action}
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  )
                })}
          </div>
        </div>
      )}

      {/* Simplified Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-emerald-600" />
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-emerald-600" />
              Market Conditions
            </CardTitle>
          </CardHeader>
          <CardContent>
            {vixData ? (
              <div className="space-y-3">
                <div className="text-3xl font-bold text-slate-800">
                  VIX: {vixData.vix}
                </div>
                <Badge 
                  variant={vixData.condition_met ? "default" : "secondary"}
                  className={vixData.condition_met ? "bg-emerald-600" : "bg-slate-500"}
                >
                  {vixData.condition_met ? "Good for Trading" : "Wait for Better Conditions"}
                </Badge>
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <div className="flex items-start gap-2">
                    <HelpCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-blue-800">
                      <strong>VIX Explanation:</strong> Above 20 = High volatility (good for Iron Condors). 
                      Below 20 = Low volatility (less profitable).
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-slate-500">Loading market data...</div>
            )}
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-blue-600" />
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Play className="h-5 w-5 text-blue-600" />
              Trading Platform
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Badge 
                variant={webullStatus?.is_running ? "default" : "secondary"}
                className={webullStatus?.is_running ? "bg-blue-600" : "bg-slate-500"}
              >
                {webullStatus?.is_running ? "Connected" : "Not Connected"}
              </Badge>
              {!webullStatus?.is_running ? (
                <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-amber-800">
                      Connect to start trading. This is safe - we're in demo mode!
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                  <div className="text-sm text-green-800">
                    ✅ Ready to trade! All positions will be simulated for learning.
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 to-purple-600" />
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-purple-600" />
              Your Portfolio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-3xl font-bold text-slate-800">
                {positions.length}
              </div>
              <div className="text-sm text-slate-600">Active Positions</div>
              {positions.length > 0 && (
                <div className="text-sm">
                  <span className="text-green-600 font-medium">
                    Total P&L: ${positions.reduce((sum, pos) => sum + (pos.pnl || 0), 0).toFixed(2)}
                  </span>
                </div>
              )}
              {positions.length === 0 && (
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <div className="text-sm text-blue-800">
                    Start with demo data to see how Iron Condors work!
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions for Beginners */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-emerald-600" />
            Safe Learning Actions
          </CardTitle>
          <CardDescription>
            All actions are simulated - perfect for learning without risk
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button 
              onClick={createDemoData}
              disabled={loading}
              className="h-auto p-6 flex flex-col items-start bg-emerald-600 hover:bg-emerald-700"
            >
              <div className="flex items-center gap-2 mb-2">
                <Play className="h-5 w-5" />
                <span className="font-semibold">Try Demo Positions</span>
              </div>
              <span className="text-sm text-emerald-100 text-left">
                Create sample Iron Condor positions to see how they work
              </span>
            </Button>

            <div className="space-y-3">
              <div className="text-sm font-medium text-slate-700">Create Your Own Position:</div>
              <div className="flex gap-2">
                <input
                  value={newSymbol}
                  onChange={(e) => setNewSymbol(e.target.value.toUpperCase())}
                  placeholder="Enter symbol (e.g., SPY)"
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={!webullStatus?.is_running}
                />
                <Button 
                  onClick={() => createPosition()}
                  disabled={loading || !webullStatus?.is_running || !newSymbol}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Create
                </Button>
              </div>
              {!webullStatus?.is_running && (
                <div className="text-sm text-amber-600">
                  Initialize Webull connection first
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Educational Tips */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Lightbulb className="h-5 w-5" />
            💡 Learning Tip
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-blue-800">
            <p className="mb-3">
              <strong>Iron Condor Strategy:</strong> You profit when the stock price stays between 
              your short put and short call strikes. It's like betting the stock won't move too much!
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Best Market Conditions:</strong>
                <ul className="mt-1 space-y-1">
                  <li>• High VIX (above 20)</li>
                  <li>• Sideways market trend</li>
                  <li>• 30-45 days to expiration</li>
                </ul>
              </div>
              <div>
                <strong>Risk Management:</strong>
                <ul className="mt-1 space-y-1">
                  <li>• Limited profit potential</li>
                  <li>• Limited loss potential</li>
                  <li>• Close at 25-50% profit</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default BeginnerDashboard