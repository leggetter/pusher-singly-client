( function ( exports, Modernizr ) {

	var storage = null;
	if ( Modernizr.localstorage ) {
		storage = {
			getItem: function( name ) {
				var value = localStorage.getItem( name );
				var obj;
				if( value ) {
					try {
						value = JSON.parse( value );
					}
					catch( e ) { }
				}
				return value;
			},
			setItem: function( name, value ) {
				if( value ) {
					try {
						value = JSON.stringify( value );
					}
					catch( e ) { }
				}
				localStorage.setItem( name, value );
			}
		}; 
	}
	else {
		storage = {
			_hash: {},
			getItem: function( name ) {
				return this._hash[ name ] || null;
			},
			setItem: function( name, value ) {
				this._hash[ name ] = value;
			}
		};
	}

	exports.storage = storage;

})( window, Modernizr );