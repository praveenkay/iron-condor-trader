import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { ArrowRight, Check } from 'lucide-react'

const WelcomeScreen = ({ onSelectLevel, isDevelopment }) => {
  const [selectedLevel, setSelectedLevel] = useState(null)

  const userLevels = [
    {
      id: 'beginner',
      title: 'Beginner',
      description: 'Perfect for new traders'
    },
    {
      id: 'intermediate',
      title: 'Intermediate', 
      description: 'Growing your expertise'
    },
    {
      id: 'expert',
      title: 'Expert',
      description: 'Professional trading'
    }
  ]

  const handleStart = () => {
    if (selectedLevel) {
      onSelectLevel(selectedLevel)
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-8">
      <div className="max-w-2xl mx-auto w-full">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-normal text-black mb-4 tracking-tight">
            Iron Condor
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Professional Options Trading Platform
          </p>
          
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-full text-sm text-gray-700">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
            {isDevelopment ? "Live Mode" : "Demo Mode"}
          </div>
        </div>

        {/* User Level Selection */}
        <div className="mb-12">
          <h2 className="text-xl text-gray-900 mb-8 text-center">
            Choose your experience level
          </h2>
          
          <div className="space-y-3">
            {userLevels.map((level) => {
              const isSelected = selectedLevel === level.id
              
              return (
                <button
                  key={level.id}
                  className={`w-full text-left p-4 rounded-lg border transition-all duration-200 ${
                    isSelected 
                      ? 'border-black bg-gray-50' 
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                  onClick={() => setSelectedLevel(level.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900 mb-1">
                        {level.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {level.description}
                      </p>
                    </div>
                    {isSelected && (
                      <div className="flex-shrink-0">
                        <Check className="w-5 h-5 text-black" />
                      </div>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Start Button */}
        <div className="text-center">
          <Button 
            onClick={handleStart}
            disabled={!selectedLevel}
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              selectedLevel
                ? 'bg-black text-white hover:bg-gray-800'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            {selectedLevel ? 'Continue' : 'Select a level'}
            {selectedLevel && <ArrowRight className="w-4 h-4" />}
          </Button>
          
          {selectedLevel && (
            <p className="text-sm text-gray-500 mt-4">
              You can change this later in settings
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default WelcomeScreen