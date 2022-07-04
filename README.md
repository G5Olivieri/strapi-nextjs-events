# Events System

A simple system to manage events to a specialized environment, as like University presentation week.

## Monkey patches

- I changed the keycloak `request_url` and `authorize_url` from `https` to `http` in grant `oauth.json` config file.
- I extended users-permissions plugin to add the Keycloak provider.
- I request the strapi JWT and user ID in the NextAuth callback, and I added in Session object.

I made some monkey patches to connect strapi + nextauth to the local keycloak instance, these patches can be removed using an official auth provider, like Google.
These patches exist to be able to run everything locally without external dependencies.

# How it works

## Backend 

The backend is a dockerized backend application with strapi, postgreSQL, mailhog and keycloak.

### [Strapi](https://strapi.io/)

I used the Strapi CMS as backend, because a CMS solution would make the events 
management easier, speakers and subscriptions, or any other persistent entities. 
I used Strapi because it was the first option in 
https://jamstack.org/headless-cms/, but I could use the graphCMS or any other 
headless CMS, I didn't compare the CMS systems and I don't know if there 
is another better. (I would like to see the comparisons)

I followed [this guide](https://blog.dehlin.dev/docker-with-strapi-v4) to run 
Strapi v4 inside the docker, but I did some improvements, like using
docker alpine image (APT is very slow).

The Strapi was perfect to manage events, because events are only content.  
This approach prevented me from building a complete backoffice system, I only 
need to manage the editors via admin painel, so they will to ingest the events 
to the system, with a builtin access control it was easy.

The GraphQL support is very nice, I liked so much, it made my life easier.

The Strapi also has a file management with S3, then I could to extend the system
to support profile image, event image, etc.

I saw the Strapi has webhooks, I think it's possible to buid a notification 
system to the user, maybe notify user when the subscribed event changed, or 
when a new event is registered.

I didn't like there's not access control to API Tokens, I had to create 
a user to NextJS app, I needed to login every time that I needed to perform 
some privileged call to Strapi.

The time input is horrible, it's very hard to select 7PM, I needed an 
infinite scroll, it takes a few minutes to get the time.

### [Keycloak](https://www.keycloak.org/)

I used Keycloak as auth provider because it easy to startup locally, but 
in production I would use the Google or Auth0. 
To maintain a Keycloak instance is a bored task.

To connect Keycloak and postgres, I created a new user and database by hand.

## Frontend

The frontend is a [NextJS](https://nextjs.org/) application, I used [NextAuthJS](https://next-auth.js.org/)
to execute auth integration and [TailwindCSS](https://tailwindcss.com/) to stylesheet.

I chose NextJS because it's the first option in 
https://jamstack.org/generators/. I didn't compare with others. 
(I would like to see the comparisons)

This project was my first contact with NextJS and TailwindCSS, so I don't 
know if it's following the best practices of both.

I don't follow any design system I was just positioning and creating 
the components.

I used the GraphQL to communicate NextJS and Strapi, it also was 
my first contact with GraphQL, I didn't study about I only followed the 
[rocketseat Ignite lab classes](https://github.com/diego3g/ignite-lab-react/).

# Notes

This is study purpose app, it's not production ready, I was testing 
headless CMS + NextJS + GraphQL architecture, basicly the jamstack.

The problem was inspired by personal problems with events in
Universities.

To continue this project I need to refactor almost everything, add 
testing, static analysis, security analysis.

I need to deploy this project to cloud to test the behavior in the
production environment. I need to make some integrations, like
vercel, heroku, github actions, newrelic, google analytics and google auth.

I abandoned the speaker page 

I need to improve SEO and performance.

I would like to implement presence control with QRCode.
