#!/bin/bash

echo "Setting up Instituciones CRUD API..."

if ! command -v bun &> /dev/null; then
    echo "Bun is not installed. Please install Bun first:"
    echo "   curl -fsSL https://bun.sh/install | bash"
    exit 1
fi
if ! command -v docker &> /dev/null; then
    echo "Docker is not installed. Please install Docker first:"
    echo "   https://www.docker.com/get-started"
    exit 1
fi

echo "Prerequisites check passed"
echo "Installing dependencies..."
bun install
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cat > .env << EOF
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://admin:yx05%21%235YV%21CZQ0s0@localhost:27018/eduscale?authSource=admin
EOF
    echo ".env file created"
else
    echo ".env file already exists"
fi
echo "Starting MongoDB..."
docker-compose up mongodb -d
echo "Waiting for MongoDB to be ready..."
sleep 5
if docker ps | grep -q mongodb; then
    echo "MongoDB is running"
else
    echo "Failed to start MongoDB"
    exit 1
fi

echo ""
echo "Setup complete!"
echo ""
echo "To start the API server:"
echo "  bun run dev"
echo ""
echo "To start with Docker Compose:"
echo "  docker-compose up --build"
echo ""
echo "API will be available at: http://localhost:3000/api/v1/instituciones"
echo ""
echo "For more information, see README.md"
