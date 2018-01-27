$(function() {
    const TWEET_CONTAINER = 'div.stream ol#stream-items-id li.stream-item[data-item-type="tweet"] div.tweet';
    const TWEET_FOOTER = '.content .stream-item-footer .ProfileTweet-actionList';

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

    function createContextPanel() {
        let str =
            '<div class="news-card-tag">' +
            '<div class="card news-card card-1">' +
            '<div class="card-section">' +
            '<article class="news-card-article">' +
            '<em class="news-card-date">Sunday, 16th April</em>' +
            '<h3 class="news-card-title">Title for the First Article</h3> ' +
            '<p class="news-card-description">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae facere, ipsam quae sit, eaque perferendis commodi!...</p>' +
            '<p><a href="#">Continue reading</a></p>' +
            '</article>' +
            '</div>' +
            '</div>' +
            '<div class="card news-card card-2">' +
            '<div class="card-section">' +
            '<article class="news-card-article ">' +
            '<em class="news-card-date">Tuesday, 8th December</em>' +
            '<h3 class="news-card-title">Title for the Second Article</h3> ' +
            '<p class="news-card-description">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur....</p>' +
            '<p><a href="#">Continue reading</a></p>' +
            '</article>' +
            '</div>' +
            '</div>' +
            '<div class="card news-card card-3">' +
            '<div class="card-section">' +
            '<article class="news-card-article">' +
            '<em class="news-card-date">Sunday, 28th January</em>' +
            '<h3 class="news-card-title">Title for the Third Article</h3> ' +
            '<p class="news-card-description">Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur?...</p>' +
            '<p><a href="#">Continue reading</a></p>' +
            '</article>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>';

        return $(str);
    }

    function buttonListener() {
        let $this = $(this);
        let btnTweetID = $this.attr('data-tweet-id');

        if (cnbOpenTweetID == null) {
            let $el = createContextPanel();
            $('div.tweet[data-tweet-id="' + btnTweetID + '"').append($el);
            cnbOpenTweetID = btnTweetID;
        } else {
            $('div.tweet[data-tweet-id="' + cnbOpenTweetID + '"').find('.news-card-tag').remove();
            if (btnTweetID != cnbOpenTweetID) {
                let $el = createContextPanel();
                $('div.tweet[data-tweet-id="' + btnTweetID + '"').append($el);
                cnbOpenTweetID = btnTweetID;
            } else {
                cnbOpenTweetID = null;
            }
        }
    }
});
