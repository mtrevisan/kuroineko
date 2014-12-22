/**
 * @class NormalDistribution
 *
 * @author Mauro Trevisan
 */
define(function(){

	var standardizeVariable = function(x, mean, standardDeviation){
		return (x - mean) / standardDeviation;
	};

	/**
	 * Calculates the Cumulative Density Function of a Normal distribution
	 *
	 * @param {z} standardized variable
	 */
	var cdf = function(z, maxError){
		maxError = maxError || 1e-15;

		var sum = z,
			value = z,
			i = 1;
		while(value > maxError){
			value *= z * z / (2 * i + 1);
			sum += value;

			i ++;
		}
		return 0.5 + (sum / Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * z * z);
		//return 0.5 * (1 + erf((z - mean) / (standardDeviation * Math.sqrt(Math.PI))));
	};

	/**
	 * Calculates the Probability Density Function of a Normal distribution
	 *
	 * @param {z} standardized variable
	 */
	var pdf = function(z, standardDeviation){
		standardDeviation = standardDeviation || 1;

		return Math.exp(-0.5 * z * z) / (standardDeviation * Math.sqrt(2 * Math.PI));
	};

	//coefficients for rational approximations of the probit function
	var a = [2.506628277459239, -30.66479806614716, 138.3577518672690, -275.9285104469687, 220.9460984245205, -39.69683028665376],
		b = [-13.28068155288572, 66.80131188771972, -155.6989798598866, 161.5858368580409, -54.47609879822406],
		c = [2.938163982698783, 4.374664141464968, -2.549732539343734, -2.400758277161838, -0.3223964580411365, -0.007784894002430293],
		d = [3.754408661907416, 2.445134137142996, 0.3224671290700398, 0.007784695709041462],
		pLow = 0.02425,
		pHigh = 1 - pLow;

	/** @private */
	var evaluateRationalApproximation = function(numeratorCoeffs, denominatorCoeffs, x){
		var i = numeratorCoeffs.length,
			num = 0,
			den = 0;
		while((-- i) >= 0)
			num = num * x + numeratorCoeffs[i];
		i = denominatorCoeffs.length;
		while((-- i) >= 0)
			den = den * x + denominatorCoeffs[i];
		return num / (1 + den * x);
	};

	/**
	 * Calculates the quantile function, i.e., the inverse Cumulative Distribution Function, associated with the Normal distribution.
	 */
	var inverseCDF = function(p, maxError){
		maxError = maxError || 1e-15;

		if(p < 0 || p > 1)
			return Number.NaN;
		if(p == 0)
			return Number.NEGATIVE_INFINITY;
		if(p == 1)
			return Number.POSITIVE_INFINITY;

		var z = 0;
		if(p < 0.02425)
			z = evaluateRationalApproximation(c, d, Math.sqrt(-2 * Math.log(p)));
		else if(p > pHigh)
			z = -evaluateRationalApproximation(c, d, Math.sqrt(-2 * Math.log(1 - p)));
		else{
			var q = p - 0.5;
			z = q * evaluateRationalApproximation(a, b, q * q);
		}

		//refine first approximation with Halley of third order:
		//var e = 0.5 * erfc(-z / Math.SQRT2) - p;
		//var u = e * Math.sqrt(2 * Math.PI) * Math.exp(0.5 * z * z);
		//z -= u / (1 + 0.5 * z * u);

		return z;
		//probit function
		//return Math.sqrt(0.5) * erf^-1(2 * p - 1);
	};


	return {
		standardizeVariable: standardizeVariable,

		pdf: pdf,
		cdf: cdf,
		inverseCDF: inverseCDF
	};

});
