( function( window, $, Modernizr, view, storage, options ) {

	// logging
	Pusher.log = function( msg ) {
		if( console && console.log ) {
			console.log( msg );
		}
	};

	var pusher = new Pusher( '94a30c48931d62ed5ebf', { encrypted: true } );
	var singly = new PusherSingly( pusher );

	// services
	function getServices( callback ) {
		var services = storage.getItem( 'services' );

		if( services === null ) {
	  	$.ajax( {
	    	url: 'https://api.singly.com/v0/services',
	    	success: function() {
	    		servicesRetrieved.apply( this, arguments );
	    		callback();
	    	}
	  	} );
		}
		else {
			view.displayServices( services );
			callback();
		}
	}

	function servicesRetrieved( data ) {
		storage.setItem( 'services', data );

		view.displayServices( data );
	}

	// view
	view.onSubscriptionToggle = function( evt ) {

		var serviceName = evt.serviceName;
		var syncletIndex = evt.syncletIndex;
		var services = storage.getItem( 'services' );

		var service = services[ serviceName ];
		if( !service ) {
			view.alert( 'could not find service. something has gone wrong' );
			return;
		}
		
		var synclet = service.synclets[ syncletIndex ];
		if( !synclet ) {
			view.alert( 'could not find synclet. something has gone wrong' );
			return;
		}

		Pusher.log( 'synclet: ' + JSON.stringify( synclet, null, 2 ) );

		if( synclet.subscribed ) {
			// unsubscribe

			unsubscribeFromSynclet( serviceName, service, synclet );
		}
		else if( service.accessToken === undefined ) {
			// authenticate
			var authUrl = 'https://api.singly.com/oauth/authorize?' +
										'client_id=f011409415c67030f676f11de7783aee&' +
										'service=' + serviceName + '&' +
										'redirect_uri=' + encodeURIComponent( options.appUrl +
																								 '?service=' + serviceName +
																								 '&synclet=' + syncletIndex ) +
										'&response_type=token';

			window.location.href = authUrl;
		}
		else {
			subscribeToSynclet( serviceName, service, synclet );
		}
		storage.setItem( 'services', services );
	}

	// subscribe / unsubscribe
	function subscribeToSynclet( serviceName, service, synclet ) {
		var path = '/services/' + serviceName + '/' + synclet.name;
		var channel = singly.subscribe( {
			//webhook: 'http://4xjj.localtunnel.com', // TODO: not required when the server knows the streaming webhook endpoint
			path: path,
			token: service.accessToken
		} );
		channel.bind( 'singly:data_received', function( data ) {
			view.logUpdate( { "event": "singly:data_received", data: data }, 'success' );
		});
		channel.bind( 'singly:subscription_succeeded', function( data ) {
			view.logUpdate( { "event": "singly:subscription_succeeded", data: data }, 'success' );
		});
		channel.bind( 'singly:unsubscribe_succeeded', function( data ) {
			view.logUpdate( { "event": "singly:unsubscribe_succeeded", data: data }, 'success' );
		});
		channel.bind( 'singly:subscription_error', function( data ) {
			view.logUpdate( { "event": "singly:subscription_error", data: data }, 'error' );
		});

		synclet.subscribed = true;
	}

	function unsubscribeFromSynclet( serviceName, service, synclet ) {
		var path = '/services/' + serviceName + '/' + synclet.name;
		singly.unsubscribe( path );
		synclet.subscribed = false;
	}

	function subscribeToPending() {
		var services = storage.getItem( 'services' );
		var service;
		var synclet;
		for( var serviceName in services ) {

			service = services[ serviceName ];
			if( service.accessToken ) {
				
				for( var i = 0, l = service.synclets.length; i < l; ++i ) {
					synclet = service.synclets[ i ];
					if( synclet.subscribed ) {
						subscribeToSynclet( serviceName, service, synclet );
					}
				}

			}

		}

	}

	// init
	function init() {

		var accessTokenMatch = window.location.hash.match( /#access_token=([\w\d\._-]+)/ );
		var serviceMatch = window.location.href.match( /\?service=(\w+)/ );
		var syncletMatch = window.location.href.match( /&synclet=(\d+)/ );

		getServices( function() {

			if( serviceMatch !== null && accessTokenMatch !== null && syncletMatch !== null ) {
				// service has just been authorized
				var authedService = serviceMatch[ 1 ];
				var accessToken = accessTokenMatch[ 1 ];
				var syncletIndex = syncletMatch[ 1 ];

				var services = storage.getItem( 'services' );
				var service = services[ authedService ];
				service.accessToken = accessToken;
				service.synclets[ syncletIndex ].subscribed = true;
				storage.setItem( 'services', services );

				view.updateService( authedService, service )
			}

			subscribeToPending();

		} );
		
	}

	$( init );

})( window,
		jQuery,
		Modernizr,
		window.view,
		window.storage,
		{
			appUrl: document.location.origin
		}
	);
