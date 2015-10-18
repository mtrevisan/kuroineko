require(['tools/lang/morphology/Conjugator'], function(Conjugator){
	module('ExtractVerbsForms');

	test('portàr', function(){
		var forms = Conjugator.extractForms('portàr');

		var expected = [
			"#pòrte",
			"#pòrto",
			"#pòrti",
			"#pòrt",
			"#pòrta",
			"#portè",
			"#porté",
			"#porton",
			"#porten",
			"#portemo",
			"#portarà",
			"#portarè",
			"#portarò",
			"#portaré",
			"#portaremo",
			"#portaron",
			"#portaren",
			"portar#",
			"portare",
			"portante",
			"portào",
			"portasto",
			"portasti",
			"portasta",
			"portaste",
			"#portase",
			"#portasi",
			"#portàsimo",
			"#portaría",
			"#portaríe",
			"#portaresi",
			"#portarésimo",
			"#portarave",
			"portando#",
			"#portàa",
			"#portava",
			"#portàe",
			"#portave",
			"#portào",
			"#portavo",
			"#portài",
			"#portavi",
			"#portié",
			"#portivié",
			"#portàimo",
			"#portàvimo",
			"#portonse",
			"#portion",
			"#portionse",
			"#portivon",
			"#portivonse",
			"#portivion",
			"#portivionse",
			"#portense",
			"#portiven",
			"#portivense",
			"portà",
			"portado",
			"portadi",
			"portàa",
			"portada",
			"portàe",
			"portade",
			"#portiede",
			"#portiege",
			"#portisié",
			"#portisiede",
			"#portisiege",
			"#porton",
			"#portone",
			"#portonse",
			"#portion",
			"#portione",
			"#portionse",
			"#portison",
			"#portisone",
			"#portisonse",
			"#portision",
			"#portisione",
			"#portisionse",
			"#porten",
			"#portene",
			"#portense",
			"#portisen",
			"#portisene",
			"#portisense",
			"#portede",
			"#portege",
			"#portone",
			"#portione",
			"#portene",
			"#portarié",
			"#portarisié",
			"#portaronse",
			"#portarion",
			"#portarionse",
			"#portarison",
			"#portarisonse",
			"#portarision",
			"#portarisionse",
			"#portarense",
			"#portarisen",
			"#portarisense"
		];

		deepEqual(forms, expected);
	});

	test('valér', function(){
		var forms = Conjugator.extractForms('valér');

		var expected = [
			"#vale",
			"#valo",
			"#vali",
			"#val",
			"#valé",
			"#valí",
			"#valon",
			"#valen",
			"#valemo",
			"#valimo",
			"#valerà",
			"#valerè",
			"#valerò",
			"#valeré",
			"#valerí",
			"#valeremo",
			"#valeron",
			"#valeren",
			"#valerimo",
			"valer#",
			"valere",
			"valente",
			"valúo",
			"valesto",
			"valesti",
			"valesta",
			"valeste",
			"valso",
			"valsi",
			"valsa",
			"valse",
			"#valese",
			"#valesi",
			"#valésimo",
			"#vala",
			"#valería",
			"#valeríe",
			"#valeresi",
			"#valerésimo",
			"#valerave",
			"valendo#",
			"#valéa",
			"#valeva",
			"#valée",
			"#valeve",
			"#valéo",
			"#valevo",
			"#valéi",
			"#valevi",
			"#valié",
			"#valivié",
			"#valéimo",
			"#valévimo",
			"#valonse",
			"#valion",
			"#valionse",
			"#valivon",
			"#valivonse",
			"#valivion",
			"#valivionse",
			"#valense",
			"#valiven",
			"#valivense",
			"valú",
			"valudo",
			"valudi",
			"valúa",
			"valuda",
			"valúe",
			"valude",
			"#valiede",
			"#valiege",
			"#valisié",
			"#valisiede",
			"#valisiege",
			"#valon",
			"#valone",
			"#valonse",
			"#valion",
			"#valione",
			"#valionse",
			"#valison",
			"#valisone",
			"#valisonse",
			"#valision",
			"#valisione",
			"#valisionse",
			"#valen",
			"#valene",
			"#valense",
			"#valisen",
			"#valisene",
			"#valisense",
			"#valede",
			"#valege",
			"#valone",
			"#valione",
			"#valene",
			"#valerié",
			"#valerisié",
			"#valeronse",
			"#valerion",
			"#valerionse",
			"#valerison",
			"#valerisonse",
			"#valerision",
			"#valerisionse",
			"#valerense",
			"#valerisen",
			"#valerisense"
		];

		deepEqual(forms, expected);
	});

	test('béver', function(){
		var forms = Conjugator.extractForms('béver');

		var expected = [
			"#beve",
			"#bevo",
			"#bevi",
			"#bef",
			"#bevé",
			"#beví",
			"#bevon",
			"#beven",
			"#bevemo",
			"#bevimo",
			"#beverà",
			"#beverè",
			"#beverò",
			"#beveré",
			"#beverí",
			"#beveremo",
			"#beveron",
			"#beveren",
			"#beverimo",
			"béver#",
			"bévere",
			"bevente",
			"bevúo",
			"bevesto",
			"bevesti",
			"bevesta",
			"beveste",
			"#bevese",
			"#bevesi",
			"#bevésimo",
			"#beva",
			"#bevería",
			"#beveríe",
			"#beveresi",
			"#beverésimo",
			"#beverave",
			"bevendo#",
			"#bevéa",
			"#beveva",
			"#bevée",
			"#beveve",
			"#bevéo",
			"#bevevo",
			"#bevéi",
			"#bevevi",
			"#bevié",
			"#bevivié",
			"#bevéimo",
			"#bevévimo",
			"#bevonse",
			"#bevion",
			"#bevionse",
			"#bevivon",
			"#bevivonse",
			"#bevivion",
			"#bevivionse",
			"#bevense",
			"#beviven",
			"#bevivense",
			"bevú",
			"bevudo",
			"bevudi",
			"bevúa",
			"bevuda",
			"bevúe",
			"bevude",
			"#beviede",
			"#beviege",
			"#bevisié",
			"#bevisiede",
			"#bevisiege",
			"#bevon",
			"#bevone",
			"#bevonse",
			"#bevion",
			"#bevione",
			"#bevionse",
			"#bevison",
			"#bevisone",
			"#bevisonse",
			"#bevision",
			"#bevisione",
			"#bevisionse",
			"#beven",
			"#bevene",
			"#bevense",
			"#bevisen",
			"#bevisene",
			"#bevisense",
			"#bevede",
			"#bevege",
			"#bevone",
			"#bevione",
			"#bevene",
			"#beverié",
			"#beverisié",
			"#beveronse",
			"#beverion",
			"#beverionse",
			"#beverison",
			"#beverisonse",
			"#beverision",
			"#beverisionse",
			"#beverense",
			"#beverisen",
			"#beverisense"
		];

		deepEqual(forms, expected);
	});

	test('dormír', function(){
		var forms = Conjugator.extractForms('dormír');

		var expected = [
			"#dòrme",
			"#dòrmo",
			"#dòrmi",
			"#dòrn",
			"#dormí",
			"#dormé",
			"#dormon",
			"#dormen",
			"#dormimo",
			"#dormirà",
			"#dormirè",
			"#dormirò",
			"#dormiré",
			"#dormiremo",
			"#dormiron",
			"#dormiren",
			"dormir#",
			"dormire",
			"dormente",
			"dormío",
			"dormisto",
			"dormisti",
			"dormista",
			"dormiste",
			"dormesto",
			"dormesti",
			"dormesta",
			"dormeste",
			"#dormise",
			"#dormisi",
			"#dormísimo",
			"#dòrma",
			"#dormiría",
			"#dormiríe",
			"#dormiresi",
			"#dormirésimo",
			"#dormirave",
			"dormindo#",
			"dormendo#",
			"#dormía",
			"#dormiva",
			"#dormíe",
			"#dormive",
			"#dormío",
			"#dormivo",
			"#dormíi",
			"#dormivi",
			"#dormié",
			"#dormivié",
			"#dormíimo",
			"#dormívimo",
			"#dormonse",
			"#dormion",
			"#dormionse",
			"#dormivon",
			"#dormivonse",
			"#dormivion",
			"#dormivionse",
			"#dormense",
			"#dormiven",
			"#dormivense",
			"dormí",
			"dormido",
			"dormidi",
			"dormía",
			"dormida",
			"dormíe",
			"dormide",
			"#dormiede",
			"#dormiege",
			"#dormisié",
			"#dormisiede",
			"#dormisiege",
			"#dormon",
			"#dormone",
			"#dormonse",
			"#dormion",
			"#dormione",
			"#dormionse",
			"#dormison",
			"#dormisone",
			"#dormisonse",
			"#dormision",
			"#dormisione",
			"#dormisionse",
			"#dormen",
			"#dormene",
			"#dormense",
			"#dormisen",
			"#dormisene",
			"#dormisense",
			"#dormede",
			"#dormege",
			"#dormide",
			"#dormige",
			"#dormone",
			"#dormione",
			"#dormene",
			"#dormirié",
			"#dormirisié",
			"#dormironse",
			"#dormirion",
			"#dormirionse",
			"#dormirison",
			"#dormirisonse",
			"#dormirision",
			"#dormirisionse",
			"#dormirense",
			"#dormirisen",
			"#dormirisense"
		];

		deepEqual(forms, expected);
	});

	test('fenír', function(){
		var forms = Conjugator.extractForms('fenír');

		var expected = [
			"#fenise",
			"#feniso",
			"#fenisi",
			"#fenis",
			"#fení",
			"#fenisé",
			"#fenison",
			"#fenisen",
			"#fenimo",
			"#fenirà",
			"#fenirè",
			"#fenirò",
			"#feniré",
			"#feniremo",
			"#feniron",
			"#feniren",
			"fenir#",
			"fenire",
			"#fené",
			"fenente",
			"fenío",
			"fenisto",
			"fenisti",
			"fenista",
			"feniste",
			"fenesto",
			"fenesti",
			"fenesta",
			"feneste",
			"#fenísimo",
			"#fenisa",
			"#feniría",
			"#feniríe",
			"#feniresi",
			"#fenirésimo",
			"#fenirave",
			"fenindo#",
			"fenendo#",
			"#fenía",
			"#feniva",
			"#feníe",
			"#fenive",
			"#fenío",
			"#fenivo",
			"#feníi",
			"#fenivi",
			"#fenié",
			"#fenivié",
			"#feníimo",
			"#fenívimo",
			"#fenon",
			"#fenonse",
			"#fenion",
			"#fenionse",
			"#fenivon",
			"#fenivonse",
			"#fenivion",
			"#fenivionse",
			"#fenen",
			"#fenense",
			"#feniven",
			"#fenivense",
			"fení",
			"fenido",
			"fenidi",
			"fenía",
			"fenida",
			"feníe",
			"fenide",
			"#feniede",
			"#feniege",
			"#fenisié",
			"#fenisiede",
			"#fenisiege",
			"#fenon",
			"#fenone",
			"#fenonse",
			"#fenion",
			"#fenione",
			"#fenionse",
			"#fenison",
			"#fenisone",
			"#fenisonse",
			"#fenision",
			"#fenisione",
			"#fenisionse",
			"#fenen",
			"#fenene",
			"#fenense",
			"#fenisen",
			"#fenisene",
			"#fenisense",
			"#fenisede",
			"#fenisege",
			"#fenisone",
			"#fenision",
			"#fenisione",
			"#fenisene",
			"#fenirié",
			"#fenirisié",
			"#fenironse",
			"#fenirion",
			"#fenirionse",
			"#fenirison",
			"#fenirisonse",
			"#fenirision",
			"#fenirisionse",
			"#fenirense",
			"#fenirisen",
			"#fenirisense"
		];

		deepEqual(forms, expected);
	});

	test('andàr', function(){
		var forms = Conjugator.extractForms('andàr');

		var expected = [
			"#ande",
			"#ando",
			"#andi",
			"#ant",
			"#anda",
			"#andè",
			"#andé",
			"#andon",
			"#anden",
			"#andemo",
			"#vae",
			"#va",
			"#vè",
			"#ve",
			"#von",
			"#ven",
			"#vemo",
			"#andarà",
			"#andarè",
			"#andarò",
			"#andaré",
			"#andaremo",
			"#andaron",
			"#andaren",
			"andar#",
			"andare",
			"andante",
			"andào",
			"andasto",
			"andasti",
			"andasta",
			"andaste",
			"#andase",
			"#andasi",
			"#andàsimo",
			"#andaría",
			"#andaríe",
			"#andaresi",
			"#andarésimo",
			"#andarave",
			"andando#",
			"#vao",
			"#vago",
			"#andàa",
			"#andava",
			"#andàe",
			"#andave",
			"#andào",
			"#andavo",
			"#andài",
			"#andavi",
			"#andié",
			"#andivié",
			"#andàimo",
			"#andàvimo",
			"#andonse",
			"#andion",
			"#andionse",
			"#andivon",
			"#andivonse",
			"#andivion",
			"#andivionse",
			"#andense",
			"#andiven",
			"#andivense",
			"andà",
			"andado",
			"andadi",
			"andàa",
			"andada",
			"andàe",
			"andade",
			"#andiede",
			"#andiege",
			"#andisié",
			"#andisiede",
			"#andisiege",
			"#andon",
			"#andone",
			"#andonse",
			"#andion",
			"#andione",
			"#andionse",
			"#andison",
			"#andisone",
			"#andisonse",
			"#andision",
			"#andisione",
			"#andisionse",
			"#anden",
			"#andene",
			"#andense",
			"#andisen",
			"#andisene",
			"#andisense",
			"#andede",
			"#andege",
			"#andone",
			"#andione",
			"#andene",
			"#vaa",
			"#vaga",
			"#vai",
			"#vagi",
			"#ve",
			"#vede",
			"#vege",
			"#vone",
			"#vion",
			"#vione",
			"#vene",
			"#andarié",
			"#andarisié",
			"#andaronse",
			"#andarion",
			"#andarionse",
			"#andarison",
			"#andarisonse",
			"#andarision",
			"#andarisionse",
			"#andarense",
			"#andarisen",
			"#andarisense"
		];

		deepEqual(forms, expected);
	});

});
