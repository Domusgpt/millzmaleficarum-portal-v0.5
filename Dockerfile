FROM node:18-slim

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Create data directory for persistence
RUN mkdir -p data
RUN chmod 777 data

EXPOSE 8080

CMD ["npm", "start"]