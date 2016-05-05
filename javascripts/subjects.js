var subjectsVisualization = function(){
       var subjects = ['Electronic government information', 'Education programs funding', 'Value-added tax', 'Agriculture and Rural Affairs', 
            'Hazardous waste site remediation', 'EBB Terrorism', 'Defense articles', 'Foreign Trade and Investments', 'Fraud offenses and financial crimes', 
            'Hurricane aftermath legislation', 'Narcotic traffic', 'Iraq compilation', 'Education of disabled students', 'Research administration and funding', 
            'Rural conditions and development', 'Educational policy', 'Medical care, personnel, and facilities', 'Petroleum and petroleum products', 
            'Computers and government', 'Welfare reform']

          var subject_mapping = {
            'Electronic government information': {className: 'elecgov', color: '#1f77b4'},
            'Education programs funding': {className: 'edprogfun', color: '#aec7e8'},
            'Value-added tax': {className: 'vat', color: '#ff7f0e'},
            'Agriculture and Rural Affairs': {className: 'agrur', color: '#ffbb78'},
            'Hazardous waste site remediation': {className: 'hazwaste', color: '#2ca02c'},
            'EBB Terrorism': {className: 'EBB', color:'#98df8a'},
            'Defense articles': {className: 'defart', color:'#d62728'},
            'Foreign Trade and Investments': {className: 'fortrade', color: '#ff9896'},
            'Fraud offenses and financial crimes': {className: 'fraudoff', color: '#9467bd'},
            'Hurricane aftermath legislation': {className: 'hurrleg', color: '#c5b0d5'},
            'Narcotic traffic': {className: 'narcos', color: '#8c564b'},
            'Iraq compilation': {className: 'iraq', color: '#c49c94'}, 
            'Education of disabled students': {className: 'eddisabled', color: '#e377c2'},
            'Research administration and funding': {className: 'research', color: '#f7b6d2'},
            'Rural conditions and development': {className: 'ruralcond', color: '#7f7f7f'},
            'Educational policy': {className: 'edpolicy', color: '#c7c7c7'},
            'Medical care, personnel, and facilities': {className: 'medical', color: '#bcbd22'},
            'Petroleum and petroleum products': {className: 'petrol', color: '#dbdb8d'},
            'Computers and government': {className: 'compgov', color: '#17becf'},
            'Welfare reform': {className: 'welfref', color: '#9edae5'}
          };

          var svg_width = 700;
          var svg_height = 600;
          var padding = 50;
          var svg = d3.select("body")
            .append("svg")
            .attr("width", svg_width)
            .attr("height", svg_height);

          var xScale = d3.time.scale()
            .domain([new Date('1973-01-01'), new Date('2015-01-04')])
            .range([padding+25, svg_width - padding - 175]);

          var yScale = d3.scale.linear()
            .domain([0, 40])
            .range([500-padding, padding]);

          var xAxis = d3.svg.axis()
            .scale(xScale)
            .orient("bottom");

          var yAxis = d3.svg.axis()
              .scale(yScale)
              .orient("left");

            // Add the X Axis
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + (500 - padding) + ")")
            .call(xAxis);

        // Add the Y Axis
        svg.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(" + (padding+25) + ",0)")
            .call(yAxis);


        var tip = d3.tip()
          .attr('class', 'd3-tip')
          .offset([-10, 0])
          .html(function(d) {
            str = 'Date: ';
            date = d.date.substr(0, 10).split('-');
            str =  str + date[1] + '/' + date[2] + '/' + date[0] + '<br>';
            subjects.forEach(function(subject, index){
              if (d[subject] !== 0){
                str += subject + ': ' + d[subject] + '<br>'
              }
            });
            return str;

            // return "<strong>Date:</strong> <span style='color:red'>" + d.date + "</span><br><span style='color:red'>" + d.subject + "</span>";
          });

        svg.call(tip);

        var dataObj = {};

        subjects.forEach(function(subject, index){
          dataObj[subject] = data.filter(function(d){
            return d[subject] >= 1;
          });
          if (index === 0){
            svg.append('text').attr('x', svg_width - 200).attr('y', 50+(index-1)*20).text('Filter by subject: ').style('text-decoration', 'underline');
          }
          var legend = svg.append('text').attr('x', svg_width-200).attr('y', 50+index*20).attr('fill', subject_mapping[subject].color).attr('class', 'legend').text(subject);
          legend.on("mouseover", function(){
            svg.selectAll('.legend').style('font-weight', 'normal');
            legend.style('font-weight', 600);
          });
          legend.on("mouseout", function(){
            legend.style('font-weight', 'normal');
          });
          legend.on("click", function(){
            svg.selectAll('.clicked').attr('class', 'legend');
            d3.select(this).attr('class', 'legend clicked');
            svg.selectAll('.legend').style('text-decoration', 'none');
            legend.style('text-decoration', 'underline');
            svg.selectAll('.test').style('display', 'none');
            svg.selectAll('.' + subject_mapping[subject].className).style('display', 'block');
            svg.selectAll('.' + subject_mapping[subject].className + '.circles').on("mouseover", tip.show).on("mouseout", tip.hide);
          });
          if (index === subjects.length - 1){
            var removeFilter = svg.append('text').attr('x', svg_width-200).attr('y', 50+(index+1)*20).text('Remove Filter');
            removeFilter.on("click", function(){
              svg.selectAll('.legend').style('text-decoration', 'none');
              svg.selectAll('.test').style('display', 'block');
            })
          }
        });

    
        subjects.forEach(function(subject, index){
          var lineGen = d3.svg.line()
            .x(function(d){
              return xScale(new Date(d.date));
            })
            .y(function(d){
              return yScale(d[subject]);
            })

          svg.append('svg:path')
            .attr('class', subject_mapping[subject].className + ' test')
            .attr('d', lineGen(dataObj[subject]))
            .style('stroke', subject_mapping[subject].color)
            .style('stroke-width', 2)
            .style('stroke-dasharray', '10,10')
            .style('fill', 'none');


          svg.selectAll('.' + subject_mapping[subject].className)
            .data(dataObj[subject], function(d, i){return d + i;})
            .enter()
            .append('circle')
            .attr('cx', function(d){
              return xScale(new Date(d.date));
            })
            .attr('cy', function(d){
              return yScale(d[subject]);
            })
            .attr('r', 3.5)
            .style('fill', subject_mapping[subject].color)
            .attr('class', subject_mapping[subject].className + ' test circles')
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide);
        });

        var xmax = new Date('2015-01-04');
        var xmin = new Date('1973-01-01');
        var ymin = 0;
        var ymax = 40;
        var refresh = function() {
          var reset_s = 0;
          if ((xScale.domain()[1] - xScale.domain()[0]) >= (xmax - xmin)) {
            zoom.x(xScale.domain([xmin, xmax]));
            reset_s = 1;
          }
          if ((yScale.domain()[1] - yScale.domain()[0]) >= (ymax - ymin)) {
            zoom.y(yScale.domain([ymin, ymax]));
            reset_s += 1;
          }
          if (reset_s == 2) { // Both axes are full resolution. Reset.
            zoom.scale(1);
            zoom.translate([0,0]);
          }
          else {
            if (xScale.domain()[0] < xmin) {
              xScale.domain([xmin, xScale.domain()[1] - xScale.domain()[0] + xmin]);
            }
            if (xScale.domain()[1] > xmax) {
              var xdom0 = xScale.domain()[0] - xScale.domain()[1] + xmax;
              xScale.domain([xdom0, xmax]);
            }
            if (yScale.domain()[0] < ymin) {
              yScale.domain([ymin, yScale.domain()[1] - yScale.domain()[0] + ymin]);
            }
            if (yScale.domain()[1] > ymax) {
              var ydom0 = yScale.domain()[0] - yScale.domain()[1] + ymax;
              yScale.domain([ydom0, ymax]);
            }
          }
          yScale.domain([0, yScale.domain()[1]]);
          svg.select(".x.axis").call(xAxis);
          svg.select(".y.axis").call(yAxis);

        }

        var reDraw = function(){
          svg.selectAll('.test').remove()
          var dataObj2 = {}
          svg.select('.clicked').style('text-decoration', 'none');

          subjects.forEach(function(subject, index){
            dataObj2[subject] = dataObj[subject].filter(function(d){
              if (new Date(d.date) >= xScale.domain()[0] && new Date(d.date) <= xScale.domain()[1] && d[subject] >= yScale.domain()[0] && d[subject] <= yScale.domain()[1]){
                return true
              }
            });
            
            var lineGen = d3.svg.line()
              .x(function(d){
                return xScale(new Date(d.date));
              })
              .y(function(d){
                return yScale(d[subject]);
              })

            svg.append('svg:path')
              .attr('class', subject_mapping[subject].className + ' test')
              .attr('d', lineGen(dataObj2[subject]))
              .style('stroke', subject_mapping[subject].color)
              .style('stroke-width', 2)
              .style('stroke-dasharray', '10,10')
              .style('fill', 'none');2

            svg.selectAll('.' + subject_mapping[subject].className)
              .data(dataObj2[subject], function(d, i){return d + i;})
              .enter()
              .append('circle')
              .attr('cx', function(d){
                return xScale(new Date(d.date));
              })
              .attr('cy', function(d){
                return yScale(d[subject]);
              })
              .attr('r', 3.5)
              .style('fill', subject_mapping[subject].color)
              .attr('class', subject_mapping[subject].className + ' test circles')
              .on('mouseover', tip.show)
              .on('mouseout', tip.hide);
            });
        }

        var zoom = d3.behavior.zoom().x(xScale).y(yScale).scaleExtent([1, 39]).on("zoom", refresh).on("zoomend", reDraw);

        svg.call(zoom);


        svg.append("text")
            .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
            .attr("transform", "translate("+ (padding/2) +","+(svg_height/2)+")rotate(-90)")  // text is drawn off the screen top left, move down and out and rotate
            .attr('x', 55)
            .attr('y', 5)
            .text("Number of Bills");

        svg.append("text")
            .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
            .attr('x', svg_width/2 - 50)
            .attr('y', 450+padding)
            // .attr("transform", "translate("+ (svg_width/2) +","+(svg_height-(padding/3))+")")  // centre below axis
            .text("Date");
}