(function () {
  jQuery(function () {

    var jQuery = jQuery || $;

    jQuery.formagical = function (element, options) {

      debugger;
      var state;
      state = '';
      this.settings = {};
      this.jQueryelement = jQuery(element);
      this.mostRecentFocusedElement = null;
      this.lastInteractionTime = 0;
      this.startTime = 0;
      this.submitted = false;

      this.setState = function (_state) {
        return state = _state;
      };
      this.getState = function () {
        return state;
      };

      this.getLastInteractionTime = function () {
        return lastInteractionTime;
      }
      this.setLastInteractionTime = function (lastInteractionTime) {
        lastInteractionTime = lastInteractionTime;
      }

      this.getMostRecentFocusedElement = function () {
        return mostRecentFocusedElement;
      }
      this.setMostRecentFocusedElement = function (element) {


        if (typeof mostRecentFocusedElement === 'undefined') {
          var that = this;

          var d = new Date();
          var n = d.getTime();

          this.settings.track.call(that, jQuery(that.jQueryelement).attr('name'), 'User started using form', n - that.startTime, null, jQuery(that.jQueryelement).data('elementIndex'));
        }

        mostRecentFocusedElement = element;
      }

      this.getSetting = function (key) {
        return this.settings[key];
      };

      this.trackInAnalytics = function (element, type, label, change) {

        if (typeof ga === 'undefined') {
          throw new Error('Add GA to your page.')
        }

        if (typeof label === 'undefined' || label == NaN) {
          label = 0;
        }

        ga('send', 'event', 'formagical', type, element, parseFloat((label / 1024).toFixed(2)));
      };

      this.callSettingFunction = function (name, args) {
        if (args == null) {
          args = [];
        }
        return this.settings[name].apply(this, args);
      };
      this.init = function () {

        this.settings = jQuery.extend({}, this.defaults, options);
        var that = this;
        var d = new Date();
        var n = d.getTime();

        this.startTime = n;
        this.elementName = jQuery(that.jQueryelement).attr('name');

        that.settings.track.call(that, jQuery(that.jQueryelement).attr('name'), 'Form ready for stats');

          this.jQueryelement.find('input, textarea').not('[type=checkbox],[type=submit]').each(function () {
              var elementName = jQuery(this).attr(that.settings.attributeForName);
              jQuery(this).keydown(function (e) {
                  // Don't log tabs and tabs
                  if(e.keyCode === 9 || e.keyCode == 27) return;
                  var d = new Date();
                  var n = d.getTime();
                  var currentValue = jQuery(this).val();
                  var previousValue = jQuery(this).data('valueBeforeTyping');
                  var changeVal = 'from ' + (previousValue == '' ? 'nothing' : previousValue) + ' to ' + currentValue;
                  var change = (currentValue == previousValue) ? ' nothing' : changeVal;

                  // This is the first time the user typed in this element
                  if (!jQuery(this).data('userStartedTypingInThisBox')) {
                      var msg = 'Started typing';
                      that.settings.track.call(that, elementName, msg, n - jQuery(this).data('userStartedFocusingAt'), null, jQuery(this).data('elementIndex'));
                  }

                  // If user paused for a while
                  var t = this;

                  var howManyMilliSecsAreAPause = that.settings.howManyMilliSecsAreAPause;
                  var c = jQuery(t).val();

                  if (that.settings.trackPauses) {
                      if ((n - jQuery(t).data('lastTimeTypingInThisBox')) > howManyMilliSecsAreAPause && (jQuery(this).data('userStartedTypingInThisBox'))) {
                          that.settings.track.call(that, elementName, 'paused and continued ', n - jQuery(this).data('lastTimeTypingInThisBox'), null, jQuery(this).data('elementIndex'));
                      }
                  }

                  jQuery(t).data('lastTimeTypingInThisBox', n);
                  jQuery(this).data('valueBeforeTyping', jQuery(this).val());

                  jQuery(this).data('userStartedTypingInThisBox', true);
              })

          });

        this.jQueryelement.find('input, textarea, select').each(function (index) {
          jQuery(this).data('elementIndex', index);
        })

        this.jQueryelement.find('input, textarea, select').not('[type=checkbox],[type=submit]').each(function () {
          var elementName = jQuery(this).attr(that.settings.attributeForName);

          // Every item should have name
          if (typeof elementName == 'undefined' || elementName == '') {
            throw new Error('Every form element should have a name')
          }

          jQuery(this).blur(function () {
            var d = new Date();
            var n = d.getTime();
            var currentValue = jQuery(this).val();
            var previousValue = jQuery(this).data('valueBeforeFocus');
            var changeVal = 'from ' + (previousValue == '' ? 'nothing' : previousValue) + ' to ' + currentValue;
            var change = (currentValue == previousValue) ? ' nothing' : changeVal;

            jQuery(this).data('valueBeforeFocus', currentValue);

            that.settings.track.call(that, elementName, 'focusOut', n - jQuery(this).data('startFocus'), change, jQuery(this).data('elementIndex'));

            if(currentValue === '') {
              that.settings.track.call(that, elementName, 'focusOutEmpty', n - jQuery(this).data('startFocus'), change, jQuery(this).data('elementIndex'));
            }

            if(currentValue === '' && previousValue !== '' && typeof previousValue !== 'undefined') {
              that.settings.track.call(that, elementName, 'focusOutEmptied', n - jQuery(this).data('startFocus'), change, jQuery(this).data('elementIndex'));
            }

          })

          jQuery(this).focus(function () {
            var d = new Date();
            var n = d.getTime();

            jQuery(this).data('userStartedTypingInThisBox', false);
            jQuery(this).data('userStartedFocusingAt', n);
            jQuery(this).data('lastTimeTypingInThisBox', n);

            that.setMostRecentFocusedElement(elementName);
            jQuery(this).data('startFocus', n);
            jQuery(this).data('valueBeforeFocus', jQuery(this).val());
            that.settings.track.call(that, elementName, 'focus', undefined, null, jQuery(this).data('elementIndex'));
          })

        })

        this.jQueryelement.bind('submit', function () {
          var elementName = jQuery(this).attr(that.settings.attributeForName);
          var d = new Date();
          var n = d.getTime();
          that.submitted = true;
          that.settings.track.call(that, 'form', 'submitted', n - that.startTime, null, jQuery(this).data('elementIndex'));
          return true;
        })

        this.jQueryelement.find('input[type=checkbox]').each(function () {
          var elementName = jQuery(this).attr(that.settings.attributeForName);

          jQuery(this).bind('change', function () {
            var d = new Date();
            var n = d.getTime();
            var currentValue = jQuery(this).prop('checked');
            var previousValue = !currentValue;
            var changeVal = 'from ' + (previousValue === '' ? 'nothing' : previousValue) + ' to ' + currentValue;
            var change = (currentValue == previousValue) ? ' has not changed' : changeVal;

            that.settings.track.call(that, elementName, 'changed', undefined, change, jQuery(this).data('elementIndex'));
            jQuery(this).data('valueBeforeFocus', jQuery(this).prop('checked'));
            that.setMostRecentFocusedElement(elementName);

          })
        })

        this.jQueryelement.find('select').each(function () {
          jQuery(this).bind('change', function () {
            var elementName = jQuery(this).attr(that.settings.attributeForName);
            var d = new Date();
            var n = d.getTime();

            if (jQuery(this).data('lastTimeSelectionTime'))
              var timeSinceLastChange = jQuery(this).data('lastTimeSelectionTime') ? (n - jQuery(this).data('lastTimeSelectionTime')) : 0;
            else
              var timeSinceLastChange = jQuery(this).data('startFocus') ? (n - jQuery(this).data('startFocus')) : 0;

            var currentValue = jQuery(this).val();
            var previousValue = jQuery(this).data('valueBeforeFocus');
            var changeVal = 'from ' + (previousValue === '' ? 'nothing' : previousValue) + ' to ' + currentValue;
            var change = (currentValue == previousValue) ? ' has not changed' : changeVal;

            that.settings.track.call(that, elementName, 'changed', timeSinceLastChange, change, null, jQuery(this).data('elementIndex'));

            jQuery(this).data('valueBeforeFocus', jQuery(this).val());
            jQuery(this).data('lastTimeSelectionTime', n);

            that.setMostRecentFocusedElement(elementName);
          })
        })
        return this.setState('ready');
      };
      this.init();
      return this;
    };
    jQuery.formagical.prototype.defaults = {
      howManyMilliSecsAreAPause: 1500,
      trackPauses: true,
      attributeForName: 'name',
      track: function (element, type, label, optional, index) {

        return this.trackInAnalytics(element, type, label, optional);
      }
    };

    return jQuery.fn.formagical = function (options) {
      return this.each(function () {
        var plugin;
        if (jQuery(this).data('formagical') === void 0) {
          plugin = new jQuery.formagical(this, options);
          return jQuery(this).data('formagical', plugin);
        }
      });
    };
  });

}).call(this);
