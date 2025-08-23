// Mock API service for standalone deployment
// This replaces the backend API calls with simulated responses

class MockApiService {
  constructor() {
    this.positions = this.loadPositions();
    this.webullStatus = {
      is_running: false,
      has_automation: false,
      last_initialized_at: null,
      positions_count: 0
    };
    this.vixData = {
      vix: 23.45,
      condition_met: true,
      market_open: true,
      message: "VIX at 23.45. Good conditions for Iron Condor",
      success: true,
      timestamp: new Date().toISOString()
    };
  }

  // Local storage helpers
  loadPositions() {
    try {
      const stored = localStorage.getItem('iron_condor_positions');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  savePositions() {
    localStorage.setItem('iron_condor_positions', JSON.stringify(this.positions));
  }

  // Simulate async API calls with delays
  async delay(ms = 500) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Mock API endpoints
  async getHealth() {
    await this.delay(300);
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        webull: this.webullStatus.is_running,
        market_data: true
      }
    };
  }

  async getVixData() {
    await this.delay(800);
    // Simulate some variation in VIX
    this.vixData.vix = (20 + Math.random() * 15).toFixed(2);
    this.vixData.condition_met = this.vixData.vix > 20;
    this.vixData.message = `VIX at ${this.vixData.vix}. ${
      this.vixData.condition_met ? 'Good conditions for Iron Condor' : 'Wait for higher volatility'
    }`;
    this.vixData.timestamp = new Date().toISOString();
    return this.vixData;
  }

  async getWebullStatus() {
    await this.delay(200);
    this.webullStatus.positions_count = this.positions.length;
    return this.webullStatus;
  }

  async initializeWebull({ headless = false } = {}) {
    await this.delay(1000);
    this.webullStatus.is_running = true;
    this.webullStatus.has_automation = true;
    this.webullStatus.last_initialized_at = new Date().toISOString();
    
    return {
      success: true,
      headless,
      message: 'Browser automation initialized (Demo Mode). Manual login simulation ready.',
      next_step: 'Click "Test Login" to simulate Webull connection'
    };
  }

  async testWebullLogin() {
    await this.delay(800);
    if (!this.webullStatus.is_running) {
      return {
        success: false,
        error: 'Browser automation not initialized. Please initialize first.'
      };
    }

    // Simulate random success/failure for demo
    const success = Math.random() > 0.2; // 80% success rate
    
    if (success) {
      return {
        success: true,
        logged_in: true,
        message: 'Successfully connected to Webull (Demo Mode)',
        account_info: {
          account_id: 'DEMO_12345',
          account_type: 'PAPER',
          buying_power: 25000.00
        }
      };
    } else {
      return {
        success: false,
        logged_in: false,
        message: 'Login simulation failed. Please try again.'
      };
    }
  }

  async getPositions() {
    await this.delay(400);
    return {
      success: true,
      positions: this.positions,
      total_positions: this.positions.length
    };
  }

  async createPosition({ symbol = 'SPY' }) {
    await this.delay(1200);
    
    if (!this.webullStatus.is_running) {
      return {
        success: false,
        error: 'Webull connection required to create positions'
      };
    }

    // Generate realistic Iron Condor position
    const basePrice = this.getStockPrice(symbol);
    const position = {
      id: `IC_${symbol}_${Date.now()}`,
      symbol,
      type: 'iron_condor',
      underlying_price: basePrice,
      strikes: {
        put_long: Math.round(basePrice * 0.90),
        put_short: Math.round(basePrice * 0.95),
        call_short: Math.round(basePrice * 1.05),
        call_long: Math.round(basePrice * 1.10)
      },
      premium_collected: Math.round(basePrice * 0.04 * 100) / 100, // ~4% of stock price
      max_profit: Math.round(basePrice * 0.04 * 100) / 100,
      max_loss: Math.round(basePrice * 0.01 * 100) / 100, // ~1% max loss
      quantity: 1,
      opened_at: new Date().toISOString(),
      status: 'open',
      pnl: 0.0,
      days_to_expiration: 30
    };

    this.positions.push(position);
    this.savePositions();

    return {
      success: true,
      position,
      message: `Iron Condor position created for ${symbol} (Demo Mode)`
    };
  }

  async closePosition(positionId) {
    await this.delay(600);
    
    const positionIndex = this.positions.findIndex(p => p.id === positionId);
    if (positionIndex === -1) {
      return {
        success: false,
        error: 'Position not found'
      };
    }

    const position = this.positions[positionIndex];
    position.status = 'closed';
    position.closed_at = new Date().toISOString();
    
    // Simulate P&L
    position.pnl = (Math.random() - 0.3) * position.max_profit; // Slight bias toward profit
    position.pnl = Math.round(position.pnl * 100) / 100;

    this.positions.splice(positionIndex, 1);
    this.savePositions();

    return {
      success: true,
      closed_position: position,
      message: `Position ${positionId} closed with P&L: $${position.pnl} (Demo Mode)`
    };
  }

  async createDemoData() {
    await this.delay(1000);
    
    const symbols = ['SPY', 'QQQ', 'IWM'];
    const demoPositions = [];

    for (const symbol of symbols) {
      const result = await this.createPosition({ symbol });
      if (result.success) {
        demoPositions.push(result.position);
      }
    }

    // Auto-initialize Webull for demo
    await this.initializeWebull();

    return {
      success: true,
      message: 'Demo data created successfully (Demo Mode)',
      created_positions: demoPositions.length,
      positions: demoPositions
    };
  }

  async resetData() {
    await this.delay(500);
    
    this.positions = [];
    this.savePositions();
    
    this.webullStatus = {
      is_running: false,
      has_automation: false,
      last_initialized_at: null,
      positions_count: 0
    };

    return {
      success: true,
      message: 'All data reset successfully (Demo Mode)'
    };
  }

  // Helper method to get simulated stock prices
  getStockPrice(symbol) {
    const basePrices = {
      'SPY': 450,
      'QQQ': 380,
      'IWM': 180,
      'AAPL': 150,
      'MSFT': 300,
      'TSLA': 250
    };
    
    const basePrice = basePrices[symbol] || 100;
    // Add some random variation (±5%)
    return Math.round(basePrice * (0.95 + Math.random() * 0.1));
  }
}

// Create singleton instance
const mockApi = new MockApiService();

export default mockApi;