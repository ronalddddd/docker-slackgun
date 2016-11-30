'use strict';
const url = '/api/mailgun';
const apikey = process.env.npm_config_mailgun_key;
const hook = process.env.npm_config_slack_hook;
const channel = process.env.npm_config_slack_channel|| '#general';

if (!apikey) throw new Error('Missing mailgun api key');
if (!apikey) throw new Error('Missing slack hook url');

const express = require('express');
const bodyParser = require('body-parser');
var multipart = require('connect-multiparty');
const SlackGun = require('node-slack-mailgun');

const app = express();

// parse application/json
app.use(bodyParser.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// parse multi-part/formdata
app.use(multipart());

const slackgun = SlackGun({
    slack: { // Options for slack
        hook, // Required. The hook URL for posting messages to slack.
        channel, // Optional. By default we'll send to the #general channel.
        options: 'object', // Optional. Options to pass to https://github.com/xoxco/node-slack#install-slack
        username: 'Mailgun', // Optional. By default we'll send using the "Mailgun" username to slack.
        icon_emoji: 'mailbox_with_mail', // Optional. By default we'll set the icon to :mailbox_with_mail:
    },
    mailgun: { // Options for mailgun
        apikey, // Optional. Used for verifying the HMAC token sent with a request.
    },
    templates: {
        opened: true,
        clicked: true,
        unsubscribed: true,
        complained: true,
        bounced: true,
        dropped: true,
        delivered: true,
        all: true
    }
});

app.use(url, slackgun);
app.listen(8080);
