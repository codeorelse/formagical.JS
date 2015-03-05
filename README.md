Formagical: form analytics with dashboarding
==========
Formagical the behaviour of the user in a form, and sends the data to whatever endpoint. 

### Build
```
grunt build
``` 

### Write a custom tracker
By default, Formagical sends events to the Google Analytics account that is implemented on the page. You might want to send the data to another endpoint, like Snowplow or your custom server. Well, that's pretty easy. You can overwrite the track method when initiating the Formagical plugin. 

```
(function(formagical) {
formagical.yourTracker = function(element, typeOfInteraction, duration) {
  // manipulate and send the data to an andpoint of choice
}})(window.formagical = window.formagical || {});

/* Pass your custom tracker when initiating Formagical */
$('#your-form').formagical({track: window.formagical.yourTracker});
```

### What's the status?
I've wrote a very first proof of concept in sloppy jQuery code, just to try it out on some forms and see if the data is useful. 

### Next steps
- Start over from scratch with proper code
- Use vanilla JavaScript instead of a jQuery plugin
- Write a AngularJS directive
- Write a ReactJS component
- Add tests
