#!/bin/bash

###############################################################################
# Render Backend Wake-Up Script
# 
# Purpose: Wakes up sleeping Render backend (free tier) by sending requests
# Usage: ./wake_up_backend.sh
###############################################################################

BACKEND_URL="${1:-https://mspn-dev.onrender.com/api}"
MAX_ATTEMPTS=10
DELAY=5

echo "🔥 Waking up backend at: $BACKEND_URL"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

for i in $(seq 1 $MAX_ATTEMPTS); do
  echo ""
  echo "📡 Attempt $i/$MAX_ATTEMPTS - Pinging backend..."
  
  response=$(curl -s -w "\n%{http_code}" --max-time 60 "$BACKEND_URL/" 2>&1)
  http_code=$(echo "$response" | tail -n1)
  body=$(echo "$response" | head -n-1)
  
  if [ "$http_code" = "200" ]; then
    echo "✅ Backend is AWAKE and responding!"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "Response: $body"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "✨ Your backend is ready to serve requests!"
    exit 0
  elif [ "$http_code" = "000" ]; then
    echo "⏳ Backend is waking up... (timeout/no response)"
  else
    echo "⚠️  Backend responded with status: $http_code"
  fi
  
  if [ $i -lt $MAX_ATTEMPTS ]; then
    echo "⏰ Waiting $DELAY seconds before next attempt..."
    sleep $DELAY
  fi
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "❌ Backend did not respond after $MAX_ATTEMPTS attempts"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "💡 Possible issues:"
echo "   1. Backend is still starting up (free tier can take 30-60 seconds)"
echo "   2. Backend deployment failed (check Render logs)"
echo "   3. Environment variables not set correctly"
echo "   4. MongoDB connection issues"
echo ""
echo "🔍 Next steps:"
echo "   1. Check Render dashboard logs"
echo "   2. Verify environment variables are set"
echo "   3. Check MongoDB Atlas network access"
echo "   4. Try manual deploy from Render dashboard"
echo ""

exit 1
