const admin = require('firebase-admin');
const serviceAccount = require('./curatool-a9049-firebase-adminsdk-iwve7-76db36b0e8.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
