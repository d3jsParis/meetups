
(function () {

var centered
  , margin = {top: 40, right: 120, bottom: 30, left: 50}
  , width = 690 - margin.left - margin.right
  , height = 600 - margin.top - margin.bottom
  , svg;


// Create SVG
svg = d3.select('.map').append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom);

d3.json('data/regions.json', function(france) {
    var map = new France({ width: width
                         , height: height
                         , parent: svg
                         , geoData: france
                         })
    map.init()
      .show()


  });



})();
