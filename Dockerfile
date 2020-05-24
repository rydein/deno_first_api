# docker build -t app . && docker run -it --init -p 1993:1993 app

FROM hayd/ubuntu-deno:1.0.0

EXPOSE 3000

WORKDIR /app

USER deno

ADD . .

RUN deno cache index.ts

CMD ["run", "--allow-net", "index.ts"]
