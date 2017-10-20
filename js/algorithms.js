//-------------GRUPO DE FUNCIONES AUXILIARES------------------//
class Algorithms{

	constructor(){
		this.string_descriptions_steps=[];
		this.network_steps=[];
		this.open_closed_steps=[];
	}


	isEndNodeInClosed(end_nodes,closed){
		for(var i=0;i<closed.length;i++){
			if(end_nodes.includes(closed[i][1])){
				return i;
			}
		}
		return -1;
	}


	isNodeInList(node,list){
		var index=-1;
		for(var i=0;i<list.length;i++){
			if(list[i][1]==node){
				return i;
			}
		}
		return -1;
	}

	isTupleInList(tuple,list){
		for(var i=0;i<list.length;i++){
			if(JSON.stringify(list[i])==JSON.stringify(tuple)){
				return i;
			}
		}
		return -1;
	}


	isDadSonInList(tuple,list){
		for(var i=0;i<list.length;i++){
			if(list[i][0]==tuple[0] && list[i][1]==tuple[1]){
				return i;
			}
		}
		return -1;
	}



	//Nos permite comprobar si algo esta en una lista
	isInList(elem,list){
		if(list.includes(elem)){
			return list.indexOf(elem);
		}
		return -1;
	}



	//Trabaja con indices
	getAllSonNodes(adj_mat,dad_node){
		var son_nodes=[];
		for(var i=0;i<adj_mat[dad_node].length;i++){
			if(adj_mat[dad_node][i]!=null){
				son_nodes.push(i);
			}
		}
		return son_nodes;
	}



	getNthSonNode(adj_mat,dad_node,n){
		//El hijo n=0 es el primer hijo.
		var cont=-1;
		for(var i=0;i<adj_mat[dad_node].length;i++){
			if(adj_mat[dad_node][i]!=null){
				cont+=1;
				if(cont==n){
					return i;	
				}
			}
		}
		return null;
	}


	getNodeId(node_ids,index){
		return node_ids[index];
	}


	//Ordena por orden lexicografico el array de nodos y sus heuristicas
	sortDepend(array1,array2){
	    var zipped = [],
	        i;
	    
	    for(i=0; i<array1.length; ++i) {
	        zipped.push({
	            array1elem: array1[i],
	            array2elem: array2[i]
	        });
	    }
	    
	    zipped.sort(function(left, right) {
	        var leftArray1elem = left.array1elem,
	            rightArray1elem = right.array1elem;
	    
	        return leftArray1elem === rightArray1elem ? 0 : (leftArray1elem < rightArray1elem ? -1 : 1);
	    });
	    
	    array1 = [];
	    array2 = [];
	    for(i=0; i<zipped.length; ++i) {
	        array1.push(zipped[i].array1elem);
	        array2.push(zipped[i].array2elem);
	    }
	    
	    
	    var sorted_array=new Array(2);
	    sorted_array[0]=array1;
	    sorted_array[1]=array2;
	    return sorted_array;
	}






	getAdjMatrix(network_edges,node_ids,edge_ids){
	    var edge_costs = network_edges.get({
	      fields: ['label'],
	    });

	    var adj_matrix = [];
	    for(var i=0; i<node_ids.length; i++) {
	        adj_matrix[i] = new Array(node_ids.length);
	        for(var j=0; j<node_ids.length; j++) {
	            adj_matrix[i][j] = undefined;
	        }
	    }


	    var arista;
	    for(var i=0; i<edge_ids.length; i++) {
	        arista=edge_ids[i].split("_");
	        var row=node_ids.indexOf(arista[0]);
	        var col=node_ids.indexOf(arista[1]);
	        adj_matrix[row][col]=Number(edge_costs[i].label);
	        if(arista[2]=="normal"){//BIDIRECCIONAL
	            adj_matrix[col][row]=Number(edge_costs[i].label);
	        }
	    }

	    return adj_matrix;
	}




	getTupleAsString(node_ids,tuple){
		var str_tuple="(";
		var tlen=tuple.length;
		var id_node;
		for(var i=0;i<tlen;i++){
			if(i==tlen-1){
				if(i==0 || i==1){
					str_tuple=str_tuple+this.getNodeId(node_ids,tuple[i])+")";
				}else{
					str_tuple=str_tuple+tuple[i]+")";
				}
				
			}else if(i==0 || i==1){
				id_node=this.getNodeId(node_ids,tuple[i]);
				if(id_node==null){
					str_tuple=str_tuple+"-,";
				}else{
					str_tuple=str_tuple+this.getNodeId(node_ids,tuple[i])+",";
				}
			}else{
				str_tuple=str_tuple+tuple[i]+",";
			}
		}
		return str_tuple;
	}





	getListAsString(node_ids,list){
		var str_list="[";
		var ntuples=list.length;
		for(var i=0;i<ntuples;i++){
			if(i==ntuples-1){
				str_list=str_list+this.getTupleAsString(node_ids,list[i]);
			}else{
				str_list=str_list+this.getTupleAsString(node_ids,list[i])+",";
			}
		}
		str_list=str_list+"]"
		return str_list;
	}













	getNetworkStep(node_data,edge_data,open,closed,node_ids,act_tuple,adjMatrix){
		var nodes_step=[];
		var edges_step=[];

		if(act_tuple[0]==null){//Paso inicial
			
			for(var i=0;i<node_data.length;i++){
	    		if(node_data[i].id==this.getNodeId(node_ids,act_tuple[1])){
	    			nodes_step.push(node_data[i]);
	    			break;
	    		}
		    }
			
		    
		    return {nodes:nodes_step,edges:edges_step};
		}else{//Paso no inicial
			

			var index_last_step=this.network_steps.length-1;

			//METO LOS NODOS DEL ULTIMO PASO
			for(var i=0;i<this.network_steps[index_last_step].nodes.length;i++){
				nodes_step.push(this.network_steps[index_last_step].nodes[i]);	
			}

			//METO LOS ARCOS DEL ULTIMO PASO
			for(var i=0;i<this.network_steps[index_last_step].edges.length;i++){
				edges_step.push(this.network_steps[index_last_step].edges[i]);	
			}

			//METO LOS NODOS HIJOS DE LA TUPLA ACTUAL SI NO ESTAN YA		
			for(var i=0;i<node_data.length;i++){
				if(node_ids.indexOf(node_data[i].id)==act_tuple[1] && !nodes_step.includes(node_data[i])){
					nodes_step.push(node_data[i]);
				}
			}

			//METO LOS ARCOS DE LA TUPLA ACTUAL SI NO ESTAN YA
			var edge_id;
			
			for(var i=0;i<edge_data.length;i++){
				edge_id=edge_data[i].id.split("_");
				for(var j=0;j<closed.length;j++){ //METO LOS ARCOS EN CERRADOS POR SI HA HABIDO ACTUALIZACIONES
					if(		((node_ids.indexOf(edge_data[i].from)==closed[j][0] && node_ids.indexOf(edge_data[i].to)==closed[j][1] && edge_id[2]=="directed")
							|| (node_ids.indexOf(edge_data[i].from)==closed[j][0] && node_ids.indexOf(edge_data[i].to)==closed[j][1] && edge_id[2]=="normal")
							|| (node_ids.indexOf(edge_data[i].from)==closed[j][1] && node_ids.indexOf(edge_data[i].to)==closed[j][0] && edge_id[2]=="normal")) 
							&& !edges_step.includes(edge_data[i])
						){
						
						edges_step.push(edge_data[i]);
						break;
					}				
				}

				if(		((node_ids.indexOf(edge_data[i].from)==act_tuple[0] && node_ids.indexOf(edge_data[i].to)==act_tuple[1] && edge_id[2]=="directed")
						|| (node_ids.indexOf(edge_data[i].from)==act_tuple[0] && node_ids.indexOf(edge_data[i].to)==act_tuple[1] && edge_id[2]=="normal")
						|| (node_ids.indexOf(edge_data[i].from)==act_tuple[1] && node_ids.indexOf(edge_data[i].to)==act_tuple[0] && edge_id[2]=="normal")) 
						&& !edges_step.includes(edge_data[i])
					){
					
					edges_step.push(edge_data[i]);
				}
			}

			return {nodes:nodes_step,edges:edges_step};
		}
	}





































	//-----------FIN GRUPO DE FUNCIONES AUXILIARES----------------//

	


























	deepSearch(network_nodes,network_edges,initial_node_id,end_nodes_id,iter_bound){
		var contador_pasos=0;

		this.string_descriptions_steps=[];
		this.network_steps=[];
		this.open_closed_steps=[];

		//OBTENCION DE ID DE NODOS Y VALOR HEURISTICO
		var node_data = network_nodes.get({
	      fields: ['id','label','title','color'], //De cada nodo obtengo el id, el string que muestra, el valor heuristico y el color
	    });

		var edge_data = network_edges.get({
	      fields: ['from','to','id','label','arrows'],    
	    });

		var nnodes=node_data.length;
	    
	    var node_ids=new Array(nnodes);
	    var node_heuristics=new Array(nnodes);
	    for(var i=0;i<nnodes;i++){
	    	node_ids[i]=node_data[i].id; //Obtengo la id
	    	node_heuristics[i]=Number(node_data[i].title); //Obtengo el valor heuristico
	    }
	    //FIN OBTENCION DE ID DE NODOS Y VALOR HEURISTICO

	    //OBTENCION DE LOS ID DE LAS ARISTAS
	    var nedges=edge_data.length;
	    
	    var edge_ids=new Array(nedges);
	    for(var i=0;i<nedges;i++){
	    	edge_ids[i]=edge_data[i].id; //Obtengo la id
	    }
	    //FIN OBTENCION DE LOS ID DE LAS ARISTAS

	    //ORDENACION POR ORDEN LEXICOGRAFICO
		var ordered_nodes=this.sortDepend(node_ids,node_heuristics);
	    node_ids=ordered_nodes[0];
	    node_heuristics=ordered_nodes[1];

	    var adjMatrix=this.getAdjMatrix(network_edges,node_ids,edge_ids);
	    //FIN ORDENACION POR ORDEN LEXICOGRAFICO

	    //PREPARAR EL PROBLEMA PARA COMENZAR A TRABAJAR CON INDICES NUMERICOS
	  	var nodo_inicial=node_ids.indexOf(initial_node_id);
		var nodos_finales=new Array(end_nodes_id.length);

		for(var i=0;i<end_nodes_id.length;i++){
			nodos_finales[i]=node_ids.indexOf(end_nodes_id[i]);
		}
		//FIN PREPARAR EL PROBLEMA PARA COMENZAR A TRABAJAR CON INDICES NUMERICOS
		
		var abiertos=[];
		var cerrados=[];
		var hijos;
		var coste=0;

		var tupla_actual=[null,nodo_inicial];
		abiertos.push(tupla_actual);
		var explicacion="Inserto "+this.getTupleAsString(node_ids,tupla_actual)+" en la lista de abiertos.";////////////////
		


		contador_pasos+=1;
		explicacion="Paso "+contador_pasos+":\n"+explicacion;
		this.string_descriptions_steps.push(explicacion);//Incluir explicaciones en la resolucion
		this.network_steps.push(this.getNetworkStep(node_data,edge_data,abiertos,cerrados,node_ids,tupla_actual,adjMatrix));
		this.open_closed_steps.push("ABIERTOS:\n"+this.getListAsString(node_ids,abiertos)+"\n\nCERRADOS:\n"+this.getListAsString(node_ids,cerrados));
		
		var bound_cont=0;

		explicacion="\n"+explicacion;


		while(this.isEndNodeInClosed(nodos_finales,cerrados)==-1 && abiertos.length>0){
			if(this.isNodeInList(tupla_actual[1],cerrados)==-1){ //Si el nodo que vamos a abrir no está en cerrados, esto es, no ha sido ya visitado, procedemos a meterlo
				
				explicacion="Elimino "+this.getTupleAsString(node_ids,tupla_actual)+" de la lista de abiertos.\n"+explicacion;////////////////
				
				abiertos.splice(abiertos.indexOf(tupla_actual), 1);
				
				explicacion="Inserto "+this.getTupleAsString(node_ids,tupla_actual)+" en la lista de cerrados.\n"+explicacion;////////////////

				cerrados.push(tupla_actual);
				

				hijos=this.getAllSonNodes(adjMatrix,tupla_actual[1]);
				var nhijos=hijos.length
				if(nhijos>0)
					explicacion="\n"+explicacion;

				var posicion_insert=0;
				var tupla_insert;
				for(var i=0;i<nhijos;i++){
					//DETECCION DE CICLOS EN EL GRAFO
					tupla_insert=[ tupla_actual[1],hijos[i] ]
					if(this.isNodeInList(tupla_insert[1],abiertos)==-1 && this.isNodeInList(tupla_insert[1],cerrados)==-1){
						explicacion="Inserto "+this.getTupleAsString(node_ids,tupla_insert)+" en la lista de abiertos.\n"+explicacion;////////////////
						abiertos.splice(posicion_insert, 0, tupla_insert);//Inserto los hijos desde la primera posicion (en orden) en la lista de abiertos.
						posicion_insert+=1;
						
						//this.string_descriptions_steps.push(explicacion);//Incluir explicaciones en la resolucion
						//this.network_steps.push(this.network_steps[this.network_steps.length-1]);
						//this.open_closed_steps.push("ABIERTOS:\n"+this.getListAsString(node_ids,abiertos)+"\n\nCERRADOS:\n"+this.getListAsString(node_ids,cerrados));
					}else{
						explicacion="NO Inserto "+this.getTupleAsString(node_ids,tupla_insert)+" en la lista de abiertos porque ya esta abierto, cerrado o ya ha sido visitado.\n"+explicacion;////////////////
					}
				}
				
				contador_pasos+=1;
				explicacion="Paso "+contador_pasos+":\n"+explicacion;
				this.string_descriptions_steps.push(explicacion);//Incluir explicaciones en la resolucion
				this.network_steps.push(this.getNetworkStep(node_data,edge_data,abiertos,cerrados,node_ids,tupla_actual,adjMatrix));
				this.open_closed_steps.push("ABIERTOS:\n"+this.getListAsString(node_ids,abiertos)+"\n\nCERRADOS:\n"+this.getListAsString(node_ids,cerrados));

				explicacion="\n"+explicacion;

				if(this.isInList(tupla_actual[1],nodos_finales)==-1){//Si el nodo de la tupla actual (nodo hijo de la tupla actual) NO es un nodo final lo meto en abiertos, si no, termino.
					
					if(abiertos.length>0){
						tupla_actual=abiertos[0];
						explicacion="Cojo "+this.getTupleAsString(node_ids,tupla_actual)+" como tupla actual.\n"+explicacion;////////////////
					}
				}else{
					explicacion="El nodo "+this.getNodeId(node_ids,tupla_actual[1])+" es nodo final, he terminado.\n"+explicacion;////////////////

					contador_pasos+=1;
					explicacion="Paso "+contador_pasos+":\n"+explicacion;
					this.string_descriptions_steps.push(explicacion);//Incluir explicaciones en la resolucion
					this.network_steps.push(this.getNetworkStep(node_data,edge_data,abiertos,cerrados,node_ids,tupla_actual,adjMatrix));
					this.open_closed_steps.push("ABIERTOS:\n"+this.getListAsString(node_ids,abiertos)+"\n\nCERRADOS:\n"+this.getListAsString(node_ids,cerrados));


				}
				

				explicacion="\n"+explicacion;////////////////
				
			}else{//Si el nodo que ibamos a meter en abiertos estaba previamente en cerrados, debemos romper el bucle, pues hemos detectado un ciclo.
				explicacion="Se vuelve a visitar el nodo "+this.getNodeId(node_ids,tupla_actual[1])+" y se produce un ciclo infinito.\n"+explicacion;
				

				contador_pasos+=1;
				explicacion="Paso "+contador_pasos+":\n"+explicacion;
				this.string_descriptions_steps.push(explicacion);//Incluir explicaciones en la resolucion
				this.network_steps.push(this.getNetworkStep(node_data,edge_data,abiertos,cerrados,node_ids,tupla_actual,adjMatrix));
				this.open_closed_steps.push("ABIERTOS:\n"+this.getListAsString(node_ids,abiertos)+"\n\nCERRADOS:\n"+this.getListAsString(node_ids,cerrados));
				break;
			}




			bound_cont+=1;
			if(bound_cont==iter_bound){
				break;
			}
		}
			
		tupla_actual=cerrados[cerrados.length-1];
		
		if(nodos_finales.includes(tupla_actual[1])){ // Si el ultimo nodo de finales es un nodo final, habremos encontrado un camino
			//OBTENCION DEL CAMINO POR INDICES
			var camino=[];
			camino.push(tupla_actual[1]);
			var padre=tupla_actual[0];

			cerrados.splice(cerrados.indexOf(tupla_actual), 1); //Elimino de cerrados la tupla actual
			for(var i=0;i<cerrados.length;i++){
				if(cerrados[i][0]==tupla_actual[0]){
					cerrados.splice(i, 1); //Elimino de cerrados la tupla actual				
				}
			}


			//EN BUSQUEDA EN PROFUNDIDAD, AL TERMINAR, CADA NODO VIENE DE UN SOLO PADRE, EN CERRADOS, UN NODO SOLO PUEDE VENIR DE UN PADRE.
			while(padre!=null){
				for(var i=0;i<cerrados.length;i++){
					if(cerrados[i][1]==padre){ //EN ESTE BLOQUE HAY QUE APLICAR EL CRITERIO DE DESEMPATE EN CASO DE SER NECESARIO, PORQUE AQUI SE CALCULARAN LOS PADRES POTENCIALES
						//potential_parents.push(cerrados[i]);
						tupla_actual=cerrados[i];
						camino.push(tupla_actual[1]);
						padre=tupla_actual[0]
						break;
					}
				}
			}
			//FIN OBTENCION DEL CAMINO POR INDICES
		

			//CALCULO DEL COSTE
			if(camino.length>1){//Hay mas de un nodo en el camino
				coste+=adjMatrix[camino[1]][camino[0]];
				for(var i=2;i<camino.length;i++){
					coste+=adjMatrix[camino[i]][camino[i-1]];
				}
			}else{
				coste=0;
			}
			//FIN CALCULO DEL COSTE


			//OBTENCION DEL CAMINO POR NOMBRES
			for(var i=0;i<camino.length;i++){
				camino[i]=this.getNodeId(node_ids,camino[i]);
			}
			camino.reverse();
			//FIN OBTENCION DEL CAMINO POR NOMBRES
			

			this.string_descriptions_steps[this.string_descriptions_steps.length-1]="El camino encontrado es: "+camino+", con coste: "+coste+".\n\n"+this.string_descriptions_steps[this.string_descriptions_steps.length-1];
		}else{
			this.string_descriptions_steps[this.string_descriptions_steps.length-1]="No fue posible encontrar un camino entre "+initial_node_id+" y algun nodo final: "+end_nodes_id+".\n\n"+this.string_descriptions_steps[this.string_descriptions_steps.length-1];
		}

		return {descriptions: this.string_descriptions_steps, steps: this.network_steps, lists: this.open_closed_steps};
	}



























































	iterativeDescent(network_nodes,network_edges,initial_node_id,end_nodes_id,prof_bound,iter_bound){
		var contador_pasos=0;

		this.string_descriptions_steps=[];
		this.network_steps=[];
		this.open_closed_steps=[];

		//OBTENCION DE ID DE NODOS Y VALOR HEURISTICO
		var node_data = network_nodes.get({
	      fields: ['id','label','title','color'], //De cada nodo obtengo el id, el string que muestra, el valor heuristico y el color
	    });

		var edge_data = network_edges.get({
	      fields: ['from','to','id','label','arrows'],    
	    });

		var nnodes=node_data.length;
	    
	    var node_ids=new Array(nnodes);
	    var node_heuristics=new Array(nnodes);
	    for(var i=0;i<nnodes;i++){
	    	node_ids[i]=node_data[i].id; //Obtengo la id
	    	node_heuristics[i]=Number(node_data[i].title); //Obtengo el valor heuristico
	    }
	    //FIN OBTENCION DE ID DE NODOS Y VALOR HEURISTICO

	    //OBTENCION DE LOS ID DE LAS ARISTAS
	    var nedges=edge_data.length;
	    
	    var edge_ids=new Array(nedges);
	    for(var i=0;i<nedges;i++){
	    	edge_ids[i]=edge_data[i].id; //Obtengo la id
	    }
	    //FIN OBTENCION DE LOS ID DE LAS ARISTAS

	    //ORDENACION POR ORDEN LEXICOGRAFICO
		var ordered_nodes=this.sortDepend(node_ids,node_heuristics);
	    node_ids=ordered_nodes[0];
	    node_heuristics=ordered_nodes[1];
	    var adjMatrix=this.getAdjMatrix(network_edges,node_ids,edge_ids);
	    //FIN ORDENACION POR ORDEN LEXICOGRAFICO

	    //PREPARAR EL PROBLEMA PARA COMENZAR A TRABAJAR CON INDICES NUMERICOS
	  	var nodo_inicial=node_ids.indexOf(initial_node_id);
		var nodos_finales=new Array(end_nodes_id.length);

		for(var i=0;i<end_nodes_id.length;i++){
			nodos_finales[i]=node_ids.indexOf(end_nodes_id[i]);
		}
		//FIN PREPARAR EL PROBLEMA PARA COMENZAR A TRABAJAR CON INDICES NUMERICOS


		var max_prof=1; //Maxima profundidad de la iteracion actual
		var abiertos=[];
		var cerrados=[];
		var hijos;
		var coste=0;
		var tupla_actual;
		var inf_cycle=false;
		var explicacion="";

		

		//Si al final de una iteracion se vuelve sin nodos abiertos, el algoritmo debería acabar porque aunque volvamos a visitar ese nivel, en el siguiente no habria nada que abrir.
		while(max_prof<prof_bound){
			abiertos=[];
			cerrados=[];
			hijos;
			coste=0;

			tupla_actual=[null,nodo_inicial,0];
			abiertos.push(tupla_actual);
			explicacion="Inserto "+this.getTupleAsString(node_ids,tupla_actual)+" en la lista de abiertos.\n\n"+explicacion;////////////////
			
			contador_pasos+=1;
			explicacion="Paso "+contador_pasos+":\n"+explicacion;
			this.string_descriptions_steps.push(explicacion);//Incluir explicaciones en la resolucion
			this.network_steps.push(this.getNetworkStep(node_data,edge_data,abiertos,cerrados,node_ids,tupla_actual,adjMatrix));
			this.open_closed_steps.push("ABIERTOS:\n"+this.getListAsString(node_ids,abiertos)+"\n\nCERRADOS:\n"+this.getListAsString(node_ids,cerrados));

			explicacion="\n"+explicacion;

			while(this.isEndNodeInClosed(nodos_finales,cerrados)==-1 && abiertos.length>0 && !inf_cycle){
				
				if(this.isTupleInList(tupla_actual,cerrados)==-1){ //Si el nodo que vamos a abrir no está en cerrados, esto es, no ha sido ya visitado, procedemos a meterlo
					
					explicacion="Elimino "+this.getTupleAsString(node_ids,tupla_actual)+" de la lista de abiertos.\n"+explicacion;////////////////
					
					abiertos.splice(abiertos.indexOf(tupla_actual), 1);
					
					explicacion="Inserto "+this.getTupleAsString(node_ids,tupla_actual)+" en la lista de cerrados.\n"+explicacion;////////////////

					cerrados.push(tupla_actual);
					

					if(tupla_actual[2]<max_prof){//Si aun no he alcanzado la profundidad actual, meto todos los hijos
						hijos=this.getAllSonNodes(adjMatrix,tupla_actual[1]);
						if(hijos.length>0){
							explicacion="\n"+explicacion;
							var posicion_insert=0;
							var tupla_insert;
							for(var i=0;i<hijos.length;i++){
								//DETECCION DE CICLOS EN EL GRAFO
								tupla_insert=[ tupla_actual[1],hijos[i],tupla_actual[2]+1 ]
								if(!abiertos.includes(tupla_insert) && !cerrados.includes(tupla_insert)){ //Si no esta en abiertos ni en cerrados		
									explicacion="Inserto "+this.getTupleAsString(node_ids,tupla_insert)+" en la lista de abiertos.\n"+explicacion;////////////////
									abiertos.splice(posicion_insert, 0, tupla_insert);//Inserto los hijos desde la primera posicion (en orden) en la lista de abiertos.
									posicion_insert+=1;
								}else{
									explicacion="NO Inserto "+this.getTupleAsString(node_ids,tupla_insert)+" en la lista de abiertos porque ya esta abierto o ya ha sido visitado.\n"+explicacion;////////////////
								}
							}
							
						}
					}

					contador_pasos+=1;
					explicacion="Paso "+contador_pasos+":\n"+explicacion;
					this.string_descriptions_steps.push(explicacion);//Incluir explicaciones en la resolucion
					this.network_steps.push(this.getNetworkStep(node_data,edge_data,abiertos,cerrados,node_ids,tupla_actual,adjMatrix));
					this.open_closed_steps.push("ABIERTOS:\n"+this.getListAsString(node_ids,abiertos)+"\n\nCERRADOS:\n"+this.getListAsString(node_ids,cerrados));
					
					explicacion="\n"+explicacion;

					if(this.isInList(tupla_actual[1],nodos_finales)==-1){//Si el nodo de la tupla actual (nodo hijo de la tupla actual) NO es un nodo final lo meto en abiertos, si no, termino.
						if(abiertos.length>0){
							tupla_actual=abiertos[0];
							explicacion="Cojo "+this.getTupleAsString(node_ids,tupla_actual)+" como tupla actual.\n"+explicacion;////////////////
						}
					}else{
						explicacion="El nodo "+this.getNodeId(node_ids,tupla_actual[1])+" es nodo final, he terminado.\n"+explicacion;////////////////

						contador_pasos+=1;
						explicacion="Paso "+contador_pasos+":\n"+explicacion;
						this.string_descriptions_steps.push(explicacion);//Incluir explicaciones en la resolucion
						this.network_steps.push(this.getNetworkStep(node_data,edge_data,abiertos,cerrados,node_ids,tupla_actual,adjMatrix));
						this.open_closed_steps.push("ABIERTOS:\n"+this.getListAsString(node_ids,abiertos)+"\n\nCERRADOS:\n"+this.getListAsString(node_ids,cerrados));


					}
					

					explicacion="\n"+explicacion;////////////////
					
				}else{//Si el nodo que ibamos a meter en abiertos estaba previamente en cerrados, debemos romper el bucle, pues hemos detectado un ciclo.
					explicacion="Se vuelve a visitar el nodo "+this.getNodeId(node_ids,tupla_actual[1])+" (la tupla "+this.getTupleAsString(node_ids,tupla_actual)+" está en cerrados). Lo ignoramos y pasamos al siguiente.\n"+explicacion;

					contador_pasos+=1;
					explicacion="Paso "+contador_pasos+":\n"+explicacion;
					this.string_descriptions_steps.push(explicacion);//Incluir explicaciones en la resolucion
					this.network_steps.push(this.getNetworkStep(node_data,edge_data,abiertos,cerrados,node_ids,tupla_actual,adjMatrix));
					this.open_closed_steps.push("ABIERTOS:\n"+this.getListAsString(node_ids,abiertos)+"\n\nCERRADOS:\n"+this.getListAsString(node_ids,cerrados));

					abiertos.splice(abiertos.indexOf(tupla_actual), 1);
					tupla_actual=abiertos[0];
				}
			}

			if(!nodos_finales.includes(tupla_actual[1]) && !inf_cycle){
				max_prof+=1;
				explicacion="------------------------------------------------------------\n"+explicacion;////////////////
				explicacion="No se ha encontrado un nodo final.\nSe aumenta la profundidad maxima a explorar, ahora vale: "+max_prof+". Reinicializamos el contador de profundidad y volvemos a comenzar.\n"+explicacion;////////////////
				explicacion="------------------------------------------------------------\n"+explicacion;////////////////
			}else{//Cuando en una iteracion he alcanzado nodo final, debo salir del bucle
				break;
			}
		}
		

			
		tupla_actual=cerrados[cerrados.length-1];

		if(tupla_actual!=undefined && nodos_finales.includes(tupla_actual[1])){ // Si el ultimo nodo de finales es un nodo final, habremos encontrado un camino
			//OBTENCION DEL CAMINO POR INDICES
			var camino=[];
			camino.push(tupla_actual[1]);
			var padre=tupla_actual[0];
			var coste=0;

			cerrados.splice(cerrados.indexOf(tupla_actual), 1); //Elimino de cerrados la tupla actual
			//Elimino todos los que tengan como origen el mismo origen que la tupla actual, para reducir, si es posible, la lista de cerrados
			
			for(var i=0;i<cerrados.length;i++){
				if(cerrados[i][0]==tupla_actual[0]){
					cerrados.splice(i, 1); //Elimino de cerrados la tupla actual				
				}
			}


			//EN BUSQUEDA EN PROFUNDIDAD, AL TERMINAR, CADA NODO VIENE DE UN SOLO PADRE, EN CERRADOS, UN NODO SOLO PUEDE VENIR DE UN PADRE.
			while(padre!=null){
				tupla_actual=null;
				for(var i=0;i<cerrados.length;i++){
					if(cerrados[i][1]==padre){ //EN ESTE BLOQUE HAY QUE APLICAR EL CRITERIO DE DESEMPATE EN CASO DE SER NECESARIO, PORQUE AQUI SE CALCULARAN LOS PADRES POTENCIALES
						if(tupla_actual==null){
							tupla_actual=cerrados[i];
						}else if(cerrados[i][2]<tupla_actual[2]){
							tupla_actual=cerrados[i];
						}
					}
				}
				camino.push(tupla_actual[1]);
				padre=tupla_actual[0]

				cerrados.splice(cerrados.indexOf(tupla_actual), 1); //Elimino de cerrados la tupla actual
				//Elimino todos los que tengan como origen el mismo origen que la tupla actual, para reducir, si es posible, la lista de cerrados
				for(var i=0;i<cerrados.length;i++){
					if(cerrados[i][0]==tupla_actual[0]){
						cerrados.splice(i, 1); //Elimino de cerrados la tupla actual				
					}
				}
			}
			//FIN OBTENCION DEL CAMINO POR INDICES
		

			//CALCULO DEL COSTE
			if(camino.length>1){//Hay mas de un nodo en el camino
				coste+=adjMatrix[camino[1]][camino[0]];
				for(var i=2;i<camino.length;i++){
					coste+=adjMatrix[camino[i]][camino[i-1]];
				}
			}else{
				coste=0;
			}
			//FIN CALCULO DEL COSTE


			//OBTENCION DEL CAMINO POR NOMBRES
			for(var i=0;i<camino.length;i++){
				camino[i]=this.getNodeId(node_ids,camino[i]);
			}
			camino.reverse();
			//FIN OBTENCION DEL CAMINO POR NOMBRES
			

			this.string_descriptions_steps[this.string_descriptions_steps.length-1]="El camino encontrado es: "+camino+", con coste: "+coste+".\n"+this.string_descriptions_steps[this.string_descriptions_steps.length-1];
		}else{
			this.string_descriptions_steps[this.string_descriptions_steps.length-1]="No fue posible encontrar un camino entre "+initial_node_id+" y algun nodo final: "+end_nodes_id+".\n"+this.string_descriptions_steps[this.string_descriptions_steps.length-1];
		}
		return {descriptions: this.string_descriptions_steps, steps: this.network_steps, lists: this.open_closed_steps};
	}
































	propagate_changes(tupla,tuple_list,adjMat){
		var newList=tuple_list.slice(0); //Hago copia de la lista
		var nodes_to_propagation=[tupla[1]];
		var continue_propagation=true;
		while(continue_propagation){
			continue_propagation=false;
			for(var j=0; j<nodes_to_propagation.length; j++){
				for(var i=0;i<newList.length;i++){
					if(newList[i][0]==nodes_to_propagation[j]){
						newList[i][2]=tupla[2]+adjMat[nodes_to_propagation[j]][ newList[i][1] ];
						nodes_to_propagation.push(newList[i][1]);
						continue_propagation=true;
					}
				}
				nodes_to_propagation.shift(); //Elimino el primer elemento de los nodos a propagar porque ya he propagado hacia sus hijos
			}
		}
		return newList;
	}






	update_costs(tupla,tuple_list,adjMat){
		var newList=tuple_list.slice(0); //Hago copia de la lista
		var tupleIndex=newList.indexOf(tupla);
		for(var i=0;i<newList.length;i++){
			if(newList[i][1]==tupla[0]){
				newList[tupleIndex][2]=newList[i][2]+adjMat[ newList[tupleIndex][0] ][ newList[tupleIndex][1] ];
				break;
			}
		}
		return newList;
	}












	







	astar(network_nodes,network_edges,initial_node_id,end_nodes_id,iter_bound){
		var contador_pasos=0;

		this.string_descriptions_steps=[];
		this.network_steps=[];
		this.open_closed_steps=[];

		//OBTENCION DE ID DE NODOS Y VALOR HEURISTICO
		var node_data = network_nodes.get({
	      fields: ['id','label','title','color'], //De cada nodo obtengo el id, el string que muestra, el valor heuristico y el color
	    });

		var edge_data = network_edges.get({
	      fields: ['from','to','id','label','arrows'],    
	    });

		var nnodes=node_data.length;
	    
	    var node_ids=new Array(nnodes);
	    var node_heuristics=new Array(nnodes);
	    for(var i=0;i<nnodes;i++){
	    	node_ids[i]=node_data[i].id; //Obtengo la id
	    	node_heuristics[i]=Number(node_data[i].title); //Obtengo el valor heuristico
	    }
	    //FIN OBTENCION DE ID DE NODOS Y VALOR HEURISTICO


		//OBTENCION DE LOS ID DE LAS ARISTAS
	    var nedges=edge_data.length;
	    
	    var edge_ids=new Array(nedges);
	    for(var i=0;i<nedges;i++){
	    	edge_ids[i]=edge_data[i].id; //Obtengo la id
	    }
	    //FIN OBTENCION DE LOS ID DE LAS ARISTAS

	    //ORDENACION POR ORDEN LEXICOGRAFICO: AQUI TAMBIEN HACE FALTA PARA DECIDIRNOS POR EL PRIMERO EN CASO DE EMPATE
		var ordered_nodes=this.sortDepend(node_ids,node_heuristics);
	    node_ids=ordered_nodes[0];
	    node_heuristics=ordered_nodes[1];
	    var adjMatrix=this.getAdjMatrix(network_edges,node_ids,edge_ids);
	    //FIN ORDENACION POR ORDEN LEXICOGRAFICO

	    //PREPARAR EL PROBLEMA PARA COMENZAR A TRABAJAR CON INDICES NUMERICOS
	  	var nodo_inicial=node_ids.indexOf(initial_node_id);
		var nodos_finales=new Array(end_nodes_id.length);

		for(var i=0;i<end_nodes_id.length;i++){
			nodos_finales[i]=node_ids.indexOf(end_nodes_id[i]);
		}
		//FIN PREPARAR EL PROBLEMA PARA COMENZAR A TRABAJAR CON INDICES NUMERICOS

		var abiertos=[];
		var cerrados=[];
		var hijos;
		var coste=0;
		
		var g_component_actual=0;
		var tupla_actual=[ null,nodo_inicial,g_component_actual,node_heuristics[nodo_inicial] ]; //(padre,hijo,g,h)
		abiertos.push(tupla_actual);
		var explicacion="Inserto "+this.getTupleAsString(node_ids,tupla_actual)+" en la lista de abiertos.";////////////////
		
		contador_pasos+=1;
		explicacion="Paso "+contador_pasos+":\n"+explicacion;
		this.string_descriptions_steps.push(explicacion);//Incluir explicaciones en la resolucion
		this.network_steps.push(this.getNetworkStep(node_data,edge_data,abiertos,cerrados,node_ids,tupla_actual,adjMatrix));
		this.open_closed_steps.push("ABIERTOS:\n"+this.getListAsString(node_ids,abiertos)+"\n\nCERRADOS:\n"+this.getListAsString(node_ids,cerrados));
		
		explicacion="\n"+explicacion;

		var bound_cont=0;


		while(this.isEndNodeInClosed(nodos_finales,cerrados)==-1 && abiertos.length>0){
			if(this.isNodeInList(tupla_actual[1],cerrados)==-1){	
				explicacion="Elimino "+this.getTupleAsString(node_ids,tupla_actual)+" de la lista de abiertos.\n"+explicacion;////////////////
				
				abiertos.splice(abiertos.indexOf(tupla_actual), 1);


				var index_in_closed=this.isNodeInList(tupla_actual[1],cerrados);
				if(index_in_closed==-1){//El nodo actual no esta en la lista de cerrados
					explicacion="Inserto "+this.getTupleAsString(node_ids,tupla_actual)+" en la lista de cerrados (actualizando los posibles cambios producidos por propagaciones).\n"+explicacion;////////////////
					cerrados.push(tupla_actual);
					
					//COMENTAR ESTO SI FALLA EL ALGORITMO EN ALGUN CASO CON LAS PROPAGACIONES
					cerrados=this.update_costs(tupla_actual,cerrados,adjMatrix).slice(0);
				}else{//Si esta, tengo que ver si actualizo el camino porque es mejor o se queda el que estaba
					if(cerrados[index_in_closed][2]>tupla_actual[2]){
						explicacion="[ACTUALIZACION EN CERRADOS] El nodo "+this.getNodeId(node_ids,tupla_actual[1])+" ya estaba cerrado, pero he encontrado un mejor camino a el pasando por "+this.getNodeId(node_ids,tupla_actual[0])+". Cambio "+this.getTupleAsString(node_ids,cerrados[index_in_closed])+" por "+this.getTupleAsString(node_ids,tupla_actual)+". Propago la actualización.\n\n"+explicacion;////////////////
						cerrados[index_in_closed]=tupla_actual;
						//COMENTAR ESTO SI FALLA EL ALGORITMO EN ALGUN CASO CON LAS PROPAGACIONES
						cerrados=this.propagate_changes(tupla_actual,cerrados,adjMatrix).slice(0);
					}else if(abiertos.length==0){
						explicacion=explicacion+"La lista de cerrados no cambia (por lo que el nodo que iba a cerrados era peor que el nuevo o ya estaba visitado) y la lista de nodos abiertos esta vacia (en la siguiente iteracion no podemos abrir nodos que mejoren lo que ya habiamos abierto previamente), se ha detectado que se va a producir un ciclo infinito si insertamos el(los) hijo(s) de "+this.getNodeId(node_ids,tupla_actual[1])+".\n\n"+explicacion;////////////////
						contador_pasos+=1;
						explicacion="Paso "+contador_pasos+":\n"+explicacion;
						this.string_descriptions_steps.push(explicacion);//Incluir explicaciones en la resolucion
						this.network_steps.push(this.getNetworkStep(node_data,edge_data,abiertos,cerrados,node_ids,tupla_actual,adjMatrix));
						this.open_closed_steps.push("ABIERTOS:\n"+this.getListAsString(node_ids,abiertos)+"\n\nCERRADOS:\n"+this.getListAsString(node_ids,cerrados));
						
						break;
					}	
				}

				hijos=this.getAllSonNodes(adjMatrix,tupla_actual[1]);

				var nhijos=hijos.length;

				if(nhijos>0){
					explicacion="\n"+explicacion;////////////////
				}

				//Inserto los hijos
				var tupla_insert;
				var index_in_open;
				for(var i=0;i<nhijos;i++){
					tupla_insert=	[ 	
										tupla_actual[1],
										hijos[i],
										g_component_actual+adjMatrix[ tupla_actual[1] ][ hijos[i] ],
										node_heuristics[ hijos[i]] 
									];
					
					index_in_open=this.isNodeInList(tupla_insert[1],abiertos);
					index_in_closed=this.isNodeInList(tupla_insert[1],cerrados);

					if(index_in_open==-1 && index_in_closed==-1){//El nodo actual no esta en la lista de abiertos ni en cerrados
						explicacion="Inserto "+this.getTupleAsString(node_ids,tupla_insert)+" en la lista de abiertos.\n"+explicacion;////////////////
						abiertos.push(tupla_insert);//Inserto los hijos desde la primera posicion (en orden) en la lista de abiertos.
					}else if(index_in_open!=-1){//Actualizo el nodo en abiertos para que solo este el mejor camino a ese nodo
						if(abiertos[index_in_open][2]>tupla_insert[2]){
							explicacion="[ACTUALIZACION EN ABIERTOS] El nodo "+this.getNodeId(node_ids,tupla_insert[1])+" ya estaba abierto, pero he encontrado un mejor camino a el pasando por "+this.getNodeId(node_ids,tupla_insert[0])+". Cambio "+this.getTupleAsString(node_ids,abiertos[index_in_open])+" por "+this.getTupleAsString(node_ids,tupla_insert)+".\n"+explicacion;////////////////
							abiertos[index_in_open]=tupla_insert;
						}else{
							explicacion="El nodo "+this.getNodeId(node_ids,tupla_insert[1])+" ya estaba abierto, pero aunque he encontrado un camino alternativo (pasando por "+this.getNodeId(node_ids,tupla_insert[0])+"), no mejora el coste del camino actual. Me quedo con el que tenia.\n"+explicacion;////////////////
						}
					}else if(index_in_closed!=-1){//Actualizo el nodo en abiertos para que solo este el mejor camino a ese nodo
						if(cerrados[index_in_closed][2]>tupla_insert[2]){
							explicacion="[ACTUALIZACION EN CERRADOS] El nodo "+this.getNodeId(node_ids,tupla_insert[1])+" ya estaba cerrado, pero he encontrado un mejor camino a el pasando por "+this.getNodeId(node_ids,tupla_insert[0])+". Cambio "+this.getTupleAsString(node_ids,cerrados[index_in_closed])+" por "+this.getTupleAsString(node_ids,tupla_insert)+". Propago la actualización.\n"+explicacion;////////////////
							cerrados[index_in_closed]=tupla_insert;
							//COMENTAR ESTO SI FALLA EL ALGORITMO EN ALGUN CASO CON LAS PROPAGACIONES
							cerrados=this.propagate_changes(tupla_insert,cerrados,adjMatrix).slice(0);

						}else{
							explicacion="El nodo "+this.getNodeId(node_ids,tupla_insert[1])+" ya estaba cerrado, pero aunque he encontrado un camino alternativo (pasando por "+this.getNodeId(node_ids,tupla_insert[0])+"), no mejora el coste del camino actual. Me quedo con el que tenia.\n"+explicacion;////////////////
						}
					}

					
				}



				abiertos.sort(function(x, y){return x[1] > y[1];}); //ORDENO POR ORDEN LEXICOGRAFICO PARA CRITERIO DE DESEMPATE
			
				contador_pasos+=1;
				explicacion="Paso "+contador_pasos+":\n"+explicacion;
				this.string_descriptions_steps.push(explicacion);//Incluir explicaciones en la resolucion
				this.network_steps.push(this.getNetworkStep(node_data,edge_data,abiertos,cerrados,node_ids,tupla_actual,adjMatrix));
				this.open_closed_steps.push("ABIERTOS:\n"+this.getListAsString(node_ids,abiertos)+"\n\nCERRADOS:\n"+this.getListAsString(node_ids,cerrados));

				if(this.isInList(tupla_actual[1],nodos_finales)==-1){//Si el nodo de la tupla actual (nodo hijo de la tupla actual) NO es un nodo final lo meto en abiertos, si no, termino.
					if(abiertos.length>0){
						tupla_actual=abiertos[0];
						for(var i=0;i<abiertos.length;i++){ //Vamos a elegir el nodo cuya f=g+h sea menor
							if(abiertos[i][2]+abiertos[i][3] < tupla_actual[2]+tupla_actual[3]){
								tupla_actual=abiertos[i];
							}
						}
						g_component_actual=tupla_actual[2];
						explicacion="Cojo "+this.getTupleAsString(node_ids,tupla_actual)+" como tupla actual, por tener la menor funcion heuristica (o por criterio de desempate: orden lexicografico)\n\n"+explicacion;////////////////
					}
				}else{
					explicacion="El nodo "+this.getNodeId(node_ids,tupla_actual[1])+" es nodo final, he terminado.\n"+explicacion;////////////////
					
					contador_pasos+=1;
					explicacion="Paso "+contador_pasos+":\n"+explicacion;
					this.string_descriptions_steps.push(explicacion);//Incluir explicaciones en la resolucion
					this.network_steps.push(this.getNetworkStep(node_data,edge_data,abiertos,cerrados,node_ids,tupla_actual,adjMatrix));
					this.open_closed_steps.push("ABIERTOS:\n"+this.getListAsString(node_ids,abiertos)+"\n\nCERRADOS:\n"+this.getListAsString(node_ids,cerrados));
				}
			
				explicacion="\n"+explicacion;////////////////
				
			
			}else{//Si el nodo que ibamos a meter en abiertos estaba previamente en cerrados, debemos romper el bucle, pues hemos detectado un ciclo.
				contador_pasos+=1;
				explicacion="Paso "+contador_pasos+":\n"+explicacion;
				this.string_descriptions_steps.push(explicacion);//Incluir explicaciones en la resolucion
				this.network_steps.push(this.getNetworkStep(node_data,edge_data,abiertos,cerrados,node_ids,tupla_actual,adjMatrix));
				this.open_closed_steps.push("ABIERTOS:\n"+this.getListAsString(node_ids,abiertos)+"\n\nCERRADOS:\n"+this.getListAsString(node_ids,cerrados));
				


				break;
			}

			bound_cont+=1;
			if(bound_cont==iter_bound){
				break;
			}
		}

		tupla_actual=cerrados[cerrados.length-1];

		if(nodos_finales.includes(tupla_actual[1])){ // Si el ultimo nodo de finales es un nodo final, habremos encontrado un camino
			//CALCULO DEL COSTE
			coste=0;
			//FIN CALCULO DEL COSTE

			//OBTENCION DEL CAMINO POR INDICES
			var camino=[];
			camino.push(tupla_actual[1]);
			var padre=tupla_actual[0];

			coste+=adjMatrix[tupla_actual[0]][tupla_actual[1]];

			cerrados.splice(cerrados.indexOf(tupla_actual), 1); //Elimino de cerrados la tupla actual
			
			while(padre!=null){
				tupla_actual=null;
				for(var i=0;i<cerrados.length;i++){ //ELIJO LA MEJOR TUPLA PADRE DE ENTRE LAS POTENCIALES
					if(cerrados[i][1]==padre){ //EN ESTE BLOQUE APLICAMOS EL CRITERIO DE DESEMPATE EN CASO DE SER NECESARIO, PORQUE AQUI SE CALCULARAN LOS PADRES POTENCIALES
						if(tupla_actual==null){
							tupla_actual=cerrados[i];	
						}else{
							if(cerrados[i][2]+cerrados[i][3] < cerrados[i][2]+cerrados[i][3]){
								tupla_actual=cerrados[i];	
							}
						}
						
					}
				}	

				camino.push(tupla_actual[1]);
				padre=tupla_actual[0];

				if(padre!=null){
					coste+=adjMatrix[padre][tupla_actual[1]];
				}
				cerrados.splice(cerrados.indexOf(tupla_actual), 1); //Elimino de cerrados la tupla actual
			}
			//FIN OBTENCION DEL CAMINO POR INDICES
		

			


			//OBTENCION DEL CAMINO POR NOMBRES
			for(var i=0;i<camino.length;i++){
				camino[i]=this.getNodeId(node_ids,camino[i]);
			}
			camino.reverse();
			//FIN OBTENCION DEL CAMINO POR NOMBRES
			

			this.string_descriptions_steps[this.string_descriptions_steps.length-1]="El camino encontrado es: "+camino+", con coste: "+coste+".\n\n"+this.string_descriptions_steps[this.string_descriptions_steps.length-1];
		}else{
			this.string_descriptions_steps[this.string_descriptions_steps.length-1]="No fue posible encontrar un camino entre "+initial_node_id+" y algun nodo final: "+end_nodes_id+".\n"+this.string_descriptions_steps[this.string_descriptions_steps.length-1];
		}
		return {descriptions: this.string_descriptions_steps, steps: this.network_steps, lists: this.open_closed_steps};
	}


























































	//Busqueda en anchura
	wideSearch(network_nodes,network_edges,initial_node_id,end_nodes_id,iter_bound){
		var contador_pasos=0;

		this.string_descriptions_steps=[];
		this.network_steps=[];
		this.open_closed_steps=[];

		//OBTENCION DE ID DE NODOS Y VALOR HEURISTICO
		var node_data = network_nodes.get({
	      fields: ['id','label','title','color'], //De cada nodo obtengo el id, el string que muestra, el valor heuristico y el color
	    });

		var edge_data = network_edges.get({
	      fields: ['from','to','id','label','arrows'],    
	    });

		var nnodes=node_data.length;
	    
	    var node_ids=new Array(nnodes);
	    var node_heuristics=new Array(nnodes);
	    for(var i=0;i<nnodes;i++){
	    	node_ids[i]=node_data[i].id; //Obtengo la id
	    	node_heuristics[i]=Number(node_data[i].title); //Obtengo el valor heuristico
	    }
	    //FIN OBTENCION DE ID DE NODOS Y VALOR HEURISTICO

	    //OBTENCION DE LOS ID DE LAS ARISTAS
	    var nedges=edge_data.length;
	    
	    var edge_ids=new Array(nedges);
	    for(var i=0;i<nedges;i++){
	    	edge_ids[i]=edge_data[i].id; //Obtengo la id
	    }
	    //FIN OBTENCION DE LOS ID DE LAS ARISTAS

	    //ORDENACION POR ORDEN LEXICOGRAFICO
		var ordered_nodes=this.sortDepend(node_ids,node_heuristics);
	    node_ids=ordered_nodes[0];
	    node_heuristics=ordered_nodes[1];

	    var adjMatrix=this.getAdjMatrix(network_edges,node_ids,edge_ids);
	    //FIN ORDENACION POR ORDEN LEXICOGRAFICO

	    //PREPARAR EL PROBLEMA PARA COMENZAR A TRABAJAR CON INDICES NUMERICOS
	  	var nodo_inicial=node_ids.indexOf(initial_node_id);
		var nodos_finales=new Array(end_nodes_id.length);

		for(var i=0;i<end_nodes_id.length;i++){
			nodos_finales[i]=node_ids.indexOf(end_nodes_id[i]);
		}
		//FIN PREPARAR EL PROBLEMA PARA COMENZAR A TRABAJAR CON INDICES NUMERICOS
		
		var abiertos=[];
		var cerrados=[];
		var hijos;
		var coste=0;

		var tupla_actual=[null,nodo_inicial];
		abiertos.push(tupla_actual);
		var explicacion="Inserto "+this.getTupleAsString(node_ids,tupla_actual)+" en la lista de abiertos.";////////////////
		
		contador_pasos+=1;
		explicacion="Paso "+contador_pasos+":\n"+explicacion;
		this.string_descriptions_steps.push(explicacion);//Incluir explicaciones en la resolucion
		this.network_steps.push(this.getNetworkStep(node_data,edge_data,abiertos,cerrados,node_ids,tupla_actual,adjMatrix));
		this.open_closed_steps.push("ABIERTOS:\n"+this.getListAsString(node_ids,abiertos)+"\n\nCERRADOS:\n"+this.getListAsString(node_ids,cerrados));
		
		var bound_cont=0;

		explicacion="\n"+explicacion;


		while(this.isEndNodeInClosed(nodos_finales,cerrados)==-1 && abiertos.length>0){
			
			if(this.isNodeInList(tupla_actual[1],cerrados)==-1){ //Si el nodo que vamos a abrir no está en cerrados, esto es, no ha sido ya visitado, procedemos a meterlo
				
				explicacion="Elimino "+this.getTupleAsString(node_ids,tupla_actual)+" de la lista de abiertos.\n"+explicacion;////////////////
				
				abiertos.splice(abiertos.indexOf(tupla_actual), 1);
				
				explicacion="Inserto "+this.getTupleAsString(node_ids,tupla_actual)+" en la lista de cerrados.\n"+explicacion;////////////////

				cerrados.push(tupla_actual);
				

				hijos=this.getAllSonNodes(adjMatrix,tupla_actual[1]);
				var nhijos=hijos.length
				if(nhijos>0)
					explicacion="\n"+explicacion;

				var posicion_insert=0;
				var tupla_insert;
				for(var i=0;i<nhijos;i++){
					//DETECCION DE CICLOS EN EL GRAFO
					tupla_insert=[ tupla_actual[1],hijos[i] ]
					if(this.isNodeInList(tupla_insert[1],abiertos)==-1 && this.isNodeInList(tupla_insert[1],cerrados)==-1){
						explicacion="Inserto "+this.getTupleAsString(node_ids,tupla_insert)+" en la lista de abiertos.\n"+explicacion;////////////////
						abiertos.push(tupla_insert);
						posicion_insert+=1;			
					}else{
						explicacion="NO Inserto "+this.getTupleAsString(node_ids,tupla_insert)+" en la lista de abiertos porque ya esta abierto, cerrado o ya ha sido visitado.\n"+explicacion;////////////////
					}
				}
				
				contador_pasos+=1;
				explicacion="Paso "+contador_pasos+":\n"+explicacion;
				this.string_descriptions_steps.push(explicacion);//Incluir explicaciones en la resolucion
				this.network_steps.push(this.getNetworkStep(node_data,edge_data,abiertos,cerrados,node_ids,tupla_actual,adjMatrix));
				this.open_closed_steps.push("ABIERTOS:\n"+this.getListAsString(node_ids,abiertos)+"\n\nCERRADOS:\n"+this.getListAsString(node_ids,cerrados));

				explicacion="\n"+explicacion;

				if(this.isInList(tupla_actual[1],nodos_finales)==-1){//Si el nodo de la tupla actual (nodo hijo de la tupla actual) NO es un nodo final lo meto en abiertos, si no, termino.
					
					if(abiertos.length>0){
						tupla_actual=abiertos[0];
						explicacion="Cojo "+this.getTupleAsString(node_ids,tupla_actual)+" como tupla actual.\n"+explicacion;////////////////
					}
				}else{
					explicacion="El nodo "+this.getNodeId(node_ids,tupla_actual[1])+" es nodo final, he terminado.\n"+explicacion;////////////////

					contador_pasos+=1;
					explicacion="Paso "+contador_pasos+":\n"+explicacion;
					this.string_descriptions_steps.push(explicacion);//Incluir explicaciones en la resolucion
					this.network_steps.push(this.getNetworkStep(node_data,edge_data,abiertos,cerrados,node_ids,tupla_actual,adjMatrix));
					this.open_closed_steps.push("ABIERTOS:\n"+this.getListAsString(node_ids,abiertos)+"\n\nCERRADOS:\n"+this.getListAsString(node_ids,cerrados));


				}
				

				explicacion="\n"+explicacion;////////////////
				
			}else{//Si el nodo que ibamos a meter en abiertos estaba previamente en cerrados, debemos romper el bucle, pues hemos detectado un ciclo.
				explicacion="Se vuelve a visitar el nodo "+this.getNodeId(node_ids,tupla_actual[1])+" y se produce un ciclo infinito.\n"+explicacion;
				
				contador_pasos+=1;
				explicacion="Paso "+contador_pasos+":\n"+explicacion;
				this.string_descriptions_steps.push(explicacion);//Incluir explicaciones en la resolucion
				this.network_steps.push(this.getNetworkStep(node_data,edge_data,abiertos,cerrados,node_ids,tupla_actual,adjMatrix));
				this.open_closed_steps.push("ABIERTOS:\n"+this.getListAsString(node_ids,abiertos)+"\n\nCERRADOS:\n"+this.getListAsString(node_ids,cerrados));
				break;
			}




			bound_cont+=1;
			if(bound_cont==iter_bound){
				break;
			}
		}
			
		tupla_actual=cerrados[cerrados.length-1];
		
		if(nodos_finales.includes(tupla_actual[1])){ // Si el ultimo nodo de finales es un nodo final, habremos encontrado un camino
			//OBTENCION DEL CAMINO POR INDICES
			var camino=[];
			camino.push(tupla_actual[1]);
			var padre=tupla_actual[0];

			cerrados.splice(cerrados.indexOf(tupla_actual), 1); //Elimino de cerrados la tupla actual
			//Elimino todos los que tengan como origen el mismo origen que la tupla actual, para reducir, si es posible, la lista de cerrados
			for(var i=0;i<cerrados.length;i++){
				if(cerrados[i][0]==tupla_actual[0]){
					cerrados.splice(i, 1); //Elimino de cerrados la tupla actual				
				}
			}


			//EN BUSQUEDA EN PROFUNDIDAD, AL TERMINAR, CADA NODO VIENE DE UN SOLO PADRE, EN CERRADOS, UN NODO SOLO PUEDE VENIR DE UN PADRE.
			while(padre!=null){
				for(var i=0;i<cerrados.length;i++){
					if(cerrados[i][1]==padre){ //EN ESTE BLOQUE HAY QUE APLICAR EL CRITERIO DE DESEMPATE EN CASO DE SER NECESARIO, PORQUE AQUI SE CALCULARAN LOS PADRES POTENCIALES
						//potential_parents.push(cerrados[i]);
						tupla_actual=cerrados[i];
						camino.push(tupla_actual[1]);
						padre=tupla_actual[0]
						break;
					}
				}
			}
			//FIN OBTENCION DEL CAMINO POR INDICES
		

			//CALCULO DEL COSTE
			if(camino.length>1){//Hay mas de un nodo en el camino
				coste+=adjMatrix[camino[1]][camino[0]];
				for(var i=2;i<camino.length;i++){
					coste+=adjMatrix[camino[i]][camino[i-1]];
				}
			}else{
				coste=0;
			}
			//FIN CALCULO DEL COSTE


			//OBTENCION DEL CAMINO POR NOMBRES
			for(var i=0;i<camino.length;i++){
				camino[i]=this.getNodeId(node_ids,camino[i]);
			}
			camino.reverse();
			//FIN OBTENCION DEL CAMINO POR NOMBRES
			

			this.string_descriptions_steps[this.string_descriptions_steps.length-1]="El camino encontrado es: "+camino+", con coste: "+coste+".\n\n"+this.string_descriptions_steps[this.string_descriptions_steps.length-1];
		}else{
			this.string_descriptions_steps[this.string_descriptions_steps.length-1]="No fue posible encontrar un camino entre "+initial_node_id+" y algun nodo final: "+end_nodes_id+".\n\n"+this.string_descriptions_steps[this.string_descriptions_steps.length-1];
		}

		return {descriptions: this.string_descriptions_steps, steps: this.network_steps, lists: this.open_closed_steps};
	}




























































	//DIJKSTRA
	uniformCost(network_nodes,network_edges,initial_node_id,end_nodes_id,iter_bound){
		var contador_pasos=0;

		this.string_descriptions_steps=[];
		this.network_steps=[];
		this.open_closed_steps=[];

		//OBTENCION DE ID DE NODOS Y VALOR HEURISTICO
		var node_data = network_nodes.get({
	      fields: ['id','label','title','color'], //De cada nodo obtengo el id, el string que muestra, el valor heuristico y el color
	    });

		var edge_data = network_edges.get({
	      fields: ['from','to','id','label','arrows'],    
	    });

		var nnodes=node_data.length;
	    
	    var node_ids=new Array(nnodes);
	    var node_heuristics=new Array(nnodes);
	    for(var i=0;i<nnodes;i++){
	    	node_ids[i]=node_data[i].id; //Obtengo la id
	    	node_heuristics[i]=Number(node_data[i].title); //Obtengo el valor heuristico
	    }
	    //FIN OBTENCION DE ID DE NODOS Y VALOR HEURISTICO


		//OBTENCION DE LOS ID DE LAS ARISTAS
	    var nedges=edge_data.length;
	    
	    var edge_ids=new Array(nedges);
	    for(var i=0;i<nedges;i++){
	    	edge_ids[i]=edge_data[i].id; //Obtengo la id
	    }
	    //FIN OBTENCION DE LOS ID DE LAS ARISTAS

	    //ORDENACION POR ORDEN LEXICOGRAFICO: AQUI TAMBIEN HACE FALTA PARA DECIDIRNOS POR EL PRIMERO EN CASO DE EMPATE
		var ordered_nodes=this.sortDepend(node_ids,node_heuristics);
	    node_ids=ordered_nodes[0];
	    node_heuristics=ordered_nodes[1];
	    var adjMatrix=this.getAdjMatrix(network_edges,node_ids,edge_ids);
	    //FIN ORDENACION POR ORDEN LEXICOGRAFICO

	    //PREPARAR EL PROBLEMA PARA COMENZAR A TRABAJAR CON INDICES NUMERICOS
	  	var nodo_inicial=node_ids.indexOf(initial_node_id);
		var nodos_finales=new Array(end_nodes_id.length);

		for(var i=0;i<end_nodes_id.length;i++){
			nodos_finales[i]=node_ids.indexOf(end_nodes_id[i]);
		}
		//FIN PREPARAR EL PROBLEMA PARA COMENZAR A TRABAJAR CON INDICES NUMERICOS

		var abiertos=[];
		var cerrados=[];
		var hijos;
		var coste=0;
		
		var g_component_actual=0;
		var tupla_actual=[ null,nodo_inicial,g_component_actual]; //(padre,hijo,g,h)
		abiertos.push(tupla_actual);
		var explicacion="Inserto "+this.getTupleAsString(node_ids,tupla_actual)+" en la lista de abiertos.";////////////////
		
		contador_pasos+=1;
		explicacion="Paso "+contador_pasos+":\n"+explicacion;
		this.string_descriptions_steps.push(explicacion);//Incluir explicaciones en la resolucion
		this.network_steps.push(this.getNetworkStep(node_data,edge_data,abiertos,cerrados,node_ids,tupla_actual,adjMatrix));
		this.open_closed_steps.push("ABIERTOS:\n"+this.getListAsString(node_ids,abiertos)+"\n\nCERRADOS:\n"+this.getListAsString(node_ids,cerrados));
		
		explicacion="\n"+explicacion;

		var bound_cont=0;


		while(this.isEndNodeInClosed(nodos_finales,cerrados)==-1 && abiertos.length>0){
			if(this.isNodeInList(tupla_actual[1],cerrados)==-1){	
				explicacion="Elimino "+this.getTupleAsString(node_ids,tupla_actual)+" de la lista de abiertos.\n"+explicacion;////////////////
				
				abiertos.splice(abiertos.indexOf(tupla_actual), 1);


				var index_in_closed=this.isNodeInList(tupla_actual[1],cerrados);
				if(index_in_closed==-1){//El nodo actual no esta en la lista de cerrados
					explicacion="Inserto "+this.getTupleAsString(node_ids,tupla_actual)+" en la lista de cerrados (actualizando los posibles cambios producidos por propagaciones).\n"+explicacion;////////////////
					cerrados.push(tupla_actual);
					//COMENTAR ESTO SI FALLA EN ALGUN CASO EL ALGORITMO CON LAS PROPAGACIONES
					cerrados=this.update_costs(tupla_actual,cerrados,adjMatrix).slice(0);
				}else{//Si esta, tengo que ver si actualizo el camino porque es mejor o se queda el que estaba
					if(cerrados[index_in_closed][2]>tupla_actual[2]){
						explicacion="[ACTUALIZACION EN CERRADOS] El nodo "+this.getNodeId(node_ids,tupla_actual[1])+" ya estaba cerrado, pero he encontrado un mejor camino a el pasando por "+this.getNodeId(node_ids,tupla_actual[0])+". Cambio "+this.getTupleAsString(node_ids,cerrados[index_in_closed])+" por "+this.getTupleAsString(node_ids,tupla_actual)+". Propago la actualización.\n\n"+explicacion;////////////////
						cerrados[index_in_closed]=tupla_actual;
						//COMENTAR ESTO SI FALLA EN ALGUN CASO EL ALGORITMO CON LAS PROPAGACIONES
						cerrados=this.propagate_changes(tupla_actual,cerrados,adjMatrix).slice(0);
					}else if(abiertos.length==0){
						explicacion=explicacion+"La lista de cerrados no cambia (por lo que el nodo que iba a cerrados era peor que el nuevo o ya estaba visitado) y la lista de nodos abiertos esta vacia (en la siguiente iteracion no podemos abrir nodos que mejoren lo que ya habiamos abierto previamente), se ha detectado que se va a producir un ciclo infinito si insertamos el(los) hijo(s) de "+this.getNodeId(node_ids,tupla_actual[1])+".\n\n"+explicacion;////////////////
						contador_pasos+=1;
						explicacion="Paso "+contador_pasos+":\n"+explicacion;
						this.string_descriptions_steps.push(explicacion);//Incluir explicaciones en la resolucion
						this.network_steps.push(this.getNetworkStep(node_data,edge_data,abiertos,cerrados,node_ids,tupla_actual,adjMatrix));
						this.open_closed_steps.push("ABIERTOS:\n"+this.getListAsString(node_ids,abiertos)+"\n\nCERRADOS:\n"+this.getListAsString(node_ids,cerrados));
						
						break;
					}	
				}

				hijos=this.getAllSonNodes(adjMatrix,tupla_actual[1]);

				var nhijos=hijos.length;

				if(nhijos>0){
					explicacion="\n"+explicacion;////////////////
				}

				//Inserto los hijos
				var tupla_insert;
				var index_in_open;
				for(var i=0;i<nhijos;i++){
					tupla_insert=	[ 	
										tupla_actual[1],
										hijos[i],
										g_component_actual+adjMatrix[ tupla_actual[1] ][ hijos[i] ]
									];
					
					index_in_open=this.isNodeInList(tupla_insert[1],abiertos);
					index_in_closed=this.isNodeInList(tupla_insert[1],cerrados);

					if(index_in_open==-1 && index_in_closed==-1){//El nodo actual no esta en la lista de abiertos ni en cerrados
						explicacion="Inserto "+this.getTupleAsString(node_ids,tupla_insert)+" en la lista de abiertos.\n"+explicacion;////////////////
						abiertos.push(tupla_insert);//Inserto los hijos desde la primera posicion (en orden) en la lista de abiertos.
					}else if(index_in_open!=-1){//Actualizo el nodo en abiertos para que solo este el mejor camino a ese nodo
						if(abiertos[index_in_open][2]>tupla_insert[2]){

							explicacion="[ACTUALIZACION EN ABIERTOS] El nodo "+this.getNodeId(node_ids,tupla_insert[1])+" ya estaba abierto, pero he encontrado un mejor camino a el pasando por "+this.getNodeId(node_ids,tupla_insert[0])+". Cambio "+this.getTupleAsString(node_ids,abiertos[index_in_open])+" por "+this.getTupleAsString(node_ids,tupla_insert)+".\n"+explicacion;////////////////
							abiertos[index_in_open]=tupla_insert;

						}else{
							explicacion="El nodo "+this.getNodeId(node_ids,tupla_insert[1])+" ya estaba abierto, pero aunque he encontrado un camino alternativo (pasando por "+this.getNodeId(node_ids,tupla_insert[0])+"), no mejora el coste del camino actual. Me quedo con el que tenia.\n"+explicacion;////////////////
						}
					}else if(index_in_closed!=-1){//Actualizo el nodo en abiertos para que solo este el mejor camino a ese nodo
						if(cerrados[index_in_closed][2]>tupla_insert[2]){
							explicacion="[ACTUALIZACION EN CERRADOS] El nodo "+this.getNodeId(node_ids,tupla_insert[1])+" ya estaba cerrado, pero he encontrado un mejor camino a el pasando por "+this.getNodeId(node_ids,tupla_insert[0])+". Cambio "+this.getTupleAsString(node_ids,cerrados[index_in_closed])+" por "+this.getTupleAsString(node_ids,tupla_insert)+". Propago la actualización.\n"+explicacion;////////////////
							cerrados[index_in_closed]=tupla_insert;
							//COMENTAR ESTO SI FALLA EN ALGUN CASO EL ALGORITMO CON LAS PROPAGACIONES
							cerrados=this.propagate_changes(tupla_insert,cerrados,adjMatrix).slice(0);

						}else{
							explicacion="El nodo "+this.getNodeId(node_ids,tupla_insert[1])+" ya estaba cerrado, pero aunque he encontrado un camino alternativo (pasando por "+this.getNodeId(node_ids,tupla_insert[0])+"), no mejora el coste del camino actual. Me quedo con el que tenia.\n"+explicacion;////////////////
						}
					}

					
				}



				abiertos.sort(function(x, y){return x[1] > y[1];}); //ORDENO POR ORDEN LEXICOGRAFICO PARA CRITERIO DE DESEMPATE
			
				contador_pasos+=1;
				explicacion="Paso "+contador_pasos+":\n"+explicacion;
				this.string_descriptions_steps.push(explicacion);//Incluir explicaciones en la resolucion
				this.network_steps.push(this.getNetworkStep(node_data,edge_data,abiertos,cerrados,node_ids,tupla_actual,adjMatrix));
				this.open_closed_steps.push("ABIERTOS:\n"+this.getListAsString(node_ids,abiertos)+"\n\nCERRADOS:\n"+this.getListAsString(node_ids,cerrados));

				if(this.isInList(tupla_actual[1],nodos_finales)==-1){//Si el nodo de la tupla actual (nodo hijo de la tupla actual) NO es un nodo final lo meto en abiertos, si no, termino.
					if(abiertos.length>0){
						tupla_actual=abiertos[0];
						for(var i=0;i<abiertos.length;i++){ //Vamos a elegir el nodo cuya f=g+h sea menor
							if(abiertos[i][2] < tupla_actual[2]){
								tupla_actual=abiertos[i];
							}
						}
						g_component_actual=tupla_actual[2];
						explicacion="Cojo "+this.getTupleAsString(node_ids,tupla_actual)+" como tupla actual, por tener la menor funcion heuristica (o por criterio de desempate: orden lexicografico)\n\n"+explicacion;////////////////
						
					}
				}else{
					explicacion="El nodo "+this.getNodeId(node_ids,tupla_actual[1])+" es nodo final, he terminado.\n"+explicacion;////////////////
					
					contador_pasos+=1;
					explicacion="Paso "+contador_pasos+":\n"+explicacion;
					this.string_descriptions_steps.push(explicacion);//Incluir explicaciones en la resolucion
					this.network_steps.push(this.getNetworkStep(node_data,edge_data,abiertos,cerrados,node_ids,tupla_actual,adjMatrix));
					this.open_closed_steps.push("ABIERTOS:\n"+this.getListAsString(node_ids,abiertos)+"\n\nCERRADOS:\n"+this.getListAsString(node_ids,cerrados));
				}
			
				explicacion="\n"+explicacion;////////////////
				
			
			}else{//Si el nodo que ibamos a meter en abiertos estaba previamente en cerrados, debemos romper el bucle, pues hemos detectado un ciclo.
				contador_pasos+=1;
				explicacion="Paso "+contador_pasos+":\n"+explicacion;
				this.string_descriptions_steps.push(explicacion);//Incluir explicaciones en la resolucion
				this.network_steps.push(this.getNetworkStep(node_data,edge_data,abiertos,cerrados,node_ids,tupla_actual,adjMatrix));
				this.open_closed_steps.push("ABIERTOS:\n"+this.getListAsString(node_ids,abiertos)+"\n\nCERRADOS:\n"+this.getListAsString(node_ids,cerrados));
				


				break;
			}
			bound_cont+=1;
			if(bound_cont==iter_bound){
				break;
			}
		}

		tupla_actual=cerrados[cerrados.length-1];

		if(nodos_finales.includes(tupla_actual[1])){ // Si el ultimo nodo de finales es un nodo final, habremos encontrado un camino
			//CALCULO DEL COSTE
			coste=0;//tupla_actual[2]; //El coste del camino en A* es la función G del nodo final (que coste se recorrio hasta llegar a el).
			//FIN CALCULO DEL COSTE



			//OBTENCION DEL CAMINO POR INDICES
			var camino=[];
			camino.push(tupla_actual[1]);
			var padre=tupla_actual[0];

			coste+=adjMatrix[tupla_actual[0]][tupla_actual[1]];

			cerrados.splice(cerrados.indexOf(tupla_actual), 1); //Elimino de cerrados la tupla actual

			
			while(padre!=null){
				tupla_actual=null;
				for(var i=0;i<cerrados.length;i++){ //ELIJO LA MEJOR TUPLA PADRE DE ENTRE LAS POTENCIALES
					if(cerrados[i][1]==padre){ //EN ESTE BLOQUE APLICAMOS EL CRITERIO DE DESEMPATE EN CASO DE SER NECESARIO, PORQUE AQUI SE CALCULARAN LOS PADRES POTENCIALES
						if(tupla_actual==null){
							tupla_actual=cerrados[i];	
						}else{
							if(cerrados[i][2] < cerrados[i][2]){
								tupla_actual=cerrados[i];	
							}
						}
						
					}
				}	


				camino.push(tupla_actual[1]);
				padre=tupla_actual[0];

				if(padre!=null){
					coste+=adjMatrix[padre][tupla_actual[1]];
				}
				



				cerrados.splice(cerrados.indexOf(tupla_actual), 1); //Elimino de cerrados la tupla actual
			}
			//FIN OBTENCION DEL CAMINO POR INDICES
		

			


			//OBTENCION DEL CAMINO POR NOMBRES
			for(var i=0;i<camino.length;i++){
				camino[i]=this.getNodeId(node_ids,camino[i]);
			}
			camino.reverse();
			//FIN OBTENCION DEL CAMINO POR NOMBRES
			
			this.string_descriptions_steps[this.string_descriptions_steps.length-1]="El camino encontrado es: "+camino+", con coste: "+coste+".\n\n"+this.string_descriptions_steps[this.string_descriptions_steps.length-1];
		}else{
			this.string_descriptions_steps[this.string_descriptions_steps.length-1]="No fue posible encontrar un camino entre "+initial_node_id+" y algun nodo final: "+end_nodes_id+".\n"+this.string_descriptions_steps[this.string_descriptions_steps.length-1];
		}
		return {descriptions: this.string_descriptions_steps, steps: this.network_steps, lists: this.open_closed_steps};
	}








































































































































































































































































	////////////////////////////////////////////////////////////////FUNCIONES ESPECIALES PARA BUSQUEDA RETROACTIVA////////////////////////////////////////////////////////////////


	getNetworkStepRetroactiveSearch(node_data,edge_data,node_ids,step_list,adjMatrix){
		var nodes_step=[];
		var edges_step=[];

		if(this.network_steps.length==0){//Paso inicial
			
			for(var i=0;i<node_data.length;i++){
	    		if(node_data[i].id==this.getNodeId(node_ids,step_list[0][0])){
	    			nodes_step.push(node_data[i]);
	    			break;
	    		}
		    }
		    
		    return {nodes:nodes_step,edges:edges_step};
		}else{//Paso no inicial
			
			var index_last_step=this.network_steps.length-1;

			//METO LOS NODOS DEL ULTIMO PASO
			for(var i=0;i<this.network_steps[index_last_step].nodes.length;i++){
				nodes_step.push(this.network_steps[index_last_step].nodes[i]);	
			}

			//METO LOS ARCOS DEL ULTIMO PASO
			for(var i=0;i<this.network_steps[index_last_step].edges.length;i++){
				edges_step.push(this.network_steps[index_last_step].edges[i]);	
			}

			var index_last_paso=step_list.length-1;
			
			if(index_last_paso>=1){//Si Hay al menos dos nodos en la lista de pasos
				//METO LOS NODOS HIJOS DE LA TUPLA ACTUAL SI NO ESTAN YA		
				for(var i=0;i<node_data.length;i++){
					if(node_ids.indexOf(node_data[i].id)==step_list[index_last_paso][0] && !nodes_step.includes(node_data[i])){
						nodes_step.push(node_data[i]);
						break;
					}
				}

				//METO LOS ARCOS DE LA TUPLA ACTUAL SI NO ESTAN YA
				for(var i=0;i<edge_data.length;i++){
					if(
						//O es unidireccional con direccion obligatoria
						((node_ids.indexOf(edge_data[i].from)==step_list[index_last_paso-1][0] && node_ids.indexOf(edge_data[i].to)==step_list[index_last_paso][0] && edge_data[i].arrows=="to") ||
						 //O es bidireccional y puede ir para los dos lados
						 ((node_ids.indexOf(edge_data[i].from)==step_list[index_last_paso-1][0] && node_ids.indexOf(edge_data[i].to)==step_list[index_last_paso][0]) ||
						 	(node_ids.indexOf(edge_data[i].to)==step_list[index_last_paso-1][0] && node_ids.indexOf(edge_data[i].from)==step_list[index_last_paso][0])))	
						&& !edges_step.includes(edge_data[i])){
						edges_step.push(edge_data[i]);
					}
				}
			}
			return {nodes:nodes_step,edges:edges_step};
		}
	}

	getTupleAsStringRetroactiveSearch(node_ids,tuple){
		return "("+this.getNodeId(node_ids,tuple[0])+","+tuple[1]+")";
	}


	getListAsStringRetroactiveSearch(node_ids,list){
		var str_list="[";
		var ntuples=list.length;
		for(var i=0;i<ntuples;i++){
			if(i==ntuples-1){
				str_list=str_list+this.getTupleAsStringRetroactiveSearch(node_ids,list[i]);
			}else{
				str_list=str_list+this.getTupleAsStringRetroactiveSearch(node_ids,list[i])+",";
			}
		}
		str_list=str_list+"]"
		return str_list;
	}


	isEndNodeFoundRetroactiveSearch(end_nodes,step_list){
		for(var i=0;i<step_list.length;i++){
			if(end_nodes.includes(step_list[i][0])){
				return i;
			}
		}
		return -1;
	}

	isNodeVisitedRetroactiveSearch(node,step_list){
		for(var i=0;i<step_list.length;i++){
			if(step_list[i][0]==node){
				return i;
				break;
			}
		}
		return -1;

	}


	//////////////////////////////////////////////////////////////FIN FUNCIONES ESPECIALES PARA BUSQUEDA RETROACTIVA//////////////////////////////////////////////////////////////






	retroactiveSearch(network_nodes,network_edges,initial_node_id,end_nodes_id,iter_bound){
		var contador_pasos=0;

		this.string_descriptions_steps=[];
		this.network_steps=[];
		this.open_closed_steps=[];

		//OBTENCION DE ID DE NODOS Y VALOR HEURISTICO
		var node_data = network_nodes.get({
	      fields: ['id','label','title','color'], //De cada nodo obtengo el id, el string que muestra, el valor heuristico y el color
	    });

		var edge_data = network_edges.get({
	      fields: ['from','to','id','label','arrows'],    
	    });

		var nnodes=node_data.length;
	    
	    var node_ids=new Array(nnodes);
	    var node_heuristics=new Array(nnodes);
	    for(var i=0;i<nnodes;i++){
	    	node_ids[i]=node_data[i].id; //Obtengo la id
	    	node_heuristics[i]=Number(node_data[i].title); //Obtengo el valor heuristico
	    }
	    //FIN OBTENCION DE ID DE NODOS Y VALOR HEURISTICO

	    //OBTENCION DE LOS ID DE LAS ARISTAS
	    var nedges=edge_data.length;
	    
	    var edge_ids=new Array(nedges);
	    for(var i=0;i<nedges;i++){
	    	edge_ids[i]=edge_data[i].id; //Obtengo la id
	    }
	    //FIN OBTENCION DE LOS ID DE LAS ARISTAS

	    //ORDENACION POR ORDEN LEXICOGRAFICO: AQUI TAMBIEN HACE FALTA PARA DECIDIRNOS POR EL PRIMERO EN CASO DE EMPATE
		var ordered_nodes=this.sortDepend(node_ids,node_heuristics);
	    node_ids=ordered_nodes[0];
	    node_heuristics=ordered_nodes[1];
	    var adjMatrix=this.getAdjMatrix(network_edges,node_ids,edge_ids);
	    //FIN ORDENACION POR ORDEN LEXICOGRAFICO

	    //PREPARAR EL PROBLEMA PARA COMENZAR A TRABAJAR CON INDICES NUMERICOS
	  	var nodo_inicial=node_ids.indexOf(initial_node_id);
		var nodos_finales=new Array(end_nodes_id.length);

		for(var i=0;i<end_nodes_id.length;i++){
			nodos_finales[i]=node_ids.indexOf(end_nodes_id[i]);
		}
		//FIN PREPARAR EL PROBLEMA PARA COMENZAR A TRABAJAR CON INDICES NUMERICOS

		var lista_pasos=[];

		var tupla_actual=[nodo_inicial,0]; //(nodo actual,numero de hijos abiertos)
		lista_pasos.push(tupla_actual);
		var explicacion="Se expande el nodo inicial "+this.getNodeId(node_ids,tupla_actual[0])+".";////////////////
		
		contador_pasos+=1;
		explicacion="Paso "+contador_pasos+":\n"+explicacion;
		this.string_descriptions_steps.push(explicacion);//Incluir explicaciones en la resolucion
		this.network_steps.push(this.getNetworkStepRetroactiveSearch(node_data,edge_data,node_ids,lista_pasos,adjMatrix));
		this.open_closed_steps.push("Lista de nodos:\n"+this.getListAsStringRetroactiveSearch(node_ids,lista_pasos));
		
		var bound_cont=0;
		var index_last_paso=0;
		var hay_camino=true;

		while(this.isEndNodeFoundRetroactiveSearch(nodos_finales,lista_pasos)==-1 && lista_pasos.length>0){

			//Obtengo el hijo que voy a expandir a continuacion
			var num_hijo=tupla_actual[1];
			var hijo=this.getNthSonNode(adjMatrix,tupla_actual[0],num_hijo);
			
			while(this.isNodeVisitedRetroactiveSearch(hijo,lista_pasos)!=-1){//Mientras que el hijo ya este abierto, genero el siguiente hijo
				explicacion="El nodo "+this.getNodeId(node_ids,hijo)+" hijo de "+this.getNodeId(node_ids,tupla_actual[0])+" ya habia sido expandido, genero el siguiente hijo.\n\n"+explicacion;////////////////
				num_hijo+=1;
				hijo=this.getNthSonNode(adjMatrix,tupla_actual[0],num_hijo);	
			}

			if(hijo!=null && this.isNodeVisitedRetroactiveSearch(hijo,lista_pasos)==-1){
				lista_pasos.push([hijo,0]);
				//Actualizo la tupla actual
				lista_pasos[index_last_paso][1]+=1
				index_last_paso+=1;
				explicacion="Se expande el nodo "+this.getNodeId(node_ids,hijo)+", hijo de "+this.getNodeId(node_ids,tupla_actual[0])+". Se anota que "+this.getNodeId(node_ids,tupla_actual[0])+" ha expandido un hijo mas y elegimos como tupla actual "+this.getTupleAsStringRetroactiveSearch(node_ids,lista_pasos[index_last_paso])+".\n\n"+explicacion;////////////////
			}else{
				lista_pasos.splice(index_last_paso, 1);
				index_last_paso-=1;
				explicacion="El nodo "+this.getNodeId(node_ids,tupla_actual[0])+" no tiene mas hijos. Realizamos backtracking.\n\n"+explicacion;////////////////
			}

			if(lista_pasos.length>0){
				tupla_actual=lista_pasos[index_last_paso];
			}else{
				explicacion="La lista de nodos esta vacia y no se puede continuar.\n\nNo fue posible encontrar un camino entre "+initial_node_id+" y algun nodo final: "+end_nodes_id+".\n"+explicacion;////////////////
				hay_camino=false;
			}

			contador_pasos+=1;
			explicacion="Paso "+contador_pasos+":\n"+explicacion;
			this.string_descriptions_steps.push(explicacion);//Incluir explicaciones en la resolucion
			this.network_steps.push(this.getNetworkStepRetroactiveSearch(node_data,edge_data,node_ids,lista_pasos,adjMatrix));
			this.open_closed_steps.push("Lista de nodos:\n"+this.getListAsStringRetroactiveSearch(node_ids,lista_pasos));
			
			bound_cont+=1;
			if(bound_cont==iter_bound){
				break;
			}
			
		}

		if(hay_camino){
			var camino=[];
			var coste=0;
			for(var i=0;i<lista_pasos.length-1;i++){
				camino.push( this.getNodeId(node_ids,lista_pasos[i][0]) );
				coste+=adjMatrix[  lista_pasos[i][0]  ][ lista_pasos[i+1][0] ]	
			}
			camino.push( this.getNodeId(node_ids,lista_pasos[index_last_paso][0]) );

			this.string_descriptions_steps[this.string_descriptions_steps.length-1]="El camino encontrado es: "+camino+", con coste: "+coste+".\n\n"+this.string_descriptions_steps[this.string_descriptions_steps.length-1];	
		}

		return {descriptions: this.string_descriptions_steps, steps: this.network_steps, lists: this.open_closed_steps};
	}







































































	////////////////////////////////////////////////////////////////FUNCIONES ESPECIALES PARA BUSQUEDA RETROACTIVA////////////////////////////////////////////////////////////////


	getNetworkStepClimbing(node_data,edge_data,node_ids,step_list,adjMatrix){
		var nodes_step=[];
		var edges_step=[];

		if(this.network_steps.length==0){//Paso inicial
			
			for(var i=0;i<node_data.length;i++){
	    		if(node_data[i].id==this.getNodeId(node_ids,step_list[0][1])){
	    			nodes_step.push(node_data[i]);
	    			break;
	    		}
		    }
		    
		    return {nodes:nodes_step,edges:edges_step};
		}else{//Paso no inicial
			
			var index_last_step=this.network_steps.length-1;

			//METO LOS NODOS DEL ULTIMO PASO
			for(var i=0;i<this.network_steps[index_last_step].nodes.length;i++){
				nodes_step.push(this.network_steps[index_last_step].nodes[i]);	
			}

			//METO LOS ARCOS DEL ULTIMO PASO
			for(var i=0;i<this.network_steps[index_last_step].edges.length;i++){
				edges_step.push(this.network_steps[index_last_step].edges[i]);	
			}

			var index_last_paso=step_list.length-1;
			
			if(index_last_paso>=1){//Si Hay al menos dos nodos en la lista de pasos
				//METO LOS NODOS HIJOS DE LA TUPLA ACTUAL SI NO ESTAN YA		
				for(var i=0;i<node_data.length;i++){
					if(node_ids.indexOf(node_data[i].id)==step_list[index_last_paso][1] && !nodes_step.includes(node_data[i])){
						nodes_step.push(node_data[i]);
						break;
					}
				}

				//METO LOS ARCOS DE LA TUPLA ACTUAL SI NO ESTAN YA
				for(var i=0;i<edge_data.length;i++){
					if(
						//O es unidireccional con direccion obligatoria
						((node_ids.indexOf(edge_data[i].from)==step_list[index_last_paso-1][1] && node_ids.indexOf(edge_data[i].to)==step_list[index_last_paso][1] && edge_data[i].arrows=="to") ||
						//O es bidireccional y puede ir para los dos lados
						((node_ids.indexOf(edge_data[i].from)==step_list[index_last_paso-1][1] && node_ids.indexOf(edge_data[i].to)==step_list[index_last_paso][1]) ||
						(node_ids.indexOf(edge_data[i].to)==step_list[index_last_paso-1][1] && node_ids.indexOf(edge_data[i].from)==step_list[index_last_paso][1])))
						
						&& !edges_step.includes(edge_data[i])
					){
						edges_step.push(edge_data[i]);
					}
				}
			}
			return {nodes:nodes_step,edges:edges_step};
		}
	}


	isEndNodeFoundClimbing(end_nodes,step_list){
		for(var i=0;i<step_list.length;i++){
			if(end_nodes.includes(step_list[i][1])){
				return i;
			}
		}
		return -1;
	}

	isNodeVisitedClimbing(node,step_list){
		for(var i=0;i<step_list.length;i++){
			if(step_list[i][1]==node){
				return i;
			}
		}
		return -1;
	}


	//////////////////////////////////////////////////////////////FIN FUNCIONES ESPECIALES PARA BUSQUEDA RETROACTIVA//////////////////////////////////////////////////////////////




	simpleClimbing(network_nodes,network_edges,initial_node_id,end_nodes_id,iter_bound){
		var contador_pasos=0;

		this.string_descriptions_steps=[];
		this.network_steps=[];
		this.open_closed_steps=[];

		//OBTENCION DE ID DE NODOS Y VALOR HEURISTICO
		var node_data = network_nodes.get({
	      fields: ['id','label','title','color'], //De cada nodo obtengo el id, el string que muestra, el valor heuristico y el color
	    });

		var edge_data = network_edges.get({
	      fields: ['from','to','id','label','arrows'],    
	    });

		var nnodes=node_data.length;
	    
	    var node_ids=new Array(nnodes);
	    var node_heuristics=new Array(nnodes);
	    for(var i=0;i<nnodes;i++){
	    	node_ids[i]=node_data[i].id; //Obtengo la id
	    	node_heuristics[i]=Number(node_data[i].title); //Obtengo el valor heuristico
	    }
	    //FIN OBTENCION DE ID DE NODOS Y VALOR HEURISTICO

	    //OBTENCION DE LOS ID DE LAS ARISTAS
	    var nedges=edge_data.length;
	    
	    var edge_ids=new Array(nedges);
	    for(var i=0;i<nedges;i++){
	    	edge_ids[i]=edge_data[i].id; //Obtengo la id
	    }
	    //FIN OBTENCION DE LOS ID DE LAS ARISTAS

	    //ORDENACION POR ORDEN LEXICOGRAFICO: AQUI TAMBIEN HACE FALTA PARA DECIDIRNOS POR EL PRIMERO EN CASO DE EMPATE
		var ordered_nodes=this.sortDepend(node_ids,node_heuristics);
	    node_ids=ordered_nodes[0];
	    node_heuristics=ordered_nodes[1];
	    var adjMatrix=this.getAdjMatrix(network_edges,node_ids,edge_ids);
	    //FIN ORDENACION POR ORDEN LEXICOGRAFICO

	    //PREPARAR EL PROBLEMA PARA COMENZAR A TRABAJAR CON INDICES NUMERICOS
	  	var nodo_inicial=node_ids.indexOf(initial_node_id);
		var nodos_finales=new Array(end_nodes_id.length);

		for(var i=0;i<end_nodes_id.length;i++){
			nodos_finales[i]=node_ids.indexOf(end_nodes_id[i]);
		}
		//FIN PREPARAR EL PROBLEMA PARA COMENZAR A TRABAJAR CON INDICES NUMERICOS

		var lista_pasos=[];
		
		var tupla_actual=[null, nodo_inicial,node_heuristics[nodo_inicial] ]; //(nodo actual,numero de hijos abiertos)
		lista_pasos.push(tupla_actual);
		var explicacion="Se expande el nodo inicial "+this.getNodeId(node_ids,tupla_actual[1])+".\n\n";////////////////
		

		contador_pasos+=1;
		explicacion="Paso "+contador_pasos+":\n"+explicacion;
		this.string_descriptions_steps.push(explicacion);//Incluir explicaciones en la resolucion
		this.network_steps.push(this.getNetworkStepClimbing(node_data,edge_data,node_ids,lista_pasos,adjMatrix));
		this.open_closed_steps.push("Lista de nodos:\n"+this.getListAsString(node_ids,lista_pasos));

		var bound_cont=0;
		var index_last_paso=0;
		var hay_camino=true;

		var primer_mejor_hijo=null;
		var nhijos=0;
		while(this.isEndNodeFoundClimbing(nodos_finales,lista_pasos)==-1){
			primer_mejor_hijo=null;
			//Obtengo el hijo que voy a expandir a continuacion
			var hijos=this.getAllSonNodes(adjMatrix,tupla_actual[1]);

			hijos.sort(function(x, y){return x[1] > y[1];});

			nhijos=hijos.length;

			if(nhijos>0){ //Si hay al menos un hijo

				for(var i=0;i<nhijos;i++){ //Recorro todos los hijos hasta encontrar el primero que mejora la heuristica del padre
					//CAMBIAR MENOR/MENOR_O_IGUAL AQUI PARA SABER SI EXPLORAR
					if( (node_heuristics[ hijos[i] ] <= tupla_actual[2]) && this.isNodeVisitedClimbing(hijos[i],lista_pasos)==-1 ){ //Si la heuristica del hijo mejora a la del padre, y ademas no esta visitado el nodo (para evitar ciclos)
						primer_mejor_hijo=hijos[i];
						lista_pasos.push([ tupla_actual[1],primer_mejor_hijo,node_heuristics[ primer_mejor_hijo ] ]);
						index_last_paso+=1;
						break;//Rompe el for
					}
				}

				if(primer_mejor_hijo==null){ //Ningun hijo ha mejorado la heuristica del padre
					hay_camino=false;
					explicacion="Ningun hijo del nodo "+this.getNodeId(node_ids,tupla_actual[1])+" mejora su heuristica. El algoritmo queda atrapado en un maximo local.\nNo fue posible encontrar un camino entre "+initial_node_id+" y algun nodo final: "+end_nodes_id+".\n\n"+explicacion;////////////////
				}else{ //Algun hijo ha mejorado la heuristica del padre
					tupla_actual=lista_pasos[index_last_paso];
					explicacion="El primer hijo de "+this.getNodeId(node_ids,tupla_actual[0])+" que mejora su heuristica es "+this.getNodeId(node_ids,tupla_actual[1])+". Se coge como tupla actual "+this.getTupleAsString(node_ids,tupla_actual)+".\n\n"+explicacion;////////////////
				}
			}else{
				hay_camino=false;
				explicacion="El nodo "+this.getNodeId(node_ids,tupla_actual[1])+" no tiene hijos y el algoritmo queda atrapado. No se puede continuar.\nNo fue posible encontrar un camino entre "+initial_node_id+" y algun nodo final: "+end_nodes_id+".\n\n"+explicacion;////////////////
			}

			contador_pasos+=1;
			explicacion="Paso "+contador_pasos+":\n"+explicacion;
			this.string_descriptions_steps.push(explicacion);//Incluir explicaciones en la resolucion
			this.network_steps.push(this.getNetworkStepClimbing(node_data,edge_data,node_ids,lista_pasos,adjMatrix));
			this.open_closed_steps.push("Lista de nodos:\n"+this.getListAsString(node_ids,lista_pasos));
			
			if(!hay_camino){
				break;
			}

			
			bound_cont+=1;
			if(bound_cont==iter_bound){
				break;
			}

		}
		

		if(hay_camino){
			var camino=[];
			var coste=0;
			for(var i=0;i<lista_pasos.length-1;i++){
				camino.push( this.getNodeId(node_ids,lista_pasos[i][1]) );
				coste+=adjMatrix[  lista_pasos[i][1]  ][ lista_pasos[i+1][1] ]	
			}
			camino.push( this.getNodeId(node_ids,lista_pasos[index_last_paso][1]) );

			this.string_descriptions_steps[this.string_descriptions_steps.length-1]="El camino encontrado es: "+camino+", con coste: "+coste+".\n\n"+this.string_descriptions_steps[this.string_descriptions_steps.length-1];	
		}
		return {descriptions: this.string_descriptions_steps, steps: this.network_steps, lists: this.open_closed_steps};

	}




















































	maxClimbing(network_nodes,network_edges,initial_node_id,end_nodes_id,iter_bound){
		var contador_pasos=0;

		this.string_descriptions_steps=[];
		this.network_steps=[];
		this.open_closed_steps=[];

		//OBTENCION DE ID DE NODOS Y VALOR HEURISTICO
		var node_data = network_nodes.get({
	      fields: ['id','label','title','color'], //De cada nodo obtengo el id, el string que muestra, el valor heuristico y el color
	    });

		var edge_data = network_edges.get({
	      fields: ['from','to','id','label','arrows'],    
	    });

		var nnodes=node_data.length;
	    
	    var node_ids=new Array(nnodes);
	    var node_heuristics=new Array(nnodes);
	    for(var i=0;i<nnodes;i++){
	    	node_ids[i]=node_data[i].id; //Obtengo la id
	    	node_heuristics[i]=Number(node_data[i].title); //Obtengo el valor heuristico
	    }
	    //FIN OBTENCION DE ID DE NODOS Y VALOR HEURISTICO

	    //OBTENCION DE LOS ID DE LAS ARISTAS
	    var nedges=edge_data.length;
	    
	    var edge_ids=new Array(nedges);
	    for(var i=0;i<nedges;i++){
	    	edge_ids[i]=edge_data[i].id; //Obtengo la id
	    }
	    //FIN OBTENCION DE LOS ID DE LAS ARISTAS

	    //ORDENACION POR ORDEN LEXICOGRAFICO: AQUI TAMBIEN HACE FALTA PARA DECIDIRNOS POR EL PRIMERO EN CASO DE EMPATE
		var ordered_nodes=this.sortDepend(node_ids,node_heuristics);
	    node_ids=ordered_nodes[0];
	    node_heuristics=ordered_nodes[1];
	    var adjMatrix=this.getAdjMatrix(network_edges,node_ids,edge_ids);
	    //FIN ORDENACION POR ORDEN LEXICOGRAFICO

	    //PREPARAR EL PROBLEMA PARA COMENZAR A TRABAJAR CON INDICES NUMERICOS
	  	var nodo_inicial=node_ids.indexOf(initial_node_id);
		var nodos_finales=new Array(end_nodes_id.length);

		for(var i=0;i<end_nodes_id.length;i++){
			nodos_finales[i]=node_ids.indexOf(end_nodes_id[i]);
		}
		//FIN PREPARAR EL PROBLEMA PARA COMENZAR A TRABAJAR CON INDICES NUMERICOS

		var lista_pasos=[];
		
		var tupla_actual=[null, nodo_inicial,node_heuristics[nodo_inicial] ]; //(nodo actual,numero de hijos abiertos)
		lista_pasos.push(tupla_actual);
		var explicacion="Se expande el nodo inicial "+this.getNodeId(node_ids,tupla_actual[1])+".";////////////////
		

		contador_pasos+=1;
		explicacion="Paso "+contador_pasos+":\n"+explicacion;
		this.string_descriptions_steps.push(explicacion);//Incluir explicaciones en la resolucion
		this.network_steps.push(this.getNetworkStepClimbing(node_data,edge_data,node_ids,lista_pasos,adjMatrix));
		this.open_closed_steps.push("Lista de nodos:\n"+this.getListAsString(node_ids,lista_pasos));

		var bound_cont=0;
		var index_last_paso=0;
		var hay_camino=true;

		var mejor_hijo=null;
		var nhijos=0;
		while(this.isEndNodeFoundClimbing(nodos_finales,lista_pasos)==-1){
			mejor_hijo=null;
			//Obtengo el hijo que voy a expandir a continuacion
			var hijos=this.getAllSonNodes(adjMatrix,tupla_actual[1]);
			hijos.sort(function(x, y){return x[1] > y[1];});
			var nhijos=hijos.length;

			if(nhijos>0){ //Si hay al menos un hijo

				for(var i=0;i<nhijos;i++){ //Recorro todos los hijos hasta encontrar el primero que mejora la heuristica del padre
					//CAMBIAR MENOR/MENOR_O_IGUAL AQUI PARA SABER SI EXPLORAR
					if( (node_heuristics[ hijos[i] ] <= tupla_actual[2]) && this.isNodeVisitedClimbing(hijos[i],lista_pasos)==-1 ){ //Si la heuristica del hijo mejora a la del padre, y ademas no esta visitado el nodo (para evitar ciclos)
						if(mejor_hijo==null){//El mejor hijo aun no habia sido asignado
							mejor_hijo=hijos[i];		
						//CAMBIAR MENOR/MENOR_O_IGUAL AQUI PARA SABER SI EXPLORAR
						}else if(node_heuristics[ hijos[i] ] < node_heuristics[ mejor_hijo ]  ){ //Esta condicion se pone para que no falle la referencia a un indice nulo (array[null] ==> ERROR!)
							mejor_hijo=hijos[i];
						}
					}
				}

				if(mejor_hijo==null){ //Ningun hijo ha mejorado la heuristica del padre
					hay_camino=false;
					explicacion="Ningun hijo del nodo "+this.getNodeId(node_ids,tupla_actual[1])+" mejora su heuristica. El algoritmo queda atrapado en un maximo local.\nNo fue posible encontrar un camino entre "+initial_node_id+" y algun nodo final: "+end_nodes_id+".\n\n"+explicacion;////////////////
				}else{ //Algun hijo ha mejorado la heuristica del padre
					lista_pasos.push([ tupla_actual[1],mejor_hijo,node_heuristics[ mejor_hijo ] ]);
					index_last_paso+=1;
					tupla_actual=lista_pasos[index_last_paso];
					explicacion="El hijo de "+this.getNodeId(node_ids,tupla_actual[0])+" que tiene mejor heuristica mejorando a su padre es "+this.getNodeId(node_ids,tupla_actual[1])+". Se coge como tupla actual "+this.getTupleAsString(node_ids,tupla_actual)+".\n\n"+explicacion;////////////////
				}
			}else{
				hay_camino=false;
				explicacion="El nodo "+this.getNodeId(node_ids,tupla_actual[1])+" no tiene hijos y el algoritmo queda atrapado. No se puede continuar.\nNo fue posible encontrar un camino entre "+initial_node_id+" y algun nodo final: "+end_nodes_id+".\n\n"+explicacion;////////////////
			}

			contador_pasos+=1;
			explicacion="Paso "+contador_pasos+":\n"+explicacion;
			this.string_descriptions_steps.push(explicacion);//Incluir explicaciones en la resolucion
			this.network_steps.push(this.getNetworkStepClimbing(node_data,edge_data,node_ids,lista_pasos,adjMatrix));
			this.open_closed_steps.push("Lista de nodos:\n"+this.getListAsString(node_ids,lista_pasos));
			
			if(!hay_camino){
				break;
			}

			
			bound_cont+=1;
			if(bound_cont==iter_bound){
				break;
			}

		}
		

		if(hay_camino){
			var camino=[];
			var coste=0;
			for(var i=0;i<lista_pasos.length-1;i++){
				camino.push( this.getNodeId(node_ids,lista_pasos[i][1]) );
				coste+=adjMatrix[  lista_pasos[i][1]  ][ lista_pasos[i+1][1] ]	
			}
			camino.push( this.getNodeId(node_ids,lista_pasos[index_last_paso][1]) );

			this.string_descriptions_steps[this.string_descriptions_steps.length-1]="El camino encontrado es: "+camino+", con coste: "+coste+".\n"+this.string_descriptions_steps[this.string_descriptions_steps.length-1];	
		}
		return {descriptions: this.string_descriptions_steps, steps: this.network_steps, lists: this.open_closed_steps};
	}











































































































	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	///////////////////////////////////////////   CODIGO PARA GENERAR HEURISTICAS NO ADMISIBLES   /////////////////////////////////
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	getRandomInt(min, max) {
	    return Math.floor(Math.random() * (max - min + 1)) + min;
	}








	getNewHeuristic(network_nodes,network_edges,initial_node_id,end_nodes_id,min_cambios,max_cambios,max_intentos,quiere_admisible_heur){
		//OBTENCION DE ID DE NODOS Y VALOR HEURISTICO
		var node_data = network_nodes.get({
	      fields: ['id','label','title','color'], //De cada nodo obtengo el id, el string que muestra, el valor heuristico y el color
	    });

		var edge_data = network_edges.get({
	      fields: ['from','to','id','label','arrows'],    
	    });

		var nnodes=node_data.length;
	    
	    var original_node_ids=new Array(nnodes);
	    var original_node_heuristics=new Array(nnodes);
	    for(var i=0;i<nnodes;i++){
	    	original_node_ids[i]=node_data[i].id; //Obtengo la id
	    	original_node_heuristics[i]=Number(node_data[i].title); //Obtengo el valor heuristico
	    }
	    //FIN OBTENCION DE ID DE NODOS Y VALOR HEURISTICO

	    //OBTENCION DE LOS ID DE LAS ARISTAS
	    var nedges=edge_data.length;
	    
	    var edge_ids=new Array(nedges);
	    for(var i=0;i<nedges;i++){
	    	edge_ids[i]=edge_data[i].id; //Obtengo la id
	    }
	    //FIN OBTENCION DE LOS ID DE LAS ARISTAS
	    
	    //ORDENACION POR ORDEN LEXICOGRAFICO: AQUI TAMBIEN HACE FALTA PARA DECIDIRNOS POR EL PRIMERO EN CASO DE EMPATE
		var ordered_nodes=this.sortDepend(original_node_ids,original_node_heuristics);
	    var node_ids=ordered_nodes[0];
	    var node_heuristics=ordered_nodes[1];
	    var adjMatrix=this.getAdjMatrix(network_edges,node_ids,edge_ids);

	    for (var i=0;i<adjMatrix.length;i++){
	    	for (var j=0;j<adjMatrix.length;j++){
	    		if(adjMatrix[i][j]==null){
	    			adjMatrix[i][j]=Number.POSITIVE_INFINITY;
	    		}
	    	}
	    }

	    //FIN ORDENACION POR ORDEN LEXICOGRAFICO

	    //PREPARAR EL PROBLEMA PARA COMENZAR A TRABAJAR CON INDICES NUMERICOS
	  	var nodo_inicial=node_ids.indexOf(initial_node_id);
		var nodos_finales=new Array(end_nodes_id.length);

		for(var i=0;i<end_nodes_id.length;i++){
			nodos_finales[i]=node_ids.indexOf(end_nodes_id[i]);
		}
		//FIN PREPARAR EL PROBLEMA PARA COMENZAR A TRABAJAR CON INDICES NUMERICOS

		if(quiere_admisible_heur){ //QUIERE UNA HEURISTICA ADMISIBLE

			var heuristica_ideal=[];
			var max_heur=0;
			var min_heur=Number.POSITIVE_INFINITY;
			var act_heur;
			for(var i=0;i<nnodes;i++){
				act_heur=this.dijkstraComplete(adjMatrix,i,nodos_finales);
				heuristica_ideal.push(act_heur);
				if(act_heur>max_heur && act_heur<Number.POSITIVE_INFINITY){
					max_heur=act_heur;
				}else if(act_heur<min_heur && act_heur>0){
					min_heur=act_heur;
				}
			}

			for(var i=0;i<nodos_finales.length;i++){
				heuristica_ideal[nodos_finales[i]]=0;
			}

			//Genero aleatoriamente una heuristica tal que a cada nodo le asigna una heuristica menor o igual que su heuristica ideal
			var new_heur=new Array(nnodes);
			var random_coef=this.getRandomInt(0,min_heur-1);
			for (var i=0;i<nnodes;i++){
				if(heuristica_ideal[i]==Number.POSITIVE_INFINITY || heuristica_ideal[i]==0){ //Generamos una heuristica para los nodos finales, pero posteriormente se cambiara
					new_heur[i]=max_heur;
				}else if(heuristica_ideal[i]==1){
					new_heur[i]=1;
				}else{
					//new_heur[i]=this.getRandomInt(1,heuristica_ideal[i]-1); //Heuristica admisible pero no siempre consistente
					//new_heur[i]=heuristica_ideal[i]-this.getRandomInt(0,min_heur-1); //Heuristica admisible con poca probabilidad de no consistente
					new_heur[i]=heuristica_ideal[i]-random_coef; //Heuristica consistente, lo que implica admisibilidad
				}
			}

			for(var i=0;i<nodos_finales.length;i++){
				new_heur[nodos_finales[i]]=0;
			}

			var new_heur_orden=new Array(nnodes);
			for(var i=0;i<nnodes;i++){
				new_heur_orden[original_node_ids.indexOf(node_ids[i])]=new_heur[i];	
			}

			var num_cambios=this.astarCountChanges(network_edges,node_ids,new_heur,nodo_inicial,nodos_finales,1000);
			
			return {heur:new_heur_orden,changes:num_cambios};
			




		}else{ //No le importa que NO sea una heuristica admisible

			//PRUEBO LA HEURISTICA QUE TRAE, PONIENDO LOS NODOS FINALES CON HEURISTICA 0 (Puede que el usuario haya actualizado a maldad)
			for(var i=0;i<nodos_finales.length;i++){
				node_heuristics[nodos_finales[i]]=0;
			}
			var num_cambios=this.astarCountChanges(network_edges,node_ids,node_heuristics,nodo_inicial,nodos_finales,1000);

			if(num_cambios>=min_cambios && num_cambios<=max_cambios){ //Si la heuristica que tiene vale, la ordenamos y la devolvemos
				var new_heur_orden=new Array(nnodes);
				for(var i=0;i<nnodes;i++){
					new_heur_orden[original_node_ids.indexOf(node_ids[i])]=node_heuristics[i];	
				}
				return {heur:new_heur_orden,changes:num_cambios};
			}else{ //Si no, el caso malo, buscamos una nueva heuristica que valga
				var heuristica_ideal=[];
				var max_heur=0;
				var min_heur=Number.POSITIVE_INFINITY;
				var act_heur;
				//Hago dijkstra estableciendo como nodo inicial cada uno de los nodos del grafo
				//Así obtengo el camino minimo desde cada nodo al final
				for(var i=0;i<nnodes;i++){
					act_heur=this.dijkstraComplete(adjMatrix,i,nodos_finales);
					heuristica_ideal.push(act_heur);
					if(act_heur>max_heur && act_heur<Number.POSITIVE_INFINITY){
						max_heur=act_heur;
					}else if(act_heur<min_heur && act_heur>0){
						min_heur=act_heur;
					}
				}

				for(var i=0;i<nodos_finales.length;i++){
					heuristica_ideal[nodos_finales[i]]=0;
				}
				


				var new_heur=new Array(nnodes);
				for (var i=0;i<nnodes;i++){
					new_heur[i]=this.getRandomInt(min_heur,max_heur);
				}

				for(var i=0;i<nodos_finales.length;i++){
					new_heur[nodos_finales[i]]=0;
				}

					
				var num_cambios=this.astarCountChanges(network_edges,node_ids,new_heur,nodo_inicial,nodos_finales,1000);


				var cont_intentos=1;
				while( (num_cambios<min_cambios || num_cambios>max_cambios) && cont_intentos<max_intentos ){
					new_heur=new Array(nnodes);
					for (var i=0;i<nnodes;i++){
						new_heur[i]=this.getRandomInt(min_heur,max_heur);
					}

					for(var i=0;i<nodos_finales.length;i++){
						new_heur[nodos_finales[i]]=0;
					}

					num_cambios=this.astarCountChanges(network_edges,node_ids,new_heur,nodo_inicial,nodos_finales,1000);
					cont_intentos+=1;
				}

				

				
				//ORDENAR LA HEURISTICA IDEAL CON RESPECTO AL ORDEN EN EL QUE VINO
				if(num_cambios>=min_cambios && num_cambios<=max_cambios){
					
					var new_heur_orden=new Array(nnodes);
					for(var i=0;i<nnodes;i++){
						new_heur_orden[original_node_ids.indexOf(node_ids[i])]=new_heur[i];	
					}
					return {heur:new_heur_orden,changes:num_cambios};
				}
				return null;
			}
		}
	}




	dijkstraComplete(adj_mat,index_ini_node,v_end_nodes){
		var visitados=[index_ini_node];
		var distancias=adj_mat[index_ini_node];

		var minNode=null;
		var costeActual=0;
		var nuevo_coste=0;

		var nnodes=adj_mat.length;

		while(visitados.length<nnodes){

			minNode=null;

			for(var i=0;i<distancias.length;i++){
				if(!visitados.includes(i)){
					if(minNode==null){
						minNode=i;
					}else if(distancias[i] < distancias[minNode]){
						minNode=i;
					}
				}
			}

			visitados.push(minNode);
			var coste_actual=distancias[minNode];

			for(var i=0;i<distancias.length;i++){
				nuevo_coste=coste_actual + adj_mat[minNode][i];
				if(nuevo_coste < distancias[i] ){
					distancias[i]=nuevo_coste;
				}
			}


		}


		var best_distance=distancias[ v_end_nodes[0] ];
		for(var i=1;i<v_end_nodes.length;i++){
			if(distancias[ v_end_nodes[i] ] < best_distance){
				best_distance=distancias[ v_end_nodes[i] ];
			}	
		}
		return best_distance;
	}















	//Esta funcion A* cuenta las actualizaciones que se provocan. No mete explicaciones ni guarda estados.
	astarCountChanges(network_edges,node_ids,node_heuristics,nodo_inicial,nodos_finales,iter_bound){
		var ordered_nodes=this.sortDepend(node_ids,node_heuristics);
	    node_ids=ordered_nodes[0];
	    node_heuristics=ordered_nodes[1];

	    var edge_data = network_edges.get({
	      fields: ['from','to','id','label','arrows'],    
	    });


		//OBTENCION DE LOS ID DE LAS ARISTAS
	    var nedges=edge_data.length;
	    
	    var edge_ids=new Array(nedges);
	    for(var i=0;i<nedges;i++){
	    	edge_ids[i]=edge_data[i].id; //Obtengo la id
	    }
	    //FIN OBTENCION DE LOS ID DE LAS ARISTAS

	    var adjMatrix=this.getAdjMatrix(network_edges,node_ids,edge_ids);

		var nnodes=node_ids.length;

		var abiertos=[];
		var cerrados=[];
		var hijos;
		var coste=0;
		
		var g_component_actual=0;
		var tupla_actual=[ null,nodo_inicial,g_component_actual,node_heuristics[nodo_inicial] ]; //(padre,hijo,g,h)
		abiertos.push(tupla_actual);
		
		var bound_cont=0;
		//var contador_cambios_abiertos=0;
		var contador_cambios_cerrados=0;

		while(this.isEndNodeInClosed(nodos_finales,cerrados)==-1 && abiertos.length>0){
			if(this.isNodeInList(tupla_actual[1],cerrados)==-1){ //Si el nodo que vamos a abrir no está en cerrados, esto es, no ha sido ya visitado, procedemos a meterlo
				abiertos.splice(abiertos.indexOf(tupla_actual), 1);

				var index_in_closed=this.isNodeInList(tupla_actual[1],cerrados);
				if(index_in_closed==-1){//El nodo actual no esta en la lista de cerrados
					cerrados.push(tupla_actual);
					cerrados=this.update_costs(tupla_actual,cerrados,adjMatrix).slice(0);
				}else{//Si esta, tengo que ver si actualizo el camino porque es mejor o se queda el que estaba
					if(cerrados[index_in_closed][2]>tupla_actual[2]){
						cerrados[index_in_closed]=tupla_actual;
						cerrados=this.propagate_changes(tupla_actual,cerrados,adjMatrix).slice(0);
						contador_cambios_cerrados+=1;
					}else if(abiertos.length==0){
						break;
					}	
				}

				hijos=this.getAllSonNodes(adjMatrix,tupla_actual[1]);

				//Inserto los hijos
				var tupla_insert;
				var index_in_open;
				for(var i=0;i<hijos.length;i++){
					tupla_insert=	[ 	
										tupla_actual[1],
										hijos[i],
										g_component_actual+adjMatrix[ tupla_actual[1] ][ hijos[i] ],
										node_heuristics[ hijos[i]] 
									];
					
					index_in_open=this.isNodeInList(tupla_insert[1],abiertos);
					index_in_closed=this.isNodeInList(tupla_insert[1],cerrados);
					if(index_in_open==-1 && index_in_closed==-1){//El nodo actual no esta en la lista de abiertos
						abiertos.push(tupla_insert);//Inserto los hijos desde la primera posicion (en orden) en la lista de abiertos.
					}else if(index_in_open!=-1){//Actualizo el nodo en abiertos para que solo este el mejor camino a ese nodo
						if(abiertos[index_in_open][2]>tupla_insert[2]){
							abiertos[index_in_open]=tupla_insert;
						}
					}else if(index_in_closed!=-1){//Actualizo el nodo en abiertos para que solo este el mejor camino a ese nodo
						if(cerrados[index_in_closed][2]>tupla_insert[2]){
							cerrados[index_in_closed]=tupla_insert;
							cerrados=this.propagate_changes(tupla_actual,cerrados,adjMatrix).slice(0);
							contador_cambios_cerrados+=1;
						}
					}
				}

				abiertos.sort(function(x, y){return x[1] > y[1];}); //ORDENO POR ORDEN LEXICOGRAFICO PARA CRITERIO DE DESEMPATE

				if(this.isInList(tupla_actual[1],nodos_finales)==-1){//Si el nodo de la tupla actual (nodo hijo de la tupla actual) NO es un nodo final lo meto en abiertos, si no, termino.
					if(abiertos.length>0){
						tupla_actual=abiertos[0];
						for(var i=0;i<abiertos.length;i++){ //Vamos a elegir el nodo cuya f=g+h sea menor
							if(abiertos[i][2]+abiertos[i][3] < tupla_actual[2]+tupla_actual[3]){
								tupla_actual=abiertos[i];
							}
						}
						g_component_actual=tupla_actual[2];
					}
				}
			}else{//Si el nodo que ibamos a meter en abiertos estaba previamente en cerrados, debemos romper el bucle, pues hemos detectado un ciclo.
				break;
			}

			bound_cont+=1;
			if(bound_cont==iter_bound){
				break;
			}
		}

		tupla_actual=cerrados[cerrados.length-1];
		if(nodos_finales.includes(tupla_actual[1])){ // Si el ultimo nodo de finales es un nodo final, habremos encontrado un camino
			return contador_cambios_cerrados;
		}
		return -1;
	}



	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	///////////////////////////////////////   FIN CODIGO PARA GENERAR HEURISTICAS NO ADMISIBLES   /////////////////////////////////
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
}