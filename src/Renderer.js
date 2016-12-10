import React from 'react';
import ReactDOM from 'react-dom';

export default class Renderer {
	constructor(component, container, data) {
		this._component = component;
		this._container = container;
		this.data = data;
	}

	get container() {
		return this._container;
	}

	set container(value) {
		this._container = value;
		this.render();
	}

	get component() {
		return this._component;
	}

	set component(value) {
		this._component = value;
		this.render();
	}

	setData(value) {
		this.data = { ...this.data, ...value };
		this.render();
	}

	render() {
		if ( ! this.component ) {
			console.warn( 'Component is not defined', this.component );
			return;
		}

		const element = React.createElement( this.component, this.data );
		ReactDOM.render( element, this.container );
	}
}