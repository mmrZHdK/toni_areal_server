console.log( '--- Start ToniGraph Installation ---' );

window.ToniGraph = ( function() {
  
  var graph = [
    [301,302],
    [301,313],
    [302,303],
    [302,314],
    [302,401],
    [303,304],
    [304,305],
    [304,312],
    [304,315],
    [305,306],
    [305,311],
    [306,307],
    [306,316],
    [307,308],
    [307,410],
    [308,309],
    [308,317],
    [309,310],
    [310,311],
    [311,312],
    [312,313],
    [314,315],
    [315,316],
    [316,317],
    [401,418],
    [402,403],
    [402,416],
    [402,417],
    [402,418],
    [403,404],
    [404,405],
    [405,406],
    [405,417],
    [406,407],
    [407,408],
    [408,409],
    [409,417],
    [410,411],
    [411,412],
    [412,413],
    [413,414],
    [413,417],
    [414,415],
    [414,416],
    [418,419],
    [419,426],
    [419,428],
    [419,430],
    [426,427],
    [427,428],
    [428,429],
    [429,430]
  ]; //private
  
  return { //exposed to public
    
    gibNachbarn: function( inKnoten ) {
      
      var nachbarn = [];
      graph.forEach( function( edge ) {
        if ( edge[ 0 ] === inKnoten ) {
          nachbarn.push( edge[ 1 ] );
        }
        if ( edge[ 1 ] === inKnoten ) {
          nachbarn.push( edge[ 0 ] );
        }
      } );
      return nachbarn;
    }
  }
} () );

console.log( 'ready?:' + ( window.ToniGraph !== undefined ) );
console.log( '--- End ToniGraph Installation ---' );
