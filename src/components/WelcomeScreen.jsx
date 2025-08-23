import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { GraduationCap, TrendingUp, Settings, ArrowRight, Zap, Shield, BookOpen, Target } from 'lucide-react'

const WelcomeScreen = ({ onSelectLevel, isDevelopment }) => {
  const [selectedLevel, setSelectedLevel] = useState(null)

  const userLevels = [
    {
      id: 'beginner',
      title: 'Beginner',
      subtitle: 'New to Options Trading',
      icon: BookOpen,
      description: 'Learn the basics with guided tutorials and simplified interface',
      features: [
        'Step-by-step tutorials',
        'Simplified dashboard',
        'Risk explanations',
        'Basic strategy focus',
        'Educational tooltips'
      ],
      color: 'bg-emerald-500',
      recommended: true
    },
    {
      id: 'intermediate',
      title: 'Intermediate', 
      subtitle: 'Some Options Experience',
      icon: TrendingUp,
      description: 'Balance of guidance and advanced features for growing traders',
      features: [
        'Moderate complexity',
        'Strategy comparisons',
        'Risk management tools',
        'Market analysis',
        'Performance tracking'
      ],
      color: 'bg-blue-500',
      recommended: false
    },
    {
      id: 'expert',
      title: 'Expert',
      subtitle: 'Advanced Options Trader',
      icon: Settings,
      description: 'Full access to all features with minimal guidance',
      features: [
        'Complete feature access',
        'Advanced analytics',
        'Custom strategies',
        'Professional tools',
        'API integration'
      ],
      color: 'bg-purple-500',
      recommended: false
    }
  ]

  const handleStart = () => {
    if (selectedLevel) {
      onSelectLevel(selectedLevel)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl">
              <Target className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Iron Condor Trader
          </h1>
          <p className="text-xl text-slate-600 mb-2">
            Professional Options Trading Platform
          </p>
          <div className="flex items-center justify-center gap-2 mb-6">
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              {isDevelopment ? "Full API Integration" : "Demo Mode"}
            </Badge>
            <Badge variant="outline">
              <Shield className="h-3 w-3 mr-1" />
              100% Safe Simulation
            </Badge>
          </div>
          
          <div className="max-w-2xl mx-auto text-slate-600">
            <p className="mb-4">
              Master Iron Condor options strategies with our intelligent trading platform. 
              Choose your experience level to get a personalized interface that grows with your skills.
            </p>
          </div>
        </div>

        {/* User Level Selection */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-center mb-8 text-slate-800">
            Choose Your Experience Level
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {userLevels.map((level) => {
              const Icon = level.icon
              const isSelected = selectedLevel === level.id
              
              return (
                <Card 
                  key={level.id}
                  className={`cursor-pointer transition-all duration-300 hover:shadow-xl border-2 ${
                    isSelected 
                      ? 'border-blue-500 shadow-lg scale-105' 
                      : 'border-slate-200 hover:border-slate-300'
                  } ${level.recommended ? 'ring-2 ring-emerald-200' : ''}`}
                  onClick={() => setSelectedLevel(level.id)}
                >
                  <CardHeader className="text-center pb-4">
                    {level.recommended && (
                      <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-emerald-500">
                        <Zap className="h-3 w-3 mr-1" />
                        Recommended
                      </Badge>
                    )}
                    <div className={`${level.color} w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-xl">{level.title}</CardTitle>
                    <CardDescription className="text-sm font-medium">
                      {level.subtitle}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <p className="text-slate-600 text-sm mb-4 text-center">
                      {level.description}
                    </p>
                    
                    <div className="space-y-2">
                      {level.features.map((feature, index) => (
                        <div key={index} className="flex items-center text-sm">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 flex-shrink-0" />
                          <span className="text-slate-600">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Start Button */}
        <div className="text-center">
          <Button 
            onClick={handleStart}
            disabled={!selectedLevel}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {selectedLevel ? `Start as ${userLevels.find(l => l.id === selectedLevel)?.title}` : 'Select Your Level'}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          
          {selectedLevel && (
            <p className="text-sm text-slate-500 mt-3">
              You can change your experience level anytime in settings
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="mt-16 text-center">
          <div className="flex items-center justify-center gap-8 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>Risk-Free Learning</span>
            </div>
            <div className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              <span>Educational Platform</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              <span>Professional Tools</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WelcomeScreen