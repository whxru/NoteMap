const MarkdownIt = require('markdown-it');
const Evernote = require('evernote');
const fs = require('fs');
const crypto = require('crypto');

module.exports = {
    md2enml: md => {
        md = md.trim();
        // Get title
        var title = md.split('\n')[0];
        if(title[0] === '#') {
            title = title.substr(1).trim();
        }
        // To html
        var { html, resources } = handleAttachments(MarkdownIt().render(md));
        
        var enml = `<!DOCTYPE en-note SYSTEM "http://xml.evernote.com/pub/enml2.dtd"><en-note>${html}</en-note>`;
        
        return {
            title: title,
            content: enml,
            resources: resources
        };
    }
};

function handleAttachments(html) {
    var imgReg = /<img src="(\S+)" alt="(\S*)">/gi,
        mime = {
            png: 'image/png',
            jpeg: 'image/jpeg',
            gif: 'image/gif',
            pdf: 'application/pdf',
            wav: 'audio/wav',
            mpeg: 'audio/mpeg',
            amr: 'audio/amr'
        },
        resources = [], tags = [],
        attachment;
        
    while(attachment = imgReg.exec(html)) {
        var imgTag = attachment[0];
            path = attachment[1],
            alt = attachment[2],
            idx = attachment.index,
            md5 = crypto.createHash('md5');
            console.log(path);
        try {
            // Create resources
            var data = fs.readFileSync(path);
            md5.update(data);
            var hexHash = md5.digest('hex');
            resources.push(new Evernote.Types.Resource({
                mime: mime[parseFileType(path)],
                data: new Evernote.Types.Data({
                    bodyHash: hexHash,
                    size: data.length,
                    body: data
                })
            }))
            // Preparations for adding <en-media> tags
            tags.push({
                content: `<en-media type="${mime[parseFileType(path)]}" hash="${hexHash}" />`,
                begin: idx,
                end: idx + imgTag.length - 1
            })
        } catch(err) {
            console.error(err.message);
        }
    }

    // <img> -> <en-media>
    tags.reverse().forEach(tag => {
        html = html.substr(0, tag.begin) + tag.content + html.substr(tag.end + 1);
    })

    return {
        html: html,
        resources: resources
    }
}

/**
 * Extract the type of file from a path string.
 * @param {string} path - Path of file
 * @returns - Type of file
 */
function parseFileType (path) {
    return /\S+\.([^\.]+)$/.exec(path)[1];
}
