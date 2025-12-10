<?php
/**
 * Plugin Name: Embed React Components
 * Plugin URI: https://yoursite.com
 * Description: Embed React/TypeScript components into WordPress posts using shortcodes
 * Version: 1.1.0
 * Author: Your Name
 * License: GPL2
 */

if (!defined('ABSPATH')) {
    exit;
}

class EmbedReactComponents
{
    private $components_url;
    private $config;
    private $site_key;

    public function __construct()
    {
        $this->config = $this->load_config();
        $this->site_key = $this->detect_site_key($this->config);

        // Outputs to /wp-content/uploads/react-components/<site>/
        $base_upload_url = content_url('/uploads/react-components');
        $this->components_url = trailingslashit($base_upload_url) . $this->site_key;

        $this->register_shortcodes();
    }

    private function load_config()
    {
        $plugin_config = __DIR__ . '/components.json';
        $repo_root_config = realpath(dirname(__DIR__, 2) . '/../config/components.json');

        $config_path = file_exists($plugin_config) ? $plugin_config : $repo_root_config;

        if (!$config_path || !file_exists($config_path)) {
            error_log('Embed React Components: components.json not found.');
            return array('sites' => array(), 'components' => array());
        }

        $config_json = file_get_contents($config_path);
        $config = json_decode($config_json, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            error_log('Embed React Components: Failed to parse components.json.');
            return array('sites' => array(), 'components' => array());
        }

        return $config;
    }

    private function detect_site_key($config)
    {
        $sites = isset($config['sites']) && is_array($config['sites']) ? $config['sites'] : array();
        $default = count($sites) ? $sites[0]['key'] : 'default';

        $host = isset($_SERVER['HTTP_HOST']) ? strtolower($_SERVER['HTTP_HOST']) : '';

        foreach ($sites as $site) {
            if (empty($site['domains']) || !is_array($site['domains'])) {
                continue;
            }

            foreach ($site['domains'] as $domain) {
                if ($host === strtolower($domain)) {
                    $detected = $site['key'];
                    /**
                     * Filter allows overriding the detected site key.
                     */
                    return apply_filters('embed_react_components_site_key', $detected, $site, $sites);
                }
            }
        }

        return apply_filters('embed_react_components_site_key', $default, null, $sites);
    }

    private function register_shortcodes()
    {
        if (empty($this->config['components']) || !is_array($this->config['components'])) {
            return;
        }

        foreach ($this->config['components'] as $component) {
            if (!isset($component['site']) || $component['site'] !== $this->site_key) {
                continue;
            }

            $shortcode = isset($component['shortcode']) ? $component['shortcode'] : 'react-' . $component['fileName'];

            add_shortcode($shortcode, function ($atts) use ($component) {
                return $this->render_component($component, $atts);
            });
        }
    }

    private function render_component($component, $atts)
    {
        $file_name = $component['fileName'];
        $handle = isset($component['key']) ? $component['key'] : $file_name;

        wp_enqueue_script(
            $handle,
            trailingslashit($this->components_url) . $file_name . '.iife.js',
            array(),
            '1.0.0',
            true
        );

        $data_component = isset($component['dataComponent']) ? $component['dataComponent'] : $file_name;
        $data_attrs = $this->build_data_attributes($component, $atts);

        return '<div data-component="' . esc_attr($data_component) . '"' . $data_attrs . '></div>';
    }

    private function build_data_attributes($component, $atts)
    {
        $allowed = array();

        if (!empty($component['dataAttributes']) && is_array($component['dataAttributes'])) {
            foreach ($component['dataAttributes'] as $attr) {
                $name = is_array($attr) ? ($attr['name'] ?? null) : $attr;
                if (!$name) {
                    continue;
                }
                $allowed[$name] = '';
            }
        }

        if (!empty($allowed)) {
            $atts = shortcode_atts($allowed, $atts);
        } else {
            $atts = array();
        }

        $data_attrs = '';
        foreach ($atts as $key => $value) {
            if ($value === '') {
                continue;
            }
            $data_attrs .= ' data-' . esc_attr($key) . '="' . esc_attr($value) . '"';
        }

        return $data_attrs;
    }
}

new EmbedReactComponents();
