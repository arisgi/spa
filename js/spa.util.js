/*
 * spa.util.js
 * utility module
 */

/*jslint         browser : true, continue : true,
  devel  : true, indent  : 2,    maxerr   : 50,
  newcap : true, nomen   : true, plusplus : true,
  regexp : true, sloppy  : true, vars     : false,
  white  : true
*/

/*global $, spa */

spa.util = (function () {
  var makeError, setConfigMap;

  // public constructor /makeError/
  // purpose : wrapper to create an error object
  // argument :
  //   * name_text - error name
  //   * msg_text - long error message
  //   * data - option data of error object
  // return : error object
  // exception : none
  //
  makeError = function ( name_text, msg_text, data ) {
    var error = new Error();
    error.name = name_text;
    error.message = msg_text;

    if ( data ) { error.date = data; }

    return error;
  };

  // public method /setConfigMap/
  // purpose : common code to perform the configuration in the function module
  // argument :
  //   * input_map - key-value map to configure
  //   * settable_map - key map that can be configured
  //   * config_map - map to apply the configuration
  // return : true
  // exception : if the input key is not allowed
  //
  setConfigMap = function ( arg_map ) {
    var
      input_map = arg_map.input_map,
      settable_map = arg_map.settable_map,
      config_map = arg_map.config_map,
      key_name, error;

    for ( key_name in input_map ) {
      if ( input_map.hasOwnProperty( key_name ) ) {
        if ( settable_map.hasOwnProperty( key_name ) ) {
          config_map[key_name] = input_map[key_name];
        } else {
          error = makeError( 'Bad input',
            'Setting config key |' + key_name + '| is not supported'
          );
          throw error;
        }
      }
    }
  };

  return {
    makeError : makeError,
    setConfigMap : setConfigMap
  };
}());
