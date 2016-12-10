import React, { Component } from 'react';
import TransitionGroup from 'react-addons-css-transition-group';

import Card from './Card';

import './App.css';

const transition = {
	component: "div",
	transitionName: "Hovercard-Transition",
	transitionEnterTimeout: 300,
	transitionLeaveTimeout: 300,
};

export default class App extends Component {
	render() {
		const { post, target } = this.props;
		return <TransitionGroup {...transition}>
			{ target ?
				<Card
					key={ target.id || target.dataset.hovercardsId }
					post={ post || null }
					target={ target }
				/>
			: null }
		</TransitionGroup>;
	}
}
