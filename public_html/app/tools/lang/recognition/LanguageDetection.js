/**
 * @class LanguageDetection
 *
 * @see {@link https://github.com/richtr/guessLanguage.js}
 * @see {@link https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes}
 *
 * @author Mauro Trevisan
 */
define(['tools/lang/recognition/NGrams', 'tools/lang/recognition/Markov', 'tools/data/ArrayHelper'], function(NGrams, Markov, ArrayHelper){

	var models = {
		'ita': '__21c24t7e15u6v7q7p17è3a11f3l9n4i9b2d9r2h1‘5s8g3m11_c5’2o4a8e2h8c’2e4è4’e1r5er11a18l2o5e7 13c6t5i5à1s3r3ra10 29v5n11t3c4d2_4i2g2r3a 21u8v9b13t8e14n28c31d21l11m12f6p29s25a9q4è1o1h3i7r3g3 u3n25c1s1un8a9 19s1o3c1’1q1g1na5 31m1_16s2t1 v4o6e11i8a3vo2l10 2ol10t7c5o5e8i5a6 1s1l1ò1lt4a3r7o2ò2ta8 26n7v3l3r3_8i1t3 b6a5e17o12u4r1i1ba5m4t1s1l1 1am5b4o3a1m4e1mb2i5a1bi8n4t5u1a1d1l2c2m1in12a6n1o11 8c8f4e4i2g4v1s1ò2 t6a5r8u7e9o5i3an10t6o12n2d22g7i4 1c11z2a1nt7o4e9a5r8i11ò2ì1to3 69r9_9o 21c25a20p14d22r24b5s15e22v3g4n3f4i8l11u5t4o1h1‘1q1m1 c7a34h31o30’6e5i2u2ca12r1p26l1u1d2t4_1s7 2m1c4n1ar14i1l3a3r4t4e16ò2à3d4m1o2v1s2 1ri15n2m3v5s1o6 9a1_1t3c2r2l1d1e1b1 e7 53b3d1g1n2r7_2e 22d14c27s32n18i15l29r6p16e18q9u7f9m7v5t13è1‘2b4a18o4g3z2 d7o8a17i22e19’2u3r2do6l5 16v3r2p3_1lc2e4i1ce6 11t24_4s1r8l1ch3e36é3i12he1 36 s12o10e27p3a14t12u12i15c5é3’1f1v1so6l7_11 17t2n2p1lo4 9_2n2r4 a13 17l23m1r4n14b2v9c1t2p5s2f2d3ve10d4r3l1v6 4_1c4s1n3g1ed2e4 1de8r5b3l12 4v2t1n2i1rl2a5e1la7_6 65t2n1r2p1s1a_1_44_t3u3e2i2tu4t7a2 1b1ut3t7o2a3tt5i7o46e5a6r1ti11 20g2_3v1n1e5t1r2c1l1a1i 20s16v4n9l4c10d7a14p6r5b2m8t2f5u2è2o1e9i5h5g3se10 33_5i1r3t1n10m1g1l1c1 n4e21o44u1a2ne6 21_6l11t1p1s1 i4n19l18e2 2nn4a28o1e2u1mo4r3 3l1d1or13a14n7t18d2z1b3e6i6r2m2o1s4ì1av6a10v3e7i1u1r1va8n4 22i1d1r2t1_2s1no6_7n44 26c1l2r1o_1_52_e4 10h3n1r1sp5e3o1u1a2i1pe8c2v2r17n10t2z1s1l1ec3i1c6e6ci7a13ò6n5o2l1 3v2ia8l1m3 13n1_3c3r4t7al14m3ò1i2l17a4d1u2 11e2z3b1t6v1s3lm1e4me7n11t2 6z1_1g6r1en11t26e8i2 3s7a4z1d5n2g1o1te6 14r5_3n3v2t3 l7a35e26’3o2u20ì2à2on8n27 22t8c1o3u1e3v1n 15s6c8v1g4r1m7o1a7q1b3t2p7l3f1u1sa10p2 10l8r7z2t1m1v2n1_2ap5e3p27i1r6ì1ev3a16o1v1da8v2r5_1 7l9t1s1n2vv2e2i2ro11 9s27p7m2_4n3l2v1i1g3f1 p5i12o22r16e21a12pi5ù6a3t1r1e4iù1 7ù 7c1b1n1m1d1r1l1co8s14m10r13_6n12t2 3l3os6a3s32e2c6ì9t3le7_4 27i3v4g1t6n1e_1_33_u2n5s1 r5e4o25a5i4u2re11g2 28p1s10b3m1l2_7v1c1n3eg5a1l8r1u1g1ga2l1r1lò1 5ò 15u1t2i5n5f3g1d4a11s3p1c2l2e1v1b1pp4u25o1e3i1pu3c24g1r1uc3c25i1ì1cc5e28i9o8h8a2et2t42r4di7 20s8n3e1o1g1a1el5l20 13i2í1a1ll5u2o9a23i1e6lu3t3p20n1ss6o25e11i4ò2a6u1po8i6r14 19t4_4s5v1c1oi5c1 6ò1a1b1ic7h1u2i5a1e1ò1c3hé1 3é 4l1p2e1n1st7a8e2r5i3o5ò1u1be7n10l3 7i2r1v1s1ei2 6_1 m4e16a18i5o3 q1u17qu3e8i4a14ue5l4s2r1 4t1hi5a4 7e1o2u1ma10v1d1l6 10n9m2_1t1z2i1 g5i6r8l5u2e1gi9o3u1 1ò2_1a4à1r1ù1io5r8 14l1_8n1rn3o4ò2a1su5a4b3l4o1n1ua4 7n11r5s1ad6r1a2e1o1d3 2dr3e1i2ò1is4s8e4p1o1_v4i4a1e1o1vi8e2n5 1c3d3g1s1v1ie5n3r7t4 1m1ni4 4m2_3g1_q1u7ui4 3_1o2r1’è1 4è 7u3a1f1d1l1p2t1 f6e6a3r6o7i7u3fe4t1c5r1l1bo4t2l3s6c4ot4t6r1e2é1ig3l4i1n1gl1i18li9a3 8t3n3o7_2b1ò2c1_p3o7r5e5rt3a12i8o8_è1 3mm2a3i1at5a10i2t6o8e1eb2o3b6es6t10e2c2p2a1s1fa2r3c1pr4e10i12o11ì1ep2a1p1pa8r6e1u2l1s1n3i1c1im3a3i2b1ac3c13e1q1tr4o10a13e7ò4op3p2r6o3ld1o1mi5 3s4_2n5o1om4a1p2e4i5nd6o14a4ò1i6e1r1si5i1c4 19g1b1ii1 1au2t1r2r 8l2b2m2a3s1v1i1g2rc5h1i1e1a2o1mp4e1o1r1ì1bb3e6i1a1nu3l1n1s1ul3l2i1 3rr3i5e2a2iv4i1o4a2ò2sc5o11a2u1ì2i3rd3a4i1ò1ub2i3e1it4o7a2t4i2i_1_18_a4 3p4n2l2fr3u1e2a3ru2g1s2ug2a1l1 o4g3c3h1r2og4n2g1o3ò1gn2i2o1ng5o5e1u1i5ò1go4l4 1i2r2_f3a1e1i1rò2 7_1l’1a4’a6s1b1d1l1v1c1as7s4c3e1a6i1p2o1cu4r1o1f2c1ur3o1a2e1_l5a4’1à2e1o1ab2i1b2_n2e3o1l 12b7p2l23g2s5v2f1c2d1t5n1m1ez1z2zz2’1o3z’1o1’o1r2ae1s1iu3n1l1d1ns4e1ò4o1a3_i3n2l6o1nc5o8i9a1h2e1il7 24t1ò3e2l1m1i1up2o19a1fo4s3r5c1g1iò2 10_1_b1u2bu3o2s2i2uo4n2l1i1r2_d4i4o3e1u1_r1i2ov2e4a1ai3 6_4o1sì2 8_1ì 11p2l2v2f2d2c1e1s1b1m1q1gr4e1a4o3i1em2b1p2 è2 3_1nf2o1i3rz1e1ze1r1rà2_1 3à_1_1d’2o1u1là1 4à 5c2p2n1e2b1lì1 2oc3c8o1a1_h1a1ha2i5 1sò2 4_2sé2 1_2é_1_2_‘2 4_1‘ 4q1o1c1m1rb1i3id3i1e3a1ib2a1i3_s6a1e2i2’1o1c1ge2r2n1du2e3n1 ‘1_3‘_1_4_g2u2i1gu3a4e1i1fi4o5l4a2n2lí1i1íi1n1_m4i1a8o1e1u 1n1lz2ò2a1zò1 2ag2g1o1gg2i2e1nz1a3za3n1r1 2rs4o1a1e6i1lb1e1ò_1_5az2z2i2zo2l1 2us3c2s4a1cì2 2_1nv2e1i1è_1_1rm2i1e2rì2 1_1d 2e1a2dò1 2’u1n1uf1f2ff3i2e1o1ir6ò1t1e1a1o2l1vò1 2rv1e1oh1 1h 1m1zi3o1a1t2 h2o4a5ho1 4nò1 4tò1 5eh1i3af1f2s’2a1e1dd2o2e1ià1 1fu3c1o2m1lv1a1sf1o1br1i1vu1t1pì1 2ì_1_3sv1e1cò1 1tì1 1n’1a1ls2e1i3vr1e1ud1i1od1o1 z1i2nq1u1cq1u1of1u1um1o1gò2 1_1té1 1',
		'vec-tv':   '__25j2i21n36ƚ27s26e78d20t28u3l3k44v14p24b4g7m31à2x4a6ò2c1‘5f3r2ó1_j1è2jè2r66v1èr10a67t7s5x4 4_2i2v1e2l1ra14 110v9d7m3s9_12r8n11l1ƚ1k3o1ñ1b1a 27n17‘24t28d74p65k59ƚ43j14m40a14b27g31s69f12e34i27v25x10o3u11r20l2è1ñ2c1ò1 1 n7a12ò18o53e8à1i2’1na4 39_17r24k1 ‘6o13n19l81v11ƚ2t7‘o1l13ol7t18s7 11p3_1m2i1lt6a14e2r17à4o2i3ta11_23 33b17k3n14g1r20j3m1s1d1a_1_99_i2n5 16in17t19p6k6a12d7 26s6v5m1ɉ1à3e1é1g2o1b1_1nt8’2o27í6e34a9i22r13à3t’1 2’ 10u3ƚ5d2ò1t1v1n1a3ú1l1 u3n53x1d1un5 54a7_2i2o2n 19s7t10d13f19p15l6m9ƚ3e2i2b4a2k14c1r1g4n1à1v3 s15è3e60ó30a17t33ú6k23i6o31u6p6ò2í2c2v1sè3r3 2ƚ2rt6o8a19e12à5i4u2to8 84x7_21r16ƚ2n3k2c1o 23p26s33u13d51r20f10k53e46ƚ27t18‘30n6a17b12v4x5i35l2m6g13ñ2o1ò2 p8a90i39o32ò19e21r16u10è2pa12e3ñ1r80’6l4s9v1n6x1k1_1p1ae1x3ex5e4ò2m1o1à1xe8_4 44r5n6g2ƚ1s1v1e_1_54_n5a4o19ò8e3i2 t9o23a23ó10ò11i5u21r8e14è4ox5a5è2e5i5à1xa5t5 14r4_7n1at9è6a4o4à4e6ú3u2i7r2tè6ƚ17s1l2n1 1r3èƚ4a6o2e6i13ƚa8 135_6d2n2s5l3r2v2 d11e107ò3a47o30í4i32r29à4’2ó1è5de12 96r9v4t2f1n3s5ñ1_1m5x1i1e 26k59s47p50m30e25g76v17ƚ59d48n42b20t23u14a13‘52f19l7x17i44r9ò2j4c1ɉ1ñ2 1 k8a44e126o44u31r3ò2ó14i1ka10n4r15m9t10x16s4 8l3_1p2an15p1k25t24s5d34b3i1_1 10x2è1í1e2a5à1np5a1r7o4i2e1añ3a15é1à2ña6_3r11 2v1n3f1_ƚ3a21e5u1pi10 28_3o3a5s2k2t1à1e2è2i 25b7v7k25i14g36e9d25a6‘16f8x13t12o2m3p23u2j21s22l3n8ƚ2r4c3ñ1ò1 b10è9o45e18u9r6a11à1i4ò1ó1bè3ƚ6l2s2ke6 130_1l4t3ƚ3n1se9 62n19t9ƚ2g1r11s2_6m4po8e1r11s9 18d8k3n8_1oe1s1es8e11o4p11t12g1i4a1k1 m7a66é15i6o12è12ò6e15ma11i9m5 24t6r18_6s10ñ16ƚ2n19g2ai2 8_1 v9é6e22i17è11à3a8o6ò3í1vé4d6a96_5 1éd1e6er13_7 20í2l2t2x2a6i1v1k2ò1s5g1r_1_31_s9ó2t4i1e5o5k3p3a2u1só2 30o2ó 13m11n7ƚ4t1v4s5d1p9‘6g1k1i3f2am4a9i7e7o1 ƚ7a113o8u7e23à9è1i4 j4è59e1a1u1 e4ƚ1l60 65n7eƚ5a10u1o5e2i2_e4 53l22ƚ1_2nò5n16 2t3s2_3òn2a17o1 a7n17l13 27s2k3r3f1nk6o17a10i1u3ò1r1ko12r15s4m25 34n21l9_12ƚ6v2f1a1p1or13a37t13n18i7e3è3m7l1 3s1d1x1à1i_1_46st8a11à13o25r15e5í3i8è1bo5n20s22k4 2_1on15a5p1t18d4o4_6e2 15i5è1s5f1b2ó1x1dò3n1r1p4no7 62r4x1n1a8v6_3sa8v7 23r30_6n2s2t1l2av4e12é98a15è2ve12n5ƚ2 12d4j8r10c2s8ñ8_2v2m2en12d5_10p7t54 9s30g1b1a7à2e2i1nd8o29a15i6e5à6r4é2è2do10 27p6l7v6s8r8n1m5g1_2os7a4o17k22t7e8ú2i1da7r17 55v2n1_3l1s1ar18g7e43l13o25a7k16d7t6 98s9ò7m1i6_20à15í9x2é3rg2e8o1ge4_2 68v1n1 g4e57a124o5r11ga6v105r5 17t3n2_1éa2 108_2ku8x4a18s7e8r4f1è3à3ux5í1e1o2m1i3xí1o1ío2 14_2ab2a16i2ba9r20t7g1s1n2k1ƚ1x1l1re15t9_9 25n12s16a3b1r7v2c1o1m15x2p1k1et7o10i7a12e5à1è2r1ƚu5d1_2n4s1 2ud1o2 r5o20a7e20i13ò1ro12s16 35m1_6p4n4k5f1ƚ1b2v2x1so8 30_15’5t5n5l9r6ƚ3 f8o18a21i33u3à1ò2r5e1fo3g5r14n1og2o5e1go4 8ƚ2_3r1_d7a5è4’1o5i1e1ò3ua4n8 7t2l2tà4a3 23n2i6àa2 11_3be6n17l1 1_1s1x1n_1_20_t6u1a10e4o2ò7i4tu4t22 3r1n2ut7i12a8é1o7è12à2e2ti11 34_11r13v2ƚ1n5s1m3l1e2a1 i3 88n62d1ak7à3ò2e1a2i2o1u3kà2 4a1à 20c1d22v4t7m7s10‘3i13a2p10k14u6f1g1ƚ8e4x2n1b1ò1 c3a3è3ò1ca5m1p2r1o2 1rl6a4i7ú1u1o3e1la4 10_1r2o1o_1_100ƚo5 11r7x1n3_1op3a2i2o7va6 10r17n13s2_2t1pr4e10o9i3è1_u1n3dí2 3x1í 5s1k1m1t1d1si16k3à8e3t8ò2l1 5g2p1m2o5_2a1n2è1r1ik3o4à1a2om5e22o2i1a6ò1me9 21s1n20ƚ1_5t5o1a1i1fa6t3r11s3m5d2n1fi7à15o5e1ò3s1n9u2ià3 23_2n1ls4e6i1à1a1_l2a2o1di12x11r3t13 6s1m4_2f1o1g2è1n1ix5e3é4o1a1n2_k7a8o6ó8e10i3u8r1el1 105l 21m11p16s19b24g33l15j23x8r7e3d8t8k13ò11n1v5f4ú2ƚ1i1a2mé3 14a1t1é 13b6g2n6m4ƚ1i2s2a1d1e2k1‘2f1_v4à6a6e1o1và2 10i4r 19k24t10ñ1d14p11l2s11i8f7a6v6m8e6ƚ9u3ò1n4x1b3tó2 9a1_p6a14ò2e2o3u2i1rk3é14a3u1ké2 13_1tí3o5i1a3mi5a1n8_3 4r4ia7 5r2_2x1n6s1ƚ1as7a19i7è2e12à7o3t1pò4r19s3j1t1òr11t21a3 4x1o2d1i2s1v2m1b1ag4e1o1a1r1tò4k12r5s1ƚ1òk2o6_6bu2t9x1ir7o5e2 6à1a4m2_2sú4_1 3i2o2ú_1_1rd5a3o3i1à1e1te11 45_14n9ƚ2l18s5r2v1ñ1g1m1a’1 6tr7a25i10e5u1o10à4ò1ad4a5e1i3è3‘n3d16 2k2rn4o5a10e1à2 ñ2e5a3ñe6n5 3r3v1s1_1ns7a17i14o2t4à7e1u1rs4e6a8o5è2sk5o42u2a3e1i1al9 9e1t20_1s1b1k3d2m1óo1_2ov6e7o20è2i3à1ú1vi8v2a4s8e2_1 3d1è1iv4é2a7o2à4kó2 15r7dr3i24e6í3ri12o24m4n1 16s1v11_5k1a2r1e3g1io6 22_6r4x3ƚ1n2rò6_2 3l1x2m1s2ò_1_6 l5o17à6a8è5’3lo3v18 2_1vo8 12_10ƚ4x3l2j1r1d1‘l1 83 x7a3e33o8ó1v6b4g1‘v4u1é2e5ú3vu1o1uo1 3id2è1a1dè4a1s10l3r2èa1 1 o3 2x2r2fu1s3us4e3i7t1í1aj1a3ja5l1 3ƚ1k1r3le4ñ1_1m1 1eñ5e5a3é4u3ú1ng2a1r2‘ƚ1o4it6o15u2a4e1à2ò1_b4o1e1a1è1pe4r2n20t4x2rí6k1a4o6e3s1x1ík1o1oƚ6o4i4a4à1e6u1là2 5_1sp7o7e4ò2u1i1a3è2kr2e4o1ea2n3_1_g3r2a1e4gr5a13o3e1ò1í1ie7 4t1n3s2_1m1g1u 7d2v1ƚ2i1l1e1s1o’1 5kò2s1r4òs5a2o1t5e1i1ot2o5a1vè3r10ñ4c1_m6é1a21e4o3à1ó1aƚ4a3e1ú1í1_à2b1l1àb1i1bi3t1a4à2is6t9i2o1a1à1u4im2a8o5ò 6d2p1k1b1m2ƚ1eg4u1a3e1o1gu1r1ur6o1t1í1a1è1à1eb1a1tú1o3úo1 10mo10ƚ1d3r2j5 37_5n2s2l1m1ƚi3n1 19_8ed2i1a3ax2a17e2iò2 2ƚ3u_1_2fà2s1 1às2i2e1il2_1 1l_1_8ès4o9e1t5a1br3i2a4e2rm3e3i5í3èñ1e4li3_3 5k1su5p2s1 4n4x1up2i1l1xè2i1ƚ1èi1_3_x3e2b1v1è 4i1p1u1s1rà5 16_2a2e1i1mè3j8x4d1èj1o8jo2 5_5d’1 3 ò4ñ5c2m11r2òñ2i7o1ñi2 7u1mò4d2r4t2_1òd1o2ue2s1ƚ7nv3o1i1e3ƚà3 4_5g1èx2o3a1xo5 11_1t1r4l1ú 3n1f1u1ƚe8_3 29v1n1ñ5t2g1s1_a4 2h2l1n1ór1e7ej4e1a3à3è1je2_1r2_ò1ñ2ne4 16o2t1m1ev4a7e3o2i1od5e7à2è1é3a1 è1s1ok4o7è4à1e2à_1_14fò1r3sà3 10_2a4fr3o1é1a3bà1t1àt1e1k_1_6ki3 5è2n1eo3d2l1_1dà4 9a2_1i1lè2t5m1èt3o6i2a2ig3à1ò1a3gà1 1rx2e8a2kè1l4èl2_5 6lp2o2i1ec1e3ce2t2 1íi1 1uf1i1ef1a1of2o1à1ía2 8_2ip1i1nm1a1vò2s1j2gò1 1xb2a4r1uè1r3òj2a2o1pu2l1t12ul1x1lx1a1é_1_6ru2k1m1uk1o1nb4e3r1o2u1òc1i2ci1 2xé2a3n1òl2e1t1té1a1ñé3a3v1r1mà1s1rè4s2 1ƚ1r1if1a1sò2r1n1xi3_2 4n3iè3t2r4n1xó1v1óv1a2ni3 8s4n1sg1r1iƚ1i1oj2è5o1òm1o12òt2e5o2ob1l2bl2è1e1èm1i1àn3d2x1t1oa3l7 1r1em5o22a3ò2è1e2òƚ1i4_c1a1ap3a2ò1í2‘t1e7ao3r1_2 1xò2l1ñ1úi1t2sí2 2p1_‘3ƚ2l2n1cè2i2o1nx3o1e2i1ƚú1x1úx1e2nè2e1r1èe1 1ƚè1t1nà4s1a1 6i1xv2e5o2jà1 3dó1 1_f2ò1i2èv1e1uà3 1n1_1iu2n1m2xn1a2év1e1ré3 2g1a1xm2e1a1ah1 2h 1p2sc1a2lú1x1lm2o2a1ài2 13_1nɉ1a1ɉa1s1ei2_1 1mí3_1o1a1í_1_1èn2e1 1rv1e4lb1a2ní1o1oc1à1cà1 1pè2t2r2ñu2o2a1ñú1o1òx2o1a1cò1p1òp2a1o4èd1i1íe1 3 ú1l3úl1t3íx2e1o1nf1o1én1d1èo1 1l’2 2a1lu1x1dé2 1a4ét1e1sv1e1ég1o1ñà2e1i1àe1 2ér1g1vú1o4 ɉ1à1ɉà1x1àx1e1 à1l1àl2b1s1né1a1èc1a1lk2e2o1bò1t1af1a2ep1a1rb1o1mó1v1íp1i1ld2i1e1àg1r1fe1r1ís1i1bó1j1ój1e1’a1k1_r2u1o1um2a1e2ju1t1pl1i1óa1 1ƚí1o1xà2 1a1  3 2u1e1_ó1ñ1óñ1i1pí2a1o1n’1 1xg1r1ek1o1nó1s1ós1e1ví1a1ño1 1',
		'vec-blfe': '__24j2i21n36l30s26e78d20t28u3k44v14p24b4g7m31à2x4a6ò2c1‘5f3r2ó1_j1è2jè2r66v1èr10a67t7s5x4 4_2i2v1e2l1ra13 110v9d7m3s9_12r8n11l2k3o1ñ1b1a 26n17‘24t28d74p65k59l45j14m40a14b27g31s69f12e34i27v25x10o3u11r20è1ñ2c1ò1 1 n7a12ò18o53e8à1i2’1na4 39_17r24k1 ‘5o13n19l83v11t7‘o1l13ol12t18s7o4 11i5a4à1e6p3_1m2u1lt6a14e2r17à4o2i3ta11_23 33b17k3n14g1r20j3m1s1d1a_1_99_i2n5 16in17t19p6k6a12d7 26s6v5m1ɉ1à3e1é1g2o1b1_1nt8’2o27í6e34a9i22r13à3t’1 2’ 9u3l6d2ò1t1v1n1a3ú1 u3n53x1d1un5 54a7_2i2o2n 18s7t10d13f19p15l9m9e2i2b4a2k14c1r1g4n1à1v3 s15è3e60ó30a17t33ú6k23i6o31u6p6ò2í2c2v1sè3r3 2l2rt6o8a19e12à5i4u2to8 84x7_21r16l2n3k2c1o 22p26s33u13d51r20f10k53e46l29t18‘30n6a17b12v4x5i35m6g13ñ2o1ò2 p8a90i39o32ò19e21r16u10è2pa12e3ñ1r80’6l4s9v1n6x1k1_1p1ae1x3ex5e4ò2m1o1à1xe8_4 44r5n6g2l1s1v1e_1_54_n5a4o19ò8e3i2 t9o23a23ó10ò11i5u21r8e14è4ox5a5è2e5i5à1xa5t5 14r4_7n1at9è6a4o4à4e6ú3u2i7r2tè5l19s1n1 1r3èl6a6o2e6i13_5 6la9 145_7r4d2n2o1s5l3v2 d11e107ò3a47o30í4i32r29à4’2ó1è5de12 96r9v4t2f1n3s5ñ1_1m5x1i1e 25k59s47p50m30e25g76v17l66d48n42b20t23u14a13‘52f19x17i44r9ò2j4c1ɉ1ñ2 1 k8a44e126o44u31r3ò2ó14i1ka10n4r15m9t10x16s4 8l3_1p2an15p1k25t24s5d34b3i1_1 10x2è1í1e2a5à1np5a1r7o4i2e1añ3a15é1à2ña6_3r11 2v1n3f1_l4a23e5o1u1pi10 28_3o3a5s2k2t1à1e2è2i 24b7v7k25i14g36e9d25a6‘16f8x13t12o2m3p23u2j21s22l5n8r4c3ñ1ò1 b10è9o45e18u9r6a11à1i4ò1ó1bè2l8s2ke5 130_1l7t3n1se9 62n19t9l2g1r11s2_6m4po8e1r11s9 18d8k3n8_1oe1s1es8e11o4p11t12g1i4a1k1 m7a66é15i6o12è12ò6e15ma11i9m5 24t6r18_6s10ñ16l2n19g2ai2 8_1 v9é6e22i17è11à3a8o6ò3í1vé4d6a96_5 1éd1e6er13_7 20í2l2t2x2a6i1v1k2ò1s5g1r_1_31_s9ó2t4i1e5o5k3p3a2u1só2 30o2ó 13m11n7l4t1v4s5d1p9‘6g1k1i3f2am4a9i7e7o1 l8a121o25à15u7e23è6’3i4 j4è59e1a1u1 e3l61 65n7el6a10u1 105o5e2i2_e3 53l23_2nò5n16 2t3s2_3òn2a17o1 a7n17l13 27s2k3r3f1nk6o17a10i1u3ò1r1ko11r15s4m25 34n21l15_12v2f1a1p1or13a37t13n18i7e3è3m7l1 3s1d1x1à1i_1_46st8a11à13o25r15e5í3i8è1bo5n20s22k4 2_1on15a5p1t18d4o4_6e2 15i5è1s5f1b2ó1x1dò3n1r1p4no7 62r4x1n1a8v6_3sa8v7 23r30_6n2s2t1l2av4e12é98a15è2ve12n5l2 12d4j8r10c2s8ñ8_2v2m2en12d5_10p7t54 9s30g1b1a7à2e2i1nd8o29a15i6e5à6r4é2è2do10 27p6l7v6s8r8n1m5g1_2os7a4o17k22t7e8ú2i1da7r17 55v2n1_3l1s1ar18g7e43l13o25a7k16d7t6 98s9ò7m1i6_20à15í9x2é3rg2e8o1ge4_2 68v1n1 g4e57a124o5r11ga6v105r5 17t3n2_1éa2 108_2ku8x4a18s7e8r4f1è3à3ux5í1e1o2m1i3xí1o1ío2 14_2ab2a16i2ba8r20t7g1s1n2k1l2x1re15t9_9 25n12s16a3b1r7v2c1o1m15x2p1k1et7o10i7a12e5à1è2r1lu6d1_2n4x1s1 2ud1o2 r5o20a7e20i13ò1ro12s16 35m1_6p4n4k5f1l1b2v2x1so7 30_15’5t5n5l12r6 f8o18a21i33u3à1ò2r5e1fo3g5r14n1og2o5e1go4 8l2_3r1_d7a5è4’1o5i1e1ò3ua4n8 7t2l2tà4a3 23n2i6àa2 11_3be6n17l1 1_1s1x1n_1_20_t6u1a10e4o2ò7i4tu4t22 3r1n2ut7i12a8é1o7è12à2e2ti10 34_11r13v2l2n5s1m3e2a1 i3 88n62d1ak7à3ò2e1a2i2o1u3kà2 4a1à 20c1d22v4t7m7s10‘3i13a2p10k14u6f1g1l8e4x2n1b1ò1 c3a3è3ò1ca5m1p2r1o2 1rl6a4i7ú1u1o3e1o_1_100lo6 13v18r7x1n3_2op3a2i2o7va6 10r17n13s2_2t1pr4e10o9i3è1_u1n3dí2 3x1í 5s1k1m1t1d1si16k3à8e3t8ò2l1 5g2p1m2o5_2a1n2è1r1ik3o4à1a2om5e22o2i1a6ò1me9 21s1n20l1_5t5o1a1i1fa6t3r11s3m5d2n1fi7à15o5e1ò3s1n9u2ià3 23_2n1ls4e6i1à1a1di12x11r3t13 6s1m4_2f1o1g2è1n1ix5e3é4o1a1n2_k7a8o6ó8e10i3u8r1l 20m11p16s19b24g33l16j23x8r7e3d8t8k13ò11n1v5f4ú2i1a2mé3 14a1t1é 13b6g2n6m4l1i2s2a1d1e2k1‘2f1_v4à6a6e1o1và2 10i4r 18k24t10ñ1d14p11l11s11i8f7a6v6m8e6u3ò1n4x1b3tó2 9a1_p6a14ò2e2o3u2i1rk3é14a3u1ké2 13_1tí3o5i1a3mi5a1n8_3 4r4ia7 5r2_2x1n6s1l1as7a19i7è2e12à7o3t1pò4r19s3j1t1òr11t21a3 4x1o2d1i2s1v2m1b1ag4e1o1a1r1tò4k12r5s1l1òk2o6_6bu2t9x1ir7o5e2 6à1a4m2_2sú4_1 3i2o2ú_1_1rd5a3o3i1à1e1te10 45_14n9l20s5r2v1ñ1g1m1a’1 6tr7a25i10e5u1o10à4ò1ad4a5e1i3è3‘n3d16 2k2rn4o5a10e1à2 ñ2e5a3ñe6n5 3r3v1s1_1ns7a17i14o2t4à7e1u1rs4e6a8o5è2sk5o42u2a3e1i1al12 9e2a3t20_1s1ú1b1k3d2m1í1óo1_2ov6e7o20è2i3à1ú1vi8v2a4s8e2_1 3d1è1iv4é2a7o2à4kó2 15r7dr3i24e6í3ri12o24m4n1 16s1v11_5k1a2r1e3g1io6 22_6r4x3l1n2rò6_2 3l1x2m1s2ò_1_6vo7 12_10l6x3j1r1d1‘l2 83o4 x7a3e33o8ó1v6b4g1‘v4u1é2e5ú3vu1o1uo1 3id2è1a1dè4a1s10l3r2èa1 1 o3 2x2r2fu1s3us4e3i7t1í1aj1a3ja4l2 3k1r3le9ñ6_4 30v1n1t2m1g1s1eñ5e5a3é4u3ú1ng2a1r2it6o15u2a4e1à2ò1_b4o1e1a1è1pe4r2n20t4x2rí6k1a4o6e3s1x1ík1o1là3 9_6g1sp7o7e4ò2u1i1a3è2kr2e4o1ea2n3_1_g3r2a1e4gr5a13o3e1ò1í1ie7 4t1n3s2_1m1g1u 6d2v1l3i1e1s1o’1 5kò2s1r4òs5a2o1t5e1i1ot2o5a1vè3r10ñ4c1_m6é1a21e4o3à1ó1_à2b1l1àb1i1bi3t1a4à2is6t9i2o1a1à1u4im2a8o5ò 6d2p1k1b1m2l1eg4u1a3e1o1gu1r1ur6o1t1í1a1è1à1eb1a1tú1o3úo1 10mo9l2d3r2j5 37_5n2s2m1li4n1_11 24k1ed2i1a3ax2a17e2iò2 2l3u_1_2fà2s1 1às2i2e1il3_1i1 1l_1_8ès4o9e1t5a1br3i2a4e2rm3e3i5í3èñ1e4su5p2s1 4n4x1up2i1l1xè2i1l1èi1_3_x3e2b1v1è 4i1p1u1s1rà5 16_2a2e1i1mè3j8x4d1èj1o8jo2 5_5d’1 3 ò4ñ5c2m11r2òñ2i7o1ñi2 7u1mò4d2r4t2_1òd1o2ue2s1l7nv3o1i1e3èx2o3a1xo5 11_1t1r4l1ú 3n1f1u1_a4 2h2l1n1ór1e7ej4e1a3à3è1je2_1r2_ò1ñ2ne4 16o2t1m1ev4a7e3o2i1od5e7à2è1é3a1 è1s1ok4o7è4à1e2à_1_14fò1r3sà3 10_2a4fr3o1é1a3bà1t1àt1e1k_1_6ki3 5è2n1eo3d2l1_1dà4 9a2_1i1lè2t6m1èt3o6i2a2ig3à1ò1a3gà1 1rx2e8a2kè1l4lp2o2i1ec1e3ce2t2 1íi1 1uf1i1ef1a1of2o1à1ía2 8_2ip1i1nm1a1vò2s1j2gò1 1xb2a4r1uè1r3òj2a2o1pu2l1t12ul1x1lx1a1é_1_6ru2k1m1uk1o1nb4e3r1o2u1òc1i2ci1 2xé2a3n1òl3e1i4t1té1a1ñé3a3v1r1mà1s1rè4s2 1l1r1if1a1sò2r1n1xi3_2 4n3iè3t2r4n1xó1v1óv1a2ni3 8s4n1sg1r1oj2è5o1òm1o12òt2e5o2ob1l2bl2è1e1èm1i1àn3d2x1t1oa3l7 1r1em5o22a3ò2è1e2_c1a1ap3a2ò1í2‘t1e7ao3r1_2 1xò2l1ñ1úi1t2sí2 2p1_‘2l4n1cè2i2o1nx3o1e2i1lú1x2úx1e2nè2e1r1èe1 1nà4s1a1 6i1xv2e5o2jà1 3dó1 1_f2ò1i2èv1e1uà3 1n1_1iu2n1m2xn1a2év1e1ré3 2g1a1xm2e1a1ah1 2h 1p2sc1a2lm2o2a1ài2 13_1nɉ1a1ɉa1s1ei2_1 1mí3_1o1a1í_1_1èn2e1 1rv1e4lb1a2ní1o1oc1à1cà1 1pè2t2r2ñu2o2a1ñú1o1òx2o1a1cò1p1òp2a1o4èd1i1íe1 3 ú1l3úl1t3íx2e1o1nf1o1én1d1èo1 1l’2 2a1dé2 1a4ét1e1sv1e1ég1o1ñà2e1i1àe1 2ér1g1vú1o4 ɉ1à1ɉà1x1àx1e1 à1l1àl2b1s1né1a1èc1a1lk2e2o1bò1t1af1a2ep1a1rb1o1mó1v1íp1i1ld2i1e1àg1r1fe1r1ís1i1bó1j1ój1e1’a1k1_r2u1o1um2a1e2ju1t1pl1i1óa1 1lí1o1xà2 1a1  3 2u1e1_ó1ñ1óñ1i1pí2a1o1n’1 1xg1r1ek1o1nó1s1ós1e1ví1a1ño1 1',
		'vec-ve':   '__25ɉ2i21n36ƚ27s26e78d20t28u3l3k44v14p24b4g7m31à2x4a6ò2c1‘5f3r2ó1_ɉ1è2ɉè2r66v1èr10a67t7s5x4 4_2i2v1e2l1ra14 110v9d7m3s9_12r8n11l1ƚ1k3o1ñ1b1a 27n17‘24t28d74p65k59ƚ43ɉ14m40a14b27g31s69f12e34i27v25x10o3u11r20l2è1ñ2c1ò1 1 n7a12ò18o53e8à1i2’1na4 39_17r24k1 ‘6o13n19l81v11ƚ2t7‘o1l13ol7t18s7 11p3_1m2i1lt6a14e2r17à4o2i3ta11_23 33b17k3n14g1r20ɉ3m1s1d1a_1_99_i2n5 16in17t19p6k6a12d7 26s6v5m1ɉ1à3e1é1g2o1b1_1nt8’2o27í6e34a9i22r13à3t’1 2’ 10u3ƚ5d2ò1t1v1n1a3ú1l1 u3n53x1d1un5 54a7_2i2o2n 19s7t10d13f19p15l6m9ƚ3e2i2b4a2k14c1r1g4n1à1v3 s15è3e60ó30a17t33ú6k23i6o31u6p6ò2í2c2v1sè3r3 2ƚ2rt6o8a19e12à5i4u2to8 84x7_21r16ƚ2n3k2c1o 23p26s33u13d51r20f10k53e46ƚ27t18‘30n6a17b12v4x5i35l2m6g13ñ2o1ò2 p8a90i39o32ò19e21r16u10è2pa12e3ñ1r80’6l4s9v1n6x1k1_1p1ae1x3ex5e4ò2m1o1à1xe8_4 44r5n6g2ƚ1s1v1e_1_54_n5a4o19ò8e3i2 t9o23a23ó10ò11i5u21r8e14è4ox5a5è2e5i5à1xa5t5 14r4_7n1at9è6a4o4à4e6ú3u2i7r2tè6ƚ17s1l2n1 1r3èƚ4a6o2e6i13ƚa8 135_6d2n2s5l3r2v2 d11e107ò3a47o30í4i32r29à4’2ó1è5de12 96r9v4t2f1n3s5ñ1_1m5x1i1e 25k59s47p50m30e25g76v17ƚ59d48n42b20t23u14a13‘52f19l7x17i44r9ò2ɉ5c1ñ2 1 k8a44e126o44u31r3ò2ó14i1ka10n4r15m9t10x16s4 8l3_1p2an15p1k25t24s5d34b3i1_1 10x2è1í1e2a5à1np5a1r7o4i2e1añ3a15é1à2ña6_3r11 2v1n3f1_ƚ3a21e5u1pi10 28_3o3a5s2k2t1à1e2è2i 25b7v7k25i14g36e9d25a6‘16f8x13t12o2m3p23u2ɉ21s22l3n8ƚ2r4c3ñ1ò1 b10è9o45e18u9r6a11à1i4ò1ó1bè3ƚ6l2s2ke6 130_1l4t3ƚ3n1se9 62n19t9ƚ2g1r11s2_6m4po8e1r11s9 18d8k3n8_1oe1s1es8e11o4p11t12g1i4a1k1 m7a66é15i6o12è12ò6e15ma11i9m5 24t6r18_6s10ñ16ƚ2n19g2ai2 8_1 v9é6e22i17è11à3a8o6ò3í1vé4d6a96_5 1éd1e6er13_7 20í2l2t2x2a6i1v1k2ò1s5g1r_1_31_s9ó2t4i1e5o5k3p3a2u1só2 30o2ó 13m11n7ƚ4t1v4s5d1p9‘6g1k1i3f2am4a9i7e7o1 ƚ7a113o8u7e23à9è1i4 ɉ5è59e1a1à1u1 e4ƚ1l60 65n7eƚ5a10u1o5e2i2_e4 53l22ƚ1_2nò5n16 2t3s2_3òn2a17o1 a7n17l13 27s2k3r3f1nk6o17a10i1u3ò1r1ko12r15s4m25 34n21l9_12ƚ6v2f1a1p1or13a37t13n18i7e3è3m7l1 3s1d1x1à1i_1_46st8a11à13o25r15e5í3i8è1bo5n20s22k4 2_1on15a5p1t18d4o4_6e2 15i5è1s5f1b2ó1x1dò3n1r1p4no7 62r4x1n1a8v6_3sa8v7 23r30_6n2s2t1l2av4e12é98a15è2ve12n5ƚ2 12d4ɉ8r10c2s8ñ8_2v2m2en12d5_10p7t54 9s30g1b1a7à2e2i1nd8o29a15i6e5à6r4é2è2do10 27p6l7v6s8r8n1m5g1_2os7a4o17k22t7e8ú2i1da7r17 55v2n1_3l1s1ar18g7e43l13o25a7k16d7t6 98s9ò7m1i6_20à15í9x2é3rg2e8o1ge4_2 68v1n1 g4e57a124o5r11ga6v105r5 17t3n2_1éa2 108_2ku8x4a18s7e8r4f1è3à3ux5í1e1o2m1i3xí1o1ío2 14_2ab2a16i2ba9r20t7g1s1n2k1ƚ1x1l1re15t9_9 25n12s16a3b1r7v2c1o1m15x2p1k1et7o10i7a12e5à1è2r1ƚu5d1_2n4s1 2ud1o2 r5o20a7e20i13ò1ro12s16 35m1_6p4n4k5f1ƚ1b2v2x1so8 30_15’5t5n5l9r6ƚ3 f8o18a21i33u3à1ò2r5e1fo3g5r14n1og2o5e1go4 8ƚ2_3r1_d7a5è4’1o5i1e1ò3ua4n8 7t2l2tà4a3 23n2i6àa2 11_3be6n17l1 1_1s1x1n_1_20_t6u1a10e4o2ò7i4tu4t22 3r1n2ut7i12a8é1o7è12à2e2ti11 34_11r13v2ƚ1n5s1m3l1e2a1 i3 88n62d1ak7à3ò2e1a2i2o1u3kà2 4a1à 20c1d22v4t7m7s10‘3i13a2p10k14u6f1g1ƚ8e4x2n1b1ò1 c3a3è3ò1ca5m1p2r1o2 1rl6a4i7ú1u1o3e1la4 10_1r2o1o_1_100ƚo5 11r7x1n3_1op3a2i2o7va6 10r17n13s2_2t1pr4e10o9i3è1_u1n3dí2 3x1í 5s1k1m1t1d1si16k3à8e3t8ò2l1 5g2p1m2o5_2a1n2è1r1ik3o4à1a2om5e22o2i1a6ò1me9 21s1n20ƚ1_5t5o1a1i1fa6t3r11s3m5d2n1fi7à15o5e1ò3s1n9u2ià3 23_2n1ls4e6i1à1a1_l2a2o1di12x11r3t13 6s1m4_2f1o1g2è1n1ix5e3é4o1a1n2_k7a8o6ó8e10i3u8r1el1 105l 21m11p16s19b24g33l15ɉ23x8r7e3d8t8k13ò11n1v5f4ú2ƚ1i1a2mé3 14a1t1é 13b6g2n6m4ƚ1i2s2a1d1e2k1‘2f1_v4à6a6e1o1và2 10i4r 19k24t10ñ1d14p11l2s11i8f7a6v6m8e6ƚ9u3ò1n4x1b3tó2 9a1_p6a14ò2e2o3u2i1rk3é14a3u1ké2 13_1tí3o5i1a3mi5a1n8_3 4r4ia7 5r2_2x1n6s1ƚ1as7a19i7è2e12à7o3t1pò4r19s3ɉ1t1òr11t21a3 4x1o2d1i2s1v2m1b1ag4e1o1a1r1tò4k12r5s1ƚ1òk2o6_6bu2t9x1ir7o5e2 6à1a4m2_2sú4_1 3i2o2ú_1_1rd5a3o3i1à1e1te11 45_14n9ƚ2l18s5r2v1ñ1g1m1a’1 6tr7a25i10e5u1o10à4ò1ad4a5e1i3è3‘n3d16 2k2rn4o5a10e1à2 ñ2e5a3ñe6n5 3r3v1s1_1ns7a17i14o2t4à7e1u1rs4e6a8o5è2sk5o42u2a3e1i1al9 9e1t20_1s1b1k3d2m1óo1_2ov6e7o20è2i3à1ú1vi8v2a4s8e2_1 3d1è1iv4é2a7o2à4kó2 15r7dr3i24e6í3ri12o24m4n1 16s1v11_5k1a2r1e3g1io6 22_6r4x3ƚ1n2rò6_2 3l1x2m1s2ò_1_6 l5o17à6a8è5’3lo3v18 2_1vo8 12_10ƚ4x3l2ɉ1r1d1‘l1 83 x7a3e33o8ó1v6b4g1‘v4u1é2e5ú3vu1o1uo1 3id2è1a1dè4a1s10l3r2èa1 1 o3 2x2r2fu1s3us4e3i7t1í1aɉ1a3ɉa6l1 3ƚ1k1s1r3le4ñ1_1m1 1eñ5e5a3é4u3ú1ng2a1r2‘ƚ1o4it6o15u2a4e1à2ò1_b4o1e1a1è1pe4r2n20t4x2rí6k1a4o6e3s1x1ík1o1oƚ6o4i4a4à1e6u1là2 5_1sp7o7e4ò2u1i1a3è2kr2e4o1ea2n3_1_g3r2a1e4gr5a13o3e1ò1í1ie7 4t1n3s2_1m1g1u 7d2v1ƚ2i1l1e1s1o’1 5kò2s1r4òs5a2o1t5e1i1ot2o5a1vè3r10ñ4c1_m6é1a21e4o3à1ó1aƚ4a3e1ú1í1_à2b1l1àb1i1bi3t1a4à2is6t9i2o1a1à1u4im2a8o5ò 6d2p1k1b1m2ƚ1eg4u1a3e1o1gu1r1ur6o1t1í1a1è1à1eb1a1tú1o3úo1 10mo10ƚ1d3r2ɉ5 37_5n2s2l1m1ƚi3n1 19_8ed2i1a3ax2a17e2iò2 2ƚ3u_1_2fà2s1 1às2i2e1il2_1 1l_1_8ès4o9e1t5a1br3i2a4e2rm3e3i5í3èñ1e4li3_3 5k1su5p2s1 4n4x1up2i1l1xè2i1ƚ1èi1_3_x3e2b1v1è 4i1p1u1s1rà5 16_2a2e1i1mè3ɉ8x4d1èɉ1o8ɉo2 5_5d’1 3 ò4ñ5c2m11r2òñ2i7o1ñi2 7u1mò4d2r4t2_1òd1o2ue2s1ƚ7nv3o1i1e3ƚà3 4_5g1èx2o3a1xo5 11_1t1r4l1ú 3n1f1u1ƚe8_3 29v1n1ñ5t2g1s1_a4 2h2l1n1ór1e7eɉ4e1a3à3è1ɉe2_1r2_ò1ñ2ne4 16o2t1m1ev4a7e3o2i1od5e7à2è1é3a1 è1s1ok4o7è4à1e2à_1_14fò1r3sà3 10_2a4fr3o1é1a3bà1t1àt1e1k_1_6ki3 5è2n1eo3d2l1_1dà4 9a2_1i1lè2t5m1èt3o6i2a2ig3à1ò1a3gà1 1rx2e8a2kè1l4èl2_5 6lp2o2i1ec1e3ce2t2 1íi1 1uf1i1ef1a1of2o1à1ía2 8_2ip1i1nm1a1vò2s1ɉ2gò1 1xb2a4r1uè1r3òɉ2a2o1pu2l1t12ul1x1lx1a1é_1_6ru2k1m1uk1o1nb4e3r1o2u1òc1i2ci1 2xé2a3n1òl2e1t1té1a1ñé3a3v1r1mà1s1rè4s2 1ƚ1r1if1a1sò2r1n1xi3_2 4n3iè3t2r4n1xó1v1óv1a2ni3 8s4n1sg1r1iƚ1i1oɉ2è5o1òm1o12òt2e5o2ob1l2bl2è1e1èm1i1àn3d2x1t1oa3l7 1r1em5o22a3ò2è1e2òƚ1i4_c1a1ap3a2ò1í2‘t1e7ao3r1_2 1xò2l1ñ1úi1t2sí2 2p1_‘3ƚ2l2n1cè2i2o1nx3o1e2i1ƚú1x1úx1e2nè2e1r1èe1 1ƚè1t1nà4s1a1 6i1xv2e5o2ɉà2 3x1dó1 1_f2ò1i2èv1e1uà3 1n1_1iu2n1m2xn1a2év1e1ré3 2g1a1xm2e1a1ah1 2h 1p2sc1a2lú1x1lm2o2a1ài2 13_1nɉ1a1ei2_1 1mí3_1o1a1í_1_1èn2e1 1rv1e4lb1a2ní1o1oc1à1cà1 1pè2t2r2ñu2o2a1ñú1o1òx2o1a1cò1p1òp2a1o4èd1i1íe1 3 ú1l3úl1t3íx2e1o1nf1o1én1d1èo1 1l’2 2a1lu1x1dé2 1a4ét1e1sv1e1ég1o1ñà2e1i1àe1 2ér1g1vú1o4àx1e1 à1l1àl2b1s1né1a1èc1a1lk2e2o1bò1t1af1a2ep1a1rb1o1mó1v1íp1i1ld2i1e1àg1r1fe1r1ís1i1bó1ɉ1óɉ1e1’a1k1_r2u1o1um2a1e2ɉu1t1pl1i1óa1 1ƚí1o1xà2 1a1  3 2u1e1_ó1ñ1óñ1i1pí2a1o1n’1 1xg1r1ek1o1nó1s1ós1e1ví1a1ño1 1'
	};

	var THRESHOLD = 0.4,
		MODEL_MARKOV = 'markov',
		//n-grams
//		MAX_SCORE_DIFFERENCE = -500;
		//markov
		MAX_SCORE_DIFFERENCE = -115;

	var PATTERN_TRIGRAMS = /([\s\S]{1,3})/g;
	var PATTERN_MARKOV_DATA = /([^\d]+?\d+)/g;
	var UNKNOWN_LANGUAGE = 'unknown';

	//unicode char greedy regex block range matchers
	var unicodeBlockTests = {
		'Basic Latin': /[\u0000-\u007F]/g,
		'Latin-1 Supplement': /[\u0080-\u00FF]/g,
		'Latin Extended-A': /[\u0100-\u017F]/g,
		'Latin Extended-B': /[\u0180-\u024F]/g,
		'IPA Extensions': /[\u0250-\u02AF]/g,
		'Spacing Modifier Letters': /[\u02B0-\u02FF]/g,
		'Combining Diacritical Marks': /[\u0300-\u036F]/g,
		'Greek and Coptic': /[\u0370-\u03FF]/g,
		'Cyrillic': /[\u0400-\u04FF]/g,
		'Cyrillic Supplement': /[\u0500-\u052F]/g,
		'Armenian': /[\u0530-\u058F]/g,
		'Hebrew': /[\u0590-\u05FF]/g,
		'Arabic': /[\u0600-\u06FF]/g,
		'Syriac': /[\u0700-\u074F]/g,
		'Arabic Supplement': /[\u0750-\u077F]/g,
		'Thaana': /[\u0780-\u07BF]/g,
		'NKo': /[\u07C0-\u07FF]/g,
		'Devanagari': /[\u0900-\u097F]/g,
		'Bengali': /[\u0980-\u09FF]/g,
		'Gurmukhi': /[\u0A00-\u0A7F]/g,
		'Gujarati': /[\u0A80-\u0AFF]/g,
		'Oriya': /[\u0B00-\u0B7F]/g,
		'Tamil': /[\u0B80-\u0BFF]/g,
		'Telugu': /[\u0C00-\u0C7F]/g,
		'Kannada': /[\u0C80-\u0CFF]/g,
		'Malayalam': /[\u0D00-\u0D7F]/g,
		'Sinhala': /[\u0D80-\u0DFF]/g,
		'Thai': /[\u0E00-\u0E7F]/g,
		'Lao': /[\u0E80-\u0EFF]/g,
		'Tibetan': /[\u0F00-\u0FFF]/g,
		'Burmese': /[\u1000-\u109F]/g,
		'Georgian': /[\u10A0-\u10FF]/g,
		'Hangul Jamo': /[\u1100-\u11FF]/g,
		'Ethiopic': /[\u1200-\u137F]/g,
		'Ethiopic Supplement': /[\u1380-\u139F]/g,
		'Cherokee': /[\u13A0-\u13FF]/g,
		'Unified Canadian Aboriginal Syllabics': /[\u1400-\u167F]/g,
		'Ogham': /[\u1680-\u169F]/g,
		'Runic': /[\u16A0-\u16FF]/g,
		'Pahawh Hmong': /[\u16B0-\u16B8]/g,
		'Tagalog': /[\u1700-\u171F]/g,
		'Hanunoo': /[\u1720-\u173F]/g,
		'Buhid': /[\u1740-\u175F]/g,
		'Tagbanwa': /[\u1760-\u177F]/g,
		'Khmer': /[\u1780-\u17FF]/g,
		'Mongolian': /[\u1800-\u18AF]/g,
		'Limbu': /[\u1900-\u194F]/g,
		'Tai Le': /[\u1950-\u197F]/g,
		'New Tai Lue': /[\u1980-\u19DF]/g,
		'Khmer Symbols': /[\u19E0-\u19FF]/g,
		'Buginese': /[\u1A00-\u1A1F]/g,
		'Balinese': /[\u1B00-\u1B7F]/g,
		'Phonetic Extensions': /[\u1D00-\u1D7F]/g,
		'Phonetic Extensions Supplement': /[\u1D80-\u1DBF]/g,
		'Combining Diacritical Marks Supplement': /[\u1DC0-\u1DFF]/g,
		'Latin Extended Additional': /[\u1E00-\u1EFF]/g,
		'Greek Extended': /[\u1F00-\u1FFF]/g,
		'General Punctuation': /[\u2000-\u206F]/g,
		'Superscripts and Subscripts': /[\u2070-\u209F]/g,
		'Currency Symbols': /[\u20A0-\u20CF]/g,
		'Combining Diacritical Marks for Symbols': /[\u20D0-\u20FF]/g,
		'Letterlike Symbols': /[\u2100-\u214F]/g,
		'Number Forms': /[\u2150-\u218F]/g,
		'Arrows': /[\u2190-\u21FF]/g,
		'Mathematical Operators': /[\u2200-\u22FF]/g,
		'Miscellaneous Technical': /[\u2300-\u23FF]/g,
		'Control Pictures': /[\u2400-\u243F]/g,
		'Optical Character Recognition': /[\u2440-\u245F]/g,
		'Enclosed Alphanumerics': /[\u2460-\u24FF]/g,
		'Box Drawing': /[\u2500-\u257F]/g,
		'Block Elements': /[\u2580-\u259F]/g,
		'Geometric Shapes': /[\u25A0-\u25FF]/g,
		'Miscellaneous Symbols': /[\u2600-\u26FF]/g,
		'Dingbats': /[\u2700-\u27BF]/g,
		'Miscellaneous Mathematical Symbols-A': /[\u27C0-\u27EF]/g,
		'Supplemental Arrows-A': /[\u27F0-\u27FF]/g,
		'Braille Patterns': /[\u2800-\u28FF]/g,
		'Supplemental Arrows-B': /[\u2900-\u297F]/g,
		'Miscellaneous Mathematical Symbols-B': /[\u2980-\u29FF]/g,
		'Supplemental Mathematical Operators': /[\u2A00-\u2AFF]/g,
		'Miscellaneous Symbols and Arrows': /[\u2B00-\u2BFF]/g,
		'Glagolitic': /[\u2C00-\u2C5F]/g,
		'Latin Extended-C': /[\u2C60-\u2C7F]/g,
		'Coptic': /[\u2C80-\u2CFF]/g,
		'Georgian Supplement': /[\u2D00-\u2D2F]/g,
		'Tifinagh': /[\u2D30-\u2D7F]/g,
		'Ethiopic Extended': /[\u2D80-\u2DDF]/g,
		'Supplemental Punctuation': /[\u2E00-\u2E7F]/g,
		'CJK Radicals Supplement': /[\u2E80-\u2EFF]/g,
		'KangXi Radicals': /[\u2F00-\u2FDF]/g,
		'Ideographic Description Characters': /[\u2FF0-\u2FFF]/g,
		'CJK Symbols and Punctuation': /[\u3000-\u303F]/g,
		'Hiragana': /[\u3040-\u309F]/g,
		'Katakana': /[\u30A0-\u30FF]/g,
		'Bopomofo': /[\u3100-\u312F]/g,
		'Hangul Compatibility Jamo': /[\u3130-\u318F]/g,
		'Kanbun': /[\u3190-\u319F]/g,
		'Bopomofo Extended': /[\u31A0-\u31BF]/g,
		'CJK Strokes': /[\u31C0-\u31EF]/g,
		'Katakana Phonetic Extensions': /[\u31F0-\u31FF]/g,
		'Enclosed CJK Letters and Months': /[\u3200-\u32FF]/g,
		'CJK Compatibility': /[\u3300-\u33FF]/g,
		'CJK Unified Ideographs Extension A': /[\u3400-\u4DBF]/g,
		'Yijing Hexagram Symbols': /[\u4DC0-\u4DFF]/g,
		'CJK Unified Ideographs': /[\u4E00-\u9FFF]/g,
		'Yi Syllables': /[\uA000-\uA48F]/g,
		'Yi Radicals': /[\uA490-\uA4CF]/g,
		'Modifier Tone Letters': /[\uA700-\uA71F]/g,
		'Latin Extended-D': /[\uA720-\uA7FF]/g,
		'Syloti Nagri': /[\uA800-\uA82F]/g,
		'Phags-pa': /[\uA840-\uA87F]/g,
		'Hangul Syllables': /[\uAC00-\uD7AF]/g,
		'High Surrogates': /[\uD800-\uDB7F]/g,
		'High Private Use Surrogates': /[\uDB80-\uDBFF]/g,
		'Low Surrogates': /[\uDC00-\uDFFF]/g,
		'Private Use Area': /[\uE000-\uF8FF]/g,
		'CJK Compatibility Ideographs': /[\uF900-\uFAFF]/g,
		'Alphabetic Presentation Forms': /[\uFB00-\uFB4F]/g,
		'Arabic Presentation Forms-A': /[\uFB50-\uFDFF]/g,
		'Variation Selectors': /[\uFE00-\uFE0F]/g,
		'Vertical Forms': /[\uFE10-\uFE1F]/g,
		'Combining Half Marks': /[\uFE20-\uFE2F]/g,
		'CJK Compatibility Forms': /[\uFE30-\uFE4F]/g,
		'Small Form Variants': /[\uFE50-\uFE6F]/g,
		'Arabic Presentation Forms-B': /[\uFE70-\uFEFF]/g,
		'Halfwidth and Fullwidth Forms': /[\uFF00-\uFFEF]/g,
		'Specials': /[\uFFF0-\uFFFF]/g
	};

	var BASIC_LATIN = ['eng', 'ceb', 'hau', 'som', 'tlh', 'ind', 'haw', 'lat', 'swa', 'eus', 'nbl', 'nso', 'zul', 'xho', 'ssw', 'sot', 'tsn', 'tso'],
		VENETAN = ['vec-tv', 'vec-li', 'vec-blfe', 'vec-ve', 'vec-pdro', 'vec-vr'],
		EXTENDED_LATIN = ['ces', 'afr', 'pol', 'hrv', 'ron', 'slk', 'slv', 'tur', 'hun', 'aze', 'est', 'sqi', 'cat', 'spa', 'fra', 'deu', 'nld', 'ita',
			'dan', 'isl', 'nor', 'swe', 'fin', 'lav', 'por', 'ven', 'lit', 'tgl', 'cym', 'vie'].concat(VENETAN),
		LATIN = BASIC_LATIN.concat(EXTENDED_LATIN),
		CYRILLIC = ['rus', 'ukr', 'bos', 'srp', 'uzn', 'azj', 'bel', 'bul', 'kaz', 'tat', 'tuk', 'tgk', 'kir', 'mkd', 'khk'],
		DEVANAGARI = ['hin', 'mar', 'mai', 'bho', 'nep', 'mag'],
		ARABIC = ['arb', 'urd', 'skr', 'uig', 'pes'],
		ETHIOPIC = ['amh', 'tir'],
		HEBREW = ['heb', 'ydd']/*,
		PT = ['bzs', 'por']*/;

	var SINGLETONS = [
		['Armenian', 'hye'],
		['Bengali', 'ben'],
		['Panjabi', 'pan'],
		['Greek', 'ell'],
		['Gujarati', 'guj'],
		['Oriya', 'ori'],
		['Tamil', 'tam'],
		['Telugu', 'tel'],
		['Kannada', 'kan'],
		['Malayalam', 'mal'],
		['Sinhala', 'sin'],
		['Thai', 'tha'],
		['Lao', 'lao'],
		['Tibetan', 'bod'],
		['Burmese', 'mya'],
		['Georgian', 'kat'],
		['Mongolian', 'mon'],
		['Khmer', 'khm'],
		['Pahawh Hmong', 'hmn']
	];


	var Constructor = function(){
		this.knownModelCache = {};
	};


	/** Apply Gergely Pethő & Eszter Mózes (2014) */
	var identify = function(text, callback){
		//return run types that used for 40% or more of the string always return basic latin if found more than 15%
		//and extended additional latin if over 10% (for Vietnamese)
		var scripts = findRuns(text),
			code, lang;

		if(scripts['Hangul Syllables'] + scripts['Hangul Jamo'] + scripts['Hangul Compatibility Jamo'] >= THRESHOLD)
			code = 'kor';
		else if(scripts['Greek and Coptic'] >= THRESHOLD)
			code = 'ell';
		else if(scripts['Hiragana'] + scripts['Katakana'] + scripts['Katakana Phonetic Extensions'] >= THRESHOLD)
			code = 'jpn';
		else if(scripts['CJK Unified Ideographs'] + scripts['Bopomofo'] + scripts['Bopomofo Extended'] + scripts['KangXi Radicals'] >= THRESHOLD)
			code = 'zho';
		else if(scripts['Cyrillic'] >= THRESHOLD)
			code = check.call(this, text, CYRILLIC);
		else if(scripts['Devanagari'] >= THRESHOLD)
			code = check.call(this, text, DEVANAGARI);
		else if(scripts['Arabic'] + scripts['Arabic Presentation Forms-A'] + scripts['Arabic Presentation Forms-B'] >= THRESHOLD)
			code = check.call(this, text, ARABIC);
		else if(scripts['Hebrew'] >= THRESHOLD)
			code = check.call(this, text, HEBREW);
		else if(scripts['Ethiopic'] + scripts['Ethiopic Supplement'] + scripts['Ethiopic Extended'] >= THRESHOLD)
			code = check.call(this, text, ETHIOPIC);
		else
			//try languages with unique scripts
			for(var i = SINGLETONS.length - 1; i >= 0; i --)
				if(scripts[SINGLETONS[i][0]] >= THRESHOLD){
					code = SINGLETONS[i][1];
					break;
				}
//Venetan: 'Basic Latin' (a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, r, s, t, u, v, x),
//'Latin-1 Supplement' (à, đ, è, é, ñ, ò, ó, ú), 'Latin Extended-A' (ŧ), 'Latin Extended-B' (ɉ, ƚ)
		//extended Latin
		if(!code && scripts['Latin-1 Supplement'] + scripts['Latin Extended-A'] + scripts['IPA Extensions'] >= THRESHOLD)
			code = check.call(this, text, EXTENDED_LATIN);
		if(!code && scripts['Basic Latin'] >= 0.15)
			code = check.call(this, text, LATIN);

		if(code){
			lang = extractMostProbableLanguage(code);

			if(ArrayHelper.equals(Object.keys(code[0][1]), ArrayHelper.intersection(VENETAN, Object.keys(models))))
				lang = ['vec'];

			callback.call(this, code, lang);
		}
	};

	/** @private */
	var findRuns = function(text){
		var relevantRuns = {},
			charCount;
		Object.keys(unicodeBlockTests).forEach(function(lang){
			//count the number of characters in each character block
			charCount = text.match(unicodeBlockTests[lang]);

			relevantRuns[lang] = (charCount? charCount.length: 0) / text.length;
		});
		return relevantRuns;
	};

	/** @private */
	var check = function(sample, langs){
		langs = ArrayHelper.intersection(langs, Object.keys(models));

//		return checkNGram.call(this, sample, langs);
		return checkMarkov.call(this, sample, langs);
	};

	/** @private */
	var checkNGram = function(sample, langs){
		sample = NGrams.tokenize(sample);

		var wordLanguages = [],
			wordScores, model, i, knownModel;
		sample.forEach(function(word){
			wordScores = [];
			model = createModelFromContent(word);
			if(model.isReady())
				for(i = langs.length - 1; i >= 0; i --){
					knownModel = createKnownModel.call(this, langs[i]);
					if(knownModel && knownModel.isReady())
						wordScores.push([langs[i], model.distance(knownModel)]);
				}

			//we want the highest score (less distance equals to greater chance of match)
			if(wordScores.length){
				wordScores = extractBestScores(wordScores);
				wordScores = (!wordScores.scoreDifference || wordScores.scoreDifference >= MAX_SCORE_DIFFERENCE? wordScores.scores: {});
			}
			if(Object.keys(wordScores).length)
				wordLanguages.push([sentence.join(''), wordScores]);
			else
				wordLanguages.push([sentence.join(''), UNKNOWN_LANGUAGE, langs]);
		}, this);
		return wordLanguages;
	};

	/** @private */
	var checkMarkov = function(sample, langs){
		sample = Markov.tokenize(sample);

		var wordLanguages = [],
			wordScores, i, knownModel;
		sample.forEach(function(sentence){
			wordScores = [];
			for(i = langs.length - 1; i >= 0; i --){
				knownModel = createKnownModel.call(this, langs[i], MODEL_MARKOV);
				if(knownModel)
					wordScores.push([langs[i], knownModel.lnProbability([sentence])]);
			}

			//we want the highest probability
			if(wordScores.length){
				wordScores = extractBestScores(wordScores);
				wordScores = (!wordScores.scoreDifference || wordScores.scoreDifference >= MAX_SCORE_DIFFERENCE? wordScores.scores: {});
			}
			if(Object.keys(wordScores).length)
				wordLanguages.push([sentence.join(''), wordScores]);
			else
				wordLanguages.push([sentence.join(''), UNKNOWN_LANGUAGE, langs]);
		}, this);
		return wordLanguages;
	};

	/** @private */
	var createKnownModel = function(key, model){
		//check if known model has been pre-computed in cache
		if(this.knownModelCache[key])
			return this.knownModelCache[key];

		var data = models[key];
		if(!data)
			return undefined;

		//extract known trigram model data
		data = data.match(model == MODEL_MARKOV? PATTERN_MARKOV_DATA: PATTERN_TRIGRAMS);

		//contruct known trigram object based on provided raw data
		var m = createModelFromData(data, model);

		//store in known model pre-computed cache
		this.knownModelCache[key] = m;

		return m;
	};

	/** @private */
	var createModelFromContent = function(content){
		return NGrams.fromContent(3, 3, content);
	};

	/** @private */
	var createModelFromData = function(data, model){
		return (model == MODEL_MARKOV? Markov.fromData(2, '', data): NGrams.fromData(3, 3, data));
	};

	/** @private */
	var extractBestScores = function(wordScores){
		wordScores.sort(function(a, b){ return a[1] - b[1]; });
		var scores = {},
			bestScore, nextBestScore, i, el;
		for(i = wordScores.length - 1; i >= 0; i --){
			el = wordScores[i];
			if(bestScore == undefined || el[1] == bestScore){
				bestScore = el[1];
				scores[el[0]] = el[1];
			}
			else{
				nextBestScore = el[1];
				break;
			}
		}
		return {scores: scores, bestScore: bestScore, scoreDifference: bestScore + Math.log(1 - Math.exp(nextBestScore - bestScore))};
	};

	/** @private */
	var extractMostProbableLanguage = function(code){
		var recon = [];
		code.forEach(function(word){
			if(word[1] != UNKNOWN_LANGUAGE){
				Object.keys(word[1]).forEach(function(lang){
					var idx = ArrayHelper.findIndex(recon, function(el){ return (el[0] == lang); });
					if(idx >= 0)
						recon[idx][1] ++;
					else
						recon.push([lang, 1]);
				});
			}
		});
		recon.sort(function(a, b){ return b[1] - a[1]; });
		return recon.filter(function(el){ return el[1] == recon[0][1]; }).map(function(el){ return el[0]; });
	};


	Constructor.prototype = {
		constructor: Constructor,

		identify: identify
	};

	return Constructor;

});
