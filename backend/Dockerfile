FROM golang:1.22-alpine

WORKDIR /app

# install air
RUN go install github.com/cosmtrek/air@latest

COPY go.mod go.sum ./
RUN go mod download

EXPOSE 8080
CMD [ "air", "-c", ".air.toml" ]
