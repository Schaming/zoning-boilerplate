#!/bin/bash

# Colors for output
BLUE='\033[0;34m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

echo -e "${BLUE}🛑 Stopping PostgreSQL database...${NC}"

# Stop the database
docker-compose -f docker-compose.db.yml down

echo -e "${GREEN}✓ Database stopped${NC}"
