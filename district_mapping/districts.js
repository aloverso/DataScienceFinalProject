var mapVisualization = function() {
  var width = 500;
  var height = 600;
  
  var colors = ["#fcfbfd","#efedf5","#dadaeb","#bcbddc","#9e9ac8","#807dba","#6a51a3","#54278f","#3f007d"];
  var buckets = 9;

  var projection = d3.geo.mercator()
    .translate([1200, 700])
    .scale(600);

  var path = d3.geo.path()
    .projection(projection);

  var svg = d3.select(".map").append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("class", "map");

  var g = svg.append("g");
  
  queue()
    .defer(d3.json, "https://raw.githubusercontent.com/dinopants174/DataScienceFinalProject/master/district_maps/districts100.json")
    .defer(d3.json, "https://raw.githubusercontent.com/dinopants174/DataScienceFinalProject/district-mapping/district_mapping/reps-by-district.json")
    .await(ready);
  
  var maxOfficeTime = 0;
  
  function ready (error, counties, names) {
    var districts = topojson.object(counties, counties.objects.out).geometries;
    
    districts.forEach(function(d) {
      filter = names['table'][100][d.properties.state];
      if (filter != undefined) {
        filter = filter[d.properties.district];
        if (filter != undefined) {
          d.properties.names = [];
          d.properties.ids = [];
          d.properties.incumbencies = [];
          filter.forEach(function(f) {
            d.properties.names.push(f[0]);
            d.properties.ids.push(f[1]);
            d.properties.incumbencies.push(f[2]);
            if (f[2] > maxOfficeTime) {
              maxOfficeTime = f[2];
            }
        });
        }
      }
    });
    
    var colorScale = d3.scale.quantile()
              .domain([0, buckets - 1, maxOfficeTime])
              .range(colors);

    var county = svg.selectAll(".districts").data(districts);
    county.enter()
      .insert("path")
      .attr("state", function(d,i) { return d.properties.state; })
      .attr("dist", function(d,i) { return d.properties.district; })
      .attr("names", function(d,i) { return d.properties.names; })
      .attr("inc", function(d, i) { return d.properties.incumbencies; })
      .attr("maxinc", function(d,i) { return Math.max(d.properties.incumbencies); })
      .style("fill", function(d) { return colorScale( Math.max(d.properties.incumbencies) ); })
      .attr("class", function(d, i) {
        if (d.properties.names == undefined) {
          return "district no-rep";
        }
        return "district";
      })
      .attr("onmouseover", function(d) { return "highlight(\""+d.properties.state+"\", \""+d.properties.district+"\")"; })
      .attr("onmouseout", function(d) {
        return "unhighlight(\""+d.properties.state+"\", \""+d.properties.district+"\", \""+colorScale(Math.max(d.properties.incumbencies))+"\")"; })
      .attr("d", path);
    
    svg.append("text")
    .attr("class", "regionName")
    .attr("text-anchor", "end")
    .attr("x", width)
    .attr("y", height-30)
    .text("");
  }
}
