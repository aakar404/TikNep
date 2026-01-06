/*
    TikTok Comment Scraper – JSON Output

    This script loads all comments from a TikTok post.
    It shows progress in the Chrome console.
    It collects post information and comment text.
    The result is copied as JSON to the clipboard.

    Run this script in Chrome DevTools Console while viewing a TikTok post.
*/

with ({ copy }) {

    /* ===============================
       XPATH SELECTORS
       =============================== */

    var commentsDivXPath                 = '//div[contains(@class, "DivCommentListContainer")]';
    var allCommentsXPath                 = '//div[contains(@class, "DivCommentContentContainer")]';
    var level2CommentsXPath              = '//div[contains(@class, "DivReplyContainer")]';
    var nicknameAndTimePublishedAgoXPath = '//span[contains(@class, "SpanOtherInfos")]';
    var likesCommentsSharesXPath         = "//strong[contains(@class, 'StrongText')]";
    var descriptionXPath                 = '//h4[contains(@class, "H4Link")]/preceding-sibling::div';
    var viewMoreDivXPath                 = '//p[contains(@class, "PReplyAction") and contains(., "View")]';

    /* ===============================
       XPATH HELPER FUNCTION
       =============================== */

    function getElementsByXPath(xpath, parent) {
        let results = [];
        let query = document.evaluate(
            xpath,
            parent || document,
            null,
            XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
            null
        );
        for (let i = 0; i < query.snapshotLength; i++) {
            results.push(query.snapshotItem(i));
        }
        return results;
    }

    /* ===============================
       BASIC HELPERS
       =============================== */

    function getAllComments() {
        return getElementsByXPath(allCommentsXPath);
    }

    function formatDate(strDate) {
        if (!strDate) return null;
        let parts = strDate.split('-');
        if (parts.length === 2) {
            return parts[1] + '-' + parts[0] + '-' + new Date().getFullYear();
        }
        if (parts.length === 3) {
            return parts[2] + '-' + parts[1] + '-' + parts[0];
        }
        return strDate;
    }

    function extractNumericStats() {
        var strongTags = getElementsByXPath(likesCommentsSharesXPath);
        return parseInt(strongTags[strongTags.length - 3]?.outerText)
            ? strongTags.slice(-3)
            : strongTags.slice(-2);
    }

    /* ===============================
       LOAD ALL FIRST-LEVEL COMMENTS
       =============================== */

    var loadingCommentsBuffer = 30;
    var commentsBeforeScroll = getAllComments().length;

    while (loadingCommentsBuffer > 0) {
        let comments = getAllComments();
        let lastComment = comments[comments.length - 1];
        lastComment.scrollIntoView(false);

        let commentsAfterScroll = getAllComments().length;

        if (commentsAfterScroll !== commentsBeforeScroll) {
            loadingCommentsBuffer = 30;
        } else {
            let commentsDiv = getElementsByXPath(commentsDivXPath)[0];
            commentsDiv.scrollIntoView(false);
            loadingCommentsBuffer--;
        }

        commentsBeforeScroll = commentsAfterScroll;
        console.log('Loading first level comments: ' + commentsAfterScroll);

        await new Promise(r => setTimeout(r, 300));
    }

    console.log('All first level comments loaded');

    /* ===============================
       LOAD ALL REPLIES
       =============================== */

    loadingCommentsBuffer = 1;
    while (loadingCommentsBuffer > 0) {
        let readMoreButtons = getElementsByXPath(viewMoreDivXPath);
        for (let i = 0; i < readMoreButtons.length; i++) {
            readMoreButtons[i].click();
        }

        await new Promise(r => setTimeout(r, 500));

        if (readMoreButtons.length === 0) {
            loadingCommentsBuffer--;
        } else {
            loadingCommentsBuffer = 1;
        }

        console.log('Reply loading buffer: ' + loadingCommentsBuffer);
    }

    console.log('All replies loaded');

    /* ===============================
       POST INFORMATION
       =============================== */

    var comments = getAllComments();
    var level2CommentsCount = getElementsByXPath(level2CommentsXPath).length;

    var nicknameAndTime =
        getElementsByXPath(nicknameAndTimePublishedAgoXPath)[0]
            .outerText.replaceAll('\n', ' ')
            .split(' · ');

    var postUrl = window.location.href.split('?')[0];
    var stats = extractNumericStats();

    var postLikes = stats[0].outerText;
    var tiktokReportedTotalComments = parseInt(stats[1].outerText);
    var postShares = stats[2] ? stats[2].outerText : null;

    var publishTime = formatDate(nicknameAndTime[1]);
    var description = getElementsByXPath(descriptionXPath)[0].outerText;

    var missingComments =
        Math.abs(tiktokReportedTotalComments - comments.length);

    /* ===============================
       CONSOLE PROGRESS INFORMATION
       =============================== */

    console.log('TikTok reported total comments: ' + tiktokReportedTotalComments);
    console.log('Actually rendered comments: ' + comments.length);
    console.log(
        'Missing comments: ' +
        missingComments +
        ' (loaded ' + comments.length + ' of ' + tiktokReportedTotalComments + ')'
    );

    /* ===============================
       COLLECT COMMENT TEXT
       =============================== */

    var commentText = {};
    for (let i = 0; i < comments.length; i++) {
        let textNode = getElementsByXPath('./div[1]/p', comments[i])[0];
        if (textNode) {
            commentText[String(i + 1)] = textNode.outerText;
        }
    }

    /* ===============================
       BUILD JSON OUTPUT
       =============================== */

    var jsonOutput = {
        "Time": new Date().toString(),
        "Post URL": postUrl,
        "Publish Time": publishTime,
        "Post Likes": postLikes,
        "Post Shares": postShares,
        "Description": description,
        "TikTok reported total comments": tiktokReportedTotalComments,
        "Actually rendered comments": comments.length,
        "Total Comments": comments.length,
        "Comment Text": commentText
    };

    /* ===============================
       COPY JSON TO CLIPBOARD
       =============================== */

    copy(JSON.stringify(jsonOutput, null, 4));
    console.log('JSON copied to clipboard');
}

























// /*
//     TikTok Comment Scraper 

//     This script scrapes all comments from a TikTok post:
//     - 1st level comments
//     - 2nd-level comments (Replies)
//     - Commenter nicknames and @usernames
//     - Likes on each comment
//     - Profile pictures
//     - Post-level information such as likes, shares, and description

//     How it works:
//     1. Scrolls through all comments to load them fully.
//     2. Expands all "View more replies" buttons to capture replies.
//     3. Reads and organizes all comment data.
//     4. Converts the collected information into CSV format.
//     5. Copies the CSV to the clipboard for further use (e.g., saving to Excel, CSV, JSON).

//     This script should be run directly in the Chrome's developer console.
//     While viewing the TikTok post. Make sure you can scroll the comments manually first.
// */

// with({ copy }) {

//     // XPath selectors for different elements on the TikTok post page
//     var commentsDivXPath                 = '//div[contains(@class, "DivCommentListContainer")]'; // container for all comments
//     var allCommentsXPath                 = '//div[contains(@class, "DivCommentContentContainer")]'; // each comment
//     var level2CommentsXPath              = '//div[contains(@class, "DivReplyContainer")]'; // replies to comments
//     var publisherProfileUrlXPath         = '//span[contains(@class, "SpanUniqueId")]'; // publisher @username
//     var nicknameAndTimePublishedAgoXPath = '//span[contains(@class, "SpanOtherInfos")]'; // nickname and post time

//     var likesCommentsSharesXPath         = "//strong[contains(@class, 'StrongText')]"; // post stats (likes, comments, shares)

//     var postUrlXPath                     = '//div[contains(@class, "CopyLinkText")]'; // post link
//     var descriptionXPath                 = '//h4[contains(@class, "H4Link")]/preceding-sibling::div'; // post description

//     var viewMoreDivXPath                 = '//p[contains(@class, "PReplyAction") and contains(., "View")]'; // "View more replies" button

//     // Get DOM elements using XPath
//     function getElementsByXPath(xpath, parent) {
//         let results = [];
//         let query = document.evaluate(xpath, parent || document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
//         for (let i = 0, length = query.snapshotLength; i < length; ++i) {
//             results.push(query.snapshotItem(i));
//         }
//         return results;
//     }

//     // Get all top-level comments
//     function getAllComments(){
//         return getElementsByXPath(allCommentsXPath);
//     }

//     // Escape strings for CSV (double quotes)
//     function quoteString(s) {
//         return '"' + String(s).replaceAll('"', '""') + '"';
//     }

//     // Extract commenter's nickname
//     function getNickname(comment) {
//         return getElementsByXPath('./div[1]/a', comment)[0].outerText;
//     }

//     // Check if a comment is a reply
//     function isReply(comment) {
//         return comment.parentElement.className.includes('Reply');
//     }

//     // Format date as DD-MM-YYYY (TikTok often shows MM-DD)
//     function formatDate(strDate) {
//         if (typeof strDate !== 'undefined' && strDate !== null) {
//             f = strDate.split('-');
//             if (f.length == 1) {
//                 return strDate;
//             } else if (f.length == 2) {
//                 return f[1] + '-' + f[0] + '-' + (new Date().getFullYear());
//             } else if (f.length == 3) {
//                 return f[2] + '-' + f[1] + '-' + f[0];
//             } else {
//                 return 'Malformed date';
//             }
//         } else {
//             return 'No date';
//         }
//     }

//     // Extract likes, comments, and shares numbers from the post
//     function extractNumericStats() {
//         var strongTags = getElementsByXPath(likesCommentsSharesXPath);
//         likesCommentsShares = parseInt(strongTags[(strongTags.length - 3)].outerText) ? strongTags.slice(-3) : strongTags.slice(-2);
//         return likesCommentsShares;
//     }

//     // Convert a comment to CSV format
//     function csvFromComment(comment) {
//         nickname = getNickname(comment);
//         user = getElementsByXPath('./a', comment)[0]['href'].split('?')[0].split('/')[3].slice(1);
//         commentText = getElementsByXPath('./div[1]/p', comment)[0].outerText;
//         timeCommentedAgo = formatDate(getElementsByXPath('./div[1]/p[2]/span', comment)[0].outerText);
//         commentLikesCount = getElementsByXPath('./div[2]', comment)[0].outerText;
//         pic = getElementsByXPath('./a/span/img', comment)[0] ? getElementsByXPath('./a/span/img', comment)[0]['src'] : "N/A";
//         return quoteString(nickname) + ',' + quoteString(user) + ',' + 'https://www.tiktok.com/@' + user + ',' +
//                quoteString(commentText) + ',' + timeCommentedAgo + ',' + commentLikesCount + ',' + quoteString(pic);
//     }


//     // Load all 1st-level comments
//     var loadingCommentsBuffer = 30; 
//     var numOfcommentsBeforeScroll = getAllComments().length;

//     while (loadingCommentsBuffer > 0) {
//         allComments = getAllComments();
//         lastComment = allComments[allComments.length - 1];
//         lastComment.scrollIntoView(false); // scroll last comment into view

//         numOfcommentsAftScroll = getAllComments().length;

//         if (numOfcommentsAftScroll !== numOfcommentsBeforeScroll) {
//             loadingCommentsBuffer = 30; // reset buffer if new comments loaded
//         } else {
//             commentsDiv = getElementsByXPath(commentsDivXPath)[0];
//             commentsDiv.scrollIntoView(false); // scroll container just in case
//             loadingCommentsBuffer--;
//         }

//         numOfcommentsBeforeScroll = numOfcommentsAftScroll;
//         console.log('Loading 1st level comment number ' + numOfcommentsAftScroll);

//         await new Promise(r => setTimeout(r, 300)); // wait 0.3 seconds
//     }
//     console.log('Opened all 1st level comments');


//     // Load all 2nd-level comments
//     loadingCommentsBuffer = 1;
//     while (loadingCommentsBuffer > 0) {
//         readMoreDivs = getElementsByXPath(viewMoreDivXPath);
//         for (var i = 0; i < readMoreDivs.length; i++) {
//             readMoreDivs[i].click(); // click "View more" to load replies
//         }

//         await new Promise(r => setTimeout(r, 500)); // wait 0.5 seconds
//         if (readMoreDivs.length === 0) {
//             loadingCommentsBuffer--;
//         } else {
//             loadingCommentsBuffer = 1; // reset if more replies loaded
//         }
//         console.log('Buffer ' + loadingCommentsBuffer);
//     }
//     console.log('Opened all 2nd level comments');


//     // Extract data from all comments
//     var comments = getAllComments();
//     var level2CommentsLength = getElementsByXPath(level2CommentsXPath).length;
//     var publisherProfileUrl = getElementsByXPath(publisherProfileUrlXPath)[0].outerText;
//     var nicknameAndTimePublishedAgo = getElementsByXPath(nicknameAndTimePublishedAgoXPath)[0].outerText.replaceAll('\n', ' ').split(' · ');

//     var url = window.location.href.split('?')[0]; // post URL
//     var likesCommentsShares = extractNumericStats();
//     var likes = likesCommentsShares[0].outerText;
//     var totalComments = likesCommentsShares[1].outerText;
//     var shares = likesCommentsShares[2] ? likesCommentsShares[2].outerText : "N/A";
//     var commentNumberDifference = Math.abs(parseInt(totalComments) - (comments.length));


//     // Build CSV 
//     var csv = Date() + '\n';
//     csv += 'Post URL,' + url + '\n';
//     csv += 'Publisher Nickname,' + nicknameAndTimePublishedAgo[0] + '\n';
//     csv += 'Publisher @,' + publisherProfileUrl + '\n';
//     csv += 'Publisher URL,' + "https://www.tiktok.com/@" + publisherProfileUrl + '\n';
//     csv += 'Publish Time,' + formatDate(nicknameAndTimePublishedAgo[1]) + '\n';
//     csv += 'Post Likes,' + likes + '\n';
//     csv += 'Post Shares,' + shares + '\n';
//     csv += 'Description,' + quoteString(getElementsByXPath(descriptionXPath)[0].outerText) + '\n';
//     csv += 'Number of 1st level comments,' + (comments.length - level2CommentsLength) + '\n';
//     csv += 'Number of 2nd level comments,' + level2CommentsLength + '\n';
//     csv += 'Total Comments Actual,' + comments.length + '\n';
//     csv += "Total Comments (TikTok reported)," + totalComments + '\n';
//     csv += "Difference," + commentNumberDifference + '\n';
//     csv += 'Comment Number (ID),Nickname,User @,User URL,Comment Text,Time,Likes,Profile Picture URL,Is 2nd Level Comment,User Replied To,Number of Replies\n';


//     // Loop through all comments and append CSV rows
//     var count = 1;
//     var totalReplies = 0;
//     var repliesSeen = 1;

//     for (var i = 0; i < comments.length; i++) {
//         csv += count + ',' + csvFromComment(comments[i]) + ',';
//         if (i > 0 && isReply(comments[i])) {
//             // Comment is a 2nd level
//             csv += "Yes," + quoteString(getNickname(comments[i - repliesSeen])) + ',0';
//             repliesSeen += 1;
//         } else {
//             // Comment is 1st level
//             csv += 'No,---,';
//             totalReplies = 0;
//             repliesSeen = 1;
//             for (var j = 1; j < comments.length - i; j++) {
//                 if (!isReply(comments[i + j])) break;
//                 totalReplies += 1;
//             }
//             csv += totalReplies;
//         }
//         csv += '\n';
//         count++;
//     }

//     var apparentCommentNumber = parseInt(totalComments);
//     console.log('Number of missing comments (not rendered): ' + (apparentCommentNumber - count + 1) + ' (you have ' + (count - 1) + ' of ' + apparentCommentNumber + ')');
//     console.log('CSV copied to clipboard!');

//     // Copy CSV string to clipboard
//     copy(csv);
// }
