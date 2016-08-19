Formagical.JS: form analytics without dashboarding
==========
Formagical.JS tracks the behaviour of the user in a form, and sends the data to whatever endpoint. Formagical.JS does not have a dashboard, and its only goal is to log the data to a given endpoint.

## Features

- Track how users are using your forms
- Send statistics to Google Analytics out of the box
- Or send statistics to whatever tool or endpoint you want
- Find problemetic fields in your forms & improve the usability

## Example
See [http://codeorelse.github.io/formagical/](http://codeorelse.github.io/formagical/)

## Installation
### Using Bower
```
bower install formagical --save
```
### Manually
Clone this repository or manually download dist/formagical.min.js, and refer to this file in your main HTML file.
```
<script src="path/to/formagical.min.js"></script>
```
## Simple usage
```
$('#your-form').formagical()
```

## Options
| Property        | Type           | Description | Default  |
| ------------- |-------------| ----------------|-----|
| howManyMilliSecsAreAPause      | integer | After how many milliseconds of not typing should Formagical consider it a pause? | 1500 |
| trackPauses      | boolean      | Should we track pauses at all? |   true |
| track | function      | Callback method when an interaction occured on the form    |
| attributeForName | string | Attribute of form element that Formagical should you for the `name` property | 'name' |

## What does Formagical track exactly?
Formagical tracks all of the following interactions:
- User opened a page that has our Formagical on it
- User started using form by interacting with one of its elements
- User enters a certain form element (focus)
- User leaves a certain form element (unfocus)
- User leaves a certain form element and leaves the field blank (unfocus)
- User leaves a certain form element and leaves the field blank while it was filled before (unfocus)
- User starts typing in an certain element (input and textarea only)
- Users changes the selection of a certain form element (dropdown, radiobutton and checkbox only)
- Users pauses typing and continues
- User submits form

With all these interactions Formagical keeps track of the relatively times that passed. 

## Does Formagical work on any form?
Yeah. Formagical works on every form. Because Formagical uses the *name* attribute of the form element, I strongly recommend to give your form elememts descriptive names.

Also, by default Formagical tries to log the data to the Google Analytics account that is implemented on the page. You can overwrite this tracking method (see below). 

## Write a custom tracker
By default, Formagical sends events to the Google Analytics account that is implemented on the page. You might want to send the data to another endpoint, like Snowplow, Site Catalyst or your custom endpoint. Well, that's pretty easy. You can overwrite the track method when initiating the Formagical plugin. 

```javascript
(function(formagical) {
formagical.yourTracker = function(element, typeOfInteraction, duration, optional, elementIndex) {
  // manipulate and send the data to an andpoint of choice
}})(window.formagical = window.formagical || {});

/* Pass your custom tracker when initiating Formagical */
$('#your-form').formagical({track: window.formagical.yourTracker});
```

## What's the status?
After a few beers on a friday night, I've written a very first proof of concept in sloppy jQuery code, just to try it out on some forms and see if the data is useful. And boy, is it useful!  

## Next steps
- Start over from scratch with proper code
- Take error messages into account when submitting the form
- Use vanilla JavaScript instead of a jQuery plugin
- Write a AngularJS directive
- Write a ReactJS component
- Add tests

## Development

### Prepare your environment
* Install [Node.js](http://nodejs.org/) and NPM (should come with)
* Install global dev dependencies: `npm install -g grunt`
* Install local dev dependencies: `npm install` in repository directory

### Development Commands
* `grunt build` to jshint and build
* `grunt test` to run Jasmine tests
