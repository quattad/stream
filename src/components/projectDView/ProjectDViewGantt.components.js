import React, { Component } from 'react';
import * as d3 from 'd3';
import ProjectSpinner from "../ProjectSpinner.components";

// Import CSS for Gantt Chart
import './ganttChart.css'

class GanttChart extends Component {
   constructor(props){
      super(props);
      this.updateGraph = this.updateGraph.bind(this);
      
      this.state = {
          tasks: [],
          taskTypes: [],
          features: [],
          showSpinner: false,
          showInitialMsg: false
      };
   };

   componentDidMount() {
       this.setState({
           showSpinner: true,
       });

       // Shows create task msg if spinner still shows after 3000ms / 3 seconds
       setTimeout(
           () => {
           if (this.state.showSpinner == true) {
               this.setState({
                   showSpinner: false,
                   showInitialMsg: true
               })   
           }
       }, 3000);
       
   };

   componentDidUpdate() {
       /**
        * Update state when props.tasks is updated by parent component
        * First condition triggers upon first update to update state.tasks with props.tasks
        * Subsequent updates check if props has updated since last state update */
       if (this.state.tasks !== this.props.tasks && this.props.tasks.length > 0) {
               this.setState({
                   tasks: this.props.tasks,
                   taskTypes: this.props.taskTypes,
                   features: this.props.features,
                   showSpinner: false
                });
            };

        /**
         * Run updateGraph only when state.tasks has been updated with props.tasks that has fetched tasks from backend */
        if (this.state.tasks.length > 0) {
           this.updateGraph();
       };
   };

   updateGraph() {
       //    Assign component props to local variables
       let tasks = this.state.tasks;
       let taskTypes = this.state.taskTypes;
       let features = this.state.features;

        // Define constants
        // Added extra right margin for legend
       const margin = {
           top: 10, 
           right: 200, 
           bottom: 30, 
           left: 100 
        };

       const svgHeight = 500;
       const svgWidth = 1140;

       const height = svgHeight - margin.top - margin.bottom;
       const width = svgWidth - margin.right - margin.left;

       const barHeight = 20;

       const legendVMargin = 25;
       const legendHMargin = 20;
       
       const FIT_TIME_DOMAIN_MODE = "fit";
       const FIXED_TIME_DOMAIN_MODE = "fixed";

       var taskColours = {
           0: "bar-feature0",
           1: "bar-feature1",
           2: "bar-feature2",
           3: "bar-feature3",
           4: "bar-feature4"
        };

       // Create reference to SVG element and assign to var for consistency
       const node = this.node;
       const selector = node;

       // Define x-axis start and end time, formatting
       var timeDomainStart = d3.timeDay.offset(new Date(), - 5);
       var timeDomainEnd = d3.timeDay.offset(new Date(), + 15);
       var tickFormat= "%x";
       var timeDomainMode = FIXED_TIME_DOMAIN_MODE ; // fixed or fit

       var keyFunction = function(d) {
           return d.startDate + d.name + d.endDate;
        };

        // Determines location of bars
        var rectTransform = function(d) {
            return "translate(" + (x(d3.timeDay.offset(d.startDate, +2))) + "," + y(d.name) + ")";
        };

        // Define time domain initialization
        var initTimeDomain = function(tasks) {
            if (timeDomainMode === FIT_TIME_DOMAIN_MODE) {
                if (tasks === undefined || tasks.length < 1) {
                    timeDomainStart = d3.timeDay.offset(new Date(), -3);
                    timeDomainEnd = d3.timeHour.offset(new Date(), +3);
                    return;
                };

                tasks.sort(function(a, b) {
                    return a.endDate - b.endDate;
                });
                
                timeDomainEnd = tasks[tasks.length - 1].endDate;
                
                tasks.sort(function(a, b) {
                    return a.startDate - b.startDate;
                });
                
                timeDomainStart = tasks[0].startDate;
            }
        };

        // Initiate axes
        var x = d3.scaleTime().domain([timeDomainStart, timeDomainEnd]).range([0, width]).clamp(true);
        var y = d3.scaleBand().domain(taskTypes).rangeRound([0, height - margin.top - margin.bottom]).padding(-0.01 * taskTypes.length);
        
        var xAxis = d3.axisBottom(x).tickFormat(d3.timeFormat(tickFormat)).tickSize(8).tickPadding(8).ticks(d3.timeDay.every(1));
        var yAxis = d3.axisLeft(y).tickSize(8);

        // Initiate data to plot
        initTimeDomain(tasks);

        // Define SVG as a G element that translates origin to top-left of chart area
        const chart = d3.select(selector)
            .append("svg")
            .attr("class", "chart")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)

        // Define graph and shift origin, and assigns 'g' to var svg
        const axes = chart
            .append("g")
            .attr("class", "gantt-chart")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .attr("transform", "translate(" + margin.left + ", " + margin.top + ")")

        chart.selectAll(".chart")
            .data(tasks, keyFunction).enter()
            .append("rect")
            .attr("rx", 5)
            .attr("ry", 5)
            .attr("class", function (d) { 
                if(taskColours[d.featureIndex] == null){ 
                    return "bar";
                };
                return taskColours[d.featureIndex];
            }) 
            .attr("y", (height / taskTypes.length) / 2 )
            .attr("transform", rectTransform)
            .attr("height", barHeight)
            .attr("width", function(d) { 
                return Math.max(1,(x(d.endDate) - x(d.startDate))); 
                });

        axes
            .append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0, " + (height - margin.top - margin.bottom) + ")")
            .transition()
            .call(xAxis)
            .selectAll("text")
                .style("text-anchor", "end")
                .attr("dx", "-0.8em")
                .attr("dy", "0.15em")
                .attr("transform","rotate(-65)");
            
        axes
            .append("g")
            .attr("class", "y axis")
            .transition()
            .call(yAxis);

        // Try to create legend
        const legend = d3.select(selector)
            .append("svg")
            .attr("class", "legend")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)                

        legend
            .selectAll(".legend")
            .data(features).enter()
            .append("circle")
                .attr("cx", (svgWidth - margin.right - legendHMargin))
                .attr("cy", (d, index) => {
                    return 100 + index * legendVMargin
                })
                .attr("r", 3)
                .attr("class", (d) => { 
                    if(taskColours[d.index] == null){ 
                        return "bar";
                    };
                    return taskColours[d.index];
                })

        legend
            .selectAll(".legend")
            .data(tasks).enter()
            .append("text")
                .attr("x", (svgWidth - margin.right))
                .attr("y", 60)
                .text("LEGEND")
                .attr("text-anchor", "left")
                .attr("font-weight", 600) // set bold
                .attr("text-decoration", "underline")
                .attr("fill", "white")
                .style("alignment-baseline", "middle")
        
        legend
            .selectAll(".legend")
            .data(features).enter()
            .append("text")
                .attr("x", (svgWidth - margin.right))
                .attr("y", (d, index) => {
                    return 100 + index * legendVMargin
                })
                .attr("class", (d) => { 
                    if(taskColours[d.index] == null){ 
                        return "bar";
                    };
                    return taskColours[d.index];
                })
                .text((d) => {
                    return d.name
                })
                .attr("text-anchor", "left")
                .style("alignment-baseline", "middle")
    };

render() {
      return (
          <>
          {this.state.showSpinner ? <ProjectSpinner /> : ""}
          {this.state.showInitialMsg ? <p>Please create a task.</p> : ""}
          <svg 
            ref={node => this.node = node} 
            width={"100%"} 
            height={500}></svg>
          </>
      )
   }
};

export default GanttChart;