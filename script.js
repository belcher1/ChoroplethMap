let countiesURL = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json";
let educationURL = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json";

let countiesData;
let educationData;

let svg = d3.select('svg');

let path = d3.geoPath();

var x = d3.scaleLinear().domain([2.6, 75.1]).rangeRound([600, 860]);

var color = d3
  .scaleThreshold()
  .domain(d3.range(2.6, 75.1, (75.1 - 2.6) / 8))
  .range(d3.schemeGreens[9]);

var g = svg;

Promise.all([d3.json(countiesURL), d3.json(educationURL)])
  .then((data) => ready(data[0], data[1]))
  .catch((err) => console.log(err));

function ready(us, education) {
    svg
    .append('g')
    .attr('class', 'counties')
    .selectAll('path')
    .data(topojson.feature(us, us.objects.counties).features)
    .enter()
    .append('path')
    .attr('class', 'county')
    .attr('data-fips', function (d) {
        return d.id;
    })
    .attr('data-education', function (d) {
        var result = education.filter(function (obj) {
        return obj.fips === d.id;
        });
        if (result[0]) {
        return result[0].bachelorsOrHigher;
        }
        // could not find a matching fips id in the data
        console.log('could find data for: ', d.id);
        return 0;
    })
    .attr('fill', function (d) {
        var result = education.filter(function (obj) {
        return obj.fips === d.id;
        });
        if (result[0]) {
        return color(result[0].bachelorsOrHigher);
        }
        // could not find a matching fips id in the data
        return color(0);
    })
    .attr('d', path)

    svg
    .append('path')
    .datum(
        topojson.mesh(us, us.objects.states, function (a, b) {
        return a !== b;
        })
    )
    .attr('class', 'states')
    .attr('d', path);
}

// let createMap = () => {
//     console.log('test');

//     let path = d3.geoPath();

//     svg.append('g')
//         .selectAll('path')
//         .data(countiesData)
//         .enter()
//         .append('path')
//         .attr('d', path)
//         // .attr('class', 'county')
//         // .attr('fill', 'black')
// };

