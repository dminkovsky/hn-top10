#!/usr/bin/env node

var COUNT = 10;
var URL_TOP_STORIES = 'https://hacker-news.firebaseio.com/v0/topstories.json';
var URL_ITEM = function(itemId) { return 'https://hacker-news.firebaseio.com/v0/item/' + itemId + '.json'; }

var Promise = require('bluebird');
var request = Promise.promisify(require('request'));
var util = require('util');

request(URL_TOP_STORIES).spread(function(response, body) {
    var storyIds = JSON.parse(body).slice(0, COUNT);

    return Promise.map(storyIds, function(storyId) {
        var url = URL_ITEM(storyId);

        return request(url).spread(function(response, body) {
            return JSON.parse(body);
        });
    });
}).then(function(stories) {
    function formatStory(story, i) {
        function pad(j) { return ('  ' + j).slice(-2); }
        var format = '\n%s  (%s)  %s\n    %s\n';
        return util.format(format, pad(i + 1), story.score, story.title, story.url);
    }
    console.log(stories.map(formatStory).join(''));
}).catch(function(error) {
    console.log(error.stack);
    process.exit();
});
