/**
 * @class Phone
 *
 * @see {@link https://github.com/kremonte/phonologizer/blob/master/scripts/app.js}
 * @see {@link http://clas.mq.edu.au/speech/phonetics/phonology/features/}
 * @see {@link http://clas.mq.edu.au/speech/phonetics/phonology/phoneme/}
 *
 * @author Mauro Trevisan
 */
define(['tools/data/ObjectHelper'], function(ObjectHelper){

	/** @constant */
	var REGEX_UNICODE_SPLITTER = /(\[([^\]]+)\]|j²|[^\u0300-\u036F\u025A\u02B0-\u02FE\u1DA3\u207F][\u0300-\u035B\u035D-\u0360\u0362-\u036F\u025A\u02B0-\u02FE\u1DA3\u207F]*(?:[\u0300-\u036F\u025A\u02B0-\u02FE\u1DA3\u207F]*[\u035C\u0361][^\u0300-\u036F\u025A\u02B0-\u02FE\u1DA3\u207F][\u0300-\u036F\u025A\u02B0-\u02FE\u1DA3\u207F]*)?)/g,
	/** @constant */
		REGEX_UNICODE_COMPOUND_WITH_DIACRITICS = /^([^\u02B0\u02B2\u02B7\u02BC\u02C8\u02D0\u02DE\u02E0\u02E4\u0303\u031D-\u0320\u0324\u0325\u0329\u032A\u0330\u0334\u033A\u033B]+)([\u02B0\u02B2\u02B7\u02BC\u02C8\u02D0\u02DE\u02E0\u02E4\u0303\u031D-\u0320\u0324\u0325\u0329\u032A\u0330\u0334\u033A\u033B]*)$/,
	/** @constant */
		REGEX_UNICODE_DIACRITICS = /[\u02B0\u02B2\u02B7\u02BC\u02C8\u02D0\u02DE\u02E0\u02E4\u0303\u031D-\u0320\u0324\u0325\u0329\u032A\u0330\u0334\u033A\u033B]/g;

//	var REGEX_UNICODE_SPLITTER = /(\[([^\]]+)\]|j²|[^\u025A\u1DA3\u207F][\u035D-\u0360\u0362-\u036F\u025A\u1DA3\u207F]*(?:[\u025A\u1DA3\u207F]*[\u035C\u0361][^\u025A\u1DA3\u207F][\u025A\u1DA3\u207F]*)?)/g;
	/**
	 * @constant
	 * @private
	 */
	var REGEX_UNICODE_FEATURES = /^\[(\s*([\+\-0])?([a-z]+?)\s*)(,(\s*([\+\-0])?([a-z]+?)\s*))*]$/;


	/** @constant */
	var segments = {
		'p': {syl: -1, con: 1, son: -1, cnt: -1, dr: -1, app: -1, tap: -1, trill: -1, nas: -1, voi: -1, sg: -1, cg: -1, lab: 1, rou: -1, ld: -1, cor: -1, ant: 0, dst: 0, str: 0, lat: -1, dor: -1, hi: 0, lo: 0, ft: 0, bk: 0, tns: 0},
		'b': {syl: -1, con: 1, son: -1, cnt: -1, dr: -1, app: -1, tap: -1, trill: -1, nas: -1, voi: 1, sg: -1, cg: -1, lab: 1, rou: -1, ld: -1, cor: -1, ant: 0, dst: 0, str: 0, lat: -1, dor: -1, hi: 0, lo: 0, ft: 0, bk: 0, tns: 0},
		'm': {syl: -1, con: 1, son: 1, cnt: -1, dr: 0, app: -1, tap: -1, trill: -1, nas: 1, voi: 1, sg: -1, cg: -1, lab: 1, rou: -1, ld: -1, cor: -1, ant: 0, dst: 0, str: 0, lat: -1, dor: -1, hi: 0, lo: 0, ft: 0, bk: 0, tns: 0},
		'ɸ': {syl: -1, con: 1, son: -1, cnt: 1, dr: 1, app: -1, tap: -1, trill: -1, nas: -1, voi: -1, sg: -1, cg: -1, lab: 1, rou: -1, ld: -1, cor: -1, ant: 0, dst: 0, str: 0, lat: -1, dor: -1, hi: 0, lo: 0, ft: 0, bk: 0, tns: 0},
		'β': {syl: -1, con: 1, son: -1, cnt: 1, dr: 1, app: -1, tap: -1, trill: -1, nas: -1, voi: 1, sg: -1, cg: -1, lab: 1, rou: -1, ld: -1, cor: -1, ant: 0, dst: 0, str: 0, lat: -1, dor: -1, hi: 0, lo: 0, ft: 0, bk: 0, tns: 0},
		'ʙ': {syl: -1, con: 1, son: 1, cnt: 1, dr: 0, app: 1, tap: -1, trill: 1, nas: -1, voi: 1, sg: -1, cg: -1, lab: 1, rou: -1, ld: -1, cor: -1, ant: 0, dst: 0, str: 0, lat: -1, dor: -1, hi: 0, lo: 0, ft: 0, bk: 0, tns: 0},
		'ɱ': {syl: -1, con: 1, son: 1, cnt: -1, dr: 0, app: -1, tap: -1, trill: -1, nas: 1, voi: 1, sg: -1, cg: -1, lab: 1, rou: -1, ld: 1, cor: -1, ant: 0, dst: 0, str: 0, lat: -1, dor: -1, hi: 0, lo: 0, ft: 0, bk: 0, tns: 0},
		'f': {syl: -1, con: 1, son: -1, cnt: 1, dr: 1, app: -1, tap: -1, trill: -1, nas: -1, voi: -1, sg: -1, cg: -1, lab: 1, rou: -1, ld: 1, cor: -1, ant: 0, dst: 0, str: 0, lat: -1, dor: -1, hi: 0, lo: 0, ft: 0, bk: 0, tns: 0},
		'v': {syl: -1, con: 1, son: -1, cnt: 1, dr: 1, app: -1, tap: -1, trill: -1, nas: -1, voi: 1, sg: -1, cg: -1, lab: 1, rou: -1, ld: 1, cor: -1, ant: 0, dst: 0, str: 0, lat: -1, dor: -1, hi: 0, lo: 0, ft: 0, bk: 0, tns: 0},
		'ʋ': {syl: -1, con: -1, son: 1, cnt: 1, dr: 0, app: 1, tap: -1, trill: -1, nas: -1, voi: 1, sg: -1, cg: -1, lab: 1, rou: -1, ld: 1, cor: -1, ant: 0, dst: 0, str: 0, lat: -1, dor: -1, hi: 0, lo: 0, ft: 0, bk: 0, tns: 0},
		'n': {syl: -1, con: 1, son: 1, cnt: -1, dr: 0, app: -1, tap: -1, trill: -1, nas: 1, voi: 1, sg: -1, cg: -1, lab: -1, rou: -1, ld: -1, cor: 1, ant: 1, dst: -1, str: -1, lat: -1, dor: -1, hi: 0, lo: 0, ft: 0, bk: 0, tns: 0},
		't': {syl: -1, con: 1, son: -1, cnt: -1, dr: -1, app: -1, tap: -1, trill: -1, nas: -1, voi: -1, sg: -1, cg: -1, lab: -1, rou: -1, ld: -1, cor: 1, ant: 1, dst: -1, str: -1, lat: -1, dor: -1, hi: 0, lo: 0, ft: 0, bk: 0, tns: 0},
		'd': {syl: -1, con: 1, son: -1, cnt: -1, dr: -1, app: -1, tap: -1, trill: -1, nas: -1, voi: 1, sg: -1, cg: -1, lab: -1, rou: -1, ld: -1, cor: 1, ant: 1, dst: -1, str: -1, lat: -1, dor: -1, hi: 0, lo: 0, ft: 0, bk: 0, tns: 0},
		'θ': {syl: -1, con: 1, son: -1, cnt: 1, dr: 1, app: -1, tap: -1, trill: -1, nas: -1, voi: -1, sg: -1, cg: -1, lab: -1, rou: -1, ld: -1, cor: 1, ant: 1, dst: 1, str: -1, lat: -1, dor: -1, hi: 0, lo: 0, ft: 0, bk: 0, tns: 0},
		'ð': {syl: -1, con: 1, son: -1, cnt: 1, dr: 1, app: -1, tap: -1, trill: -1, nas: -1, voi: 1, sg: -1, cg: -1, lab: -1, rou: -1, ld: -1, cor: 1, ant: 1, dst: 1, str: -1, lat: -1, dor: -1, hi: 0, lo: 0, ft: 0, bk: 0, tns: 0},
		's': {syl: -1, con: 1, son: -1, cnt: 1, dr: 1, app: -1, tap: -1, trill: -1, nas: -1, voi: -1, sg: -1, cg: -1, lab: -1, rou: -1, ld: -1, cor: 1, ant: 1, dst: -1, str: 1, lat: -1, dor: -1, hi: 0, lo: 0, ft: 0, bk: 0, tns: 0},
		'z': {syl: -1, con: 1, son: -1, cnt: 1, dr: 1, app: -1, tap: -1, trill: -1, nas: -1, voi: 1, sg: -1, cg: -1, lab: -1, rou: -1, ld: -1, cor: 1, ant: 1, dst: -1, str: 1, lat: -1, dor: -1, hi: 0, lo: 0, ft: 0, bk: 0, tns: 0},
		'ʃ': {syl: -1, con: 1, son: -1, cnt: 1, dr: 1, app: -1, tap: -1, trill: -1, nas: -1, voi: -1, sg: -1, cg: -1, lab: -1, rou: -1, ld: -1, cor: 1, ant: -1, dst: 1, str: 1, lat: -1, dor: -1, hi: 0, lo: 0, ft: 0, bk: 0, tns: 0},
		'ʒ': {syl: -1, con: 1, son: -1, cnt: 1, dr: 1, app: -1, tap: -1, trill: -1, nas: -1, voi: 1, sg: -1, cg: -1, lab: -1, rou: -1, ld: -1, cor: 1, ant: -1, dst: 1, str: 1, lat: -1, dor: -1, hi: 0, lo: 0, ft: 0, bk: 0, tns: 0},
		'ɹ': {syl: -1, con: -1, son: 1, cnt: 1, dr: 0, app: 1, tap: -1, trill: -1, nas: -1, voi: 1, sg: -1, cg: -1, lab: -1, rou: -1, ld: -1, cor: 1, ant: -1, dst: 1, str: -1, lat: -1, dor: -1, hi: 0, lo: 0, ft: 0, bk: 0, tns: 0},
		'r': {syl: -1, con: 1, son: 1, cnt: 1, dr: 0, app: 1, tap: -1, trill: 1, nas: -1, voi: 1, sg: -1, cg: -1, lab: -1, rou: -1, ld: -1, cor: 1, ant: 1, dst: -1, str: -1, lat: -1, dor: -1, hi: 0, lo: 0, ft: 0, bk: 0, tns: 0},
		'ɾ': {syl: -1, con: 1, son: 1, cnt: 1, dr: 0, app: 1, tap: 1, trill: -1, nas: -1, voi: 1, sg: -1, cg: -1, lab: -1, rou: -1, ld: -1, cor: 1, ant: 1, dst: -1, str: -1, lat: -1, dor: -1, hi: 0, lo: 0, ft: 0, bk: 0, tns: 0},
		'ɬ': {syl: -1, con: 1, son: -1, cnt: 1, dr: 1, app: -1, tap: -1, trill: -1, nas: -1, voi: -1, sg: -1, cg: -1, lab: -1, rou: -1, ld: -1, cor: 1, ant: 1, dst: -1, str: -1, lat: 1, dor: -1, hi: 0, lo: 0, ft: 0, bk: 0, tns: 0},
		'ɮ': {syl: -1, con: 1, son: -1, cnt: 1, dr: 1, app: -1, tap: -1, trill: -1, nas: -1, voi: 1, sg: -1, cg: -1, lab: -1, rou: -1, ld: -1, cor: 1, ant: 1, dst: -1, str: -1, lat: 1, dor: -1, hi: 0, lo: 0, ft: 0, bk: 0, tns: 0},
		'l': {syl: -1, con: 1, son: 1, cnt: 1, dr: 0, app: 1, tap: -1, trill: -1, nas: -1, voi: 1, sg: -1, cg: -1, lab: -1, rou: -1, ld: -1, cor: 1, ant: 1, dst: -1, str: -1, lat: 1, dor: -1, hi: 0, lo: 0, ft: 0, bk: 0, tns: 0},

//'l̺': {syl: -1, con: 1, son: 1, cnt: 1, dr: 0, app: 1, tap: -1, trill: -1, nas: -1, voi: 1, sg: -1, cg: -1, lab: -1, rou: -1, ld: -1, cor: 1, ant: 1, dst: -1, str: -1, lat: 1, dor: -1, hi: 0, lo: 0, ft: 0, bk: 0, tns: 0},
//'l̻ʲ': {syl: -1, con: 1, son: 1, cnt: 1, dr: 0, app: 1, tap: -1, trill: -1, nas: -1, voi: 1, sg: -1, cg: -1, lab: -1, rou: -1, ld: -1, cor: 1, ant: 1, dst: -1, str: -1, lat: 1, dor: -1, hi: 0, lo: 0, ft: 0, bk: 0, tns: 0},
//'l̺̝': {syl: -1, con: 1, son: 1, cnt: 1, dr: 0, app: 1, tap: -1, trill: -1, nas: -1, voi: 1, sg: -1, cg: -1, lab: -1, rou: -1, ld: -1, cor: 1, ant: 1, dst: -1, str: -1, lat: 1, dor: -1, hi: 0, lo: 0, ft: 0, bk: 0, tns: 0},
//'ʎ̞˞': {syl: -1, con: 1, son: 1, cnt: 1, dr: 0, app: 1, tap: -1, trill: -1, nas: -1, voi: 1, sg: -1, cg: -1, lab: -1, rou: -1, ld: -1, cor: 1, ant: 1, dst: -1, str: -1, lat: 1, dor: -1, hi: 0, lo: 0, ft: 0, bk: 0, tns: 0},
//'ʟ̟̞˞': {syl: -1, con: 1, son: 1, cnt: 1, dr: 0, app: 1, tap: -1, trill: -1, nas: -1, voi: 1, sg: -1, cg: -1, lab: -1, rou: -1, ld: -1, cor: 1, ant: 1, dst: -1, str: -1, lat: 1, dor: -1, hi: 0, lo: 0, ft: 0, bk: 0, tns: 0},

		'ɫ': {syl: -1, con: 1, son: 1, cnt: 1, dr: 0, app: 1, tap: -1, trill: -1, nas: -1, voi: 1, sg: -1, cg: -1, lab: -1, rou: -1, ld: -1, cor: 1, ant: 1, dst: -1, str: -1, lat: 1, dor: 1, hi: -1, lo: -1, ft: -1, bk: 1, tns: 0},
		'ɺ': {syl: -1, con: 1, son: 1, cnt: 1, dr: 0, app: 1, tap: 1, trill: -1, nas: -1, voi: 1, sg: -1, cg: -1, lab: -1, rou: -1, ld: -1, cor: 1, ant: 1, dst: -1, str: -1, lat: 1, dor: -1, hi: 0, lo: 0, ft: 0, bk: 0, tns: 0},
		'ɳ': {syl: -1, con: 1, son: 1, cnt: -1, dr: 0, app: -1, tap: -1, trill: -1, nas: 1, voi: 1, sg: -1, cg: -1, lab: -1, rou: -1, ld: -1, cor: 1, ant: -1, dst: -1, str: -1, lat: -1, dor: -1, hi: 0, lo: 0, ft: 0, bk: 0, tns: 0},
		'ʈ': {syl: -1, con: 1, son: -1, cnt: -1, dr: -1, app: -1, tap: -1, trill: -1, nas: -1, voi: -1, sg: -1, cg: -1, lab: -1, rou: -1, ld: -1, cor: 1, ant: -1, dst: -1, str: -1, lat: -1, dor: -1, hi: 0, lo: 0, ft: 0, bk: 0, tns: 0},
		'ɖ': {syl: -1, con: 1, son: -1, cnt: -1, dr: -1, app: -1, tap: -1, trill: -1, nas: -1, voi: 1, sg: -1, cg: -1, lab: -1, rou: -1, ld: -1, cor: 1, ant: -1, dst: -1, str: -1, lat: -1, dor: -1, hi: 0, lo: 0, ft: 0, bk: 0, tns: 0},
		'ʂ': {syl: -1, con: 1, son: -1, cnt: 1, dr: 1, app: -1, tap: -1, trill: -1, nas: -1, voi: -1, sg: -1, cg: -1, lab: -1, rou: -1, ld: -1, cor: 1, ant: -1, dst: -1, str: 1, lat: -1, dor: -1, hi: 0, lo: 0, ft: 0, bk: 0, tns: 0},
		'ʐ': {syl: -1, con: 1, son: -1, cnt: 1, dr: 1, app: -1, tap: -1, trill: -1, nas: -1, voi: 1, sg: -1, cg: -1, lab: -1, rou: -1, ld: -1, cor: 1, ant: -1, dst: -1, str: 1, lat: -1, dor: -1, hi: 0, lo: 0, ft: 0, bk: 0, tns: 0},
		'ɕ': {syl: -1, con: 1, son: -1, cnt: 1, dr: 1, app: -1, tap: -1, trill: -1, nas: -1, voi: -1, sg: -1, cg: -1, lab: -1, rou: -1, ld: -1, cor: 1, ant: 1, dst: 1, str: 1, lat: -1, dor: 1, hi: 1, lo: -1, ft: 1, bk: -1, tns: 0},
		'ʑ': {syl: -1, con: 1, son: -1, cnt: 1, dr: 1, app: -1, tap: -1, trill: -1, nas: -1, voi: 1, sg: -1, cg: -1, lab: -1, rou: -1, ld: -1, cor: 1, ant: 1, dst: 1, str: 1, lat: -1, dor: 1, hi: 1, lo: -1, ft: 1, bk: -1, tns: 0},
		'ɻ': {syl: -1, con: 1, son: 1, cnt: 1, dr: 0, app: 1, tap: -1, trill: -1, nas: -1, voi: 1, sg: -1, cg: -1, lab: -1, rou: -1, ld: -1, cor: 1, ant: -1, dst: -1, str: -1, lat: -1, dor: -1, hi: 0, lo: 0, ft: 0, bk: 0, tns: 0},
		'ɽ': {syl: -1, con: 1, son: 1, cnt: 1, dr: 0, app: 1, tap: 1, trill: -1, nas: -1, voi: 1, sg: -1, cg: -1, lab: -1, rou: -1, ld: -1, cor: 1, ant: -1, dst: -1, str: -1, lat: -1, dor: -1, hi: 0, lo: 0, ft: 0, bk: 0, tns: 0},
		'ɭ': {syl: -1, con: 1, son: 1, cnt: 1, dr: 0, app: 1, tap: -1, trill: -1, nas: -1, voi: 1, sg: -1, cg: -1, lab: -1, rou: -1, ld: -1, cor: 1, ant: -1, dst: -1, str: -1, lat: 1, dor: -1, hi: 0, lo: 0, ft: 0, bk: 0, tns: 0},
		'ɲ': {syl: -1, con: 1, son: 1, cnt: -1, dr: 0, app: -1, tap: -1, trill: -1, nas: 1, voi: 1, sg: -1, cg: -1, lab: -1, rou: -1, ld: -1, cor: 1, ant: -1, dst: 1, str: -1, lat: -1, dor: 1, hi: 1, lo: -1, ft: 1, bk: -1, tns: 0},
		'c': {syl: -1, con: 1, son: -1, cnt: -1, dr: -1, app: -1, tap: -1, trill: -1, nas: -1, voi: -1, sg: -1, cg: -1, lab: -1, rou: -1, ld: -1, cor: 1, ant: -1, dst: 1, str: -1, lat: -1, dor: 1, hi: 1, lo: -1, ft: 1, bk: -1, tns: 0},
		'ɟ': {syl: -1, con: 1, son: -1, cnt: -1, dr: -1, app: -1, tap: -1, trill: -1, nas: -1, voi: 1, sg: -1, cg: -1, lab: -1, rou: -1, ld: -1, cor: 1, ant: -1, dst: 1, str: -1, lat: -1, dor: 1, hi: 1, lo: -1, ft: 1, bk: -1, tns: 0},
		'ç': {syl: -1, con: 1, son: -1, cnt: 1, dr: 1, app: -1, tap: -1, trill: -1, nas: -1, voi: -1, sg: -1, cg: -1, lab: -1, rou: -1, ld: -1, cor: 1, ant: -1, dst: 1, str: -1, lat: -1, dor: 1, hi: 1, lo: -1, ft: 1, bk: -1, tns: 0},
		'ʝ': {syl: -1, con: 1, son: -1, cnt: 1, dr: 1, app: -1, tap: -1, trill: -1, nas: -1, voi: 1, sg: -1, cg: -1, lab: -1, rou: -1, ld: -1, cor: 1, ant: -1, dst: 1, str: -1, lat: -1, dor: 1, hi: 1, lo: -1, ft: 1, bk: -1, tns: 0},
		'j': {syl: -1, con: -1, son: 1, cnt: 1, dr: 0, app: 1, tap: -1, trill: -1, nas: -1, voi: 1, sg: -1, cg: -1, lab: -1, rou: -1, ld: -1, cor: -1, ant: 0, dst: 0, str: 0, lat: -1, dor: 1, hi: 1, lo: -1, ft: 1, bk: -1, tns: 1},
		'ʎ': {syl: -1, con: 1, son: 1, cnt: 1, dr: 0, app: 1, tap: -1, trill: -1, nas: -1, voi: 1, sg: -1, cg: -1, lab: -1, rou: -1, ld: -1, cor: 1, ant: -1, dst: 1, str: -1, lat: 1, dor: 1, hi: 1, lo: -1, ft: 1, bk: -1, tns: 0},
		'ŋ': {syl: -1, con: 1, son: 1, cnt: -1, dr: 0, app: -1, tap: -1, trill: -1, nas: 1, voi: 1, sg: -1, cg: -1, lab: -1, rou: -1, ld: -1, cor: -1, ant: 0, dst: 0, str: 0, lat: -1, dor: 1, hi: 1, lo: -1, ft: 0, bk: 0, tns: 0},
		'k': {syl: -1, con: 1, son: -1, cnt: -1, dr: -1, app: -1, tap: -1, trill: -1, nas: -1, voi: -1, sg: -1, cg: -1, lab: -1, rou: -1, ld: -1, cor: -1, ant: 0, dst: 0, str: 0, lat: -1, dor: 1, hi: 1, lo: -1, ft: 0, bk: 0, tns: 0},
		'ɡ': {syl: -1, con: 1, son: -1, cnt: -1, dr: -1, app: -1, tap: -1, trill: -1, nas: -1, voi: 1, sg: -1, cg: -1, lab: -1, rou: -1, ld: -1, cor: -1, ant: 0, dst: 0, str: 0, lat: -1, dor: 1, hi: 1, lo: -1, ft: 0, bk: 0, tns: 0},
		'x': {syl: -1, con: 1, son: -1, cnt: 1, dr: 1, app: -1, tap: -1, trill: -1, nas: -1, voi: -1, sg: -1, cg: -1, lab: -1, rou: -1, ld: -1, cor: -1, ant: 0, dst: 0, str: 0, lat: -1, dor: 1, hi: 1, lo: -1, ft: 0, bk: 0, tns: 0},
		'ɣ': {syl: -1, con: 1, son: -1, cnt: 1, dr: 1, app: -1, tap: -1, trill: -1, nas: -1, voi: 1, sg: -1, cg: -1, lab: -1, rou: -1, ld: -1, cor: -1, ant: 0, dst: 0, str: 0, lat: -1, dor: 1, hi: 1, lo: -1, ft: 0, bk: 0, tns: 0},
		'ɰ': {syl: -1, con: -1, son: 1, cnt: 1, dr: 0, app: 1, tap: -1, trill: -1, nas: -1, voi: 1, sg: -1, cg: -1, lab: -1, rou: -1, ld: -1, cor: -1, ant: 0, dst: 0, str: 0, lat: -1, dor: 1, hi: 1, lo: -1, ft: 0, bk: 0, tns: 1},
		'ʟ': {syl: -1, con: 1, son: 1, cnt: 1, dr: 0, app: 1, tap: -1, trill: -1, nas: -1, voi: 1, sg: -1, cg: -1, lab: -1, rou: -1, ld: -1, cor: -1, ant: 0, dst: 0, str: 0, lat: 1, dor: 1, hi: 1, lo: -1, ft: 0, bk: 0, tns: 0},
		'ɴ': {syl: -1, con: 1, son: 1, cnt: -1, dr: 0, app: -1, tap: -1, trill: -1, nas: 1, voi: 1, sg: -1, cg: -1, lab: -1, rou: -1, ld: -1, cor: -1, ant: 0, dst: 0, str: 0, lat: -1, dor: 1, hi: -1, lo: -1, ft: -1, bk: 1, tns: 0},
		'q': {syl: -1, con: 1, son: -1, cnt: -1, dr: -1, app: -1, tap: -1, trill: -1, nas: -1, voi: -1, sg: -1, cg: -1, lab: -1, rou: -1, ld: -1, cor: -1, ant: 0, dst: 0, str: 0, lat: -1, dor: 1, hi: -1, lo: -1, ft: -1, bk: 1, tns: 0},
		'ɢ': {syl: -1, con: 1, son: -1, cnt: -1, dr: -1, app: -1, tap: -1, trill: -1, nas: -1, voi: 1, sg: -1, cg: -1, lab: -1, rou: -1, ld: -1, cor: -1, ant: 0, dst: 0, str: 0, lat: -1, dor: 1, hi: -1, lo: -1, ft: -1, bk: 1, tns: 0},
		'χ': {syl: -1, con: 1, son: -1, cnt: 1, dr: 1, app: -1, tap: -1, trill: -1, nas: -1, voi: -1, sg: -1, cg: -1, lab: -1, rou: -1, ld: -1, cor: -1, ant: 0, dst: 0, str: 0, lat: -1, dor: 1, hi: -1, lo: -1, ft: -1, bk: 1, tns: 0},
		'ʁ': {syl: -1, con: 1, son: -1, cnt: 1, dr: 1, app: -1, tap: -1, trill: -1, nas: -1, voi: 1, sg: -1, cg: -1, lab: -1, rou: -1, ld: -1, cor: -1, ant: 0, dst: 0, str: 0, lat: -1, dor: 1, hi: -1, lo: -1, ft: -1, bk: 1, tns: 0},
		'ʀ': {syl: -1, con: 1, son: 1, cnt: 1, dr: 0, app: 1, tap: -1, trill: 1, nas: -1, voi: 1, sg: -1, cg: -1, lab: -1, rou: -1, ld: -1, cor: -1, ant: 0, dst: 0, str: 0, lat: -1, dor: 1, hi: -1, lo: -1, ft: -1, bk: 1, tns: 0},
		'ħ': {syl: -1, con: 1, son: -1, cnt: 1, dr: 1, app: -1, tap: -1, trill: -1, nas: -1, voi: -1, sg: -1, cg: -1, lab: -1, rou: -1, ld: -1, cor: -1, ant: 0, dst: 0, str: 0, lat: -1, dor: 1, hi: -1, lo: 1, ft: -1, bk: 1, tns: 0},
		'ʕ': {syl: -1, con: 1, son: -1, cnt: 1, dr: 1, app: -1, tap: -1, trill: -1, nas: -1, voi: 1, sg: -1, cg: -1, lab: -1, rou: -1, ld: -1, cor: -1, ant: 0, dst: 0, str: 0, lat: -1, dor: 1, hi: -1, lo: 1, ft: -1, bk: 1, tns: 0},
		'ʔ': {syl: -1, con: 1, son: -1, cnt: -1, dr: -1, app: -1, tap: -1, trill: -1, nas: -1, voi: -1, sg: -1, cg: 1, lab: -1, rou: -1, ld: -1, cor: -1, ant: 0, dst: 0, str: 0, lat: -1, dor: -1, hi: 0, lo: 0, ft: 0, bk: 0, tns: 0},
		'h': {syl: -1, con: -1, son: -1, cnt: 1, dr: 1, app: -1, tap: -1, trill: -1, nas: -1, voi: -1, sg: 1, cg: -1, lab: -1, rou: -1, ld: -1, cor: -1, ant: 0, dst: 0, str: 0, lat: -1, dor: -1, hi: 0, lo: 0, ft: 0, bk: 0, tns: 0},
		'ɦ': {syl: -1, con: -1, son: -1, cnt: 1, dr: 1, app: -1, tap: -1, trill: -1, nas: -1, voi: 1, sg: 1, cg: -1, lab: -1, rou: -1, ld: -1, cor: -1, ant: 0, dst: 0, str: 0, lat: -1, dor: -1, hi: 0, lo: 0, ft: 0, bk: 0, tns: 0},
		'k̟͡x̟': {syl: -1, con: 1, son: -1, cnt: -1, dr: 1, app: -1, tap: -1, trill: -1, nas: -1, voi: -1, sg: -1, cg: -1, lab: -1, rou: -1, ld: -1, cor: -1, ant: 0, dst: 0, str: 0, lat: -1, dor: 1, hi: 1, lo: -1, ft: 1, bk: -1, tns: 0},
		'ɡ̟͡ɣ̟': {syl: -1, con: 1, son: -1, cnt: -1, dr: 1, app: -1, tap: -1, trill: -1, nas: -1, voi: 1, sg: -1, cg: -1, lab: -1, rou: -1, ld: -1, cor: -1, ant: 0, dst: 0, str: 0, lat: -1, dor: 1, hi: 1, lo: -1, ft: 1, bk: -1, tns: 0},
		'd͡ʑ': {syl: -1, con: 1, son: -1, cnt: -1, dr: 1, app: -1, tap: -1, trill: -1, nas: -1, voi: 1, sg: -1, cg: -1, lab: -1, rou: -1, ld: -1, cor: 1, ant: 1, dst: 1, str: 1, lat: -1, dor: 1, hi: 1, lo: -1, ft: 1, bk: -1, tns: 0},
		't͡ɕ': {syl: -1, con: 1, son: -1, cnt: -1, dr: 1, app: -1, tap: -1, trill: -1, nas: -1, voi: -1, sg: -1, cg: -1, lab: -1, rou: -1, ld: -1, cor: 1, ant: 1, dst: 1, str: 1, lat: -1, dor: 1, hi: 1, lo: -1, ft: 1, bk: -1, tns: 0},
		'd͡ʒ': {syl: -1, con: 1, son: -1, cnt: -1, dr: 1, app: -1, tap: -1, trill: -1, nas: -1, voi: 1, sg: -1, cg: -1, lab: -1, rou: -1, ld: -1, cor: 1, ant: -1, dst: 1, str: 1, lat: -1, dor: -1, hi: 0, lo: 0, ft: 0, bk: 0, tns: 0},
		'd͡z': {syl: -1, con: 1, son: -1, cnt: -1, dr: 1, app: -1, tap: -1, trill: -1, nas: -1, voi: 1, sg: -1, cg: -1, lab: -1, rou: -1, ld: -1, cor: 1, ant: 1, dst: -1, str: 1, lat: -1, dor: -1, hi: 0, lo: 0, ft: 0, bk: 0, tns: 0},
		'd͡ɮ': {syl: -1, con: 1, son: -1, cnt: -1, dr: 1, app: -1, tap: -1, trill: -1, nas: -1, voi: 1, sg: -1, cg: -1, lab: -1, rou: -1, ld: -1, cor: 1, ant: 1, dst: -1, str: -1, lat: 1, dor: -1, hi: 0, lo: 0, ft: 0, bk: 0, tns: 0},
		'd̠͡ɮ̠': {syl: -1, con: 1, son: -1, cnt: -1, dr: 1, app: -1, tap: -1, trill: -1, nas: -1, voi: 1, sg: -1, cg: -1, lab: -1, rou: -1, ld: -1, cor: 1, ant: -1, dst: 1, str: -1, lat: 1, dor: -1, hi: 0, lo: 0, ft: 0, bk: 0, tns: 0},
		't͡ʃ': {syl: -1, con: 1, son: -1, cnt: -1, dr: 1, app: -1, tap: -1, trill: -1, nas: -1, voi: -1, sg: -1, cg: -1, lab: -1, rou: -1, ld: -1, cor: 1, ant: -1, dst: 1, str: 1, lat: -1, dor: -1, hi: 0, lo: 0, ft: 0, bk: 0, tns: 0},
		't͡ɬ̲': {syl: -1, con: 1, son: -1, cnt: -1, dr: 1, app: -1, tap: -1, trill: -1, nas: -1, voi: -1, sg: -1, cg: -1, lab: -1, rou: -1, ld: -1, cor: 1, ant: -1, dst: 1, str: -1, lat: 1, dor: -1, hi: 0, lo: 0, ft: 0, bk: 0, tns: 0},
		't͡s': {syl: -1, con: 1, son: -1, cnt: -1, dr: 1, app: -1, tap: -1, trill: -1, nas: -1, voi: -1, sg: -1, cg: -1, lab: -1, rou: -1, ld: -1, cor: 1, ant: 1, dst: -1, str: 1, lat: -1, dor: -1, hi: 0, lo: 0, ft: 0, bk: 0, tns: 0},
		't͡ɬ': {syl: -1, con: 1, son: -1, cnt: -1, dr: 1, app: -1, tap: -1, trill: -1, nas: -1, voi: -1, sg: -1, cg: -1, lab: -1, rou: -1, ld: -1, cor: 1, ant: 1, dst: -1, str: -1, lat: 1, dor: -1, hi: 0, lo: 0, ft: 0, bk: 0, tns: 0},
		't̪͡s̪': {syl: -1, con: 1, son: -1, cnt: -1, dr: 1, app: -1, tap: -1, trill: -1, nas: -1, voi: -1, sg: -1, cg: -1, lab: -1, rou: -1, ld: -1, cor: 1, ant: 1, dst: 1, str: 1, lat: -1, dor: -1, hi: 0, lo: 0, ft: 0, bk: 0, tns: 0},
		't̪͡ɬ̪': {syl: -1, con: 1, son: -1, cnt: -1, dr: 1, app: -1, tap: -1, trill: -1, nas: -1, voi: -1, sg: -1, cg: -1, lab: -1, rou: -1, ld: -1, cor: 1, ant: 1, dst: 1, str: -1, lat: 1, dor: -1, hi: 0, lo: 0, ft: 0, bk: 0, tns: 0},
		'd̪͡z̪': {syl: -1, con: 1, son: -1, cnt: -1, dr: 1, app: -1, tap: -1, trill: -1, nas: -1, voi: 1, sg: -1, cg: -1, lab: -1, rou: -1, ld: -1, cor: 1, ant: 1, dst: 1, str: 1, lat: -1, dor: -1, hi: 0, lo: 0, ft: 0, bk: 0, tns: 0},
		'd̪͡ɮ̪': {syl: -1, con: 1, son: -1, cnt: -1, dr: 1, app: -1, tap: -1, trill: -1, nas: -1, voi: 1, sg: -1, cg: -1, lab: -1, rou: -1, ld: -1, cor: 1, ant: 1, dst: 1, str: -1, lat: 1, dor: -1, hi: 0, lo: 0, ft: 0, bk: 0, tns: 0},
		'ʈ͡ʂ': {syl: -1, con: 1, son: -1, cnt: -1, dr: 1, app: -1, tap: -1, trill: -1, nas: -1, voi: -1, sg: -1, cg: -1, lab: -1, rou: -1, ld: -1, cor: 1, ant: -1, dst: -1, str: 1, lat: -1, dor: -1, hi: 0, lo: 0, ft: 0, bk: 0, tns: 0},
		'ɖ͡ʐ': {syl: -1, con: 1, son: -1, cnt: -1, dr: 1, app: -1, tap: -1, trill: -1, nas: -1, voi: 1, sg: -1, cg: -1, lab: -1, rou: -1, ld: -1, cor: 1, ant: -1, dst: -1, str: 1, lat: -1, dor: -1, hi: 0, lo: 0, ft: 0, bk: 0, tns: 0},
		'p͡f': {syl: -1, con: 1, son: -1, cnt: -1, dr: 1, app: -1, tap: -1, trill: -1, nas: -1, voi: -1, sg: -1, cg: -1, lab: 1, rou: -1, ld: 1, cor: -1, ant: 0, dst: 0, str: 0, lat: -1, dor: -1, hi: 0, lo: 0, ft: 0, bk: 0, tns: 0},
		'b͡v': {syl: -1, con: 1, son: -1, cnt: -1, dr: 1, app: -1, tap: -1, trill: -1, nas: -1, voi: 1, sg: -1, cg: -1, lab: 1, rou: -1, ld: 1, cor: -1, ant: 0, dst: 0, str: 0, lat: -1, dor: -1, hi: 0, lo: 0, ft: 0, bk: 0, tns: 0},
		'p͡ɸ': {syl: -1, con: 1, son: -1, cnt: -1, dr: 1, app: -1, tap: -1, trill: -1, nas: -1, voi: -1, sg: -1, cg: -1, lab: 1, rou: -1, ld: -1, cor: -1, ant: 0, dst: 0, str: 0, lat: -1, dor: -1, hi: 0, lo: 0, ft: 0, bk: 0, tns: 0},
		'b͡β': {syl: -1, con: 1, son: -1, cnt: -1, dr: 1, app: -1, tap: -1, trill: -1, nas: -1, voi: 1, sg: -1, cg: -1, lab: 1, rou: -1, ld: -1, cor: -1, ant: 0, dst: 0, str: 0, lat: -1, dor: -1, hi: 0, lo: 0, ft: 0, bk: 0, tns: 0},
		't̪͡θ': {syl: -1, con: 1, son: -1, cnt: -1, dr: 1, app: -1, tap: -1, trill: -1, nas: -1, voi: -1, sg: -1, cg: -1, lab: -1, rou: -1, ld: -1, cor: 1, ant: 1, dst: 1, str: -1, lat: -1, dor: -1, hi: 0, lo: 0, ft: 0, bk: 0, tns: 0},
		'd̪͡ð': {syl: -1, con: 1, son: -1, cnt: -1, dr: 1, app: -1, tap: -1, trill: -1, nas: -1, voi: 1, sg: -1, cg: -1, lab: -1, rou: -1, ld: -1, cor: 1, ant: 1, dst: 1, str: -1, lat: -1, dor: -1, hi: 0, lo: 0, ft: 0, bk: 0, tns: 0},
		'c͡ç': {syl: -1, con: 1, son: -1, cnt: -1, dr: 1, app: -1, tap: -1, trill: -1, nas: -1, voi: -1, sg: -1, cg: -1, lab: -1, rou: -1, ld: -1, cor: 1, ant: -1, dst: 1, str: -1, lat: -1, dor: 1, hi: 1, lo: -1, ft: 1, bk: -1, tns: 0},
		'ɟ͡ʝ': {syl: -1, con: 1, son: -1, cnt: -1, dr: 1, app: -1, tap: -1, trill: -1, nas: -1, voi: 1, sg: -1, cg: -1, lab: -1, rou: -1, ld: -1, cor: 1, ant: -1, dst: 1, str: -1, lat: -1, dor: 1, hi: 1, lo: -1, ft: 1, bk: -1, tns: 0},
		'k͡x': {syl: -1, con: 1, son: -1, cnt: -1, dr: 1, app: -1, tap: -1, trill: -1, nas: -1, voi: -1, sg: -1, cg: -1, lab: -1, rou: -1, ld: -1, cor: -1, ant: 0, dst: 0, str: 0, lat: -1, dor: 1, hi: 1, lo: -1, ft: 0, bk: 0, tns: 0},
		'k̠͡x̠': {syl: -1, con: 1, son: -1, cnt: -1, dr: 1, app: -1, tap: -1, trill: -1, nas: -1, voi: -1, sg: -1, cg: -1, lab: -1, rou: -1, ld: -1, cor: -1, ant: 0, dst: 0, str: 0, lat: -1, dor: 1, hi: 1, lo: -1, ft: -1, bk: 1, tns: 0},
		'ɡ͡ɣ': {syl: -1, con: 1, son: -1, cnt: -1, dr: 1, app: -1, tap: -1, trill: -1, nas: -1, voi: 1, sg: -1, cg: -1, lab: -1, rou: -1, ld: -1, cor: -1, ant: 0, dst: 0, str: 0, lat: -1, dor: 1, hi: 1, lo: -1, ft: 0, bk: 0, tns: 0},
		'ɡ̠͡ɣ̠': {syl: -1, con: 1, son: -1, cnt: -1, dr: 1, app: -1, tap: -1, trill: -1, nas: -1, voi: 1, sg: -1, cg: -1, lab: -1, rou: -1, ld: -1, cor: -1, ant: 0, dst: 0, str: 0, lat: -1, dor: 1, hi: 1, lo: -1, ft: -1, bk: 1, tns: 0},
		'q͡χ': {syl: -1, con: 1, son: -1, cnt: -1, dr: 1, app: -1, tap: -1, trill: -1, nas: -1, voi: -1, sg: -1, cg: -1, lab: -1, rou: -1, ld: -1, cor: -1, ant: 0, dst: 0, str: 0, lat: -1, dor: 1, hi: -1, lo: -1, ft: -1, bk: 1, tns: 0},
		'ɢ͡ʁ': {syl: -1, con: 1, son: -1, cnt: -1, dr: 1, app: -1, tap: -1, trill: -1, nas: -1, voi: 1, sg: -1, cg: -1, lab: -1, rou: -1, ld: -1, cor: -1, ant: 0, dst: 0, str: 0, lat: -1, dor: 1, hi: -1, lo: -1, ft: -1, bk: 1, tns: 0},
		'ɧ': {syl: -1, con: 1, son: -1, cnt: 1, dr: 1, app: -1, tap: -1, trill: -1, nas: -1, voi: -1, sg: -1, cg: -1, lab: -1, rou: -1, ld: -1, cor: 1, ant: -1, dst: 1, str: 1, lat: -1, dor: 1, hi: 1, lo: -1, ft: 0, bk: 0, tns: 0},
		'k͡p': {syl: -1, con: 1, son: -1, cnt: -1, dr: -1, app: -1, tap: -1, trill: -1, nas: -1, voi: -1, sg: -1, cg: -1, lab: 1, rou: -1, ld: -1, cor: -1, ant: 0, dst: 0, str: 0, lat: -1, dor: 1, hi: 1, lo: -1, ft: 0, bk: 0, tns: 0},
		'ɡ͡b': {syl: -1, con: 1, son: -1, cnt: -1, dr: -1, app: -1, tap: -1, trill: -1, nas: -1, voi: 1, sg: -1, cg: -1, lab: 1, rou: -1, ld: -1, cor: -1, ant: 0, dst: 0, str: 0, lat: -1, dor: 1, hi: 1, lo: -1, ft: 0, bk: 0, tns: 0},
		'p͡t': {syl: -1, con: 1, son: -1, cnt: -1, dr: -1, app: -1, tap: -1, trill: -1, nas: -1, voi: -1, sg: -1, cg: -1, lab: 1, rou: -1, ld: -1, cor: 1, ant: 1, dst: -1, str: 1, lat: -1, dor: -1, hi: 0, lo: 0, ft: 0, bk: 0, tns: 0},
		'b͡d': {syl: -1, con: 1, son: -1, cnt: -1, dr: -1, app: -1, tap: -1, trill: -1, nas: -1, voi: 1, sg: -1, cg: -1, lab: 1, rou: -1, ld: -1, cor: 1, ant: 1, dst: -1, str: 1, lat: -1, dor: -1, hi: 0, lo: 0, ft: 0, bk: 0, tns: 0},
		'ɰ̠': {syl: -1, con: -1, son: 1, cnt: 1, dr: 0, app: 1, tap: -1, trill: -1, nas: -1, voi: 1, sg: -1, cg: -1, lab: -1, rou: -1, ld: -1, cor: -1, ant: 0, dst: 0, str: 0, lat: -1, dor: 1, hi: 1, lo: -1, ft: -1, bk: 1, tns: 1},
		'w': {syl: -1, con: -1, son: 1, cnt: 1, dr: 0, app: 1, tap: -1, trill: -1, nas: -1, voi: 1, sg: -1, cg: -1, lab: 1, rou: 1, ld: -1, cor: -1, ant: 0, dst: 0, str: 0, lat: -1, dor: 1, hi: 1, lo: -1, ft: -1, bk: 1, tns: 1},
		'ɥ': {syl: -1, con: -1, son: 1, cnt: 1, dr: 0, app: 1, tap: -1, trill: -1, nas: -1, voi: 1, sg: -1, cg: -1, lab: 1, rou: 1, ld: -1, cor: -1, ant: 0, dst: 0, str: 0, lat: -1, dor: 1, hi: 1, lo: -1, ft: 1, bk: -1, tns: 1},
		'ʍ': {syl: -1, con: -1, son: -1, cnt: 1, dr: 1, app: -1, tap: -1, trill: -1, nas: -1, voi: -1, sg: 1, cg: -1, lab: 1, rou: 1, ld: -1, cor: -1, ant: 0, dst: 0, str: 0, lat: -1, dor: 1, hi: 1, lo: -1, ft: -1, bk: 1, tns: 1},
		'i': {syl: 1, con: -1, son: 1, cnt: 1, dr: 0, app: 1, tap: -1, trill: -1, nas: -1, voi: 1, sg: -1, cg: -1, lab: -1, rou: -1, ld: -1, cor: -1, ant: 0, dst: 0, str: 0, lat: -1, dor: 1, hi: 1, lo: -1, ft: 1, bk: -1, tns: 1},
		'y': {syl: 1, con: -1, son: 1, cnt: 1, dr: 0, app: 1, tap: -1, trill: -1, nas: -1, voi: 1, sg: -1, cg: -1, lab: 1, rou: 1, ld: -1, cor: -1, ant: 0, dst: 0, str: 0, lat: -1, dor: 1, hi: 1, lo: -1, ft: 1, bk: -1, tns: 1},
		'ɨ': {syl: 1, con: -1, son: 1, cnt: 1, dr: 0, app: 1, tap: -1, trill: -1, nas: -1, voi: 1, sg: -1, cg: -1, lab: -1, rou: -1, ld: -1, cor: -1, ant: 0, dst: 0, str: 0, lat: -1, dor: 1, hi: 1, lo: -1, ft: -1, bk: -1, tns: 1},
		'ʉ': {syl: 1, con: -1, son: 1, cnt: 1, dr: 0, app: 1, tap: -1, trill: -1, nas: -1, voi: 1, sg: -1, cg: -1, lab: 1, rou: 1, ld: -1, cor: -1, ant: 0, dst: 0, str: 0, lat: -1, dor: 1, hi: 1, lo: -1, ft: -1, bk: -1, tns: 1},
		'ɯ': {syl: 1, con: -1, son: 1, cnt: 1, dr: 0, app: 1, tap: -1, trill: -1, nas: -1, voi: 1, sg: -1, cg: -1, lab: -1, rou: -1, ld: -1, cor: -1, ant: 0, dst: 0, str: 0, lat: -1, dor: 1, hi: 1, lo: -1, ft: -1, bk: 1, tns: 1},
		'u': {syl: 1, con: -1, son: 1, cnt: 1, dr: 0, app: 1, tap: -1, trill: -1, nas: -1, voi: 1, sg: -1, cg: -1, lab: 1, rou: 1, ld: -1, cor: -1, ant: 0, dst: 0, str: 0, lat: -1, dor: 1, hi: 1, lo: -1, ft: -1, bk: 1, tns: 1},
		'ɪ': {syl: 1, con: -1, son: 1, cnt: 1, dr: 0, app: 1, tap: -1, trill: -1, nas: -1, voi: 1, sg: -1, cg: -1, lab: -1, rou: -1, ld: -1, cor: -1, ant: 0, dst: 0, str: 0, lat: -1, dor: 1, hi: 1, lo: -1, ft: 1, bk: -1, tns: -1},
		'ʏ': {syl: 1, con: -1, son: 1, cnt: 1, dr: 0, app: 1, tap: -1, trill: -1, nas: -1, voi: 1, sg: -1, cg: -1, lab: 1, rou: 1, ld: -1, cor: -1, ant: 0, dst: 0, str: 0, lat: -1, dor: 1, hi: 1, lo: -1, ft: 1, bk: -1, tns: -1},
		'ʊ': {syl: 1, con: -1, son: 1, cnt: 1, dr: 0, app: 1, tap: -1, trill: -1, nas: -1, voi: 1, sg: -1, cg: -1, lab: 1, rou: 1, ld: -1, cor: -1, ant: 0, dst: 0, str: 0, lat: -1, dor: 1, hi: 1, lo: -1, ft: -1, bk: 1, tns: -1},
		'e': {syl: 1, con: -1, son: 1, cnt: 1, dr: 0, app: 1, tap: -1, trill: -1, nas: -1, voi: 1, sg: -1, cg: -1, lab: -1, rou: -1, ld: -1, cor: -1, ant: 0, dst: 0, str: 0, lat: -1, dor: 1, hi: -1, lo: -1, ft: 1, bk: -1, tns: 1},
		'ø': {syl: 1, con: -1, son: 1, cnt: 1, dr: 0, app: 1, tap: -1, trill: -1, nas: -1, voi: 1, sg: -1, cg: -1, lab: 1, rou: 1, ld: -1, cor: -1, ant: 0, dst: 0, str: 0, lat: -1, dor: 1, hi: -1, lo: -1, ft: 1, bk: -1, tns: 1},
		'ɘ': {syl: 1, con: -1, son: 1, cnt: 1, dr: 0, app: 1, tap: -1, trill: -1, nas: -1, voi: 1, sg: -1, cg: -1, lab: -1, rou: -1, ld: -1, cor: -1, ant: 0, dst: 0, str: 0, lat: -1, dor: 1, hi: -1, lo: -1, ft: -1, bk: -1, tns: 1},
		'ɵ': {syl: 1, con: -1, son: 1, cnt: 1, dr: 0, app: 1, tap: -1, trill: -1, nas: -1, voi: 1, sg: -1, cg: -1, lab: 1, rou: 1, ld: -1, cor: -1, ant: 0, dst: 0, str: 0, lat: -1, dor: 1, hi: -1, lo: -1, ft: -1, bk: -1, tns: 1},
		'ɤ': {syl: 1, con: -1, son: 1, cnt: 1, dr: 0, app: 1, tap: -1, trill: -1, nas: -1, voi: 1, sg: -1, cg: -1, lab: -1, rou: -1, ld: -1, cor: -1, ant: 0, dst: 0, str: 0, lat: -1, dor: 1, hi: -1, lo: -1, ft: -1, bk: 1, tns: 1},
		'o': {syl: 1, con: -1, son: 1, cnt: 1, dr: 0, app: 1, tap: -1, trill: -1, nas: -1, voi: 1, sg: -1, cg: -1, lab: 1, rou: 1, ld: -1, cor: -1, ant: 0, dst: 0, str: 0, lat: -1, dor: 1, hi: -1, lo: -1, ft: -1, bk: 1, tns: 1},
		'ə': {syl: 1, con: -1, son: 1, cnt: 1, dr: 0, app: 1, tap: -1, trill: -1, nas: -1, voi: 1, sg: -1, cg: -1, lab: -1, rou: -1, ld: -1, cor: -1, ant: 0, dst: 0, str: 0, lat: -1, dor: 1, hi: -1, lo: -1, ft: -1, bk: -1, tns: -1},
		'ɛ': {syl: 1, con: -1, son: 1, cnt: 1, dr: 0, app: 1, tap: -1, trill: -1, nas: -1, voi: 1, sg: -1, cg: -1, lab: -1, rou: -1, ld: -1, cor: -1, ant: 0, dst: 0, str: 0, lat: -1, dor: 1, hi: -1, lo: -1, ft: 1, bk: -1, tns: -1},
		'œ': {syl: 1, con: -1, son: 1, cnt: 1, dr: 0, app: 1, tap: -1, trill: -1, nas: -1, voi: 1, sg: -1, cg: -1, lab: 1, rou: 1, ld: -1, cor: -1, ant: 0, dst: 0, str: 0, lat: -1, dor: 1, hi: -1, lo: -1, ft: 1, bk: -1, tns: -1},
		'ɞ': {syl: 1, con: -1, son: 1, cnt: 1, dr: 0, app: 1, tap: -1, trill: -1, nas: -1, voi: 1, sg: -1, cg: -1, lab: 1, rou: 1, ld: -1, cor: -1, ant: 0, dst: 0, str: 0, lat: -1, dor: 1, hi: -1, lo: -1, ft: -1, bk: -1, tns: -1},
		'ʌ': {syl: 1, con: -1, son: 1, cnt: 1, dr: 0, app: 1, tap: -1, trill: -1, nas: -1, voi: 1, sg: -1, cg: -1, lab: -1, rou: -1, ld: -1, cor: -1, ant: 0, dst: 0, str: 0, lat: -1, dor: 1, hi: -1, lo: -1, ft: -1, bk: 1, tns: -1},
		'ɔ': {syl: 1, con: -1, son: 1, cnt: 1, dr: 0, app: 1, tap: -1, trill: -1, nas: -1, voi: 1, sg: -1, cg: -1, lab: 1, rou: 1, ld: -1, cor: -1, ant: 0, dst: 0, str: 0, lat: -1, dor: 1, hi: -1, lo: -1, ft: -1, bk: 1, tns: -1},
		'ӕ': {syl: 1, con: -1, son: 1, cnt: 1, dr: 0, app: 1, tap: -1, trill: -1, nas: -1, voi: 1, sg: -1, cg: -1, lab: -1, rou: -1, ld: -1, cor: -1, ant: 0, dst: 0, str: 0, lat: -1, dor: 1, hi: -1, lo: 1, ft: 1, bk: -1, tns: 0},
		'a': {syl: 1, con: -1, son: 1, cnt: 1, dr: 0, app: 1, tap: -1, trill: -1, nas: -1, voi: 1, sg: -1, cg: -1, lab: -1, rou: -1, ld: -1, cor: -1, ant: 0, dst: 0, str: 0, lat: -1, dor: 1, hi: -1, lo: 1, ft: -1, bk: -1, tns: 0},
		'ɶ': {syl: 1, con: -1, son: 1, cnt: 1, dr: 0, app: 1, tap: -1, trill: -1, nas: -1, voi: 1, sg: -1, cg: -1, lab: 1, rou: 1, ld: -1, cor: -1, ant: 0, dst: 0, str: 0, lat: -1, dor: 1, hi: -1, lo: 1, ft: 1, bk: -1, tns: 0},
		'ɑ': {syl: 1, con: -1, son: 1, cnt: 1, dr: 0, app: 1, tap: -1, trill: -1, nas: -1, voi: 1, sg: -1, cg: -1, lab: -1, rou: -1, ld: -1, cor: -1, ant: 0, dst: 0, str: 0, lat: -1, dor: 1, hi: -1, lo: 1, ft: -1, bk: 1, tns: 0},
		'ɒ': {syl: 1, con: -1, son: 1, cnt: 1, dr: 0, app: 1, tap: -1, trill: -1, nas: -1, voi: 1, sg: -1, cg: -1, lab: 1, rou: 1, ld: -1, cor: -1, ant: 0, dst: 0, str: 0, lat: -1, dor: 1, hi: -1, lo: 1, ft: -1, bk: 1, tns: 0},
		C: {con: 1},
		V: {con: -1}
	};
	/* * @constant * /
	var aliases = {
		//major class features:
		syl: 'syllabic',
		con: 'consonantal',
		app: 'approximant',
		son: 'sonorant',

		//laryngeal features:
		voi: 'voice',
		sg: 'spread glottis',
		cg: 'constricted glottis',

		//manner features:
		cnt: 'continuant',
		nas: 'nasal',
		strid: 'strident',
		lat: 'lateral',
		dr: 'delayed release',

		//place features:
		//labial
		rou: 'round',
		//coronal
		ant: 'anterior',
		dst: 'distributed',
		//dorsal
		hi: 'high',
		lo: 'low',
		bk: 'back',
		tns: 'tense',
		//pharyngeal
		//atr: 'advanced tongue root',
		//rtr: 'retracted tongue root',
		//glottal

		//vowel space:

		str: 'stress',
		lab: 'labial',
		ld: 'labiodental',
		cor: 'coronal',
		dor: 'dorsal',
		ft: 'front',
		lar: 'laryngeal',
		suplar: 'supralaryngeal'
	};*/
	/** @constant */
	var implications = [
		[{con: 1}, {tns: 0}],
		[{lo: 1}, {tns: 0}],
		[{cor: -1}, {ant: 0, dst: 0, strid: 0}],
		[{con: 1, dor: 1, hi: 1, lo: -1}, {ft: 0, bk: 0}],
		[{dor: -1}, {hi: 0, lo: 0, ft: 0, bk: 0, tns: 0}],
		[{lab: -1}, {rou: -1, ld: -1}],
		[{rou: 1}, {lab: 1}],
		[{ld: 1}, {lab: 1}],
		[{hi: 1}, {lo: -1}],
		[{lo: 1}, {hi: -1}],
		[{cg: 1}, {sg: -1}],
		[{sg: 1}, {cg: -1}],
		[{ft: 1}, {bk: -1}],
		[{bk: 1}, {ft: -1}],
		[{dr: -1}, {son: -1}],
		[{son: 1}, {dr: 0}],
		[{dr: -1}, {cnt: -1}]
	];
	var useDiacritics = true;
	/** @constant */
	var diacritics = {
		'\u02B0': [{sg: 1, cg: -1}, {con: 1, voi: -1, sg: -1, cg: -1}, 'aspirated'],
		'\u02B2': [{dor: 1, hi: 1, lo: -1, ft: 1, bk: -1}, {con: 1}, 'palatalized'],
		'\u02B7': [{lab: 1, rou: 1}, {con: 1, rou: -1}, 'labialized'],
		'\u02BC': [{sg: -1, cg: 1}, {con: 1, son: -1, tap: -1, trill: -1, nas: -1, voi: -1, sg: -1, cg: -1}, 'ejective'],
		'\u02C8': [{str: 1}, {str: -1}, 'stressed'],
		'\u02D0': [{long: 1}, {long: -1}, 'long'],
		//also known as retroflexed
		'\u02DE': [{cor: 1, ant: 1, dst: 1, strid: -1}, {syl: 1, con: -1, son: 1, tap: -1, trill: -1, cor: -1, dor: 1}, 'rhotic'],
		'\u02E0': [{dor: 1, hi: 1, lo: -1, ft: -1, bk: 1}, {con: 1, dor: -1}, 'velarized'],
		'\u02E4': [{dor: 1, hi: -1, lo: 1, ft: -1, bk: 1}, {con: 1, dor: -1}, 'pharyngealized'],
		'\u0303': [{nas: 1}, {son: 1, nas: -1}, 'nasalized'],
		//TODO
		'\u031D': [{hi: 1}, {}, 'raised'],
		//TODO
		'\u031E': [{lo: 1}, {}, 'lowered'],
		//also known as advanced
		'\u031F': [{ft: 1, bk: -1}, {con: 1, cor: -1, dor: 1, hi: 1, lo: -1}, 'fronted velar'],
		//also known as backed
		'\u0320': [{ant: -1, dst: 1}, {con: 1, cor: 1, ant: 1, dst: -1}, 'postalveolar'],
		'\u0324': [{sg: 1, cg: -1}, {voi: 1, sg: -1, cg: -1}, 'breathy void'],
		'\u0325': [{voi: -1}, {son: 1, voi: 1}, 'voiceless'],
		'\u0329': [{syl: 1}, {syl: -1}, 'syllabic'],
		'\u032A': [{ant: 1, dst: 1}, {con: 1, cor: 1, ant: 1, dst: -1}, 'dental'],
		'\u0330': [{sg: -1, cg: 1}, {voi: 1, sg: -1, cg: -1}, 'creaky void'],
		'\u0334': [{ft: -1, bk: 1}, {con: 1, dor: 1, hi: 1, lo: -1}, 'backed velar'],
		//TODO
		//produced by obstructing the air passage with the tip of the tongue
		'\u033A': [{ant: 1}, {con: 1}, 'apical'],
		//TODO
		//produced by obstructing the air passage with the blade of the tongue, which is the flat top front surface just behind
		//the tip of the tongue on the top
		'\u033B': [{ant: -1}, {con: 1}, 'laminal']
	};


	/**
	 * Convert a string into a list containing feature bundles
	 *
	 * @param {String/Array} str	A string of phone(me)s, or an array of features
	 */
	var convertStringIntoFeatures = function(str){
		var output;
		if(ObjectHelper.isString(str)){
			output = [];

			//match brackets (which contain features like [+foo, -bar]) or anything else
			var list = str.toLowerCase().match(REGEX_UNICODE_SPLITTER),
				m2, segment, diacritic;
			list.forEach(function(m){
				if(m == ' ')
					output.push({});
				else if(m.match(REGEX_UNICODE_FEATURES)){
					var features = {};
					m.slice(1, -1).split(',').forEach(function(f){
						var matches = f.match(/^\s*([\+\-0])?([a-z]+?)\s*$/);
						features[matches[2]] = (matches[1] == '-'? -1: (matches[1] == '+'? 1: 0));
					});
					output.push(features);
				}
				else{
					m2 = m.match(REGEX_UNICODE_COMPOUND_WITH_DIACRITICS);
					if(m2 && segments[m2[1]]){
						segment = ObjectHelper.clone(segments[m2[1]]);
						m2 = m2[2].match(REGEX_UNICODE_DIACRITICS);
						if(m2)
							m2.forEach(function(m3){
								diacritic = diacritics[m3];
								if(diacritic && Object.keys(diacritic[1]).every(function(feature){ return (segment[feature] == this[feature]); }, diacritic[1]))
									segment = combineFeatures(segment, diacritic[0]);
							});
						output.push(segment);
					}
					else if(segments[m])
						output.push(ObjectHelper.clone(segments[m]));
					else
						output.push(m);
				}
			});
		}
		else if(Array.isArray(str))
			output = str;
		else
			output = [str.toLowerCase()];

		return output;
	};

	/**
	 * @param {Object/String} bundleA	Originator feature bundle
	 * @param {Object/String} bundleB	Destinator feature bundle
	 *
	 * @private
	 */
	var combineFeatures = function(bundleA, bundleB){
		//initialize output bundle with bundleA...
		var output = ObjectHelper.clone(bundleA);
		//... and apply bundleB on top of it
		Object.keys(bundleB).forEach(function(f){
			output[f] = bundleB[f];
		});

		//apply implications
		implications.forEach(function(impl){
			//if output contains impl[0]...
			if(hasEquivalentFeatures(output, impl[0]))
				//... apply impl[1] to output
				Object.keys(impl[1]).forEach(function(f){
					output[f] = impl[1][f];
				});
		});

		return output;
	};

	/**
	 * Convert a feature bundle into a string.
	 *
	 * @param {Array} features					Array of features.
	 * @param {Boolean} ignoreSegments		Ignores segments and always uses [+foo,-bar] format.
	 * @param {Boolean} multipleElements	Return all the applicable elements instead of the best one matched.
	 */
	var convertFeaturesIntoString = function(features, ignoreSegments, multipleElements){
		var output = [];
		features.forEach(function(f){
			var tmp;

			if(ObjectHelper.isString(f))
				output.push(f);
			else if(!ignoreSegments){
				var segment = convertFeaturesIntoSegment(f, multipleElements);
				if(segment){
					tmp = {
						segment: [],
						composite: []
					};
					if(Array.isArray(segment))
						segment.forEach(function(seg){
							tmp[seg.length == 1? 'segment': 'composite'].push(seg);
						});
					else
						tmp.segment = segment;

					var hasWhole = tmp.segment.length,
						hasComposites = tmp.composite.length,
						result = tmp.segment;
					if(multipleElements){
						result = '';
						if(hasComposites)
							result += '(?:';
						if(hasWhole)
							result += (hasWhole > 1? '[' + tmp.segment.join('') + ']': tmp.segment[0]);
						if(hasComposites){
							if(hasWhole)
								result += '|';
							result += tmp.composite. join('|') + ')';
						}
					}

					output.push(result);
				}
			}
			else{
				tmp = [];
				Object.keys(f).forEach(function(element){
					tmp.push((f[element] == 1 ? '+' : (f[element] == -1? '-': '0')) + element);
				});
				output.push('[' + tmp.join(',') + ']');
			}
		});

		return output.join('');
	};

	/**
	 * Convert a feature bundle into a RegEx string.
	 *
	 * @param {Array} features					Array of features.
	 */
	var convertFeaturesIntoRegExString = function(features){
		return convertFeaturesIntoString(features, false, true);
	};

	/**
	 * @param {Array} features					Array of features.
	 * @param {Boolean} multipleElements	Return all the applicable elements instead of the best one matched.
	 *
	 * @private
	 */
	var convertFeaturesIntoSegment = function(features, multipleElements){
		var matches = [];
		Object.keys(segments).forEach(function(segment){
			if(!compareFeatures(features, segments[segment], !multipleElements).diff.length)
				matches.push(segment);
		});
		if(!matches.length && useDiacritics)
			Object.keys(segments).forEach(function(segment){
				if(compareFeatures(features, segments[segment], !multipleElements).diff.length == 1)
					Object.keys(diacritics).forEach(function(diac){
						if(!compareFeatures(features, combineFeatures(segments[segment], diacritics[diac][0]), !multipleElements).diff.length)
							matches.push(segment + diac);
					});
			});
		//FIXME consider multiple diacritic combined together
//		if(!matches.length && useDiacritics){
			//..
//		}
		//FIXME arbitrarily choose the first element
		return (!multipleElements? matches[0]: matches);
	};

	var compareFeatures = function(bundleA, bundleB, twoWayMatch){
		if(!bundleA || !bundleB)
			return;

		var result = {same: {}, diff: []},
			feature;
		for(feature in bundleA){
			if(!bundleB[feature] && bundleA[feature] != 0 || bundleA[feature] != bundleB[feature])
				result.diff.push(feature);
			else
				result.same[feature] = bundleA[feature];
		}

		if(twoWayMatch)
			for(feature in bundleB)
				if(result.diff.indexOf(feature) == -1
						&& (!bundleA[feature] && bundleB[feature] != 0 || bundleB[feature] != bundleA[feature]))
					result.diff.push(feature);

		return result;
	};

	/**
	 * @param {Object/String} bundleA	Feature bundle 1
	 * @param {Object/String} bundleB	Feature bundle 2
	 * @param {Object} [factors]			Factor to multiply the similarity for given features in the format <code>{voi: 0.5}</code>
	 */
	var similarity = function(bundleA, bundleB, factors){
		var diff = compareFeatures(bundleA, bundleB, true).diff,
			factor = (diff.length == 1? factors[diff[0]] || 1: 1);
		return factor * diff.length / Object.keys(segments.a).length;
	};

	/**
	 * @param {Object/String} bundleA	Feature bundle 1
	 * @param {Object/String} bundleB	Feature bundle 2
	 * @param {Object} [similarityFactor]	Factor to multiply the similarity for given features
	 */
	var similarity2 = function(bundleA, bundleB, similarityFactor){
		var diff = compareFeatures(bundleA, bundleB, true).diff,
			factor = 1;
		if(ObjectHelper.isDefined(similarityFactor)){
			//two sounds differing only in voicing: [pb], [td], [kɡ], [ɸβ], [θð], [sz], [ʃʒ], [xɣ], etc...
			if(diff.length == 1 && (bundleA.syl == 1 || diff.indexOf('voi') >= 0 || bundleA.ant == 1 && diff.indexOf('ant') >= 0))
				factor = similarityFactor;
			//two sounds differing in manner of articulation only as plosive vs fricative: [pɸ], [kx], [bβ], [ɡɣ], etc...
			//the sibilant or grooved fricatives [s,z,ʃ,ʒ] are excluded from this category as they are quite different auditorily from
			//the other ("central") fricatives
//			else if(diff.length == 2 && diff.indexOf('cnt') >= 0 && diff.indexOf('dr') >= 0 && bundleA.cnt && bundleA.cnt == bundleA.dr)
//				factor = similarityFactor;
			//any pairs of consonants close in place of articulation and differing in no other contrastive feature: [sʃ], [zʒ], [nɲŋ], [lɭ],
			//[lʎ], [mɱ], etc...
			//TODO
			//any other pairs of consonants which are close in articulation and differ by one other feature but are nevertheless frequently
			//members of the same phoneme: [lɹ], [cɡ], [tθ], [dð], etc...
			//in languages where voicing is non-contrastive, the place of articulation of the apicodental fricatives [θ,ð] is considered to be close enough to that of the alveolar stops [t,d] to be considered phonetically similar.
			//TODO
			//FIXME
		}
		return factor * diff.length / Object.keys(segments.a).length;
	};

	/**
	 * NOTE: this is equivalent to say "bundleA contains bundleB"
	 *
	 * @param {Object/String} bundleA	Originator feature bundle
	 * @param {Object/String} bundleB	Destinator feature bundle
	 */
	var hasEquivalentFeatures = function(bundleA, bundleB){
		return !compareFeatures(bundleA, bundleB).diff.length;
	};

	/**
	 * @param {Object/String} bundleA	Originator feature bundle
	 * @param {Object/String} bundleB	Destinator feature bundle
	 */
	var intersectFeatures = function(bundleA, bundleB){
		return compareFeatures(bundleA, bundleB).same;
	};


	var Rule = function(target, transform, environment, name){
		this.target = convertStringIntoFeatures(target || '∅');
		this.transform = convertStringIntoFeatures(transform || '∅');
		this.environment = convertStringIntoFeatures(environment || '');
		this.name = name;


		this.hasSameStructuralChange = function(rule){
			return (ObjectHelper.deepEquals(this.target, rule.target) && ObjectHelper.deepEquals(this.transform, rule.transform));
		};

		this.isSameAs = function(rule){
			return (this.hasSameStructuralChange(rule) && ObjectHelper.deepEquals(this.environment, rule.environment));
		};

		/** NOTE: this is equivalent to say "this is a superset of rule" */
		this.contains = function(rule){
			return (this.hasSameStructuralChange(rule) && this.environment.length == rule.environment.length && this.environment.every(function(f, idx){ return hasEquivalentFeatures(f, rule.environment[idx]); }));
		};

		this.applyTo = function(input){
			var from = '(' + convertFeaturesIntoRegExString(this.environment)
					.replace(/_/, ')(' + convertFeaturesIntoRegExString(this.target).replace(/∅/g, '') + ')(')
					.replace(/^([^#])/, '.*$1').replace(/^#/, '^')
					.replace(/([^#])$/, '$1.*').replace(/#$/, '$')
					+ ')',
				m = input.match(new RegExp(from)),
				output;
			if(m){
				var replacement = this.transform;
				if(m[2]){
					replacement = [];
					var i = 0;
					this.transform.forEach(function(k){
						if(k != '∅'){
							var chr = convertFeaturesIntoString([k]);
							replacement.push(chr.length && ObjectHelper.isString(chr)? chr: combineFeatures(convertStringIntoFeatures(m[2][i ++])[0], k));
						}
					});
				}
				m[2] = convertFeaturesIntoString(replacement);

				m.shift();
				output = m.join('');
			}

			return output;
		};

		this.toString = function(){
			return convertFeaturesIntoString(this.target) + ' → ' + convertFeaturesIntoString(this.transform) + ' / ' + convertFeaturesIntoRegExString(this.environment);
		};
	};


	return {
		REGEX_UNICODE_SPLITTER: REGEX_UNICODE_SPLITTER,

		useDiacritics: useDiacritics,
		setUseDiacritics: function(use){ useDiacritics = use; },

		convertStringIntoFeatures: convertStringIntoFeatures,
		convertFeaturesIntoString: convertFeaturesIntoString,
		convertFeaturesIntoRegExString: convertFeaturesIntoRegExString,
		compareFeatures: compareFeatures,
		similarity: similarity,
		hasEquivalentFeatures: hasEquivalentFeatures,
		intersectFeatures: intersectFeatures,

		Rule: Rule
	};

});
