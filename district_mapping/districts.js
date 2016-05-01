var mapVisualization = function() {
  var width = 500;
  var height = 600;

  var projection = d3.geo.mercator()
    .translate([1700, 700])
    .scale(600);

  var path = d3.geo.path()
    .projection(projection);

  var svg = d3.select(".map").append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("class", "map");

  var g = svg.append("g");
  
  queue()
    .defer(d3.json, "https://raw.githubusercontent.com/dinopants174/DataScienceFinalProject/master/district_maps/districts060.json")
    .defer(d3.json, "https://raw.githubusercontent.com/dinopants174/DataScienceFinalProject/district-mapping/district_mapping/reps-by-district.json")
    .await(ready);
  
  function ready (error, counties, names) {
    var counties = topojson.object(counties, counties.objects.out).geometries;
    
    counties.forEach(function(d) {
      filter = names['table'][17][d.properties.state];
      if (filter != undefined) {
        filter = filter[d.properties.district];
        if (filter != undefined) {
          d.properties.names = [];
          d.properties.ids = [];
          filter.forEach(function(f) {
            d.properties.names.push(f[0]);
            d.properties.ids.push(f[1]);
            console.log(f[2]);
        });
        }
      }
    });

    var county = svg.selectAll(".county").data(counties);
    county.enter()
      .insert("path")
      //.attr("class", "county")
      .attr("state", function(d,i) { return d.properties.state; })
      .attr("dist", function(d,i) { return d.properties.district; })
      .attr("names", function(d,i) { return d.properties.names; })
      .attr("class", function(d, i) {
        if (d.properties.names == undefined) {
          return "county no-rep";
        }
        return "county";
      })
      .attr("d", path);
    
    /*svg.append("text")']
    .attr("class", "regionName")
    .attr("text-anchor", "end")
    .attr("x", width)
    .attr("y", height-30)
    .text("");*/
  }
}
