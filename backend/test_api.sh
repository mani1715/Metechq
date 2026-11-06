#!/bin/bash

echo "================================"
echo "MSPN DEV API Testing Script"
echo "================================"
echo ""

BASE_URL="http://localhost:8001/api"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: Health Check
echo -e "${YELLOW}1. Testing Health Check...${NC}"
response=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/")
if [ $response -eq 200 ]; then
    echo -e "${GREEN}✓ Health check passed${NC}"
else
    echo -e "${RED}✗ Health check failed (Status: $response)${NC}"
fi
echo ""

# Test 2: Login
echo -e "${YELLOW}2. Testing Login...${NC}"
login_response=$(curl -s -X POST "$BASE_URL/auth/login" \
    -H "Content-Type: application/json" \
    -d '{"email":"admin@mspndev.com","password":"admin123"}')

TOKEN=$(echo $login_response | python3 -c "import sys, json; print(json.load(sys.stdin).get('access_token', ''))" 2>/dev/null)

if [ -n "$TOKEN" ]; then
    echo -e "${GREEN}✓ Login successful${NC}"
    echo "Token: ${TOKEN:0:50}..."
else
    echo -e "${RED}✗ Login failed${NC}"
fi
echo ""

# Test 3: Get Services
echo -e "${YELLOW}3. Testing Get Services...${NC}"
services_response=$(curl -s "$BASE_URL/services/")
services_count=$(echo $services_response | python3 -c "import sys, json; print(len(json.load(sys.stdin)))" 2>/dev/null)

if [ -n "$services_count" ] && [ $services_count -gt 0 ]; then
    echo -e "${GREEN}✓ Services retrieved (Count: $services_count)${NC}"
else
    echo -e "${RED}✗ Failed to retrieve services${NC}"
fi
echo ""

# Test 4: Get Projects
echo -e "${YELLOW}4. Testing Get Projects...${NC}"
projects_response=$(curl -s "$BASE_URL/projects/")
projects_count=$(echo $projects_response | python3 -c "import sys, json; print(len(json.load(sys.stdin)))" 2>/dev/null)

if [ -n "$projects_count" ] && [ $projects_count -gt 0 ]; then
    echo -e "${GREEN}✓ Projects retrieved (Count: $projects_count)${NC}"
else
    echo -e "${RED}✗ Failed to retrieve projects${NC}"
fi
echo ""

# Test 5: Submit Contact Form
echo -e "${YELLOW}5. Testing Contact Form Submission...${NC}"
contact_response=$(curl -s -X POST "$BASE_URL/contacts/" \
    -H "Content-Type: application/json" \
    -d '{"name":"API Test","email":"apitest@example.com","message":"Testing API"}')

contact_id=$(echo $contact_response | python3 -c "import sys, json; print(json.load(sys.stdin).get('id', ''))" 2>/dev/null)

if [ -n "$contact_id" ]; then
    echo -e "${GREEN}✓ Contact submitted (ID: ${contact_id:0:20}...)${NC}"
else
    echo -e "${RED}✗ Contact submission failed${NC}"
fi
echo ""

# Test 6: Get Settings
echo -e "${YELLOW}6. Testing Get Settings...${NC}"
settings_response=$(curl -s "$BASE_URL/settings/")
agency_name=$(echo $settings_response | python3 -c "import sys, json; print(json.load(sys.stdin).get('agency_name', ''))" 2>/dev/null)

if [ "$agency_name" == "MSPN DEV" ]; then
    echo -e "${GREEN}✓ Settings retrieved (Agency: $agency_name)${NC}"
else
    echo -e "${RED}✗ Failed to retrieve settings${NC}"
fi
echo ""

# Test 7: Get Contacts (with auth)
if [ -n "$TOKEN" ]; then
    echo -e "${YELLOW}7. Testing Get Contacts (Admin)...${NC}"
    contacts_response=$(curl -s -H "Authorization: Bearer $TOKEN" "$BASE_URL/contacts/admin/all")
    contacts_count=$(echo $contacts_response | python3 -c "import sys, json; print(len(json.load(sys.stdin)))" 2>/dev/null)
    
    if [ -n "$contacts_count" ] && [ $contacts_count -gt 0 ]; then
        echo -e "${GREEN}✓ Contacts retrieved (Count: $contacts_count)${NC}"
    else
        echo -e "${RED}✗ Failed to retrieve contacts${NC}"
    fi
else
    echo -e "${RED}✗ Skipping admin contacts test (no token)${NC}"
fi
echo ""

echo "================================"
echo "Testing Complete!"
echo "================================"
