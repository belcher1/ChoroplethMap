let height = 600;
let width = 950;

let svg = d3.select('svg')
            .attr('height', height)
            .attr('width', width);

let data = d3.geoPath(); 

// Color Scale
var colorScale = d3.scaleThreshold()
                    .domain([10, 20, 30, 40, 50, 60])
                    .range(d3.schemeBlues[7]);

let counties_json = 
'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json';
let education_json = 
'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json';

// Tooltip
let tooltip = d3.select('#us-map')
.append('div')
.attr("class", "tooltip")
.attr('id', 'tooltip')
.style("opacity", 0)
.style("background-color", "white")
.style("border", "solid")
.style("border-width", "2px")
.style("border-radius", "5px")
.style("padding", "5px");

d3.queue()
  .defer(d3.json, counties_json)
  .defer(d3.json, education_json)
  .await(ready);

function ready(error, data_count, data_edu) {

  console.log(data_count);
  console.log(data_edu);

  // var mouseover = function(d) {
  //   tooltip.style("opacity", 1)
  //   .style("left", (d3.mouse(this)[0]) + "px")
  //   .style("top", (d3.mouse(this)[1]) + "px")
  //   .html('hi')
  // }
  var mouseleave = function(d) {
    tooltip.style("opacity", 0);
  } 
  
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
      .on("mouseover", function(d) {
        let data = d;
        tooltip.style("opacity", 1)
                .html('hi')
                .attr('data-education', function(d) {
                  // console.log(data);
                  let county = data_edu.find(obj => {
                    return obj.fips == data.id;
                  })
                  if(county) {
                    // console.log(county['bachelorsOrHigher']);
                    return county['bachelorsOrHigher'];
                  }
                })
                .style("left", (d3.mouse(this)[0]) + "px")
                .style("top", (d3.mouse(this)[1]) + "px")
                
      })
      // .on("mousemove", function(d) {


      //   tooltip.style("left", (d3.mouse(this)[0]) + "px")
      //           .style("top", (d3.mouse(this)[1]) + "px")
      //           .html('Movie: ') 
      //           .attr('data-education', '') 
      // })
      .on("mouseleave", mouseleave)
}

// Legend
let legend = d3.select('#legend') 
                .append('svg')
                .attr('height', 60)
                .attr('width', width)
                .attr('id', 'legend')

legend.selectAll('rect')
      .data(d3.schemeBlues[7])
      .enter()
      .append('rect')
      .attr('x', function(d, i) {return 300 + i * 50;})
      .attr('y', 20)
      .attr('width', 50)
      .attr('height', 20)
      .attr('fill', function(d) {return d;})

let points = ['00%','10%','20%','30%', '40%', '50%', '60%'];

legend.selectAll('text')
      .data(points)
      .enter()
      .append('text')
      .attr('x', function(d, i) {return 290 + i * 50;})
      .attr('y', 55)
      .text(function(d) {return d;})