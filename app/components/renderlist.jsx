import React from 'react';

class ResultList extends React.Component {

	renderList() {
		return this.props.data.map((item, key) => {
				return (
					<li key={key}> <h4>{item.jmeno} {item.prijmeni}</h4> email: {item.email} mobil: {item.mobil} telefon: {item.tel}</li>
				);
			});
	}

	render() {
		return (
			<ul>{this.renderList()}</ul>
		);
	}
}
export default ResultList;
