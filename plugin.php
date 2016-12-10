<?php
/**
 * Plugin Name: Hovercards
 * Description: Display a preview of your posts when hovering over links.
 * Author: Ryan McCue
 * Author URI: https://rmccue.io/
 * Version: 0.1
 */

namespace Hovercards;

const PLUGIN_PATH = __FILE__;
const VERSION = '0.1';

require __DIR__ . '/inc/namespace.php';

bootstrap();
