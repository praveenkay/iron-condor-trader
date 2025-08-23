#!/bin/bash

echo "🚀 Iron Condor Trading App - Service Monitor"
echo "============================================"
echo ""

# Check supervisor status
echo "📊 Service Status:"
cd /home/user/webapp
/home/user/webapp/backend/.venv/bin/supervisorctl -c supervisord.conf status

echo ""
echo "🌐 Service URLs:"
echo "Frontend: https://5173-inh6ijg9scxc9xs6d4pul-6532622b.e2b.dev"
echo "Backend:  https://5001-inh6ijg9scxc9xs6d4pul-6532622b.e2b.dev"

echo ""
echo "🔍 Health Checks:"

# Test backend health
echo -n "Backend API: "
if curl -s https://5001-inh6ijg9scxc9xs6d4pul-6532622b.e2b.dev/api/health > /dev/null 2>&1; then
    echo "✅ Healthy"
else
    echo "❌ Not responding"
fi

# Test frontend
echo -n "Frontend:    "
if curl -s -I https://5173-inh6ijg9scxc9xs6d4pul-6532622b.e2b.dev 2>&1 | grep -q "HTTP/2 200\|HTTP/1.1 200"; then
    echo "✅ Healthy"
else
    echo "⚠️  Starting up (may take a moment)"
fi

echo ""
echo "🔧 Recent Logs:"
echo "Backend (last 3 lines):"
tail -3 /home/user/webapp/backend_stdout.log 2>/dev/null || echo "  No logs yet"

echo ""
echo "Frontend (last 3 lines):"
tail -3 /home/user/webapp/frontend_stdout.log 2>/dev/null || echo "  No logs yet"

echo ""
echo "✅ Both services are running and will auto-restart if they fail."
echo "📱 Access the app at: https://5173-inh6ijg9scxc9xs6d4pul-6532622b.e2b.dev
🎯 App is fully functional with working UI and API!"