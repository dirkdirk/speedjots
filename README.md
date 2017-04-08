# [speedjots.com](https://speedjots.com)

This is an open source Ember project for an online cloud based note taker.

It's simple, easy, and modern.  And it's single minded: only takes notes.

Please raise issues and submit feature requests by opening an issue at the link at the top. Just keep in mind that the point is to keep features to the bare necessities.

Pull requests are of course welcomed!

Note: for development `config/environment.js` needs to be updated with your own Firebase config info.

## What's next?

1. Add mock data for developers.

1. Add more login options: FB and Github (and possibly email).

1. Add option to print: open a new webpage with only the Jot's title, tags, and content so user can print from there.  (Or maybe employ: [printjs](http://printjs.crabbly.com/))

1. Add option to download all or a single Jot as a text file. Not sure how to go about this, but [ember-cli-file-saver](https://github.com/cogniteev/ember-cli-file-saver) might help.

1. Enable mobile drag and drop. [ios-html5-drag-drop-shim](https://github.com/timruffles/ios-html5-drag-drop-shim) might be helpful.

1. Add markdown support to the editor? [simditor-markdown](https://github.com/mycolorway/simditor-markdown)

1. Add link to this Github repo on the app somewhere.

1. Refactor code.

## Prerequisites

You will need the following things properly installed on your computer.

* [Git](https://git-scm.com/)
* [Node.js](https://nodejs.org/) (with NPM)
* [Bower](https://bower.io/)
* [Ember CLI](https://ember-cli.com/)
* [PhantomJS](http://phantomjs.org/)

## Installation

* `git clone <repository-url>` this repository
* `cd speed-jots`
* `npm install`
* `bower install`

## Running / Development

* `ember serve`
* Visit your app at [http://localhost:4200](http://localhost:4200).

### Code Generators

Make use of the many generators for code, try `ember help generate` for more details

### Running Tests

* `ember test`
* `ember test --server`

### Building

* `ember build` (development)
* `ember build --environment production` (production)

### Deploying

Specify what it takes to deploy your app.

## Further Reading / Useful Links

* [ember.js](http://emberjs.com/)
* [ember-cli](https://ember-cli.com/)
* Development Browser Extensions
  * [ember inspector for chrome](https://chrome.google.com/webstore/detail/ember-inspector/bmdblncegkenkacieihfhpjfppoconhi)
  * [ember inspector for firefox](https://addons.mozilla.org/en-US/firefox/addon/ember-inspector/)
