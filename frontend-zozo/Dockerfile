# Build stage
FROM node:20-alpine as build

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code and build the application
COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy built files and package files for npm ci
COPY --from=build /app/dist ./dist
COPY package*.json ./

# Install production dependencies and global serve
RUN npm ci && npm install -g serve

# Expose port 3000 and start serve
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "80"]
