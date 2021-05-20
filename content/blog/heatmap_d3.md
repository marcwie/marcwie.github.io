---
title: "Charting global mean temperature as a heatmap using d3.js"
slug: "global_mean_temperature_heatmap_d3"
date: 2021-05-13T17:37:25+02:00
draft: true
---

Heatmaps show the magnitude of an observation in multiple dimensions and are often used to visualize measurements that depend on two variables. Today, we are going to look at how we can create such heatmaps in a responsive manner using again [d3.js.](https://d3js.org/) This article thereby is the third entry in my short series on how to create different responsive charts using d3.js.

We are going to use

The color map is taken from [colorbrewer2.org](https://colorbrewer2.org) which provides a broad range of color schemes (sequential, diverging or qualitative) that are colorblind friendly, print friendly and photocopy safe.

<script src="https://d3js.org/d3.v6.min.js"></script>

<link rel="stylesheet" href="/css/heatmap.css">

<div id=container align="center"></div>

<script src="/js/heatmap.js"></script>

We will go through the code step-by-step since there are a lot of interesting things to explore here

## Initial steps

We start off easy by defining some necessary variables. `url` points to the server that holds the [input data,](https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json), `monthNames` simply stores a list of all months in a year, `colors` holds a list of colors for the color map, `width` and `height` define the dimensions of the svg that will later hold the chart and `margin` sets the spacing between the chart and the boundary of the svg in each direction so that there is enough space for labels, titles and a legend.
```js
// Url to the data
var url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json"

// Array to translate indices for individual months into text
var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

// Colors for the colormap
var colors = ['#d73027','#f46d43','#fdae61','#fee090','#ffffbf','#e0f3f8','#abd9e9','#74add1','#4575b4']

// Dimensions of the SVG
var width = 800;
var height = 500;
var margin = {left: 70, top: 80, bottom: 50, right: 100};
```

Next, we request the data from the server using `d3.json()`
```js
d3.json(url).then(function(data) {
  // The entire remaining code comes here.
})
```
In theory, we could move all commands that do not act directly on the data out of the curly brackets, but I found it more intuitive to keep all commands that work on a specific object (e.g., an axis) together which includes both, the creation of that object (could be done outside the brackets) and adding data to that object (which must to be done inside the brackets).

## Draw the SVG
```js
var svg = d3.select("#container")
             .append("svg")
             .attr("id", "svg")
             .attr("width", width)
             .attr("height", height)

var tooltip = d3.select("#container")
                .append("div")
                .attr("id", "tooltip")
               .style("visibility", "hidden")
```

## Preprocessing

The next step is optional, but I suggest to do some pre-processing of the data to keep our analysis consistent with [other sources](http://berkeleyearth.org/global-temperature-report-for-2020/). For this purpose we remove all data points prior to 1850 and then normalize the remaining data by the so-called pre-industrial baseline, i.e., the average global mean temperature between 1850 and 1900. In this step we are only computing that `baseline` and store it in a variable. The actual substraction is done whenever we access the data. The thus remaining total monthly deviation from that pre-industrial baseline is commonly referred to as *anomaly*. Specifically, we use `.filter()` to filter the data and `d3.mean()` to compute the average global mean temperature between 1850 and 1900.

```js
// (i) Remove all data points prior to 1850;
var truncData = data.monthlyVariance.filter((d) => d.year >= 1850)

// (ii) Compute the 1850-1900 baseline
var baseline = truncData.filter((d) => d.year <= 1900)
var baseline = d3.mean(truncData, (d) => d.variance)
```

## Create axes

Now we are going to create the two axes. The horizontal axis represents the time in years and the vertical axis holds each month of a respective year. For every axis in `d3` we need to define its *scale* (such as linear or ordinal), `domain` (the set of represented values) and `range` (the extent of the axis on the svg). Since both, the years and months, are provided as integer values we do not need a continuous scale, but can make use of `d3.scaleBand()` which provides convenient functionality for charts with ordinal dimension.

Let's start with the horizontal axis which we denote `xAxis`. We first compute the `extent` of the temporal dimension, i.e., the minimum and maximum year in our data. We then create the scale using `d3.scaleBand()` and setting the `domain` according to the `extent` as well as the `range` from the left to the right `margin` of the chart (see above). We then create the axis itself by calling `d3.axisBottom()` and adding our scale. As a small add-on we use `.tickvalues()` to only display years that are multiples of ten as tick labels.

```js
var xRange = d3.extent(truncData, (d) => d.year);

var xScale = d3.scaleBand()
               .domain(d3.range(xRange[0], xRange[1]+1))
               .range([margin.left, width- margin.right])

var xAxis = d3.axisBottom().scale(xScale)
              .tickValues(xScale.domain().filter( (d) => !(d % 10)));
```

We can follow the same procedure for the vertical axis. In fact, creating this axis is even simpler since we have already defined the domain of the scale through the variable `monthNames` above. We can simply pass `monthNames` to `.domain()` causing it to interpret the entries of that array as the allowed categorical values for the scale. Additionally we set the `range` from the top to the bottom `margin` and the create the axis by calling `d3.axisLeft` and adding the scale.

```js
var yScale = d3.scaleBand()
               .domain(monthNames)
               .range([margin.top, height- margin.bottom])

var yAxis = d3.axisLeft().scale(yScale)
```

Note that we do not add the axis to the svg yet. Instead, we'll do that in the very end (see below) to make sure that axes are not covered by any rectangles of the heatmap.

## Color scale


```js
var extent = d3.max(truncData, (d) => Math.abs(d.variance - baseline));

var colorMap = d3.scaleQuantize()
                 .domain([-extent, extent])
                 .range(colors.reverse())
```

## Draw heatmap
```js
svg.selectAll("dataRect")
   .data(truncData)
   .enter()
   .append("rect")
   .attr("x", (d) => xScale(d.year))
   .attr("y", (d) => yScale(monthNames[d.month-1]))
   .attr("height", yScale.bandwidth())
   .attr("width", xScale.bandwidth())
   .attr("fill", (d) => colorMap(d.variance - baseline))
   .attr("class", "cell")
   .attr("data-year", (d) => d.year)
   .attr("data-month", (d) => d.month - 1)
   .attr("data-temp", (d) => (d.variance - baseline).toFixed(2))
   .on("mouseover", function(d){
     info = d["originalTarget"]["__data__"]
     d3.select(this).attr("fill", "#34495e")
     tooltip.style("visibility", "visible")
            .style("left", event.pageX+10+"px")
            .style("top", event.pageY-70+"px")
            .html(monthNames[info.month - 1]+" "+info.year+"</br>GMT anomaly: "+d3.select(this).attr("data-temp")+ "&#176;C")
            .attr("data-year", d3.select(this).attr("data-year"))
   })
   .on("mousemove", function(){
     tooltip.style("left", event.pageX+10+"px")
            .style("top", event.pageY-70+"px")
   })
   .on("mouseout", function(){
     d3.select(this).attr("fill", colorMap(info.variance - baseline))
     tooltip.style("visibility", "hidden")
   })
```

# Draw legend

```js
var thresholds = [colorMap.domain()[0]].concat(colorMap.thresholds())

var legendCenter = margin.top + ((height - margin.top - margin.bottom) / 2)

var legendScale = d3.scaleLinear()
                    .domain(colorMap.domain())
                    .range([legendCenter+110, legendCenter-110])

var legendAxis = d3.axisRight()
                   .scale(legendScale)
                   .tickValues(thresholds.concat(colorMap.domain()[1]))
                   .tickFormat(d3.format(".1f"));

var legend = svg.append("g")
                .attr("id", "legend")
                .attr("transform", "translate("+ (width-margin.right+35)+", 0)")
                .call(legendAxis)
var boxwidth = (legendScale(colorMap.domain()[0]) - legendScale(colorMap.domain()[1])) / thresholds.length

legend.append("g").selectAll("legendRect")
                  .data(thresholds)
                  .enter()
                  .append("rect")
                  .attr("x", -15)
                  .attr("y", (d) => legendScale(d) - boxwidth)
                  .attr("height", boxwidth+1)
                  .attr("width", 15)
                  .attr("fill", (d) => colorMap(d + 0.01))
```

## Draw axes

```js
svg.append("g")
   .attr("transform", "translate(0, "+ (height - margin.bottom) + ")")
   .attr("id", "x-axis")
   .call(xAxis)

svg.append("g")
   .attr("transform", "translate("+ (margin.left)+", 0)")
   .attr("id", "y-axis")
   .call(yAxis)
```

## Finalize chart
Ultimately, we add a title and axis labels to the chart by appending individual `text`-elements to the svg. The attributes `x` and `y` set the position of the elements, `class` and `id` are used for some css-styling.

```js
// Label of horizontal axis
svg.append("text")
   .attr("x", margin.left + (width - margin.left - margin.right) / 2)
   .attr("y", height - 10)
   .attr("class", "label")
   .text("Year");

// Legend label
svg.append("text")
   .attr("y", width - 10)
   .attr("x", -legendCenter)
   .attr("transform", "rotate(-90)")
   .attr("class", "label")
   .html("Anomalies [&#176;C]");

// Title
svg.append("text")
   .attr("x", margin.left + (width - margin.left - margin.right) / 2)
   .attr("y", margin.top / 2.6)
   .attr("id", "title")
   .text("Global mean temperature anomalies");

// Subtitle / short description
svg.append("text")
   .attr("x", margin.left + (width - margin.left - margin.right) / 2)
   .attr("y", margin.top/ 1.325)
   .attr("id", "description")
   .text("Monthly averages from "+xRange[0]+" to "+xRange[1]+" compared to the pre-industrial baseline");
```

That's it!

[codepen](https://codepen.io/marcwie/pen/zYZqxja)



```html
<!DOCTYPE html>
<meta charset="utf-8">
<html>

<head>
  <script src="https://d3js.org/d3.v4.min.js" charset="utf-8"></script>
</head>

<style>{{% include "/static/css/heatmap.css" %}}</style>

<body>

<div id=container align="center"></div>

<script type="text/javascript">
{{% include "/static/js/heatmap.js" %}}
</script>
</body>
</html>
```