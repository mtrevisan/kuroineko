require(['tools/data/OPTICSClusterer'], function(OPTICSClusterer){
	QUnit.module('OPTICSClusterer');

	var data = [
		[ 0,    0],
		[ 0,    0.5],
		[ 0,   -0.8],
		[ 1,    0],
		[-1,    0],
		[-1,    0.5],
		[-1.2,  0.5],
		[-1,   -0.4],
		[ 1,    0.4],
		[ 1,    0.2]
	];

	QUnit.test('clustering', function(){
		var result = OPTICSClusterer.cluster(data, 0.9, 2);

		equal(result.length, data.length);
		
		var clusterIds = [],
			i,
			clusterSum;
		for(i = 0; i < result.length; i ++)
			clusterIds[result[i].clusterId] = (clusterIds[result[i].clusterId] !== undefined? clusterIds[result[i].clusterId] + 1: 1);
		clusterSum = (clusterIds.noise || 0);
		for(i = 0; i < clusterIds.length; i ++)
			clusterSum += clusterIds[i];
		equal(clusterSum, data.length);
	});
});
