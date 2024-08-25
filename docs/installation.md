# Installation

!!! warning Note

    Using Overcrawlrr requires you to have a running instance of Overseerr

With docker-compose

```yaml
services:
    overcrawlrr:
        image: ghcr.io/psyko-gh/overcrawlrr:latest
        container_name: overcrawlrr
        restart: unless-stopped
        ports:
            - 5056:5056
        environment:
            - OVERSEERR_USER=
            - OVERSEERR_PASSWORD=
        volumes:
            - /path/to/config:/config
```

With docker cli

```shell
docker run -d \
  --name=overcralwrr \
  --restart=unless-stopped \
  -e OVERSEERR_USER= \
  -e OVERSEERR_PASSWORD= \
  -v /path/to/config:/config \
  ghcr.io/psyko-gh/overcrawlrr:latest
```

??? note "Using edge image"

    To uses latest non-released features and fixes, you can use the image `ghcr.io/psyko-gh/overcrawlrr:edge`

    As an `edge` build, it can contains bugs and errors
