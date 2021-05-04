var url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"

// 1. Load the data from external source
d3.json(url, function(data) {

    // 2. Append svg-object for the bar chart to a div in your webpage
    // (here we use a div with id=container)
    var width = 700;
    var height = 500;
    var margin = {left: 90, top: 70, bottom: 50, right: 20};

    const svg = d3.select("#container")
                  .append("svg")
                  .attr("id", "svg")
                  .attr("width", width)
                  .attr("height", height)

    // 3. Define scales to translate domains of the data to the range of the svg
    var xMin = d3.min(data["data"], (d) => d[0]);
    var xMax = d3.max(data["data"], (d) => d[0]);

    var yMin = d3.min(data["data"], (d) => d[1]);
    var yMax = d3.max(data["data"], (d) => d[1]);

    var xScale = d3.scaleTime()
                   .domain([new Date(xMin), new Date(xMax)])
                   .range([margin.left, width-margin.right])

    var yScale = d3.scaleLinear()
                   .domain([0, yMax])
                   .range([height-margin.bottom, margin.top])

    // 4. Draw and transform/translate horizontal and vertical axes
    var xAxis = d3.axisBottom().scale(xScale)
    var yAxis = d3.axisLeft().scale(yScale)

    svg.append("g")
       .attr("transform", "translate(0, "+ (height - margin.bottom) + ")")
       .attr("id", "x-axis")
       .call(xAxis)

    svg.append("g")
       .attr("transform", "translate("+ (margin.left)+", 0)")
       .attr("id", "y-axis")
       .call(yAxis)

    // 5. Draw individual bars and define mouse events for the tooltip
    var barwidth = (xScale.range()[1] - xScale.range()[0]) / data["data"].length

    const tooltip = d3.select("body")
                      .append("div")
                      .attr("id", "tooltip")
                      .style("visibility", "hidden")

    svg.selectAll("rect")
       .data(data["data"])
       .enter()
       .append("rect")
       .attr("x", (d) => xScale(new Date(d[0])))
       .attr("y", (d) => yScale(d[1]))
       .attr("width", barwidth)
       .attr("height", (d) => height - margin.bottom - yScale(d[1]))
       .attr("class", "bar")
       .attr("data-date", (d) => d[0])
       .attr("data-gdp", (d) => d[1])
       .on("mouseover", function(d){
           tooltip.style("visibility", "visible")
                  .style("left", event.pageX+10+"px")
                  .style("top", event.pageY-80+"px")
                  .attr("data-date", d[0])
                  .html(d[0] + "</br>" + d[1] + " Billion USD" )
       })
       .on("mousemove", function(){
           tooltip.style("left", event.pageX+10+"px")
       })
       .on("mouseout", function(){
           tooltip.style("visibility", "hidden")
       })

     // 6. Finalize chart by adding title and axes labels
     svg.append("text")
        .attr("x", margin.left + (width - margin.left - margin.right) / 2)
        .attr("y", height - margin.bottom / 5)
        .attr("class", "label")
        .text("Date");

      svg.append("text")
         .attr("y", margin.left/4)
         .attr("x", -height/2)
         .attr("transform", "rotate(-90)")
         .attr("class", "label")
         .text("GDP [Billion USD]");

    svg.append("text")
        .attr("x", margin.left + (width - margin.left - margin.right) / 2)
        .attr("y", margin.top / 2)
        .attr("id", "title")
        .text("United States GDP");
})