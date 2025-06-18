FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install  --include=dev

COPY . .

EXPOSE 5169
CMD ["npm", "run", "dev"]