define({
	validWordRegex: /[-'‘’aàbcdđeéèfghiíjɉklƚmnñoóòprsʃtŧuúvxʒ]+/,
	leftmin: 1,
	rightmin: 1,
	patterns: {
		2: '1b1c1d1đ1f1g1j1ɉ1k1l1ƚ1m1n1ñ1p1r1s1t1ŧ1v1x',
		3: '.c2.d2.đ2.k2.m2.s2.ŧ2.x2'
			+ '2b.2bc2bd2bđ2bf2bg2bj2cɉ2bk2bl2bm2bn2bñ2bp2br2bs2bt2bŧ2bv2bx'
			+ '2c.2cb2cd2cđ2cf2cg2cj2cɉ2ck2cl2cm2cn2cñ2cp2cr2cs2ct2cŧ2cv2cx'
			+ '2d.2db2dc2dđ2df2dg2dj2dɉ2dk2dl2dm2dn2dñ2dp2dr2ds2dt2dŧ2dv2dx'
			+ '2đ.2đb2đc2đd2đf2đg2đj2đɉ2đk2đl2đm2đn2đñ2đp2đr2đs2đt2đŧ2đv2đx'
			+ '2f.2fb2fc2fd2fđ2fg2fj2fɉ2fk2fl2fm2fn2fñ2fp2fr2fs2ft2fŧ2fv2fx'
			+ '2g.2gb2gc2gd2gđ2gf2gj2gɉ2gk2gl2gm2gn2gñ2gp2gr2gs2gt2gŧ2gv2gx'
			+ '2j.2jb2jc2jd2jđ2jf2jg2jɉ2jk2jl2jm2jn2jñ2jp2jr2js2jt2jŧ2jv2jx'
			+ '2ɉ.2ɉb2ɉc2ɉd2ɉđ2ɉf2ɉg2ɉj2ɉk2ɉl2ɉm2ɉn2ɉñ2ɉp2ɉr2ɉs2ɉt2ɉŧ2ɉv2ɉx'
			+ '2k.2kb2kc2kd2kđ2kf2kg2kj2kɉ2kl2km2kn2kñ2kp2kr2ks2kt2kŧ2kv2kx'
			+ '2l.2lb2lc2ld2lđ2lf2lg2lj2lɉ2lk2lm2ln2lñ2lp2lr2ls2lt2lŧ2lv2lx'
			+ '2m.2mb2mc2md2mđ2mf2mg2mj2mɉ2mk2ml2mn2mñ2mp2mr2ms2mt2mŧ2mv2mx'
			+ '2n.2nb2nc2nd2nđ2nf2ng2nj2nɉ2nk2nl2nm2nñ2np2nr2ns2nt2nŧ2nv2nx'
			+ '2ñ.2ñb2ñc2ñd2ñđ2ñf2ñg2ñj2ñɉ2ñk2ñl2ñm2ñn2ñp2ñr2ñs2ñt2ñŧ2ñv2ñx'
			+ '2p.2pb2pc2pd2pđ2pf2pg2pj2pɉ2pk2pl2pm2pn2pñ2pr2ps2pt2pŧ2pv2px'
			+ '2r.2rb2rc2rd2rđ2rf2rg2rj2rɉ2rk2rl2rm2rn2rñ2rp2rs2rt2rŧ2rv2rx'
			+ '2s.s2cs2fs2ks2ps2ts2ŧs2x'
			+ '2t.2tb2tc2td2tđ2tf2tg2tj2tɉ2tk2tl2tm2tn2tñ2tp2tr2ts2tŧ2tv2tx'
			+ '2ŧ.2ŧb2ŧc2ŧd2ŧđ2ŧf2ŧg2ŧj2ŧɉ2ŧk2ŧl2ŧm2ŧn2ŧñ2ŧp2ŧr2ŧs2ŧt2ŧv2ŧx'
			+ '2v.2vb2vc2vd2vđ2vf2vg2vj2vɉ2vk2vl2vm2vn2vñ2vp2vr2vs2vt2vŧ2vx'
			+ '2x.x2bx2dx2đx2gx2jx2ɉx2lx2mx2nx2ñx2rx2sx2v'
			+ 'b2lb2r'
			+ 'c2lc2r'
			+ 'd2ld2r'
			+ 'f2lf2r'
			+ 'g2lg2r'
			+ 'j2lj2r'
			+ 'ɉ2lɉ2r'
			+ 'k2lk2r'
			+ 'p2lp2r'
			+ 't2lt2r'
			+ 'v2lv2r'
			//hyatus
			+ 'a1ae1ao1aà1aè1aé1aò1aó1a'
			+ 'a1ee1eo1eà1eè1eé1eò1eó1e'
			+ 'a1oe1oo1oà1oè1oé1oò1oó1o'
			//hyatus
			+ 'í1aí1eí1ií1oí1u'
			+ 'ú1aú1eú1iú1oú1u'
			//hyatus
			+ 'a1àa1èa1éa1ía1òa1óa1ú'
			+ 'e1àe1èe1ée1íe1òe1óe1ú'
			+ 'o1ào1èo1éo1ío1òo1óo1ú',
		4: '.f2t.p2n.p2s.t2m',
		5: '.bio1.pre1l3f2t',
		6: '.di2s3.de2s3.di2x3.de2x3.anti1.auto1.opto1.orto3.para1.poli3.re1is',
		7: 'kontro1èkstra1ekstra1ŧirkum3.ipe2r1.polip2.ortop2.dis3p2.des3p2'
			+ '.pos2da',
		8: 'ŧirkums2'
	}
});
