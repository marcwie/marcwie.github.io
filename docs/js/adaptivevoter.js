var width = 600
var height = 400
var numberOfNodes = 50 // number of nodes
var averageDegree = 5
var numberOfLinks = averageDegree * 0.5 * numberOfNodes; //parseInt(0.05 * numberOfNodes * numberOfNodes / 2)
//var numberOfLinks = parseInt(0.05 * numberOfNodes * numberOfNodes / 2)
var nodeObjects = [];
var linkList = []
var rewiringProbability;
var svg = d3.select("#svg").append("svg").attr("width", width).attr("height", height);
var colorsScale = d3.scaleOrdinal(d3.schemeCategory10);
var nodes;
var links;
var gamma = 1;
var numberOfOpinions;
var strength = -75

var isrunning = false;
var timerID;
var speed = 3000;
var duration = 500;
var isslow = true;

$(document).ready( function () {

  $("#slow").on("click", function () {

      clearInterval(timerID);
      isrunning = true;
      $(this).prop("disabled", true)
      $("#stopreset").text("Stop")
      $("#fast").prop("disabled", false)

      rewiringProbability = $("#rewiring").val();
      isslow = true;
      speed = 3000;
      duration = 500;

      $(".rewiringslider").prop("disabled", true)
      updateDynamics()
      timerID = setInterval(updateDynamics, speed);
  });

  $("#fast").on("click", function () {

      clearInterval(timerID);
      isrunning = true;
      $(this).prop("disabled", true)
      $("#stopreset").text("Stop")
      $("#slow").prop("disabled", false)

      rewiringProbability = $("#rewiring").val();
      isslow = false;
      speed = 20;
      duration = 0;

      $(".rewiringslider").prop("disabled", true)
      updateDynamics()
      timerID = setInterval(updateDynamics, speed);
  });

  $("#stopreset").on("click", function() {
    if (isrunning == false) {
      reset();
    }
    else
    {
      clearInterval(timerID);
      isrunning = false;
      $(this).text("Reset")
      $("#slow").prop("disabled", false)
      $("#fast").prop("disabled", false)
      $(".rewiringslider").prop("disabled", false)
  }});
});
function colors (opinion) {
  return colorsScale(opinion); 
}

// Inititalize the simulation
var simulation = d3.forceSimulation(nodes)
                   .force("charge", d3.forceManyBody().strength(strength))
                   .force("link", d3.forceLink(links).distance(50))
                   .force("x", d3.forceX())
                   .force("y", d3.forceY())
                   .alphaTarget(1)  //What is this?
                   .on("tick", ticked);

var g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
var link = g.append("g").attr("stroke", "#bdc3c7").attr("stroke-width", 1.5).selectAll(".link")
var node = g.append("g").attr("stroke", "#fff").attr("stroke-width", 1.5).selectAll(".node")

reset()

function reset () {

  nodes = d3.range(numberOfNodes).map(Object);
  list = randomChoose(unorderedPairs(d3.range(numberOfNodes)), numberOfLinks);
  links = list.map(function (a) { return {source: a[0], target: a[1]} });

  numberOfOpinions = 8; 

  var opinions = randomAssign(d3.range(numberOfOpinions), numberOfNodes);
  for (var i=0; i<nodes.length; i++) {
    nodes[i].opinion = opinions[i]
    nodes[i].stock = [0.5]
    nodes[i].size = 10;
  }
  updateNetwork ();
}

function updateDynamics () {



  var activeNode = randomSelect(nodes)
  var delay = 0;

  if (isslow) {
  activeNode.size = 20;
  node.transition().delay(delay).duration(duration).attr("r", function(d) {  return d.size });
  delay = delay + duration;
  }

  // Get all neighbors of the active node
  var neighbors = []
  for (i=0; i<links.length; i++) {
    if (links[i].source == activeNode) { neighbors.push(links[i].target); }
    else if (links[i].target == activeNode) { neighbors.push(links[i].source) }
  };

  if (neighbors.length > 0) {
    var activeNeighbor = randomSelect(neighbors)

    if (isslow) {
    activeNeighbor.size *= 2.5;
    node.transition().delay(delay).duration(duration).attr("r", function(d) { return d.size });
    delay = delay + duration;
    }

    if (activeNode.opinion != activeNeighbor.opinion) {
      if (Math.random() > rewiringProbability) {
        imitation(activeNode, activeNeighbor) 

        if (isslow) {
        node.transition().delay(delay).duration(duration)
                         .attr("fill", function(d) { return colors(d.opinion) })
        delay = delay + duration;
        }

      }
      else {
        newNeighbor = adaptation(activeNode, activeNeighbor);

        if (isslow) {
        newNeighbor.size *= 2.5;
        node.transition().delay(delay).duration(duration).attr("r", function(d) { return d.size });
        delay = delay + duration;

        setTimeout(function() {
          link = link.data(links)
          link.exit()//.transition()
              //.attr("stroke-opacity", 0)
              .remove();
          link = link.enter().append("line")//.attr("stroke-opacity", 0)
                     //.call(function(link) {
                     //   link//.transition().delay(2 * duration).duration(2 * duration)
                     //   .attr("stroke-opacity", 1); })
                     .merge(link);
        //delay = delay + 4 * duration;*/
        }, delay)
        delay = delay + duration;

        }
      }
    };
  };

  nodes.map(function (d) { d.size = 4 + d.stock[d.stock.length - 1] * 12 })

  if (isslow) {
  node.transition().delay(delay).duration(duration)
      .attr("r", function (d) { return d.size });

  setTimeout(function() {
    simulation.nodes(nodes);
    simulation.force("link").links(links);
    simulation.alpha(1).restart();
  }, delay)
  }

  else { updateNetwork(); }
}

function updateNetwork () {

    node = node.data(nodes)
    node = node.enter().append("circle").merge(node);
    node.attr("fill", function(d) { return colors(d.opinion); })
        .attr("r", function (d) { return d.size })

    link = link.data(links)
    link.exit().remove();
    link = link.enter().append("line").merge(link);

    simulation.nodes(nodes);
    simulation.force("link").links(links);
    simulation.alpha(1).restart();

  node.on("click", function(d) {
    console.log( d.opinion, d.stock )
  })


};

function ticked () {
  link.attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });

  node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
}

function randomAssign (s, k) {
  var a = [], j;
  for (var i=0; i<k; i++) {
    j = Math.floor(Math.random() * s.length);
    a.push(s[j])
  }
  return a;
}

function randomChoose (s, k) { // returns a random k element subset of s
  var a = [], i = -1, j;
  while (++i < k) {
    j = Math.floor(Math.random() * s.length);
    a.push(s.splice(j, 1)[0]);
  };
  return a;
}

function unorderedPairs (s) { // returns the list of all unordered pairs from s
  var a = [];
  for (var i=0; i<s.length; i++) {
    for (var j=i+1; j<s.length; j++) {
      a.push([s[i],s[j]])
    }
  }
  return a;
}

function randomSelect (s) {
  index = Math.floor(Math.random() * s.length);
  return s[index]
}

function imitation (activeNode, activeNeighbor) {
  nodes[activeNode.index].opinion = activeNeighbor.opinion;
}

function adaptation (activeNode, activeNeighbor) {
  var newNeighbors = []

  //Find all possible new neighbors of the active node
  for (i=0; i<nodes.length; i++) {
    if (nodes[i].opinion == activeNode.opinion) {
      if (activeNode.index < nodes[i].index) {
        linkCandidate = {source: activeNode, target: nodes[i]}
      }
      else if (activeNode.index > nodes[i].index) {
        linkCandidate = {target: activeNode, source: nodes[i]}
      }
      if (links.includes(linkCandidate) == false) {
        newNeighbors.push(nodes[i])
      }
    }
  }

  if (newNeighbors.length > 0) {
    newNeighbor = randomSelect(newNeighbors);

    // Remove the link between the two original nodes
    links = links.filter(function(e) {
      if (activeNode.index < activeNeighbor.index) {
        result = e.source == activeNode && e.target == activeNeighbor;
      }
      else if (activeNode.index > activeNeighbor) {
        result = e.target == activeNode && e.source == activeNeighbor;
      }
      return result == false;
    });

    //Add a new link between the original node and a node of the same opinion
    if (activeNode.index < newNeighbor.index) {
      linkCandidate = {source: activeNode, target: newNeighbor}
    }
    else if (activeNode.index > newNeighbor.index) {
      linkCandidate = {target: activeNode, source: newNeighbor}
    }
    links.push(linkCandidate)
  }

  return newNeighbor;
};
