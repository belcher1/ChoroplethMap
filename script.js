let height = 600;
let width = 950;

let svg = d3.select('svg')
            .attr('height', height)
            .attr('width', width);

let data = d3.geoPath(); 

// Color Scale
var colorScale = d3.scaleThreshold()
                    .domain([1, 10, 20, 30, 40, 50])
                    .range(d3.schemeBlues[7]);

let counties_json = 
'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json';
let education_json = 
'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json';

d3.queue()
  .defer(d3.json, counties_json)
  .defer(d3.json, education_json)
  .await(ready);

function ready(error, data_count, data_edu) {

  console.log(data_count);
  console.log(data_edu);
  
  svg.append("g")
      .selectAll("path")
      .data(topojson.feature(data_count, data_count.objects.counties).features)
      .enter()
      .append("path")
      .attr("class", "county")
      .attr("d", data)
      .attr("fill", function(d) {
        // console.log(d.id);

        let county = data_edu.find(obj => {
          return obj.fips == d.id;
        })

        // console.log(county);

        return colorScale(county['bachelorsOrHigher']);
      })
      .attr('data-fips', function(d) {return d.id;}) //console.log(d);})
      .attr('data-education', function(d) {
        let county = data_edu.find(obj => {
          return obj.fips == d.id;
        })

        return county['bachelorsOrHigher'];
      })
}