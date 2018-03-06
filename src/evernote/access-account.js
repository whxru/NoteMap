const EvernoteAccount = require('../evernote/evernote-account')

module.exports = () => {
    const Evernote = require('evernote');
    const developerToken = require('../../config.json').developerToken;
    var client = new Evernote.Client({ token: developerToken });
    return new EvernoteAccount(client.getUserStore(), client.getNoteStore());
}

