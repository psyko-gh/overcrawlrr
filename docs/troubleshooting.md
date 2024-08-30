# Troubleshooting

### Error while connecting to Overseerr

The application is not able to connect to Overseerr/Jellyseerr.

---

**Request failed with status code 404**

Most likely your `urlApi` is not configured properly.

You can test it by opening it in a browser. It should display something like:

```json
{
    "api": "Overseerr API",
    "version": "1.0"
}
```

For proper configuration, please refer to [the Configuration page](configuration.md)

---

**Request failed with status code 403**

Your credentials are not correct.

Make sure you're using the email of your Overseerr user in the `overseerr/user` field of `settings.yaml` or in your environment variable.

For proper configuration, please refer to [the Configuration page](configuration.md)

---

Should you encounter another issue, please open a [Github issue](https://github.com/psyko-gh/overcrawlrr/issues) including any element that can be helpful.

!!! warning Be careful about posting logs

    Overcrawlrr logs can display the URL your are using for Overseerr/Jellyseerr/Plex. Make sure to redact them if you don't want to make them public
