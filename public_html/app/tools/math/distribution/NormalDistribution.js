/**
 * @class NormalDistribution
 *
 * @author Mauro Trevisan
 */
define(function(){

	//coefficients for rational approximations of the probit function
	var A = [2.506628277459239, -30.66479806614716, 138.3577518672690, -275.9285104469687, 220.9460984245205, -39.69683028665376],
		B = [-13.28068155288572, 66.80131188771972, -155.6989798598866, 161.5858368580409, -54.47609879822406],
		C = [2.938163982698783, 4.374664141464968, -2.549732539343734, -2.400758277161838, -0.3223964580411365, -0.007784894002430293],
		D = [3.754408661907416, 2.445134137142996, 0.3224671290700398, 0.007784695709041462],
		P_LOW = 0.02425,
		P_HIGH = 1 - P_LOW;


	var standardizeVariable = function(x, mean, standardDeviation){
		return (x - mean) / standardDeviation;
	};

	/**
	 * Calculates the Probability Density Function of a Normal distribution
	 *
	 * @param {Number} z							Standardized variable
	 * @param {Number} standardDeviation	Standard deviation
	 */
	var pdf = function(z, standardDeviation){
		return Math.exp(-0.5 * z * z) / ((standardDeviation || 1) * Math.sqrt(2 * Math.PI));
	};

	/**
	 * Calculates the Cumulative Density Function of a Normal distribution
	 *
	 * @param {Number} z				Standardized variable
	 * @param {Number} maxError	Maximum allowed error
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

	/** Calculates the quantile function, i.e., the inverse Cumulative Distribution Function, associated with the Normal distribution. */
	var inverseCDF = function(p, maxError){
		maxError = maxError || 1e-15;

		if(p < 0 || p > 1)
			return Number.NaN;
		if(p == 0)
			return Number.NEGATIVE_INFINITY;
		if(p == 1)
			return Number.POSITIVE_INFINITY;

		var z = 0;
		if(p < P_LOW)
			z = evaluateRationalApproximation(C, D, Math.sqrt(-2 * Math.log(p)));
		else if(p > P_HIGH)
			z = -evaluateRationalApproximation(C, D, Math.sqrt(-2 * Math.log(1 - p)));
		else{
			var q = p - 0.5;
			z = q * evaluateRationalApproximation(A, B, q * q);
		}

		//refine first approximation with Halley of third order:
		//var e = 0.5 * erfc(-z / Math.SQRT2) - p;
		//var u = e * Math.sqrt(2 * Math.PI) * Math.exp(0.5 * z * z);
		//z -= u / (1 + 0.5 * z * u);

		return z;
		//probit function
		//return Math.sqrt(0.5) * ierfc(2 * p - 1);
	};

	/**
	 * Complementary error function
	 *
	 * @private
	 * /
	var erfc = function(x){
		//if(x == Number.POSITIVE_INFINITY)
		//	return 0;
		//if(x == Number.NEGATIVE_INFINITY)
		//	return 2;

		var z = Math.abs(x),
			t = 1 / (1 + z / 2),
			r = t * Math.exp(-z * z - 1.26551223 + t * (1.00002368
			+ t * (0.37409196 + t * (0.09678418 + t * (-0.18628806
			+ t * (0.27886807 + t * (-1.13520398 + t * (1.48851587
			+ t * (-0.82215223 + t * 0.17087277)))))))))
		return (x >= 0? r: 2 - r);
	};*/

	/**
	 * Inverse Complementary Error Function
	 *
	 * @private
	 * /
	var ierfc = function(x){
		if(x >= 2)
			return -100;
		if(x <= 0)
			return 100;

		var xx = (x < 1) ? x : 2 - x,
			t = Math.sqrt(-2 * Math.log(xx / 2)),
			r = -0.70711 * ((2.30753 + t * 0.27061) / (1 + t * (0.99229 + t * 0.04481)) - t),
			j, err;
		for(j = 0; j < 2; j ++){
			err = erfc(r) - xx;
			r += err / (1.12837916709551257 * Math.exp(-(r * r)) - r * err);
		}

		return (x < 1? r: -r);
	};*/

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


	return {
		standardizeVariable: standardizeVariable,

		pdf: pdf,
		cdf: cdf,
		inverseCDF: inverseCDF
	};

});
