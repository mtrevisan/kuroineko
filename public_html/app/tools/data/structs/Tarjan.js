/**
 * Tarjan's Strongly Connected Components algorithm
 * Simple module for detecting cycles in directed graphs.
 *
 * @class Tarjan
 *
 * @see {@link https://gist.github.com/chadhutchins/1440602}
 * @see {@link https://github.com/tmont/tarjan-graph/blob/master/index.js}
 * @see {@link https://github.com/pletcher/tarjan/blob/master/lib/index.js}
 *
 * @author Mauro Trevisan
 */
define(function(){

	/** @private */
	var Vertex = function(name, connections){
		this.name = name;
		this.connections = connections;

		this.index = -1;
		this.lowLink = -1;
	};


	var Constructor = function(){
		this.reset();
	};


	var reset = function(){
		this.graph = [];
	};

	/**
	 * @param {String} name		Name of the vertex
	 * @param {[connections]}	Array of name of connected vertices
	 */
	var addVertex = function(name, connections){
		connections = connections || [];
		var idx = getVertexIndex(this.graph, name),
			v;
		if(idx >= 0){
			v = this.graph[idx];
			if(connections.length)
				v.connections = connections;
		}
		else{
			v = new Vertex(name, connections);
			this.graph.push(v);
		}

		if(v.connections.length)
			v.connections = v.connections.map(function(connection){
				if(Object.prototype.toString.call(connection) == '[object String]'){
					var idx = getVertexIndex(this, connection),
						ver;
					if(idx >= 0)
						ver = this[idx];
					else{
						ver = new Vertex(connection, []);
						this.push(ver);
					}
					return ver;
				}
				return connection;
			}, this.graph);
	};

	/**
	 * @param {String} name		Name of the vertex
	 * @return {Boolean} Whether the vertex with the given name is found
	 */
	var containsVertex = function(name){
		return (getVertexIndex(this.graph, name) >= 0);
	};

	/**
	 * @param {String} name		Name of the vertex
	 * @return {Number} The index of the vertex, or -1 if not found
	 *
	 * @private
	 */
	var getVertexIndex = function(graph, name){
		var i;
		for(i = graph.length - 1; i >= 0; i --)
			if(graph[i].name == name)
				break;
		return i;
	};

	var getStronglyConnectedComponents = function(){
		this.index = 0;
		this.stack = [];
		this.graph.forEach(function(vertex){
			vertex.index = -1;
			vertex.lowLink = -1;
		});

		var components = [];
		this.graph.forEach(function(vertex){
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
		vertex.index = this.index;
		vertex.lowLink = this.index;
		this.index ++;
		this.stack.push(vertex);

		//consider successors of v, aka, consider each vertex in vertex.connections
		vertex.connections.forEach(function(v){
			if(!(v instanceof Vertex))
				throw 'Graph not finalized';

			if(v.index < 0){
				//successor v has not yet been visited; recurse on it
				strongConnect.call(this, v, components);
				vertex.lowLink = Math.min(vertex.lowLink, v.lowLink);
			}
			else if(contains(this.stack, v))
				//successor v is in stack S and hence in the current SCC
				vertex.lowLink = Math.min(vertex.lowLink, v.index);
		}, this);

		//if v is a root node, pop the stack and generate an SCC
		if(vertex.lowLink == vertex.index){
			//start a new strongly connected component
			var vertices = [],
				w = null;
			if(this.stack.length){
				do{
					w = this.stack.pop();
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
