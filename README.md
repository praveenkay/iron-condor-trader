# Iron Condor Trader - 0DTE Trading Bot

A comprehensive web application for automating 0DTE (Zero Days to Expiration) Iron Condor trading strategies with Webull integration and real-time VIX monitoring.

![Iron Condor Trader Interface](screenshots/dashboard.png)

## 🚀 Features

- **Real-time VIX Monitoring**: Live data from Yahoo Finance with condition checking
- **Automated Trading Logic**: Smart entry/exit rules based on VIX conditions
- **Webull Integration**: Browser automation for seamless trade execution
- **Professional Interface**: Modern React dashboard with real-time updates
- **Position Management**: Live P&L tracking and automated position closure
- **Configurable Parameters**: Customizable profit targets, time limits, and delta targets
- **Trade History**: Complete performance tracking and analytics
- **Safety Features**: Manual login requirements and comprehensive error handling

## 📋 Strategy Overview

The application implements a disciplined 0DTE Iron Condor strategy:

### Entry Conditions
- ✅ VIX must be higher than previous day's close
- ✅ Market open at 9:30 AM ET
- ✅ 20 Delta strikes for calls and puts
- ✅ Automated Iron Condor setup with protective wings

### Exit Conditions
- 🎯 25% profit target (configurable)
- ⏰ 120-minute time limit (configurable)
- 🔄 Automatic position closure

## 🛠️ Technology Stack

### Frontend
- **React 18** with modern hooks
- **Tailwind CSS** for styling
- **shadcn/ui** components
- **Lucide React** icons
- **Vite** for build tooling

### Backend
- **Flask** web framework
- **Playwright** for browser automation
- **yfinance** for market data
- **SQLite** for data persistence
- **Flask-CORS** for API integration

## 📦 Installation

### Prerequisites
- Python 3.11+
- Node.js 20+
- A Webull trading account
- Basic understanding of options trading

### Quick Start

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd iron-condor-trader
   ```

2. **Backend Setup:**
   ```bash
   cd iron_condor_backend
   python -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate
   pip install -r requirements.txt
   playwright install chromium
   ```

3. **Frontend Setup:**
   ```bash
   cd ../iron-condor-trader
   npm install
   ```

4. **Start the Application:**
   ```bash
   # Terminal 1: Backend
   cd iron_condor_backend
   source venv/bin/activate
   python src/main.py

   # Terminal 2: Frontend
   cd iron-condor-trader
   npm run dev
   ```

5. **Access the App:**
   Open `http://localhost:5173` in your browser

## 🎯 Usage Guide

### 1. Initialize Webull Connection
- Click "Initialize Webull" to open browser automation
- Manually log in to your Webull account (for security)
- System will detect successful login automatically

### 2. Configure Trading Parameters
- Navigate to Settings tab
- Adjust profit target, time limit, delta target
- Enable/disable auto trading mode
- Save configuration

### 3. Monitor Market Conditions
- VIX status shows real-time condition checking
- Market time displays current Eastern Time
- Bot status indicates connection and activity

### 4. Execute Trades
- Start trading when VIX conditions are met
- Monitor positions in real-time
- Review performance in trade history

## 📊 API Endpoints

### Market Data
- `GET /api/vix` - Current VIX data and conditions
- `GET /api/market-status` - Market session information

### Trading
- `GET /api/trading/status` - Bot status and configuration
- `POST /api/trading/start` - Start automated trading
- `POST /api/trading/stop` - Stop trading and close positions
- `GET /api/trading/positions` - Current active positions
- `GET /api/trading/history` - Trade history

### Webull Integration
- `POST /api/webull/initialize` - Initialize browser automation
- `GET /api/webull/status` - Connection status
- `POST /api/webull/execute-trade` - Execute Iron Condor trade

## ⚠️ Important Disclaimers

### Risk Warning
- **This application executes real trades with real money**
- **Options trading involves substantial risk of loss**
- **Always test with paper trading first**
- **Past performance does not guarantee future results**

### Security Notes
- Manual Webull login required for security
- Never share trading credentials
- Monitor account activity regularly
- Log out when finished trading

### Technical Limitations
- Browser automation may break with Webull UI changes
- Requires stable internet connection
- Designed for educational/research purposes
- Not financial advice

## 🏗️ Project Structure

```
iron-condor-trader/
├── iron-condor-trader/          # React frontend
│   ├── src/
│   │   ├── components/ui/       # UI components
│   │   ├── App.jsx             # Main application
│   │   └── main.jsx            # Entry point
│   ├── dist/                   # Production build
│   └── package.json
├── iron_condor_backend/         # Flask backend
│   ├── src/
│   │   ├── routes/             # API endpoints
│   │   ├── models/             # Database models
│   │   ├── webull_automation.py # Browser automation
│   │   └── main.py             # Flask app
│   ├── venv/                   # Python virtual environment
│   └── requirements.txt
├── USER_INSTRUCTIONS.md         # Detailed user guide
└── README.md                   # This file
```

## 🔧 Development

### Running Tests
```bash
# Backend tests
cd iron_condor_backend
source venv/bin/activate
python -m pytest

# Frontend tests
cd iron-condor-trader
npm test
```

### Building for Production
```bash
# Frontend build
cd iron-condor-trader
npm run build

# Backend requirements
cd iron_condor_backend
pip freeze > requirements.txt
```

## 📈 Performance Monitoring

The application provides comprehensive performance tracking:
- Real-time P&L monitoring
- Win/loss ratio analysis
- Average trade duration
- Profit target achievement rates
- Risk-adjusted returns

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For technical support:
1. Check the [User Instructions](USER_INSTRUCTIONS.md)
2. Review browser console for errors
3. Verify all dependencies are installed
4. Ensure Webull account has options trading enabled

## 🙏 Acknowledgments

- Built with modern web technologies
- Inspired by quantitative trading strategies
- Designed for educational purposes
- Community-driven development

---

**⚠️ Trading Disclaimer**: This software is for educational purposes only. The authors are not responsible for any financial losses. Always consult with a financial advisor before making trading decisions.



## Dockerization and Deployment

This application is fully containerized using Docker, allowing for easy deployment to various cloud platforms. The `docker-compose.yml` file orchestrates both the frontend (React) and backend (Flask) services.

### Project Structure for Docker

*   `iron-condor-backend/`: Contains the Flask backend application and its `Dockerfile`.
*   `iron-condor-trader/`: Contains the React frontend application, its `Dockerfile`, and `nginx.conf`.
*   `docker-compose.yml`: Defines the multi-container Docker application.
*   `deploy.sh`: A convenience script to build and run the Docker containers locally.

### How to Deploy

For detailed instructions on how to deploy this application to a cloud environment (e.g., AWS EC2, GCP, Azure), please refer to the `CLOUD_DEPLOYMENT_GUIDE.md` file in the root directory of this project.

### Local Docker Setup (for Development/Testing)

1.  **Ensure Docker and Docker Compose are installed**: Follow the official Docker documentation for your operating system.
2.  **Navigate to the project root**: `cd /path/to/iron-condor-trader-app`
3.  **Run the deployment script**: `./deploy.sh`

This script will build the Docker images, start the containers, and make the application accessible at `http://localhost` (frontend) and `http://localhost:5000/api` (backend API).

