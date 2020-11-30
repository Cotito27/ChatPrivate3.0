export default {
  generateUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
  },
  async firebaseConfig() {
    let urlDirect = '/sendKeysFirebase';
    const response = await fetch(urlDirect, {
      method: 'POST', // or 'PUT'
       // data can be `string` or {object}!
    });
    const keys = await response.json();
    return {
      apiKey: keys.FIREBASE_API_KEY,
      authDomain: keys.FIREBASE_AUTH_DOMAIN,
      databaseURL: keys.FIREBASE_DATABASE_URL,
      projectId: keys.FIREBASE_PROJECT_ID,
      storageBucket: keys.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: keys.FIREBASE_MESSAGING_SENDER_ID,
      appId: keys.FIREBASE_APP_ID
    }
  }
}