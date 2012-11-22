;( function( exports ) {
	var PusherSingly = function( pusher ) {
		this._pusher = pusher;
	};

	PusherSingly.prototype.subscribe = function( options ) {
		if( !options ) {
	    throw '"options" must be supplied';
	  }
	  if( !options.path ) {
	    throw '"options.path" must be supplied';
	  }
	  options.query = options.query || '';

	  // for now, make each channel unique. See TODOs in leggetter/hallway
	  options._timestamp = ( new Date() ).getTime();
	  
	  var encodedChannel = JSON.stringify( options );
	  encodedChannel = Base64.encode( encodedChannel );
	  
	  return this._pusher.subscribe( encodedChannel );
	};

	exports.PusherSingly = PusherSingly;

})( window )