/**
 * @class Clusterer
 *
 * @author Mauro Trevisan
 */
define(function(){

	var cluster = function(matrix, variants){
		if(matrix.length != matrix[0].length)
			throw 'Matrix is not square';

		var tree = [],
			minimum;
		//continue until the matrix collapses into one element
		while(matrix.length > 1){
			minimum = findMinimum(matrix);

			collapseVariants(variants, minimum, tree);

			collapseDistances(matrix, minimum);
		}
//console.log(tree);
console.log(variants[0]);
		return variants[0];
	};

	/**
	 * Search the matrix for the minimum
	 *
	 * @private
	 */
	var findMinimum = function(matrix){
		var rows = matrix.length,
			result = [-1, -1, Number.MAX_VALUE],
			i, j,
			value;
		for(i = 0; i < rows; i ++)
			for(j = i + 1; j < rows; j ++){
				value = matrix[i][j];
				if(value < result[2]){
					//reckon the two variants, v1 and v2
					result[0] = i;
					result[1] = j;
					result[2] = value;
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
		var v1 = indicesVariants[0],
			v2 = indicesVariants[1],
			dist = indicesVariants[2];
		if(v2 > v1)
			v2 --;
		v1 = variants.splice(v1, 1)[0];
		v2 = variants.splice(v2, 1)[0];
//tree.push({variant1: v1, variant2: v2, distance: dist});
		variants.push('(' + [v1, v2].sort().join('|') + ':' + dist.toFixed(4) + ')');
	};

	/**
	 * Collapse the two variants together in the distance matrix, calculating the new distances from the cluster
	 * to each other variant
	 *
	 * @private
	 */
	var collapseDistances = function(matrix, indicesVariants){
		var rows = matrix.length,
			v1 = indicesVariants[0],
			v2 = indicesVariants[1],
			i, j;
		for(i = 0; i < rows; i ++)
			if(i != v1 && i != v2)
				matrix[i][rows] = mergeValues(matrix, i, v1, v2);
		matrix[rows] = [];
		matrix[rows][rows] = 0;

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
