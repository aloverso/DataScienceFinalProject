var mapVisualization = function() {

  var width = 600;
  var height = 570;
  var margin_bottom = 100;
  
  var colors = ["#fcfbfd","#efedf5","#dadaeb","#bcbddc","#9e9ac8","#807dba","#6a51a3","#54278f","#3f007d"];
  var buckets = 9;

  var projection = d3.geo.mercator()
    .translate([1300, 700])
    .scale(600);

  var path = d3.geo.path()
    .projection(projection);

  var svg = d3.select(".map").append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("class", "map");

  var g = svg.append("g");
  
  var maxOfficeTime = 0;
  
  d3.json("https://raw.githubusercontent.com/dinopants174/DataScienceFinalProject/gh-pages/data/district_maps/districts001.json", function(error, counties) {
    d3.json("https://raw.githubusercontent.com/dinopants174/DataScienceFinalProject/gh-pages/data/district_maps/reps-by-district.json", function(err2, names) {
    var nb_points = 50; // max number

    dragit.time = {min: 0, max: 113, step: 1, current: 1};
    dragit.time.current = 1;
    
    var timecube = d3.range(nb_points).map(function(d, i) {
      return d3.range(dragit.time.max).map(function(e, j) { 
      });
    })

    var districts = topojson.object(counties, counties.objects.out).geometries;
    
    districts.forEach(function(d) {
      filter = names['table'][112][d.properties.state];
      if (filter != undefined) {
        filter = filter[d.properties.district];
        if (filter != undefined) {
          d.properties.names = [];
          d.properties.ids = [];
          d.properties.incumbencies = [];
          d.properties.nameInc = [];
          filter.forEach(function(f) {
            d.properties.names.push(f[0]);
            var nameIncTemp = [f[0], f[2]];
            nameIncTemp.toString = function () { return "[\"" + this.join("\", \"") + "\"]"; }
            d.properties.nameInc.push(nameIncTemp);
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
      .attr("maxinc", function(d,i) { return Math.max(d.properties.incumbencies); })
      .style("fill", function(d) { return colorScale( Math.max(d.properties.incumbencies) ); })
      .attr("class", function(d, i) {
        if (d.properties.names == undefined) {
          return "district no-rep";
        }
        return "district";
      })
      .attr("id", function(d, i) {
        return "district" + 1;
      })
      .attr("onmouseover", function(d) {
        if (d.properties.nameInc != undefined) {
          d.properties.nameInc.toString = function () { return "[" + this.join(", ") + "]"; }
        }
        return "highlight(\"" + d.properties.state + "\", \"" + d.properties.district + "\", " +
          d.properties.nameInc + ")"; })
      .attr("onmouseout", function(d) {
        return "unhighlight(\"" + d.properties.state + "\", \"" + d.properties.district + "\", \"" +
          colorScale(Math.max(d.properties.incumbencies)) + "\")"; })
      .attr("d", path);
    
    svg.append("g")
      .attr("transform", "translate("+(width/2)+", "+(height-margin_bottom)+")")
      .append("text")
      .attr("class", "regionName")
      .attr("text-anchor", "middle")
      .text("");

    var prev1 = 1;
    var prev2 = 1;

    function update(v, t) {
      dragit.time.current = v || dragit.time.current;
      if (dragit.time.current >= 113) {
        dragit.time.current = 112;
      }

      var time = parseInt(dragit.time.current)+1;

      console.log(time);

      function pad(num, size) {
        var s = num+"";
        while (s.length < size) s = "0" + s;
        return s;
      }

      var t = pad(time,3);

      var p2 = "https://raw.githubusercontent.com/dinopants174/DataScienceFinalProject/gh-pages/data/district_maps/districts"+pad(prev1,3)+".json";
      var p = "https://raw.githubusercontent.com/dinopants174/DataScienceFinalProject/gh-pages/data/district_maps/districts"+t+".json";

      d3.json(p, function(error, json) {
          if (error) return console.warn(error);
          var districts = topojson.object(json, json.objects.out).geometries;

          districts.forEach(function(d) {
            filter = names['table'][time-1][d.properties.state];
            if (filter != undefined) {
              filter = filter[d.properties.district];
              if (filter != undefined) {
                d.properties.names = [];
                d.properties.ids = [];
                d.properties.incumbencies = [];
                d.properties.nameInc = [];
                filter.forEach(function(f) {
                  d.properties.names.push(f[0]);
                  var nameIncTemp = [f[0], f[2]];
                  nameIncTemp.toString = function () { return "[\"" + this.join("\", \"") + "\"]"; }
                  d.properties.nameInc.push(nameIncTemp);
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
            .attr("maxinc", function(d,i) { return Math.max(d.properties.incumbencies); })
            .style("fill", function(d) { return colorScale( Math.max(d.properties.incumbencies) ); })
            .attr("class", function(d, i) {
              if (d.properties.names == undefined) {
                return "district no-rep";
              }
              return "district";
            })
            .attr("id", function(d, i) {
              return "district" + prev1;
            })
            .attr("onmouseover", function(d) {
              if (d.properties.nameInc != undefined) {
                d.properties.nameInc.toString = function () { return "[" + this.join(", ") + "]"; }
              }
              return "highlight(\"" + d.properties.state + "\", \"" + d.properties.district + "\", " +
                d.properties.nameInc + ")"; })
            .attr("onmouseout", function(d) {
              return "unhighlight(\"" + d.properties.state + "\", \"" + d.properties.district + "\", \"" +
                colorScale(Math.max(d.properties.incumbencies)) + "\")"; })
            .attr("d", path);
      });

      svg.selectAll('#district' + prev1).transition().duration(500).ease('linear')
      .remove();

      svg.selectAll('#district' + prev2).remove();

      prev2 = prev1;
      prev1 = time;

    }

    function init() {
      dragit.init("svg");
      dragit.data = names;
      dragit.evt.register("update", update);
      dragit.playback.loop = true;
      dragit.playback.speed =  500;
      dragit.utils.slider("#sliderdistricts", true);

      d3.select('#max-time').html("2013");
      d3.select('#min-time').html("1789");
    }
  
    init();
  }); });
}
