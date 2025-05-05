FROM node:18-slim

WORKDIR /app

# Copy only package files first for better caching
COPY package*.json ./
RUN npm install

# Copy application code
COPY . .

# Create data directory for persistence
RUN mkdir -p data
RUN chmod 777 data

# Make sure we're listening on 0.0.0.0 for Fly.io
ENV HOST=0.0.0.0
ENV PORT=8080

# Tell Fly.io this is a Node.js app
LABEL fly_launch_runtime="nodejs"

EXPOSE 8080

CMD ["npm", "start"]