var projection = d3.geoMercator()
  .scale(400)
  .translate([200, 280])
  .center([0, 5]);

var geoGenerator = d3.geoPath()
  .projection(projection);

function update(geojson) {
    var u = d3.select('#australia g.map')
      .selectAll('path')
      .data(geojson.features);
  
    u.enter()
      .append('path')
      .attr('d', geoGenerator)
      // .on('mouseover', handleMouseover);
}

// REQUEST DATA
d3.json('africa.json', function(err, json) {
    update(json);
})
