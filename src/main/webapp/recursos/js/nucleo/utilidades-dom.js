/* Helpers DOM — atajos $ y $$ para querySelector/querySelectorAll. */
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
