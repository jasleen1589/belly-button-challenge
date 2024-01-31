// Step 1: Initialize your JSON object
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

//Fetch the JSON data and console log it
d3.json(url).then(function(data) {
  console.log(data);
});


// Step 2: Define the init function
function init() {
  
  //Use D3 to select the dropdown menu
  let dropdownMenu = d3.select("#selDataset");

  d3.json(url).then((data) => {

    console.log(data);
    let names = data.names;
    names.forEach((id) => {
      dropdownMenu.append("option").text(id).property("value", id);
    });

    let sample_one = names[0];

    console.log(sample_one);

    //Build the initial plots
    buildMetadata(sample_one)
    buildBarChart(sample_one)
    buildBubbleChart(sample_one)  
    buildGaugeChart(sample_one)
  }); 
};

function optionChanged(newSample) {
  console.log(newSample);
  buildMetadata(newSample);
  buildBarChart(newSample);
  buildBubbleChart(newSample);
  buildGaugeChart(newSample);
};

function buildMetadata(sample) {
  d3.json(url).then((data) => {
    let metadata = data.metadata;
    let resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    console.log(resultArray);
    let result = resultArray[0];
    d3.select("#sample-metadata").html("");

    Object.entries(result).forEach(([key, value]) => {
      console.log(key, value);
      d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
    });
  });
}

function buildBarChart(sample) {
  d3.json(url).then((data) => {
    let samples = data.samples;
    let resultArray = samples.filter(sampleObj => sampleObj.id == sample);
    let result = resultArray[0];

    let otu_ids = result.otu_ids;
    let otu_labels = result.otu_labels;
    let sample_values = result.sample_values;

    let yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
    let xticks = sample_values.slice(0, 10).reverse();
    let labels = otu_labels.slice(0, 10).reverse();

    let barData = {
        x: xticks,
        y: yticks,
        text: labels,
        type: "bar",
        orientation: "h",
    };

    let barLayout = {
      title: "Top 10 OTUs Present"
    };

    Plotly.newPlot("bar", [barData], barLayout);
  });
};

function buildBubbleChart(sample) {
  d3.json(url).then((data) => {
    let samples = data.samples;
    let resultArray = samples.filter(sampleObj => sampleObj.id == sample);
    let result = resultArray[0];

    let otu_ids = result.otu_ids;
    let otu_labels = result.otu_labels;
    let sample_values = result.sample_values;

    let bubbleData = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: "markers",
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: "Earth"
      }
    };

    let bubbleLayout = {
      title: "Bacteria Per Sample",
      xaxis: {title: "OTU ID"},
      hovermode: "closest",
    };

    Plotly.newPlot("bubble", [bubbleData], bubbleLayout);
  });
};

function buildGaugeChart(sample) {
  d3.json(url).then((data) => {
    let metadata = data.metadata;
    let resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    let result = resultArray[0];
    let wfreq = Object.values(result)[6];

    let gaugeData = {
      value: 'pie',
      showlegend: false,
      hole: 0.4,
      rotation: 90,
      value: wfreq,
      text: ["0-1", "1-2", "2-3", "3-4", "4-5", "5-6", "6-7", "7-8", "8-9"],
      title: { text: "<b/>Belly Button Washing Frequency</b><br>Scrubs per Week",
    font: { size: 16, color: "black" } },
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        axis: { range: [0, 10], tickmode: "linear", tick0: 1, dtick:1 },
        bar: { color: "black" },
        steps: [
                {range: [0, 1], color: "rgba(255, 255, 255, 0)"},
                {range: [1, 2], color: "rgba(232, 226, 202, .5)"},
                {range: [2, 3], color: "rgba(210, 206, 145, .5)"},
                {range: [3, 4], color:  "rgba(202, 209, 95, .5)"},
                {range: [4, 5], color:  "rgba(184, 205, 68, .5)"},
                {range: [5, 6], color: "rgba(170, 202, 42, .5)"},
                {range: [6, 7], color: "rgba(142, 178, 35 , .5)"},
                {range: [7, 8], color:  "rgba(110, 154, 22, .5)"},
                {range: [8, 9], color: "rgba(50, 143, 10, 0.5)"},
                {range: [9, 10], color: "rgba(14, 127, 0, .5)"},
          ]
      }
    };

    let gaugeLayout = {
      width: 400,
      height: 400,
      margin: { t: 0, b: 0 }
    };

    Plotly.newPlot("gauge", [gaugeData], gaugeLayout);
  });
}


// Step 3: Call the init function to perform initialization
init();

