#!/bin/bash
echo "🚀 Starting Payroll Management System"
echo "===================================="

# Kill any existing processes
pkill -f "python.*8000"
pkill -f "node.*3000"

# Start frontend server
cd /workspaces/payroll-management-system/frontend
echo "Starting frontend on port 8000..."
python3 -m http.server 8000 &

echo ""
echo "✅ Frontend available at: http://localhost:8000"
echo "🔧 Backend will start with Docker on port 8080"
echo ""
echo "Access your payroll system at: http://localhost:8000"