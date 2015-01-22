#!/usr/bin/env node

var COUNT = 10;
var URL_TOP_STORIES = 'https://hacker-news.firebaseio.com/v0/topstories.json';
var URL_ITEM = function(storyId) { return 'https://hacker-news.firebaseio.com/v0/item/' + storyId + '.json?pretty=true'; }

var Promise = require('bluebird');
var request = Promise.promisify(require('request'));
var util = require('util');

request(URL_TOP_STORIES).spread(function(response, body) {
    var storyIds = JSON.parse(body).slice(0, COUNT);

    return Promise.map(storyIds, function(storyId, i) {
        var url = URL_ITEM(storyId);

        return request(url).spread(function(response, body) {
            return JSON.parse(body);
        });
    });
}).then(function(stories) {
    function pad(i) {
        return ('  ' + i).slice(-2);
    }
    function format(story, i) {
        var format = '\n%s  (%s)  %s\n    %s\n';
        return util.format(format, pad(i + 1), story.score, story.title, story.url);
    }
    console.log(stories.map(format).join(''));
}).catch(function(error) {
    console.log(error);
});
