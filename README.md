# Overcrawlrr

[![Release](https://github.com/psyko-gh/overcrawlrr/actions/workflows/release.yaml/badge.svg)](https://github.com/psyko-gh/overcrawlrr/actions/workflows/release.yaml)
[![Edge](https://github.com/psyko-gh/overcrawlrr/actions/workflows/edge.yaml/badge.svg)](https://github.com/psyko-gh/overcrawlrr/actions/workflows/edge.yaml)

CRON based bot that automatically requests movies you may like in Overseer using your own rules.

```yaml
  # Accept Sci-fi movie with a global rating above 5
  rules:
    - name: Acceptable sci-fi movie
      whenMatch:
        - genre:
            - science-fiction
        - score: above 5
      action: accept
```

Requirement:
- a running instance of [Overseerr](https://overseerr.dev/)
- docker

Check the [documentation](https://psyko-gh.github.io/overcrawlrr/latest/) for more details

# Quick install

## docker-compose

See [docker-compose.yaml](docker-compose.yaml) file for full example

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

## docker cli

```shell
docker run -d \
  --name=overcralwrr \
  --restart=unless-stopped \
  - OVERSEERR_USER= \
  - OVERSEERR_PASSWORD= \
  -v /path/to/config:/config \
  ghcr.io/psyko-gh/overcrawlrr:latest
```
