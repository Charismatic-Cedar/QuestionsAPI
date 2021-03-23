FROM node:14.16.0-alpine3.13
RUN mkdir -p /app
WORKDIR /app
COPY . /app
RUN npm install
EXPOSE 3200
CMD ["npm", "start"]