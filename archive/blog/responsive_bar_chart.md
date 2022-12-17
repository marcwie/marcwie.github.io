---
title: "Create a responsive Bar Chart with d3.js"
slug: "responsive-bar-chart-d3"
date: 2021-05-03T20:25:40+02:00
draft: true
---

For a while now, I've been wanting to dust off my skills in creating responsive graphics with [d3.js.](https://d3js.org/) In the past I've used it to create some [visualizations of complex networks]({{< ref "/content/projects/adaptive.md" >}}) or simple interactive dashboards for my former clients.

I went back to freecodecamp's course on [data visualization](https://www.freecodecamp.org/learn/data-visualization/) which provides a highly recommended introduction to d3 for all those with some experience in web development, i.e., html, css and javascript. Below is my implementation of their [first out of five Coding Challenges](https://www.freecodecamp.org/learn/data-visualization/data-visualization-projects/visualize-data-with-a-bar-chart) that visualizes a time series of quarterly US GDP with a bar chart. I'm aware that there are already tons of examples for such kinds of graphics in the web, but since every person has some unique coding style (I usually have a hard time to fully comprehend all details of other peoples' example code) I keep it here for my personal reference with the hope that it is useful for some other people, too.

In particular, this chart is meant to respond to mouseover events by displaying a tooltip with more details about the data in the respective bar. I tried not to overload the chart with transitions in order to keep the example focused and concise:

<script src="https://d3js.org/d3.v4.min.js"></script>

<link rel="stylesheet" href="/css/responsive_bar_chart.css">

<div id=container align="center"></div>

<script src="/js/responsive_bar_chart.js"></script>

This example provides a very basic template for the following d3-operations:

1. Load the data from an external source. For this purpose everything you do with the data needs to be enclosed in the `d3.json()` function.
2. Append an `svg` object for the bar chart with specified width and height to the `body` or a `div` in your webpage
3. Use appropriate scales to convert the domain of the data to the range of the `svg`. We use `d3.scaleTime()` for transforming the input dates that are given as a string of the format `YYYY-MM-DD`. Similarly, we use `d3.scaleLinear()` for transforming the corresponding GDP values.
4. Draw and transform/translate horizontal and vertical axes to their correct positions in the `svg`. We use `d3.axisBottom()` and `d3.axisLeft()` for the horizontal and vertical axis, respectively.
5. Draw the individual bars of the chart and define corresponding mouseover events that trigger the visibility of a tooltip. For this purpose we initialize a single `div` for the tooltip and change its visibility and position according to the position of the mouse.
6. Finalize the chart by adding appropriate labels and a title.

The entire implementation is given below or in this [codepen app](https://codepen.io/marcwie/pen/rNjXQwR.) The inline-comments correspond to the operations outlined above. There are some additional css-styles that are mostly optional. The only important style is that for `.bar:hover` which changes the color of the bar that the mouse currently hovers over. You can copy the implementation into a single file and run it locally on your own machine.
```html
<!DOCTYPE html>
<meta charset="utf-8">
<html>

<head>
  <script src="https://d3js.org/d3.v4.min.js" charset="utf-8"></script>
</head>

<style>{{% include "/static/css/responsive_bar_chart.css" %}}</style>

<body>

<div id=container align="center"></div>

<script type="text/javascript">
{{% include "/static/js/responsive_bar_chart.js" %}}
</script>
</body>
</html>
```
