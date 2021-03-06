FROM arm32v7/node:alpine

ENV USER=
ENV PASSWORD=
ENV DOMAIN=
ENV PERIOD=

WORKDIR /ddns
COPY ./src ./src
COPY ./package.json ./
COPY ./package-lock.json ./

RUN npm ci --loglevel warn

CMD ["npm","start"]