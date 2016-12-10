/* global HovercardsData */
import App from './App';
import Renderer from './Renderer';

const container = document.getElementById( 'hovercards-root' );
const renderer = new Renderer( App, container, HovercardsData );

renderer.render();

if ( module.hot ) {
	module.hot.accept( './App', () => {
		const NextApp = require( './App' ).default;
		renderer.component = NextApp;
	});
}

const isValidTarget = target => target.nodeType === Node.ELEMENT_NODE && target.nodeName === 'A';

const regexForStructure = ( structure, replacements ) => {
	let [ tags, matchers ] = replacements;

	return tags.reduce(
		( regex, _, index ) => regex.replace( tags[ index ], matchers[ index ] ),
		structure
	);
};

const regex = regexForStructure( HovercardsData.permastruct, HovercardsData.replacements );

const dataCache = {};
const dataForUrl = url => {
	if ( url in dataCache ) {
		return dataCache[ url ];
	}

	let promise = new Promise( ( resolve, reject ) => {
		const redirectableURL = new URL( url );
		redirectableURL.searchParams.set( 'hovercard_preview', '1' );
		fetch( redirectableURL ).then( resp => resp.json() ).then( data => resolve( data ) ).catch( e => reject( e ) );
	});
	dataCache[ url ] = promise;
	return promise;
};

const listeningTo = [];
let uniqueId = 0;
document.addEventListener( 'mouseover', e => {
	if ( ! isValidTarget( e.target ) ) {
		return;
	}

	const href = e.target.href;
	// Match against the regex.
	let res = href.match( HovercardsData.home + regex + '/?$' );
	if ( ! res ) {
		return;
	}

	// Give the link a unique ID if it doesn't have one.
	if ( ! e.target.id ) {
		e.target.dataset.hovercardsId = uniqueId++;
	}

	listeningTo.push( e.target );
	renderer.setData({ target: e.target, post: null });

	// Do we have an ID?
	dataForUrl( href ).then( post => renderer.setData({ post }) );
});

document.addEventListener( 'mouseout', e => {
	if ( ! isValidTarget( e.target ) ) {
		return;
	}

	const idx = listeningTo.indexOf( e.target );
	if ( idx === -1 ) {
		return;
	}

	listeningTo.splice( idx, 1 );
	renderer.setData({ target: null, post: null });
});
