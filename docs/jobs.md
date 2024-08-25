# Jobs

You can validate your CRON expressions using [Crontab](https://crontab.cronhub.io/) by Cronhub

## Discovery job

It's time to configure the discovery job.

It will fetch movies from Overseerr _(from the upcoming/popular/trending sections)_ and evaluate each of them.

```yaml title="settings.yaml"
config:
  overseer:
    # ....
  discovery:
    # Required
    cron: '30 3 * * *'
    # Required - the overseer streams to search through
    # Possible values: upcoming, popular, trending
    streams:
      - upcoming
      - popular
      - trending
    # Required - the name of the ruleset used to evaluate movies
    ruleset: Ruleset name
```

## Smart recommendations

!!! note Work in progress

    The implementation of this job is still a work in progress

This job uses your personal ratings in your Plex library to scan movies you may like.

Considering the movie you liked, it will crawl their recommended movies and apply the given ruleset.

```yaml title="settings.yaml"
config:
  plex:
  # ....
  smartRecommendations:
    # Required
    cron: '1 14 * * *'
    # The name of the plex library to use as a seed
    plexLibrary: Films
    # Your minimum personal rating to consider
    minimumRating: 6.9
    ruleset: Ruleset name
```

## Checking output

Evaluation of the jobs are displayed in the container log. If you named your service `overcrawlrr`, you can see it with the following command:

```shell
docker logs overcrawlrr --follow
```
