/**
 * @class OPTICSClusterer
 *
 * @see {@link https://github.com/IvanDyachenko/opticsjs/blob/master/lib/optics.js}
 *
 * @author Mauro Trevisan
 */
define(['tools/data/ObjectHelper', 'tools/data/structs/PriorityQueue'], function(ObjectHelper, PriorityQueue){

	var Point = function(vector){
		this.unprocessed = true;
		this.vector = vector;
		this.reachability = undefined;
		this.coreDistance = undefined;
		this.clusterId = undefined;
	};

	/** @constant */
	var CLUSTER_ID_NOISE = 'noise';


	/**
	 * @param {Array} data					Array of data points coordinates (expressed as array)
	 * @param {Number} [epsilon]			Maximum distance for a point to belongs to a cluster
	 * @param {Number} [minimumPoints]	Minimum number of points to form a cluster
	 * @param {Function} [distanceFn]	Distance function
	 */
	var cluster = function(data, epsilon, minimumPoints, distanceFn){
		if(epsilon <= 0)
			throw 'epsilon should be a positive number';
		if(minimumPoints < 1)
			throw 'minimumPoints should be a positive number greater than 1';
		if(distanceFn && !ObjectHelper.isFunction(distanceFn))
			throw 'distanceFn should be a function that accepts two object with the property \'vector\' defined';

		this.points = [];
		this.orderedList = [];
		this.epsilon = epsilon || 0.001;
		this.minimumPoints = minimumPoints || 1;
		this.distanceMethod = distanceFn || distanceFnDefault;
		this.orderSeeds = new PriorityQueue();

		data.forEach(function(point){
			this.push(new Point(point));
		}, this.points);
		this.points.forEach(function(point){
			if(point.unprocessed)
				expandClusterOrder.call(this, point);
		}, this);

		return extract.call(this);
	};

	/**
	 * Implements the euclidean distance
	 *
	 * @private
	 */
	var distanceFnDefault = function(a, b){
		return Math.sqrt(a.vector.reduce(function(sum, current, i){ return sum + Math.pow(current - b.vector[i], 2); }, 0));
	};

	/** @private */
	var expandClusterOrder = function(point){
		var neighbors = getNeighbors.call(this, point),
			current, neighb;
		//mark point as processed
		point.unprocessed = false;
		point.reachability = undefined;

		calculateCoreDistance.call(this, point, neighbors);
		this.orderedList.push(point);

		if(ObjectHelper.isDefined(point.coreDistance)){
			this.orderSeeds.reset();
			update.call(this, neighbors, point);

			while(!this.orderSeeds.isEmpty()){
				current = this.orderSeeds.extract().value;
				neighb = getNeighbors.call(this, current);

				//mark current as processed
				current.unprocessed = false;

				calculateCoreDistance.call(this, current, neighb);
				this.orderedList.push(current);

				if(ObjectHelper.isDefined(current.coreDistance))
					update.call(this, neighb, current);
			}
		}
	};

	/** @private */
	var getNeighbors = function(point){
		return this.points.filter(function(p){ return (p != point && this.distanceMethod(p, point) <= this.epsilon); }, this);
	};

	/** @private */
	var calculateCoreDistance = function(point, neighbors){
		var dstFn = this.distanceMethod;
		point.coreDistance = (neighbors && neighbors.length >= this.minimumPoints?
			neighbors.reduce(function(accumulator, current){ return Math.min(dstFn(point, current), accumulator); }, Number.MAX_VALUE):
			undefined);
	};

	/** @private */
	var update = function(neighbors, point){
		neighbors.forEach(function(neighbor){
			if(neighbor.unprocessed){
				var newReachDist = Math.max(point.coreDistance, this.distanceMethod(point, neighbor));

				//'neighbor' is not in 'seeds'
				if(!ObjectHelper.isDefined(neighbor.reachability)){
					neighbor.reachability = newReachDist;
					neighbor.node = this.orderSeeds.add(newReachDist, neighbor);
				}
				//'neighbor' is in 'seeds', check for improvement
				else if(newReachDist < neighbor.reachability){
					neighbor.reachability = newReachDist;
					this.orderSeeds.decreaseKey(newReachDist, neighbor);
				}
			}
		}, this);
	};

	/** @private */
	var extract = function(){
		applyDBSCANClustering.call(this);

		return this.orderedList.map(function(point){
			return {
				data: point.vector,
				clusterId: point.clusterId
			};
		});
	};

	/** @private */
	var applyDBSCANClustering = function(){
		var clusterId = CLUSTER_ID_NOISE,
			nextId = function(id){
				return (id === CLUSTER_ID_NOISE? 0: id + 1);
			};
		this.orderedList.forEach(function(point){
			if(point.reachability <= this.epsilon)
				point.clusterId = clusterId;
			else if(point.coreDistance <= this.epsilon){
				clusterId = nextId(clusterId);
				point.clusterId = clusterId;
			}
			else
				point.clusterId = CLUSTER_ID_NOISE;
		}, this);
	};


	return {
		CLUSTER_ID_NOISE: CLUSTER_ID_NOISE,

		cluster: cluster
	};

});
