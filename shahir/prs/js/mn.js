
 var mpnet = JSON.parse('{"layers": [{"name": 0}, {"name": 1}, {"name": 2}], "nodes": [{"name": 0}, {"name": 1}, {"name": 2}, {"name": 3}, {"name": 4}, {"name": 5}, {"name": 6}, {"name": 7}, {"name": 8}, {"name": 9}], "links": [{"source": 1, "layer": 0, "target": 6, "value": 1}, {"source": 2, "layer": 0, "target": 5, "value": 1}, {"source": 2, "layer": 0, "target": 3, "value": 1}, {"source": 3, "layer": 0, "target": 5, "value": 1}, {"source": 5, "layer": 0, "target": 6, "value": 1}, {"source": 7, "layer": 0, "target": 9, "value": 1}, {"source": 8, "layer": 0, "target": 9, "value": 1}, {"source": 0, "layer": 1, "target": 6, "value": 1}, {"source": 0, "layer": 1, "target": 1, "value": 1}, {"source": 1, "layer": 1, "target": 8, "value": 1}, {"source": 1, "layer": 1, "target": 3, "value": 1}, {"source": 1, "layer": 1, "target": 9, "value": 1}, {"source": 1, "layer": 1, "target": 4, "value": 1}, {"source": 1, "layer": 1, "target": 6, "value": 1}, {"source": 2, "layer": 1, "target": 5, "value": 1}, {"source": 3, "layer": 1, "target": 5, "value": 1}, {"source": 6, "layer": 1, "target": 7, "value": 1}, {"source": 6, "layer": 1, "target": 8, "value": 1}, {"source": 7, "layer": 1, "target": 9, "value": 1}, {"source": 0, "layer": 2, "target": 3, "value": 1}, {"source": 0, "layer": 2, "target": 6, "value": 1}, {"source": 1, "layer": 2, "target": 7, "value": 1}, {"source": 1, "layer": 2, "target": 2, "value": 1}, {"source": 1, "layer": 2, "target": 5, "value": 1}, {"source": 2, "layer": 2, "target": 5, "value": 1}, {"source": 3, "layer": 2, "target": 7, "value": 1}, {"source": 3, "layer": 2, "target": 5, "value": 1}, {"source": 5, "layer": 2, "target": 9, "value": 1}, {"source": 8, "layer": 2, "target": 9, "value": 1}]}');

 var color = d3.scale.category20();
 var svg_layer=[];
 var node_layer=[];
 var link_layer=[];
 var layer_label=[];

 // Calculate size for the figure
 var width = Math.sqrt(mpnet.nodes.length)*70;//500;
 var height = 4/6*width;
 var fontsize = Math.max(width*0.05,16)

 var force = d3.layout.force()
                      .charge(-120)
                      .linkDistance(30)
                      .size([width, height])
                      .nodes(mpnet.nodes)
                      .links(mpnet.links)
                      .start();

 var nlayers=mpnet.layers.length;

 for (var layer=nlayers-1;layer>=0;layer--){
  svg_layer[layer] = d3.select("#chart2").append("svg")
                     .attr("layer",0)
                     .style("position","absolute")
                     .style("left","-250px")
                     .style("top",(width/6+layer*width/4+25).toString()+"px")
                     .style("background-color","rgba(100,100,100,0.3)")
                     .style("transform","rotate3D(-0.9,0.4,0.4,70deg)") // Firefox
                     .style("-webkit-transform","rotate3D(0.6,0.4,.5,70deg)") // Safari, Chrome 
                     .attr("width", width)
                     .attr("height", height);

  layer_label[layer]=svg_layer[layer].selectAll(".layerlabel")
                     .data([mpnet.layers[layer]])
                     .enter()
                     .append("text")
                     .text(function(d){return d.name;})
                     .attr("dx",function(d){return width-0.8*d.name.toString().length*fontsize;})
                     .attr("dy",fontsize)
                     .style("font-size",fontsize+"px")
                     .style("fontcolor","black")

  link_layer[layer] = svg_layer[layer].selectAll(".link")
                      .data(mpnet.links)
                      .enter()
                      .append("line")
                      .filter(function(d){return d.layer==layer})
                      .attr("class", "link")
                      .style("stroke-width", function(d) { return 2*Math.sqrt(d.value); })
                      .style("stroke","#999");

  node_layer[layer] = svg_layer[layer].selectAll(".node")
                      .data(mpnet.nodes)
                      .enter().append("circle")
                      .attr("class", "node")
                      .attr("r", 5)
                      .style("fill", function(d) {return color(d.index); })
                      .style("stroke","#fff")
                      .style("stroke-width","1.5px")
                      .call(force.drag);

  node_layer[layer].append("title")
                   .text(function(d) { return d.name; });
 }

 force.on("tick", function() {
  for (var layer=0;layer<nlayers;layer++){
   link_layer[layer].attr("x1", function(d) { return d.source.x; })
                    .attr("y1", function(d) { return d.source.y; })
                    .attr("x2", function(d) { return d.target.x; })
                    .attr("y2", function(d) { return d.target.y; });

   node_layer[layer].attr("cx", function(d) { return d.x; })
                    .attr("cy", function(d) { return d.y; });
  }
 });

