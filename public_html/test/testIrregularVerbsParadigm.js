require(['tools/lang/morphology/Verb', 'tools/lang/morphology/Themizer', 'tools/lang/morphology/Paradigm'], function(Verb, Themizer, Paradigm){
	QUnit.module('IrregularVerbsParadigm');

//	QUnit.config.maxDepth = 20;
QUnit.dump.maxDepth = 20;


	QUnit.test('andàr', function(){
		var verb = new Verb('andar');

		var themes = Themizer.generate(verb, 'none');

		var paradigm = Paradigm.generate(verb, themes);
		delete paradigm.applyDialectalVariations;

		var expected = {
			indicative: {
				present: {
					regular: {
						firstSingular: {central_centralNorthern_lagunar_western1: '#àndo'/*, central_centralNorthern_lagunar_western2: '#ànt'*/, general: '#ànde'},
						firstPlural: {general: '#andémo', northern: '#andón', oriental: '#andén', central_western: undefined},
						secondSingular: {general: '#àndi'},
						secondPlural: {central_western: undefined, general: '#andè', northern_oriental: '#andé'},
						third: {archaic: '#ànda', general: '#ànde'/*, northern_oriental: '#ànt'*/}
					},
					irregular: {
						firstSingular: {central_centralNorthern_lagunar_western1: '#và(g)o'/*, central_centralNorthern_lagunar_western2: '#và'*/, general: '#vàe'},
						firstPlural: {central_western: undefined, general: '#vémo', northern: '#vón', oriental: '#vén'},
						secondSingular: {general: '#và'},
						secondPlural: {central_western: undefined, general: '#vè', northern_oriental: '#vé'},
						third: {general: '#vàe', archaic: '#và'/*, northern_oriental: '#và'*/}
					}
				},
				imperfect: {
					regular: {
						firstSingular: {central: '#andà(v)o', general: '#andà(v)a', northern_oriental: '#andà(v)e'},
						firstPlural: {general: '#andà(v)imo', northern1: '#and(i)ón(se)', northern2: '#andiv(i)ón(se)', oriental: '#and(iv)én(se)'},
						secondSingular: {general: '#andà(v)i'},
						secondPlural: {archaic: '#andà(v)a', general: '#andà(v)i', northern: '#and(iv)ié'},
						third: {general: '#andà(v)a'}
					}
				},
				future: {
					regular: {
						firstSingular: {central: '#andarò', general: '#andarà', northern_oriental: '#andarè'},
						firstPlural: {general: '#andarémo', northern: '#andarón', oriental: '#andarén', central_western: undefined},
						secondSingular: {general: '#andarà'},
						secondPlural: {general: '#andaré', central_western: undefined},
						third: {general: '#andarà'}
					}
				}
			},
			subjunctive: {
				present: {
					regular: {
						firstSingular: {general: '#ànda', northern_oriental: '#ànde'},
						firstPlural: {general: '#andémo', northern: '#and(i)ón(e)', oriental: '#andén(e)', central_western: undefined},
						secondSingular: {general: '#àndi'},
						secondPlural: {centralNorthern: '#andé', general: '#andè', northern_oriental1: '#andé(de/ge)', northern_oriental2: undefined, central_western: undefined},
						third: {general: '#ànda', northern_oriental1: '#ànde'/*, northern_oriental2: '#ànt'*/}
					},
					irregular: {
						firstSingular: {general: '#và(g)a', northern_oriental: '#vàe'},
						firstPlural: {central_western: undefined, general: '#vémo', northern: '#v(i)ón(e)', oriental: '#vén(e)'},
						secondSingular: {general: '#và(g)i'},
						secondPlural: {centralNorthern: '#vé', central_western: undefined, general: '#vè', northern_oriental1: '#vé(de/ge)', northern_oriental2: undefined},
						third: {general: '#và(g)a', northern_oriental1: '#vàe'/*, northern_oriental2: undefined*/}
					}
				},
				imperfect: {
					regular: {
						firstSingular: {general: '#andàse'},
						firstPlural: {general: '#andàsimo', northern1: '#and(i)ón(e/se)', northern2: '#andis(i)ón(e/se)', oriental: '#and(is)én(e/se)'},
						secondSingular: {general: '#andàsi'},
						secondPlural: {general: '#andàsi', archaic: '#andàse', northern: '#and(is)ié(de/ge)'},
						third: {general: '#andàse'}
					}
				}
			},
			conditional: {
				simple: {
					regular: {
						firstSingular: {general: '#andaría', northern_oriental: '#andaríe'},
						firstPlural: {general: '#andarésimo', northern: '#andar(is)(i)ón(se)', oriental: '#andar(is)én(se)'},
						secondSingular: {general: '#andaría'},
						secondPlural: {general: '#andarési', northern: '#andar(is)ié'},
						third: {general: '#andaría', northern_oriental: '#andaríe'},
						archaic: '#andaràve'
					}
				}
			},
			imperative: {
				present: {
					irregular: {
						secondSingular: {general: '#và$'},
						secondPlural: {general: '#vè$', northern_oriental: '#vé$', central_western: undefined}
					},
					regular: {
						secondSingular: {general: '#ànda$'},
						secondPlural: {general: '#andè$', northern_oriental: '#andé$', central_western: undefined}
					}
				}
			},
			infinitive: {
				simple: {
					regular: {all1: 'andàr#', all2: 'andàre'}
				}
			},
			participle: {
				imperfect: {
					regular: {all: 'andànte'}
				},
				perfect: {
					regular: {
						general: {singularMasculine1: 'andà', singularMasculine2: 'andà(d)o', singularFeminine: 'andà(d)a', pluralMasculine: 'andà(d)i', pluralFeminine: 'andà(d)e'},
						northern_oriental1: {singularMasculine: 'andàsto', singularFeminine: 'andàsta', pluralMasculine: 'andàsti', pluralFeminine: 'andàste'},
						northern_oriental2: undefined
					}
				}
			},
			gerund: {
				simple: {
					regular: {
						all: {regular1: 'andàndo#', regular2: undefined}
					}
				}
			}
		};

		deepEqual(paradigm, expected, 'andar');
	});

	QUnit.test('fàr', function(){
		var verb = new Verb('far');

		var themes = Themizer.generate(verb, 'none');

		var paradigm = Paradigm.generate(verb, themes);
		delete paradigm.applyDialectalVariations;

		var expected = {
			indicative: {
				present: {
					regular: {
						firstPlural: {general: '#fémo', northern: '#fón', oriental: '#fén', central_western: undefined},
						secondPlural: {central_western: undefined, general: '#fè', northern_oriental: '#fé'}
					},
					irregular: {
						firstSingular: {central_centralNorthern_lagunar_western1: '#fà(g)o'/*, central_centralNorthern_lagunar_western2: '#fà'*/, general: '#fàe'},
						secondSingular: {general: '#fà'},
						third: {general: '#fà'/*, northern_oriental: undefined*/, archaic: undefined}
					}
				},
				imperfect: {
					regular: {
						firstSingular: {central: '#fà(v)o', general: '#fà(v)a', northern_oriental: '#fà(v)e'},
						firstPlural: {general: '#fà(v)imo', northern1: '#f(i)ón(se)', northern2: '#fiv(i)ón(se)', oriental: '#f(iv)én(se)'},
						secondSingular: {general: '#fà(v)i'},
						secondPlural: {archaic: '#fà(v)a', general: '#fà(v)i', northern: '#f(iv)ié'},
						third: {general: '#fà(v)a'}
					}
				},
				future: {
					regular: {
						firstSingular: {central: '#farò', general: '#farà', northern_oriental: '#farè'},
						firstPlural: {general: '#farémo', northern: '#farón', oriental: '#farén', central_western: undefined},
						secondSingular: {general: '#farà'},
						secondPlural: {general: '#faré', central_western: undefined},
						third: {general: '#farà'}
					}
				}
			},
			subjunctive: {
				present: {
					regular: {
						firstPlural: {general: '#fémo', northern: '#f(i)ón(e)', oriental: '#fén(e)', central_western: undefined},
						secondPlural: {centralNorthern: '#fé', general: '#fè', northern_oriental1: '#fé(de/ge)', northern_oriental2: undefined, central_western: undefined}
					},
					irregular: {
						firstSingular: {general: '#fà(g)a', northern_oriental: '#fàe'},
						secondSingular: {general: '#fà(g)i'},
						third: {general: '#fà(g)a', northern_oriental1: '#fàe'/*, northern_oriental2: undefined*/}
					}
				},
				imperfect: {
					regular: {
						firstSingular: {general: '#fàse'},
						firstPlural: {general: '#fàsimo', northern1: '#f(i)ón(e/se)', northern2: '#fis(i)ón(e/se)', oriental: '#f(is)én(e/se)'},
						secondSingular: {general: '#fàsi'},
						secondPlural: {general: '#fàsi', archaic: '#fàse', northern: '#f(is)ié(de/ge)'},
						third: {general: '#fàse'}
					}
				}
			},
			conditional: {
				simple: {
					regular: {
						firstSingular: {general: '#faría', northern_oriental: '#faríe'},
						firstPlural: {general: '#farésimo', northern: '#far(is)(i)ón(se)', oriental: '#far(is)én(se)'},
						secondSingular: {general: '#faría'},
						secondPlural: {general: '#farési', northern: '#far(is)ié'},
						third: {general: '#faría', northern_oriental: '#faríe'},
						archaic: '#faràve'
					}
				}
			},
			imperative: {
				present: {
					regular: {
						secondSingular: {general: '#fà$'},
						secondPlural: {general: '#fè$', northern_oriental: '#fé$', central_western: undefined}
					}
				}
			},
			infinitive: {
				simple: {
					regular: {all1: 'fàr#', all2: 'fàre'}
				}
			},
			participle: {
				imperfect: {
					regular: {all: 'fànte'}
				},
				perfect: {
					regular: {
						general: {singularMasculine1: 'fà', singularMasculine2: 'fà(d)o', singularFeminine: 'fà(d)a', pluralMasculine: 'fà(d)i', pluralFeminine: 'fà(d)e'},
						northern_oriental1: {singularMasculine: 'fàsto', singularFeminine: 'fàsta', pluralMasculine: 'fàsti', pluralFeminine: 'fàste'},
						northern_oriental2: undefined
					},
					irregular: {
						strong: {
							general: {singularMasculine: 'fàto'/*, singularMasculine2: 'fàt'*/, singularFeminine: 'fàta', pluralMasculine: 'fàti', pluralFeminine: 'fàte'}
						}
					}
				}
			},
			gerund: {
				simple: {
					regular: {
						all: {regular1: 'fàndo#', regular2: undefined}
					}
				}
			}
		};

		deepEqual(paradigm, expected, 'far');
	});

	QUnit.test('déver', function(){
		var verb = new Verb('déver');

		var themes = Themizer.generate(verb, 'none');

		var paradigm = Paradigm.generate(verb, themes);
		delete paradigm.applyDialectalVariations;

		var expected = {
			conditional: {
				simple: {
					regular: {
						archaic: 'deveràve',
						firstPlural: {general: 'deverésimo', northern: 'dever(is)(i)ón(se)', oriental: 'dever(is)én(se)'},
						firstSingular: {general: 'devería', northern_oriental: 'deveríe'},
						secondPlural: {general: 'deverési', northern: 'dever(is)ié'},
						secondSingular: {general: 'devería'},
						third: {general: 'devería', northern_oriental: 'deveríe'}
					}
				}
			},
			gerund: {
				simple: {
					regular: {
						all: {regular1: 'devéndo', regular2: undefined}
					}
				}
			},
			imperative: {
				present: {
					regular: {
						secondPlural: {central_western: 'deví$', general: 'devé$', northern_oriental: undefined},
						secondSingular: {general: 'dévi$'}
					}
				}
			},
			indicative: {
				future: {
					regular: {
						firstPlural: {central_western: 'deverímo', general: 'deverémo', northern: 'deverón', oriental: 'deverén'},
						firstSingular: {central: 'deverò', general: 'deverà', northern_oriental: 'deverè'},
						secondPlural: {central_western: 'deverí', general: 'deveré'},
						secondSingular: {general: 'deverà'},
						third: {general: 'deverà'}
					}
				},
				imperfect: {
					regular: {
						firstPlural: {general: 'devé(v)imo', northern1: 'dev(i)ón(se)', northern2: 'deviv(i)ón(se)', oriental: 'dev(iv)én(se)'},
						firstSingular: {central: 'devé(v)o', general: 'devé(v)a', northern_oriental: 'devé(v)e'},
						secondPlural: {archaic: 'devé(v)a', general: 'devé(v)i', northern: 'dev(iv)ié'},
						secondSingular: {general: 'devé(v)i'},
						third: {general: 'devé(v)a'}
					}
				},
				present: {
					regular: {
						firstPlural: {central_western: 'devímo', general: 'devémo', northern: 'devón', oriental: 'devén'},
						firstSingular: {central_centralNorthern_lagunar_western1: 'dévo'/*, central_centralNorthern_lagunar_western2: 'déf'*/, general: 'déve'},
						secondPlural: {central_western: 'deví', general: 'devé', northern_oriental: undefined},
						secondSingular: {general: 'dévi'},
						third: {archaic: undefined, general: 'déve'/*, northern_oriental: 'déf'*/}
					}
				}
			},
			infinitive: {
				simple: {
					regular: {all1: 'déver', all2: 'dévere'}
				}
			},
			participle: {
				imperfect: {
					regular: {all: 'devénte'}
				},
				perfect: {
					regular: {
						general: {pluralFeminine: 'devú(d)e', pluralMasculine: 'devú(d)i', singularFeminine: 'devú(d)a', singularMasculine1: 'devú', singularMasculine2: 'devú(d)o'},
						northern_oriental1: {pluralFeminine: 'devéste', pluralMasculine: 'devésti', singularFeminine: 'devésta', singularMasculine: 'devésto'},
						northern_oriental2: undefined
					}
				}
			},
			subjunctive: {
				imperfect: {
					regular: {
						firstPlural: {general: 'devésimo', northern1: 'dev(i)ón(e/se)', northern2: 'devis(i)ón(e/se)', oriental: 'dev(is)én(e/se)'},
						firstSingular: {general: 'devése'},
						secondPlural: {archaic: 'devése', general: 'devési', northern: 'dev(is)ié(de/ge)'},
						secondSingular: {general: 'devési'},
						third: {general: 'devése'}
					}
				},
				present: {
					irregular: {
						firstPlural: {central_western: undefined, general: 'debiémo', northern: 'debión(e)', oriental: 'debién(e)'},
						firstSingular: {general: 'débia', northern_oriental: 'débie'},
						secondPlural: {centralNorthern: undefined, central_western: undefined, general: 'debiè', northern_oriental1: 'debié(de/ge)', northern_oriental2: undefined},
						secondSingular: {general: 'débi'},
						third: {general: 'débia', northern_oriental1: 'débie'/*, northern_oriental2: undefined*/}
					}
				}
			}
		};

		deepEqual(paradigm, expected, 'déver');
	});

	QUnit.test('savér', function(){
		var verb = new Verb('savér');

		var themes = Themizer.generate(verb, 'none');

		var paradigm = Paradigm.generate(verb, themes);
		delete paradigm.applyDialectalVariations;

		var expected = {
			conditional: {
				simple: {
					regular: {
						archaic: '#saveràve',
						firstPlural: {general: '#saverésimo', northern: '#saver(is)(i)ón(se)', oriental: '#saver(is)én(se)'},
						firstSingular: {general: '#savería', northern_oriental: '#saveríe'},
						secondPlural: {general: '#saverési', northern: '#saver(is)ié'},
						secondSingular: {general: '#savería'},
						third: {general: '#savería', northern_oriental: '#saveríe'}
					}
				}
			},
			gerund: {
				simple: {
					regular: {
						all: {regular1: 'savéndo#', regular2: undefined}
					}
				}
			},
			imperative: {
				present: {
					irregular: {
						secondSingular: {general: '#sà$'}
					},
					regular: {
						secondPlural: {central_western: '#saví$', general: '#savé$', northern_oriental: undefined}
					}
				}
			},
			indicative: {
				future: {
					regular: {
						firstPlural: {central_western: '#saverímo', general: '#saverémo', northern: '#saverón', oriental: '#saverén'},
						firstSingular: {central: '#saverò', general: '#saverà', northern_oriental: '#saverè'},
						secondPlural: {central_western: '#saverí', general: '#saveré'},
						secondSingular: {general: '#saverà'},
						third: {general: '#saverà'}
					}
				},
				imperfect: {
					regular: {
						firstPlural: {general: '#savé(v)imo', northern1: '#sav(i)ón(se)', northern2: '#saviv(i)ón(se)', oriental: '#sav(iv)én(se)'},
						firstSingular: {central: '#savé(v)o', general: '#savé(v)a', northern_oriental: '#savé(v)e'},
						secondPlural: {archaic: '#savé(v)a', general: '#savé(v)i', northern: '#sav(iv)ié'},
						secondSingular: {general: '#savé(v)i'},
						third: {general: '#savé(v)a'}
					}
				},
				present: {
					irregular: {
						firstSingular: {central_centralNorthern_lagunar_western1: '#sào'/*, central_centralNorthern_lagunar_western2: '#sà'*/, central_centralNorthern_lagunar_western3: '#sò', general: '#sàe'},
						secondSingular: {general: '#sà'},
						third: {archaic: undefined, general: '#sà'/*, northern_oriental: undefined*/}
					},
					regular: {
						firstPlural: {central_western: '#savímo', general: '#savémo', northern: '#savón', oriental: '#savén'},
						secondPlural: {central_western: '#saví', general: '#savé', northern_oriental: undefined}
					}
				}
			},
			infinitive: {
				simple: {
					regular: {all1: 'savér#', all2: 'savére'}
				}
			},
			participle: {
				imperfect: {
					regular: {all: 'savénte'}
				},
				perfect: {
					regular: {
						general: {pluralFeminine: 'savú(d)e', pluralMasculine: 'savú(d)i', singularFeminine: 'savú(d)a', singularMasculine1: 'savú', singularMasculine2: 'savú(d)o'},
						northern_oriental1: {pluralFeminine: 'savéste', pluralMasculine: 'savésti', singularFeminine: 'savésta', singularMasculine: 'savésto'},
						northern_oriental2: undefined
					}
				}
			},
			subjunctive: {
				imperfect: {
					regular: {
						firstPlural: {general: '#savésimo', northern1: '#sav(i)ón(e/se)', northern2: '#savis(i)ón(e/se)', oriental: '#sav(is)én(e/se)'},
						firstSingular: {general: '#savése'},
						secondPlural: {archaic: '#savése', general: '#savési', northern: '#sav(is)ié(de/ge)'},
						secondSingular: {general: '#savési'},
						third: {general: '#savése'}
					}
				},
				present: {
					irregular: {
						firstPlural: {central_western: undefined, general: '#sapiémo', northern: '#sapión(e)', oriental: '#sapién(e)'},
						firstSingular: {general: '#sàpia', northern_oriental: '#sàpie'},
						secondPlural: {centralNorthern: undefined, central_western: undefined, general: '#sapiè', northern_oriental1: '#sapié(de/ge)', northern_oriental2: undefined},
						secondSingular: {general: '#sàpi'},
						third: {general: '#sàpia', northern_oriental1: '#sàpie'/*, northern_oriental2: undefined*/}
					}
				}
			}
		};

		deepEqual(paradigm, expected, 'savér');
	});

	QUnit.test('díxer', function(){
		var verb = new Verb('díxer');

		var themes = Themizer.generate(verb, 'none');

		var paradigm = Paradigm.generate(verb, themes);
		delete paradigm.applyDialectalVariations;

		var expected = {
			conditional: {
				simple: {
					irregular: {
						archaic: '#diràve',
						firstPlural: {general: '#dirésimo', northern: '#dir(is)(i)ón(se)', oriental: '#dir(is)én(se)'},
						firstSingular: {general: '#diría', northern_oriental: '#diríe'},
						secondPlural: {general: '#dirési', northern: '#dir(is)ié'},
						secondSingular: {general: '#diría'},
						third: {general: '#diría', northern_oriental: '#diríe'}
					},
					regular: {
						archaic: '#dixeràve',
						firstPlural: {general: '#dixerésimo', northern: '#dixer(is)(i)ón(se)', oriental: '#dixer(is)én(se)'},
						firstSingular: {general: '#dixería', northern_oriental: '#dixeríe'},
						secondPlural: {general: '#dixerési', northern: '#dixer(is)ié'},
						secondSingular: {general: '#dixería'},
						third: {general: '#dixería', northern_oriental: '#dixeríe'}
					}
				}
			},
			gerund: {
				simple: {
					regular: {
						all: {regular1: 'dixéndo#', regular2: undefined}
					}
				}
			},
			imperative: {
				present: {
					regular: {
						secondPlural: {central_western: '#dixí$', general: '#dixé$', northern_oriental: undefined},
						secondSingular: {general: '#díxi$'}
					}
				}
			},
			indicative: {
				future: {
					irregular: {
						firstPlural: {central_western: '#dirímo', general: '#dirémo', northern: '#dirón', oriental: '#dirén'},
						firstSingular: {central: '#dirò', general: '#dirà', northern_oriental: '#dirè'},
						secondPlural: {central_western: '#dirí', general: '#diré'},
						secondSingular: {general: '#dirà'},
						third: {general: '#dirà'}
					},
					regular: {
						firstPlural: {central_western: '#dixerímo', general: '#dixerémo', northern: '#dixerón', oriental: '#dixerén'},
						firstSingular: {central: '#dixerò', general: '#dixerà', northern_oriental: '#dixerè'},
						secondPlural: {central_western: '#dixerí', general: '#dixeré'},
						secondSingular: {general: '#dixerà'},
						third: {general: '#dixerà'}
					}
				},
				imperfect: {
					regular: {
						firstPlural: {general: '#dixé(v)imo', northern1: '#dix(i)ón(se)', northern2: '#dixiv(i)ón(se)', oriental: '#dix(iv)én(se)'},
						firstSingular: {central: '#dixé(v)o', general: '#dixé(v)a', northern_oriental: '#dixé(v)e'},
						secondPlural: {archaic: '#dixé(v)a', general: '#dixé(v)i', northern: '#dix(iv)ié'},
						secondSingular: {general: '#dixé(v)i'},
						third: {general: '#dixé(v)a'}
					}
				},
				present: {
					irregular: {
						firstSingular: {central_centralNorthern_lagunar_western: '#dígo'}
					},
					regular: {
						firstPlural: {central_western: '#dixímo', general: '#dixémo', northern: '#dixón', oriental: '#dixén'},
						firstSingular: {central_centralNorthern_lagunar_western1: '#díxo'/*, central_centralNorthern_lagunar_western2: '#dís'*/, general: '#díxe'},
						secondPlural: {central_western: '#dixí', general: '#dixé', northern_oriental: undefined},
						secondSingular: {general: '#díxi'},
						third: {archaic: undefined, general: '#díxe'/*, northern_oriental: '#dís'*/}
					}
				}
			},
			infinitive: {
				simple: {
					irregular: {all1: 'dír#', all2: 'díre'},
					regular: {all1: 'díxer#', all2: 'díxere'}
				}
			},
			participle: {
				imperfect: {
					regular: {all: 'dixénte'}
				},
				perfect: {
					irregular: {
						strong: {general: {pluralFeminine: 'díte'/*, singularMasculine2: 'dít'*/, pluralMasculine: 'díti', singularFeminine: 'díta', singularMasculine: 'díto'}}
					},
					regular: {
						general: {pluralFeminine: 'dixú(d)e', pluralMasculine: 'dixú(d)i', singularFeminine: 'dixú(d)a', singularMasculine1: 'dixú', singularMasculine2: 'dixú(d)o'},
						northern_oriental1: {pluralFeminine: 'dixéste', pluralMasculine: 'dixésti', singularFeminine: 'dixésta', singularMasculine: 'dixésto'},
						northern_oriental2: undefined
					}
				}
			},
			subjunctive: {
				imperfect: {
					regular: {
						firstPlural: {general: '#dixésimo', northern1: '#dix(i)ón(e/se)', northern2: '#dixis(i)ón(e/se)', oriental: '#dix(is)én(e/se)'},
						firstSingular: {general: '#dixése'},
						secondPlural: {archaic: '#dixése', general: '#dixési', northern: '#dix(is)ié(de/ge)'},
						secondSingular: {general: '#dixési'},
						third: {general: '#dixése'}
					}
				},
				present: {
					irregular: {
						firstSingular: {central_centralNorthern_lagunar_western: '#díga'},
						secondSingular: {general: '#dígi'},
						third: {general: '#díga'}
					},
					regular: {
						firstPlural: {central_western: '#dixímo', general: '#dixémo', northern: '#dix(i)ón(e)', oriental: '#dixén(e)'},
						firstSingular: {general: '#díxa', northern_oriental: '#díxe'},
						secondPlural: {centralNorthern: undefined, central_western: '#dixí', general: '#dixé', northern_oriental1: '#dixé(de/ge)', northern_oriental2: undefined},
						secondSingular: {general: '#díxi'},
						third: {general: '#díxa', northern_oriental1: '#díxe'/*, northern_oriental2: '#dís'*/}
					}
				}
			}
		};

		deepEqual(paradigm, expected, 'díxer');
	});

	QUnit.test('podér', function(){
		var verb = new Verb('podér');

		var themes = Themizer.generate(verb, 'none');

		var paradigm = Paradigm.generate(verb, themes);
		delete paradigm.applyDialectalVariations;

		var expected = {
			conditional: {
				simple: {
					irregular: {
						archaic: '#poràve',
						firstPlural: {general: '#porésimo', northern: '#por(is)(i)ón(se)', oriental: '#por(is)én(se)'},
						firstSingular: {general: '#poría', northern_oriental: '#poríe'},
						secondPlural: {general: '#porési', northern: '#por(is)ié'},
						secondSingular: {general: '#poría'},
						third: {general: '#poría', northern_oriental: '#poríe'}
					},
					regular: {
						archaic: '#poderàve',
						firstPlural: {general: '#poderésimo', northern: '#poder(is)(i)ón(se)', oriental: '#poder(is)én(se)'},
						firstSingular: {general: '#podería', northern_oriental: '#poderíe'},
						secondPlural: {general: '#poderési', northern: '#poder(is)ié'},
						secondSingular: {general: '#podería'},
						third: {general: '#podería', northern_oriental: '#poderíe'}
					}
				}
			},
			gerund: {
				simple: {
					regular: {
						all: {regular1: 'podéndo#', regular2: undefined}
					}
				}
			},
			indicative: {
				future: {
					irregular: {
						firstPlural: {central_western: '#porímo', general: '#porémo', northern: '#porón', oriental: '#porén'},
						firstSingular: {central: '#porò', general: '#porà', northern_oriental: '#porè'},
						secondPlural: {central_western: '#porí', general: '#poré'},
						secondSingular: {general: '#porà'},
						third: {general: '#porà'}
					},
					regular: {
						firstPlural: {central_western: '#poderímo', general: '#poderémo', northern: '#poderón', oriental: '#poderén'},
						firstSingular: {central: '#poderò', general: '#poderà', northern_oriental: '#poderè'},
						secondPlural: {central_western: '#poderí', general: '#poderé'},
						secondSingular: {general: '#poderà'},
						third: {general: '#poderà'}
					}
				},
				imperfect: {
					regular: {
						firstPlural: {general: '#podé(v)imo', northern1: '#pod(i)ón(se)', northern2: '#podiv(i)ón(se)', oriental: '#pod(iv)én(se)'},
						firstSingular: {central: '#podé(v)o', general: '#podé(v)a', northern_oriental: '#podé(v)e'},
						secondPlural: {archaic: '#podé(v)a', general: '#podé(v)i', northern: '#pod(iv)ié'},
						secondSingular: {general: '#podé(v)i'},
						third: {general: '#podé(v)a'}
					}
				},
				present: {
					irregular: {
						third: {general: '#pòle'/*, northern_oriental: '#pòl'*/}
					},
					regular: {
						firstPlural: {central_western: '#podímo', general: '#podémo', northern: '#podón', oriental: '#podén'},
						firstSingular: {central_centralNorthern_lagunar_western1: '#pòdo'/*, central_centralNorthern_lagunar_western2: '#pòt'*/, general: '#pòde'},
						secondPlural: {central_western: '#podí', general: '#podé', northern_oriental: undefined},
						secondSingular: {general: '#pòdi'},
						third: {archaic: undefined, general: '#pòde'/*, northern_oriental: '#pòt'*/}
					}
				}
			},
			infinitive: {
				simple: {
					regular: {all1: 'podér#', all2: 'podére'}
				}
			},
			participle: {
				imperfect: {
					regular: {all: 'podénte'}
				},
				perfect: {
					regular: {
						general: {pluralFeminine: 'podú(d)e', pluralMasculine: 'podú(d)i', singularFeminine: 'podú(d)a', singularMasculine1: 'podú', singularMasculine2: 'podú(d)o'},
						northern_oriental1: {pluralFeminine: 'podéste', pluralMasculine: 'podésti', singularFeminine: 'podésta', singularMasculine: 'podésto'},
						northern_oriental2: undefined
					}
				}
			},
			subjunctive: {
				imperfect: {
					regular: {
						firstPlural: {general: '#podésimo', northern1: '#pod(i)ón(e/se)', northern2: '#podis(i)ón(e/se)', oriental: '#pod(is)én(e/se)'},
						firstSingular: {general: '#podése'},
						secondPlural: {archaic: '#podése', general: '#podési', northern: '#pod(is)ié(de/ge)'},
						secondSingular: {general: '#podési'},
						third: {general: '#podése'}
					}
				},
				present: {
					regular: {
						firstPlural: {central_western: '#podímo', general: '#podémo', northern: '#pod(i)ón(e)', oriental: '#podén(e)'},
						firstSingular: {general: '#pòda', northern_oriental: '#pòde'},
						secondPlural: {centralNorthern: undefined, central_western: '#podí', general: '#podé', northern_oriental1: '#podé(de/ge)', northern_oriental2: undefined},
						secondSingular: {general: '#pòdi'},
						third: {general: '#pòda', northern_oriental1: '#pòde'/*, northern_oriental2: '#pòt'*/}
					}
				}
			}
		};

		deepEqual(paradigm, expected, 'podér');
	});

	QUnit.test('vèñer', function(){
		var verb = new Verb('vèñer');

		var themes = Themizer.generate(verb, 'none');

		var paradigm = Paradigm.generate(verb, themes);
		delete paradigm.applyDialectalVariations;

		var expected = {
			conditional: {
				simple: {
					regular: {
						archaic: '#veñeràve',
						firstPlural: {general: '#veñerésimo', northern: '#veñer(is)(i)ón(se)', oriental: '#veñer(is)én(se)'},
						firstSingular: {general: '#veñería', northern_oriental: '#veñeríe'},
						secondPlural: {general: '#veñerési', northern: '#veñer(is)ié'},
						secondSingular: {general: '#veñería'},
						third: {general: '#veñería', northern_oriental: '#veñeríe'}
					}
				}
			},
			gerund: {
				simple: {
					regular: {
						all: {regular1: 'veñéndo#', regular2: undefined}
					}
				}
			},
			imperative: {
				present: {
					irregular: {
						secondSingular: {general: '#vièn$'}
					},
					regular: {
						secondPlural: {central_western: '#veñí$', general: '#veñé$', northern_oriental: undefined},
						secondSingular: {general: '#vèñi$'}
					}
				}
			},
			indicative: {
				future: {
					regular: {
						firstPlural: {central_western: '#veñerímo', general: '#veñerémo', northern: '#veñerón', oriental: '#veñerén'},
						firstSingular: {central: '#veñerò', general: '#veñerà', northern_oriental: '#veñerè'},
						secondPlural: {central_western: '#veñerí', general: '#veñeré'},
						secondSingular: {general: '#veñerà'},
						third: {general: '#veñerà'}
					}
				},
				imperfect: {
					regular: {
						firstPlural: {general: '#veñé(v)imo', northern1: '#veñón(se)', northern2: '#veñiv(i)ón(se)', oriental: '#veñ(iv)én(se)'},
						firstSingular: {central: '#veñé(v)o', general: '#veñé(v)a', northern_oriental: '#veñé(v)e'},
						secondPlural: {archaic: '#veñé(v)a', general: '#veñé(v)i', northern: '#veñ(iv)ié'},
						secondSingular: {general: '#veñé(v)i'},
						third: {general: '#veñé(v)a'}
					}
				},
				present: {
					irregular: {
						third: {general: '#vièn'/*, northern_oriental: undefined*/}
					},
					regular: {
						firstPlural: {central_western: '#veñímo', general: '#veñémo', northern: '#veñón', oriental: '#veñén'},
						firstSingular: {central_centralNorthern_lagunar_western1: '#vèño'/*, central_centralNorthern_lagunar_western2: '#vènc'*/, general: '#vèñe'},
						secondPlural: {central_western: '#veñí', general: '#veñé', northern_oriental: undefined},
						secondSingular: {general: '#vèñi'},
						third: {archaic: undefined, general: '#vèñe'/*, northern_oriental: '#vènc'*/}
					}
				}
			},
			infinitive: {
				simple: {
					regular: {all1: 'vèñer#', all2: 'vèñere'}
				}
			},
			participle: {
				imperfect: {
					regular: {all: 'veñénte'}
				},
				perfect: {
					regular: {
						general: {pluralFeminine: 'veñú(d)e', pluralMasculine: 'veñú(d)i', singularFeminine: 'veñú(d)a', singularMasculine1: 'veñú', singularMasculine2: 'veñú(d)o'},
						northern_oriental1: {pluralFeminine: 'veñéste', pluralMasculine: 'veñésti', singularFeminine: 'veñésta', singularMasculine: 'veñésto'},
						northern_oriental2: undefined
					}
				}
			},
			subjunctive: {
				imperfect: {
					regular: {
						firstPlural: {general: '#veñésimo', northern1: '#veñón(e/se)', northern2: '#veñis(i)ón(e/se)', oriental: '#veñ(is)én(e/se)'},
						firstSingular: {general: '#veñése'},
						secondPlural: {archaic: '#veñése', general: '#veñési', northern: '#veñ(is)ié(de/ge)'},
						secondSingular: {general: '#veñési'},
						third: {general: '#veñése'}
					}
				},
				present: {
					regular: {
						firstPlural: {central_western: '#veñímo', general: '#veñémo', northern: '#veñón(e)', oriental: '#veñén(e)'},
						firstSingular: {general: '#vèña', northern_oriental: '#vèñe'},
						secondPlural: {centralNorthern: undefined, central_western: '#veñí', general: '#veñé', northern_oriental1: '#veñé(de/ge)', northern_oriental2: undefined},
						secondSingular: {general: '#vèñi'},
						third: {general: '#vèña', northern_oriental1: '#vèñe'/*, northern_oriental2: '#vènc'*/}
					}
				}
			}
		};

		deepEqual(paradigm, expected, 'vèñer');
	});

	QUnit.test('tràer', function(){
		var verb = new Verb('tràer');

		var themes = Themizer.generate(verb, 'none');

		var paradigm = Paradigm.generate(verb, themes);
		delete paradigm.applyDialectalVariations;

		var expected = {
			conditional: {
				simple: {
					irregular: {
						archaic: '#traràve',
						firstPlural: {general: '#trarésimo', northern: '#trar(is)(i)ón(se)', oriental: '#trar(is)én(se)'},
						firstSingular: {general: '#traría', northern_oriental: '#traríe'},
						secondPlural: {general: '#trarési', northern: '#trar(is)ié'},
						secondSingular: {general: '#traría'},
						third: {general: '#traría', northern_oriental: '#traríe'}
					},
					regular: {
						archaic: '#traeràve',
						firstPlural: {general: '#traerésimo', northern: '#traer(is)(i)ón(se)', oriental: '#traer(is)én(se)'},
						firstSingular: {general: '#traería', northern_oriental: '#traeríe'},
						secondPlural: {general: '#traerési', northern: '#traer(is)ié'},
						secondSingular: {general: '#traería'},
						third: {general: '#traería', northern_oriental: '#traeríe'}
					}
				}
			},
			gerund: {
				simple: {
					regular: {
						all: {regular1: 'traéndo#', regular2: undefined}
					}
				}
			},
			imperative: {
				present: {
					irregular: {
						secondPlural: {central_western: undefined, general: '#trè$', northern_oriental: '#tré$'},
						secondSingular: {general: '#trà$'}
					},
					regular: {
						secondPlural: {central_western: '#traí$', general: '#traé$', northern_oriental: undefined},
						secondSingular: {general: '#trài$'}
					}
				}
			},
			indicative: {
				future: {
					irregular: {
						firstPlural: {central_western: '#trarímo', general: '#trarémo', northern: '#trarón', oriental: '#trarén'},
						firstSingular: {central: '#trarò', general: '#trarà', northern_oriental: '#trarè'},
						secondPlural: {central_western: '#trarí', general: '#traré'},
						secondSingular: {general: '#trarà'},
						third: {general: '#trarà'}
					},
					regular: {
						firstPlural: {central_western: '#traerímo', general: '#traerémo', northern: '#traerón', oriental: '#traerén'},
						firstSingular: {central: '#traerò', general: '#traerà', northern_oriental: '#traerè'},
						secondPlural: {central_western: '#traerí', general: '#traeré'},
						secondSingular: {general: '#traerà'},
						third: {general: '#traerà'}
					}
				},
				imperfect: {
					regular: {
						firstPlural: {general: '#traé(v)imo', northern1: '#tra(i)ón(se)', northern2: '#traiv(i)ón(se)', oriental: '#tra(iv)én(se)'},
						firstSingular: {central: '#traé(v)o', general: '#traé(v)a', northern_oriental: '#traé(v)e'},
						secondPlural: {archaic: '#traé(v)a', general: '#traé(v)i', northern: '#tra(iv)ié'},
						secondSingular: {general: '#traé(v)i'},
						third: {general: '#traé(v)a'}
					}
				},
				present: {
					irregular: {
						firstSingular: {central_centralNorthern_lagunar_western: '#tràgo'},
						firstPlural: {central_western: undefined, general: '#trémo', northern: '#trón', oriental: '#trén'},
						secondPlural: {central_western: undefined, general: '#trè', northern_oriental: '#tré'},
						third: {general: '#trà'/*, northern_oriental: undefined*/}
					},
					regular: {
						firstPlural: {central_western: '#traímo', general: '#traémo', northern: '#traón', oriental: '#traén'},
						firstSingular: {central_centralNorthern_lagunar_western1: '#trào'/*, central_centralNorthern_lagunar_western2: '#trà'*/, general: '#tràe'},
						secondPlural: {central_western: '#traí', general: '#traé', northern_oriental: undefined},
						secondSingular: {general: '#trài'},
						third: {archaic: undefined, general: '#tràe'/*, northern_oriental: '#trà'*/}
					}
				}
			},
			infinitive: {
				simple: {
					irregular: {all1: 'tràr#', all2: 'tràre'},
					regular: {all1: 'tràer#', all2: 'tràere'}
				}
			},
			participle: {
				imperfect: {
					regular: {all: 'traénte'}
				},
				perfect: {
					irregular: {
						strong: {
							general: {pluralFeminine: 'tràte'/*, singularMasculine2: 'tràt'*/, pluralMasculine: 'tràti', singularFeminine: 'tràta', singularMasculine: 'tràto'}
						}
					},
					regular: {
						general: {pluralFeminine: 'traú(d)e', pluralMasculine: 'traú(d)i', singularFeminine: 'traú(d)a', singularMasculine1: 'traú', singularMasculine2: 'traú(d)o'},
						northern_oriental1: {pluralFeminine: 'traéste', pluralMasculine: 'traésti', singularFeminine: 'traésta', singularMasculine: 'traésto'},
						northern_oriental2: undefined
					}
				}
			},
			subjunctive: {
				imperfect: {
					regular: {
						firstPlural: {general: '#traésimo', northern1: '#tra(i)ón(e/se)', northern2: '#trais(i)ón(e/se)', oriental: '#tra(is)én(e/se)'},
						firstSingular: {general: '#traése'},
						secondPlural: {archaic: '#traése', general: '#traési', northern: '#tra(is)ié(de/ge)'},
						secondSingular: {general: '#traési'},
						third: {general: '#traése'}
					}
				},
				present: {
					irregular: {
						firstSingular: {central_centralNorthern_lagunar_western: '#tràga'},
						secondSingular: {general: '#tràgi'},
						third: {general: '#tràga'}
					},
					regular: {
						firstPlural: {central_western: '#traímo', general: '#traémo', northern: '#tra(i)ón(e)', oriental: '#traén(e)'},
						firstSingular: {general: '#tràa', northern_oriental: '#tràe'},
						secondPlural: {centralNorthern: undefined, central_western: '#traí', general: '#traé', northern_oriental1: '#traé(de/ge)', northern_oriental2: undefined},
						secondSingular: {general: '#trài'},
						third: {general: '#tràa', northern_oriental1: '#tràe'/*, northern_oriental2: undefined*/}
					}
				}
			}
		};

		deepEqual(paradigm, expected, 'tràer');
	});

	QUnit.test('tolér', function(){
		var verb = new Verb('tolér');

		var themes = Themizer.generate(verb, 'none');

		var paradigm = Paradigm.generate(verb, themes);
		delete paradigm.applyDialectalVariations;

		var expected = {
			conditional: {
				simple: {
					irregular: {
						archaic: '#toràve',
						firstPlural: {general: '#torésimo', northern: '#tor(is)(i)ón(se)', oriental: '#tor(is)én(se)'},
						firstSingular: {general: '#toría', northern_oriental: '#toríe'},
						secondPlural: {general: '#torési', northern: '#tor(is)ié'},
						secondSingular: {general: '#toría'},
						third: {general: '#toría', northern_oriental: '#toríe'}
					},
					regular: {
						archaic: '#toleràve',
						firstPlural: {general: '#tolerésimo', northern: '#toler(is)(i)ón(se)', oriental: '#toler(is)én(se)'},
						firstSingular: {general: '#tolería', northern_oriental: '#toleríe'},
						secondPlural: {general: '#tolerési', northern: '#toler(is)ié'},
						secondSingular: {general: '#tolería'},
						third: {general: '#tolería', northern_oriental: '#toleríe'}
					}
				}
			},
			gerund: {
				simple: {
					regular: {
						all: {regular1: 'toléndo#', regular2: undefined}
					}
				}
			},
			imperative: {
				present: {
					regular: {
						secondPlural: {central_western: '#tolí$', general: '#tolé$', northern_oriental: undefined},
						secondSingular: {general: '#tòli$'}
					}
				}
			},
			indicative: {
				future: {
					irregular: {
						firstPlural: {central_western: '#torímo', general: '#torémo', northern: '#torón', oriental: '#torén'},
						firstSingular: {central: '#torò', general: '#torà', northern_oriental: '#torè'},
						secondPlural: {central_western: '#torí', general: '#toré'},
						secondSingular: {general: '#torà'},
						third: {general: '#torà'}
					},
					regular: {
						firstPlural: {central_western: '#tolerímo', general: '#tolerémo', northern: '#tolerón', oriental: '#tolerén'},
						firstSingular: {central: '#tolerò', general: '#tolerà', northern_oriental: '#tolerè'},
						secondPlural: {central_western: '#tolerí', general: '#toleré'},
						secondSingular: {general: '#tolerà'},
						third: {general: '#tolerà'}
					}
				},
				imperfect: {
					regular: {
						firstPlural: {general: '#tolé(v)imo', northern1: '#tol(i)ón(se)', northern2: '#toliv(i)ón(se)', oriental: '#tol(iv)én(se)'},
						firstSingular: {central: '#tolé(v)o', general: '#tolé(v)a', northern_oriental: '#tolé(v)e'},
						secondPlural: {archaic: '#tolé(v)a', general: '#tolé(v)i', northern: '#tol(iv)ié'},
						secondSingular: {general: '#tolé(v)i'},
						third: {general: '#tolé(v)a'}
					}
				},
				present: {
					irregular: {
						firstSingular: {central_centralNorthern_lagunar_western: '#tògo'},
					},
					regular: {
						firstPlural: {central_western: '#tolímo', general: '#tolémo', northern: '#tolón', oriental: '#tolén'},
						firstSingular: {central_centralNorthern_lagunar_western1: '#tòlo'/*, central_centralNorthern_lagunar_western2: '#tòl'*/, general: '#tòle'},
						secondPlural: {central_western: '#tolí', general: '#tolé', northern_oriental: undefined},
						secondSingular: {general: '#tòli'},
						third: {archaic: undefined, general: '#tòle'/*, northern_oriental: '#tòl'*/}
					}
				}
			},
			infinitive: {
				simple: {
					irregular: {all1: 'tòr#', all2: 'tòre'},
					regular: {all1: 'tolér#', all2: 'tolére'}
				}
			},
			participle: {
				imperfect: {
					regular: {all: 'tolénte'}
				},
				perfect: {
					irregular: {
						strong: {
							general: {pluralFeminine: 'tòlte'/*, singularMasculine2: 'tòlt'*/, pluralMasculine: 'tòlti', singularFeminine: 'tòlta', singularMasculine: 'tòlto'}
						}
					},
					regular: {
						general: {pluralFeminine: 'tolú(d)e', pluralMasculine: 'tolú(d)i', singularFeminine: 'tolú(d)a', singularMasculine1: 'tolú', singularMasculine2: 'tolú(d)o'},
						northern_oriental1: {pluralFeminine: 'toléste', pluralMasculine: 'tolésti', singularFeminine: 'tolésta', singularMasculine: 'tolésto'},
						northern_oriental2: undefined
					}
				}
			},
			subjunctive: {
				imperfect: {
					regular: {
						firstPlural: {general: '#tolésimo', northern1: '#tol(i)ón(e/se)', northern2: '#tolis(i)ón(e/se)', oriental: '#tol(is)én(e/se)'},
						firstSingular: {general: '#tolése'},
						secondPlural: {archaic: '#tolése', general: '#tolési', northern: '#tol(is)ié(de/ge)'},
						secondSingular: {general: '#tolési'},
						third: {general: '#tolése'}
					}
				},
				present: {
					irregular: {
						firstSingular: {central_centralNorthern_lagunar_western: '#tòga'},
						secondSingular: {general: '#tògi'},
						third: {general: '#tòga'}
					},
					regular: {
						firstPlural: {central_western: '#tolímo', general: '#tolémo', northern: '#tol(i)ón(e)', oriental: '#tolén(e)'},
						firstSingular: {general: '#tòla', northern_oriental: '#tòle'},
						secondPlural: {centralNorthern: undefined, central_western: '#tolí', general: '#tolé', northern_oriental1: '#tolé(de/ge)', northern_oriental2: undefined},
						secondSingular: {general: '#tòli'},
						third: {general: '#tòla', northern_oriental1: '#tòle'/*, northern_oriental2: '#tòl'*/}
					}
				}
			}
		};

		deepEqual(paradigm, expected, 'tolér');
	});

	QUnit.test('èser', function(){
		var verb = new Verb('èser');

		var themes = Themizer.generate(verb, 'none');

		var paradigm = Paradigm.generate(verb, themes);
		delete paradigm.applyDialectalVariations;

		var expected = {
			conditional: {
				simple: {
					irregular: {
						archaic: 'seràve',
						firstPlural: {general: 'serésimo', northern: 'ser(is)(i)ón(se)', oriental: 'ser(is)én(se)'},
						firstSingular: {general: 'sería', northern_oriental: 'seríe'},
						secondPlural: {general: 'serési', northern: 'ser(is)ié'},
						secondSingular: {general: 'sería'},
						third: {general: 'sería', northern_oriental: 'seríe'}
					}
				}
			},
			gerund: {
				simple: {
					regular: {
						all: {archaic: 'siàndo', regular1: 'eséndo', regular2: undefined}
					}
				}
			},
			imperative: {
				present: {
					irregular: {
						secondPlural: {central_western: 'sí$', general: 'sé$', northern_oriental: undefined},
						secondSingular: {general: 'sí$'}
					}
				}
			},
			indicative: {
				future: {
					irregular: {
						firstPlural: {central_western: 'serímo', general: 'serémo', northern: 'serón', oriental: 'serén'},
						firstSingular: {central: 'serò', general: 'serà', northern_oriental: 'serè'},
						secondPlural: {central_western: 'serí', general: 'seré'},
						secondSingular: {general: 'serà'},
						third: {general: 'serà'}
					}
				},
				imperfect: {
					irregular: {
						firstPlural: {general: 'èrimo', northern1: 'er(i)ón(se)', northern2: 'eriv(i)ón(se)', oriental: 'er(iv)én(se)'},
						firstSingular: {central: 'èro', general: 'èra', northern_oriental: 'ère'},
						secondPlural: {archaic: 'èra', general: 'èri', northern: 'er(iv)ié'},
						secondSingular: {general: 'èri'},
						third: {general: 'èra'}
					}
				},
				present: {
					irregular: {
						firstPlural: {central_western: 'símo', general: 'sémo', northern: 'són', oriental: 'sén'},
						firstSingular: {general: 's(i)ón'},
						secondPlural: {central_western: 'sí', general: 'sé', northern_oriental: undefined},
						secondSingular: {general: 'si'},
						third: {archaic: 'é', general: 'sé'/*, northern_oriental: undefined*/}
					}
				}
			},
			infinitive: {
				simple: {
					regular: {all1: 'èser', all2: 'èsere'}
				}
			},
			participle: {
				imperfect: {
					regular: {all: 'esénte'}
				},
				perfect: {
					irregular: {
						general: {pluralFeminine: 'stà(d)e', pluralMasculine: 'stà(d)i', singularFeminine: 'stà(d)a', singularMasculine1: 'stà', singularMasculine2: 'stà(d)o'},
						northern_oriental1: {pluralFeminine: 'stàste', pluralMasculine: 'stàsti', singularFeminine: 'stàsta', singularMasculine: 'stàsto'}
					},
					regular: {
						general: {pluralFeminine: 'esú(d)e', pluralMasculine: 'esú(d)i', singularFeminine: 'esú(d)a', singularMasculine1: 'esú', singularMasculine2: 'esú(d)o'},
						northern_oriental1: {pluralFeminine: 'eséste', pluralMasculine: 'esésti', singularFeminine: 'esésta', singularMasculine: 'esésto'},
						northern_oriental2: undefined
					}
				}
			},
			subjunctive: {
				imperfect: {
					irregular: {
						firstPlural: {general: 'fúsimo', northern1: 'fus(i)ón(e/se)', northern2: 'fusis(i)ón(e/se)', oriental: 'fus(is)én(e/se)'},
						firstSingular: {general: 'fúse'},
						secondPlural: {archaic: 'fúse', general: 'fúsi', northern: 'fus(is)ié(de/ge)'},
						secondSingular: {general: 'fúsi'},
						third: {general: 'fúse'}
					}
				},
				present: {
					irregular: {
						firstPlural: {central_western: 'sipímo', general: 'sipiémo', northern: 'sipión(e)', oriental: 'sipién(e)'},
						firstSingular: {general: 'sípia', northern_oriental: 'sípie'},
						secondPlural: {centralNorthern: undefined, central_western: 'sipí', general: 'sipié', northern_oriental1: 'sipié(de/ge)', northern_oriental2: undefined},
						secondSingular: {general: 'sípi'},
						third: {general: 'sípia', northern_oriental1: 'sípie'/*, northern_oriental2: undefined*/}
					}
				}
			}
		};

		deepEqual(paradigm, expected, 'èser');
	});

	QUnit.test('avér', function(){
		var verb = new Verb('avér');

		var themes = Themizer.generate(verb, 'none');

		var paradigm = Paradigm.generate(verb, themes);
		delete paradigm.applyDialectalVariations;

		var expected = {
			conditional: {
				simple: {
					regular: {
						archaic: '#averàve',
						firstPlural: {general: '#averésimo', northern: '#aver(is)(i)ón(se)', oriental: '#aver(is)én(se)'},
						firstSingular: {general: '#avería', northern_oriental: '#averíe'},
						secondPlural: {general: '#averési', northern: '#aver(is)ié'},
						secondSingular: {general: '#avería'},
						third: {general: '#avería', northern_oriental: '#averíe'}
					}
				}
			},
			gerund: {
				simple: {
					regular: {
						all: {archaic: 'abiàndo#', regular1: 'avéndo#', regular2: undefined}
					}
				}
			},
			imperative: {
				present: {
					irregular: {
						secondSingular: {general: '#à$'}
					},
					regular: {
						secondPlural: {central_western: '#aví$', general: '#avé$', northern_oriental: undefined}
					}
				}
			},
			indicative: {
				future: {
					regular: {
						firstPlural: {central_western: '#averímo', general: '#averémo', northern: '#averón', oriental: '#averén'},
						firstSingular: {central: '#averò', general: '#averà', northern_oriental: '#averè'},
						secondPlural: {central_western: '#averí', general: '#averé'},
						secondSingular: {general: '#averà'},
						third: {general: '#averà'}
					}
				},
				imperfect: {
					regular: {
						firstPlural: {general: '#avé(v)imo', northern1: '#av(i)ón(se)', northern2: '#aviv(i)ón(se)', oriental: '#av(iv)én(se)'},
						firstSingular: {central: '#avé(v)o', general: '#avé(v)a', northern_oriental: '#avé(v)e'},
						secondPlural: {archaic: '#avé(v)a', general: '#avé(v)i', northern: '#av(iv)ié'},
						secondSingular: {general: '#avé(v)i'},
						third: {general: '#avé(v)a'}
					}
				},
				present: {
					irregular: {
						firstSingular: {central_centralNorthern_lagunar_western: '#ò', general: '#à/è'},
						secondSingular: {general: '#à'},
						third: {archaic: undefined, general: '#à'/*, northern_oriental: undefined*/}
					},
					regular: {
						firstPlural: {central_western: '#avímo', general: '#avémo', northern: '#avón', oriental: '#avén'},
						secondPlural: {central_western: '#aví', general: '#avé', northern_oriental: undefined}
					}
				}
			},
			infinitive: {
				simple: {
					regular: {all1: 'avér#', all2: 'avére'}
				}
			},
			participle: {
				imperfect: {
					regular: {all: 'avénte'}
				},
				perfect: {
					regular: {
						general: {pluralFeminine: 'avú(d)e', pluralMasculine: 'avú(d)i', singularFeminine: 'avú(d)a', singularMasculine1: 'avú', singularMasculine2: 'avú(d)o'},
						northern_oriental1: {pluralFeminine: 'avéste', pluralMasculine: 'avésti', singularFeminine: 'avésta', singularMasculine: 'avésto'},
						northern_oriental2: undefined
					}
				}
			},
			subjunctive: {
				imperfect: {
					regular: {
						firstPlural: {general: '#avésimo', northern1: '#av(i)ón(e/se)', northern2: '#avis(i)ón(e/se)', oriental: '#av(is)én(e/se)'},
						firstSingular: {general: '#avése'},
						secondPlural: {archaic: '#avése', general: '#avési', northern: '#av(is)ié(de/ge)'},
						secondSingular: {general: '#avési'},
						third: {general: '#avése'}
					}
				},
				present: {
					irregular: {
						firstPlural: {central_western: undefined, general: '#apiémo', northern: '#apión(e)', oriental: '#apién(e)'},
						firstSingular: {general: '#àpia', northern_oriental: '#àpie'},
						secondPlural: {centralNorthern: undefined, central_western: undefined, general: '#apiè', northern_oriental1: '#apié(de/ge)', northern_oriental2: undefined},
						secondSingular: {general: '#àpi'},
						third: {general: '#àpia', northern_oriental1: '#àpie'/*, northern_oriental2: undefined*/}
					}
				}
			}
		};

		deepEqual(paradigm, expected, 'avér');
	});

});
