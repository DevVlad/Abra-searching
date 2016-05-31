import React from 'react';

class ResultList extends React.Component {

	renderList() {
		return this.props.data.map((item, key) => {
			return (
				<li key={key}>{item.jmeno} {item.prijmeni} {item.email}</li>
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