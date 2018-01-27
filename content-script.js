$(function() {
    const TWEET_CONTAINER = 'div.stream ol#stream-items-id li.stream-item[data-item-type="tweet"] div.tweet';
    const TWEET_FOOTER = '.content .stream-item-footer .ProfileTweet-actionList';

    var twitterIntervalID = null;
    setAddCNBButtonInterval();

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

        return $(str);
    }
});
