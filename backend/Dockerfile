FROM golang:1.20-alpine3.17

WORKDIR /app
COPY . /app

RUN go mod download

# install air
RUN go install github.com/cosmtrek/air@latest

EXPOSE 8080
CMD [ "air", "-c", ".air.toml" ]
