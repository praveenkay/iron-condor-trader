#!/usr/bin/env python3
"""
Iron Condor Trading App - Backend API
Enhanced with realistic trading simulation and live market data integration
"""
import json
import time
from datetime import datetime, timedelta
from decimal import Decimal
from typing import Dict, Any, Optional, List

from flask import Flask, request, jsonify
from flask_cors import CORS
import yfinance as yf
import pytz

# Conditional import for Playwright (browser automation simulation)
try:
    from playwright.async_api import async_playwright
except ImportError:
    async_playwright = None
    print("Warning: Playwright not installed. Browser automation features will be simulated.")

app = Flask(__name__)
CORS(app)

# Global state management
STATE = {
    'webull': {
        'is_running': False,
        'has_automation': False,
        'last_initialized_at': None,
        'positions': []
    },
    'market': {
        'last_vix_check': None,
        'vix_value': None,
        'is_market_open': False
    },
    'positions': {
        'iron_condors': []
    }
}

def _now_iso():
    """Return current timestamp in ISO format"""
    return datetime.now(pytz.UTC).isoformat()

def _get_market_hours():
    """Get current market status"""
    now = datetime.now(pytz.timezone('US/Eastern'))
    # Market is open Monday-Friday 9:30 AM - 4:00 PM ET
    if now.weekday() >= 5:  # Saturday = 5, Sunday = 6
        return False
    market_open = now.replace(hour=9, minute=30, second=0, microsecond=0)
    market_close = now.replace(hour=16, minute=0, second=0, microsecond=0)
    return market_open <= now <= market_close

def _fetch_vix_data():
    """Fetch current VIX data using yfinance"""
    try:
        vix = yf.Ticker("^VIX")
        data = vix.history(period="1d", interval="1m")
        if not data.empty:
            current_vix = float(data['Close'].iloc[-1])
            STATE['market']['vix_value'] = current_vix
            STATE['market']['last_vix_check'] = _now_iso()
            STATE['market']['is_market_open'] = _get_market_hours()
            return current_vix
    except Exception as e:
        print(f"Error fetching VIX data: {e}")
        # Return a simulated VIX value if real data unavailable
        import random
        simulated_vix = round(random.uniform(15.0, 35.0), 2)
        STATE['market']['vix_value'] = simulated_vix
        STATE['market']['last_vix_check'] = _now_iso()
        return simulated_vix
    return None

def _generate_iron_condor_position(symbol: str = "SPY"):
    """Generate a realistic Iron Condor position with current market data"""
    try:
        ticker = yf.Ticker(symbol)
        data = ticker.history(period="1d")
        current_price = float(data['Close'].iloc[-1]) if not data.empty else 450.0
    except:
        current_price = 450.0  # Fallback price
    
    # Iron Condor setup: sell put spread and call spread
    put_strike_short = round(current_price * 0.95, 0)  # 5% OTM put
    put_strike_long = round(current_price * 0.90, 0)   # 10% OTM put
    call_strike_short = round(current_price * 1.05, 0)  # 5% OTM call
    call_strike_long = round(current_price * 1.10, 0)   # 10% OTM call
    
    # Calculate realistic premium (simplified)
    put_spread_credit = round((current_price * 0.02), 2)  # ~2% of stock price
    call_spread_credit = round((current_price * 0.02), 2)  # ~2% of stock price
    total_credit = put_spread_credit + call_spread_credit
    
    # Calculate max profit/loss
    spread_width = put_strike_short - put_strike_long  # Same for both spreads
    max_loss = spread_width - total_credit
    
    position = {
        'id': f"IC_{symbol}_{int(time.time())}",
        'symbol': symbol,
        'type': 'iron_condor',
        'underlying_price': current_price,
        'strikes': {
            'put_long': put_strike_long,
            'put_short': put_strike_short,
            'call_short': call_strike_short,
            'call_long': call_strike_long
        },
        'premium_collected': total_credit,
        'max_profit': total_credit,
        'max_loss': max_loss,
        'quantity': 1,
        'opened_at': _now_iso(),
        'status': 'open',
        'pnl': 0.0,
        'days_to_expiration': 30  # Typical monthly expiration
    }
    
    return position

# API Routes

@app.route('/api/health')
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': _now_iso(),
        'services': {
            'webull': STATE['webull']['is_running'],
            'market_data': STATE['market']['last_vix_check'] is not None
        }
    })

@app.route('/api/webull/status')
def webull_status():
    """Get Webull connection status"""
    return jsonify({
        'is_running': STATE['webull']['is_running'],
        'has_automation': STATE['webull']['has_automation'],
        'last_initialized_at': STATE['webull']['last_initialized_at'],
        'positions_count': len(STATE['webull']['positions'])
    })

@app.route('/api/webull/initialize', methods=['POST'])
def webull_initialize():
    """Initialize Webull browser automation for login simulation"""
    body = request.get_json(silent=True) or {}
    headless = bool(body.get('headless', False))
    
    try:
        # Simulate browser automation initialization
        if async_playwright is not None:
            print(f"[SIMULATION] Opening browser (headless={headless}) and navigating to Webull login...")
            print("[SIMULATION] Browser automation ready for manual login")
        
        STATE['webull']['is_running'] = True
        STATE['webull']['has_automation'] = True
        STATE['webull']['last_initialized_at'] = _now_iso()
        
        # Brief pause to simulate browser startup
        time.sleep(1)
        
        return jsonify({
            'success': True, 
            'headless': headless,
            'message': 'Browser automation initialized. Please complete login manually.',
            'next_step': 'Login to your Webull account in the opened browser window'
        })
    except Exception as e:
        return jsonify({
            'success': False, 
            'error': f'Failed to initialize browser automation: {str(e)}'
        }), 500

@app.route('/api/webull/login-test', methods=['POST'])
def webull_login_test():
    """Test Webull login status (simulated)"""
    if not STATE['webull']['is_running']:
        return jsonify({
            'success': False,
            'error': 'Browser automation not initialized. Please initialize first.'
        }), 400
    
    # Simulate login testing
    time.sleep(0.5)  # Simulate checking login status
    
    # For demonstration, randomly succeed or fail
    import random
    login_successful = random.choice([True, True, True, False])  # 75% success rate
    
    if login_successful:
        return jsonify({
            'success': True,
            'logged_in': True,
            'message': 'Successfully logged into Webull account',
            'account_info': {
                'account_id': 'DEMO_12345',
                'account_type': 'MARGIN',
                'buying_power': 25000.00
            }
        })
    else:
        return jsonify({
            'success': False,
            'logged_in': False,
            'message': 'Login required. Please complete login in the browser window.'
        })

@app.route('/api/market/vix')
def get_vix_data():
    """Get current VIX data"""
    vix_value = _fetch_vix_data()
    
    if vix_value is None:
        return jsonify({
            'success': False,
            'error': 'Unable to fetch VIX data'
        }), 500
    
    return jsonify({
        'success': True,
        'vix': vix_value,
        'timestamp': STATE['market']['last_vix_check'],
        'market_open': STATE['market']['is_market_open'],
        'condition_met': vix_value > 20.0,  # Example condition for Iron Condor
        'message': f"VIX at {vix_value}. " + 
                   ("Good conditions for Iron Condor" if vix_value > 20.0 else "Wait for higher volatility")
    })

@app.route('/api/positions/iron-condor', methods=['GET'])
def get_iron_condor_positions():
    """Get all Iron Condor positions"""
    return jsonify({
        'success': True,
        'positions': STATE['positions']['iron_condors'],
        'total_positions': len(STATE['positions']['iron_condors'])
    })

@app.route('/api/positions/iron-condor', methods=['POST'])
def create_iron_condor_position():
    """Create a new Iron Condor position"""
    body = request.get_json(silent=True) or {}
    symbol = body.get('symbol', 'SPY')
    
    # Check if Webull is connected (simulation)
    if not STATE['webull']['is_running']:
        return jsonify({
            'success': False,
            'error': 'Webull connection required to create positions'
        }), 400
    
    try:
        position = _generate_iron_condor_position(symbol)
        STATE['positions']['iron_condors'].append(position)
        
        # Also add to Webull positions for consistency
        STATE['webull']['positions'].append(position)
        
        return jsonify({
            'success': True,
            'position': position,
            'message': f'Iron Condor position created for {symbol}'
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Failed to create position: {str(e)}'
        }), 500

@app.route('/api/positions/iron-condor/<position_id>', methods=['DELETE'])
def close_iron_condor_position(position_id: str):
    """Close an Iron Condor position"""
    try:
        # Find position in both lists
        position = None
        for i, pos in enumerate(STATE['positions']['iron_condors']):
            if pos['id'] == position_id:
                position = STATE['positions']['iron_condors'].pop(i)
                break
        
        if not position:
            return jsonify({
                'success': False,
                'error': 'Position not found'
            }), 404
        
        # Also remove from Webull positions
        STATE['webull']['positions'] = [
            pos for pos in STATE['webull']['positions'] 
            if pos['id'] != position_id
        ]
        
        # Simulate closing with current P&L calculation
        position['status'] = 'closed'
        position['closed_at'] = _now_iso()
        
        # Simple P&L calculation (could be enhanced)
        import random
        position['pnl'] = round(random.uniform(-position['max_loss'], position['max_profit']), 2)
        
        return jsonify({
            'success': True,
            'closed_position': position,
            'message': f'Position {position_id} closed with P&L: ${position["pnl"]}'
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Failed to close position: {str(e)}'
        }), 500

@app.route('/api/testing/demo-data', methods=['POST'])
def create_demo_data():
    """Create demo data for testing purposes"""
    try:
        # Create sample Iron Condor positions
        demo_positions = []
        symbols = ['SPY', 'QQQ', 'IWM']
        
        for symbol in symbols:
            position = _generate_iron_condor_position(symbol)
            demo_positions.append(position)
        
        # Add to state
        STATE['positions']['iron_condors'].extend(demo_positions)
        STATE['webull']['positions'].extend(demo_positions)
        
        # Simulate Webull connection
        STATE['webull']['is_running'] = True
        STATE['webull']['has_automation'] = True
        STATE['webull']['last_initialized_at'] = _now_iso()
        
        # Fetch VIX data
        _fetch_vix_data()
        
        return jsonify({
            'success': True,
            'message': 'Demo data created successfully',
            'created_positions': len(demo_positions),
            'positions': demo_positions
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Failed to create demo data: {str(e)}'
        }), 500

@app.route('/api/testing/reset', methods=['POST'])
def reset_all_data():
    """Reset all application data"""
    global STATE
    STATE = {
        'webull': {
            'is_running': False,
            'has_automation': False,
            'last_initialized_at': None,
            'positions': []
        },
        'market': {
            'last_vix_check': None,
            'vix_value': None,
            'is_market_open': False
        },
        'positions': {
            'iron_condors': []
        }
    }
    
    return jsonify({
        'success': True,
        'message': 'All data reset successfully'
    })

if __name__ == '__main__':
    print(f"🚀 Iron Condor Trading API starting...")
    print(f"📊 Market data integration: {'✅ Active' if yf else '❌ Unavailable'}")
    print(f"🤖 Browser automation: {'✅ Available' if async_playwright else '❌ Simulation only'}")
    print(f"🔗 CORS enabled for frontend integration")
    print(f"⚡ Ready for Webull connection testing")
    
    app.run(host='0.0.0.0', port=5000, debug=False)