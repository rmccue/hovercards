import React from 'react';

import './Card.css';

const WIDTH = 300;

function getPosition( target ) {
	let rect = target.getBoundingClientRect();

	let position = {
		top: rect.top + window.pageYOffset - document.documentElement.clientTop,
		left: rect.left + window.pageXOffset - document.documentElement.clientLeft,
	};

	// Ofset by the size of the element itself.
	position.top += target.offsetHeight;

	// Point to the centre.
	position.left += target.offsetWidth / 2 - WIDTH / 2;

	return position;
}

export default class Card extends React.Component {
	render() {
		const { post, target } = this.props;
		let style = { width: WIDTH };
		if ( target ) {
			style = { ...style, ...getPosition( this.props.target ) };
		}

		if ( ! post ) {
			return <div className="Hovercard-Card" style={ style }>
				<h1>Loading&hellip;</h1>
			</div>;
		}

		return <div className="Hovercard-Card" style={ style }>
			<h1 dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
			<div
				className="Hovercard-Excerpt"
				dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
			/>
		</div>;
	}
}
