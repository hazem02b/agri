# Étape 1: Construire l'application Angular
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build --prod

# Étape 2: Servir l'application avec 'serve'
FROM node:18-alpine
RUN npm install -g serve
COPY --from=build /app/dist/agricultural-marketplace/ /app/dist
EXPOSE 3000
CMD ["serve", "-s", "/app/dist/browser", "-l", "3000"]
