var width = 800
var height = 600
var svgNetwork = d3.select("#svg").append("svg").attr("width", width).attr("height", height);
var force = d3.layout.force().gravity(.2).distance(150).charge(-700).size([width, height]);

d3.json("/data/collaboration_network.json", function(json) {
  force.nodes(json.nodes).links(json.links).start();

  // 'link' must be a global variable (so drop the 'var' in front)
  link = svgNetwork.selectAll(".link").data(json.links).enter().append("line")
            .attr("class", "link")
            .style("stroke-width", function(d) {return d.weight})

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

  node.append("circle").attr("r","5");
  node.append("text").attr("dx", 12).attr("dy", ".35em")
                     .text(function(d) { return d.name });
 
  node.attr("opacity", function(o) {return 0.5;});

  node.on('mouseover', function(d) {
    highlightLinks(d)
    node.attr("opacity", function(o) {
      return neighboring(d, o) ? 1 : 0.5;
    });
    d3.select(this).select("circle").transition().duration(250).attr("r", 12);
    })

  node.on('mouseout', function() {
    link.style('stroke', "#aaa");
    link.style('stroke-width', function(d) {return d.weight});
    node.attr("opacity", function(o) {return 0.5;});

    d3.select(this).select("circle").transition().duration(250).attr("r", 6);
  });

  node.on("click", function(d) {
    infoString = ""
    for (i=0; i<d.contributions.length; i++) {
        infoString += d.contributions[i] + "<br/>" 
    }
    d3.select("#info").text("Publications involving " + d.name + ":<br/>" + infoString)
    });

  force.on("tick", function() {
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });
    node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
  });
});

function highlightLinks(d){
  // Color the links
  link.style('stroke', function(l) {
    if (d === l.source || d === l.target) return "#EC5725";
    else return "#aaa";
  });

  //Make them bigger
  //link.style('stroke-width', function(l) {
  //  if (d === l.source || d === l.target) return 2 * l.weight; 
  //  else return l.weight;
  //});
}

function neighboring(a, b) {
  return linkedByIndex[a.index + "," + b.index];
}
