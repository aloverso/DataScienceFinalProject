var mapVisualization = function() {
  var width = 600;
  var height = 500;

  var projection = d3.geo.mercator()
    .translate([300, 300])
    .scale(100);

  var path = d3.geo.path()
    .projection(projection);

  var svg = d3.select(".map").append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("class", "map");

  var g = svg.append("g");
  
  queue()
    .defer(d3.json, "https://raw.githubusercontent.com/mbostock/topojson/master/examples/world-110m.json")
    .defer(d3.tsv, "https://raw.githubusercontent.com/KoGor/Maps.GeoInfo/master/world-country-names.tsv")
    .await(ready);
  
  function ready (error, world, names) {
    var countries = topojson.object(world, world.objects.countries).geometries;
    var i = -1;
    var n = countries.length;

    countries.forEach(function(d) {
      var filtered = names.filter(function(n) { return d.id == n.id; });
      if (filtered[0] != undefined) {
        d.name = filtered[0].name;
      }
    });

    var country = svg.selectAll(".country").data(countries);
    country.enter()
      .insert("path")
      .attr("class", "country")
      .attr("title", function(d,i) { return d.name; })
      .attr("d", path);
    
    svg.append("text")
    .attr("class", "regionName")
    .attr("text-anchor", "end")
    .attr("x", width)
    .attr("y", height-30)
    .text("");
  }
}
