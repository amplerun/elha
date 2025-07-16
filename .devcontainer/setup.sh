#!/bin/bash
set -e
echo "--- Starting post-creation setup script ---"
# Install root, server, and client dependencies
echo "--- Installing all dependencies ---"
npm install && npm install --prefix server && npm install --prefix client
# Create .env file for the server with the correct DB hostname
echo "--- Creating server .env file ---"
cat <<EOF > "${WORKSPACE_FOLDER}/server/.env"
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://mongo:27017/ela_ecommerce
JWT_SECRET=your_super_secret_jwt_string_for_development
EOF
echo "--- Seeding database with initial data ---"
# Wait for MongoDB to be ready inside Docker Compose
sleep 10 
node server/config/seed.js
echo "--- MERN environment setup complete. Run 'npm run dev' in a new terminal to start. ---"