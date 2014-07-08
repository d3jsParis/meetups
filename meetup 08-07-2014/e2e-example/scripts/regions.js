
(function () {

var centered
  , margin = {top: 40, right: 120, bottom: 30, left: 50}
  , width = 690 - margin.left - margin.right
  , height = 600 - margin.top - margin.bottom
  , factor = 0.5
  , mapColors = ['#FCC5C0','#FA9FB5','#F768A1', '#7A0177']
  , svg;


// Create SVG
svg = d3.select('.map').append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom);

// CHARGEMENT DU FOND DE CARTE
d3.json('data/regions.json', function(france) {
// CHARGEMENT DES DONNEES DE CARTO
  d3.csv('data/regions-data.csv', function (data) {
// FORMATTAGE DES DONNEES
    var entries = d3.keys(data[0]).filter(function(key) { return key !== 'date'; });
    data.forEach(function (d) {
      entries.forEach(function(e) {
			// PARSE FLOAT
        d[e] = +d[e];
      });
    });

    var map = new France({ width: width
                         , height: height
                         , parent: svg
                         , colors: mapColors
                         , group: entries
                         , geoData: france
                         , data: data})
    map.init()
      .show()
      .addLegend();


  });
});



})();
