FROM node:12.22-alpine
WORKDIR /backend
COPY package.json package-lock.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD [ "npm", "start" ]