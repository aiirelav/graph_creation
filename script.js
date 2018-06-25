data = {vertices: [], edges: []};  //object for graph's edges & vertices
flag = false;

function createVertexOnclick(e){

	 var svg = document.getElementById("svggraph");
     var box = svg.getBoundingClientRect();
	 var coordX =  e.clientX - box.left;
	 var coordY = e.clientY - box.top; 
    
     if(data.vertices.length<10){
	 data.vertices.push ({name: (data.vertices.length+1).toString(), x: coordX, y: coordY});
	 drawGraph();
	 redrawMatrix();	 
	}
	else 
	{ document.getElementById("svggraph").removeEventListener("click", createVertexOnclick, false);}
}

function checkVertices(){
    if(data.vertices.length<10)
    	{document.getElementById("svggraph").addEventListener("click", createVertexOnclick, false);}
}

function  redrawMatrix()
{
	
       document.getElementById('matrix').innerHTML="";
	   createMatrix(data.vertices.length);
	    for(var z in data.edges)
		{   
		   var id = (data.edges[z].start+1).toString()+"_"+(data.edges[z].end+1).toString();
		   var inverse_id = (data.edges[z].end+1).toString()+"_"+(data.edges[z].start+1).toString();
		   document.getElementById(id).innerHTML = "1";
		   document.getElementById(inverse_id).innerHTML = "1";
		}

}
function drawGraph(){
	      clearSVG();
             var svg = d3.select("svg"); 
             var w = svg.style("width");
             var h = svg.style("height");


   
             var drag = d3.behavior.drag().on("drag", function(d){
                       	flag = true;
      	
                        document.getElementById("svggraph").removeEventListener("click", createVertexOnclick, false);
                        d.x += d3.event.dx;
                        if(d.x > w){d.x = w;}
                        else if(d.x< 0) {d.x = 0;}

                        d.y += d3.event.dy;
                        if(d.y > h)  {d.y = h;}
                        else if(d.y < 0) {d.y = 0;} 
           
              d3.select(this).attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
          
             
              lines.each(function(l) {
                     if (l.start == (parseInt(d.name) -1)) {
                     d3.select(this).attr("x1", d.x).attr("y1", d.y);
                     } else if (l.end == (parseInt(d.name) -1)) {
                     d3.select(this).attr("x2", d.x).attr("y2", d.y);
       }
     });
   });      
      
     
      
         var lines = svg.selectAll("line").data(data.edges).enter().append("line").attr("class", "link").attr("x1", function(l) 
        {
               var startNode = data.vertices.filter(function(d, i) { return i == l.start;})[0];
               d3.select(this).attr("y1", startNode.y);
               return startNode.x;
         }).attr("x2", function(l) 
             {
                  var endNode = data.vertices.filter(function(d, i) { return i == l.end})[0];
                   d3.select(this).attr("y2", endNode.y);
                   return endNode.x;})


        var node = svg.selectAll("svg").data(data.vertices).enter().append("g").attr("cursor", "move").attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; }).call(drag);

            node.append("circle").attr("class","node").attr("r", 10);
            node.append("text").attr("class", "label").text(function(d){return d.name;});

    
     
         // document.getElementById("number").value = data.vertices.length.toString();
   
}

function createMatrix(n){
	var grid = document.createElement('table');
	var divMatrix = document.getElementById('matrix');
	grid.setAttribute("id", "btnGrid");
    grid.style.width = (40*n).toString() + "px";
     
     //create horizontal headers 
     var head_div1 = document.createElement('div');
     var header1 = document.createElement('table');
     var th1 = header1.appendChild(document.createElement('th'));
     th1.innerHTML="";

     for(var i =1; i<=n; i++)
     {
     	var th = header1.appendChild(document.createElement('th'));
     	th.innerHTML = i;
     }
     head_div1.appendChild(header1); 
     
     var head_div2 = document.createElement('div');
     head_div2.setAttribute("class", "flex-dir");
     var head_div3 = document.createElement('div');
     head_div2.appendChild(head_div3);
     var header2 = document.createElement('table');
  
      
     for(var i =1; i<=n; i++)
     {
     	var tr = header2.appendChild(document.createElement('tr'));
     	var th = tr.appendChild(document.createElement('th'));
     	th.innerHTML = i;
     }
     head_div3.appendChild(header2);


     //create matrix
     var head_div4 = document.createElement('div');
     head_div2.appendChild(head_div4);

     for(var i = 0; i<n; i++)
		{		 
		 var tr = document.createElement('tr'); //create row
		 
		 grid.appendChild(tr);	
		
		
			for(var j = 0; j< n; j++)
			{	
				
				var td = tr.appendChild(document.createElement('td')); //create collumn	
				
               
				if(i === j)
				{
				    td.setAttribute("class", "matrixStyleMain");
				    td.innerHTML = "1";
				  
				}
				else
				{
				    td.setAttribute("class", "matrixStyle");
				    td.innerHTML = "0";
				    td.addEventListener('click', editMatrix, false);
				}
				
				td.setAttribute("id", (i+1).toString()+"_"+(j+1).toString());
				
				td.setAttribute("title", "("+(i+1).toString()+","+(j+1).toString()+")");
				
				
				
			}
		}

		head_div4.appendChild(grid);
             
	
	document.getElementById('matrix').appendChild(head_div1);
	document.getElementById('matrix').appendChild(head_div2);
    console.log("appendTable");
}

 function editMatrix(e)
	  {	     

		 var id = e.target.id.toString();		
		 var index = id.indexOf("_");		 
		 var id_i = parseInt(id.slice(0,index));
		 var id_j=  parseInt(id.slice(index+1,id.length));
		 var inverseID = id_j + "_" + id_i;  //symmetric change

		 
	     if( e.target.innerHTML == "0")
		    {
       			e.target.innerHTML = "1"; 
				document.getElementById(inverseID).innerHTML = "1";
				if(id_i>id_j)
				{
				 data.edges.push({start: id_j-1, end: id_i-1});
			    }
			    else
			    {
			     data.edges.push({start: id_i-1, end: id_j-1});	
			    }
			   
			} 
		  else if(e.target.innerHTML  == "1") 
			{
      			e.target.innerHTML = "0";
				document.getElementById(inverseID).innerHTML = "0";

			     for(var k in data.edges)
			     {
			     	if(data.edges[k].start == Math.min(id_i-1, id_j-1) && data.edges[k].end == Math.max(id_i-1, id_j-1))
			     		{  console.log(data.edges[k]);
			     			console.log(data);
			     			data.edges.splice(k,1);
			     		}
			     }
			   }
             
				
			drawGraph(); 
			console.log(data);
	  }


window.setInterval(checkFlag, 1500);  

function checkFlag()

{

  if(flag == true)
  {
     flag = false;
     document.getElementById("svggraph").addEventListener("click", createVertexOnclick, false);  	
  }	
}

 function clearSVG ()
	 {
	     d3.selectAll("svg>*").remove(); 
	 }


 function removeVertex()
    {
        
    	 var k = data.edges.length;      
         while(k--)
			     {
			     	if(data.edges[k].end == data.vertices.length-1)
			     		{  console.log(data.edges[k]);
			     			console.log(data);
			     			data.edges.splice(k,1);
			     		}
			     }

          data.vertices.pop();
          checkVertices();
          drawGraph();

         // console.log(data);
          redrawMatrix();
     }

function removeGraph(){
	 data = {vertices: [], edges: []};
	 clearSVG();
	 document.getElementById('matrix').innerHTML = "";
}
