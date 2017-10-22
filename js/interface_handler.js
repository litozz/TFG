class Interface_Handler{
	constructor(language){
		this.grafo_principal=new Grafo("network");
		this.grafo_solucion=new Grafo("solution_network");
		
		try{
			this.algorithms=new Algorithms();
		}catch(err){alert(err);}

		this.is_initial_selected=false;
		this.initialization();

		this.imported_nodes;
		this.imported_edges;
		this.imported_initial_node;
		this.imported_end_nodes;

		this.created_events=false;

		this.index_step=0;

		this.resolution;

		this.language=language;
	}
	


	setLanguage(language){this.language=language;}
	getLanguage(language){return this.language;}


	addNode(){
	    /*Estructura de los nodos:
	        id: identificador del nodo
	        label: lo que aparece en pantalla, el id del nodo junto con su función heurística
	        color: color del nodo
	        title: en este apartado guardaremos la heuristica
	    */
	    var node_id=document.getElementById('node-id').value;
		if(node_id==""){
			//alert("El id del nodo no puede estar vacio");
			alert(this.getAlertMessage(0));
		}else{
	        try {
	            var heur=parseInt(document.getElementById('node-heuristic').value);
	            
	            if(!isNaN(heur)){
	            	if(heur>=0){
			            if(document.getElementById('cb_initial_node').checked && !document.getElementById('cb_final_node').checked){ //Si es nodo inicial
			            	if(!this.grafo_principal.initialNodeExists()){
			            		this.grafo_principal.addNode(node_id,heur,true,false);
			                	document.getElementById('cb_initial_node').checked=false;
			                	document.getElementById('cb_initial_node').disabled=true;
			            	}else{
			            		//alert("El nodo inicial ya está definido. Si el checkbox de nodo inicial esta activado es porque tiene el nodo inicial seleccionado. Desactivelo pinchando en un nodo intermedio o en cualquier zona del grafo donde no haya nodo");
			            		alert(this.getAlertMessage(1));
			            	}
			            }else if(!document.getElementById('cb_initial_node').checked && document.getElementById('cb_final_node').checked){//Se quiere poner como final
			            	this.grafo_principal.addNode(node_id,heur,false,true);
			            }else if(document.getElementById('cb_initial_node').checked && document.getElementById('cb_final_node').checked){
			            	//alert("Un nodo no puede ser inicial y final a la vez"); 
			            	alert(this.getAlertMessage(2));    
			            }else{
			            	this.grafo_principal.addNode(node_id,heur,false,false);
			            }
			            this.resetNodeEntry();
			            if(!this.created_events){
			            	this.createNetworkEvents();
			            	$("#submenu").fadeIn("slow");
			            }
			            this.printInfo();
			        }else{
			        	//alert("Por favor, introduzca un valor heurístico estrictamente positivo.");
			        	alert(this.getAlertMessage(3));
			        }
		        }else{
		        	//alert("Por favor, introduzca un valor entero en el campo Valor heurístico.");
		        	alert(this.getAlertMessage(4));
		        }

	        }
	        catch (err) {
	            //alert(err);
	        }



	        if(this.grafo_principal.initialNodeExists()){
	        	document.getElementById('cb_initial_node').disabled=true;
	        	document.getElementById('cb_initial_node').checked=false;
	        }else{
	        	document.getElementById('cb_initial_node').disabled=false;
	        	document.getElementById('cb_initial_node').checked=false;
	        }
	    }	   
	}
	







	


	updateNode(){
		/*Estructura de los nodos:
	        id: identificador del nodo
	        label: lo que aparece en pantalla, el id del nodo junto con su función heurística
	        color: color del nodo
	        title: en este apartado guardaremos la heuristica
	    */
	    var node_id=document.getElementById('node-id').value;
		if(node_id==""){
			//alert("El id del nodo no puede estar vacio");
			alert(this.getAlertMessage(0));
		}else{
	        try {
	            var heur=parseInt(document.getElementById('node-heuristic').value);
	            
	            if(!isNaN(heur)){
	            	if(heur>=0){
	            		var error=this.grafo_principal.updateNode(node_id,heur,document.getElementById('cb_initial_node').checked,document.getElementById('cb_final_node').checked);
	            		switch(error){
			            	case -2: alert(this.getAlertMessage(2));
			            			//alert("Un nodo no puede ser inicial y final a la vez");
			            			break;//Codigo de error -2 me dice que se quiere poner un nodo como inicial y final
							case -1: alert(this.getAlertMessage(5));
									//alert("El nodo que se esta intentando actualizar no existe.");
									break; //Codigo de error -1 me dice que se quiere actualizar un nodo que no existe
			           		default: 
			           			this.is_initial_selected=false;

					            this.resetNodeEntry();
					            if(!this.created_events){
					            	this.createNetworkEvents();
					            	$("#submenu").fadeIn("slow");
					            }
					            this.printInfo();
			           			break; 
			           }
	            	}else{
	            		alert(this.getAlertMessage(3));
	            		//alert("Por favor, introduzca un valor heurístico estrictamente positivo.");
	            	}
	            }else{
	            	alert(this.getAlertMessage(4));
	            	//alert("Por favor, introduzca un valor entero en el campo Valor heurístico.");
	            }

	            

	        }
	        catch (err) {
	            //alert(err);
	        }



	        if(this.grafo_principal.initialNodeExists()){
	        	document.getElementById('cb_initial_node').disabled=true;
	        	document.getElementById('cb_initial_node').checked=false;
	        }else{
	        	document.getElementById('cb_initial_node').disabled=false;
	        	document.getElementById('cb_initial_node').checked=false;
	        }
	    }
	}







	






	removeNode(){
		try {
	    	var node_to_remove=document.getElementById('node-id').value;
	    	if(node_to_remove==""){
	    		alert(this.getAlertMessage(0));
				//alert("El id del nodo no puede estar vacio");
			}else{
		        if(this.grafo_principal.getNodeIds().includes(node_to_remove)){
			        
			        if(node_to_remove == this.grafo_principal.getInitialNodeId()){ //He borrado el nodo inicial
			        	document.getElementById('cb_initial_node').checked=false;
			        	document.getElementById('cb_initial_node').disabled=false;
			        	this.is_initial_selected=false;
			        }

			        this.grafo_principal.removeNode(node_to_remove);

					this.resetNodeEntry();

					if(!this.created_events){
			        	this.createNetworkEvents();
			        	$("#submenu").fadeIn("slow");
			        }
			        this.printInfo();
			    }else{
			    	alert(this.getAlertMessage(6));
			    	//alert("El nodo que intenta eliminar no existe.");
			    }
		    }

	    }
	    catch (err) {
	        //alert(err);
	    }

	    if(this.grafo_principal.initialNodeExists()){
	    	document.getElementById('cb_initial_node').disabled=true;
	    	document.getElementById('cb_initial_node').checked=false;
	    }else{
	    	document.getElementById('cb_initial_node').disabled=false;
	    	document.getElementById('cb_initial_node').checked=false;
	    }

	}






	





	addEdge(){
		var src=document.getElementById('edge-from').value;
		var dst=document.getElementById('edge-to').value;
		var cost=parseInt(document.getElementById('edge-cost').value);

		if(!isNaN(cost)){
        	if(cost>=0){
        		var error=this.grafo_principal.addEdge(src,dst,cost,document.getElementById('cb_directed_edge').checked);
				switch(error){
					case -1: alert(this.getAlertMessage(7)); 
							//alert("Ya existe una arista entre estos dos nodos"); 
							break;//El código de error -1 me dice que ya existe una arista entre esos dos nodos
					case -2: alert(this.getAlertMessage(8)); 
							//alert("Uno (o ambos) de los dos nodos no existe.");
							break;//El código de error -2 me dice que uno de los dos no existe
					default: 
						this.is_initial_selected=false;
			            this.resetEdgeEntry();
			            if(!this.created_events){
			            	this.createNetworkEvents();
			            	$("#submenu").fadeIn("slow");
			            }
			            this.printInfo();
			            break;
				}		
        	}else{
        		alert(this.getAlertMessage(9)); 
        		//alert("Por favor, introduzca un valor de coste estrictamente positivo.");
        	}
        }else{
        	alert(this.getAlertMessage(10));
        	//alert("Por favor, introduzca un valor entero en el campo Coste.");
        }

		
	}






	updateEdge(){
		var src=document.getElementById('edge-from').value;
		var dst=document.getElementById('edge-to').value;
		var cost=parseInt(document.getElementById('edge-cost').value);

		if(!isNaN(cost)){
        	if(cost>=0){
        		var error=this.grafo_principal.updateEdge(src,dst,Number(cost),document.getElementById('cb_directed_edge').checked);

				switch(error){
					case -1: alert(this.getAlertMessage(11)); 
							//alert("La arista que se esta intentando actualizar no existe."); 
							break;//El código de error -1 me dice que ya existe una arista entre esos dos nodos
					default: 
						this.is_initial_selected=false;
			            this.resetEdgeEntry();
			            if(!this.created_events){
			            	this.createNetworkEvents();
			            	$("#submenu").fadeIn("slow");
			            }
			            this.printInfo();
			            break;
				}
        	}else{
        		//alert("Por favor, introduzca un valor de coste estrictamente positivo.");
        		alert(this.getAlertMessage(9));
        	}
        }else{
        	//alert("Por favor, introduzca un valor entero en el campo Coste.");
        	alert(this.getAlertMessage(10));
        }



		
	}






	removeEdge(){
		var src=document.getElementById('edge-from').value;
		var dst=document.getElementById('edge-to').value;

		try{
			var edge_data=this.grafo_principal.getEdgeData();
			for(var i=0;i<edge_data.length;i++){
				if(edge_data[i][3]){//Arista dirigida
					if(edge_data[i][0]==src && edge_data[i][1]==dst){
						this.grafo_principal.removeEdge(src,dst);
						this.printInfo();
						return;
					}
				}else{//Arista bidireccional
					if((edge_data[i][0]==src && edge_data[i][1]==dst)){ 
						this.grafo_principal.removeEdge(src,dst);
						this.printInfo();
						return;
					}else if(edge_data[i][0]==dst && edge_data[i][1]==src){
						this.grafo_principal.removeEdge(dst,src);
						this.printInfo();
						return;
					}
				}		
			}
			//alert("La arista que trata de eliminar no existe.");
			alert(this.getAlertMessage(12));
		}catch(err){alert(err);}
		
	}





















	download(filename, text) {
	    var element = document.createElement('a');
	    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
	    element.setAttribute('download', filename);
	    element.style.display = 'none';
	    document.body.appendChild(element);
	    element.click();
	    document.body.removeChild(element);
	}








	







	exportNetwork(){
		try{
			if(this.is_initial_selected){
				alert(this.getAlertMessage(13));//alert("Por favor, seleccione el nuevo nodo inicial.");
			}else{
				if(!this.grafo_principal.initialNodeExists()){
			    	alert(this.getAlertMessage(14));//alert("Debe haber un (y solo un) nodo inicial");
			    }else if(this.grafo_principal.getEndNodesId().length==0){
			    	alert(this.getAlertMessage(15));//alert("Debe haber al menos un nodo final");
			    }else if(this.grafo_principal.getNumNodes()==0){
			        alert(this.getAlertMessage(16));//alert("No existen nodos finales.");
			    }else if(this.grafo_principal.getNumEdges()==0){
			        alert(this.getAlertMessage(17));//alert("No existen aristas.");
			    }else{
		            //Obtengo en string el codigo de los nodos y los edges
		            var code_nodes=this.grafo_principal.getNodes().get().toSource();
		            var code_edges=this.grafo_principal.getEdges().get().toSource();
		            var code_initial_node=this.grafo_principal.getInitialNodeId();
		            var code_end_nodes=this.grafo_principal.getEndNodesId().toSource();
		            this.download("grafo.txt",code_nodes+"*-*-*-*-*-*-*-*-*-*-"+code_edges+"*-*-*-*-*-*-*-*-*-*-"+code_initial_node+"*-*-*-*-*-*-*-*-*-*-"+code_end_nodes);
				}
			}
		}catch(err){
			//alert(err);
		}
	}









	readSingleFile(evt) {
		var f = evt.target.files[0];
		if (f) {
			var r = new FileReader();
			r.onload = (function(e) {
				var contents = e.target.result;
				
				var result=contents.split("*-*-*-*-*-*-*-*-*-*-");
				this.imported_nodes=result[0];
				this.imported_edges=result[1];
				this.imported_initial_node=result[2];
				this.imported_end_nodes=result[3];

	            if(this.imported_nodes!=null && this.imported_edges!=null && this.imported_initial_node!=null && this.imported_end_nodes!=null){
	                $("#import-network-btn").prop("disabled",false);
	            }else{
	            	alert(this.getAlertMessage(18));//alert("El fichero no ha podido interpretarse");
	            }
			}).bind(this);
			r.readAsText(f);
		} else { 
			alert(this.getAlertMessage(19));//alert("Fallo al importar el archivo.");
		}
	}









	importNetwork(){
		try{
	    	var nodes = new vis.DataSet();
	        var edges = new vis.DataSet();
	        var node_heuristics=[];
	        var container = document.getElementById('network');



	        //---------------------------------INICIO IMPORTACION DE NODOS---------------------------------//
	        var string_nodes=this.imported_nodes.substr(1, this.imported_nodes.length-2).split("}, ");
	        var nnodes=string_nodes.length;
	        var node_color;
	        var potential_initial=null;
	        var potentials_end=[];
	        var potentials_nodes=[];

	        for(var i=0; i<nnodes; i++) {
	            if(i==nnodes-1){
	                string_nodes[i]=string_nodes[i].substr(1, string_nodes[i].length-2);    
	            }else{
	                string_nodes[i]=string_nodes[i].substr(1, string_nodes[i].length-1);
	            }


	            var splitted_by_comma=string_nodes[i].split(",");
	            var nfeatures=splitted_by_comma.length;
	            
	            if(nfeatures<=4){ //Caso general, nodo con color explicitamente
	            	string_nodes[i]=splitted_by_comma;
	            	

	                for(var j=0; j<string_nodes[i].length; j++) {
	                    string_nodes[i][j]=string_nodes[i][j].split(":")
	                }

	                if(string_nodes[i].length==4){ //Nodo que especifica el color
	                	if(string_nodes[i][3][1].substr(1,string_nodes[i][3][1].length-2)==this.grafo_principal.getInitialColor()){
	                		potential_initial=string_nodes[i][0][1].substr(1,string_nodes[i][0][1].length-2); //Me quedo con el ID del supuesto inicial
	                		potentials_nodes.push(string_nodes[i][0][1].substr(1,string_nodes[i][0][1].length-2));
	                	}else if(string_nodes[i][3][1].substr(1,string_nodes[i][3][1].length-2)==this.grafo_principal.getEndColor()){
	                		potentials_end.push(string_nodes[i][0][1].substr(1,string_nodes[i][0][1].length-2));
	                		potentials_nodes.push(string_nodes[i][0][1].substr(1,string_nodes[i][0][1].length-2));
	                	}
	                	nodes.add({
	                        id: string_nodes[i][0][1].substr(1,string_nodes[i][0][1].length-2),
	                        label: string_nodes[i][0][1].substr(1,string_nodes[i][0][1].length-2)+"\n(H="+string_nodes[i][2][1]+")",
	                        title: Number(string_nodes[i][2][1]), //Heuristica del nodo
	                        color: string_nodes[i][3][1].substr(1,string_nodes[i][3][1].length-2)
	                    });   
	                    node_heuristics.push(Number(string_nodes[i][2][1]));
	                }else if(string_nodes[i].length==3){ // Nodo intermedio
	                    nodes.add({
	                        id: string_nodes[i][0][1].substr(1,string_nodes[i][0][1].length-2),
	                        label: string_nodes[i][0][1].substr(1,string_nodes[i][0][1].length-2)+"\n(H="+string_nodes[i][2][1]+")",
	                        title: Number(string_nodes[i][2][1]), //Heuristica del nodo
	                        color: {background:'#97C2FC', border:'#2B7CE9',highlight:{background:'#D2E5FF',border:'#2B7CE9'}}
	                    });
	                    node_heuristics.push(Number(string_nodes[i][2][1]));
	                    potentials_nodes.push(string_nodes[i][0][1].substr(1,string_nodes[i][0][1].length-2));
	                }
	            
	            }else{ //Nodo intermedio modificado por los eventos MODIFICAR AQUI SI SE AÑADEN COSAS AL COLOR EN LOS EVENTOS
	            	string_nodes[i]=string_nodes[i].split("{");
	            	node_color="{"+string_nodes[i][1]+"{"+string_nodes[i][2];

	            	var features=string_nodes[i][0].substr(0,string_nodes[i][0].length-1);
	            	features=features.split(",");
	            	features.splice(-1,1); //Elimino el ultimo elemento, la palabra "color"

	            	for(var j=0; j<features.length; j++) {
	            		features[j]=features[j].split(":")[1];
	            	}
	            	
	            	nodes.add({
	                    id: features[0].substr(1,features[0].length-2),
	                    label: features[0].substr(1,features[0].length-2)+"\n(H="+features[2]+")",
	                    title: Number(features[2]), //Heuristica del nodo
	                    color: {background:'#97C2FC', border:'#2B7CE9',highlight:{background:'#D2E5FF',border:'#2B7CE9'}}
	                });
	                node_heuristics.push(Number(features[2]));
	                potentials_nodes.push(features[0].substr(1,features[0].length-2));
	            }

	        }
	        //-----------------------------------FIN IMPORTACION DE NODOS----------------------------------//

	        if(potential_initial!=this.imported_initial_node){ //Compruebo si el nodo inicial se corresponde con la realidad
	        	alert(this.getAlertMessage(20));//alert("El archivo no ha podido interpretarse: el nodo inicial ha sido manipulado");
	        	return undefined;
	        }


	        for(i=0;i<potentials_end.length;i++){ //Compruebo si los nodos finales se corresponden con la realidad
	        	if(!this.imported_end_nodes.includes(potentials_end[i])){ //Compruebo si el nodo inicial se corresponde con la realidad
	        		alert(this.getAlertMessage(21));//alert("El archivo no ha podido interpretarse: los nodos finales han sido manipulados"); //Los nodos finales han sido manipulados
	        		return undefined;
	        	}
	        }

	        //---------------------------------INICIO IMPORTACION DE ARISTAS---------------------------------//
	        var string_edges=this.imported_edges.substr(1, this.imported_edges.length-2).split("}, ");
	        var nedges=string_edges.length;
	    
	        for(var i=0; i<nedges; i++) {
	            if(i==nedges-1){
	                string_edges[i]=string_edges[i].substr(1, string_edges[i].length-2);    
	            }else{
	                string_edges[i]=string_edges[i].substr(1, string_edges[i].length-1);
	            }


	            string_edges[i]=string_edges[i].split(",");

	            for(var j=0; j<string_edges[i].length; j++) {
	                string_edges[i][j]=string_edges[i][j].split(":")
	            }

	            if(string_edges[i].length==4){ //Arista bidireccional 
	                if(!(potentials_nodes.includes(string_edges[i][0][1].substr(1,string_edges[i][0][1].length-2)) && potentials_nodes.includes(string_edges[i][1][1].substr(1,string_edges[i][1][1].length-2)))){
	                	alert(this.getAlertMessage(22));//alert("El archivo no ha podido interpretarse: faltan nodos."); //Los nodos finales han sido manipulados
	        			return undefined;
	                }
	                edges.add({
	                    from: string_edges[i][0][1].substr(1,string_edges[i][0][1].length-2),
	                    to: string_edges[i][1][1].substr(1,string_edges[i][1][1].length-2),
	                    id: string_edges[i][2][1].substr(1,string_edges[i][2][1].length-2),
	                    label: Number(string_edges[i][3][1])
	                });


	            }else if(string_edges[i].length==5){ //Arista dirigida
	            	if(!(potentials_nodes.includes(string_edges[i][0][1].substr(1,string_edges[i][0][1].length-2)) && potentials_nodes.includes(string_edges[i][1][1].substr(1,string_edges[i][1][1].length-2)))){
	                	alert(this.getAlertMessage(22));//alert("El archivo no ha podido interpretarse: faltan nodos."); //Los nodos finales han sido manipulados
	        			return undefined;
	                }
	                edges.add({
	                    from: string_edges[i][0][1].substr(1,string_edges[i][0][1].length-2),
	                    to: string_edges[i][1][1].substr(1,string_edges[i][1][1].length-2),
	                    id: string_edges[i][2][1].substr(1,string_edges[i][2][1].length-2),
	                    label: Number(string_edges[i][3][1]),
	                    arrows: string_edges[i][4][1].substr(1,string_edges[i][4][1].length-2)
	                });
	            }
	        }
	        //-----------------------------------FIN IMPORTACION DE ARISTAS----------------------------------//

	        //-----------------------------------IDENTIFICACION NODO INICIAL---------------------------------//
	        var initial_node_id=this.imported_initial_node;
	        //---------------------------------FIN IDENTIFICACION NODO INICIAL-------------------------------//


	        //----------------------------------IDENTIFICACION NODOS FINALES---------------------------------//
	        var end_nodes_id=[];
	        this.imported_end_nodes=this.imported_end_nodes.substr(1,this.imported_end_nodes.length-2).split(", ");
	        for(var i=0; i<this.imported_end_nodes.length; i++){
	            this.imported_end_nodes[i]=this.imported_end_nodes[i].substr(1,this.imported_end_nodes[i].length-2);
	            end_nodes_id.push(this.imported_end_nodes[i]);
	        }
	        //--------------------------------FIN IDENTIFICACION NODOS FINALES-------------------------------//

	        this.grafo_principal.setContent("network",nodes,edges,node_heuristics,initial_node_id,end_nodes_id);
	 		this.is_initial_selected=false;
            this.resetForm();
            this.createNetworkEvents();
            this.printInfo();

            //Ocultamos el cuadro de importar y dibujar
            $("#network-form-div").hide();
			$("#import-network-div").hide();

			//ponemos el submenu de generar y tal
			$("#submenu").fadeIn("slow");
	    }catch (err) {
	        alert(err);
	    }

	}






























	checkMaxProf(){
		var e = document.getElementById("algorithm-select");
	    var strUser = e.options[e.selectedIndex].value;
	    switch(strUser){
			case "iterative-descent":
				$("#max_prof_div").show();
				break;
			default:
				$("#max_prof_div").hide();
				break;
		}
	}














	solveNetwork(){
		var iter_bound=parseInt(document.getElementById("max_iter_bound").value);
		var correct=false;
		
		if(!this.grafo_principal.initialNodeExists()){
	    	alert(this.getAlertMessage(14));//alert("Debe haber un (y solo un) nodo inicial");
	    }else if(this.grafo_principal.getEndNodesId().length==0){
	    	alert(this.getAlertMessage(15));//alert("Debe haber al menos un nodo final");
	    }else if(this.grafo_principal.getNumNodes()==0){
	        alert(this.getAlertMessage(16));//alert("No existen nodos finales.");
	    }else if(this.grafo_principal.getNumEdges()==0){
	        alert(this.getAlertMessage(17));//alert("No existen aristas.");
	    }else if(isNaN(iter_bound)){
	    	alert(this.getAlertMessage(23));
	    	//alert("Por favor, introduzca un valor numérico entre "+document.getElementById("max_iter_bound").min+" y "+document.getElementById("max_iter_bound").max+" en el campo número máximo de iteraciones.");
	    }else if(iter_bound<1 || iter_bound>Number(document.getElementById("max_iter_bound").max)){
	    	alert(this.getAlertMessage(24));
	    	//alert("Por favor, introduzca un numero máximo de iteraciones entre "+document.getElementById("max_iter_bound").min+" y "+document.getElementById("max_iter_bound").max+".");
	    }else{
	    	var e = document.getElementById("algorithm-select");
	    	var strUser = e.options[e.selectedIndex].value;
	        switch(strUser) {
	            case "deep-search":
	            	//alert("Has elegido Busqueda en profundidad.");
	            	try{
		            	this.resolution=this.algorithms.deepSearch(this.grafo_principal.getNodes(),
		            								this.grafo_principal.getEdges(),
		            								this.grafo_principal.getInitialNodeId(),
		            								this.grafo_principal.getEndNodesId(),
		            								iter_bound);
		            	correct=true;
	                	switch(this.language){
		                	case 'language-es': document.getElementById("act-estate-algorithm-name").textContent="Estado actual del grafo: Búsqueda en profundidad."; break;	
		                	case 'language-en': document.getElementById("act-estate-algorithm-name").textContent="Network current status: Deep search."; break;
		                }
	                }catch(err){
	                	//alert(err);
	                }
	                
	                
	                
	                break;
	            case "astar":
	                try{
		            	this.resolution=this.algorithms.astar(this.grafo_principal.getNodes(),
		            								this.grafo_principal.getEdges(),
		            								this.grafo_principal.getInitialNodeId(),
		            								this.grafo_principal.getEndNodesId(),
		            								iter_bound);
		            	correct=true;
	                	switch(this.language){
		                	case 'language-es': document.getElementById("act-estate-algorithm-name").textContent="Estado actual del grafo: A*."; break;	
		                	case 'language-en': document.getElementById("act-estate-algorithm-name").textContent="Network current status: A*."; break;
		                }
	                }catch(err){
	                	//alert(err);
	                }
	                
	                break;

	           	case "wide-search":
	           		try{
		            	this.resolution=this.algorithms.wideSearch(this.grafo_principal.getNodes(),
		            								this.grafo_principal.getEdges(),
		            								this.grafo_principal.getInitialNodeId(),
		            								this.grafo_principal.getEndNodesId(),
		            								iter_bound);
		            	correct=true;
		            	
		            	switch(this.language){
		                	case 'language-es': document.getElementById("act-estate-algorithm-name").textContent="Estado actual del grafo: Búsqueda en anchura."; break;	
		                	case 'language-en': document.getElementById("act-estate-algorithm-name").textContent="Network current status: Wide search."; break;
		                }
	                }catch(err){
	                	//alert(err);
	                }
	                
	                break;

				case "retroactive-search":
					try{
		            	this.resolution=this.algorithms.retroactiveSearch(this.grafo_principal.getNodes(),
		            								this.grafo_principal.getEdges(),
		            								this.grafo_principal.getInitialNodeId(),
		            								this.grafo_principal.getEndNodesId(),
		            								iter_bound);
		            	correct=true;
	                	switch(this.language){
		                	case 'language-es': document.getElementById("act-estate-algorithm-name").textContent="Estado actual del grafo: Búsqueda retroactiva."; break;	
		                	case 'language-en': document.getElementById("act-estate-algorithm-name").textContent="Network current status: Retroactive search."; break;
		                }
	                }catch(err){
	                	//alert(err);
	                }
	                
	                break;

				case "iterative-descent":
					try{

						var prof_bound=parseInt(document.getElementById("max_prof").value);

						if(isNaN(prof_bound)){
	    					alert(this.getAlertMessage(25));//alert("Por favor, introduzca un valor numérico entre "+document.getElementById("max_prof").min+" y "+document.getElementById("max_prof").max+" en el campo máxima profundidad.");
	    				}else if(prof_bound<1 || prof_bound>document.getElementById("max_prof").max){
	    					alert(this.getAlertMessage(26));//alert("Por favor, introduzca un numero máximo de iteraciones entre "+document.getElementById("max_prof").min+" y "+document.getElementById("max_prof").max+".");
	    				}else{
			            	this.resolution=this.algorithms.iterativeDescent(this.grafo_principal.getNodes(),
			            								this.grafo_principal.getEdges(),
			            								this.grafo_principal.getInitialNodeId(),
			            								this.grafo_principal.getEndNodesId(),
			            								prof_bound+1,
			            								iter_bound);
	                		correct=true;
	                		
	                		switch(this.language){
			                	case 'language-es': document.getElementById("act-estate-algorithm-name").textContent="Estado actual del grafo: Descenso iterativo."; break;	
			                	case 'language-en': document.getElementById("act-estate-algorithm-name").textContent="Network current status: Iterative descent."; break;
			                }

	                	}
	                }catch(err){
	                	//alert(err);
	                }
	                
	                break;

				case "uniform-cost":
					try{
		            	this.resolution=this.algorithms.uniformCost(this.grafo_principal.getNodes(),
		            								this.grafo_principal.getEdges(),
		            								this.grafo_principal.getInitialNodeId(),
		            								this.grafo_principal.getEndNodesId(),
		            								iter_bound);
		            	correct=true;
		            	switch(this.language){
		                	case 'language-es': document.getElementById("act-estate-algorithm-name").textContent="Estado actual del grafo: Búsqueda de costo uniforme (Dijkstra)."; break;	
		                	case 'language-en': document.getElementById("act-estate-algorithm-name").textContent="Network current status: Uniform cost (Dijkstra)."; break;
		                }
	                }catch(err){
	                	//alert(err);
	                }
	                
	                break;


				case "simple-climbing":
					try{
		            	this.resolution=this.algorithms.simpleClimbing(this.grafo_principal.getNodes(),
		            								this.grafo_principal.getEdges(),
		            								this.grafo_principal.getInitialNodeId(),
		            								this.grafo_principal.getEndNodesId(),
		            								iter_bound);
		            	correct=true;
		            	switch(this.language){
		                	case 'language-es': document.getElementById("act-estate-algorithm-name").textContent="Estado actual del grafo: Escalada simple."; break;	
		                	case 'language-en': document.getElementById("act-estate-algorithm-name").textContent="Network current status: Simple climbing."; break;
		                }
	                }catch(err){
	                	//alert(err);
	                }
	                
	                break;

				case "max-climbing":
					try{
		            	this.resolution=this.algorithms.maxClimbing(this.grafo_principal.getNodes(),
		            								this.grafo_principal.getEdges(),
		            								this.grafo_principal.getInitialNodeId(),
		            								this.grafo_principal.getEndNodesId(),
		            								iter_bound);
		            	correct=true;
	                	switch(this.language){
		                	case 'language-es': document.getElementById("act-estate-algorithm-name").textContent="Estado actual del grafo: Escalada por la máxima pendiente."; break;	
		                	case 'language-en': document.getElementById("act-estate-algorithm-name").textContent="Network current status: Maximum slope climbing."; break;
		                }
	                }catch(err){
	                	//alert(err);
	                }
	                
	                break;
	        }

	        if(correct){
		        $("#select-algorithm").fadeOut("fast");
		    	$("#control-buttons").fadeIn("slow");
		    	$("#heuristic-generation").hide();
		    	this.index_step=0;
		    	this.grafo_solucion.setContent_solution("solution_network",this.resolution.steps[this.index_step]);
		    	document.getElementById('textarea-explanation').value=this.resolution.descriptions[this.index_step];
		        document.getElementById('textarea-openclosed').value=this.resolution.lists[this.index_step];
	    	}
	    }
	}
	

	solutionStepForward(){
		if(this.index_step<this.resolution.descriptions.length-1){
			this.index_step+=1;
			this.grafo_solucion.setContent_solution("solution_network",this.resolution.steps[this.index_step]);
	    	document.getElementById('textarea-explanation').value=this.resolution.descriptions[this.index_step];
	        document.getElementById('textarea-openclosed').value=this.resolution.lists[this.index_step];
		}
	}

	solutionStepBack(){
		if(this.index_step>0){
			this.index_step-=1;
			this.grafo_solucion.setContent_solution("solution_network",this.resolution.steps[this.index_step]);
	    	document.getElementById('textarea-explanation').value=this.resolution.descriptions[this.index_step];
	        document.getElementById('textarea-openclosed').value=this.resolution.lists[this.index_step];
		}
	}

	solutionFirstStep(){
		if(this.index_step!=0){
			this.index_step=0;
			this.grafo_solucion.setContent_solution("solution_network",this.resolution.steps[this.index_step]);
	    	document.getElementById('textarea-explanation').value=this.resolution.descriptions[this.index_step];
	        document.getElementById('textarea-openclosed').value=this.resolution.lists[this.index_step];
		}
	}

	solutionLastStep(){
		var lstep=this.resolution.descriptions.length-1;
		if(this.index_step!=lstep){
			this.index_step=lstep;
			this.grafo_solucion.setContent_solution("solution_network",this.resolution.steps[this.index_step]);
	    	document.getElementById('textarea-explanation').value=this.resolution.descriptions[this.index_step];
	        document.getElementById('textarea-openclosed').value=this.resolution.lists[this.index_step];
		}
	}






	generateHeuristic(){
		if(this.is_initial_selected){
	    		alert(this.getAlertMessage(13));//alert("Por favor, seleccione el nuevo nodo inicial.");
		}else{
			if(!this.grafo_principal.initialNodeExists()){
		    	alert(this.getAlertMessage(14));//alert("Debe haber un (y solo un) nodo inicial");
		    }else if(this.grafo_principal.getEndNodesId().length==0){
		    	alert(this.getAlertMessage(15));//alert("Debe haber al menos un nodo final");
		    }else if(this.grafo_principal.getNumNodes()==0){
		        alert(this.getAlertMessage(16));//alert("No existen nodos finales.");
		    }else if(this.grafo_principal.getNumEdges()==0){
		        alert(this.getAlertMessage(17));//alert("No existen aristas.");
		    }else if(document.getElementById("min-changes-bound").value == "" && document.getElementById("max-changes-bound").value == "" && !document.getElementById("cb_admisible_heur").checked){
            	alert(this.getAlertMessage(27));//alert("Debe introducir valores en los campos de rango si desea generar una heuristica que provoque cambios en cerrados.");
		    }else{

	        	var min_cambios=parseInt(document.getElementById("min-changes-bound").value);
	        	var max_cambios=parseInt(document.getElementById("max-changes-bound").value);

	        	var max_intentos=100;
	            var generar_admisible=document.getElementById("cb_admisible_heur").checked; //Miramos a ver si se quiere una heur admisible o no
	            var heuristica_generada;
	            if(generar_admisible){//SE DESEA GENERAR UNA HEURISTICA ADMISIBLE
	            	try{
		            	heuristica_generada=this.algorithms.getNewHeuristic(	this.grafo_principal.getNodes(),
		            														this.grafo_principal.getEdges(),
		            														this.grafo_principal.getInitialNodeId(),
		            														this.grafo_principal.getEndNodesId(),
		            														min_cambios,
		            														max_cambios,
		            														max_intentos,
		            														generar_admisible);
	            	}catch(err){
	            		//alert(err);
	            	}
		            if(heuristica_generada.changes<0){
		            	alert(this.getAlertMessage(28,heuristica_generada));
		            	//alert(this.grafo_principal.getNodeIds().toSource()+"\n"+heuristica_generada.heur.toSource()+".\nSe ha encontrado una heuristica ADMISIBLE, pero no se puede encontrar un camino al final.");
		            	this.grafo_principal.updateHeuristics(this.grafo_principal.getNodeIds(),heuristica_generada.heur);
		            }else if(heuristica_generada!=null){
		            	alert(this.getAlertMessage(29,heuristica_generada));
		            	//alert(this.grafo_principal.getNodeIds().toSource()+"\n"+heuristica_generada.heur.toSource()+".\nEsta heuristica ES ADMISIBLE. provocará "+heuristica_generada.changes+" actualizaciones en cerrados para el algoritmo A*.");
		            	this.grafo_principal.updateHeuristics(this.grafo_principal.getNodeIds(),heuristica_generada.heur);
		            }else{
		            	alert(this.getAlertMessage(30));
		            	//alert("No ha sido posible encontrar una heuristica que cumpla los requisitos.\nPuede probar de nuevo con los mismos parametros. Si no se consigue encontrar la heuristica, debería plantearse cambiar el rango del numero de actualizaciones que desea provocar.");
		            }


	            }else{//SE DESEA GENERAR UNA HEURISTICA QUE GENERE CAMBIOS
	            	if(!isNaN(min_cambios) && !isNaN(min_cambios)){
			            if(min_cambios<=max_cambios && min_cambios>=0){
				            try{
					            heuristica_generada=this.algorithms.getNewHeuristic(	this.grafo_principal.getNodes(),
			            															this.grafo_principal.getEdges(),
			            															this.grafo_principal.getInitialNodeId(),
			            															this.grafo_principal.getEndNodesId(),
			            															min_cambios,
			            															max_cambios,
			            															max_intentos,
			            															generar_admisible);
				            }catch(err){
				            	//alert(err);
				            }
				            if(heuristica_generada!=null){
					            if(heuristica_generada.changes<0){
					            	alert(this.getAlertMessage(28,heuristica_generada));
					            	//alert(this.getAlertMessage(31,heuristica_generada));
					            	//alert(this.grafo_principal.getNodeIds().toSource()+"\n"+heuristica_generada.heur.toSource()+".\nSe ha encontrado una heuristica ADMISIBLE, pero no se puede encontrar un camino al final.");
					            	this.grafo_principal.updateHeuristics(this.grafo_principal.getNodeIds(),heuristica_generada.heur);
				            	}else{
					            	alert(this.getAlertMessage(31,heuristica_generada));
					            	//alert(this.grafo_principal.getNodeIds().toSource()+"\n"+heuristica_generada.heur.toSource()+".\nEsta heuristica provocará "+heuristica_generada.changes+" actualizaciones en cerrados para el algoritmo A*.");
					            	this.grafo_principal.updateHeuristics(this.grafo_principal.getNodeIds(),heuristica_generada.heur);
					            }
					        }else{
								alert(this.getAlertMessage(30));//alert("No ha sido posible encontrar una heuristica que cumpla los requisitos.\nPuede probar de nuevo con los mismos parametros. Si no se consigue encontrar la heuristica, debería plantearse cambiar el rango del numero de actualizaciones que desea provocar.");      	
					        }
			            }else{
			            	alert(this.getAlertMessage(31));//alert("El rango de actualizaciones no es válido. El número mínimo de actualizaciones debe ser mayor o igual que 0 y menor o igual que el número máximo");
			            }
			        }else{
			        	alert(this.getAlertMessage(32));//alert("Por favor, introduzca valores numéricos enteros en los campos de número mínimo y máximo de cambios.");
			        }
	            }
	            this.printInfo();
			}
		}
	}

	






	initialization(){
		$("#import-network-input").val("");
		$("#submenu").hide();
		//Resetear el formulario de dibujar cuando se recarga la pagina:
		this.resetForm();
		
	    //FIN RESETEO FORMULARIO
		$("#resolution").hide();
		$("#import-network-btn").prop("disabled",true);
		$("#import-network-input").on("change",$.proxy(this.readSingleFile,this)); //Ligamos la funcion readSingleFile al contexto this(Interface_Handler)


		$("#close-resolution-mode").hide();
		$("#heuristic-generation").hide();


		$("#network-form-div").hide();
		$("#import-network-div").hide();


		$("#despliegue_dibujar").click(function(){
			$("#import-network-div").hide();
			$("#network-form-div").toggle("slow");
			$("#heuristic-generation").hide();
			$("#resolution").hide();
			//Si cierro el apartado de resolucion tengo que volver a activar el modulo para ir a resolver grafo
			$("#end-network").fadeIn("slow");
			$("#close-resolution-mode").fadeOut("slow");
		});

		$("#despliegue_importar").click(function(){
			$("#network-form-div").hide();
			$("#import-network-div").toggle("slow");
			$("#heuristic-generation").hide();
			$("#resolution").hide();
			//Si cierro el apartado de resolucion tengo que volver a activar el modulo para ir a resolver grafo
			$("#end-network").fadeIn("slow");
			$("#close-resolution-mode").fadeOut("slow");
		});

	}





	resetNodeEntry(){
		$("#node-id").val("");
		$("#node-heuristic").val("");

		if(!this.grafo_principal.initialNodeExists()){//Si el nodo inicial NO existe
			$("#cb_initial_node").attr("disabled", false);
			$("#cb_initial_node").attr("checked", false);
		}else{
			$("#cb_initial_node").attr("disabled", true);
			$("#cb_initial_node").attr("checked", false);
		}

		$("#cb_final_node").attr("disabled", false);
		$("#cb_final_node").attr("checked", false);
	}



	resetEdgeEntry(){
	      $("#edge-from").val("");
	      $("#edge-to").val("");
	      $("#edge-cost").val("");
	      $("#cb_directed_edge").attr("disabled", false);
	      $("#cb_directed_edge").attr("checked", false);
	}


	resetForm(){
		this.resetNodeEntry();
		this.resetEdgeEntry();
	}









	goResolutionMode(){
		if(!this.grafo_principal.initialNodeExists()){
	    	alert(this.getAlertMessage(14));//alert("Debe haber un (y solo un) nodo inicial");
	    }else if(this.grafo_principal.getEndNodesId().length==0){
	    	alert(this.getAlertMessage(15));//alert("Debe haber al menos un nodo final");
	    }else if(this.grafo_principal.getNumNodes()==0){
	        alert(this.getAlertMessage(16));//alert("No existen nodos finales.");
	    }else if(this.grafo_principal.getNumEdges()==0){
	        alert(this.getAlertMessage(17));//alert("No existen aristas.");
	    }else{
	        //Damos paso a la interfaz de resolucion con jQuery
	        this.checkMaxProf();
	        $("#end-network").fadeOut("slow");
	        $("#resolution").fadeIn("slow");
	        $("#select-algorithm").fadeIn("fast");
	        
	        $("#control-buttons").hide();

	        $("#close-resolution-mode").fadeIn("slow");
	        $("#heuristic-generation").hide();

	        //Ocultamos el cuadro de importar y dibujar
            $("#network-form-div").hide();
			$("#import-network-div").hide();
	    }
	}

	closeResolutionMode(){
	      $("#control-buttons").hide();
	      $("#select-algorithm").fadeIn("fast");
	      $("#resolution").fadeOut("slow");
	      $("#end-network").fadeIn("slow");
	      $("#close-resolution-mode").fadeOut("slow");
	      $("#heuristic-generation").hide();
	}



	backToSelectAlgorithm(){
	      $("#control-buttons").fadeOut("fast");
	      $("#select-algorithm").fadeIn("slow");
	      $("#textarea-explanation").val("");
	      $("textarea-openclosed").val("");
	      $("#heuristic-generation").hide();
	}



	showDivGenerateHeuristic(){
		$("#resolution").fadeOut("slow");
		$("#heuristic-generation").toggle("slow");
		$("#principal").fadeIn("slow");
		$("#end-network").fadeIn("slow");
		$("#close-resolution-mode").fadeOut("slow");
		//Ocultamos el cuadro de importar y dibujar
        $("#network-form-div").hide();
		$("#import-network-div").hide();

		this.admisibleHeurChange();
	}


	admisibleHeurChange(){
	      var state=document.getElementById("cb_admisible_heur").checked;
	      document.getElementById("min-changes-bound").disabled = state;
	      document.getElementById("max-changes-bound").disabled = state;
	}

	printInfo(){
		switch(this.language){
			case 'language-es': document.getElementById("rest-of-data-div").innerHTML=this.grafo_principal.getDescription()['language_es'];break;
			case 'language-en': document.getElementById("rest-of-data-div").innerHTML=this.grafo_principal.getDescription()['language_en'];break;	
		}
	}














	createNetworkEvents(){
		var net=this.grafo_principal.getNetwork();
		net.on("click", params => {
			params.event = "[original event]";
			
			var heuristics=this.grafo_principal.getNodeHeuristics();
			var node_ids=this.grafo_principal.getNodeIds();
			var initial_node_id=this.grafo_principal.getInitialNodeId();
			var end_nodes_id=this.grafo_principal.getEndNodesId();

			if(params.nodes[0]!=null){ //Se ha pinchado un nodo
				this.resetEdgeEntry();


				$("#node-id").val(params.nodes[0]);


				$("#node-id").prop("disabled",true); //Bloqueamos el campo ID de nodo

	    		var heur_nodo=heuristics[node_ids.indexOf(params.nodes[0])]
	    		$("#node-heuristic").val(heur_nodo);

	    		if (initial_node_id==params.nodes[0]){
	    			$("#cb_initial_node").attr("checked", true);
	    			$("#cb_final_node").attr("checked", false);
	    		}else if(end_nodes_id.includes(params.nodes[0])){
	    			$("#cb_initial_node").attr("checked", false);
	    			$("#cb_final_node").attr("checked", true);
	    		}else{
	    			$("#cb_initial_node").attr("checked", false);
	    			$("#cb_final_node").attr("checked", false);
	    		}

				
				if(this.is_initial_selected){//Estamos esperando cambio, inicial seleccionado
					if(end_nodes_id.includes(params.nodes[0])){//Si un nodo es final y se pincha el con el inicial seleccionado, da error.
						alert(this.getAlertMessage(33));//alert("Un nodo final no puede ponerse como inicial.");
					}else{
						this.grafo_principal.updateNode(params.nodes[0],heuristics[node_ids.indexOf(params.nodes[0])],true,false);
						this.is_initial_selected=false;
					}
					$("#cb_initial_node").attr("checked", true);
					$("#cb_final_node").attr("checked", false);
				}else if(params.nodes[0]==initial_node_id){ //Si se ha pinchado en el nodo inicial sin que estuviera seleccionado, queda seleccionado
					this.grafo_principal.setColorNodeSelected(initial_node_id);
					this.is_initial_selected=true;
				}
				
				this.printInfo();
			}else if(params.edges[0]!=null){
				this.resetNodeEntry();

				$("#node-id").prop("disabled",false); //Desbloqueamos el campo ID de nodo


				var edge_data = this.grafo_principal.getEdges().get({
				  fields: ['id','from','to','label','arrows'],    // output the specified fields only
				});
				
				for(var i=0;i<edge_data.length;i++){
					if(edge_data[i].id == params.edges[0]){
						$("#edge-from").val(edge_data[i].from);
						$("#edge-to").val(edge_data[i].to);
						$("#edge-cost").val(Number(edge_data[i].label));
						if(edge_data[i].arrows=="to"){
							$("#cb_directed_edge").attr("checked", true);
						}

						break;
					}
				}
			}else{ //QUEDA QUE SE DESELECCIONE EL INICIAL
				$("#node-id").prop("disabled",false); //Desbloqueamos el campo ID de nodo
				this.resetForm();
				if(this.grafo_inicial.initialNodeExists()){
					this.grafo_principal.setColorNodeInitial(initial_node_id);
					this.is_initial_selected=false;
				}
			}
		});




		//Con doble click se ponen los nodos finales
		net.on("doubleClick", params => {
			params.event = "[original event]";

			var heuristics=this.grafo_principal.getNodeHeuristics();
			var node_ids=this.grafo_principal.getNodeIds();
			var initial_node_id=this.grafo_principal.getInitialNodeId();
			var end_nodes_id=this.grafo_principal.getEndNodesId();
			
			if(params.nodes[0]==initial_node_id){
				alert(this.getAlertMessage(34));//alert("El nodo inicial no puede ser final.");
			}else{
				//Si el nodo ya era final, deja de ser final.
				if(end_nodes_id.includes(params.nodes[0])){
					this.grafo_principal.updateNode(params.nodes[0],heuristics[node_ids.indexOf(params.nodes[0])],false,false);
				}else if(params.nodes[0]!=null){//Si el nodo no es final, pasa a ser final
					this.grafo_principal.updateNode(params.nodes[0],heuristics[node_ids.indexOf(params.nodes[0])],false,true);
				}
			}

			this.printInfo();
		});
		this.created_events=true;
	}






	translateCurrentStatus(){
		var e = document.getElementById("algorithm-select");
    	var strUser = e.options[e.selectedIndex].value;
        switch(strUser) {
            case "deep-search":
            	//alert("Has elegido Busqueda en profundidad.");
            	try{
	            	switch(this.language){
	                	case 'language-es': document.getElementById("act-estate-algorithm-name").textContent="Estado actual del grafo: Búsqueda en profundidad."; break;	
	                	case 'language-en': document.getElementById("act-estate-algorithm-name").textContent="Network current status: Deep search."; break;
	                }
                }catch(err){
                	//alert(err);
                }
                
                
                
                break;
            case "astar":
                try{
	            	switch(this.language){
	                	case 'language-es': document.getElementById("act-estate-algorithm-name").textContent="Estado actual del grafo: A*."; break;	
	                	case 'language-en': document.getElementById("act-estate-algorithm-name").textContent="Network current status: A*."; break;
	                }
                }catch(err){
                	//alert(err);
                }
                
                break;

           	case "wide-search":
           		try{
	            	switch(this.language){
	                	case 'language-es': document.getElementById("act-estate-algorithm-name").textContent="Estado actual del grafo: Búsqueda en anchura."; break;	
	                	case 'language-en': document.getElementById("act-estate-algorithm-name").textContent="Network current status: Wide search."; break;
	                }
                }catch(err){
                	//alert(err);
                }
                
                break;

			case "retroactive-search":
				try{
	            	switch(this.language){
	                	case 'language-es': document.getElementById("act-estate-algorithm-name").textContent="Estado actual del grafo: Búsqueda retroactiva."; break;	
	                	case 'language-en': document.getElementById("act-estate-algorithm-name").textContent="Network current status: Retroactive search."; break;
	                }
                }catch(err){
                	//alert(err);
                }
                
                break;

			case "iterative-descent":
				try{
                		
            		switch(this.language){
	                	case 'language-es': document.getElementById("act-estate-algorithm-name").textContent="Estado actual del grafo: Descenso iterativo."; break;	
	                	case 'language-en': document.getElementById("act-estate-algorithm-name").textContent="Network current status: Iterative descent."; break;
	                }

                	
                }catch(err){
                	//alert(err);
                }
                
                break;

			case "uniform-cost":
				try{
	            	switch(this.language){
	                	case 'language-es': document.getElementById("act-estate-algorithm-name").textContent="Estado actual del grafo: Búsqueda de costo uniforme (Dijkstra)."; break;	
	                	case 'language-en': document.getElementById("act-estate-algorithm-name").textContent="Network current status: Uniform cost (Dijkstra)."; break;
	                }
                }catch(err){
                	//alert(err);
                }
                
                break;


			case "simple-climbing":
				try{
	            	switch(this.language){
	                	case 'language-es': document.getElementById("act-estate-algorithm-name").textContent="Estado actual del grafo: Escalada simple."; break;	
	                	case 'language-en': document.getElementById("act-estate-algorithm-name").textContent="Network current status: Simple climbing."; break;
	                }
                }catch(err){
                	//alert(err);
                }
                
                break;

			case "max-climbing":
				try{
	            	switch(this.language){
	                	case 'language-es': document.getElementById("act-estate-algorithm-name").textContent="Estado actual del grafo: Escalada por la máxima pendiente."; break;	
	                	case 'language-en': document.getElementById("act-estate-algorithm-name").textContent="Network current status: Maximum slope climbing."; break;
	                }
	            }catch(err){}
                break;
        }
	}








	getAlertMessage(n_msg,heuristica_generada=null){
		switch(n_msg){
			case 0:
				switch(this.language){
					case 'language-es': return "El id del nodo no puede estar vacio.";
					case 'language-en': return "Node ID cannot be empty.";
				}
			case 1:
				switch(this.language){
					case 'language-es': return "El nodo inicial ya está definido. Si el checkbox de nodo inicial esta activado es porque tiene el nodo inicial seleccionado. Deseleccionelo pinchando en un nodo intermedio o en cualquier zona del grafo donde no haya nodo.";
					case 'language-en': return "Initial node is already defined. If initial node checkbox is checked, your initial node is graphically selected. Unselect it by clicking in an intermediate node or any zone out of the network.";
				}
			case 2:
				switch(this.language){
					case 'language-es': return "Un nodo no puede ser inicial y final a la vez.";
					case 'language-en': return "Node cannot be start and end nodo at the same time.";	
				}

			case 3:
				switch(this.language){
					case 'language-es': return "Por favor, introduzca un valor heurístico estrictamente positivo.";
					case 'language-en': return "Please, enter a heuristic value strictly positive value.";	
				}

			case 4:
				switch(this.language){
					case 'language-es': return "Por favor, introduzca un valor entero en el campo Valor heurístico.";
					case 'language-en': return "Please, enter an integer value in Heuristic Value field.";
				}

			case 5:
				switch(this.language){
					case 'language-es': return "El nodo que se esta intentando actualizar no existe.";
					case 'language-en': return "The node you are trying to update doesn't exists.";	
				}

			case 6:
				switch(this.language){
					case 'language-es': return "El nodo que se esta intentando eliminar no existe.";
					case 'language-en': return "The node you are trying to delete doesn't exists.";	
				}
			
			case 7:
				switch(this.language){
					case 'language-es': return "Ya existe una arista entre estos dos nodos.";
					case 'language-en': return "It already exists an edge between this two nodes.";	
				}

			case 8:
				switch(this.language){
					case 'language-es': return "Uno (o ambos) de los dos nodos no existe.";
					case 'language-en': return "One (or both) nodes doesn't exists.";
				}

			case 9:
				switch(this.language){
					case 'language-es': return "Por favor, introduzca un valor de coste estrictamente positivo.";
					case 'language-en': return "Please, enter a cost value strictly positive value.";	
				}

			case 10:
				switch(this.language){
					case 'language-es': return "Por favor, introduzca un valor entero en el campo Coste.";
					case 'language-en': return "Please, enter an integer value in Cost field.";	
				}

			case 11:
				switch(this.language){
					case 'language-es': return "La arista que se esta intentando actualizar no existe.";
					case 'language-en': return "The edge you are trying to update doesn't exists.";	
				}

			case 12:
				switch(this.language){
					case 'language-es': return "La arista que se esta intentando eliminar no existe.";
					case 'language-en': return "The edge you are trying to delete doesn't exists.";	
				}

			case 13:
				switch(this.language){
					case 'language-es': return "Por favor, asigne el nuevo nodo inicial.";
					case 'language-en': return "Please, asign new start node.";	
				}
			case 14:
				switch(this.language){
					case 'language-es': return "Debe haber un (y solo un) nodo inicial.";
					case 'language-en': return "It should be one (and only one) initial node.";	
				}
			case 15:
				switch(this.language){
					case 'language-es': return "Debe haber al menos un nodo final.";
					case 'language-en': return "It should be, at least, an end node.";	
				}
			case 16:
				switch(this.language){
					case 'language-es': return "No existen nodos finales.";
					case 'language-en': return "It doesn't exists any end node.";	
				}
			case 17:
				switch(this.language){
					case 'language-es': return "No existen aristas.";
					case 'language-en': return "It doesn't exists any edge.";	
				}
			case 18:
				switch(this.language){
					case 'language-es': return "El fichero no ha podido interpretarse.";
					case 'language-en': return "Input file cannot be read.";	
				}
			case 19:
				switch(this.language){
					case 'language-es': return "Fallo al importar el archivo.";
					case 'language-en': return "Error importing file.";	
				}
			case 20:
				switch(this.language){
					case 'language-es': return "El archivo no ha podido interpretarse: el nodo inicial ha sido manipulado.";
					case 'language-en': return "Input file cannot be read. Initial node have been rigged.";	
				}
			case 21:
				switch(this.language){
					case 'language-es': return "El archivo no ha podido interpretarse: los nodos finales han sido manipulados.";
					case 'language-en': return "Input file cannot be read. End nodes have been rigged.";	
				}
			case 22:
				switch(this.language){
					case 'language-es': return "El archivo no ha podido interpretarse: faltan nodos.";
					case 'language-en': return "Input file cannot be read. Missing nodes.";	
				}

			case 23:
				switch(this.language){
					case 'language-es': return "Por favor, introduzca un valor numérico entre "+document.getElementById("max_iter_bound").min+" y "+document.getElementById("max_iter_bound").max+" en el campo Límite de iteraciones.";
					case 'language-en': return "Please, enter a numeric value between "+document.getElementById("max_iter_bound").min+" and "+document.getElementById("max_iter_bound").max+" in Iteration limit field.";	
				}

			case 24:
				switch(this.language){
					case 'language-es': return "Por favor, introduzca un numero máximo de iteraciones entre "+document.getElementById("max_iter_bound").min+" y "+document.getElementById("max_iter_bound").max+".";
					case 'language-en': return "Please, enter a maximum number of iterations between "+document.getElementById("max_iter_bound").min+" and "+document.getElementById("max_iter_bound").max+".";	
				}

			case 25:
				switch(this.language){
					case 'language-es': return "Por favor, introduzca un valor numérico entre "+document.getElementById("max_prof").min+" y "+document.getElementById("max_prof").max+" en el campo Profundidad máxima.";
					case 'language-en': return "Please, enter a numeric value between "+document.getElementById("max_prof").min+" and "+document.getElementById("max_prof").max+" in Max depth field.";	
				}

			case 26:
				switch(this.language){
					case 'language-es': return "Por favor, introduzca un valor de máxima profundidad entre "+document.getElementById("max_prof").min+" y "+document.getElementById("max_prof").max+".";
					case 'language-en': return "Please, enter a max depth value between "+document.getElementById("max_prof").min+" and "+document.getElementById("max_prof").max+".";	
				}

			case 27:
				switch(this.language){
					case 'language-es': return "Debe introducir valores en los campos de rango si desea generar una heuristica que provoque cambios en la lista de nodos cerrados.";
					case 'language-en': return "You should enter values in range fields if you want to generate a heuristic that trigger changes in closed node list.";	
				}

			//Continuar traduciendo desde aquí
			case 28:
				switch(this.language){
					case 'language-es': return this.grafo_principal.getNodeIds().toSource()+"\n"+heuristica_generada.heur.toSource()+".\nSe ha encontrado una heuristica ADMISIBLE, pero no se puede encontrar un camino al final.";
					case 'language-en': return this.grafo_principal.getNodeIds().toSource()+"\n"+heuristica_generada.heur.toSource()+".\nAn ADMISIBLE heuristic was found but cannot be found a path to any end node.";	
				}

			case 29:
				switch(this.language){
					case 'language-es': return this.grafo_principal.getNodeIds().toSource()+"\n"+heuristica_generada.heur.toSource()+".\nEsta heuristica ES ADMISIBLE. provocará "+heuristica_generada.changes+" actualizaciones en la lista de cerrados para el algoritmo A*.";
					case 'language-en': return this.grafo_principal.getNodeIds().toSource()+"\n"+heuristica_generada.heur.toSource()+".\nThis heuristic IS ADMISIBLE. It will trigger "+heuristica_generada.changes+" updates in closed list for A* algorithm.";	
				}

			case 30:
				switch(this.language){
					case 'language-es': return "No ha sido posible encontrar una heuristica que cumpla los requisitos.\nPuede probar de nuevo con los mismos parametros. Si no se consigue encontrar la heuristica, debería plantearse cambiar el rango del numero de actualizaciones que desea provocar.";
					case 'language-en': return "Failed to find a heuristic that meets the requeriments.\nYoy can try it again with the same parameters. If you cannot found the heuristic, you should consider changing the range of the number of updates you want to trigger.";	
				}

			/*case 31:
				switch(this.language){
					case 'language-es': return this.grafo_principal.getNodeIds().toSource()+"\n"+heuristica_generada.heur.toSource()+".\nSe ha encontrado una heuristica ADMISIBLE, pero no se puede encontrar un camino al final.";
					case 'language-en': return this.grafo_principal.getNodeIds().toSource()+"\n"+heuristica_generada.heur.toSource()+".\nSe ha encontrado una heuristica ADMISIBLE, pero no se puede encontrar un camino al final.";	
				}*/

			/*case 31:
				switch(this.language){
					case 'language-es': return this.grafo_principal.getNodeIds().toSource()+"\n"+heuristica_generada.heur.toSource()+".\nEsta heuristica provocará "+heuristica_generada.changes+" actualizaciones en cerrados para el algoritmo A*.";
					case 'language-en': return "";	
				}*/

			case 31:
				switch(this.language){
					case 'language-es': return "El rango de actualizaciones no es válido. El número mínimo de actualizaciones debe ser mayor o igual que 0 y menor o igual que el número máximo.";
					case 'language-en': return "Update range is not valid. Minimum updates number must be higher or equal to 0 and smaller or equal to maximum number.";	
				}

			case 32:
				switch(this.language){
					case 'language-es': return "Por favor, introduzca valores numéricos enteros en los campos de número mínimo y máximo de cambios.";
					case 'language-en': return "Please, enter numeric values in minimum and maximum number of updates.";	
				}

			case 33:
				switch(this.language){
					case 'language-es': return "Un nodo final no puede ponerse como inicial.";
					case 'language-en': return "An end node cannot be assigned as start node.";	
				}

			case 34:
				switch(this.language){
					case 'language-es': return "El nodo inicial no puede ser final.";
					case 'language-en': return "Start node cannot be end node.";	
				}


			/*case :
				switch(lang){
					case 'language-es': return "";
					case 'language-en': return "";	
				}*/
		}
	}
}