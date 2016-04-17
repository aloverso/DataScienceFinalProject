var queue = d3_queue.queue;

function highlight(countryNames, regionName) {
  d3.selectAll("text").filter(".regionName")
    .text(regionName);
  countryNames.forEach(function(d) {
    d3.select("path[title=\"" + d + "\"]")
      .attr("class", "highlight");
  });
}

function unhighlight(countryNames) {
  d3.selectAll("text").filter(".regionName")
    .text("");
  countryNames.forEach(function(d) {
    d3.select("path[title=\"" + d + "\"]")
      .attr("class", "country");
  });
}