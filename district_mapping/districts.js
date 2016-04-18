var mapVisualization = function() {
  var width = 500;
  var height = 600;

  var projection = d3.geo.mercator()
    .translate([1100, 700])
    .scale(600);

  var path = d3.geo.path()
    .projection(projection);

  var svg = d3.select(".map").append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("class", "map");

  var g = svg.append("g");
  
  queue()
    .defer(d3.json, "https://raw.githubusercontent.com/dinopants174/DataScienceFinalProject/district-mapping/district_mapping/dist01.json")
    .defer(d3.json, "https://raw.githubusercontent.com/dinopants174/DataScienceFinalProject/district-mapping/district_mapping/reps-by-district.json")
    .await(ready);
  
  function ready (error, counties, names) {
    var counties = topojson.object(counties, counties.objects.out).geometries;
    var i = -1;
    var n = counties.length;
    
    counties.forEach(function(d) {
      //console.log(names);
      //var filtered = names.filter(function(n) { return d.properties.state == n[1]; });
      console.log(names);
      d.name = names[1][d.properties.state][d.properties.district];
      console.log(d.name);
      /*
      if (filtered[0] != undefined) {
        d.name = filtered[0].name;
      }*/
    });

    var county = svg.selectAll(".county").data(counties);
    county.enter()
      .insert("path")
      .attr("class", "county")
      .attr("state", function(d,i) { return d.properties.state; })
      .attr("dist", function(d,i) { return d.properties.district; })
      /*.attr("names", function(d,i) { return */
      /*.attr("title", function(d,i) { return d.name; })*/
      .attr("d", path);
    
    /*svg.append("text")']
    .attr("class", "regionName")
    .attr("text-anchor", "end")
    .attr("x", width)
    .attr("y", height-30)
    .text("");*/
  }
}
