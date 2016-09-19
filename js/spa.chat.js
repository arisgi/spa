/*
 * spa.chat.js
 * spa chat module
 */

/*jslint         browser : true, continue : true,
  devel  : true, indent  : 2,    maxerr   : 50,
  newcap : true, nomen   : true, plusplus : true,
  regexp : true, sloppy  : true, vars     : false,
  white  : true
*/

/*global $, spa, getComputedStyle */

spa.chat = (function () {
  //---------- module scope variable ---------------------
  var
    configMap = {
      main_html : String()
        + '<div class="spa-chat">'
          + '<div class="spa-chat-head">'
            + '<div class="spa-chat-head-toggle">+</div>'
            + '<div class="spa-chat-head-title">'
              + 'Chat'
            + '</div>'
          + '</div>'
          + '<div class="spa-chat-closer">x</div>'
          + '<div class="spa-chat-sizer">'
            + '<div class="spa-chat-msgs"></div>'
            + '<div class="spa-chat-box">'
              + '<input type="text">'
              + '<div>send</div>'
            + '</div>'
          + '</div>'
        + '</div>',

      settable_map : {
        slider_open_time    : true,
        slider_close_time   : true,
        slider_opened_em    : true,
        slider_closed_em    : true,
        slider_opened_title : true,
        slider_closed_title : true,

        chat_model      : true,
        people_model    : true,
        set_chat_anchor : true
      },

      slider_open_time    : 250,
      slider_close_time   : 250,
      slider_opened_em    : 16,
      slider_closed_em    : 2,
      slider_opened_title : 'Click to close',
      slider_closed_title : 'Click to open',

      chat_model      : null,
      people_model    : null,
      set_chat_anchor : null
    },

    stateMap = {
      $append_target   : null,
      position_type    : 'closed',
      px_per_em        : 0,
      slider_hidden_px : 0,
      slider_closed_px : 0,
      slider_opened_px : 0
    },
    jqueryMap = {},

    setJqueryMap, getEmSize, setPxSizes, setSliderPosition,
    onClickToggle, configModule, initModule
    ;
  //---------- end module scope variable ------------------

  //---------- utility method -----------------------------
  getEmSize = function ( elem ) {
    return Number(
      getComputedStyle( elem, '' ).fontSize.match(/\d*\.?\d*/)[0]
    );
  };
  //---------- end utility method -------------------------

  //---------- DOM method ---------------------------------
  // DOM method /setJqueryMap/
  setJqueryMap = function () {
    var
      $append_target = stateMap.$append_target,
      $slider        = $append_target.find( '.spa-chat' );

    jqueryMap = {
      $slider : $slider,
      $head   : $slider.find( '.spa-chat-head' ),
      $toggle : $slider.find( '.spa-chat-head-toggle' ),
      $title  : $slider.find( '.spa-chat-head-title' ),
      $sizer  : $slider.find( '.spa-chat-sizer' ),
      $msgs   : $slider.find( '.spa-chat-msgs' ),
      $box    : $slider.find( '.spa-chat-box' ),
      $input  : $slider.find( '.spa-chat-input input[type=text]')
    };
  };

  // DOM method /setPxSizes/
  setPxSizes = function () {
    var px_per_pm, opened_height_em;
    px_per_em = getEmSize( jqueryMap.$slider.get(0) );

    opened_height_em = configMap.slider_opened_em;

    stateMap.px_per_em        = px_per_em;
    stateMap.slider_closed_px = configMap.slider_closed_em * px_per_em;
    stateMap.slider_opened_px = opened_height_em * px_per_em;
    jqueryMap.$sizer.css({
      height : ( opened_height_em - 2 ) * px_per_em
    });
  };

  // public method /setSliderPosition/
  // example : spa.chat.setSliderPosition( 'closed' )
  // purpose : the state of the chat slider as requested
  // argument :
  //   * position_type - enum( 'closed', 'opened', 'hidden' )
  //   * callback - callbacl option at end of the animation
  //     receive a jQuery collection as an argument
  // behaviour :
  //   move the slider to the requested position
  // return :
  //   * true - moved correctly
  //   * false - not moves correctly
  // exception : none
  //
  setSliderPosition = function ( position_type, callback ) {
    var
      height_px, animate_time, slider_title, toggle_text;

    // if slider is in the request position, return true
    if ( stateMap.position_type === position_type ) {
      return true;
    }

    // prepare animation parameter
    switch ( position_type ) {
      case 'opened' :
        height_px    = stateMap.slider_opened_px;
        animate_time = configMap.slider_open_time;
        slider_title = configMap.slider_opened_title;
        toggle_text  = '=';
        break;
      case 'hidden' :
        height_px    = 0;
        animate_time = configMap.slider_open_time;
        slider_title = '';
        toggle_text  = '+';
        break;
      case 'closed' :
        height_px    = stateMap.slider_closed_px;
        animate_time = configMap.slider_close_time;
        slider_title = configMap.slider_closed_title;
        toggle_text  = '+';
        break;
      default :
        return false;
    }

    // change the slider position animation
    stateMap.position_type = '';
    jqueryMap.$slider.animate(
      { height : height_px },
      animate_time,
      function () {
        jqueryMap.$toggle.prop( 'title', slider_title );
        jqueryMap.$toggle.text( toggle_text ),
        stateMap.position_type = position_type;
        if ( callback ) { callback( jqueryMap.$slider ); }
      }
    );

    return true;
  };
  //---------- end DOM method -----------------------------

  //---------- event handler ------------------------------
  onClickToggle = function ( event ) {
    var set_chat_anchor = configMap.set_chat_anchor;
    if ( stateMap.position_type === 'opened' ) {
      set_chat_anchor( 'closed' );
    } else if ( stateMap.position_type === 'closed' ) {
      set_chat_anchor( 'opened' );
    }
    return false;
  };
  //---------- end event handler --------------------------

  //---------- public method ------------------------------
  // public method /configModule/
  // example : spa.chat.configModule({ slider_open_em : 18 });
  // purpose : configure module before initialization
  // argument :
  //   * set_chat_anchor
  //   * chat_model
  //   * people_model
  //   * slider
  // behaviour :
  //   update state by configMap
  // return : true
  // exception : throw error if missing argument
  //
  configModule = function ( input_map ) {
    spa.util.setConfigMap({
      input_map : input_map,
      settable_map : configMap.settable_map,
      config_map : configMap
    });
    return true;
  };

  // public method /initModule/
  // example : spa.chat.initModule( $('#div_id') );
  // purpose : instruct chat
  // argument :
  //   * $append_target
  //   jQuery collection
  // behaviour :
  //   adding a chat slider to the specified container
  // return : true or false
  // exception : none
  //
  initModule = function ( $append_target ) {
    $append_target.append( configMap.main_html );
    stateMap.$append_target = $append_target;
    setJqueryMap();
    setPxSizes();

    // initialize chat slider with default title and state
    jqueryMap.$toggle.prop( 'title', configMap.slider_closed_title );
    jqueryMap.$head.click( onClickToggle );
    stateMap.position_type = 'closed';

    return true;
  };

  // return public method
  return {
    setSliderPosition : setSliderPosition,
    configModule      : configModule,
    initModule        : initModule
  };
  //---------- end public method --------------------------
}());
