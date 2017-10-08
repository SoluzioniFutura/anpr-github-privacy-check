# anpr-github-privacy-check


This NodeJs project executes an ExpressJs web server that exposes a 
[GitHub webhook](https://developer.github.com/webhooks) compliant endpoint
at `/github`.

To run the application you just have to install all the dependencies:

```npm install```

and then:

```npm start```

This will start the Express application listening on port 8000

You can also execute some tests running command:

```npm test```


The application will search for any sensitive information inside every new issue
and comment, censoring it and replying with warning to the author, customizable in `config.json`.

To setup the webhook you just have to modify your repo, user, or organization settings as you can
see on this image: 


![Immagine di configurazione web hooks github](https://github.com/SoluzioniFutura/anpr-github-privacy-check/blob/master/info.png?raw=true)


In order to run properly, the application requires to be configured editing `credentials.json` with your
github credentials (username and password OR a token) and, optionally, a secret key
that you must also specify in the webhook configuration process.

Right now the application will scrape for:
- italian cellular phone numbers
- italian social security number
- visa and mastercard credit cards
- emails

You can easily add other categories of elements to scrape for simply adding 
new RegExp to `securityChecks.js`;
