var circles = function () {
  // TIMECUBEDATA is the data source for this visualization
  //$.getJSON('https://raw.githubusercontent.com/dinopants174/DataScienceFinalProject/master/timecubedata.json', function(json) {
  queue().defer(d3.json, 'https://raw.githubusercontent.com/dinopants174/DataScienceFinalProject/master/timecubedata.json').await( function (err, json) {

    // get the starting year of a session
    function sessionyears(session) {
      return 1789 + 2*(+session-1);
    }

    // map parties to colors
    var partycolors = {
      "Adams":"rgba(175,105,51,.6)",
      "American":"rgba(116,18,79,.6)",
      "Anti Jacksonian":"rgba(111,0,115,.6)",
      "Anti Masonic":"rgba(236,0,72,.6)",
      "Anti-Administration":"rgba(216,216,0,.6)",
      "Democrat":"rgba(0,0,100,.6)",
      "Federalist":"rgba(100,100,0,.6)",
      "Ind. Republican-Democrat":"rgba(255,174,17,.6)",
      "Jackson":"rgba(97,156,49,.6)",
      "Populist":"rgba(203,245,103,.6)",
      "Pro-Administration":"rgba(162,51,75,.6)",
      "Republican":"rgba(100,0,0,.6)",
      "Unionist":"rgba(37,116,90,.6)",
      "Whig":"rgba(0,100,0,.6)",
      "None":"rgba(0,0,0,0)"
    }

  
   var margin = {top: 200, right: 20, bottom: 50, left: 200},
      width = $(window).width() - margin.right - .333*$(window).width(),
      height = $(window).height() - margin.top - margin.bottom;

    
    var nb_points = 5; // max number of parties

    dragit.time = {min: 0, max: 113, step: 1, current: 1};
    
    dragit.time.current = 112;
    
    var timecube = d3.range(nb_points).map(function(d, i) {
            return d3.range(dragit.time.max).map(function(e, j) { 
                if (i < json[e+1].length) {
                  var vals = json[e+1][i]['vals'];
                  return {'party':json[e+1][i]['party'], 't': j, 'num': vals.num, 'unification': vals.unification, 'majority':vals.majority};
                }
                // doesn't exist
                else {
                  return {'party':'None', 't': j, 'num': 0, 'unification': 0.0, 'majority':0.0};
                }
        });
    })

    var radius = width/10; // radius of 2 major parties circles
    var sradius = width/40; // radius of smaller parties circles
    var dur = 500; // duration of transition

    //var dist = json["1"][0].vals.num + json["1"][1].vals.num;
    var dist = radius*2; // distance between centers (initial)

    var s = sradius + 20; // x and y of smaller circles
    var lx = 2*s + radius*2 + 100; // x coordinate, center of larger circles
    var ly = height - radius*2; // y coordinate, larger circles

    // create svg
    var svg = d3.select("#maincircles")
        .append("svg")
        .attr({width: width, height: height})

    // lg are the linear gradients that define the fill percent of the circles
    var grad = svg.append("defs")
      .selectAll("lg")
      .data(timecube).enter().append("linearGradient")
      .attr("class", "lg")
      .attr("id", function(d,i) {
          return "grad"+i;
      })
      .attr("x1", "0%")
      .attr("x2", "0%")
      .attr("y1", "100%")
      .attr("y2", "0%")
      .append("stop")
      .attr("class","realstop")
      .attr("offset", function(d) {
          return (100*d[0].unification)+"%";
      })
      .style("stop-color", function(d,i) {
          if (d[dragit.time.current].party != "None") {
            return partycolors[d[dragit.time.current].party];
          }
          else {
            return "rgba(0,0,0,0)";
          }
      });

    // lg2 are linear gradients that are always 100%, define background color of circles
    var grad2 = svg.select("defs")
      .selectAll("lg2")
      .data(timecube).enter().append("linearGradient")
      .attr("class", "lg")
      .attr("id", function(d,i) {
          return "grad2"+i;
      })
      .attr("x1", "0%")
      .attr("x2", "0%")
      .attr("y1", "100%")
      .attr("y2", "0%")
      .append("stop")
      .attr("class","backcolor")
      .attr("offset", "100%")
      .style("stop-color", function(d) {
          if (d[dragit.time.current].party != "None") {
            return partycolors[d[dragit.time.current].party];
          }
          else {
            return "rgba(0,0,0,0)";
          }
      });

    // if the fill isn't 100% it needs to have a stop component
    svg.select("defs").selectAll(".lg")
        .append("stop")
        .attr("offset", "0%")
        .style("stop-color", "rgba(0, 0, 0, 0.0)");

    // "points" are the actual background circles themselves
    var gPoints = svg.selectAll(".points")
        .data(timecube)
        .enter()
        .append("circle")
        .call(dragit.object.activate)
        .attr('r',function(d,i) {
          if (i>=2) {
            return sradius;
          }
          return radius;
        })
        .attr('fill', function(d,i) {
              return "url(#grad2"+i+")";
          })
        .attr('cx', function(d,i) {
          if (i===0) {
            return lx - (1-d[dragit.time.current].majority)*dist/2;;
          }
          else if (i===1) {
              return lx + (1-d[dragit.time.current].majority)*dist/2;
          }
          else {
            return s;
          }
        })
        .attr('cy', function(d,i) {
          if (i>=2) {
            return s+((i-2)*(sradius*2 + 10));
          }
          else {
            return ly;
          }
        })
        .style('opacity',.5)
        .attr("class", "points");

        // fillcircle is the fill of the circle, party unification measure
         var circles = svg.selectAll(".fillcircle")
            .data(timecube)
            .enter()
            .append("circle");
        circles.attr('cx', function(d,i) {
            if (i===0) {
            return lx - (1-d[dragit.time.current].majority)*dist/2;;
            }
            else if (i===1) {
                return lx + (1-d[dragit.time.current].majority)*dist/2;
            }
            else {
              return s;
            }
          })
         .attr("cy", function(d,i) {
            if (i>=2) {
              return s+((i-2)*(sradius*2+10));
            }
            else {
              return ly;
            }
          })
         .attr('r',function(d,i) {
          if (i>=2) {
            return sradius;
          }
          return radius;
        })
         .attr("fill", function(d,i) {
              return "url(#grad"+i+")";
          })
         .attr('class','fillcircle');

    // large label of what year it is
    svg.selectAll('#yearlabel')
      .data([1])
      .enter().append('text')
      .text(function(d,i) {
        return sessionyears(dragit.time.current+1)
      })
      .attr('x',lx-radius)
      .attr('y',ly-radius-80)
      .style('font-family','serif')
      .style('font-size','150px')
      .style('font-weight','bold')
      .style('fill','#aaaaaa')
      .attr('opacity','.6')
      .attr('id','yearlabel');

    // label the names of the parties
    svg.selectAll('.partylabels')
      .data(timecube)
      .enter().append('text')
      .text(function(d,i) {
        console.log(d[dragit.time.current].party);
        if (d[dragit.time.current].party != 'None') {
          return d[dragit.time.current].party;
        }
      })
      .attr('x',function(d,i) {
        if (i>=2) {
          return s + sradius + 20;
        } else {
          if (i===0) {
            return lx - radius;
          } else {
            return lx + radius;
          }
        }
      })
      .attr('y',function(d,i) {
        if (i>=2) {
          return s+((i-2)*(sradius*2+10));
        } else {
          return ly + radius + 40;
        }
      })
      .style('font-family','Lato')
      .style('text-anchor',function(d,i) {
        if (i>=2) {
          return 'left';
        } else {
          return 'middle';
        }
      })
      .style('font-size',function(d,i) {
        if (i>=2) {
          return "16px";
        } else {
          return '26px';
        }
      })
      .style('font-weight','bold')
      .style('fill','#555555')
      .attr('opacity','.8')
      .attr('class','partylabel');

    // update function for dragit
    function update(v, t) {
        dragit.time.current = v || dragit.time.current;
        console.log(dragit.time.current);
        if (dragit.time.current >= 113) {
          dragit.time.current = 112;
        }

            var time = parseInt(dragit.time.current) + 1;
            dist = radius*2;

            // dist = json[dragit.time.current+1][0].vals.num + json[dragit.time.current+1][1].vals.num;

            // update the x coordinates of the circles based on majority agreement
            svg.selectAll('.fillcircle').transition().duration(dur).ease('linear')
              // .attr('r',function(d) {
              //     //console.log(d[dragit.time.current].num);
              //     return d[dragit.time.current].num;
              // })
              .attr('cx', function(d,i) {
                if (i===0) {
                  return lx - (1-d[time].majority)*dist/2;;
                }
                else if (i===1) {
                    return lx + (1-d[time].majority)*dist/2;
                }
                else {
                  return s;
                }
              })
              // hide all circles that aren't for this party list
              .each('end', function() {
                 d3.select(this)
                 .transition()
                 .style('display', function(d) {
                  if (d[time].party === 'None') {
                    return "none";
                  }
                  else {
                    return 'block';
                  }
                  });
               });

            // update x coor of circles backgrounds in the same way
            svg.selectAll('.points')
              .transition().duration(dur).ease('linear')
               .attr('cx', function(d,i) {
                if (i===0) { 
                  return lx - (1-d[time].majority)*dist/2;;
                }
                else if (i===1) {
                  return lx + (1-d[time].majority)*dist/2;
                }
                else {
                  return s;
                }
              })
              .style('stroke',function(d,i) {
                  if (i<2) {
                    return partycolors[d[dragit.time.current].party];
                  } else {
                    return 'rgba(0,0,0,0)';
                  }
               })
               .style('stroke-width',function(d,i) {
                if (i<2) {
                  if (i===0 && json[dragit.time.current][i].vals.num > json[dragit.time.current][1].vals.num) {
                    return '10px';
                  } else if (i===1 && json[dragit.time.current][i].vals.num > json[dragit.time.current][0].vals.num)
                  return '10px';
                } else {
                  return '0px';
                }
               })
               .each('end', function() {
                 d3.select(this)
                 .transition()
                 .style('display', function(d) {
                  if (d[time].party === 'None') {
                    return "none";
                  }
                  else {
                    return 'block';
                  }
                  });
               });                    

            // UPDATE THE LINEAR GRADIENT
            svg.selectAll('.realstop').transition().duration(dur).ease('linear')
              .attr("offset", function(d) {
                return (100*d[time].unification)+"%";
              })
              .style("stop-color", function(d) {
                  return partycolors[d[time].party];
              });

            // change background color for new parties
            svg.selectAll('.backcolor').transition().duration(dur).ease('linear')
              .style("stop-color", function(d) {
                  return partycolors[d[time].party];
              });

              // update year label
              svg.selectAll('#yearlabel').transition().duration(dur).ease('linear')
              .text(function(d) {
                return sessionyears(time);
              });

              // update parties labels
              svg.selectAll('.partylabel').transition().duration(dur).ease('linear')
                .text(function(d,i) {
                  if (d[time].party != 'None') {
                    return d[time].party;
                    } else {
                      return '';
                    }
                  });
    }

    // initialize for dragit
    function init() {
      dragit.init("svg");
      dragit.data = timecube;
      
      dragit.evt.register("update", update);
      dragit.playback.loop = true;
      dragit.playback.speed =  dur;
      dragit.utils.slider("#slidercircles", true);

      // change the bounds on slider to years, not sessions
      // d3.select('.max-time').html("2013");
      // d3.select('.min-time').html("1789");
    }
    
    init();

  });
};
