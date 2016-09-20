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
  //---------- module scope variables ---------------------
  var
    configMap = {
      anchor_schema_map : {
        chat : { opened : true, closed : true}
      },
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
        + '<div class="spa-shell-modal"></div>'
    },
    stateMap  = { anchor_map : {} },
    jqueryMap = {},

    copyAnchorMap, setJqueryMap,
    changeAnchorPart, onHashchange,
    setChatAnchor, initModule;
    //---------- end module scope var ---------------------

    //---------- utility method ---------------------------
    // return copy of the stored anchor map
    copyAnchorMap = function () {
      return $.extend( true, {}, stateMap.anchor_map );
    };
    //---------- end utility method -----------------------

    //---------- DOM method -------------------------------
    // DOM method /setJqueryMap/
    setJqueryMap = function () {
      var $container = stateMap.$container;

      jqueryMap = { $container : $container };
    };

    // DOM method /changeAnchorPart/
    // purpose : change uri anchor element
    // argument :
    //   * arg_map -
    // return : boolean
    //   * true - URI anchor is updated
    //   * false - URI anchor is not updated
    // behaviour :
    //   store the current anchor to stateMap.anchor_map.
    //   see uriAnchor description of the encoding.
    //   this method
    //     * create copy of child map by using copyAnchorMap()
    //     * modify key value by using arg_map
    //     * manage distinction of independent value
    //       and dependent value of encoding
    //     * try to change URI by using uriAnchor
    //     * successful -> true, fail -> false
    //
    changeAnchorPart = function ( arg_map ) {
      var
        anchor_map_revise = copyAnchorMap(),
        bool_return = true,
        key_name, key_name_dep;

      KEYVAL:
      for( key_name in arg_map ) {
        if ( arg_map.hasOwnProperty( key_name ) ) {

          // send a dependent key during the iteration
          if ( key_name.indexOf( '_' ) === 0 ) { continue KEYVAL; }

          // update independent key
          anchor_map_revise[key_name] = arg_map[key_name];

          // update independent key match
          key_name_dep = '_' + key_name;
          if ( arg_map [key_name_dep] ) {
            anchor_map_revise[key_name_dep] = arg_map[key_name_dep];
          } else {
            delete anchor_map_revise[key_name_dep];
            delete anchor_map_revise['_s' + key_name_dep];
          }
        }
      }

      // update URI. if it fails, revert.
      try {
        $.uriAnchor.setAnchor( anchor_map_revise );
      }
      catch ( error ) {
        // revert URI to current status
        $.uriAnchor.setAnchor( stateMap.anchor_map, null, true );
        bool_return = false;
      }

      return bool_return;
    }
    //---------- end DOM method ---------------------------

    //---------- event handler ----------------------------
    // event handler /onHashchange/
    // purpose : process hashchange event
    // argument :
    //   * event - jQuery event object
    // configuration : none
    // return : false
    // behaviour :
    //   * analyze URI anchor element
    //   * compare proposed state and current state
    //   * adjust application if proposed state is different from current state
    //
    onHashchange = function ( event ) {
      var
        _s_chat_previous, _s_chat_proposed, s_chat_proposed,
        anchor_map_proposed,
        is_ok = true,
        anchor_map_previous = copyAnchorMap();

      // try to analyze anchor
      try { anchor_map_proposed = $.uriAnchor.makeAnchorMap(); }
      catch ( error ) {
        $.uriAnchor.setAnchor( anchor_map_previous, null, true );
        return false;
      }
      stateMap.anchor_map = anchor_map_proposed;

      _s_chat_previous = anchor_map_previous._s_chat;
      _s_chat_proposed = anchor_map_proposed._s_chat;

      // adjust chat component if if has been changed
      if ( ! anchor_map_previous || _s_chat_previous !== _s_chat_proposed ) {
        s_chat_proposed = anchor_map_proposed.chat;
        switch ( s_chat_proposed ) {
          case 'opened' :
            is_ok = spa.chat.setSliderPosition( 'opened' );
            break;
          case 'closed' :
            is_ok = spa.chat.setSliderPosition( 'closed' );
            break;
          defalut :
            spa.chat.setSliderPosition( 'closed' );
            delete anchor_map_proposed.chat;
            $.uriAnchor.setAnchor( anchor_map_proposed, null, true );
        }
      }

      // undo the anchor if the change of the slider is denied
      if ( ! is_ok ) {
        if ( anchor_map_previous ) {
          $.uriAnchor.setAnchor( anchor_map_previous, null, true );
          stateMap.anchor_map = anchor_map_previous;
        } else {
          delete anchor_map_proposed.chat;
          $.uriAnchor.setAnchor( anchor_map_proposed, null, true );
        }
      }

      return false;
    }
    //---------- end event handler ------------------------

    //---------- callback ---------------------------------
    // callback method /setChatAnchor/
    // example : setChatAnchor( 'closed' );
    // purpose : change anchor chat component
    // argument :
    //   * position_type - closed or opened
    // behaviour :
    //   change URI anchor parameter 'chat'
    // return :
    //   * true - update anchor
    //   * false - not update anchor
    // exception : none
    //
    setChatAnchor = function ( position_type ) {
      return changeAnchorPart({ chat : position_type });
    };
    //---------- end callback -----------------------------

    //---------- public method ----------------------------
    // public method /initModule/
    // example : spa.shell.initModule( $('#app_div_id') );
    // argument :
    //   * $append_target
    //     jQuery collection
    // return : none
    // exception : none
    //
    initModule = function ( $container ) {
      // road HTML, mapping the jquery collection
      stateMap.$container = $container;
      $container.html( configMap.main_html );
      setJqueryMap();

      $.uriAnchor.configModule({
        schema_map : configMap.anchor_schema_map
      });

      // initialize function module
      spa.chat.configModule({
        set_chat_anchor : setChatAnchor,
        chat_model      : spa.model.chat,
        people_model    : spa.model.people
      });
      spa.chat.initModule( jqueryMap.$container );

      // process event that changes URI
      // this is to run after initialize all of the function modules
      // otherwise you can't handle the trigger event
      // trigger events ensure that the anchor can be regarded as a loading state
      //
      $(window)
        .bind( 'hashchange', onHashchange )
        .trigger( 'hashchange' );

    };

    return { initModule : initModule };
    //---------- end public method ------------------------
}());
