import superagent from 'superagent';

class ApiService {

	getRequest(query, filter){
		return new Promise((resolve, reject) => {
			superagent.get(`https://nejlepsi.flexibee.eu/c/velka/kontakt/(${encodeURIComponent(filter)})`)
			.set('accept', 'application/json')
			.auth('admin', 'adminadmin')
			.query(query)
			.end((err, res)=>{
				if (!err) {
                       resolve(res.body);
                } else {
                    console.log('Error: ', err);
                }
			})
		});
	}

}
//singleton
export default new ApiService;