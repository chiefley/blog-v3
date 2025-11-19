<?php
/**
 * Twenty Fourteen Child Theme Functions
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Enqueue parent and child theme styles
 */
function twentyfourteen_child_enqueue_styles() {
    // Enqueue parent theme stylesheet
    wp_enqueue_style('twentyfourteen-parent-style', get_template_directory_uri() . '/style.css');

    // Enqueue child theme stylesheet
    wp_enqueue_style('twentyfourteen-child-style',
        get_stylesheet_directory_uri() . '/style.css',
        array('twentyfourteen-parent-style'),
        wp_get_theme()->get('Version')
    );
}
add_action('wp_enqueue_scripts', 'twentyfourteen_child_enqueue_styles');

/**
 * Custom functions and modifications go below this line
 */

// Example: Customize excerpt length
// function twentyfourteen_child_excerpt_length($length) {
//     return 30;
// }
// add_filter('excerpt_length', 'twentyfourteen_child_excerpt_length');
