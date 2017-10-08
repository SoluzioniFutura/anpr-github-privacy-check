#anpr-github-privacy-check
This nodejs project executes an ExpressJs web server that exposes a 
[GitHub webhook](https://developer.github.com/webhooks) compliant endpoint
at `/github` POST endpoint.

The application will search for any sensitive information inside every new issue
and comment, censoring it and posting a warning to the author.

To setup the webhook you just have to modify your repo settings as you can
see on this image: 
![Immagine di configurazione web hooks github](https://github.com/SoluzioniFutura/anpr-github-privacy-check/blob/master/info.png?raw=true)
In order to run properly, the application requires to be configured with your
github credentials (username and password OR a token) and, optionally, a secret key
that you must also specify in the webhook configuration process.

Right now the application will scrape for:
- italian cellular phone numbers
- italian social security number
- visa and mastercard credit cards
- emails

You can easily add other categories of elements to scrape for simply adding 
new RegExp to `securityChecks.js`;
