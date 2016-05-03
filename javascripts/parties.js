var parties = function () {
  // get values list of an object
  Object.values = obj => Object.keys(obj).map(key =>  obj[key]);

  // given a value in an object, get the corresponding key
  Object.prototype.getKeyByValue = function( value ) {
    for( var prop in this ) {
      if( this.hasOwnProperty( prop ) ) {
        if( this[ prop ] === value )
          return prop;
      }
    }
  }

    // get the starting year for a session
    function sessionyears(session) {
      return 1789 + 2*(+session-1);
    }

    // colors for parties
    // major parties have colors, all "minor" parties are grey
    var partycolors = {
      "Adams":"rgba(175,105,51,.8)",
      "American":"rgba(116,18,79,.8)",
      "Anti Jacksonian":"rgba(111,0,115,.8)",
      "Anti Masonic":"rgba(236,0,72,.8)",
      "Anti-Administration":"rgba(216,216,0,.8)",
      "Democrat":"rgba(0,0,100,.8)",
      "Federalist":"rgba(100,100,0,.8)",
      "Ind. Republican-Democrat":"rgba(255,174,17,.8)",
      "Jackson":"rgba(97,156,49,.8)",
      "Populist":"rgba(203,245,103,.8)",
      "Pro-Administration":"rgba(162,51,75,.8)",
      "Republican":"rgba(100,0,0,.8)",
      "Unionist":"rgba(37,116,90,.8)",
      "Whig":"rgba(0,100,0,.8)",
      "NaN":"rgba(180,180,180,.8)",
      "None":"rgba(0,0,0,0)",

      'States Rights':"rgba(150,150,150,.8)", 'Adams Democrat':"rgba(150,150,150,.8)", 'Union':"rgba(150,150,150,.8)", 'Nullifier':"rgba(150,150,150,.8)", 'Ind. Democrat':"rgba(150,150,150,.8)", 'Liberty':"rgba(150,150,150,.8)", 'Conservative':"rgba(150,150,150,.8)", 'Constitutional Unionist':"rgba(150,150,150,.8)", 'Readjuster Democrat':"rgba(150,150,150,.8)", 'Progressive Republican':"rgba(150,150,150,.8)", 'Law and Order':"rgba(150,150,150,.8)", 'Progressive':"rgba(150,150,150,.8)", 'Crawford Republican':"rgba(150,150,150,.8)", 'Democratic Republican':"rgba(150,150,150,.8)", 'Independent':"rgba(150,150,150,.8)", 'Readjuster':"rgba(150,150,150,.8)", 'American Labor':"rgba(150,150,150,.8)", 'Jacksonian':"rgba(150,150,150,.8)", 'Jackson Republican':"rgba(150,150,150,.8)", 'Conservative Republican':"rgba(150,150,150,.8)", 'Union Labor':"rgba(150,150,150,.8)", 'Ind. Republican':"rgba(150,150,150,.8)", 'Free Soil':"rgba(150,150,150,.8)", 'Socialist':"rgba(150,150,150,.8)", 'Anti Jackson':"rgba(150,150,150,.8)", 'Democrat-Liberal':"rgba(150,150,150,.8)", 'Liberal Republican':"rgba(150,150,150,.8)", 'Independent Democrat':"rgba(150,150,150,.8)", 'Farmer-Labor':"rgba(150,150,150,.8)", 'Prohibitionist':"rgba(150,150,150,.8)", 'Silver Republican':"rgba(150,150,150,.8)", 'Anti-Lecompton Democrat':"rgba(150,150,150,.8)", 'National Greenbacker':"rgba(150,150,150,.8)", 'Republican-Conservative':"rgba(150,150,150,.8)", 'Anti-Jacksonian':"rgba(150,150,150,.8)", 'Unconditional Unionist':"rgba(150,150,150,.8)", 'Ind. Whig':"rgba(150,150,150,.8)"
    }

   var margin = {top: 200, right: 20, bottom: 50, left: 200},
      width = $(window).width() - margin.right - .333*$(window).width(),
      height = $(window).height() - margin.top - margin.bottom;

    var nb_points = 550; // max number

    dragit.time = {min: 0, max: 113, step: 1, current: 1};
    
    dragit.time.current = 0;
    
    var timecube = d3.range(nb_points).map(function(d, i) {
            return d3.range(dragit.time.max).map(function(e, j) { 
                if (i < data[e+1].length) {
                  return {'party':data[e+1][i]['party'], 't': j, 'state': data[e+1][i]['state'], 'type': data[e+1][i]['type'], 'firstname':data[e+1][i]['firstname'], 'lastname':data[e+1][i]['lastname']};
                }
                // doesn't exist
                else {
                  return {'party':'None', 't': j, 'state': 'None', 'type': 'None', 'firstname':'None', 'lastname':'None'};
                }
        });
    })

    var radius = 8; // radius of the seat circles
    var starter = 4; // which row to start on, makes it an arc instead of half-circle

    var r = (radius*2+5)*starter; // radius from center of arc
    var row = starter; // row number
    var angle = 0; // angle from x-axis, in degrees
    var r2 = (radius*2+5)*starter; // all the same, need two of each var
    var row2 = starter;
    var angle2 = 0;

    var centery = height - height/20; // (x,y) of the arc
    var centerx = radius*2*25 ;
    var div = 60; // keep this the same, empirically determined. gets next angle for row
    var dur = 1; // duration of transitions (keep same)

    // make svg
    var svg = d3.select("#main")
        .append("svg")
        .attr({width: width, height: height})

    // formats a string for the descriptor of a legislator
    function makeText(fn,ln,st,type,pt) {
      if (pt == "Democrat") { pt = "D"}
      if (pt == "Republican") { pt = "R"}
      if (pt == "Independent") { pt = "I"}
      if (pt.toString() == "NaN") { pt = "None"}
      return fn + " " + ln + ", " + pt + "-" + st + " ("+type+")";
    }

    // parties is an object
    // keys are party names
    // vals are lists of people objects in that part
    // flatten into a single list in alphabetical order
    function flattenParties(parties) {
      var alphalist = sortObjAlpha(parties);
      var masterlist = []; // list of lists
      for (var i=0; i<alphalist.length; i++) {
        masterlist.push(parties[alphalist[i]]);
      }
      return [].concat.apply([], masterlist); // flatten list
    }

    // given a time and the parties
    // cycles through and finds the angles of all seats
    // sorts them and assigns sorted angles to party members alphabetically
    function getPositions(t, parties) {
      var rad = (radius*2+5)*starter; // same as above, need own variables
      var rown = starter;
      var ang = 0;

      var angs = []; // list of all angles of seats

      var num = data[(parseInt(t)+1).toString()].length;
      console.log(num);

      // get all angles of points
      for (var i=0; i<num; i++) {
        if (ang <= 181) {
          angs.push(ang);
          var ret = centerx + rad*Math.cos(ang*0.0174533);
          ang = ang + div/rown;
        } else {
          ang = 0;
          angs.push(ang);
          rad = rad+radius*2+5;
          rown= rown + 1;
          var ret = centerx + rad*Math.cos(ang*0.0174533);
          ang = ang + div/rown;
        }
      }

      // sort angles
      angs = angs.sort(function(a, b){return a-b});

      assigned_angs = {}; // lists of people for an angle

      all_people = flattenParties(parties);

      // assign people to angles
      for (var i=0; i<num; i++) {
        if (!(angs[i] in assigned_angs)) {
          assigned_angs[angs[i]] = [];
        }
        assigned_angs[angs[i]].push(all_people[i]);
      }
      return assigned_angs;
    }

    // get the party information for a time
    // parties has party name as key, list of people objects as value
    // partiesprop has the angle
    function sortbyparty(t) {
      parties = {}
      for (var i=0; i<data[(parseInt(t)+1).toString()].length; i++) {
        var o = data[(parseInt(t)+1).toString()][i];
        if (!(o.party in parties)) {
          parties[o.party] = [];
        }
        parties[o.party].push(o);
      }

      return parties;
    }

    function sortObjAlpha(o) {
      var keys = Object.keys(o);
      keys.sort();
      var ret = [];
      for (var i=0; i<keys.length; i++) {
        ret.push(keys[i]);
      }
      return ret;
    }

    var parties = sortbyparty(dragit.time.current);
    var assigned_angs = getPositions(dragit.time.current, parties);
    var assigned_angs2 = jQuery.extend(true, {}, assigned_angs); // deep clone

    // create circles for each data point on the arc
    svg.selectAll('circle')
      .data(timecube)
      .enter().append('circle')
      .attr('r',radius)
      .attr('class','datacircles')
      .attr('cx',function(d,i) {        
        if (angle <= 181) {
          d.angle = angle;
          var ret = centerx + r*Math.cos(angle*0.0174533);
          angle = angle + div/row;
          return ret;
        } else {
          angle = 0;
          d.angle = angle;
          r = r+radius*2+5;
          row = row + 1;
          var ret = centerx + r*Math.cos(angle*0.0174533);
          angle = angle + div/row;
          return ret;
        }
      })
      .attr('cy',function(d,i){
        // same exact as cx, but new variables and Math.sin
        if (angle2 <= 181) {
          var ret = centery - r2*Math.sin(angle2*0.0174533);
          angle2 = angle2 + div/row2;
          return ret;
        } else {
          angle2 = 0;
          r2 = r2+radius*2+5;
          row2 = row2 + 1;
          var ret = centery - r2*Math.sin(angle2*0.0174533);
          angle2 = angle2 + div/row2;
          return ret;
        }
      })
      .attr('fill', function(d) {
        if (d[dragit.time.current].party != 'None') {
          var person = assigned_angs[d.angle].splice(0,1)[0];
          return partycolors[person.party];
        }
      })
      // if None, don't display
      .style('display',function(d,i) {
        if (d[dragit.time.current].party == 'None') {
          return 'none';
        } else {
          return 'block';
        }
      })
      // make the mouseover text
      .append('title')
      .text(function(d) {
        if (d[dragit.time.current].party != 'None') {
          person = assigned_angs2[d.angle].splice(0,1)[0];
          return makeText(person.firstname, person.lastname, person.state, person.type, person.party);
        }
      });
        
      // list of current parties, alhphabetically sorted
      var currentparties = sortObjAlpha(parties);

      // make large lavel for year
      svg.selectAll('#yearlabel')
        .data([1])
        .enter().append('text')
        .text(function(d,i) {
          return sessionyears(dragit.time.current+1);
        })
        .attr('x',80)
        .attr('y',100)
        .style('font-family','serif')
        .style('font-size','150px')
        .style('font-weight','bold')
        .style('fill','#aaaaaa')
        .attr('opacity','.6')
        .attr('id','yearlabel');

      // make smaller label for number of legislators
      svg.selectAll('#countlabel')
        .data([1])
        .enter().append('text')
        .text(function(d,i) {
          return data[(parseInt(dragit.time.current)+1).toString()].length;
        })
        .attr('x',centerx)
        .attr('y',centery)
        .style('font-family','serif')
        .style('font-size','60px')
        .style('font-weight','bold')
        .style('fill','#777777')
        .style('text-anchor','middle')
        .attr('opacity','.9')
        .attr('id','countlabel');

      // makes the legend of what color is what party
      function makePartyLabels(cparties) {

        svg.selectAll('.partylabels')
        .data(cparties)
        .enter().append('text')
        .text(function(d,i) {
          if (d.toString() == 'NaN') { return 'None'; }
          return d;
        })
        .attr('x', 1090)
        .attr('y',function(d,i) {
          return 80 + i*30;
        })
        .style('font-family','Lato')
        .style('font-size','20px')
        .style('font-weight','bold')
        .style('fill','#555555')
        .attr('opacity','.6')
        .attr('class','partylabels');

        svg.selectAll('.partylabelcircles')
        .data(cparties)
        .enter().append('circle')
        .attr('cx', 1070)
        .attr('cy',function(d,i) {
          return 73 + i*30;
        })
        .attr('r',10)
        .style('fill',function(d) {
          return partycolors[d];
        })
        .attr('opacity','.8')
        .attr('class','partylabelcircles');
      }

      makePartyLabels(currentparties);

      // update function for dragit
      function update(v, t) {
        dragit.time.current = v || dragit.time.current;
        if (dragit.time.current >= 113) {
          dragit.time.current = 112;
        }

        var parties = sortbyparty(dragit.time.current);
        var assigned_angs = getPositions(dragit.time.current, parties);
        var assigned_angs2 = jQuery.extend(true, {}, assigned_angs); // deep copy

        // update the fills of the seat circles
        svg.selectAll('.datacircles').transition().duration(dur).ease('linear')
          .attr('fill', function(d,i) {
            if (d[dragit.time.current].party != 'None') {
              var person = assigned_angs[d.angle].splice(0,1)[0];
              return partycolors[person.party];
            }
          })
          .style('display',function(d,i) {
            if (d[dragit.time.current].party == 'None') {
              return 'none';
            } else {
              return 'block';
            }
          })
        // update the mouseover texts
        svg.selectAll('title').transition().duration(dur).ease('linear')
          .text(function(d,i) {

            if (d[dragit.time.current].party != 'None') {
              var person = assigned_angs2[d.angle].splice(0,1)[0];
              return makeText(person.firstname, person.lastname, person.state, person.type, person.party);
            }
          });

        // update the year
        svg.selectAll('#yearlabel').transition().duration(dur).ease('linear')
          .text(function(d) {
            return sessionyears((parseInt(dragit.time.current)+1));
          });

        // update the legislator count
        svg.selectAll('#countlabel').transition().duration(dur).ease('linear')
        .text(function(d) {
          var num = data[(parseInt(dragit.time.current)+1).toString()].length;
          // if (num > 535) { num = 535; }
          return num;
        });

        // remove all the legend labels and remake
        svg.selectAll('.partylabels').remove();
        svg.selectAll('.partylabelcircles').remove();

        var currentparties = sortObjAlpha(parties);

        makePartyLabels(currentparties);

      }

      // initialize for dragit
      function init() {
        dragit.init("svg");
        dragit.data = timecube;
        dragit.evt.register("update", update);
        dragit.playback.loop = true;
        dragit.playback.speed =  500;
        dragit.utils.slider("#slider", true);

        // make the slider show years not sessions
        // d3.select('.max-time').html("2013");
        // d3.select('.min-time').html("1789");
        // // d3.select('#slider-time').style('width','10px');
      }
    
      init();
};
