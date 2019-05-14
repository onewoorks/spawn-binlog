FROM node:latest

RUN mkdir /app
COPY ./ /app
RUN cd /app && npm install

