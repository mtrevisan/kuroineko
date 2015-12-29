/**
 * @class Clusterer
 *
 * @author Mauro Trevisan
 */
define(['tools/data/structs/Tree'], function(Tree){

	var cluster = function(matrix, variants){
		if(matrix.length != matrix[0].length)
			throw 'Matrix is not square';

		var tree = new Tree(),
			minimum;
		//continue until the matrix collapses into one element
		variants = variants.splice(0);
		while(matrix.length > 1){
			minimum = findMinimum(matrix);

			collapseVariants(variants, minimum, tree);

			collapseDistances(matrix, minimum);
		}
		variants = variants[0];

console.log(tree);
console.log(variants);
		return variants;
	};

	/**
	 * Search the matrix for the minimum
	 *
	 * @private
	 */
	var findMinimum = function(matrix){
		var rows = matrix.length,
			result = {dist: Number.MAX_VALUE},
			i, j,
			value;
		for(i = 0; i < rows; i ++)
			for(j = i + 1; j < rows; j ++){
				value = matrix[i][j];
				if(value < result.dist){
					//reckon the two variants
					result.v1 = i;
					result.v2 = j;
					result.dist = value;
				}
			}
		return result;
	};

	/**
	 * Collapse the two variants together in the variants vector
	 *
	 * @private
	 */
	var collapseVariants = function(variants, indicesVariants, tree){
		var v1 = indicesVariants.v1,
			v2 = indicesVariants.v2,
			dist = indicesVariants.dist;
		if(v2 > v1)
			v2 --;
		v1 = variants.splice(v1, 1)[0];
		v2 = variants.splice(v2, 1)[0];
		variants.push('(' + [v1, v2].sort().join('|') + ':' + dist.toFixed(4) + ')');

		v1 = v1.replace(/:[.\d]+/g, '');
		v2 = v2.replace(/:[.\d]+/g, '');
		if(v1.indexOf('|') < 0)
			tree.addChild(v1);
		if(v2.indexOf('|') < 0)
			tree.addChild(v2);
		tree.insertParent('(' + [v1, v2].sort().join('|') + ')', {distance: dist}, v1, v2);
	};

	/**
	 * Collapse the two variants together in the distance matrix, calculating the new distances from the cluster
	 * to each other variant
	 *
	 * @private
	 */
	var collapseDistances = function(matrix, indicesVariants){
		var rows = matrix.length,
			v1 = indicesVariants.v1,
			v2 = indicesVariants.v2,
			i, j;
		for(i = 0; i < rows; i ++)
			if(i != v1 && i != v2)
				matrix[i][rows] = mergeValues(matrix, i, v1, v2);
		matrix[rows] = [];
		matrix[rows][rows] = 0;

		removeVariants(matrix, v1, v2);
	};

	/** @private */
	var removeVariants = function(matrix, v1, v2){
		if(v2 > v1)
			v2 --;
		//remove the rows of the two variants
		matrix.splice(v1, 1);
		matrix.splice(v2, 1);
		//remove the columns of the two variants
		matrix = matrix.map(function(row){
			row.splice(v1, 1);
			row.splice(v2, 1);
			return row;
		});
	};

	/** @private */
	var mergeValues = function(matrix, i, v1, v2){
		return (getValue(matrix, i, v1) + getValue(matrix, i, v2)) / 2;
	};

	/** @private */
	var getValue = function(matrix, i, j){
		return matrix[Math.min(i, j)][Math.max(i, j)];
	};


	return {
		cluster: cluster
	};

});
