# Pusher Singly Client example

* The simplest example can be found in `public/simple.html`.
* A more complex example that lets you subscribe to all Singly supported services can be found in `public/index.html`.

## Usage

	<script src="http://js.pusher.com/1.12/pusher.min.js"></script>
	<script src="/path/to/pusher-singly/base64.js"></script>
	<script src="/path/to/pusher-singly/pusher-singly.js"></script>
	<script>
		var pusher = new Pusher( YOUR_APP_KEY );
		var singly = new PusherSingly( pusher );
		var channel = singly.subscribe( {
			path: '/services/twitter/self',
			token: TWITTER_ACCESS_TOKEN
		} );
		channel.bind( 'singly:data_received', function( data ) {
			// handle update
		});
	</script>

## Using with Hallway

If you are just running the Pusher streamer service as part of hallway ([Singly repo](https://github.com/Singly/hallway), [Pusher modified repo](https://github.com/leggetter/hallway)) and you want to use the Singly cloud service as the API you'll need to expose the Pusher streamer server using something like [localtunnel](http://progrium.com/localtunnel/).

Because of this the client supplies a way of dynamically setting the WebHook endpoint for the
Singly Push API. As part of the `singly.subscribe` call you can pass a `webhook` options.

    var pusher = new Pusher( '94a30c48931d62ed5ebf', { encrypted: true } );
  	var singly = new PusherSingly( pusher );
  	var channel = singly.subscribe( {
  		path: '/services/twitter/self',
  		token: accessToken,
  		webhook: 'http://something.localtunnel.com'
  	} );

The value of the `webhook` needs to match the one presently running with localtunnel.

## Singly hallway Pusher streamer

The version of hallway linked below has been modified to:

1. have a `pusherStreamer` class
2. Support running standalone without hallway using `scripts/pusher-standalone.js`

See: https://github.com/leggetter/hallway

## Running Examples

* [Simple example](http://pusher-singly-client.herokuapp.com/simple.html)
* [Advanced example](http://pusher-singly-client.herokuapp.com/)