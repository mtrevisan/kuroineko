/**
 * @class StudentTDistribution
 *
 * @author Mauro Trevisan
 */
define(function(){

	/**
	 * Calculates the Cumulative Density Function of a Student t-distribution
	 *
	 * @param n		degrees of freedom
	 */
	var cdf = function(z, n){
		return 0.5 * (1 + (z >= 0? 1: -1) * (1 - incompleteBetaFunction(n * 0.5, 0.5, n / (n + z * z))));
	};

	/**
	 * Calculates the Probability Density Function of a Student t-distribution
	 *
	 * @param n		degrees of freedom
	 */
	var pdf = function(z, n){
		var gammaFactor = Math.exp(lnGamma((n + 1) * 0.5) - lnGamma(n * 0.5));
		return gammaFactor / (Math.sqrt(n * Math.PI) * Math.pow(1 + (z * z) / n, (n + 1) * 0.5));
	};

	/** @private */
	var incompleteBetaFunction = (function(){
		/**
		 * Computes beta using continuous fractions
		 * <p>
		 * <code>
		 * Ix(a, b) = x^a * y^b * (1 / 1 + d1 / 1 + d2 / 1+ ...) / (a * B(a, b)), where y = 1 - x
		 * </code>
		 *
		 * @private
		 */
		var betacf = function(a, b, x){
			var qab = a + b,
				qap = a + 1,
				qam = a - 1,
				c, d, h, m, m2, aa, dh;

			c = 1;
			d = 1 / Math.max(1 - qab * x / qap, 1e-15);
			h = d;
			for(m = 1; m <= 100; m ++){
				m2 = 2 * m;

				//calculates d_2m
				aa = m * (b - m) * x / ((qam + m2) * (a + m2));
				c = Math.max(1 + aa / c, 1e-15);
				d = 1 / Math.max(1 + aa * d, 1e-15);
				h *= c * d;

				//calculates d_2m+1
				aa = -(a + m) * (qab + m) * x / ((a + m2) * (qap + m2));
				c = Math.max(1 + aa / c, 1e-15);
				d = 1 / Math.max(1 + aa * d, 1e-15);
				dh = c * d;
				h *= dh;

				if(Math.abs(dh - 1) < 3e-7)
					break;
			}
			return h;
		};

		return function(a, b, x){
			var bt = (x == 0 || x == 1? 0: Math.exp(lnGamma(a + b) - lnGamma(a) - lnGamma(b) + a * Math.log(x) + b * Math.log(1 - x)));
			return (x < (a + 1) / (a + b + 2)? bt * betacf(a, b, x) / a: 1 - bt * betacf(b, a, 1 - x) / b);
		};
	})();

	/** @private */
	var lnGamma = (function(){
		//Lanczos coefficients
		var p = [Math.sqrt(Math.PI * 2), 676.520368121885098567009190444019, -1259.13921672240287047156078755283, 771.3234287776530788486528258894, -176.61502916214059906584551354,
			12.507343278686904814458936853, -0.13857109526572011689554707, 9.984369578019570859563e-6, 1.50563273514931155834e-7];

		return function(x){
			var sum = 0.99999999999980993227684700473478,
				i, tmp;
			for(i = p.length - 1; i > 0; i --)
				sum += p[i] / (x + i);

			tmp = x + 7.5;
			return (x + 0.5) * Math.log(tmp) - tmp + Math.log(p[0] * sum / x);
		};
	})();

	/**
	 * Calculates the quantile function, i.e., the inverse Cumulative Distribution Function, associated with the student T distribution.
	 *
	 * @param n		degrees of freedom
	 */
	var inverseCDF = function(p, n, maxError){
		maxError = maxError || 1e-15;

		if(p < 0 || p > 1 || n < 1)
			return Number.NaN;
		if(p == 0)
			return Number.NEGATIVE_INFINITY;
		if(p == 0.5)
			return 0;
		if(p == 1)
			return Number.POSITIVE_INFINITY;

		if(n == 1)
			return Math.tan((p - 0.5) * Math.PI);
		if(n == 2)
			return (2 * p - 1) / Math.sqrt(2 * p * (1 - p));
//		if(n == 4){
//			var alpha = Math.sqrt(4 * p * (1 - p));
//			return 2 * (p - 0.5 >= 0? 1: -1) * Math.sqrt(Math.cos(Math.acos(alpha) / 3) / alpha - 1);
//		}

		var s, pp, z, u, v, p2;

		s = (p >= 0.5? 1: -1);
		pp = Math.min(p, 1 - p);
		if(-Math.log(pp) < 1.7 * n){
			if(pp < 0.2){
				u = -2 * Math.log(pp);
				pp = Math.sqrt(-2 * Math.log(pp * Math.sqrt((u - 1) * 2 * Math.PI))) + 1 / (u * u);
			}
			else{
				u = (0.5 - pp) * Math.sqrt(2 * Math.PI);
				pp = u * (1 + (u * u) / 6);
			}

			p2 = pp * pp;
			u = (p2 + 1) / (4 * n);
			v = p2 * (p2 / 12 + 0.25) / (n * n);
			z = pp * (1 + u + v);
		}
		else{
			u = 2 * pp * n * Math.sqrt(Math.PI / (2 * n - 1));
			z = Math.sqrt(n) / Math.pow(u, 1 / n);
		}

		//refine first approximation with Newton-Raphson:
		v = 10;
		do{
			u = (cdf(z, n) - p) / pdf(z, n);
			z -= u;
			u = Math.abs(u);
		}while(u > maxError && -- v);
		return s * (u > 0? z.toFixed(-Math.ceil(Math.log(u) * Math.LOG10E)): z);
	};


	return {
		pdf: pdf,
		cdf: cdf,
		inverseCDF: inverseCDF
	};

});
