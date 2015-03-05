Formagical: form analytics with dashboarding
==========
Formagical tracks the behaviour of the user in a form, and sends the data to whatever endpoint. Formagical does not have a dashboard, and its only goal is to log the data to a given endpoint.

### What does Formagical track exactly?
Formagical tracks all of the following interactions:
- User opened a page that has our Formagical on it
- User started using form by interacting with one of its elements
- User enters a certain form element (focus)
- User leaves a certain form element (unfocus)
- User starts typing in an certain element (input and textarea only)
- Users changes the selection of a certain form element (dropdown , radiobutton and checkbox only)
- Users pauses typing and continues
- User submits form

With all these interactions Formagical keeps track of the relatively times that passed. 

### Does Formagical work on any form?
Yeah. Formagical works on every form. Because Formagical uses the *name* attribute of the form element, I strongly recommend to give your form elememts descriptive names.

Also, by default Formagical tries to log the data to the Google Analytics account that is implemented on the page. You can overwrite this tracking method (see below). 

### Build
Formagical uses Grunt to do a build. So before you can do a build, make sure you've got the Grunt CLI globally installed.
```
npm install -g grunt-cli
```

Next, install the dependencies:
```
npm install
```
Alright. That's it. 
```
grunt build
``` 
Now the formagical.min.js in /dist is updated. 

### Write a custom tracker
By default, Formagical sends events to the Google Analytics account that is implemented on the page. You might want to send the data to another endpoint, like Snowplow or your custom server. Well, that's pretty easy. You can overwrite the track method when initiating the Formagical plugin. 

```javascript
(function(formagical) {
formagical.yourTracker = function(element, typeOfInteraction, duration) {
  // manipulate and send the data to an andpoint of choice
}})(window.formagical = window.formagical || {});

/* Pass your custom tracker when initiating Formagical */
$('#your-form').formagical({track: window.formagical.yourTracker});
```

### What's the status?
I've written a very first proof of concept in sloppy jQuery code, just to try it out on some forms and see if the data is useful. And boy, is it useful!  

### Next steps
- Start over from scratch with proper code
- Take error messages into account when submitting the form
- Use vanilla JavaScript instead of a jQuery plugin
- Write a AngularJS directive
- Write a ReactJS component
- Add tests
