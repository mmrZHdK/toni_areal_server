console.log( '--- Start BeaconManager Installation ---' );

window.BeaconManager = ( function() {
    var beaconArray = []; //private
    var eventListeners = [];
    
    return { //exposed to public
      
      updateBeacons: function( inBeaconArray ) {
        beaconArray = inBeaconArray;
        
        // informiere Listeners
        eventListeners.forEach( function( inListener ) {
          if ( inListener[ 0 ] === 'update' ) {
            inListener[ 1 ].call( null, beaconArray );
          }
        });
      },
      
      getBeaconArray: function() {
        return beaconArray;
      },
      
      addEventListener: function ( inEvent, inCallback ) {
        eventListeners.push( [ inEvent, inCallback ] );
      }
    }
}());

console.log( 'ready?:' + ( window.BeaconManager !== undefined ) );
console.log( '--- End BeaconManager Installation ---' );
