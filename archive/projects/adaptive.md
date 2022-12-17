---
title: "Visualization of the Adaptive Voter Model"
date: 2019-02-25T19:55:33+01:00
draft: false
---

<script src="https://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.12.4.min.js"></script>
<script src="https://d3js.org/d3.v4.min.js"></script>

The *adaptive voter model* is a conceptual and one of the most prototypical models of 
opinion dynamics. It was first introduced by [Petter Holme and Mark Newman in
2006](https://journals.aps.org/pre/abstract/10.1103/PhysRevE.74.056108) and
still forms the basis of many studies conducted in my current research group.
It is motivated from the observation that in social networks like-minded
individuals tend to cluster in groups or communities. This effect may be
explained either by individuals becoming like-minded because they are connected
or by individuals connecting with each other because they are like-minded. The
latter is often denoted as "homophily".

The model is comprised of a network with N (here N=50) nodes. Initially each
node carries one of G (here G=8) opinions. In each time step one node i is
chosen uniformly at random and one of the two following processes happen:

- Rewiring/adaptation: With probability &Phi; one of the edges attached to i is moved to another
   randomly chosen node with the same opinion as node i 
- Imitation: With probability 1-&Phi; node i copies the opinion of one of its
  neighbors j

The simulation ends once there are no more links between nodes of different
opinion. For low values of &Phi; the model converges into a state with one
giant component in which all nodes hold the same opinion. At intermediate &Phi;
the system undergoes a phase transition where the giant component vanishes and
the final distribution of cluster sizes follows a power law. For large &Phi;
the network quickly fragments and the size distribution of final clusters
approximately equals the initial distribution.

Use the buttons below to control the model. The buttons "Slow" or
"Fast" both start the simulation.  In the "Slow" mode you should be able to
follow exactly what is happening at each time step. Use the "Fast" mode to run
the model into its final state.  Use "Reset" to start over. The slider on the
right is used to adjust the rewiring probability &Phi;. This can only be changed when
the simulation is stopped.

<div id="wrapper" style="display: flex;">
<div class="btn-group left" style="flex: 0 0 43%;">
    <button id="slow" type="button" class="btn btn-primary">Slow</button>
    <button id="fast" type="button" class="btn btn-primary">Fast</button>
    <button type="button" id="stopreset" class="btn btn-primary">Reset</button>
</div>
<div class="right" style="flex: 1">
    Rewiring probability &Phi;:
    <input class="rewiringslider" autocomplete="off" type="range" id="rewiring" value="0" min="0" max="1" step="0.1" oninput="rewiringvalue.value = rewiring.value" style="vertical-align:middle;">
    <output id="rewiringvalue">0</output>
</div>
</div>

<div id="svg"><div>

<script src="/js/adaptivevoter.js"></script>
