---
title: "Responsive Scatter Plots with d3.js"
slug: "responsive-scatter-d3"
date: 2021-05-06T11:16:15+02:00
draft: true
---
I continued with dusting off my [d3.js](https://d3js.org/)-skills. After revisiting how to draw [responsive bar charts,]({{< ref "/content/blog/responsive_bar_chart.md" >}}) I continued to address the [second out of five](https://www.freecodecamp.org/learn/data-visualization/data-visualization-projects/visualize-data-with-a-scatterplot-graph) d3.js coding challenges from freecodecamp's [course on data visualization](https://www.freecodecamp.org/learn/data-visualization/). The purpose of this challenge is to create a responsive scatter plot of the 35 fastest bicycle riders to finish the climb up to [Alpe d’Huez](https://en.wikipedia.org/wiki/Alpe_d%27Huez#Cycle_racing) and indicate whether they were later confronted with doping allegations. You can get a first glimpse of the data [here.](https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json)

The data will be displayed in a two-dimensional graph with the year of the race on the horizontal and the finish time on the vertical axis. Upon hovering over a single marker the user is presented with additional information about the respective rider, the finish time the and whether there has been a doping allegation.

I again acknowledge that there are a lot of examples for response scatter plots on the web already. Still, I hope that this example serves as a good starting point for some people to create their own responsive charts. For this purpose I refrained from using too many unnecessary transitions and styling to keep the code short, concise and hopefully easy to comprehend.  

I was actually able to reuse most of the code from my example on drawing [responsive bar charts]({{< ref "/content/blog/responsive_bar_chart.md" >}}) and mainly had to swap the code responsible for drawing bars with code that draws some circles. Another subtle difference is that I used the most recent d3.js version6. The differences to older versions mostly minor, the only thing to look out for is that d3 [now uses promises](https://stackoverflow.com/questions/62459342/compatibility-between-v4-and-v5-of-d3-js) for functions like `d3.json()` so that one needs to change function calls that previously looked like `d3.json("file" ,function(data) {...})` into `d3.json("file").then(function(data) {...})`.

With all that being said lets look at the final chart:

<script src="https://d3js.org/d3.v6.min.js"></script>

<link rel="stylesheet" href="/css/responsive_scatter.css">

<div id=container align="center"></div>

<script src="/js/responsive_scatter.js"></script>

The code is mainly split into six smaller parts that fulfill the following purposes:

1. Load the data from an external source using the function `d3.json()`.
2. Append an `svg` object for the scatter plot with specified width and height to the `body` or a `div` in the webpage
3. Use appropriate scales to convert the domain of the data to the range of the `svg`. We use `d3.scaleLinear()` for transforming the years of the races that are given as integer numbers. The finish times are given in the format `MM:SS` and we thus use `d3.timeParse("%M:%S")` to convert those strings to `Date`-objects that are understood by `d3.scaleTime()`.
4. Draw and transform/translate horizontal and vertical axes to their correct positions in the `svg`. We use `d3.axisBottom()` and `d3.axisLeft()` for the horizontal and vertical axis, respectively.
5. Draw the individual points of the chart and color them depending on whether there has been a doping allegation or not. Additionally define mouseover events that trigger the visibility of a tooltip that display further information on the data point in question. For this purpose we initialize a single `div` for the tooltip and change its visibility and position according to the position of the mouse.
6. Finalize the chart by adding appropriate labels as well as a legend and a title.

Note that we could have used some form of `d3.scaleOrdinal()` to translate the information about doping allegations into a respective color for the data points. However, since we are only confronted with two cases (doping allegations or no doping allegations) I prefer to simply use an if-else condition (or a ternary operator) to set the corresponding colors of the markers.

The entire code that you need to reproduce the chart is given below or in this [codepen app.](https://codepen.io/marcwie/pen/MWpWVmQ) The inline-comments correspond to the different steps that I have outlined above. There are some additional css-styles that are mostly optional. The only important style is that for the tooltip which sets the initial `visibility` to `hidden`. Feel free to copy the implementation into a single file and run it locally on your own machine or use it as a template for your own scatter plot.

```html
<!DOCTYPE html>
<meta charset="utf-8">
<html>

<head>
  <script src="https://d3js.org/d3.v6.min.js" charset="utf-8"></script>
</head>

<style>{{% include "/static/css/responsive_scatter.css" %}}</style>

<body>

<div id=container align="center"></div>

<script type="text/javascript">
{{% include "/static/js/responsive_scatter.js" %}}
</script>
</body>
</html>
```

