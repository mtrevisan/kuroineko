/**
 * Find the eigenvalues and eigenvectors of a real and symmetric matrix.
 * If A is symmetric, then A = V*L*V' where the eigenvalue matrix L is diagonal and the eigenvector matrix V is orthogonal (i.e. V*V' = I).
 * This Javascript code is based on the source code of JAMA, A Java Matrix package (http://math.nist.gov/javanumerics/jama/),
 * which states "Copyright Notice This software is a cooperative product of The MathWorks and the National Institute of Standards and
 * Technology (NIST) which has been released to the public domain.
 * Neither The MathWorks nor NIST assumes any responsibility whatsoever for its use by other parties, and makes no guarantees, expressed
 * or implied, about its quality, reliability, or any other characteristic."
 * Author: Peter Coxhead (http://www.cs.bham.ac.uk/~pxc/)
 * Copyright: The conversion of the JAMA source to Javascript is copyright Peter Coxhead, 2008, and is released under GPLv3
 *		(http://www.gnu.org/licenses/gpl-3.0.html).
 *	Last Revision: 9 Dec 2008
 *
 * @class EVDecomposition
 *
 * @see {@link www.cs.bham.ac.uk/~pxc/js/}
 *
 * @author Mauro Trevisan
 */
define(['tools/math/MathHelper'], function(MathHelper){

	/**
	 * Given a symmetric matrix, returns an object which contains the eigenvectors and eigenvalues of the matrix
	 *
	 * @param {Array} matrix	Array of rows of the matrix
	 * @returns {Object}		Object with <code>eigenvectors</code>, the columnwise eigenvectors as a Matrix object, and
	 *								<code>eigenvalues_real</code> and <code>eigenvalues_imaginary</code>, the eigenvalues as an array
	 */
	var decompose = function(matrix){
			//row and column dimension (square matrix)
		var n = matrix.length,
			eigenvectors = [],
			eigenvalues_re = [],
			eigenvalues_im = [],
			i, j;
		for(i = 0; i < n; i ++)
			eigenvectors[i] = [];
		for(i = 0; i < n; i ++)
			for(j = i; j < n; j ++){
				eigenvectors[i][j] = matrix[i][j];
				eigenvectors[j][i] = matrix[i][j];
			}

		//process a symmetric matrix
		tridiagonalize(n, eigenvalues_re, eigenvalues_im, eigenvectors);
		diagonalize(n, eigenvalues_re, eigenvalues_im, eigenvectors);

		//reduce small values to 0
		var eps = Math.pow(2, -40);
		eigenvalues_re = eigenvalues_re.map(function(el){ return (Math.abs(el) < eps? 0: el); });
		eigenvalues_im = eigenvalues_im.map(function(el){ return (Math.abs(el) < eps? 0: el); });

		//create an object to return the results
		return {
			eigenvectors: eigenvectors,
			eigenvalues_real: eigenvalues_re,
			eigenvalues_imaginary: eigenvalues_im
		};
	};

	/**
	 * Perform the symmetric Householder reduction to tridiagonal form.
	 * This is derived from the Algol procedures tred2 by Bowdler, Martin, Reinsch, and Wilkinson, Handbook
	 * for Auto. Comp., Vol.ii-Linear Algebra, and the corresponding Fortran subroutine in EISPACK
	 *
	 * @private
	 */
	var tridiagonalize = function(n, eigenvalues_re, eigenvalues_im, eigenvectors){
		var i, j, k;
		for(j = 0; j < n; j ++)
			eigenvalues_re[j] = eigenvectors[n - 1][j];

		//Householder reduction to tridiagonal form
		var scale, h, hh,
			f, g;
		for(i = n - 1; i > 0; i --){
			//scale to avoid under/overflow
			scale = 0;
			h = 0;
			for(k = 0; k < i; k ++)
				scale += Math.abs(eigenvalues_re[k]);
			if(!scale){
				eigenvalues_im[i] = eigenvalues_re[i - 1];
				for(j = 0; j < i; j ++){
					eigenvalues_re[j] = eigenvectors[i - 1][j];
					eigenvectors[i][j] = 0;
					eigenvectors[j][i] = 0;
				}
			}
			else{
				//generate Householder vector
				for(k = 0; k < i; k ++){
					eigenvalues_re[k] /= scale;
					h += eigenvalues_re[k] * eigenvalues_re[k];
				}
				f = eigenvalues_re[i - 1];
				g = Math.sqrt(h);
				if(f > 0)
					g = -g;
				eigenvalues_im[i] = scale * g;
				h = h - f * g;
				eigenvalues_re[i - 1] = f - g;
				for(j = 0; j < i; j ++)
					eigenvalues_im[j] = 0;
				//apply similarity transformation to remaining columns
				for(j = 0; j < i; j ++){
					f = eigenvalues_re[j];
					eigenvectors[j][i] = f;
					g = eigenvalues_im[j] + eigenvectors[j][j] * f;
					for(k = j + 1; k <= i - 1; k ++){
						g += eigenvectors[k][j] * eigenvalues_re[k];
						eigenvalues_im[k] += eigenvectors[k][j] * f;
					}
					eigenvalues_im[j] = g;
				}
				f = 0;
				for(j = 0; j < i; j ++){
					eigenvalues_im[j] /= h;
					f += eigenvalues_im[j] * eigenvalues_re[j];
				}
				hh = f / (h + h);
				for(j = 0; j < i; j ++)
					eigenvalues_im[j] -= hh * eigenvalues_re[j];
				for(j = 0; j < i; j ++){
					f = eigenvalues_re[j];
					g = eigenvalues_im[j];
					for(k = j; k <= i - 1; k ++)
						eigenvectors[k][j] -= (f * eigenvalues_im[k] + g * eigenvalues_re[k]);
					eigenvalues_re[j] = eigenvectors[i - 1][j];
					eigenvectors[i][j] = 0;
				}
			}
			eigenvalues_re[i] = h;
		}
		//accumulate transformations
		var g;
		for(i = 0; i < n - 1; i ++){
			eigenvectors[n - 1][i] = eigenvectors[i][i];
			eigenvectors[i][i] = 1;
			h = eigenvalues_re[i + 1];
			if(h){
				for(k = 0; k <= i; k ++)
					eigenvalues_re[k] = eigenvectors[k][i + 1] / h;
				for(j = 0; j <= i; j ++){
					g = 0;
					for(k = 0; k <= i; k ++)
						g += eigenvectors[k][i + 1] * eigenvectors[k][j];
					for(k = 0; k <= i; k ++)
						eigenvectors[k][j] -= g * eigenvalues_re[k];
				}
			}
			for(k = 0; k <= i; k ++)
				eigenvectors[k][i + 1] = 0;
		}
		for(j = 0; j < n; j ++){
			eigenvalues_re[j] = eigenvectors[n - 1][j];
			eigenvectors[n - 1][j] = 0;
		}
		eigenvectors[n - 1][n - 1] = 1;
		eigenvalues_im[0] = 0;
	};

	/**
	 * Perform the symmetric tridiagonal QL algorithm
	 * This is derived from the Algol procedures tql2, by Bowdler, Martin, Reinsch, and Wilkinson, Handbook for
	 * Auto. Comp., Vol.ii-Linear Algebra, and the corresponding Fortran subroutine in EISPACK
	 *
	 * @private
	 */
	var diagonalize = function(n, eigenvalues_re, eigenvalues_im, eigenvectorsV){
		var eps = 0.5 * Math.pow(2, -40),
			i, f, tst1, l, m;

		for(i = 1; i < n; i ++)
			eigenvalues_im[i - 1] = eigenvalues_im[i];
		eigenvalues_im[n - 1] = 0;

		f = 0;
		tst1 = 0;
		for(l = 0; l < n; l ++){
			//find small subdiagonal element
			tst1 = Math.max(tst1, Math.abs(eigenvalues_re[l]) + Math.abs(eigenvalues_im[l]));
			m = l;
			while(m < n){
				if(Math.abs(eigenvalues_im[m]) <= eps * tst1)
					break;
				m ++;
			}

			//if m == l, d[l] is an eigenvalue, otherwise, iterate
			if(m > l){
				var iter = 0;
				do{
					//(could check iteration count here)
					iter ++;
					//compute implicit shift
					var g = eigenvalues_re[l];
					var p = (eigenvalues_re[l + 1] - g) / (2 * eigenvalues_im[l]);
					var r = MathHelper.hypot(p, 1);
					if(p < 0)
						r = -r;
					eigenvalues_re[l] = eigenvalues_im[l] / (p + r);
					eigenvalues_re[l + 1] = eigenvalues_im[l] * (p + r);
					var dl1 = eigenvalues_re[l + 1];
					var h = g - eigenvalues_re[l];
					for(i = l + 2; i < n; i++)
						eigenvalues_re[i] -= h;
					f = f + h;

					// Implicit QL transformation.
					p = eigenvalues_re[m];
					var c = 1;
					var c2 = c;
					var c3 = c;
					var el1 = eigenvalues_im[l + 1];
					var s = 0;
					var s2 = 0;
					for(i = m - 1; i >= l; i--){
						c3 = c2;
						c2 = c;
						s2 = s;
						g = c * eigenvalues_im[i];
						h = c * p;
						r = MathHelper.hypot(p, eigenvalues_im[i]);
						eigenvalues_im[i + 1] = s * r;
						s = eigenvalues_im[i] / r;
						c = p / r;
						p = c * eigenvalues_re[i] - s * g;
						eigenvalues_re[i + 1] = h + s * (c * g + s * eigenvalues_re[i]);

						//accumulate transformation
						for(var k = 0; k < n; k++){
							h = eigenvectorsV[k][i + 1];
							eigenvectorsV[k][i + 1] = s * eigenvectorsV[k][i] + c * h;
							eigenvectorsV[k][i] = c * eigenvectorsV[k][i] - s * h;
						}
					}
					p = -s * s2 * c3 * el1 * eigenvalues_im[l] / dl1;
					eigenvalues_im[l] = s * p;
					eigenvalues_re[l] = c * p;
				//check for convergence
				}while(Math.abs(eigenvalues_im[l]) > eps * tst1);
			}
			eigenvalues_re[l] = eigenvalues_re[l] + f;
			eigenvalues_im[l] = 0;
		}

		//sort eigenvalues and corresponding vectors
		for(i = 0; i < n - 1; i++){
			var k = i;
			var p = eigenvalues_re[i];
			for(var j = i + 1; j < n; j++)
				if(eigenvalues_re[j] < p){
					k = j;
					p = eigenvalues_re[j];
				}
			if(k != i){
				eigenvalues_re[k] = eigenvalues_re[i];
				eigenvalues_re[i] = p;
				for(var j = 0; j < n; j++){
					p = eigenvectorsV[j][i];
					eigenvectorsV[j][i] = eigenvectorsV[j][k];
					eigenvectorsV[j][k] = p;
				}
			}
		}
	};


	return {
		decompose: decompose
	};
});
