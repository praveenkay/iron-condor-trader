#!/bin/bash

# Iron Condor Trading App - Keepalive Script
# This script ensures both services stay running

cd /home/user/webapp

# Function to check and restart supervisor if needed
check_supervisor() {
    if ! pgrep -f supervisord > /dev/null; then
        echo "🔄 Starting supervisord..."
        /home/user/webapp/backend/.venv/bin/supervisord -c supervisord.conf
        sleep 3
    fi
}

# Function to check and restart services
check_services() {
    local status=$(/home/user/webapp/backend/.venv/bin/supervisorctl -c supervisord.conf status 2>/dev/null)
    
    # Check backend
    if ! echo "$status" | grep -q "backend.*RUNNING"; then
        echo "🔄 Restarting backend service..."
        /home/user/webapp/backend/.venv/bin/supervisorctl -c supervisord.conf restart backend
    fi
    
    # Check frontend
    if ! echo "$status" | grep -q "frontend.*RUNNING"; then
        echo "🔄 Restarting frontend service..."
        /home/user/webapp/backend/.venv/bin/supervisorctl -c supervisord.conf restart frontend
    fi
}

# Main keepalive loop
echo "🚀 Iron Condor Trading App - Keepalive Started"
echo "Services will be monitored and auto-restarted if needed"
echo "Press Ctrl+C to stop monitoring"

while true; do
    check_supervisor
    check_services
    
    # Show status every 30 seconds
    echo "$(date): Services are running..."
    sleep 30
done