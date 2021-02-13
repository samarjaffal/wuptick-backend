module.exports = {
    findMentions: (html) => {
        console.log(html, 'description');
        const myregexp = /<span[^>]+?class="mention-item".*?>([\s\S]*?)<\/span>/g;
        let match = myregexp.exec(html);
        let mentions = [];
        while (match != null) {
            mentions.push(match[0]);
            match = myregexp.exec(html);
        }

        return mentions.length > 0
            ? module.exports.getMentionIds(mentions)
            : [];
    },

    getMentionIds: (mentions) => {
        let mentionIds = [];
        let match;

        mentions.forEach((mentionStr) => {
            const regex = new RegExp(
                '[\\s\\r\\t\\n]*([a-z0-9\\-_]+)[\\s\\r\\t\\n]*=[\\s\\r\\t\\n]*([\'"])((?:\\\\\\2|(?!\\2).)*)\\2',
                'ig'
            );
            while ((match = regex.exec(mentionStr))) {
                if (match[1] == 'data-value') mentionIds.push(match[3]);
            }
        });

        return mentionIds;
    },
};
