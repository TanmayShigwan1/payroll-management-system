#!/bin/bash

echo "🚀 Setting up Payroll Management System..."

# Install MySQL
echo "📦 Installing MySQL..."
sudo apt-get update
sudo apt-get install -y mysql-server

# Start MySQL service
echo "🔄 Starting MySQL service..."
sudo service mysql start

# Set up MySQL database
echo "🗄️ Setting up database..."
sudo mysql -e "CREATE DATABASE IF NOT EXISTS payroll_db;"
sudo mysql -e "CREATE USER IF NOT EXISTS 'payroll'@'localhost' IDENTIFIED BY 'payroll123';"
sudo mysql -e "GRANT ALL PRIVILEGES ON payroll_db.* TO 'payroll'@'localhost';"
sudo mysql -e "FLUSH PRIVILEGES;"

# Import database schema
echo "📊 Importing database schema..."
sudo mysql payroll_db < database/init-db.sql

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend && npm install && cd ..

echo "✅ Setup complete!"
echo ""
echo "🎯 To run the system:"
echo "1. Backend: cd backend && mvn spring-boot:run"
echo "2. Frontend: cd frontend && npm start"
echo ""
echo "🔐 Login credentials:"
echo "Admin: admin / secret123"
echo "HR: hr_manager / secret123"
echo ""
