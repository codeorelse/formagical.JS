#
# Name    : Formagical
# Author  : Siebe Hiemstra @code_or_else
# Version : 0.1
# Repo    : https://github.com/codeorelse/formagical
#

jQuery ->
  $.formagical = ( element, options ) ->
    # current state
    state = ''

    # plugin settings
    @settings = {}

    # jQuery version of DOM element attached to the plugin
    @$element = $ element

    # set current state
    @setState = ( _state ) -> state = _state

    #get current state
    @getState = -> state

    # get particular plugin setting
    @getSetting = ( key ) ->
      @settings[ key ]

    # call one of the plugin setting functions
    @callSettingFunction = ( name, args = [] ) ->
      @settings[name].apply( this, args )

    @init = ->
      @settings = $.extend( {}, @defaults, options )

      @setState 'ready'

    # initialise the plugin
    @init()

    # make the plugin chainable
    this

  # default plugin settings
  $.formagical::defaults =
      message: 'Hello world'  # option description

  $.fn.formagical = ( options ) ->
    this.each ->
      if $( this ).data( 'formagical' ) is undefined
        plugin = new $.formagical( this, options )
        $( this).data( 'formagical', plugin )