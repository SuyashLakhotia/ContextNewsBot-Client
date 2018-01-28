$(function() {
    const TWEET_CONTAINER = 'div.stream ol#stream-items-id li.stream-item[data-item-type="tweet"] div.tweet';
    const TWEET_FOOTER = '.content .stream-item-footer .ProfileTweet-actionList';
    const API_BASE_URL = 'http://127.0.0.1:5000';

    const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

    var twitterIntervalID = null;
    setAddCNBButtonInterval();

    var cnbOpenTweetID = null;

    function addCNBToTweets() {
        let $tweets = $(TWEET_CONTAINER).not('.cnb-btn-inserted');
        $tweets.each(function(index) {
            let $this = $(this);
            let $footer = $this.find(TWEET_FOOTER);
            $footer.prepend(createButton($this.attr('data-item-id')));
            $this.addClass('cnb-btn-inserted');
        });
    }

    function setAddCNBButtonInterval() {
        addCNBToTweets();
        if (twitterIntervalID == null) {
            twitterIntervalID = setInterval(addCNBToTweets, 2000);
        }
    }

    function removeAddCNBButtonInterval() {
        if (twitterIntervalID != null) {
            clearInterval(twitterIntervalID);
            twitterIntervalID = null;
        }
    }

    function createButton(tweetID) {
        let str = '<div class="ProfileTweet-action ProfileTweet-action--CNB js-toggleState">' +
            '<button class="ProfileTweet-actionButton js-actionButton" type="button" data-tweet-id="' + tweetID + '">' +
            '<div class="IconContainer js-tooltip" data-original-title="Give me more context!">' +
            '<span class="Icon Icon--CNB"></span>' +
            '<span class="u-hiddenVisually">Context News Bot</span>' +
            '</div>' +
            '<span class="ProfileTweet-actionCount">' +
            '<span class="ProfileTweet-actionCountForPresentation" aria-hidden="true">CNB</span>' +
            '</span>' +
            '</button>' +
            '</div>';

        let $el = $(str);
        $el.find('button.js-actionButton').off('click').on('click', buttonListener);

        return $el;
    }

    function createContextPanel(tweetID) {
        let $el = $('<h4 class="cnb-loading-text">Loading...</h4>');
        $('div.tweet[data-tweet-id="' + tweetID + '"').append($el);

        getDataForTweet(tweetID).then((data) => {
            console.log(data);
            let str = '<div class="news-card-tag">';
            for (const [i, datum] of data.entries()) {
                let datePublished = new Date(datum['publishedAt']);
                str += '<div class="card news-card card-' + i + '">';
                str += '<div class="card-section">';
                str += '<article class="news-card-article">';
                str += '<em class="news-card-date">' + DAYS[datePublished.getDay()] + ', ' + datePublished.getDate() + ' ' + MONTHS[datePublished.getMonth()] + '</em>';
                str += '<h3 class="news-card-title">' + datum['title'] + '</h3>';
                str += '<p class="news-card-description">' + datum['description'] + '</p>';
                str += '<p><a href="' + datum['url'] + '">Continue reading on ' + datum['source']['name'] + ' </a></p>';
                str += '</article>' + '</div>' + '</div>'
            }
            str += '</div>' + '</div>';

            let $el = $(str);
            $('div.tweet[data-tweet-id="' + tweetID + '"').append($el);
            $('div.tweet[data-tweet-id="' + tweetID + '"').find('.cnb-loading-text').remove();
            cnbOpenTweetID = tweetID;
        });
    }

    function getDataForTweet(tweetID) {
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": API_BASE_URL + "/tweet",
            "method": "POST",
            "headers": {
                "content-type": "application/json",
                "cache-control": "no-cache",
            },
            "processData": false,
            "data": "{\n\t\"id\": " + tweetID + "\n}"
        }
        return $.ajax(settings);
    }

    function buttonListener() {
        let $this = $(this);
        let btnTweetID = $this.attr('data-tweet-id');

        if (cnbOpenTweetID == null) {
            createContextPanel(btnTweetID);
        } else {
            $('div.tweet[data-tweet-id="' + cnbOpenTweetID + '"').find('.news-card-tag').remove();
            if (btnTweetID != cnbOpenTweetID) {
                createContextPanel(btnTweetID);
            } else {
                cnbOpenTweetID = null;
            }
        }
    }
});
