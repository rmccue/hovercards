/* global HovercardsData */
import React from 'react';

import './Card.css';

const WIDTH = 300;
const strings = HovercardsData.strings;

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

	// Keep on the screen.
	position.top = Math.max( position.top, 0 );
	position.left = Math.max( position.left, 0 );

	return position;
}

function formatDate( dateString ) {
	let date = new Date( dateString );
	return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
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

		let featuredImage = null;
		if ( "_embedded" in post && "wp:featuredmedia" in post._embedded ) {
			featuredImage = post._embedded["wp:featuredmedia"][0];
		}

		let author = post._embedded.author[0].name;

		return <div className="Hovercard-Card" style={ style }>
			{ featuredImage && featuredImage.media_type === "image" ?
				<div className="Hovercard-Media-Container">
					<img
						alt={ featuredImage.alt_text }
						className="Hovercard-Media"
						src={ featuredImage.media_details.sizes.medium.source_url }
					/>
				</div>
			: null }
			<div>
				<h1 dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
				<div
					className="Hovercard-Excerpt"
					dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
				/>
				{ post.date === post.modified ?
					<p className="Hovercard-Byline">
						{ strings.published
							.replace( '%1$s', formatDate( post.date ) )
							.replace( '%2$s', author ) }
					</p>
				:
					<p className="Hovercard-Byline">
						{ strings.updated
							.replace( '%1$s', formatDate( post.modified ) )
							.replace( '%2$s', author ) }
					</p>
				}
			</div>
		</div>;
	}
}
