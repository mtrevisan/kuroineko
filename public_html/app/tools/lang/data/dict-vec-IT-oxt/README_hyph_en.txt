Hyphenation dictionary
----------------------

Language: Venetan (vec).
Origin:   Based on the TeX hyphenation tables
License:  LaTeX Project Public License <http://www.latex-project.org/lppl.txt>
Author:   conversion author is Mauro Trevisan <mauro.trevisan@gmail.com>


Copyright (c) 2019 Mauro Trevisan

This program is free software; it can be redistributed and/or modified
under the terms of the GNU Lesser General Public Licence,
as published by the Free Software Foundation, either version 2.1 of the
Licence or (at your option) any later version.

\versionnumber{1.0.0} \versiondate{2016/03/31}

No guarantee or declaration of fitness to any particular purpose is given
and any liability is disclaimed.


There is no explicit hyphenation exception list because these patterns
proved to hyphenate correctly a very large set of words suitably chosen in
order to test them in the most heavy circumstances.

Nevertheless if you frequently use technical terms that you want hyphenated
differently from what is normally done (for example if you prefer
etymological hyphenation of prefixed and/or suffixed words) you should
insert a specific hyphenation list in the preamble of your document, for
example:

\hyphenation{su-per-in-du-tor su-per-in-du-to-ri}

If you use, as you should, the venetan option of the babel package, then you
have available the active character that allows you to put a discretionary
break at a word boundary of a compound word while maintaning the hyphenation
algorithm on the rest of the word.

Should you find any word that gets hyphenated in a wrong way, please, AFTER
CHECKING ON A RELIABLE MODERN DICTIONARY, report to the author, preferably
by email.
