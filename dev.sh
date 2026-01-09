#!/bin/bash

# Sturdy App - Development Scripts
# Run both web and mobile versions

echo "🛡️  STURDY APP - Development Environment"
echo "========================================"
echo ""
echo "Choose which app to run:"
echo ""
echo "  1) Web App (Next.js) - localhost:3000"
echo "  2) Mobile App (Expo) - Scan QR code or choose platform"
echo "  3) Both (Web + Mobile in separate terminals)"
echo ""
read -p "Enter your choice (1-3): " choice

case $choice in
  1)
    echo ""
    echo "🌐 Starting Web App..."
    cd nextjs-app && npm run dev
    ;;
  2)
    echo ""
    echo "📱 Starting Mobile App..."
    echo "After it starts, choose your platform:"
    echo "  - Press 'i' for iOS simulator"
    echo "  - Press 'a' for Android emulator"
    echo "  - Press 'w' for web preview"
    echo "  - Scan QR code with Expo Go app"
    echo ""
    cd sturdy-app && npm start
    ;;
  3)
    echo ""
    echo "🚀 Starting both apps..."
    echo "Opening separate terminal windows..."
    echo ""
    # Open web app in new terminal
    cd nextjs-app && npm run dev &
    WEB_PID=$!
    
    # Wait a moment
    sleep 2
    
    # Open mobile app in new terminal
    cd ../sturdy-app && npm start &
    MOBILE_PID=$!
    
    echo "Both apps are starting!"
    echo "Web: http://localhost:3000"
    echo "Mobile: Check the Expo QR code in the terminal"
    echo ""
    echo "Press Ctrl+C to stop both apps"
    
    # Wait for both processes
    wait $WEB_PID $MOBILE_PID
    ;;
  *)
    echo "Invalid choice. Please run the script again."
    exit 1
    ;;
esac
