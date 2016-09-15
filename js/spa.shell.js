/*
 * spa.shell.js
 * spa shell module
*/
/*jslint         browser : true, continue : true,
  devel  : true, indent  : 2,    maxerr   : 50,
  newcap : true, nomen   : true, plusplus : true,
  regexp : true, sloppy  : true, vars     : false,
  white  : true
*/
/*global $, spa */
spa.shell = (function () {
  //---------- module scope var ---------------------------
  var
    configMap = {
      main_html : String()
        + '<div class="spa-shell-head">'
          + '<div class="spa-shell-head-logo"></div>'
          + '<div class="spa-shell-head-acct"></div>'
          + '<div class="spa-shell-head-search"></div>'
        + '</div>'
        + '<div class="spa-shell-main">'
          + '<div class="spa-shell-main-nav"></div>'
          + '<div class="spa-shell-main-content"></div>'
        + '</div>'
        + '<div class="spa-shell-foot"></div>'
        + '<div class="spa-shell-chat"></div>'
        + '<div class="spa-shell-modal"></div>',
      chat_extend_time     : 1000,
      chat_retract_time    : 300,
      chat_extend_height   : 450,
      chat_retract_height  : 15,
      chat_extend_title    : 'Click to retract',
      chat_retracted_title : 'Click to extend'
    },
    stateMap  = {
      $container        : null,
      is_chat_retracted : true
    },
    jqueryMap = {},

    setJqueryMap, toggleChat, onClickChat, initModule;
    //---------- end module scope var ---------------------

    //---------- utility method ---------------------------
    //---------- end utility method -----------------------

    //---------- DOM method -------------------------------
    // DOM method /setJqueryMap/
    setJqueryMap = function () {
      var $container = stateMap.$container;

      jqueryMap = {
        $container : $container,
        $chat : $container.find( '.spa-shell-chat' )
      };
    };

    // DOM method /toggleChat/
    // argument :
    //   * do_extend - if true, expand slider. if false, store slider.
    //   * callback - function to be executed at the end of the animation
    // configuration :
    //   * chat_extend_time, chat_retract_time
    //   * chat_extend_height, chat_retract_height
    // return : boolean
    //   * true - slider has been started
    //   * false - slider has not been started
    // state : configure stateMap.is_chat_retracted
    //   * true - slider is stored
    //   * false - slider is expanded
    //
    toggleChat = function ( do_extend, callback ) {
      var
        px_chat_ht = jqueryMap.$chat.height(),
        is_open = px_chat_ht === configMap.chat_extend_height,
        is_closed = px_chat_ht === configMap.chat_retract_height,
        is_sliding = ! is_open && ! is_closed;

      // avoid conflict
      if ( is_sliding ) { return false; }

      // expand chat slider
      if ( do_extend ) {
        jqueryMap.$chat.animate(
          { height : configMap.chat_extend_height },
          configMap.chat_extend_time,
          function () {
            jqueryMap.$chat.attr(
              'title', configMap.chat_extended_title
            );
            stateMap.is_chat_retracted = false;
            if ( callback ) { callback ( jqueryMap.$chat ); }
          }
        );
        return true;
      }

      // store chat slider
      jqueryMap.$chat.animate(
        { height : configMap.chat_retract_height },
        configMap.chat_retract_time,
        function () {
          jqueryMap.$chat.attr(
            'title', configMap.chat_retracted_title
          );
          stateMap.is_chat_retracted = true;
          if ( callback ) { callback( jqueryMap.$chat ); }
        }
      );
      return true;
    };
    //---------- end DOM method ---------------------------

    //---------- event handler ----------------------------
    onClickChat = function ( event ) {
      toggleChat( stateMap.is_chat_retracted );
      return false;
    };
    //---------- end event handler ------------------------

    //---------- public method ----------------------------
    // public method /initModule/
    initModule = function ( $container ) {
      // road HTML, mapping the jquery collection
      stateMap.$container = $container;
      $container.html( configMap.main_html );
      setJqueryMap();

      // initialize slider, bind click handler
      stateMap.is_chat_retracted = true;
      jqueryMap.$chat
        .attr( 'title', configMap.chat_retracted_title )
        .click( onClickChat );
    };

    return { initModule : initModule };
    //---------- end public method ------------------------
}());
