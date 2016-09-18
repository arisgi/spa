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

/*global $, spa */

spa.chat = (function () {
  //---------- module scope variable ---------------------
  var
    configMap = {
      main_html : String()
        + '<div style="padding:1em; color:#fff;">'
          + 'Say hello to chat'
        + '</div>',
      settable_map : {}
    },
    stateMap = { $container : null },
    jqueryMap = {},

    setJqueryMap, configModule, initModule
    ;
  //---------- end module scope variable ------------------

  //---------- utility method -----------------------------
  //---------- end utility method -------------------------

  //---------- DOM method ---------------------------------
  // DOM method /setJqueryMap/
  setJqueryMap = function () {
    var $container = stateMap.$container;
    jqueryMap = { $container : $container };
  };
  //---------- end DOM method -----------------------------

  //---------- event handler ------------------------------
  //---------- end event handler --------------------------

  //---------- public method ------------------------------
  // public method /configMap/
  // purpose : adjust authorized key configuration
  // argument : configurable key-value map
  //   * color_name - color to use
  // return : true
  // exception : none
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
  // purpose : initialize module
  // argument :
  //   * $container - jQuery element
  // return : true
  // exception : none
  //
  initModule = function ( $container ) {
    $container.html( configMap.main_html );
    stateMap.$container = $container;
    setJqueryMap();
    return true;
  };

  // return public method
  return {
    configModule : configModule,
    initModule : initModule
  };
  //---------- end public method --------------------------
}());
