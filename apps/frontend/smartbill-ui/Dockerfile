FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5173
# Pakai --host 0.0.0.0 supaya bisa diakses dari luar container
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]