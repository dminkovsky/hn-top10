#!/usr/bin/env node

var COUNT = 10;
var HN_TOP_STORIES = 'https://hacker-news.firebaseio.com/v0/topstories.json';
var HN_ITEM = function(itemId) { return u.format('https://hacker-news.firebaseio.com/v0/item/%s.json', itemId); }

var u = require('util');
var Promise = require('bluebird');
var request = Promise.promisify(require('request'));

function getStoryIds() { return request(HN_TOP_STORIES).spread(function(resp, body) { return JSON.parse(body).slice(0, COUNT); }); }

function getStory(id) { return request(HN_ITEM(id)).spread(function(resp, body) { return JSON.parse(body); }); }

function formatStory(story, i) {
    function pad(j) { return ('  ' + j).slice(-2); }
    return u.format('\n%s  (%s)  %s\n    %s\n', pad(i + 1), story.score, story.title, story.url);
}

getStoryIds()
    .map(getStory)
    .map(formatStory)
    .then(function (stories) { console.log(stories.join('')); })
    .catch(function(error) { console.log(error.stack); process.exit(); });
