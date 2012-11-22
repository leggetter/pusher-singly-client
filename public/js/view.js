( function( exports, $, options ) {

	function displayServices( services ) {
		for( var serviceName in services ) {
	    appendService( serviceName, services[ serviceName ] )
	  }

	  $( options.services + ' input[type="checkbox"]' ).click( handleSubscriptionToggle );
	}

	function handleSubscriptionToggle() {
		var el = $( this );
		var serviceName = el.attr( 'data-service-name' );
		var syncletIndex = parseInt( el.attr( 'data-synclet-index' ), 10 );

		window.view.onSubscriptionToggle( { serviceName: serviceName, syncletIndex: syncletIndex } );
	}

	function appendService( serviceName, service ) {
	  var html = '' +
	    '<tr id="service_row_' + serviceName + '"' + ( service.accessToken? ' class="success"' : '' ) + '>' +
	      '<td>' + serviceName + '</td>' +
	      '<td>' + service.desc + '</td>' +
	      '<td>' + listSynclets( serviceName, service )  + '</td>' +
	      '<td class="access-token">' + ( service.accessToken? 'Y' : 'N' ) + '</td>';

	      var authUrl = 'https://api.singly.com/oauth/authorize?' +
										'client_id=f011409415c67030f676f11de7783aee&' +
										'service=' + serviceName + '&' +
										'redirect_uri=' + encodeURI( options.appUrl + '?service=' + serviceName ) + '&response_type=token';
				html +=
	      '<td class="re-auth"><a href="' + authUrl + '">Re-authorize</a></td>' +  
	    '</tr>';
	  var tr = $( html );
	  $( options.services ).append( tr );
	}

	function listSynclets( serviceName, service ) {
		var html = '<ul>';
		var synclet;
		for( var i = 0, l = service.synclets.length; i < l; ++i ) {
			synclet = service.synclets[ i ];
			html += '<li>' +
			'<span class="synclet-name">' + synclet.name + '</span>' +
			'<input data-service-name="' + serviceName + '" ' +
						 'data-synclet-index="' + i + '" ' +
				 		 'type="checkbox" ' + ( synclet.subscribed? 'checked="checked"' : '' ) + '/>' +
			'</li>';
		}
		html += '</ul>'

		return html;
	}

	function updateService( serviceName, service ) {
		var row = $( options.services + ' #service_row_' + serviceName );
		if( service.accessToken ) {
			row.addClass( 'success' );
			row.find( 'td.access-token' ).text( 'Y' );
		}
		else {
			row.removeClass( 'success' );
			row.find( 'td.access-token' ).text( 'N' );
		}
	}

	function logUpdate( data, className ) {
		var el = $( '<pre>' );
		el.addClass( className );
		el.text( JSON.stringify( data, null, 2 ) );
		el.hide();
		$( options.updates ).prepend( el );
		el.slideDown();
	}

	window.view = {
		displayServices: displayServices,
		alert: window.alert,
		logUpdate: logUpdate,
		updateService: updateService,
		onSubscriptionToggle: null
	};

} )( window,
		 jQuery,
		{
			services: '#service_list',
			updates: '#updates'
		} );