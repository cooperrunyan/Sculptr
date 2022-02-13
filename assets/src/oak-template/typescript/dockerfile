FROM hayd/ubuntu-deno:1.5.2

EXPOSE 3000
WORKDIR /usr/app

RUN deno install -qAfn vr --no-check https://deno.land/x/velociraptor@1.4.0/cli.ts

COPY src/deps.ts ./src/deps.ts
RUN deno cache --unstable src/deps.ts

ADD . .
RUN deno cache --unstable src/server/server.ts

ENTRYPOINT [ "/usr/local/bin/vr" ]

CMD ["local"]