---
title: "Responsive Bar Charts with d3.js"
date: 2021-05-03T20:25:40+02:00
draft: true
---

<script src="https://d3js.org/d3.v4.min.js"></script>

<link rel="stylesheet" href="/css/responsive_bar_chart.css">

<div id=container align="center"></div>

<script src="/js/responsive_bar_chart.js"></script>


Here, we assume that you have created a `div` with `id=container` in your html-file to which we append the graph. Thus, you need the following line
```html
<div id=container align="center"></div>
```

```js {{% include "/static/js/responsive_bar_chart.js" %}}```

```css {{% include "/static/css/responsive_bar_chart.css" %}}```