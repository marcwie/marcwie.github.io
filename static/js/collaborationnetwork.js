var width = 800
var height = 600
var svgNetwork = d3.select("#svg").append("svg").attr("width", width).attr("height", height);
var force = d3.layout.force().gravity(.2).distance(150).charge(-550).size([width, height]);

d3.json("/data/collaboration_network.json", function(json) {
  force.nodes(json.nodes).links(json.links).start();

  // 'link' must be a global variable (so drop the 'var' in front)
  link = svgNetwork.selectAll(".link").data(json.links).enter().append("line")
            .attr("class", "link")
            .style("stroke-width", function(d) {return d.weight})
            .style('stroke', "#34495e")
            .attr("opacity", 0.25)

  linkedByIndex = {};
  json.links.forEach(function(d) {
    linkedByIndex[d.source.index + "," + d.target.index] = 1;
    linkedByIndex[d.target.index + "," + d.source.index] = 1;
    linkedByIndex[d.source.index + "," + d.source.index] = 1;
    linkedByIndex[d.target.index + "," + d.target.index] = 1;
  });

  var node = svgNetwork.selectAll(".node")
                .data(json.nodes)
                .enter().append("g")
                .attr("class", "node")
                .call(force.drag);

  node.append("circle").attr("r","10");
  node.append("text").attr("dx", 12).attr("dy", ".35em").style("fill", "black")
                     .text(function(d) { return d.name });
  node.attr("opacity", function(o) {return 0.25;});
  node.style("fill", function (d) { return '#1f77b4';  })

  node.on('mouseover', function(d) {
    highlightLinks(d)
    node.attr("opacity", function(o) { return neighboring(d, o) ? 1 : 0.25; });
    d3.select(this).select("circle").transition().duration(250).attr("r", 20);
  })

  node.on('mouseout', function() {
    link.style('stroke', "#34495e");
    link.style('stroke-width', function(d) {return d.weight});
    link.attr("opacity", 0.25)
    node.attr("opacity", function(o) {return 0.25;});
    d3.select(this).select("circle").transition().duration(250).attr("r", 10);
  });

  force.on("tick", function() {
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });
    node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
  });
});

function colorLinks(d){
  // Color the links
  link.style('stroke', function(l) {
    if (d === l.source || d === l.target) return "#EC5725";
    else return "#34495e";
  });
}

function highlightLinks(d){
  // Color the links
  link.attr('opacity', function(l) {
    if (d === l.source || d === l.target) return 1;
    else return 0.25;
  });
}


function neighboring(a, b) {
  return linkedByIndex[a.index + "," + b.index];
}
