(function () {
  describe('formagical', function () {
    var options;
    options = {
      message: 'Hello World'
    };
    beforeEach(function () {
      loadFixtures('fragment.html');
      return this.$element = $('#fixtures');
    });
    describe('plugin', function () {
      it('should be available on the jQuery object', function () {
        return expect($.fn.formagical).toBeDefined();
      });
      it('should be chainable', function () {
        return expect(this.$element.formagical()).toBe(this.$element);
      });

      it('should throw error if item in form has no name', function () {
        loadFixtures('no_name.html');
        this.$element = $('#no-name');
        var that = this;
        return expect(function () {
          $.formagical(that.$element);
        }).toThrow();
      });

      it('should offers default values', function () {
        var plugin;
        plugin = new $.formagical(this.$element);
        return expect(plugin.defaults).toBeDefined();
      });

      return it('should overwrites the settings', function () {
        var plugin;
        plugin = new $.formagical(this.$element, options);
        return expect(plugin.settings.message).toBe(options.message);
      });
    });

    describe("Google Analytics", function () {

      it('should throw error if Google Analytics is not in the page', function () {
        _gaq = undefined;
        this.$element = $('#fixtures');
        var that = this;
        return expect(function () {
          $.formagical(that.$element);
        }).toThrow();
      });

    });
    describe("inputs", function () {
      it("should call track on focus out", function () {
        options.track = function (form, formElementName, trackType, trackData) {};
        var spy = spyOn(options, 'track');
        var plugin;
        plugin = new $.formagical(this.$element, options);

        $('input', this.$element).eq(0).data('startFocus', 100)


        $('input', this.$element).eq(0).trigger('blur');


        return expect(spy).toHaveBeenCalledWith('elementName','focusOut',100);

      });
      it("should call track on focus", function () {
        options.track = function (form, formElementName, trackType, trackData) {};
        var spy = spyOn(options, 'track');
        var plugin;
        plugin = new $.formagical(this.$element, options);

        $('input', this.$element).eq(0).trigger('focus');

        return expect(spy).toHaveBeenCalled();
      });

    });

        describe("textarea", function () {
      it("should call track on focus out", function () {
        options.track = function (form, formElementName, trackType, trackData) {};
        var spy = spyOn(options, 'track');
        var plugin;
        plugin = new $.formagical(this.$element, options);

        $('textarea', this.$element).eq(0).data('startFocus', 100)

        $('textarea', this.$element).eq(0).trigger('blur');

        return expect(spy).toHaveBeenCalledWith(100);

      });
      it("should call track on focus", function () {
        options.track = function (form, formElementName, trackType, trackData) {};
        var spy = spyOn(options, 'track');
        var plugin;
        plugin = new $.formagical(this.$element, options);

        $('textarea', this.$element).eq(0).trigger('focus');

        return expect(spy).toHaveBeenCalled();
      });

    });

    describe("form", function () {
      it("should call track when user leaves page", function () {
        options.track = function (form, formElementName, trackType, trackData) {};
        var spy = spyOn(options, 'track');
        var plugin;
        plugin = new $.formagical(this.$element, options);

        $(window).trigger('beforeunload');

        return expect(spy).toHaveBeenCalled();
      });
    });

    return describe('plugin state', function () {
      beforeEach(function () {
        return this.plugin = new $.formagical(this.$element);
      });
      it('should have a ready state', function () {
        return expect(this.plugin.getState()).toBe('ready');
      });
      return it('should be updatable', function () {
        this.plugin.setState('new state');
        return expect(this.plugin.getState()).toBe('new state');
      });
    });
  });

}).call(this);