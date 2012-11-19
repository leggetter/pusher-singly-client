# Pusher Singly Client example

If you are just running the Pusher streamer service as part of hallway and you want to use the
Singly cloud service as the API you'll need to expose the Pusher streamer server using something
like [localtunnel](http://progrium.com/localtunnel/).

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

See: https://github.com/leggetter/hallway