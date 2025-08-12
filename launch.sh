#!/bin/bash

echo "🌟 ======================================"
echo "   PAYROLL MANAGEMENT SYSTEM LAUNCHER"
echo "🌟 ======================================"
echo ""

# Check if running in Codespaces
if [ ! -z "$CODESPACES" ]; then
    echo "🔵 Detected GitHub Codespaces environment"
    echo "📦 Installing dependencies..."
    
    # Frontend dependencies
    cd frontend
    npm install --silent
    echo "✅ Frontend dependencies installed"
    cd ..
    
    echo ""
    echo "🚀 Starting applications..."
    echo ""
    
    # Start backend in background
    echo "🔧 Starting Spring Boot Backend on port 8080..."
    cd backend
    nohup mvn spring-boot:run > backend.log 2>&1 &
    BACKEND_PID=$!
    cd ..
    
    # Wait a bit for backend to start
    sleep 10
    
    # Start frontend
    echo "⚛️  Starting React Frontend on port 3000..."
    cd frontend
    npm start &
    FRONTEND_PID=$!
    cd ..
    
    echo ""
    echo "✅ ======================================"
    echo "   🎉 LAUNCH COMPLETE!"
    echo "✅ ======================================"
    echo ""
    echo "🔗 URLs:"
    echo "   Frontend: https://$CODESPACE_NAME-3000.app.github.dev"
    echo "   Backend:  https://$CODESPACE_NAME-8080.app.github.dev"
    echo ""
    echo "🔐 Login Credentials:"
    echo "   Admin: admin / secret123"
    echo "   HR:    hr_manager / secret123"
    echo ""
    echo "📝 Logs:"
    echo "   Backend: tail -f backend/backend.log"
    echo "   Frontend: Check the terminal above"
    echo ""
    
    # Wait for user input
    read -p "Press Enter to stop all services..."
    
    # Clean up
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    echo "🛑 Services stopped"
    
else
    echo "🔧 Standard environment detected"
    echo ""
    echo "📋 Prerequisites check:"
    
    # Check Java
    if command -v java &> /dev/null; then
        echo "✅ Java: $(java -version 2>&1 | head -n 1)"
    else
        echo "❌ Java not found"
    fi
    
    # Check Node
    if command -v node &> /dev/null; then
        echo "✅ Node.js: $(node --version)"
    else
        echo "❌ Node.js not found"
    fi
    
    # Check MySQL
    if command -v mysql &> /dev/null; then
        echo "✅ MySQL: $(mysql --version | head -n 1)"
    else
        echo "❌ MySQL not found"
    fi
    
    echo ""
    echo "🚀 To start the application:"
    echo "   1. Set up MySQL database"
    echo "   2. cd backend && mvn spring-boot:run"
    echo "   3. cd frontend && npm install && npm start"
    echo ""
fi
