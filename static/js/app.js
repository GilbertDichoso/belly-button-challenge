//Define url variable
const url = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json"

//Fetch the JSON data  
let data = d3.json(url).then(function(data) {
    console.log(data);
});

//Create init function to populate dashboard and graphs
function init () {
    //Select dropdown menu with D3
    let dropdown = d3.select("#selDataset");
    //Access sample data
    d3.json(url).then(function(data) {
        let sample_ids = data.names;
        //Iterate through array and print/append each name
        sample_ids.forEach((name_id) => {
            //Print in console  
            console.log(name_id)
            //Append each value to populate dropdown menu
            dropdown.append("option").text(name_id).property("value", name_id);

        });

            //Call first sample from list
            let first_sample = sample_ids[0]

            //Call first plots to initialize
            buildBarChart(first_sample);
            buildBubbleChart(first_sample);
            buildDemographicsInfo(first_sample);
    });

};

init()



//Create function demographics information
function buildDemographicsInfo (sampleID) {
    //Call json data
    d3.json(url).then(function(data) {
        let demographic_info = data.metadata;

        //Get values for each sample through filter
        let demo = demographic_info.filter(sample => sample.id == sampleID);
        //Set first object to variable
        let sample_one = demo[0];

        //Select definition from html and set to variable
        let demo_details = d3.select("#sample-metadata");
        demo_details.html("");
        //Loop through each key and append data  
        for (key in sample_one) {
            demo_details.append("h5").text(key.toUpperCase()+": "+sample_one[key])
        }
    })
}



//Function for bar chart
function buildBarChart (sampleID) {
    d3.json(url).then(function(data) {
        let sample_data = data.samples;

    //Filter through each sample
    let sampleArray = sample_data.filter(sample => sample.id == sampleID);
    let sample = sampleArray[0];
    
    //Assign variables to sample values
    let otu_ids = sample.otu_ids
    let sample_values = sample.sample_values
    let otu_labels = sample.otu_labels
    
    //Create trace1 for bar chart
    let trace1 = [
        {x: sample_values.slice(0,10).reverse(),
        y: otu_ids.slice(0,10).map(otu_id => "OTU "+otu_id).reverse(),
        text: otu_labels.slice(0,10).reverse(),
        type:"bar",
        orientation:"h" }
    ];
    let layout = {
        title:"",
        height: 515,
        width: 1001
    };

    Plotly.newPlot("bar", trace1, layout)

    });

};

//Function that builds bubble plot
function buildBubbleChart (sampleID) {
    d3.json(url).then(function(data) {
        let samples = data.samples;

    //Filter through each sample
    let sampleArray = samples.filter(sample => sample.id == sampleID);
    let sample = sampleArray[0];
    
    //Assign variables  
    let otu_ids = sample.otu_ids
    let sample_values = sample.sample_values
    let otu_labels = sample.otu_labels
    
    //Create trace2 as bubble chart
    let trace2 = [
        {x: otu_ids,
         y: sample_values,
         text: otu_labels,
         mode:"markers",
         marker:{
            size: sample_values, 
            color: otu_ids,
            colorscale: "Viridis"
         }
         
        }];

    let layout = {
        xaxis: {title:"OTU ID"}
    };
   
    Plotly.newPlot("bubble", trace2, layout)

    });
};

//Function that updates when there is a change
function optionChanged(sampleID) {
    buildDemographicsInfo(sampleID);
    buildBarChart(sampleID);
    buildBubbleChart(sampleID);
};
