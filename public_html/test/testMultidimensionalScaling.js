//http://www.bristol.ac.uk/media-library/sites/cmm/migrated/documents/chapter3.pdf
//https://homepage.uni-tuebingen.de/florian.wickelmaier/pubs/Wickelmaier2003SQRU.pdf
//https://github.com/asarnow/mdscale/blob/master/src/main/java/mdscale/Data.java
require(['../test/lib/EVDecomposition'], function(EVDecomposition){
	QUnit.module('MultidimensionalScaling');

	var doubleCenter = function(J, P2, n){
		var c = [],
			d = [],
			i, j, k,
			sum0, sum1;
		for(i = 0; i < n; i ++){
			d[i] = [];
			for(j = 0; j < n; j ++){
				sum0 = 0;
				for(k = 0; k < n; k ++)
					sum0 += J[Math.min(i, k)][Math.max(k, i)] * P2[Math.min(k, j)][Math.max(j, k)];
				c[j] = sum0;
			}
			for(j = i; j < n; j ++){
				sum1 = 0;
				for(k = 0; k < n; k ++)
					sum1 += c[k] * J[Math.min(k, j)][Math.max(j, k)];
				d[i][j] = -0.5 * sum1;
			}
		}
		return d;
	};

	var multiplyDiagonal = function(a, b, n, m){
		var c = [],
			i, j;
		for(i = 0; i < n; i ++){
			c[i] = [];
			for(j = 0; j < m; j ++)
				c[i][j] = a[i][j] * b[j];
		}
		return c;
	};


	QUnit.test('test', function(){
		var dimensions = 2,
			variants = ['Anpeŧ', 'Pàđule', 'Uronŧo', 'Poŧale', 'Verona', 'Ŧenŧenige', 'Kaxan', 'Arfanta (Tarŧo)', 'Belun', 'Sa Stin', 'Venèsia', 'Krespaòro', 'Bixa', 'Montebèlo', 'Teoƚo', 'Roman', 'Vas', 'Toneđa', 'Vicensa', 'Lovadina', 'Kanpo San Martin', 'Istrana', 'Raldon', 'Méolo', 'Cerèa', 'Frata', 'Vila', 'Kavàrxare', 'Trevixo', 'Italia'],
			matrix = [
				[0, 0.2775177993927995, 0.16036046348546357, 0.19654386529386533, 0.25538609522984546, 0.24875682688182701, 0.26643084533709543, 0.2669324458386959, 0.26277817996568026, 0.2611009790697293, 0.2689770041332543, 0.25955544314919327, 0.27083604036729036, 0.26029804701679704, 0.2765150882338383, 0.26218435984060995, 0.2626359962297465, 0.2630664919727422, 0.26160546707421717, 0.26377857080982103, 0.26657913923538934, 0.2639315569003071, 0.24252711674586694, 0.25143913659538686, 0.2349336544649046, 0.27822686182061196, 0.2758027515840017, 0.2771030044467546, 0.2473044902732405, 0.3572244572244573],
				[null, 0, 0.2083467653780157, 0.23988195785070812, 0.31947569135069165, 0.27124346186846227, 0.29644460738210765, 0.3115957475332479, 0.29694319147444187, 0.30435074497574527, 0.31836554961554986, 0.310420327607828, 0.32488207644457673, 0.31377591533841576, 0.32576658045408086, 0.32138603232353274, 0.29555082211332245, 0.31220753720753774, 0.3133047508047512, 0.31479319291819335, 0.3230838324588328, 0.3157551954426959, 0.3111254455004459, 0.3044777435402439, 0.301152113652114, 0.31917827855327896, 0.32192537661287707, 0.3240555803055808, 0.3043420309045311, 0.39487971909846936],
				[null, null, 0, 0.13311347061347065, 0.21267786502161526, 0.20954116032241055, 0.21266358219483222, 0.22189709455334466, 0.21364009957759963, 0.2108373397435899, 0.21732612591987613, 0.20736578783453805, 0.23541065962940994, 0.212910205878956, 0.23087985822360843, 0.21345058141933157, 0.2095499775187276, 0.20985342313467328, 0.2084376232813734, 0.21964087198462212, 0.22263247966372976, 0.21226242554367583, 0.2063743946556449, 0.20403056731181754, 0.19290017180642197, 0.22923444564069592, 0.2224001903689406, 0.229917958824209, 0.20517092470217496, 0.3218496945059447],
				[null, null, null, 0, 0.2607241083803585, 0.22334574443949462, 0.2300457308269808, 0.2557845706283207, 0.22414550539550562, 0.2576933131620632, 0.2730440003877506, 0.26005199052074063, 0.273390603859354, 0.26474150146025155, 0.2859942961505462, 0.2673484525047025, 0.23401367541992554, 0.26915845275220274, 0.26512542215667223, 0.2612346292033792, 0.2791715393277894, 0.2661869544682046, 0.25392233751608767, 0.2585877171814673, 0.24716991201366215, 0.27518905409530414, 0.2740259060571562, 0.28189744517869525, 0.25007582273207285, 0.365452970921721],
				[null, null, null, null, 0, 0.22709426459426477, 0.16233329827079843, 0.14707037050787058, 0.17042591183216194, 0.13033765221265226, 0.12235762548262545, 0.0971057939807939, 0.12854683323433327, 0.0993574274824274, 0.12781655281655277, 0.10722638847638843, 0.16206300737550752, 0.100034882066132, 0.09606094918594908, 0.13479605979605988, 0.12720661939411937, 0.11427535021285022, 0.05941583754083755, 0.10564640877140875, 0.054701576576576566, 0.1284362831237831, 0.12482767795267792, 0.13834026334026334, 0.10949612043362038, 0.2567313997001501],
				[null, null, null, null, null, 0, 0.1611283330033331, 0.16820111663861673, 0.137146151989902, 0.1983760374385376, 0.24696801884301922, 0.2320030195030198, 0.2008461414711416, 0.23342454748704777, 0.2546456312081316, 0.22983465952215978, 0.1440047705672706, 0.23101188413688445, 0.23387567293817318, 0.19571334727584735, 0.2482572888822893, 0.23767190954690987, 0.2225457256707259, 0.22363508769758791, 0.21712222180972202, 0.2506902163152167, 0.24571829728079767, 0.2571236758736762, 0.2269406081906084, 0.3567569911319914],
				[null, null, null, null, null, null, 0, 0.08582339207339201, 0.0783441666254166, 0.13068224474474482, 0.17833269395769416, 0.16766460828960847, 0.1552288036663038, 0.16877511096261108, 0.19156514000264022, 0.16134412228162243, 0.06593463312213309, 0.1661716403903905, 0.17110909454659465, 0.12870255214005213, 0.1841014606639608, 0.16590307684057698, 0.16195926352176362, 0.15512784419034426, 0.147062068937069, 0.19715101433851454, 0.1831645175395178, 0.1972814675939678, 0.15541834760584777, 0.30300819675819696],
				[null, null, null, null, null, null, null, 0, 0.08280417264792264, 0.09398574398574397, 0.15653106746856754, 0.16100819225819238, 0.1544494356994359, 0.1573892745767747, 0.16276637214137227, 0.1354867401742402, 0.07735310860310858, 0.16084244443619458, 0.16146459115209133, 0.08544420106920103, 0.15930941243441255, 0.13416153103653106, 0.15008554227304235, 0.12638136075636075, 0.1389484951984953, 0.16461720992971005, 0.16604992698742713, 0.16579299079299095, 0.13942570661320666, 0.2914091234403736],
				[null, null, null, null, null, null, null, null, 0, 0.13643072158697162, 0.19337109258984272, 0.18222981738606753, 0.15920038341913348, 0.18214597667722685, 0.1974180310117812, 0.1677662638600139, 0.0733898304210804, 0.1819845601095603, 0.18472151206526233, 0.12687612921987917, 0.19385495557370575, 0.1729909940847442, 0.1737690214252715, 0.1633090937778438, 0.15752171299046305, 0.1949248785186287, 0.1929297687110189, 0.20443590052965072, 0.16276119010494017, 0.3239056996869499],
				[null, null, null, null, null, null, null, null, null, 0, 0.10827053014553006, 0.12630765208890207, 0.15308359527109527, 0.12673954002079002, 0.1204465368527869, 0.10080824299574294, 0.12435216810216809, 0.135379386941887, 0.12781970985095986, 0.04989326551826551, 0.11107414076164068, 0.09069161881661879, 0.12890823515823518, 0.06596263158763156, 0.11322863041613042, 0.1250260390885391, 0.12932545354420355, 0.12509967041217046, 0.10035361597861596, 0.2666252220939723],
				[null, null, null, null, null, null, null, null, null, null, 0, 0.10385087181962177, 0.18389113701613713, 0.10212997166122159, 0.08606225559350554, 0.08254489035739034, 0.17064260345510354, 0.09979875136125131, 0.09927311567936563, 0.11756277225027226, 0.07660674066924061, 0.057014621077121075, 0.12365762053262049, 0.06747537372537367, 0.10641412360162356, 0.10150789525789516, 0.10177372599247597, 0.09289968196218193, 0.07847645035145029, 0.24391021656646683],
				[null, null, null, null, null, null, null, null, null, null, null, 0, 0.15379510692010695, 0.03823430229680229, 0.08324624418374414, 0.0889863936738936, 0.15813213625713637, 0.05305283820908818, 0.034663492475992465, 0.1240406271656272, 0.07866875288750283, 0.09145549223674217, 0.09351657632907627, 0.08936009326634323, 0.07961108429858428, 0.0963251369501369, 0.07135537838662835, 0.09421965750090747, 0.10645318223443212, 0.23489819114819152],
				[null, null, null, null, null, null, null, null, null, null, null, null, 0, 0.15672117859617865, 0.18725219037719054, 0.16394400925650932, 0.1452648046398047, 0.16378042706167717, 0.15713650088650094, 0.1551876051876052, 0.18637145043395054, 0.17719223344223353, 0.1101390023265023, 0.16591158466158476, 0.11604729729729725, 0.18531276812526823, 0.18176629582879594, 0.20107977139227157, 0.16380958568458573, 0.31668145105645135],
				[null, null, null, null, null, null, null, null, null, null, null, null, null, 0, 0.07145765270765268, 0.08907827814077808, 0.16046199014949028, 0.047286391817641805, 0.0182021807021807, 0.12899388055638053, 0.07728125618750617, 0.09063544141669136, 0.0936978702603702, 0.08758469149094145, 0.07921152608652607, 0.0915617884367884, 0.057326935451935436, 0.0871005191317691, 0.09947243775368766, 0.23209458053208082],
				[null, null, null, null, null, null, null, null, null, null, null, null, null, null, 0, 0.0824205214830214, 0.17848387535887553, 0.08135603838728835, 0.06955693518193516, 0.11812614468864466, 0.04609746250371251, 0.06478311243936241, 0.12000034031284021, 0.07260845151470145, 0.10404693842193835, 0.06974742599742594, 0.060880110880110846, 0.058022643178893135, 0.09258203086328078, 0.24103176290676334],
				[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, 0, 0.14813090906840914, 0.08641602625977621, 0.08067603848853845, 0.0951223888723888, 0.05877806034056031, 0.06371166839916838, 0.10132273413523409, 0.06181009306009303, 0.08801681145431144, 0.09686051092301083, 0.09449574918324911, 0.10147278116028109, 0.07613184956934954, 0.263040464602965],
				[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, 0, 0.16652969074844093, 0.16451812545562564, 0.11682135432135428, 0.17059604247104265, 0.15316016566016577, 0.15630594536844547, 0.14415734415734427, 0.14585571148071153, 0.1808300745800747, 0.1788515679140681, 0.18979030541530564, 0.15727356821106833, 0.30673655361155383],
				[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, 0, 0.04046984125109124, 0.1396698810761312, 0.07228615978615975, 0.09253817691317685, 0.10163017584892577, 0.09595213345213341, 0.08801920911295909, 0.1049619158994158, 0.06675568941193936, 0.0936955499455499, 0.10355039105039096, 0.236313402719653],
				[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, 0, 0.1282944673569674, 0.06756051521676519, 0.08818147646272642, 0.09571420977670972, 0.08861001751626747, 0.08239699489699488, 0.0933145542520542, 0.05598857786357786, 0.08721574737199733, 0.09840950856575852, 0.234527001714502],
				[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, 0, 0.10457179363429359, 0.08089762152262152, 0.12489001707751707, 0.06729191416691414, 0.12004968567468573, 0.1262885481635482, 0.1304406741906742, 0.12470779502029505, 0.09562110187110184, 0.2785005675630679],
				[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, 0, 0.051113751113751126, 0.11370212932712928, 0.06321259446259442, 0.10470812502062499, 0.07577787265287257, 0.06838238478863475, 0.06560891248391246, 0.0809307246807246, 0.2479213190150694],
				[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, 0, 0.10816704410454404, 0.03697101978351978, 0.09546873453123447, 0.08253772316272309, 0.0817033637346137, 0.07468814968814962, 0.058257691070191076, 0.2464520441082945],
				[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, 0, 0.09875378469128467, 0.05231165231165229, 0.12886322105072107, 0.11636868668118665, 0.13382374476124473, 0.09967268092268085, 0.2635897089022093],
				[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, 0, 0.08355943512193507, 0.08494363181863174, 0.09052025067650063, 0.08063630251130245, 0.058729643104643105, 0.24927684693309732],
				[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, 0, 0.10777754059004052, 0.10629186879186875, 0.12034751097251091, 0.08779947529947525, 0.24866962054462083],
				[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, 0, 0.07530571436821433, 0.06830769643269638, 0.10006569069069059, 0.2606055777930781],
				[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, 0, 0.06533163486288485, 0.09473373613998608, 0.24315309784059813],
				[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, 0, 0.09850633600633592, 0.24550156581406624],
				[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, 0, 0.2680313844376348],
				[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, 0]
			],
			n = variants.length,
			i, j;

		var distance = function(coordinateVector, i, j){
			return Math.sqrt(coordinateVector[i].reduce(function(previous, current, idx){ return previous + Math.pow(current - coordinateVector[j][idx], 2); }, 0));
		};
		var stress = function(distanceMatrix, coordinateVector){
			var num = 0,
				den = 0,
				i, j;
			for(i = 0; i < n; i ++)
				for(j = i; j < n; j ++)
					den += Math.pow(distanceMatrix[i][j], 2);
			for(i = 0; i < n; i ++)
				for(j = i; j < n; j ++)
					num += Math.pow(distanceMatrix[i][j] - distance(coordinateVector, i, j), 2);
			return num / den;
		};

matrix = [
	[0, 93, 82, 133],
	[null, 0, 52, 60],
	[null, null, 0, 111],
	[null, null, null, 0]
];
n = 4;
		//matrix of squared proximities: P2 = matrix^2
		var P2 = [];
		for(i = 0; i < n; i ++){
			P2[i] = [];
			for(j = i; j < n; j ++)
				P2[i][j] = Math.pow(matrix[i][j], 2);
		}
		//J = I - 1 * 1' / n
		var J = [],
			n_inv = 1 / n;
		for(i = 0; i < n; i ++){
			J[i] = [];
			for(j = i; j < n; j ++)
				J[i][j] = (i == j? 1: 0) - n_inv;
		}
		//apply the double centering: B = -0.5 * J * P2 * J
		var B = doubleCenter(J, P2, n);
		//extract the m = dimensions largest positive eigenvalues lambda_1..lambda_m of B and the corresponding eigenvectors e_1..e_m
		var eigen = EVDecomposition.decompose(B);
		var sorter = [];
		for(i = 0; i < n; i ++)
			sorter.push(i);
		sorter.sort(function(a, b){
			return (eigen.eigenvalues_real[b] - eigen.eigenvalues_real[a]);
		});
		var lambda = [],
			E = [];
		for(i = 0; i < n; i ++)
			E[i] = [];
		for(i = 0; i < dimensions; i ++){
			lambda.push(eigen.eigenvalues_real[sorter[i]]);
			for(j = 0; j < n; j ++)
				E[j][i] = eigen.eigenvectors[j][sorter[i]];
		}
		//a m-dimensional spatial configuration of the n objects is derived from the coordinate matrix X = E_m * Λ_m^0.5,
		lambda = lambda.map(function(el){ return Math.sqrt(el); });
		var X = multiplyDiagonal(E, lambda, n, dimensions);
		//where E_m is the matrix of m eigenvectors and Λ_m is the diagonal matrix of m eigenvalues of B, respectively

//console.log(JSON.stringify(B));
//console.log(JSON.stringify(eigen));
//console.log(JSON.stringify(lambda));
//console.log(JSON.stringify(E));
console.log(JSON.stringify(X));
	});

});
