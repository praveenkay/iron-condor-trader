import { useState, useEffect } from 'react'
import { AlertCircle } from 'lucide-react'
import mockApi from './services/mockApi.js'
import WelcomeScreen from './components/WelcomeScreen.jsx'
import BeginnerDashboard from './components/BeginnerDashboard.jsx'
import IntermediateDashboard from './components/IntermediateDashboard.jsx'
import ExpertDashboard from './components/ExpertDashboard.jsx'
import './App.css'

// Detect if we're in development (sandbox) or production
// Force production mode for built version, development mode only for dev server
const isDevelopment = import.meta.env.DEV && (window.location.hostname.includes('e2b.dev') || window.location.hostname === 'localhost')

// API configuration
const API_BASE = isDevelopment 
  ? (window.location.hostname === 'localhost' 
    ? 'http://localhost:5001/api' 
    : `https://5001-${window.location.hostname.split('-').slice(1).join('-')}/api`)
  : null // Use mock API in production

console.log('Environment:', isDevelopment ? 'Development (Sandbox)' : 'Production (Standalone)')
console.log('API Base URL:', API_BASE || 'Mock API Service')

function App() {
  // User level and app state
  const [userLevel, setUserLevel] = useState(() => {
    return localStorage.getItem('iron-condor-user-level') || null
  })
  
  // Core app state
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

  // Save user level to localStorage
  const handleSelectLevel = (level) => {
    setUserLevel(level)
    localStorage.setItem('iron-condor-user-level', level)
  }

  // Handle back to level selection
  const handleBackToLevelSelection = () => {
    setUserLevel(null)
    localStorage.removeItem('iron-condor-user-level')
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
  const createPosition = async (symbol) => {
    const symbolToUse = symbol || newSymbol
    setLoading(true)
    try {
      const data = await apiCall('/positions/iron-condor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbol: symbolToUse })
      })
      
      if (data.success) {
        showMessage(`Iron Condor created for ${symbolToUse}!`)
        fetchPositions()
        if (!symbol) setNewSymbol('SPY') // Only reset if not called with specific symbol
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

  // Initialize data on component mount (only if user level is selected)
  useEffect(() => {
    if (userLevel) {
      fetchVixData()
      fetchWebullStatus()
      fetchPositions()
    }
  }, [userLevel])

  // Show welcome screen if no user level selected
  if (!userLevel) {
    return (
      <WelcomeScreen 
        onSelectLevel={handleSelectLevel}
        isDevelopment={isDevelopment}
      />
    )
  }

  // Common props for all dashboards
  const commonProps = {
    onBack: handleBackToLevelSelection,
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
  }

  // Render appropriate dashboard based on user level
  const renderDashboard = () => {
    switch (userLevel) {
      case 'beginner':
        return <BeginnerDashboard {...commonProps} />
      case 'intermediate':
        return <IntermediateDashboard {...commonProps} />
      case 'expert':
        return <ExpertDashboard {...commonProps} />
      default:
        return <BeginnerDashboard {...commonProps} />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      <div className="container mx-auto p-6 max-w-7xl">
        {/* Global Message Display */}
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

        {/* Render Dashboard */}
        {renderDashboard()}
      </div>
    </div>
  )
}

export default App