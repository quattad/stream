import React, { Component } from 'react';
import * as d3 from 'd3';

// Import CSS for Gantt Chart
import './ganttChart.css'

class GanttChart extends Component {
   constructor(props){
      super(props);
      
      this.initializeGraph = this.initializeGraph.bind(this);
      this.updateGraph = this.updateGraph.bind(this);
      
      this.state = {
          tasks: this.props.tasks,
          taskTypes: this.props.taskTypes,
      }
   };

   componentDidMount() {
       this.initializeGraph();
   };

   componentDidUpdate() {
       if (this.state.tasks !== this.props.tasks) {
           this.setState({
               tasks: this.props.tasks,
               taskTypes: this.props.taskTypes,
           });
       };
       
       this.updateGraph();
   };

   initializeGraph() {
       const node = this.node;
       const selector = node;
       d3.select(selector).append("svg")
    };

   updateGraph() {
       // Assign component props to local variables
       let tasks = this.state.tasks;
       let taskTypes = this.state.taskTypes;

        // Define constants
       var margin = { top:10, right:100, bottom:30, left: 100 };
       var svgHeight = 500;
       var svgWidth = 1140;

       var height = svgHeight - margin.top - margin.bottom;
       var width = svgWidth - margin.right - margin.left;

       var barHeight = 20;
       
       var FIT_TIME_DOMAIN_MODE = "fit";
       var FIXED_TIME_DOMAIN_MODE = "fixed";

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
       var timeDomainStart = d3.timeDay.offset(new Date().setHours(0,0,0,0), - 10);
       var timeDomainEnd = d3.timeDay.offset(new Date().setHours(0,0,0,0), +10);
       var tickFormat= "%x";
       var timeDomainMode = FIXED_TIME_DOMAIN_MODE ; // fixed or fit

       var keyFunction = function(d) {
           return d.startDate + d.name + d.endDate;
        };

        // Determines location of bars
        var rectTransform = function(d) {
            return "translate(" + x(d.startDate) + "," + y(d.name) + ")";
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
        var y = d3.scaleBand().domain(taskTypes).rangeRound([0, height - margin.top - margin.bottom]).padding(-0.05 * taskTypes.length);
        
        var xAxis = d3.axisBottom(x).tickFormat(d3.timeFormat(tickFormat)).tickSize(8).tickPadding(8).ticks(d3.timeDay.every(1));
        var yAxis = d3.axisLeft(y).tickSize(8);

        // Initiate data to plot
        initTimeDomain(tasks);

        // Define SVG as a G element that translates origin to top-left of chart area
        var svg = d3.select(selector)
            .append("svg")
            .attr("class", "chart")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)

            // Define graph and shift origin
            .append("g")
            .attr("class", "gantt-chart")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

        svg.selectAll(".chart")
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
            .attr("y", (height/taskTypes.length) / 2 )
            .attr("transform", rectTransform)
            .attr("height", barHeight)
            .attr("width", function(d) { 
                return Math.max(1,(x(d.endDate) - x(d.startDate))); 
                });

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0, " + (height - margin.top - margin.bottom) + ")")
            .transition()
            .call(xAxis)
            .selectAll("text")
                .style("text-anchor", "end")
                .attr("dx", "-0.8em")
                .attr("dy", "0.15em")
                .attr("transform","rotate(-65)");
            
        svg.append("g")
            .attr("class", "y axis")
            .transition()
            .call(yAxis);
    };

render() {
      return (
          <>
          <svg 
            ref={node => this.node = node} 
            width={"100%"} 
            height={500}></svg>
          </>
      )
   }
};

export default GanttChart;