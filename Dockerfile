FROM node:10

WORKDIR /usr/src/app

COPY . .

RUN npm install

RUN echo "#!/usr/bin/env bash" >> seed-and-launch.sh
RUN echo "npm run migrate --env staging" >> seed-and-launch.sh
RUN echo "npm run seed --env staging" >> seed-and-launch.sh
RUN echo "node src/server.js" >> seed-and-launch.sh

RUN chmod +x seed-and-launch.sh
RUN chmod +x resources/docker/wait-for-it.sh

ENV NODE_ENV staging
ENV JWT_SECRET fromage

EXPOSE 3000
CMD [ "./resources/docker/wait-for-it.sh", "db:5432", "--", "./seed-and-launch.sh" ]