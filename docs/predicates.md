# Predicates

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

Overseerr score is expressed between 0 to 10, but to make things clear, it is possible to pass the score as a fractional number.

```yaml
    - score: above 6.5
      # or
    - score: below 75/100 # Would be the same as 7.5, 7.5/10 or even 750/1000
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

The following expressions are valid:

- `less than 1 hour`/`less than 1 hours`/`less than 60 minutes`
- `less than 3 hours`/`less than 3 hour`/`less than 180 minute`
- `more than 6 month`
