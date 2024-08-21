## Commit messages

Commit messages should respect the [Conventinal Commits](https://www.conventionalcommits.org/) convention

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### type
```
    chore    Updating tasks etc (no production code change)
    build    Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)
    ci       Changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs)
    docs     Documentation only changes
    feat     A new feature
    fix      A bug fix
    perf     A code change that improves performance
    refactor A code change that neither fixes a bug nor adds a feature
    style    Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
    test     Adding missing tests or correcting existing tests
    revert   A commit revert
```

### body

Indicate a breaking change should be done in the body

```
chore!: drop support for Node 6

BREAKING CHANGE: use JavaScript features not available in Node 6.
```
