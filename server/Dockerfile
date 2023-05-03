FROM node:18-alpine
ADD . /appdir
WORKDIR /appdir
RUN npm run build
CMD [ "npm", "start" ]
EXPOSE 8080