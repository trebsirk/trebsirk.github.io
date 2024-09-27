// script.js

//const { max } = require("d3");

class Graph {
    constructor() {
        this.adjacencyList = {};
    }

    nodes(self) {
        return Object.keys(this.adjacencyList);
    }

    // Add a node to the graph
    addNode(node) {
        if (!this.adjacencyList[node]) {
            this.adjacencyList[node] = [];
        }
    }

    // Add an edge between two nodes
    addEdge(node1, node2) {
        this.adjacencyList[node1].push(node2);
        this.adjacencyList[node2].push(node1); // For undirected graph
    }

    // Function to compute the distance (number of hops) between two nodes
    getDistance(start, end) {
        const queue = [start];
        const visited = new Set();
        visited.add(start);
        let hops = 0;

        while (queue.length) {
            const levelSize = queue.length;

            for (let i = 0; i < levelSize; i++) {
                const currentNode = queue.shift();

                if (currentNode === end) {
                    return hops; // Return number of hops
                }

                this.adjacencyList[currentNode].forEach(neighbor => {
                    if (!visited.has(neighbor)) {
                        visited.add(neighbor);
                        queue.push(neighbor);
                    }
                });
            }
            hops++;
        }

        return -1; // Return -1 if end node is not reachable from start node
    }

    getMaxDistance() {
        let maxDistance = 0; // To store the maximum distance
        const nodes = Object.keys(this.adjacencyList);
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const distance = this.getDistance(nodes[i], nodes[j]);
                // console.log("dist = " + distance);
                if (distance > maxDistance) {
                    maxDistance = distance;
                    // console.log("new max dist = " + maxDistance);
                    // maxPair = [nodes[i], nodes[j]];
                }
            }
        }
        return maxDistance;
    }
}

function calcNodeScores(graph, selectedNodes) {
    // if (selectedNodes.length === 0) {
    //     return Infinity;
    // }
    const scores = new Map();
    const nodes = Object.keys(graph.adjacencyList);
    nodes.forEach(n => {
        // Find minimum distance to any selected node
        let minDistance = Infinity;
        selectedNodes.forEach(selectedNode => {
            const distance = graph.getDistance(selectedNode.id, n);
            minDistance = Math.min(minDistance, distance);
        });
        scores.set(n, minDistance);
    });
    return scores;
}

function calcMeanScore(scores) {
    let sum = 0;
    let count = 0;
    scores.forEach((value) => {
        sum += value;
        count++;
    });
    return sum / count;
}

const graph = new Graph();
let maxDistance = Infinity;
const maxNodesSelected = 4;

const width = 800;
const height = 400;
const padding = 10; // Add padding to the edges
const svg = d3.select("svg")
    .attr("width", width)
    .attr("height", height);

d3.json("graph_data.json").then(data => {
    // Map nodes and compute their positions with padding
    const nodes = data.nodes.map(node => {
        return {
            id: node.id.join(','), // Convert array to string for unique identification
            x: node.id[0] * 30 + padding, // Adjust x-coordinate with padding
            y: node.id[1] * 20 + padding,  // Adjust y-coordinate with padding
            selected: false // Track selection state
        };
    });
    nodes.forEach(n => graph.addNode(n.id));

    // Create edges using stringified node ids for matching
    const edges = data.edges.map(edge => {
        return {
            source: edge.source.join(','),
            target: edge.target.join(',')
        };
    });
    edges.forEach(e => graph.addEdge(e.source, e.target));
    maxDistance = Math.ceil(Math.sqrt(nodes.length)); //graph.getMaxDistance();
    //console.log(graph.nodes());
    // const distance = graph.getDistance("0,0", "3,4");
    // console.log(`Distance from 0,0 to 3,4": ${distance}`);

    // Array to keep track of selected nodes
    const selectedNodes = [];

    // Append links (edges) to the SVG
    const link = svg.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(edges)
        .enter()
        .append("line")
        .attr("class", "link")
        .attr("stroke", "black") // Initial stroke color
        .attr("stroke-width", 2); // Set stroke width for visibility

    // Append nodes (circles) to the SVG
    const node = svg.append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(nodes)
        .enter()
        .append("circle")
        .attr("class", "node")
        .attr("r", 5)
        .attr("fill", "lightblue")
        .attr("cx", d => d.x) // Set x position
        .attr("cy", d => d.y) // Set y position
        .on("click touchstart", (event, d) => {
            if (selectedNodes.length < 4 
                ||
                d.selected && selectedNodes.length == 4
            ) {
                // Toggle selection
                d.selected = !d.selected;

                // Update selected nodes array
                if (d.selected) {
                    selectedNodes.push(d);
                } else {
                    const index = selectedNodes.indexOf(d);
                    if (index > -1) {
                        selectedNodes.splice(index, 1);
                    }
                }

                d3.select(event.currentTarget)
                    .attr("r", d.selected ? 10 : 5) // Change size
                    .attr("fill", d.selected ? "orange" : "lightblue"); // Change color

                updateNodeColors(); // Update node colors when a node is selected/deselected
                updateEdgeColors(); // Update edge colors when a node is selected/deselected
            }
            
        });

    function updateDistanceValue(value) {
        d3.select("#distance-value").text(value.toFixed(2));
    }
    
    function updateNodeColors() {
       
        const scores = calcNodeScores(graph, selectedNodes);
        const meanScore = calcMeanScore(scores.values());
        updateDistanceValue(meanScore);
        // Function to update the displayed distance value
        node.each(function(d) {
            if (selectedNodes.length === 0) {
                d3.select(this).attr("fill", "red"); // Default color
            } else {
                const score = scores.get(d.id); // 0 to maxDistance
                const minDistance = score;
                // Set node color based on distance (adjust scaling as needed)
                const colorValue = Math.min(minDistance, 255); // Scale to color range
                // default to red = 255, 0, 0
                // 0 dist = green = 0, 255, 0
                const red = Math.min(minDistance*(255/maxDistance), 255)
                const green = Math.max(255 - minDistance*(255/maxDistance), 0)
                const color = `rgb(${red}, ${green}, 0)`; // Gradient from green to red
                // console.log("color = "+color);
                d3.select(this).attr("fill", color);
            }
        });
    }

    function updateEdgeColors() {
        link.each(function(d) {
            const sourceNode = nodes.find(n => n.id === d.source);
            const targetNode = nodes.find(n => n.id === d.target);

            let minDistance = Infinity;

            // Calculate distances to all selected nodes
            selectedNodes.forEach(selectedNode => {
                const distanceSource = Math.sqrt(
                    Math.pow(selectedNode.x - sourceNode.x, 2) + Math.pow(selectedNode.y - sourceNode.y, 2)
                );
                const distanceTarget = Math.sqrt(
                    Math.pow(selectedNode.x - targetNode.x, 2) + Math.pow(selectedNode.y - targetNode.y, 2)
                );

                minDistance = Math.min(minDistance, distanceSource, distanceTarget);
            });

            // Set color based on minimum distance
            const color = minDistance === Infinity ? "black" : `rgb(0, ${255 - Math.min(minDistance * 20, 255)}, ${Math.min(minDistance * 20, 255)})`;
            d3.select(this).attr("stroke", color);
        });
    }

    // Set initial positions of edges based on nodes
    updateEdgePositions();

    function updateEdgePositions() {
        link.each(function(d) {
            const sourceNode = nodes.find(n => n.id === d.source);
            const targetNode = nodes.find(n => n.id === d.target);
            d3.select(this)
                .attr("x1", sourceNode.x)
                .attr("y1", sourceNode.y)
                .attr("x2", targetNode.x)
                .attr("y2", targetNode.y);
        });
    }

    // Initial call to set edge colors
    updateNodeColors();
    updateEdgeColors();
}).catch(error => {
    console.error("Error loading the graph data:", error);
});


document.getElementById('nameForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting traditionally
    const name = document.getElementById('name').value;
    //document.getElementById('greeting').innerText = `Hello, ${name}!`;
    alert("hi, "+name);
});