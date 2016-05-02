var queue = d3_queue.queue;

var colors = ["#fcfbfd","#efedf5","#dadaeb","#bcbddc","#9e9ac8","#807dba","#6a51a3","#54278f","#3f007d"];
var buckets = 9;

function highlight(state, dist) {
  var corner = state + ", District " + dist.toString();
  d3.selectAll("text").filter(".regionName")
    .text(corner);
  
  d3.select("path[state=\"" + state + "\"][dist=\"" + dist + "\"]")
    .style("fill", "black");
}

function unhighlight(state, dist, color) {
  if (color == "undefined")
    color = "#ccc";
  
  d3.selectAll("text").filter(".regionName")
    .text("");
  d3.select("path[state=\"" + state + "\"][dist=\"" + dist + "\"]")
    .style("fill", color);
}