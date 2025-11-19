# Embed React Components WordPress Plugin

## Installation

1. Upload this folder to `/wp-content/plugins/` on your WordPress site
2. Activate the plugin through the WordPress admin panel
3. Upload your built component files to `/wp-content/uploads/react-components/`

## Usage

### Calculator Component

Add this shortcode to any post or page:

```
[react-calculator]
```

## Adding New Components

1. Build your component using `npm run build:all`
2. Upload the built files to `/wp-content/uploads/react-components/`
3. Add a new shortcode method in `embed-components.php`:

```php
public function render_your_component($atts) {
    wp_enqueue_script(
        'your-component',
        $this->components_url . '/your-component.iife.js',
        array(),
        '1.0.0',
        true
    );

    wp_enqueue_style(
        'your-component-style',
        $this->components_url . '/style.css',
        array(),
        '1.0.0'
    );

    return '<div data-component="your-component"></div>';
}
```

4. Register the shortcode in the constructor:

```php
add_shortcode('react-your-component', array($this, 'render_your_component'));
```

## Configuration

Edit the `$components_url` in the constructor if you want to host components elsewhere (CDN, subdomain, etc.)
