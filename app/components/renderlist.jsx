import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import shortid from 'shortid';
import './App.css'

class ResultList extends React.Component {

	render() {
		let items = this.props.data.map((item, key) => {
					return (
							<li key={shortid()}> <h4>{item.jmeno} {item.prijmeni}</h4> email: {item.email} mobil: {item.mobil} telefon: {item.tel}</li>
					);
		});
		return (
			<ReactCSSTransitionGroup component='ul' transitionName="anime" transitionEnterTimeout={1000} transitionLeaveTimeout={1000}>
				{items}
			</ReactCSSTransitionGroup>
		);
		}
}

// renderList() {
// 		return this.props.data.map((item, key) => {
// 			return (
// 				<li key={key}> <h4>{item.jmeno} {item.prijmeni}</h4> email: {item.email} mobil: {item.mobil} telefon: {item.tel}</li>
// 			);
// 		});
// }
//
// render() {
// 	return (
// 		<ul>{this.renderList()}</ul>
// 	);
// }
// }

export default ResultList;
