Rulesets and rules allow you to precisely decide if a movie is worth requesting or not.

---

# Rulesets

A ruleset is a named group of rules.

```yaml title="settings.yaml"
config:
    # ...
    rulesets:
        # Required - the name of the ruleset
        - name: Ruleset name
          # Optional - the name of another ruleset.
          #            This ruleset will apply all the rules in the extended ruleset
          #            before applying its own rules
          extends: Another ruleset
          # Required - An array defining the rules of the ruleset
          rules:
              -  # rule 1
              -  # rule 2
              -  # rule ...
```

-   The rules are applied in the declared order,
-   When a rule matches, the rule's `action` is applied, and the evaluation of the ruleset stops.
-   If a rule doesn't match, it is ignored, and the next rule is evaluated.

---

## Rule definition

A rule is a named group of predicates.

A predicate is a simple operation allowing to test the property of a movie.

```yaml title="settings.yaml"
# Required - the name of the rule
- name: The rule name
  # Required - an array defining the predicates used in the rule
  whenMatch:
      -  # predicate 1
      -  # predicate 2
      -  # ...
      -  # predicate n
  # Required - the action to apply when the rule matches
  # Possible values: accept or reject
  action: accept
```

The rule will match if **all the predicates** in the `whenMatch` match.

When matching:

-   If `action: accept`, a request is sent to Overseerr to add the movie,
-   If `action: reject`, the movie is ignored, and the evaluation of the ruleset stops for this movie.

---

## Ruleset extension

Using the `extends` property of a ruleset, you can add rules to an existing ruleset.

This is particularly useful for common rejection rules.

```yaml title="settings.yaml"
config:
    # ...
    rulesets:
        - name: exclude-netflix
          rules:
              - name: Exclude netflix movies
                watchProviders:
                    - region: us
                    - names:
                          - Netflix
          action: reject
        - name: filter-movies
          extends: exclude-netflix # movie will be evaluated against exclude-netflix rules first
          rules:
              - name: High score
                whenMatch:
                    - age: less than 1 year
                    - score: above 9/10
          action: accept
```

## Ruleset example

The following ruleset will:

1. Reject any animation or romance movie,
2. Request all movies _(that went through rule 1)_ released in the past year, with a score above 7

```yaml title="settings.yaml"
rulesets:
    - name: New great movie
      rules:
          - name: Reject less wanted genres
            whenMatch:
                - genre:
                      - animation
                      - romance
            action: reject
          - name: New great movies
            whenMatch:
                - age: less than 1 years
                - score: above 7
            action: accept
```
