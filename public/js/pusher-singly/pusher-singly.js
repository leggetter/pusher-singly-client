;( function( exports ) {
	var PusherSingly = function( pusher ) {
		this._pusher = pusher;
		this._subscribedPaths = {};
	};

	PusherSingly.prototype.subscribe = function( options ) {
		if( !options ) {
	    throw '"options" must be supplied';
	  }
	  if( !options.path ) {
	    throw '"options.path" must be supplied';
	  }
	  options.query = options.query || '';

	  if( this._subscribedPaths[ options.path ] !== undefined ) {
	  	Pusher.warn( options.path + ' is already subscribed to' );
	  	return;
	  }

	  // for now, make each channel unique. See TODOs in leggetter/hallway
	  options._timestamp = ( new Date() ).getTime();
	  
	  var encodedChannel = JSON.stringify( options );
	  encodedChannel = Base64.encode( encodedChannel );

	  Pusher.log( 'subscribing to ' + JSON.stringify( options, null, 2 ) );
	  
	  this._subscribedPaths[ options.path ] = this._pusher.subscribe( encodedChannel );
	  return this._subscribedPaths[ options.path ];
	};

	PusherSingly.prototype.unsubscribe = function( path ) {
		
		var channel = this._subscribedPaths[ path ];
		if( channel === undefined ) {
			Pusher.warn( 'no existing subscription for ' + path );
	  	return false;
		}

		Pusher.log( 'unsubscribing from ' + path );

		this._pusher.unsubscribe( channel.name );
		delete this._subscribedPaths[ path ];
		return true;
	}

	exports.PusherSingly = PusherSingly;

})( window )