<?php
/**
 * Plugin Name: Embed React Components
 * Plugin URI: https://yoursite.com
 * Description: Embed React/TypeScript components into WordPress posts using shortcodes
 * Version: 1.0.0
 * Author: Your Name
 * License: GPL2
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

class EmbedReactComponents {

    private $components_url;

    public function __construct() {
        // Set the URL where your built components are hosted
        // Option 1: Upload to WordPress media library and set path
        // Option 2: Host on a CDN
        // Option 3: Serve from a subdomain
        $this->components_url = get_site_url() . '/wp-content/uploads/react-components';

        add_shortcode('react-calculator', array($this, 'render_calculator'));
        add_shortcode('react-dawkins-weasel', array($this, 'render_dawkins_weasel'));
        add_shortcode('react-optimized-weasel', array($this, 'render_optimized_weasel'));
    }

    /**
     * Render the Calculator component
     * Usage: [react-calculator]
     */
    public function render_calculator($atts) {
        // Enqueue the component's JS and CSS
        wp_enqueue_script(
            'calculator-component',
            $this->components_url . '/calculator.iife.js',
            array(),
            '1.0.0',
            true
        );

        wp_enqueue_style(
            'calculator-component-style',
            $this->components_url . '/style.css',
            array(),
            '1.0.0'
        );

        // Return the container div that the component will mount to
        return '<div data-component="calculator"></div>';
    }

    /**
     * Render the Dawkins Weasel Simulation component
     * Usage: [react-dawkins-weasel]
     * Optional attributes:
     *   target-string: The target string to evolve towards
     *   max-generations: Maximum generations before stopping
     *   height: Height of the results area in pixels
     *   show-controls: Whether to show controls (true/false)
     * Example: [react-dawkins-weasel target-string="Hello World" height="400"]
     */
    public function render_dawkins_weasel($atts) {
        $atts = shortcode_atts(array(
            'target-string' => '',
            'max-generations' => '',
            'height' => '',
            'show-controls' => 'true'
        ), $atts);

        wp_enqueue_script(
            'dawkins-weasel-simulation',
            $this->components_url . '/dawkins-weasel-simulation.iife.js',
            array(),
            '1.0.0',
            true
        );

        wp_enqueue_style(
            'dawkins-weasel-simulation-style',
            $this->components_url . '/style.css',
            array(),
            '1.0.0'
        );

        $data_attrs = '';
        if (!empty($atts['target-string'])) {
            $data_attrs .= ' data-target-string="' . esc_attr($atts['target-string']) . '"';
        }
        if (!empty($atts['max-generations'])) {
            $data_attrs .= ' data-max-generations="' . esc_attr($atts['max-generations']) . '"';
        }
        if (!empty($atts['height'])) {
            $data_attrs .= ' data-height="' . esc_attr($atts['height']) . '"';
        }
        if ($atts['show-controls'] === 'false') {
            $data_attrs .= ' data-show-controls="false"';
        }

        return '<div data-component="dawkins-weasel-simulation"' . $data_attrs . '></div>';
    }

    /**
     * Render the Optimized Weasel Simulation component
     * Usage: [react-optimized-weasel]
     * Optional attributes:
     *   mutation-level: Mutation level 1-5 (default 5)
     *   with-badger: Include predator (true/false)
     *   initial-food-sources: Number of food sources (default 25)
     *   height: Canvas height in pixels (default 600)
     *   show-controls: Whether to show controls (true/false)
     * Example: [react-optimized-weasel with-badger="true" height="400"]
     */
    public function render_optimized_weasel($atts) {
        $atts = shortcode_atts(array(
            'mutation-level' => '',
            'with-badger' => 'false',
            'initial-food-sources' => '',
            'height' => '',
            'show-controls' => 'true'
        ), $atts);

        wp_enqueue_script(
            'optimized-weasel-simulation',
            $this->components_url . '/optimized-weasel-simulation.iife.js',
            array(),
            '1.0.0',
            true
        );

        wp_enqueue_style(
            'optimized-weasel-simulation-style',
            $this->components_url . '/style.css',
            array(),
            '1.0.0'
        );

        $data_attrs = '';
        if (!empty($atts['mutation-level'])) {
            $data_attrs .= ' data-mutation-level="' . esc_attr($atts['mutation-level']) . '"';
        }
        if ($atts['with-badger'] === 'true') {
            $data_attrs .= ' data-with-badger="true"';
        }
        if (!empty($atts['initial-food-sources'])) {
            $data_attrs .= ' data-initial-food-sources="' . esc_attr($atts['initial-food-sources']) . '"';
        }
        if (!empty($atts['height'])) {
            $data_attrs .= ' data-height="' . esc_attr($atts['height']) . '"';
        }
        if ($atts['show-controls'] === 'false') {
            $data_attrs .= ' data-show-controls="false"';
        }

        return '<div data-component="optimized-weasel-simulation"' . $data_attrs . '></div>';
    }
}

// Initialize the plugin
new EmbedReactComponents();
