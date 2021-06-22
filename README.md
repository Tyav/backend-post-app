
<h1 align="center">A Simple Backend REST application for TalentQL test assessment.</h1>


## Task:
Create a RESTful API that supports the posts functionality of Facebook.

<br>


## Overview

The Technology used in the task are notably the following among others not mentioned
 - Node for Runtime Environment
 - Typescript for App language
 - AWS S3 for File storage
 - Express for Backend Server
 - JWT for Auth
 - MongoDB for Database
 - Mongoose for MongoDB object modeling
 - PostMan for API Documentation
 - Sendgrid for emailing service

<h1 align="center">Installation</h1>

## Clone project

In your terminal, type in the following commands to clone the project to your local machine and create a `.env` file.
```sh
$ git clone https://github.com/Tyav/backend-post-app.git
$ cd backend-post-app
$ touch .env
```


the command `touch .env` creates a `.env` file in the root directory of the project.
<br>
<br>

## Get AWS S3 bucket and IAM keys

Create an account on AWS, if you don't already have one and log in to create an S3 bucket which will be used for File Storage (Make sure if you already have an account, you are in a free teir period to avoid been charged) [More details on AWS S3 here](https://docs.aws.amazon.com/AmazonS3/latest/userguide/GetStartedWithS3.html)

Then go ahead to create a user for programatic access using IAM [Details are available here](https://docs.aws.amazon.com/IAM/latest/UserGuide/getting-started.html). Copy the IAM use Access key Id and Secret Access Key and store it in your `.env` file

```txt
AWS_ACCESS_KEY_ID=<Access key ID>
AWS_SECRET_ACCESS_KEY=<Secret Access Key>
```

## Get SendGrid key

Visit Sendgrid and follow this [documentation on getting an API key](https://docs.sendgrid.com/for-developers/sending-email/api-getting-started)

```
MAIL_KEY=SG.xxxxxxxxx.xxxxxxxxxxxxxxxxxxxx
MAIL_SENDER=noreply@postapp.dev
```
## Setup MongoDB

Here is a link to guide you on [setting up your local environment](https://docs.mongodb.com/manual/installation/) or your can use [atlas free tier](https://docs.mongodb.com/guides/cloud/connectionstring/) then add the connection url to the env file.

```
MONGODB_URL=mongodb://localhost:27017/talentql
MONGODB_TEST_URL=mongodb://localhost:27017/talentql-test
MONGODB_URL_DEV=mongodb://localhost:27017/talentql-dev
```
or 
```
MONGODB_URL=mongodb+src://<username>:<password>/***********/db-name
MONGODB_TEST_URL=mongodb+src://<username>:<password>/***********/db-name-test
MONGODB_URL_DEV=mongodb+src://<username>:<password>/***********/db-name-dev
```

Your `.env` file should end up looking like this

```
MONGODB_URL=mongodb://localhost:27017/talentql
MONGODB_TEST_URL=mongodb://localhost:27017/talentql-test
MONGODB_URL_DEV=mongodb://localhost:27017/talentql-dev
NODE_ENV=development
PORT=4000
JWT_SECRET=Your_Jwtsecret
JWT_EXPIRATION_INTERVAL=10h
JWT_EMAIL_SECRET=test@email.com
MAIL_KEY=SG.xxxxxxxxxxxxx.xxxxxxxxxxxxxxxxxxxxxx
MAIL_SENDER=noreply@postapp.dev
REQUEST_LIMIT=200kb
APP_ID=postapp
BASE_URL=localhost:4000
AWS_ACCESS_KEY_ID=xxxxxxxxxxxxxxxxx
AWS_SECRET_ACCESS_KEY=xxxxxxxxxxxxxxxxxxxxxxxx

```
> Please note that if this variables are not available, your application will not start.


## API Documentation

Here is a link to the [published API documentation](https://documenter.getpostman.com/view/8019278/Tzeahkis) 

## How to Start the App


1. Ensure that you have your .env file setup as above in the root directory.

2. Install dependencies using yarn or npm, whichever works for you

```sh
yarn
yarn run start:prod
```
or 
```sh
npm install
npm run start:prod
```

## Run tests

```sh
yarn test # or npm test
```