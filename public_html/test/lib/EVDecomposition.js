/**
 * @class EVDecomposition
 *
 * @see {@link www.cs.bham.ac.uk/~pxc/js/}
 *
 * @author Mauro Trevisan
 */
define(function(){
/*
 Description: Javascript routines to find the eigenvalues and eigenvectors of a matrix.
 Acknowledgement: This Javascript code is based on the source code of
 JAMA, A Java Matrix package (http://math.nist.gov/javanumerics/jama/),
 which states "Copyright Notice This software is a cooperative product
 of The MathWorks and the National Institute of Standards and
 Technology (NIST) which has been released to the public domain.
 Neither The MathWorks nor NIST assumes any responsibility whatsoever
 for its use by other parties, and makes no guarantees, expressed
 or implied, about its quality, reliability, or any other
 characteristic."
 Author: Peter Coxhead (http://www.cs.bham.ac.uk/~pxc/)
 Copyright: The conversion of the JAMA source to Javascript is
 copyright Peter Coxhead, 2008, and is released under GPLv3
 (http://www.gnu.org/licenses/gpl-3.0.html).
 Last Revision: 9 Dec 2008


 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

 EV Decomposition (from the JAMA package)

 Eigenvalues and eigenvectors of a real matrix.

 If A is symmetric, then A = V*L*V' where the eigenvalue matrix L is
 diagonal and the eigenvector matrix V is orthogonal (i.e. V*V' = I).
*/

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// EVDecomposition.create(mo): given a matrix as a Matrix object mo, it
//   returns an EVDecomposition object which contains the eigenvectors
//   and eigenvalues of the matrix. The fields of an EVDecomposition
//   object are:
//   eigenvectors   the columnwise eigenvectors as a Matrix object
//   eigenvalues    the real part of the eigenvalues as an array
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	var decompose = function(matrix){
			//row and column dimension (square matrix)
		var n = matrix.length,
			eigenvectors = [],
			eigenvalues_real = [],
			eigenvalues_imaginary = [],
			eps = Math.pow(2, -40),
			i, j;
		for(i = 0; i < n; i ++)
			eigenvectors[i] = [];
		for(i = 0; i < n; i ++)
			for(j = i; j < n; j ++){
				eigenvectors[i][j] = matrix[i][j];
				eigenvectors[j][i] = matrix[i][j];
			}

		//process a symmetric matrix
		tridiagonalize(n, eigenvalues_real, eigenvalues_imaginary, eigenvectors);
		diagonalize(n, eigenvalues_real, eigenvalues_imaginary, eigenvectors);

		//reduce small values in d to 0
		eigenvalues_real = eigenvalues_real.map(function(el){ return (Math.abs(el) < eps? 0: el); });
		eigenvalues_imaginary = eigenvalues_imaginary.map(function(el){ return (Math.abs(el) < eps? 0: el); });

		//create an object to return the results
		return {
			eigenvectors: eigenvectors,
			eigenvalues_real: eigenvalues_real,
			eigenvalues_imaginary: eigenvalues_imaginary
		};
	};

	/**
	 * Perform the symmetric Householder reduction to tridiagonal form.
	 * This is derived from the Algol procedures tred2 by Bowdler, Martin, Reinsch, and Wilkinson, Handbook
	 * for Auto. Comp., Vol.ii-Linear Algebra, and the corresponding Fortran subroutine in EISPACK
	 *
	 * @private
	 */
	var tridiagonalize = function(n, d, eigenvalues, eigenvectors){
		var i, j, k;
		for(j = 0; j < n; j ++)
			d[j] = eigenvectors[n - 1][j];

		//Householder reduction to tridiagonal form
		var scale, h, hh,
			f, g;
		for(i = n - 1; i > 0; i --){
			//scale to avoid under/overflow
			scale = 0;
			h = 0;
			for(k = 0; k < i; k ++)
				scale += Math.abs(d[k]);
			if(!scale){
				eigenvalues[i] = d[i - 1];
				for(j = 0; j < i; j ++){
					d[j] = eigenvectors[i - 1][j];
					eigenvectors[i][j] = 0;
					eigenvectors[j][i] = 0;
				}
			}
			else{
				//generate Householder vector
				for(k = 0; k < i; k ++){
					d[k] /= scale;
					h += d[k] * d[k];
				}
				f = d[i - 1];
				g = Math.sqrt(h);
				if(f > 0)
					g = -g;
				eigenvalues[i] = scale * g;
				h = h - f * g;
				d[i - 1] = f - g;
				for(j = 0; j < i; j ++)
					eigenvalues[j] = 0;
				//apply similarity transformation to remaining columns
				for(j = 0; j < i; j ++){
					f = d[j];
					eigenvectors[j][i] = f;
					g = eigenvalues[j] + eigenvectors[j][j] * f;
					for(k = j + 1; k <= i - 1; k ++){
						g += eigenvectors[k][j] * d[k];
						eigenvalues[k] += eigenvectors[k][j] * f;
					}
					eigenvalues[j] = g;
				}
				f = 0;
				for(j = 0; j < i; j ++){
					eigenvalues[j] /= h;
					f += eigenvalues[j] * d[j];
				}
				hh = f / (h + h);
				for(j = 0; j < i; j ++)
					eigenvalues[j] -= hh * d[j];
				for(j = 0; j < i; j ++){
					f = d[j];
					g = eigenvalues[j];
					for(k = j; k <= i - 1; k ++)
						eigenvectors[k][j] -= (f * eigenvalues[k] + g * d[k]);
					d[j] = eigenvectors[i - 1][j];
					eigenvectors[i][j] = 0;
				}
			}
			d[i] = h;
		}
		//accumulate transformations
		var g;
		for(i = 0; i < n - 1; i ++){
			eigenvectors[n - 1][i] = eigenvectors[i][i];
			eigenvectors[i][i] = 1;
			h = d[i + 1];
			if(h){
				for(k = 0; k <= i; k ++)
					d[k] = eigenvectors[k][i + 1] / h;
				for(j = 0; j <= i; j ++){
					g = 0;
					for(k = 0; k <= i; k ++)
						g += eigenvectors[k][i + 1] * eigenvectors[k][j];
					for(k = 0; k <= i; k ++)
						eigenvectors[k][j] -= g * d[k];
				}
			}
			for(k = 0; k <= i; k ++)
				eigenvectors[k][i + 1] = 0;
		}
		for(j = 0; j < n; j ++){
			d[j] = eigenvectors[n - 1][j];
			eigenvectors[n - 1][j] = 0;
		}
		eigenvectors[n - 1][n - 1] = 1;
		eigenvalues[0] = 0;
	};

	/**
	 * Perform the symmetric tridiagonal QL algorithm
	 * This is derived from the Algol procedures tql2, by Bowdler, Martin, Reinsch, and Wilkinson, Handbook for
	 * Auto. Comp., Vol.ii-Linear Algebra, and the corresponding Fortran subroutine in EISPACK
	 *
	 * @private
	 */
	var diagonalize = function(n, d, eigenvalues, eigenvectorsV){
		var eps = 0.5 * Math.pow(2, -40),
			i, f, tst1, l, m;

		for(i = 1; i < n; i ++)
			eigenvalues[i - 1] = eigenvalues[i];
		eigenvalues[n - 1] = 0;

		f = 0;
		tst1 = 0;
		for(l = 0; l < n; l ++){
			//find small subdiagonal element
			tst1 = Math.max(tst1, Math.abs(d[l]) + Math.abs(eigenvalues[l]));
			m = l;
			while(m < n){
				if(Math.abs(eigenvalues[m]) <= eps * tst1)
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
					var g = d[l];
					var p = (d[l + 1] - g) / (2 * eigenvalues[l]);
					var r = hypot(p, 1);
					if(p < 0)
						r = -r;
					d[l] = eigenvalues[l] / (p + r);
					d[l + 1] = eigenvalues[l] * (p + r);
					var dl1 = d[l + 1];
					var h = g - d[l];
					for(i = l + 2; i < n; i++)
						d[i] -= h;
					f = f + h;

					// Implicit QL transformation.
					p = d[m];
					var c = 1;
					var c2 = c;
					var c3 = c;
					var el1 = eigenvalues[l + 1];
					var s = 0;
					var s2 = 0;
					for(i = m - 1; i >= l; i--){
						c3 = c2;
						c2 = c;
						s2 = s;
						g = c * eigenvalues[i];
						h = c * p;
						r = hypot(p, eigenvalues[i]);
						eigenvalues[i + 1] = s * r;
						s = eigenvalues[i] / r;
						c = p / r;
						p = c * d[i] - s * g;
						d[i + 1] = h + s * (c * g + s * d[i]);

						//accumulate transformation
						for(var k = 0; k < n; k++){
							h = eigenvectorsV[k][i + 1];
							eigenvectorsV[k][i + 1] = s * eigenvectorsV[k][i] + c * h;
							eigenvectorsV[k][i] = c * eigenvectorsV[k][i] - s * h;
						}
					}
					p = -s * s2 * c3 * el1 * eigenvalues[l] / dl1;
					eigenvalues[l] = s * p;
					d[l] = c * p;
				//check for convergence
				}while(Math.abs(eigenvalues[l]) > eps * tst1);
			}
			d[l] = d[l] + f;
			eigenvalues[l] = 0;
		}

		//sort eigenvalues and corresponding vectors
		for(i = 0; i < n - 1; i++){
			var k = i;
			var p = d[i];
			for(var j = i + 1; j < n; j++)
				if(d[j] < p){
					k = j;
					p = d[j];
				}
			if(k != i){
				d[k] = d[i];
				d[i] = p;
				for(var j = 0; j < n; j++){
					p = eigenvectorsV[j][i];
					eigenvectorsV[j][i] = eigenvectorsV[j][k];
					eigenvectorsV[j][k] = p;
				}
			}
		}
	};

	/**
	 * Find sqrt(a^2 + b^2) reliably
	 *
	 * @private
	 */
	var hypot = function(a, b){
		var r = 0,
			aa = Math.abs(a),
			bb = Math.abs(b);
		if(aa > bb){
			r = b / a;
			r = aa * Math.sqrt(1 + r * r);
		}
		else if(b){
			r = a / b;
			r = bb * Math.sqrt(1 + r * r);
		}
		return r;
	};


	return {
		decompose: decompose
	};
});
