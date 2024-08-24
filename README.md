# Overcrawlrr

[![Overcrawlrr Release](https://github.com/psyko-gh/overcrawlrr/actions/workflows/release.yaml/badge.svg)](https://github.com/psyko-gh/overcrawlrr/actions/workflows/release.yaml)

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


# Installation

To create a container for Overcrawlrr you can either use docker-compose or the docker cli.

## docker-compose (recommended)

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

# Configuration

## Configure Overseerr

An Overseerr user must be configured to post requests.

It is recommended to create a [local user in Overseerr](https://docs.overseerr.dev/using-overseerr/users#creating-local-users) for Overcrawlrr.
When testing your rules, you can disable Overseerr automatic validations for this user.
You'll need to validate the requests in Overseerr, allowing for a double check on your rules.

```yaml
  config:
    overseerr:
      apiUrl: xxx
      # Required - either the explicit value or '{{ OVERSEERR_USER }}' to load it from the matching environment variable
      user: '{{ OVERSEERR_USER }}'
      # Required - either the explicit value or '{{ OVERSEERR_PASSWORD }}' to load it from the matching environment variable
      password: '{{ OVERSEERR_PASSWORD }}'
      dryRun: true # Optional - dryRun will not send requests to Overseerr allowing you to test your rules
```

## Configure the cron

It's time to configure the discovery job. It will fetch movies from Overseerr (from the upcoming/popular/trending sections) and evaluate each of them.

```yaml
config:
  overseer:
    # ....
  discovery:
    # Required
    cron: '? 30 3 * * *'
    # Required - the overseer streams to search through
    # Possible values: upcoming, popular, trending
    streams:
      - upcoming
      - popular
      - trending
    # Required - the name of the ruleset used to evaluate movies
    ruleset: Ruleset name
```

# Rulesets

A ruleset defines a group of rules, used to detect if a movie should be requested or not.

```yaml
config:
  # ...
  rulesets:
      # Required - the name of the ruleset
    - name: Ruleset name
      # Optional - the name of another ruleset. This ruleset will apply all the rules in the extended rulese
      #            before applying its own rules
      extends: Another ruleset
      # Required - An array defining the rules of the ruleset
      rules:
        - # rule 1
        - # rule 2
        - # rule ...
```

- The rules are applied in the declared order,
- When a rule matches, the rule `action` is applied, and the evaluation of the ruleset stops.
- If a rule doesn't match, it is ignored, and the next rule is evaluated.

## Rule definition

```yaml
    # Required - the name of the rule
  - name: The rule name
    # Required - an array defining the predicates used in the rule
    whenMatch:
      - # predicate 1
      - # predicate 2
      - # ...
      - # predicate n
    # Required - the action to apply when the rule matches
    # Possible values: accept or reject
    action: accept
```

The rule will match if **all the predicates** in the `whenMatch` match.

When matching:
- If `action: accept`, a request is sent to Overseerr to add the movie,
- If `action: reject`, the movie is ignored, and the evaluation of the ruleset stops.

## Rule predicates

### `adult`

Filters on the adult status of the movie.

```yaml
    - adult: yes
      # or
    - adult: no
```

---
### `age`

Filters on the age of the movie.

See [Duration expressions](#duration-expressions) for more details

```yaml
    - age: less than 2 years
      # or
    - age: more than 6 months
```

---
### `and`

Predicate that will match if all of its predicate matches

```yaml
    # Will match if the movie is less than 2 years old AND if the movie genre is 'animation'
    - and:
        - age: less than 2 years
        - genre:
            - animation
```

---
### `cast`

Filters based on the cast of the movie. Will match when one or more of the listed name matches.

**Case insensitive**

```yaml
    - cast:
        - Denzel Washington
        - Jessica Alba
```

---
### `crew`

Filters based on the crew of the movie. Will match when one or more of the listed name matches.

**Case insensitive**

```yaml
    - crew:
        - James Cameron
        - Hans Zimmer
```

It is also possible to specify the job
```yaml
    - crew:
        job: director
        names:
          - James Cameron
          - Steven Spielberg
```

---
### `genre`

Filters on the genre of the movie. Will match when one or more of the listed genres matches the genre of the movie.

**Case insensitive**

```yaml
    - genre: musical
    # or with an array of values
    - genre:
        - animation
        - romance
```

---
### `not`

Predicate that invert the result of its child predicate

```yaml
    - not:
        - genre:
            - animation
```

---
### `originalLanguage`

Filters on the original language of the movie

**Case insensitive**

```yaml
    # ISO 639-1 format of the language (de, au, us, fr...)
    - originalLanguage: en
    # or with an array of values
    - originalLanguage:
        - en
        - fr
```

---
### `or`

Predicate that will match if any of its predicate matches

```yaml
    # Will match if the movie is less than 2 years old OR if the movie score is above 8
    - or:
        - age: less than 2 years
        - score: above 8
```

---
### `productionCompany`

Filters based on the production companies of the movie. Will match when one or more of the listed company matches.

**Case insensitive**

```yaml
    - productionCompany:
        - 20th Century Fox
        - Warner Bros. Pictures
        - Twisted Pictures
```

---
### `released`

Filters on the released status of the movie.

```yaml
    - released: yes
      # or
    - released: no
```

---
### `runtime`

Filters on the runtime _(duration)_ of the movie.

See [Duration expressions](#duration-expressions) for more details

```yaml
    - runtime: less than 2.5 hours
      # or
    - runtime: more than 120 minutes
```

---
### `score`

Filters on the score of the movie.

```yaml
    - score: above 6.5
      # or
    - score: below 5.5
```

---
### `status`

Filters on the status of the movie.

The possible values are the one provided by [TMDB](https://www.themoviedb.org/): `rumored`, `planned`, `in production`, `post production`, `released`, `canceled`

**Case insensitive**

```yaml
    - status: released
    # or with an array of values
    - status:
        - released
        - post production
        - planned
```

---
### `voteCount`

Filters on the vote count of the movie.


```yaml
    - voteCount: above 1000
      # or
    - voteCount: below 100
```

---

### `watchProviders`

Filters based on the available Streaming/VOD platforms. Will match when one or more of the listed provider matches.

**Case insensitive**

```yaml
    # This predicate will match when the movie is available in Germany on Netflix or Amazon Prime
    - watchProviders:
          # ISO 3166-1 alpha-2 format of the region (de, au, us, fr...)
        - region: de
        - names:
            - Netflix
            - Amazon Prime
```

---

### Duration expressions

Duration expressions, like the one used in the `age` or `runtime` predicate can be expressed in the following way:
- an **operator**: `less than` or `more than`
- a integer or decimal **number**: `2` or `2.5`
- a **unit**: one of the following `year`, `month`, `week`, `day`, `hour`, `minute`. Singular or plural doesn't matter, so `hour` is the same as `hours`
