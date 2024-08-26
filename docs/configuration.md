# Configuration

Overcrawlrr configuration is defined in the `settings.yaml` searched by default in the `/config/` folder

!!! note "Hot reload"

    The configuration is automattically reloaded when a change is detected

---

### Overseerr authentication

Overcrawlrr need to authenticate to Overseerr to fetch movie information and create movie requests.

It is recommended to create a [local user in Overseerr](https://docs.overseerr.dev/using-overseerr/users#creating-local-users) dedicated to Overcrawlrr.
Doing so, you can have fine-grained control on its permissions:

-   Allow/deny automatic requests validation,
-   Allow/deny to request in 4K,
-   Specify the languages and the region when discovering movies,
-   And more...

Once the user is created, you can fill these value in Overcrawlrr `settings.yaml`:

```yaml title="settings.yaml"
config:
    overseerr:
        # required
        apiUrl: http://localhost:5056/api/v1
        user: xxx      # required
        password: xxx  # required
        # Optional - dryRun will not send requests to Overseerr
        #            allowing you to test your rules
        dryRun: true
```

!!! note

    The api URL should ends with `/api/v1`. Replace `http://localhost:5056` with your Overseerr URL

---

### Plex authentication

!!! note Optional

    This authentication is optional and only required if you're using the Smart Recommendations job

To read data from your Plex library, you have to specify your Plex URL and token in `settings.yaml`:

```yaml title="settings.yaml"
config:
    # Only required when using Smart recommendations job
    plex:
        apiUrl: http://localhost:32400/
        plexToken: xxx
```

---

### Using environment variables

You can refer to environment variables using the `{{ key }}` syntax.

```yaml title="settings.yaml"
config:
    overseerr:
        apiUrl: http://localhost:5056/api/v1
        user: '{{ OVERSEERR_USER }}'
        password: '{{ OVERSEERR_PASSWORD }}'
    plex:
        apiUrl: http://localhost:32400/
        plexToken: '{{ PLEX_TOKEN }}'
```

These variables can be defined in the `docker-compose.yaml`

```yaml title="docker-compose.yaml"
services:
    overcrawlrr:
        # ...
        environment:
            - OVERSEERR_USER=
            - OVERSEERR_PASSWORD=
            - PLEX_TOKEN=
```

---

You can now configure [the jobs](jobs.md) you want to use to discover movies
