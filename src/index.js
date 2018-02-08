const { accessAccount } = require('./utils/access-account');

let account = accessAccount();

/**
 * Example of using account.
 * account.getAllNotes().then(notes => {
 *     console.log(notes);
 * })
 */
