# UI Build Stage (Frontend)
FROM node:18-alpine AS ui-build

# Set the working directory
WORKDIR /app

# Copy client package.json and package-lock.json files
COPY client/package*.json ./client/

# Install client dependencies
WORKDIR /app/client
RUN npm install --legacy-peer-deps

# Copy client source code
COPY client/ ./

# Build the frontend (Angular)
RUN npm run build

# Server Build Stage (Backend)
FROM node:18-alpine AS server-build

# Set the working directory
WORKDIR /app

# Copy server package.json and package-lock.json files
COPY package*.json ./

# Install server dependencies
RUN npm install --legacy-peer-deps

# Copy server source code
COPY . ./

# Build the backend (TypeScript compilation)
RUN npm run build

# Final Image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy backend build output and node_modules
COPY --from=server-build /app/dist ./dist
COPY --from=server-build /app/node_modules ./node_modules

# Copy frontend build output into the public folder
COPY --from=ui-build /app/dist/client ./public

# Expose the application's port
EXPOSE 3000

# Set production environment variable
ENV NODE_ENV=production

# Start the backend server
CMD ["node", "dist/server.js"]
