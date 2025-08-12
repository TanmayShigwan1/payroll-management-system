#!/bin/bash

echo "🚀 Starting Payroll Management System..."

# Start backend
echo "🔄 Starting Spring Boot backend on port 8080..."
cd backend
./mvnw spring-boot:run -Dspring.profiles.active=dev > ../backend.log 2>&1 &
BACKEND_PID=$!
cd ..

# Wait for backend to start
echo "⏳ Waiting for backend to start..."
sleep 45

# Check if backend is running
if kill -0 $BACKEND_PID 2>/dev/null; then
    echo "✅ Backend started successfully"
else
    echo "❌ Backend failed to start. Check backend.log"
    tail -20 backend.log
    exit 1
fi

# Start frontend
echo "🔄 Starting React frontend on port 3000..."
cd frontend
npm start > ../frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..

echo "🎉 System started!"
echo ""
echo "📱 Frontend: Check PORTS tab for port 3000"
echo "🔧 Backend API: Port 8080/api"
echo "🗃️ H2 Database Console: Port 8080/api/h2-console"
echo ""
echo "🔐 Login Credentials:"
echo "👤 Admin: admin / secret123"
echo "👤 HR Manager: hr_manager / secret123"
echo "👤 Employee: john_doe / secret123"
echo ""
echo "💡 Tips:"
echo "- Click on port 3000 in the PORTS tab to open the app"
echo "- Make port 3000 public for external access"
echo "- Check logs: tail -f backend.log or frontend.log"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for processes
trap 'kill $BACKEND_PID $FRONTEND_PID 2>/dev/null' EXIT
wait
