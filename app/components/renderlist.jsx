import React from 'react';

class ResultList extends React.Component {
	// constructor (props) {
	// 	super(props);
	// }

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

// function resultList(props) => 
// 	<ul>{props.data.map((item, key) => <li key={key}>{item.jmeno} {item.prijmeni}</li>);})</ul>