# 🚀 Iron Condor Trader

A modern, responsive web application for Iron Condor options trading with Webull integration and comprehensive trading simulation capabilities.

## ✨ Live Demo

**🌐 Access the app**: [https://praveenkay.github.io/iron-condor-trader/](https://praveenkay.github.io/iron-condor-trader/)

## 🎯 Features

### 🏷️ Core Trading Features
- **Iron Condor Position Management** - Create, monitor, and close Iron Condor options positions
- **Real-time Market Data** - Live VIX data integration for optimal trading conditions
- **Webull Integration** - Browser automation for seamless trading platform connection
- **Position Analytics** - Detailed P&L tracking, strike analysis, and risk management

### 🎨 User Experience  
- **Clean, Minimalist Design** - Modern UI with light theme and intuitive navigation
- **Responsive Layout** - Works perfectly on desktop, tablet, and mobile devices
- **Real-time Updates** - Live data refresh and position monitoring
- **Interactive Dashboard** - Three-tab interface (Trading, Positions, Testing)

### 🔧 Technical Features
- **Dual Mode Operation** - Development mode with real API, Production mode with mock API
- **Local Data Persistence** - Browser-based storage for demo mode
- **Comprehensive Testing** - Built-in demo data and reset functionality
- **Safety First** - All trading is simulated, no real money at risk

## 🚀 Quick Start

### Option 1: Use the Live Demo
Simply visit [https://praveenkay.github.io/iron-condor-trader/](https://praveenkay.github.io/iron-condor-trader/) and start using the app immediately!

### Option 2: Run Locally
```bash
# Clone the repository
git clone https://github.com/praveenkay/iron-condor-trader.git
cd iron-condor-trader

# Install dependencies
npm install --legacy-peer-deps

# Start development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

## 🎮 How to Use

### 1. **Initialize Connection**
- Click "Initialize Webull" to set up browser automation
- In demo mode, this simulates the connection process

### 2. **Test Login** 
- Click "Test Login" to verify Webull connection
- Simulates authentication process with realistic responses

### 3. **Create Positions**
- Enter a stock symbol (e.g., SPY, QQQ, AAPL)
- Click "Create Position" to generate an Iron Condor
- View detailed strike prices and profit/loss calculations

### 4. **Monitor Portfolio**
- Switch to "Positions" tab to view all active positions
- See real-time P&L and position details
- Close positions with simulated market prices

### 5. **Demo & Testing**
- Use "Create Demo Data" for sample positions
- "Reset All Data" to clear everything and start fresh

## 🏗️ Architecture

### Frontend Stack
- **React 19** - Modern UI library with hooks and context
- **Vite** - Lightning-fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Beautiful, accessible component library
- **Lucide React** - Modern icon library

### Backend Integration
- **Development Mode** - Full Flask API with real market data integration
- **Production Mode** - Built-in mock API service for standalone operation
- **Dual API System** - Seamless switching between real and simulated data

### Key Components
```
src/
├── components/ui/          # shadcn/ui component library
├── services/
│   └── mockApi.js         # Standalone mock API service
├── App.jsx                # Main application component
├── App.css                # Custom styling and design
└── main.jsx               # Application entry point
```

## 🔧 Development

### Environment Setup
```bash
# Install dependencies
npm install --legacy-peer-deps

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Backend Development (Optional)
The app includes a full Flask backend for development mode:

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run Flask server
python src/app.py
```

## 🌐 Deployment

### GitHub Pages (Automatic)
This repository is configured for automatic deployment to GitHub Pages:

1. **Push to main branch** - Triggers automatic build and deployment
2. **GitHub Actions** - Builds the app and deploys to Pages  
3. **Live URL** - Available at https://praveenkay.github.io/iron-condor-trader/

### Manual Deployment
```bash
# Build for production
npm run build

# Deploy the 'dist' folder to any static hosting service
# (Netlify, Vercel, GitHub Pages, etc.)
```

## 🔒 Safety & Compliance

### Trading Simulation
- **No Real Money** - All trading is simulated for educational purposes
- **No Real API Connections** - Webull integration is browser automation only
- **Local Data Only** - No sensitive information transmitted or stored
- **Educational Purpose** - Designed for learning options trading strategies

### Data Privacy
- **Local Storage** - All position data stored in browser localStorage
- **No Server Dependency** - Demo mode works completely offline
- **No Personal Information** - No registration or personal data required

## 🧪 Testing

### Automated Testing
The app includes comprehensive testing features:

- **Demo Data Creation** - Generates realistic sample positions
- **Market Simulation** - Simulated VIX and stock price data
- **Connection Testing** - Webull automation testing interface
- **Reset Functionality** - Clean slate for testing scenarios

### Manual Testing Checklist
- [ ] App loads without errors
- [ ] All buttons are clickable and responsive
- [ ] Position creation works for different symbols
- [ ] Position details display correctly
- [ ] Demo data populates properly
- [ ] Reset clears all data
- [ ] Responsive design on mobile

## 📊 Features in Detail

### Iron Condor Strategy
An Iron Condor is a neutral options strategy that profits from low volatility:
- **Structure**: Sell put spread + sell call spread
- **Profit Zone**: Stock price stays between short strikes
- **Risk Management**: Limited profit and loss potential

### Market Integration
- **VIX Monitoring** - Volatility Index for optimal entry timing
- **Real-time Data** - Live stock prices and market conditions (development mode)
- **Condition Alerts** - Automated signals for favorable trading conditions

### Position Analytics
- **Strike Visualization** - Clear display of all four option legs
- **P&L Tracking** - Real-time profit and loss calculations  
- **Risk Metrics** - Maximum profit, maximum loss, breakeven points
- **Time Decay** - Days to expiration tracking

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Guidelines
1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ Support

Having issues? Here are some common solutions:

### Common Issues
1. **Buttons not working** - Try refreshing the page
2. **Data not loading** - Check if you're in the correct mode (Demo/Development)
3. **Build errors** - Use `npm install --legacy-peer-deps`

### Get Help
- **Open an Issue** - [GitHub Issues](https://github.com/praveenkay/iron-condor-trader/issues)
- **Check Documentation** - Review this README thoroughly
- **Demo Mode** - Try the live demo for immediate access

## 🔮 Roadmap

### Upcoming Features
- [ ] **Advanced Analytics** - Greeks calculation and visualization
- [ ] **Strategy Builder** - Support for additional options strategies
- [ ] **Paper Trading** - Enhanced simulation with realistic fills
- [ ] **Mobile App** - React Native version
- [ ] **Real-time Alerts** - Push notifications for position updates

---

**⚠️ Disclaimer**: This application is for educational and demonstration purposes only. It is not intended for actual trading and should not be used with real money. Always consult with a qualified financial advisor before making investment decisions.

**🚀 Built with ❤️ using React, Vite, and modern web technologies.**