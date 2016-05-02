var queue = d3_queue.queue;

function highlight(state, dist) {
  d3.selectAll("text").filter(".regionName")
    .text(state + " " + dist.toString());
  
  d3.select("path[state=\"" + state + "\"][dist=\"" + dist + "\"]")
    .style("fill", "black")
    .attr("class", "highlight");
}

function unhighlight(state, dist, maxinc, colorScale) {
  d3.selectAll("text").filter(".regionName")
    .text("");
  d3.select("path[state=\"" + state + "\"][dist=\"" + dist + "\"]")
    .style("fill", colorScale(maxinc));
}