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

// Load the data from external source
d3.json(url).then(function(data) {

  // SVG that holds the chart
  var svg = d3.select("#container")
              .append("svg")
              .attr("id", "svg")
              .attr("width", width)
              .attr("height", height)

  // A div for the tooltip, initially set to invisible
  var tooltip = d3.select("#container")
                  .append("div")
                  .attr("id", "tooltip")
                  .style("visibility", "hidden")

  // Prepare the data:
  // (i) Remove all data points prior to 1850;
  // (ii) Normalize data to the 1850-1900 baseline
  var truncData = data.monthlyVariance.filter((d) => d.year >= 1850)
  var baseline = truncData.filter((d) => d.year <= 1900)
  var baseline = d3.mean(truncData, (d) => d.variance)

  // Define scales to translate domains of the data to the range of the svg
  var xRange = d3.extent(truncData, (d) => d.year);

  var xScale = d3.scaleBand()
                 .domain(d3.range(xRange[0], xRange[1]+1))
                 .range([margin.left, width- margin.right])

  var xAxis = d3.axisBottom().scale(xScale)
                .tickValues(xScale.domain().filter( (d) => !(d % 10)));

  var yScale = d3.scaleBand()
                 .domain(monthNames)
                 .range([margin.top, height- margin.bottom])

  var yAxis = d3.axisLeft().scale(yScale)


  // Define the colorscale. Compute absolute maximum value of datapoints so that the colorscale is symmetric around zero
  var extent = d3.max(truncData, (d) => Math.abs(d.variance - baseline));
  var colorMap = d3.scaleQuantize()
                   .domain([-extent, extent])
                   .range(colors.reverse())

  // Draw each individual rectangle of the heatmap
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


  // Place the legend
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

  // Finalize the chart by adding labels and titles
  svg.append("text")
     .attr("x", margin.left + (width - margin.left - margin.right) / 2)
     .attr("y", height - 10)
     .attr("class", "label")
     .text("Year");

  svg.append("text")
     .attr("y", width - 10)
     .attr("x", -legendCenter)
     .attr("transform", "rotate(-90)")
     .attr("class", "label")
     .html("Anomalies [&#176;C]");

  svg.append("text")
     .attr("x", margin.left + (width - margin.left - margin.right) / 2)
     .attr("y", margin.top/ 1.325)
     .attr("id", "description")
     .text("Monthly averages from "+xRange[0]+" to "+xRange[1]+" compared to the pre-industrial baseline");

  svg.append("text")
     .attr("x", margin.left + (width - margin.left - margin.right) / 2)
     .attr("y", margin.top / 2.6)
     .attr("id", "title")
     .text("Global mean temperature anomalies");

  // Draw the two axes in the very end so that they are not covered up by the rectangles of the heatmap
  svg.append("g")
     .attr("transform", "translate(0, "+ (height - margin.bottom) + ")")
     .attr("id", "x-axis")
     .call(xAxis)

  svg.append("g")
     .attr("transform", "translate("+ (margin.left)+", 0)")
     .attr("id", "y-axis")
     .call(yAxis)

})
