# [SpeedJots.com](https://speedjots.com)

An open source Ember SAAS project for taking notes called SpeedJots: simple, easy, and single minded - jots only.

Give it a whirl at [SpeedJots.com](https://speedjots.com).

Ask questions, raise issues, and submit feature requests by opening an issue. Keep in mind that the point is to keep features to the bare necessities.

Pull requests are of course welcome!

## What's next for SpeedJots?

Any help with the following is greatly appreciated:

1. Add more login options: FB and Github (and possibly email).

1. Add option for use to delete their account.

1. Add option to print: open a new webpage with only the Jot's title, tags, and content so user can print from there.  (Or maybe employ: [printjs](http://printjs.crabbly.com/))

1. Add option to download all or a single Jot as a text file. Not sure how to go about this, but [ember-cli-file-saver](https://github.com/cogniteev/ember-cli-file-saver) might help.

1. Enable mobile drag and drop. [ios-html5-drag-drop-shim](https://github.com/timruffles/ios-html5-drag-drop-shim) might be helpful.

1. Add markdown support to the editor? [simditor-markdown](https://github.com/mycolorway/simditor-markdown)

1. Add link to this Github repo on the app somewhere.

1. Setup a demo site for users to try before logging in for the first time.

1. Refactor code.

## Prerequisites

You will need the following properly installed on your computer.

* [Git](https://git-scm.com/)
* [Node.js](https://nodejs.org/) (with NPM)
* [Bower](https://bower.io/)
* [Ember CLI](https://ember-cli.com/)
* [PhantomJS](http://phantomjs.org/)
* [Firebase CLI](https://firebase.google.com/docs/cli/)

## Installation and Setup

* `git clone <repository-url>` this repository
* `cd speed-jots`
* `npm install`
* `bower install`

### Firebase Setup

This repo is already hooked to a development Firebase backend out of the box.  Well, ain't that nice!

However, if you prefer your own Firebase backend:

1. Log into your Firebase console.
1. 'Create New Project' with any name.
1. Click 'Add Firebase to your web app' and copy the info.
1. Open app/config/environment.js in a text editor and edit var ENV's firebase property:
   ```javascript
   firebase: {
      apiKey: "[your info here]",
      authDomain: "[your info here]",
      databaseURL: "[your info here]",
      storageBucket: "[your info here]",
      messagingSenderId: "[your info here]"
   },
   ```
1. Go back to your Firebase console.
1. Click 'Authentication' in left menu.
1. Click 'Sign-In Method' under Authentication title.
1. Enable Google
   * Mouse over Google.
   * Click the pencil.
   * Toggle the 'Enable' switch.
   * Click 'Save'
1. Click 'Rules' under Realtime Database title.
1. Cut and paste the following and click 'Publish'
   ```json
   {
     "rules": {
       "users": {
         "$uid": {
           ".read": "auth != null && auth.uid == $uid",
           ".write": "auth != null && auth.uid == $uid"
         }
       }
     }
   }
   ```

#### Database

Structure:
```json
"userid_autogenerated_by_login" : {
  "jots" : [ {
    "group" : "Not Grouped",
    "tags" : "Tag 1",
    "text" : "Text 1",
    "title" : "Jot 1",
    "dateCreated" : 1491513368830,
    "inTrash" : false,    
  } ],
  "settings" : [ {
    "lastLogin" : 1490374848189,
    "theme" : "light"
  } ]
},
```
Note: `theme` is not used yet.

## Running and Development

* `ember serve`
* Visit your app at [http://localhost:4200](http://localhost:4200).

### Building

* `ember build` (development)
* `ember build --environment production` (production)

### Deploying

`$ ember build && firebase deploy`

## Further Reading / Useful Links

* [ember.js](http://emberjs.com)
* [ember-cli](https://ember-cli.com)
* [Firebase](https://firebase.google.com)
