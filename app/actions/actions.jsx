export const setFilter = (input) => {
	handleRequest(0, input);
	return {
		type: 'SET_FILTER',
		input: input
	}
}

export const setLoading = () => {
	return {
		type: 'SET_LOADING',
		hint: []
	}
}

export const setLoaded = () => {
	return {
		type: 'SET_LOADED'
	}
}

export const addHint = (field) => {
	let pom = [];
	field.map(x => { 
		pom.concat(x.jmeno).concat(x.prijmeni);
	})
	return {
		type: 'ADD_HINT',
		hint: pom
	}
}

export const setInit = () => {
	return {
		input: '',
		type: 'SET_INITIAL_STATE'
	}
}

import ApiService from '../services/apiservice.js';
const handleRequest = (paging, x) => {
	//store - setLoading
	ApiService.getRequest({
		'add-row-count' : true,
		'start' : paging
		}, `jmeno like similar '${x}' or prijmeni like similar '${x}' or email like similar '${x}' or mobil like similar '${x}' or tel like similar '${x}'`).then( data => {
		let pom = data.winstrom; //this.handleSoftFilter(paging, x, data.winstrom); 		
		handleFilter(paging, x, data.winstrom);
	});	
}

const handleFilter = (paging, input, data) => {
	if (data.kontakt.length !== 0) {
		let hint = [];
		console.log('Applying the filter...');
		const expr = new RegExp('\\b' + input.split(' ').map(exp => '(' + exp + ')').join('.*\\b'),'i'); 
		data.kontakt.map(x => {
			if ( expr.test(x.jmeno) || expr.test(x.prijmeni) || expr.test(x.email) || expr.test(x.mobil) || expr.test(x.tel) ) {
				hint.push(x);
			}
		});
		// store - addHint
		decide({paging: paging, input: input, hint: hint, totalCount: parseInt(data['@rowCount'])});
	} else {			
		decide({paging: paging, input: input, hint: hint, totalCount: parseInt(data['@rowCount'])});
	}
}

const decide = (data) => {
	console.log('Deciding...', data)
	// if ((obj.totalCount < 10 && obj.input === input) || (obj.hint.length >= 10 && obj. input === input)) {
	// 	return {...obj, status: "OK"};
	// } else if ((obj.hint.length < 10 && obj.paging < obj.totalCount) && obj.input === input) {
	// 	return {...obj, status: "again"};
	// } else {
	// 	return console.log('Error in decider!');
	// }
}


