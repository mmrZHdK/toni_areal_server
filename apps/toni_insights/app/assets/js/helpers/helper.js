module.exports = {
  generateSize: function() {
    var randW = Math.floor(Math.random() * (3-1)) + 1;
    var randH = Math.floor(Math.random() * (3-1)) + 1;

    if (randH > 1) {
      randW = 2;
    }

    return {
      width: 25*randW + '%',
      height: 25*randH + 'vw'
    }
  }
}
