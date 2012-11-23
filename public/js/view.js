( function( exports, $, options ) {

	function displayServices( services ) {
		for( var serviceName in services ) {
	    appendService( serviceName, services[ serviceName ] );
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
	    '<tr id="service_row_' + serviceName + '" class="service-row' + ( service.accessToken? ' success' : '' ) + '">' +
	    	'<td class="service-img"><img src="http://assets.singly.com/service-icons/32px/' + serviceName + '.png" height="32" width="32" /></td>' +
	      '<td class="service-name">' +serviceName + '</td>' +
	      '<td>' + service.desc + '</td>' +
	      '<td class="synclet-list">' + listSynclets( serviceName, service )  + '</td>' +
	      '<td class="access-token">' +
	      	'<span class="icon-ok" title="Authorized"></span>' +
	      	'<span class="icon-off" title="Not authorized"></span>';

	      var authUrl = 'https://api.singly.com/oauth/authorize?' +
										'client_id=f011409415c67030f676f11de7783aee&' +
										'service=' + serviceName + '&' +
										'redirect_uri=' + encodeURIComponent( options.appUrl + '?service=' + serviceName ) +
										'&response_type=token';

				html += '<a class="icon-repeat" href="' + authUrl + '" title="Re-authorize"></a>' + 
	      '</td>';

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
		onSubscriptionToggle: null
	};

} )( window,
		 jQuery,
		{
			services: '#service_list',
			updates: '#updates'
		} );