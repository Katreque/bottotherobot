const format = require('string-template');

const PT_BR = require('./langs/PT_BR.json');
const EN = require('./langs/EN.json');

module.exports = {
	getTranslatedString(id, lang, obj) {
		switch (lang) {
			case 'PT_BR':
				return format(PT_BR[id], obj);
		
			default:
				return format(EN[id], obj);
		}
	},
}
