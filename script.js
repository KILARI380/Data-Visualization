// Load the dataset from the URL
d3.json("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json").then(data => {

    // Set up chart dimensions
    const margin = { top: 50, right: 30, bottom: 50, left: 60 };
    const width = 900 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    // Create SVG element
    const svg = d3.select("#chart")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Parse the data
    const parseDate = d3.timeParse("%Y-%m-%d");
    data = data.data.map(d => {
        d.date = parseDate(d[0]);
        d.gdp = +d[1];
        return d;
    });

    // Set the scales
    const x = d3.scaleTime()
        .domain(d3.extent(data, d => d.date))
        .range([0, width]);

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.gdp)])
        .nice()
        .range([height, 0]);

    // Add X axis
    svg.append("g")
        .attr("id", "x-axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).ticks(10));

    // Add Y axis
    svg.append("g")
        .attr("id", "y-axis")
        .call(d3.axisLeft(y));

    // Create the bars
    const bars = svg.selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("data-date", d => d.date)
        .attr("data-gdp", d => d.gdp)
        .attr("x", d => x(d.date))
        .attr("y", d => y(d.gdp))
        .attr("width", width / data.length)
        .attr("height", d => height - y(d.gdp))
        .attr("index", (d, i) => i);

    // Add tooltip
    const tooltip = d3.select("#tooltip");

    bars.on("mouseover", function (event, d) {
        tooltip.style("display", "block")
            .attr("data-date", d.date)
            .html(`${d.date.getFullYear()}<br/>GDP: $${d.gdp.toFixed(1)} Billion`);

        const [xPos, yPos] = d3.pointer(event);
        tooltip.style("left", xPos + 10 + "px")
            .style("top", yPos - 25 + "px");
    }).on("mouseout", function () {
        tooltip.style("display", "none");
    });

    // Add title
    svg.append("text")
        .attr("id", "title")
        .attr("x", width / 2)
        .attr("y", -margin.top / 2)
        .style("text-anchor", "middle")
        .style("font-size", "24px")
        .text("GDP over Time");
});
