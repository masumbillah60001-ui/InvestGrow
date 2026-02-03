FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
# Use --ignore-scripts if you want to skip postinstall scripts like prisma generate locally, 
# but for prod build we usually need it. Here we copy prisma schema first.
COPY prisma ./prisma/

RUN npm ci

# Copy source
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build TypeScript
RUN npm run build

# Expose port
EXPOSE 3000

# Start command
CMD ["npm", "start"]
