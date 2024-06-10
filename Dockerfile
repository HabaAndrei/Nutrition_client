FROM node:20.11.0 AS development

WORKDIR /app

# deschid portul pentru aplicatia mea 
EXPOSE 3000

COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json

RUN npm install 

COPY . /app

CMD ["npm", "start"]