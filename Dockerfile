# Build Stage
FROM golang:1.22-alpine AS builder

WORKDIR /app
COPY ./backend .

# build executable go
RUN go build -o main main.go

# Run Stage
FROM alpine:3.17
WORKDIR /app
COPY --from=builder /app/main .
COPY ./backend/start.sh .
COPY ./backend/fixtures/exercises.json ./fixtures/exercises.json

EXPOSE 8080
CMD [ "/app/main" ]
ENTRYPOINT [ "/app/start.sh" ]
