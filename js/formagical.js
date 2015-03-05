(function () {
  jQuery(function () {
    $.formagical = function (element, options) {
      var state;
      state = '';
      this.settings = {};
      this.$element = $(element);
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

          this.settings.track.call(that, $(that.$element).attr('name'), 'User started using form', n - that.startTime);
        }

        mostRecentFocusedElement = element;
      }

      this.getSetting = function (key) {
        return this.settings[key];
      };
      this.trackInAnalytics = function (element, type, label, o) {

        if (typeof label === 'undefined' || label == NaN) {
          label = 0;
        }

        console.log(type, element, (label / 1024).toFixed(2));

        ga('send', 'event', 'formagical', type, element, parseFloat((label / 1024).toFixed(2)));

      };

      this.callSettingFunction = function (name, args) {
        if (args == null) {
          args = [];
        }
        return this.settings[name].apply(this, args);
      };
      this.init = function () {

        this.settings = $.extend({}, this.defaults, options);
        var that = this;
        var d = new Date();
        var n = d.getTime();

        this.startTime = n;
        this.elementName = $(that.$element).attr('name');

        that.settings.track.call(that, $(that.$element).attr('name'), 'Form ready for stats');

        if (typeof ga === 'undefined')
          throw new Error('Add GA to your page.')



          this.$element.find('input, textarea').not('[type=checkbox],[type=submit]').each(function () {
              var elementName = $(this).attr('name');
              $(this).keydown(function (e) {
                  // Don't log tabs and tabs
                  if(e.keyCode === 9 || e.keyCode == 27) return;
                  var d = new Date();
                  var n = d.getTime();
                  var currentValue = $(this).val();
                  var previousValue = $(this).data('valueBeforeTyping');
                  var changeVal = 'from ' + (previousValue == '' ? 'nothing' : previousValue) + ' to ' + currentValue;
                  var change = (currentValue == previousValue) ? ' nothing' : changeVal;

                  // This is the first time the user typed in this element
                  if (!$(this).data('userStartedTypingInThisBox')) {
                      var msg = 'Started typing';
                      that.settings.track.call(that, elementName, msg, n - $(this).data('userStartedFocusingAt'));
                  }

                  // If user paused for a while
                  var t = this;

                  var howManyMilliSecsAreAPause = that.settings.howManyMilliSecsAreAPause;
                  var c = $(t).val();

                  if (that.settings.trackPauses) {
                      if ((n - $(t).data('lastTimeTypingInThisBox')) > howManyMilliSecsAreAPause && ($(this).data('userStartedTypingInThisBox'))) {
                          that.settings.track.call(that, elementName, 'paused and continued ', n - $(this).data('lastTimeTypingInThisBox'));
                      }
                  }

                  $(t).data('lastTimeTypingInThisBox', n);
                  $(this).data('valueBeforeTyping', $(this).val());

                  $(this).data('userStartedTypingInThisBox', true);
              })

          });


        this.$element.find('input, textarea, select').not('[type=checkbox],[type=submit]').each(function () {
          var elementName = $(this).attr('name');

          // Every item should have name
          if (typeof elementName == 'undefined' || elementName == '') {
            throw new Error('Every form element should have a name')
          }

          $(this).blur(function () {
            var d = new Date();
            var n = d.getTime();
            var currentValue = $(this).val();
            var previousValue = $(this).data('valueBeforeFocus');
            var changeVal = 'from ' + (previousValue == '' ? 'nothing' : previousValue) + ' to ' + currentValue;
            var change = (currentValue == previousValue) ? ' nothing' : changeVal;

            $(this).data('valueBeforeFocus', currentValue);

            that.settings.track.call(that, elementName, 'focusOut', n - $(this).data('startFocus'), change);
          })

          $(this).focus(function () {
            var d = new Date();
            var n = d.getTime();

            $(this).data('userStartedTypingInThisBox', false);
            $(this).data('userStartedFocusingAt', n);
            $(this).data('lastTimeTypingInThisBox', n);

            that.setMostRecentFocusedElement(elementName);
            $(this).data('startFocus', n);
            $(this).data('valueBeforeFocus', $(this).val());
            that.settings.track.call(that, elementName, 'focus');
          })

        })

        this.$element.bind('submit', function () {
          var elementName = $(this).attr('name');
          var d = new Date();
          var n = d.getTime();
          that.submitted = true;
          that.settings.track.call(that, 'form', 'submitted', n - that.startTime);
          return false
        })

        this.$element.find('input[type=checkbox]').each(function () {
          var elementName = $(this).attr('name');

          $(this).bind('change', function () {
            var d = new Date();
            var n = d.getTime();
            var currentValue = $(this).prop('checked');
            var previousValue = !currentValue;
            var changeVal = 'from ' + (previousValue === '' ? 'nothing' : previousValue) + ' to ' + currentValue;
            var change = (currentValue == previousValue) ? ' has not changed' : changeVal;

            that.settings.track.call(that, elementName, 'changed', undefined, change);
            $(this).data('valueBeforeFocus', $(this).prop('checked'));
            that.setMostRecentFocusedElement(elementName);

          })
        })

        this.$element.find('select').each(function () {
          $(this).bind('change', function () {
            var elementName = $(this).attr('name');
            var d = new Date();
            var n = d.getTime();

            if ($(this).data('lastTimeSelectionTime'))
              var timeSinceLastChange = $(this).data('lastTimeSelectionTime') ? (n - $(this).data('lastTimeSelectionTime')) : 0;
            else
              var timeSinceLastChange = $(this).data('startFocus') ? (n - $(this).data('startFocus')) : 0;

            var currentValue = $(this).val();
            var previousValue = $(this).data('valueBeforeFocus');
            var changeVal = 'from ' + (previousValue === '' ? 'nothing' : previousValue) + ' to ' + currentValue;
            var change = (currentValue == previousValue) ? ' has not changed' : changeVal;

            that.settings.track.call(that, elementName, 'changed', timeSinceLastChange, change);

            $(this).data('valueBeforeFocus', $(this).val());
            $(this).data('lastTimeSelectionTime', n);

            that.setMostRecentFocusedElement(elementName);
          })
        })
        return this.setState('ready');
      };
      this.init();
      return this;
    };
    $.formagical.prototype.defaults = {
      howManyMilliSecsAreAPause: 1500,
      trackPauses: true,
      track: function (element, type, label, optional) {
        return this.trackInAnalytics(element, type, label, optional);
      }
    };

    return $.fn.formagical = function (options) {
      return this.each(function () {
        var plugin;
        if ($(this).data('formagical') === void 0) {
          plugin = new $.formagical(this, options);
          return $(this).data('formagical', plugin);
        }
      });
    };
  });

}).call(this);
