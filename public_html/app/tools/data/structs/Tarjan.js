/**
 * @class Tarjan
 *
 * @see {@link https://gist.github.com/chadhutchins/1440602}
 * @see {@link https://github.com/tmont/tarjan-graph/blob/master/index.js}
 * @see {@link https://github.com/pletcher/tarjan/blob/master/lib/index.js}
 *
 * @author Mauro Trevisan
 */
define(['tools/data/ObjectHelper'], function(ObjectHelper){

	/** @private */
	var Vertex = function(name, connections){
		this.name = name;
		this.connections = connections;

		resetVertex(this);
	};

	var graph, index, stack;


	var Constructor = function(){
		this.reset();
	};


	var reset = function(){
		graph = [];
		graph.forEach(function(vertex){
			resetVertex(vertex);
		});
	};

	/** @private */
	var resetVertex = function(vertex){
		vertex.index = -1;
		vertex.lowLink = -1;
	};

	/**
	 * @param {String} name		Name of the vertex
	 * @param {[connections]}	Array of name of connected vertices
	 */
	var addVertex = function(name, connections){
		connections = connections || [];
		var idx = getVertexIndex(name),
			v;
		if(idx >= 0){
			v = graph[idx];
			v.connections = connections;
		}
		else{
			v = new Vertex(name, connections);
			graph.push(v);
		}

		if(v.connections.length)
			v.connections = v.connections.map(function(connection){
				if(ObjectHelper.isString(connection)){
					var idx = getVertexIndex(connection);
					if(idx >= 0)
						return this[idx];
				}
				v = new Vertex(connection, []);
				graph.push(v);
				return v;
			}, graph);
	};

	/**
	 * @param {String} name		Name of the vertex
	 */
	var containsVertex = function(name){
		return (getVertexIndex(name) >= 0);
	};

	/**
	 * @param {String} name		Name of the vertex
	 *
	 * @private
	 */
	var getVertexIndex = function(name){
		var i;
		for(i = graph.length - 1; i >= 0; i --)
			if(graph[i].name == name)
				break;
		return i;
	};

	var getStronglyConnectedComponents = function(){
		index = 0;
		stack = [];

		var components = [];
		graph.forEach(function(vertex){
			if(vertex.index < 0)
				strongConnect.call(this, vertex, components);
		}, this);
		components = components.filter(function(component){ return (component.length > 1); });

		components.forEach(function(component, i){
			components[i] = component.map(function(vertex){ return vertex.name; }).reverse();
		});
		return components;
	};

	/** @private */
	var strongConnect = function(vertex, components){
		//set the depth index for v to the smallest unused index
		vertex.index = index;
		vertex.lowLink = index;
		index ++;
		stack.push(vertex);

		//consider successors of v, aka, consider each vertex in vertex.connections
		vertex.connections.forEach(function(v){
			if(!(v instanceof Vertex))
				throw 'Graph not finalized';

			if(v.index < 0){
				//successor v has not yet been visited; recurse on it
				strongConnect.call(this, v, components);
				vertex.lowLink = Math.min(vertex.lowLink, v.lowLink);
			}
			else if(contains(stack, v))
				//successor v is in stack S and hence in the current SCC
				vertex.lowLink = Math.min(vertex.lowLink, v.index);
		}, this);

		//if v is a root node, pop the stack and generate an SCC
		if(vertex.lowLink == vertex.index){
			//start a new strongly connected component
			var vertices = [],
				w = null;
			if(stack.length){
				do{
					w = stack.pop();
					//add w to current strongly connected component
					vertices.push(w);
				}while(!isEquals(vertex, w));
			}
			//output the current strongly connected component
			if(vertices.length)
				components.push(vertices);
		}
	};

	/** @private */
	var contains = function(stack, vertex){
		return stack.some(function(v){ return isEquals(v, vertex); });
	};

	/** @private */
	var isEquals = function(v, w){
		//equality check based on vertex name
		return (v.name == w.name);
	};


	Constructor.prototype = {
		constructor: Constructor,

		reset: reset,
		addVertex: addVertex,
		containsVertex: containsVertex,

		getStronglyConnectedComponents: getStronglyConnectedComponents
	};


	return Constructor;

});
