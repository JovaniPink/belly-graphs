// Import Bootstrap
import 'bootstrap';

// Importing the custom scss
import '../scss/style.scss';

// Importing D3
// We do not have to import D3 because Plotly has it available.
// import * as d3 from "../../node_modules/d3/dist/d3.js";

// Importing Ploy.js
import Plotly from '../../node_modules/plotly.js/dist/plotly.js';

// Importing the data from data.js
import { data } from './data.js';
const tableData = data;

// Importing the samples from sample.json
import samples from './sample.json';

// buildCharts function.
function buildCharts(sample) {
  let sampleMetadata = Object.values(samples)[1];
  let sampleData = Object.values(samples)[2];

  let metaArray = sampleMetadata.filter((sampleObj) => sampleObj.id == sample);
  let resultArray = sampleData.filter((sampleObj) => sampleObj.id == sample);

  let metaResult = metaArray[0];
  let result = resultArray[0];

  let otuIDs = result.otu_ids;
  let otu_labels = result.otu_labels;
  let sample_values = result.sample_values;

  let yticks = otuIDs
    .slice(0, 10)
    .map((otu_id) => ` OTU ${otu_id} `)
    .reverse();

  let barData = [
    {
      y: yticks,
      x: sample_values.slice(0, 10).reverse(),
      text: otu_labels.slice(0, 10).reverse(),
      marker: {
        color: [
          'rgb(36, 84, 164)',
          'rgb(113, 83, 172)',
          'rgb(169, 77, 167)',
          'rgb(215, 72, 150)',
          'rgb(248, 77, 123)',
          'rgb(248, 77, 123)',
          'rgb(255, 99, 92)',
          'rgb(255, 131, 57)',
          'rgb(255, 141, 45)',
          'rgb(255, 166, 0)',
        ],
      },
      type: 'bar',
      orientation: 'h',
    },
  ];
  let barLayout = {
    title: {
      text: 'Top 10 Bacteria Cultures Found',
      font: { size: 24, color: 'rgb(33, 37, 41)' },
    },
    paper_bgcolor: 'rgb(204, 205, 216, 1)',
    plot_bgcolor: 'rgb(204, 205, 216, 1)',
    autosize: true,
    height: 400,
    xaxis: { automargin: true },
    yaxis: { automargin: true },
  };
  Plotly.newPlot('bar', barData, barLayout);

  let washing_frequency = metaResult.wfreq;
  let gaugeData = [
    {
      domain: { x: [0, 1], y: [0, 1] },
      value: washing_frequency,
      type: 'indicator',
      mode: 'gauge+number',
      gauge: {
        axis: { range: [null, 10] },
        steps: [
          { range: [0, 2], color: 'rgb(36, 84, 164)' },
          { range: [2, 4], color: 'rgb(113, 83, 172)' },
          { range: [4, 6], color: 'rgb(169, 77, 167)' },
          { range: [6, 8], color: 'rgb(215, 72, 150)' },
          { range: [8, 10], color: 'rgb(248, 77, 123)' },
        ],
        bar: { color: 'black' },
      },
    },
  ];

  let gaugeLayout = {
    title: {
      text: 'Belly Button Washing Frequency',
      font: { size: 24, color: 'rgb(33, 37, 41)' },
    },
    paper_bgcolor: 'rgb(204, 227, 222, 1)',
    plot_bgcolor: 'rgb(204, 227, 222, 1)',
    autosize: true,
    height: 400,
    xaxis: { automargin: true },
    yaxis: { automargin: true },
  };
  Plotly.newPlot('gauge', gaugeData, gaugeLayout);

  let desired_maximum_marker_size = 100;
  let bubbleData = [
    {
      x: otuIDs,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        size: sample_values,
        sizeref:
          (2.0 * Math.max(...sample_values)) / desired_maximum_marker_size ** 2,
        sizemode: 'area',
        color: otuIDs,
        colorscale: [
          [0, 'rgb(248, 77, 123)'],
          [1, 'rgb(36, 84, 164)'],
        ],
        opacity: 0.7,
      },
      type: 'scatter',
    },
  ];

  let bubbleLayout = {
    title: {
      text: 'Bacteria Cultures Per Sample',
      font: { size: 24, color: 'rgb(33, 37, 41)' },
    },
    paper_bgcolor: 'rgb(180, 180, 210, 1)',
    plot_bgcolor: 'rgb(180, 180, 210, 1)',
    autosize: true,
    height: 400,
    hovermode: otu_labels,
    xaxis: { label: 'OTU ID', automargin: true },
    yaxis: { automargin: true },
  };

  console.log(bubbleData['y']);
  Plotly.newPlot('bubble', bubbleData, bubbleLayout);
}

// Demographics Panel
function buildMetadata(sample) {
  let sampleMetadata = Object.values(samples)[1];

  // Filter the data for the object with the desired sample number
  let resultArray = sampleMetadata.filter(
    (sampleObj) => sampleObj.id == sample
  );
  let result = resultArray[0];

  // Use d3 to select the panel with id of `#sample-metadata`
  let card = Plotly.d3.select('#sample-metadata');

  // Use `.html("") to clear any existing metadata
  card.html('');

  // Use `Object.entries` to add each key and value pair to the panel
  // Hint: Inside the loop, you will need to use d3 to append new
  // tags for each key-value in the metadata.
  Object.entries(result).forEach(([key, value]) => {
    card.append('h6').text(`${key.toUpperCase()}: ${value}`);
  });
}

// Initialize Function
function init() {
  let dropdownSelector = Plotly.d3.select('#selDataset');
  let sampleNames = Object.values(samples)[0];

  sampleNames.forEach((sample) => {
    dropdownSelector.append('option').text(sample).property('value', sample);
  });

  // Use the first sample from the list to build the initial plots
  let firstSample = sampleNames[0];
  buildCharts(firstSample);
  buildMetadata(firstSample);
}

// Initialize the dashboard
init();

// Initialize event listener
document.addEventListener('DOMContentLoaded', function (event) {
  Plotly.d3.select('#selDataset').on('change', function () {
    let newSample = this.value;
    buildCharts(newSample);
    buildMetadata(newSample);
  });
});
