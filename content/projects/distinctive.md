---
title: "Visualization of the Adaptive Voter Model with global distinctiveness"
date: 2019-02-25T19:55:33+01:00
draft: true
---

<script src="https://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.12.4.min.js"></script>
<script src="https://d3js.org/d3.v4.min.js"></script>

<div id="wrapper" style="display: flex;">
<div class="btn-group left" style="flex: 0 0 43%;">
    <button id="slow" type="button" class="btn btn-primary">Slow</button>
    <button id="fast" type="button" class="btn btn-primary">Fast</button>
    <button type="button" id="stopreset" class="btn btn-primary">Reset</button>
</div>
<div class="right" style="flex: 1">
    Rewiring probability &Phi;:
    <input class="rewiringslider" 
           autocomplete="off" 
           type="range" 
           id="rewiring" 
           value="0" 
           min="0" 
           max="1" 
           step="0.1" 
           oninput="rewiringvalue.value = rewiring.value" 
           style="vertical-align:middle;">
    <output id="rewiringvalue">0</output>

    Global Distinctiveness:
    <input class="distinctslider" 
           autocomplete="off" 
           type="range" 
           id="distinct" 
           value="0" 
           min="0" 
           max="1" 
           step="0.01" 
           oninput="distinctvalue.value = distinct.value" 
           style="vertical-align:middle;">
    <output id="distinctvalue">0</output>


</div>
</div>

<div id="svg"><div>

<script src="/js/optimaldistinct.js"></script>
