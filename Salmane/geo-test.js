
/*******************************************************************************************************************************************
File Name        :   Javascript file for ata visualisation project @ EPFL.  
Supervised By    :   Dr. Benzi Kirell
Project Title    :   Cool Patent
Git Hub Repo     :   https://github.com/bilguunchinzorigEPFL/dataVisualization
MapData set From :   http://www.naturalearthdata.com/downloads/50m-cultural-vectors/
Patent Data set  :   http://www.nber.org/patents/
**********************************************************************************************************************************************/



/*******************************************************************************************************************************************
Preliminary Task: Set Window Parameters

      // Get dimension of the browser window
      // adjust the browser window aize accoedingly
**********************************************************************************************************************************************/

var width_adjust = 20; // adjust this parameter to vary window width
var height_adjust = 100; // adjust this parameter to vary window heoght
const DIMENSIONS = getWindowDimensions(); // Call the getWindowDimensions window function to get window size parameters. The function getWindowDimensions
                    // is defined at the last part of this page
// Padding.
const PADDING = {'left': 0, 'right': 0, 'top': 20, 'bottom': 20};
const WIDTH = DIMENSIONS.width;    // substract or adjust returned window width
const HEIGHT = DIMENSIONS.height;  //substract or adjust returned window heoght
const SCALE0 = (WIDTH - 1) / 2 / Math.PI;



const PATH = "./data1/"
var year = '1975'
var category = '1'
const data = 'patents.csv'
const colormaps=[
    ['rgb(247,244,249)','rgb(231,225,239)','rgb(212,185,218)','rgb(201,148,199)','rgb(223,101,176)','rgb(231,41,138)','rgb(206,18,86)','rgb(152,0,67)','rgb(103,0,31)'],
    ['rgb(255,247,243)','rgb(253,224,221)','rgb(252,197,192)','rgb(250,159,181)','rgb(247,104,161)','rgb(221,52,151)','rgb(174,1,126)','rgb(122,1,119)','rgb(73,0,106)'],
    ['rgb(255,255,229)','rgb(247,252,185)','rgb(217,240,163)','rgb(173,221,142)','rgb(120,198,121)','rgb(65,171,93)','rgb(35,132,67)','rgb(0,104,55)','rgb(0,69,41)'],
    ['rgb(255,255,217)','rgb(237,248,177)','rgb(199,233,180)','rgb(127,205,187)','rgb(65,182,196)','rgb(29,145,192)','rgb(34,94,168)','rgb(37,52,148)','rgb(8,29,88)'],
    ['rgb(255,255,229)','rgb(255,247,188)','rgb(254,227,145)','rgb(254,196,79)','rgb(254,153,41)','rgb(236,112,20)','rgb(204,76,2)','rgb(153,52,4)','rgb(102,37,6)'],
    ['rgb(255,255,204)','rgb(255,237,160)','rgb(254,217,118)','rgb(254,178,76)','rgb(253,141,60)','rgb(252,78,42)','rgb(227,26,28)','rgb(189,0,38)','rgb(128,0,38)']
    ['rgb(255,247,236)','rgb(254,232,200)','rgb(253,212,158)','rgb(253,187,132)','rgb(252,141,89)','rgb(239,101,72)','rgb(215,48,31)','rgb(179,0,0)','rgb(127,0,0)'],
]
var palette = colormaps[0]

/**********************************************************************************
           . Get SVG container that will hold the map on loading 
             the window
             // Generally Note:
             //  Each code block has been divided into TASK. 
             // Each task represent a functional work unit
             // Each task in  below are ordered alphabeltically --E,g this is A.
             // the comment here will explain what the code that  follows does
***********************************************************************************/

d3.select("#slider-time")
    .on("change", function() { 
        year=this.value;
        //console.log(year)
        d3.selectAll("svg")
          .transition()
          .duration(10)
          .delay(10)
          .remove(); 
        update();
})


d3.select("#categories")
    .on("change", function() { 
        category=this.value;
        if(category == 0)
          category = 1;
        palette = colormaps[category-1];
        //$("#chart g.nv-multiBarChart").remove()
        d3.selectAll("svg")
          .transition()
          .duration(15)
          .delay(15)
          .remove(); 
        update()
    })


//function cat_selected() {
//    category = document.getElementById("categories").value;
//    //console.log(category)
//    if(category == 0)
//      category = 1
//    palette = colormaps[category]
//    update()
//}

function update(){
    //console.log("new Path",'Patent_data', PATH + year +'/' + category + '/' + data);
    d3.csv(PATH + year +'/' + category + '/' + data, function(error, data_patent) {
        if (error) return console.error(error);
        
        draw(data_patent);
    }); 
}  
window.onload = function() {

    update()
};

let draw = (data_patent) =>{
      // Load geo-data.
      d3.json("./custom.geo-2.json",function (error, country_data){
        //console.log('GeoData', country_data);
        processData(country_data, data_patent);
      });
}

let processData = (data, data_pat) =>{
        // map standar3 names to standar2
        //hashmap = {}
        //for(ids= 0; ids < standar_names.length; ids++){
        //  hashmap[standar_names[ids].standar3] = standar_names[ids].standar2
        //}
        //console.log("data", data.features)
        for(idc=0; idc < data.features.length; idc++)
            data.features[idc].CITING_COUNTIES = [];
        
        for(idp= 0; idp < data_pat.length; idp++){
          pCountry = data_pat[idp].COUNTRY;
          patCount = data_pat[idp].PATENT;
          citingCount = data_pat[idp].CITING_COUNTRY;
          citingCountNumber = data_pat[idp].PATENT_COUNTRY_NUMBER;
          //console.log("citingCount", citingCount)
          //console.log("citingCountNumber", citingCountNumber)
          for(idc=0; idc < data.features.length; idc++){
            country = data.features[idc].properties.iso_a2;
            if(country == pCountry){
              //console.log("country", country)
              //console.log("patCount", patCount)
              data.features[idc].properties.pat_count = patCount; 
              if(citingCount != 'NO-COUNTRY')
                data.features[idc].CITING_COUNTIES.push({'Coutry':citingCount, 'CitationNumber':citingCountNumber}); 
            }
          }
        }
       //console.log('data', data)
      /**********************************************************************************
         TASK A . Get SVG container that will hold the map on loading 
             the window
             // Generally Note:
             //  Each code block has been divided into TASK. 
             // Each task represent a functional work unit
             // Each task in  below are ordered alphabeltically --E,g this is A.
             // the comment here will explain what the code that  follows does
       ***********************************************************************************/
       //TASK A . Get SVG container that will hold the map on loading: 

      var canvas =  d3.select("#chart").append("svg")
                      .attr("width",WIDTH) //get the width from window
                      .attr("height",HEIGHT+ PADDING.top + PADDING.bottom) //get the height from window
                      .attr("class","canvas") // add class attribute. This will be used in the css file to change the look of the svg
                      //.attr("transform","translate(+" + PADDING.top + PADDING.bottom+")"); // translate and transform the svg appropriately

     /**********************************************************************************
         TASK B. Get data set 
             // The dataset as been made into topojson for easing loading in browser
             // SInce with topojson the map files now becomes relatively light
             // Other data sets to be added will be loaded.
             // In particular the datasets from the NBER  patents

        // Occasionally we do console log to view the output of the log
         // And also to know the data has been rightly loaded. This
        //  directs  how to append the elementd of the data sets. For example
            console.log(data)
      ***********************************************************************************/
    
    //var countries =  topojson.feature(data, data.objects.tracts).features // load the map file and set it to the variable country
    //console.log("countries", countries)
    /**********************************************************************************
         TASK C. Set Map Projection
             // Since the globe is almost elliptical we need a map projection
             // in order to display it on a screen
             // D3js comes with different projection. We tried different ones
             // And settled on to  us to use geoMiller or geoPAtterson. Both of this satisfies our needs
             // in addtion they give good map view when used with NAtural Earth data. It should be
             // added that our map data was obtained from Natural earth http://www.naturalearthdata.com/downloads/
             Use :
               console.log(countries)
               // to view what the data set look like in the browser
      ***********************************************************************************/
       // TASK C. Set Map Projection
      var projection = d3.geoMercator() // the geopatterson projection
                         .scale(200) // add scale to map
                         .translate([WIDTH/2, HEIGHT/2]) // centralise the data set
  /**********************************************************************************
         TASK D. Add Projection to  Path
             // Haven defiened the projection
             // we should add the projection to a path
             // The  path will trace out the projection for each map unit.
      ***********************************************************************************/
      // TASK D. Add Projection to  Path
      var path = d3.geoPath().projection(projection) // add path to projection

      /**********************************************************************************
         TASK E. Add Data  to  SVG elements
          // We take the data loaded and add it to the svg elememnt
          // svg element = canvas and  data = countries as defined above
       ***********************************************************************************/
        // TASK E. Add Data  to  SVG elements
      //var group = canvas.selectAll("g") // select  svg element 
                          //.data(data.features) // add data element to the element
                          //.enter() // do this for each svg-data(country) pair. This is like a for loop over each data element.
      //                    .append("g")// create the element  and append to the data fom enter
      //                    .attr("class","country") // define a class for this section to be used in css file
                          //.attr("fill","steelblue");
      // calculate bounds, scale and transform 
      // see http://stackoverflow.com/questions/14492284/center-a-map-in-d3-given-a-geojson-object
      //var b = path.bounds(data),
      //    s = .95 / Math.max((b[1][0] - b[0][0]) / WIDTH, (b[1][1] - b[0][1]) / HEIGHT),
      //    t = [(WIDTH - s * (b[1][0] + b[0][0])) / 2, (HEIGHT - s * (b[1][1] + b[0][1])) / 2];
      //projection.scale(s)
      //      .translate(t);
   /**********************************************************************************
         TASK F. Add Path Element  to each data-svg pair
          // we take the variable group above and append path to it to create a projection suitable for screen
       ***********************************************************************************/
       // TASK G. Add Path Element  to each data-svg pair
       
      //create hashmap for colors  
      //console.log("palette", palette)
      var color = d3.scaleQuantize().range(palette)
                                       .domain([d3.min(data.features, function(d){ return d.properties.pat_count/ 20}),
                                                d3.max(data.features, function(d){ return d.properties.pat_count/ 20})]);
      

      function mouseover(){
        tooltip.transition()
               .duration(200)
               .style("opacity", .9);
      }

      function mousemove(d){
          tooltip.html(d.properties.formal_en  + "<br />"  + d.properties.pat_count + " patents")
                 .style("left", (d3.event.pageX) + "px")
                 .style("top", (d3.event.pageY - 50) + "px");
      }

      function mouseout(){
          tooltip.transition()
                 .duration(500)
                 .style("opacity", 0);
      }

      var label = canvas.selectAll("text")
                        .data(data.features)
                        .enter()
                        .append("text")
                        .attr("class", "label")
                        .attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; })
                        .text(function(d) { return d.properties.pat_count;} )
                        .on("mouseover", mouseover)
                        .on("mousemove", mousemove)
                        .on("mouseout", mouseout);

      var areas = canvas.selectAll("path")
                       .data(data.features)
                       .enter()
                       .append("path") // add path element;
                       .attr("d",path) // do this for each data element
                       .style("stroke", "black")
                       .style("stroke-width", 0.5) 
                       .on("mouseover", mouseover)
                        .on("mousemove", mousemove)
                        .on("mouseout", mouseout);

      
      var area_colored= areas.attr("class", "colored")
                             .style("fill", function(d){
                                    var patCount = d.properties.pat_count;
                                    if(patCount){ d.color = color(patCount);  return color(patCount);}
                                    d.color = "#808080";
                                    return "#808080";
                              })
                             .on("mouseover", function(d){
                                  mouseover(d)
                                  d3.select(this).style("fill", "#FFD700")
                              })
                             .on("mousemove", function(d){
                                  mousemove(d)
                              })
                             .on("mouseout", function(){
                                  mouseout()
                                  d3.select(this).style("fill", function(d){
                                  return d.color
                              })
                        });
    
      var radius = d3.scaleSqrt()
                     .domain([d3.min(data.features, function(d){ return d.properties.pat_count}),
                                    d3.max(data.features, function(d){ return d.properties.pat_count})])
                     .range([0, 3]);
      

      var bubbles = canvas.append("g")
                          .attr("class", "bubbles")
                          .selectAll("circle")
                          .data(data.features)
                          .enter()
                          .append("circle")
                          .attr("transform", function(d) 
                          { return "translate(" + path.centroid(d) + ")"; })
                          .attr("r", function(d) { 
                            if(isNaN(d.properties.pat_count))  
                              return 0; 
                            return radius(d.properties.pat_count);
                          })
                          .style("fill", "orange")
                          .style("stroke", "white")
                          .style("stroke-width", 1)
                          .style("opacity", 0.5)
                          .on("mouseover", function(d){
                              mouseover(d)
                              d3.select(this).style("fill", "#FFD700")
                              d3.select(this).attr("r", function(d) { return radius(d.properties.pat_count)+3; })

                          })
                          .on("mousemove", function(d){
                              mousemove(d)
                          })
                          .on("mouseout", function(){
                              mouseout()
                              d3.select(this).attr("r", function(d) { return radius(d.properties.pat_count); });
                              d3.select(this).style("fill", "orange");
                          })
                        .on("click", function(d){
                              clicked(d);
        });
  function clicked(d){
      d3.selectAll("line")
          .transition()
          .duration(10)
          .delay(10)
          .remove();    
      var x1 = path.centroid(d)[0];
      var y1 = path.centroid(d)[1];
      //console.log("data", data);
      //console.log("x1", x1);
      //console.log("y1", y1);
      var targets = d.CITING_COUNTIES;
      var lines = [];
      let strkMax=0
      for(var i =1; i < targets.length; i++){
        var target = targets[i].Coutry;
        strok = targets[i].CitationNumber
        if(strkMax<strok) strkMax=strok
        var dTarget = data.features.filter(function(d){
                 return d.properties.iso_a2 == target;
        })
        //console.log("target", dTarget);
        if(dTarget.length == 1){
          lines.push({'x2': path.centroid(dTarget[0])[0], 'y2': path.centroid(dTarget[0])[1], 'stroke':strok});
        }
      }
      var strokeScale=d3.scaleSqrt()
                        .domain([0, strkMax])
                        .range([0.1, 1])
     var dlines = canvas.selectAll('line')
                      .data(lines)
                      .enter()
                      .append("line")
                      .attr("x1", x1)
                      .attr("y1", y1)
                      .attr("x2", x1)
                      .attr("y2", y1)
                      .transition()
                      .duration(1500)
                      .attr("x2", function(d){ return d.x2})
                      .attr("y2", function(d){ return d.y2})
                      .attr("stroke-width", function(d){ return strokeScale(d.stroke)})
                      .attr("stroke", "#167F92")
                      .style("stroke-opacity", 0.5)
                      .style("fill", "none")

            //.each("end", function(d,i) { 
            ////Uncomment following line to re-transition
            //d3.select(this).call(transition); 
            
            //We might want to do stuff when the line reaches the target,
            //  like start the pulsating or add a new point or tell the
            //  NSA to listen to this guy's phone calls
            //doStuffWhenLineFinishes(d,i);
           //});
        
        var tweenDash = function tweenDash() {
            //This function is used to animate the dash-array property, which is a
            //  nice hack that gives us animation along some arbitrary path (in this
            //  case, makes it look like a line is being drawn from point A to B)
            var len = this.getTotalLength(),
                interpolate = d3.interpolateString("0," + len, len + "," + len);

            return function(t) { return interpolate(t); };
        };

    
  };
      

  
   /********************************************************
         H. Append  country names  to the map
    console.log(countries[1].geometry.coordinates[0][0][1])
         console.log(countries[0].properties.ADMIN)
  **********************************************************/
    // H. Append  country names  to the map
       //areas.select("text")
       //    .data(data) // get data
       //      .enter() // do select text for each data unit
       //      .append("text") // append a text
       //      .attr("x",function (d) {return path.centroid(d)[0];}) // get the central coordinate of the path for each projection on x-axis
       //      .attr("y",function (d) {return path.centroid(d)[1];}) // get the central coordinate of the path for each projection on y-axis
       //      .text(function (d) {return d.properties.GEOUNIT;})    // Add the geographical name 
       //      .attr("text-anchor","middle") // centrally locate the unit 
       //      .attr("font-size", "3.5px")  // set font size
       //      .attr("fill", "goldenrod");  // add color to the unit 
       var catlabel = canvas.append("text")
       .attr("class", "category label")
       .attr("text-anchor", "start")
       .attr("y", HEIGHT - 250)
       .attr("x", 100)
       .text(document.getElementById("categories").options[category-1].text);
   var canlabel = canvas.append("text")
       .attr("class", "year label")
       .attr("text-anchor", "start")
       .attr("y", HEIGHT - 150)
       .attr("x", 100)
       .text(year);
   function draw_legend(svg,width,y,color){

       var countScale = d3.scaleLinear()
           .domain([0, color.invertExtent(palette[8])[1]])
           .range([0, width])

       //Calculate the variables for the temp gradient
       var numStops = 10, 
           countRange = countScale.domain(); 
       countRange[2] = countRange[1] - countRange[0];
       var countPoint = [];
       for(var i = 0; i < numStops; i++) {
           countPoint.push(i * countRange[2]/(numStops-1) + countRange[0]);
       }//for i
       
       svg.append("defs")
           .append("linearGradient")
           .attr("id", "palettz")
           .attr("x1", "0%").attr("y1", "0%")
           .attr("x2", "100%").attr("y2", "0%")
           .selectAll("stop") 
           .data(d3.range(numStops))                
           .enter().append("stop") 
           .attr("offset", function(d,i) { 
               return countScale( countPoint[i] )/width;;
           })   
           .attr("stop-color", function(d,i) { 
               return color(countPoint[i]);
           });

       var legendWidth = Math.min(width*0.8, 400);
       //Color Legend container
       var legendsvg = svg.append("g")
           .attr("class", "legendWrapper")
           .attr("transform", "translate(" + (width*0.6) + "," + (y*0.75) + ")");
   
       //Draw the Rectangle
       legendsvg.append("rect")
           .attr("class", "legendRect")
           .attr("x", -legendWidth/2)
           .attr("y", 0)
           //.attr("rx", hexRadius*1.25/2)
           .attr("width", legendWidth)
           .attr("height", 10)
           .style("fill", "url(#palettz)");
           
       //Append title
       legendsvg.append("text")
           .attr("class", "legendTitle")
           .attr("x", 0)
           .attr("y", -10)
           .style("text-anchor", "middle")
           .text("Number of Patents");

       //Set scale for x-axis
       var xScale = d3.scaleLinear()
       .range([-legendWidth/2, legendWidth/2])
       .domain([ 0, countRange[1]] );

       //Define x-axis
       var xAxis = d3.axisBottom()
       .ticks(5)
       .scale(xScale);
       //Set up X axis
       legendsvg.append("g")
           .attr("class", "axis")
           .attr("transform", "translate(0," + (10) + ")")
           .call(xAxis);
   }
   draw_legend(canvas,WIDTH,HEIGHT,color)   

}

function getWindowDimensions() {

    var width =850;
    var height = 500;
    if (document.body && document.body.offsetWidth) {

        width = document.body.offsetWidth;
        height = document.body.offsetHeight;
    }

    if (document.compatMode == 'CSS1Compat' && document.documentElement && document.documentElement.offsetWidth) {

        width = document.documentElement.offsetWidth;
        height = document.documentElement.offsetHeight;
    }

    if (window.innerWidth && window.innerHeight) {

        width = window.innerWidth;
        height = window.innerHeight;
    }

    return {'width': width, 'height': height};
}

var tooltip = d3.select("section")
                      .append("div")
                      .attr("class", "tooltip")
                      .style("opacity", 0); 