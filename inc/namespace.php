<?php

namespace Hovercards;

function bootstrap() {
	// Register autoloader.
	spl_autoload_register( __NAMESPACE__ . '\\autoload' );

	// Register hooks.
	add_action( 'wp_enqueue_scripts', __NAMESPACE__ . '\\register_scripts' );
	add_action( 'wp_footer', __NAMESPACE__ . '\\render_container' );
	add_action( 'template_redirect', __NAMESPACE__ . '\\redirect_on_accept' );
}

function autoload( $class ) {
	if ( strpos( $class, __NAMESPACE__ . '\\' ) !== 0 ) {
		return;
	}

	// Strip the namespace.
	$relative = substr( $class, strlen( __NAMESPACE__ . '\\' ) );
	$parts = explode( '\\', strtolower( $relative ) );
	$final = 'class-' . str_replace( '_', '-', array_pop( $parts ) ) . '.php';
	array_push( $parts, $final );
	$path = __DIR__ . DIRECTORY_SEPARATOR . implode( DIRECTORY_SEPARATOR, $parts );

	require $path;
}

function register_scripts() {
	$has_style = true;
	if ( defined( 'HOVERCARDS_DEV' ) ) {
		wp_register_script( 'hovercards', 'http://localhost:3000/bundle.js', [], false, true );
		$has_style = false;
	}
	else {
		wp_register_script( 'hovercards', plugins_url( 'build/main.js', PLUGIN_PATH ), [], VERSION, true );
		wp_register_style( 'hovercards', plugins_url( 'build/main.css', PLUGIN_PATH ), [], VERSION );
	}

	wp_localize_script( 'hovercards', 'HovercardsData', get_script_data() );

	if ( ! current_theme_supports( 'hovercards' ) ) {
		wp_enqueue_script( 'hovercards' );
		if ( $has_style ) {
			wp_enqueue_style( 'hovercards' );
		}
	}
}

function get_script_data() {
	global $wp_rewrite;
	return [
		'home' => home_url(),
		'api' => rest_url(),
		'permastruct' => $wp_rewrite->permalink_structure,
		'replacements' => [
			$wp_rewrite->rewritecode,
			$wp_rewrite->rewritereplace,
		],
	];
}

function render_container() {
	echo '<div id="hovercards-root"></div>';
}

function redirect_on_accept() {
	global $wp_query;
	if ( ! $wp_query->is_single() ) {
		return;
	}

	// Check the parameter.
	if ( ! isset( $_GET['hovercard_preview'] ) ) {
		return;
	}

	$post = $wp_query->get_queried_object();
	$url = sprintf( '/wp/v2/posts/%d', $post->ID );

	wp_safe_redirect( rest_url( $url ) );
	exit;
}
