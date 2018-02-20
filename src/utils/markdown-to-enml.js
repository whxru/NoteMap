const MarkdownIt = require('markdown-it');

module.exports = {
    md2enml: (md) => {
        // to-do: replace @[](notebookname) -> [](inAppLink)
        md = md.trim();
        // Get title
        var title = md.split('\n')[0];
        if(title[0] === '#') {
            title = title.substr(1).trim();
        }
        // To enml
        var html = MarkdownIt().render(md);
        var enml = `<!DOCTYPE en-note SYSTEM "http://xml.evernote.com/pub/enml2.dtd"><en-note>${html}</en-note>`

        console.log(enml);
        return {
            title: title,
            content: enml
        };
    }
}