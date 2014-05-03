(function() {
  jQuery(function() {
    $.formagical = function(element, options) {
      var state;
      state = '';
      this.settings = {};
      this.$element = $(element);
      this.setState = function(_state) {
        return state = _state;
      };
      this.getState = function() {
        return state;
      };
      this.getSetting = function(key) {
        return this.settings[key];
      };
      this.trackInAnalytics = function() {

      };
      this.callSettingFunction = function(name, args) {
        if (args == null) {
          args = [];
        }
        return this.settings[name].apply(this, args);
      };
      this.init = function() {

        this.settings = $.extend({}, this.defaults, options);
        var that = this;



        this.$element.find('input, textarea').each(function() {
          var elementName = $(this).attr('name');

          // Every item should have name
          if(typeof elementName == 'undefined' || elementName == '') {
            throw new Error('Every form element should have a name')
          }

          $(this).blur(function() {
            if(that.settings.track)
              that.settings.track.call(that, $(this).data('startFocus'));
          })

          $(this).focus(function() {
            if(that.settings.track)
              that.settings.track.apply(that);
          })

        })

        return this.setState('ready');
      };
      this.init();
      return this;
    };
    $.formagical.prototype.defaults = {
      message: 'Hello world'
    };
    return $.fn.formagical = function(options) {
      return this.each(function() {
        var plugin;
        if ($(this).data('formagical') === void 0) {
          plugin = new $.formagical(this, options);
          return $(this).data('formagical', plugin);
        }
      });
    };
  });

}).call(this);
