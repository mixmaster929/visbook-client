<?php

/*
Plugin Name: VisBook Client
Description: Fetches and displays data from the VisBook API.
Version: 1.2
Author: Konsulenten Reidar Nygård
Domain Path: /languages
Text Domain: visbook-client
Author URI: https://www.konsulenten.no
 */

// Include necessary files
include_once plugin_dir_path(__FILE__) . 'admin/settings-page.php';

// Visbook includes
include_once plugin_dir_path(__FILE__) . 'includes/visbook-core.php';
include_once plugin_dir_path(__FILE__) . 'includes/visbook-filehandling.php';

// Include the register_cpt.php.php file
include_once plugin_dir_path(__FILE__) . 'includes/register-cpt.php';

// Include the add_acf_fields.php file
// include_once plugin_dir_path( __FILE__ ) . 'includes/add-acf-fields.php';

// TO DO: make sure the correct ACF-JSON file is included in plugin folder and invisible to backend users
function email_confirmation_endpoint()
{
    register_rest_route('visbook-plugin/v2', '/email-confirmation', array(
        'methods' => 'POST',
        'callback' => 'emailConfirmation',
        'args' => array(
            'email' => array(
                'required' => true,
            ),
        ),
    ));
}
add_action('rest_api_init', 'email_confirmation_endpoint');

function emailConfirmation($data)
{
    $webident = '10268';
    $email = $data['email'];
    $args = [
        'email' => 'smart.topdev929@gmail.com',
    ];

    $url = "https://ws.visbook.com/api/{$webident}/login/request/email";
    $response = wp_remote_get($url, $args);

    if (is_wp_error($response)) {
        return ['error' => $response->get_error_message()];
    }

    $body = wp_remote_retrieve_body($response);
    $data = json_decode($body, true);
    if (empty($data)) {
        return ['error' => 'No data received from the API'];
    }
    return $data;
}
function phonenumber_confirmation_endpoint()
{
    register_rest_route('visbook-plugin/v2', '/phonenumber-confirmation', array(
        'methods' => 'POST',
        'callback' => 'phonenumberConfirmation',
        'args' => array(
            'countryCode' => array(
                'required' => true,
            ),
            'phoneNumber' => array(
                'required' => true,
            ),

        ),
    ));
}
add_action('rest_api_init', 'phonenumber_confirmation_endpoint');

function phonenumberConfirmation($data)
{
    $webident = '10268';
    $countryCode = $data['countryCode'];
    $phoneNumber = $data['phoneNumber'];

    $url = 'https://ws.visbook.com/api/10268/login/request/sms';
    $data = array(
        'countryCode' => $countryCode,
        'phoneNumber' => $phoneNumber,
    );
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array(
        'Accept: application/json',
        'Content-Type: multipart/form-data',
        'Referer: https://motorhome.no',
    ));
    $response = curl_exec($ch);
    if (curl_errno($ch)) {
        echo 'Curl error: ' . curl_error($ch);
    }
    curl_close($ch);
    return $response;
}

function checkAvailability_endpoint()
{
    register_rest_route('visbook-plugin/v2', '/availability/', array(
        'methods' => 'GET',
        'callback' => 'checkAvailability',
        'args' => array(
            'product_id' => array(
                'required' => true,
            ),
            'end_date' => array(
                'required' => true,
            ),
        ),
    ));
}

add_action('rest_api_init', 'checkAvailability_endpoint');

function checkAvailability($data)
{
    $webident = '10268';
    $product_id = $data['product_id'];
    $end_date = $data['end_date'];

    $url = "https://ws.visbook.com/api/{$webident}/availability/{$product_id}/{$end_date}";
    $response = wp_remote_get($url);

    if (is_wp_error($response)) {
        return ['error' => $response->get_error_message()];
    }

    $body = wp_remote_retrieve_body($response);
    $data = json_decode($body, true);
    if (empty($data)) {
        return ['error' => 'No data received from the API'];
    }
    return $data;
}

function getPrices_endpoint()
{
    register_rest_route('visbook-plugin/v2', '/webproducts/', array(
        'methods' => 'GET',
        'callback' => 'getPrices',
        'args' => array(
            'product_id' => array(
                'required' => false,
            ),
            'start_date' => array(
                'required' => true,
            ),
            'end_date' => array(
                'required' => true,
            ),
        ),
    ));
}

add_action('rest_api_init', 'getPrices_endpoint');

function getPrices($data)
{
    $webident = '10268';
    $product_id = $data['product_id'];
    $start_date = $data['start_date'];
    $end_date = $data['end_date'];

    $url = "https://ws.visbook.com/api/{$webident}/webproducts/{$start_date}/{$end_date}/{$product_id}";
    $response = wp_remote_get($url);

    if (is_wp_error($response)) {
        return ['error' => $response->get_error_message()];
    }

    $body = wp_remote_retrieve_body($response);
    $data = json_decode($body, true);
    if (empty($data)) {
        return ['error' => 'No data received from the API'];
    }
    return $data;
}

function get_current_language_rest()
{
    register_rest_route('visbook-plugin/v2', '/current-language', array(
        'methods' => 'GET',
        'callback' => 'getCurrentLanguage',
    ));
}

add_action('rest_api_init', 'get_current_language_rest');

function getCurrentLanguage()
{
    return get_locale();
}
function expose_current_language_to_js()
{
    // Get the current language
    $current_language = get_locale();

    // Localize the script with the current language data
    wp_enqueue_script('visbook-app-js', plugins_url('/dist/visbook-app.js', __FILE__), array(), '1.0.0', true);
    wp_localize_script('visbook-app-js', 'wpData', array(
        'currentLanguage' => $current_language,
    ));
}
add_action('wp_enqueue_scripts', 'expose_current_language_to_js');

// Enqueue scripts
function visbook_enqueue_scripts()
{
    wp_enqueue_script('visbook-app-js', plugins_url('/dist/visbook-app.js', __FILE__), array(), '1.0.0', true);
    wp_enqueue_style('visbook-app-css', plugins_url('/dist/visbook-app.css', __FILE__), array(), '1.0.0', 'all');
}
add_action('wp_enqueue_scripts', 'visbook_enqueue_scripts');

// Load text domain for i18n
function visbook_load_plugin_textdomain()
{
    load_plugin_textdomain('visbook-client', false, basename(dirname(__FILE__)) . '/languages/');
}
add_action('plugins_loaded', 'visbook_load_plugin_textdomain');

function visbook_handle_check_progress_ajax()
{
    // Get the progress of the load/setup process
    $progress = get_option('visbook_load_progress', '0');
    echo $progress;
    wp_die(); // End AJAX request
}
add_action('wp_ajax_visbook_check_progress', 'visbook_handle_check_progress_ajax');

add_action('wp_ajax_visbook_update_log', 'visbook_handle_update_log_ajax');
function visbook_handle_update_log_ajax()
{
    $log_contents = file_get_contents(ABSPATH . 'wp-content/debug.log'); // Adjust path as needed
    echo esc_textarea($log_contents);
    wp_die();
}

// Save ACF json to plugin directory

define('MY_PLUGIN_DIR_PATH', untrailingslashit(plugin_dir_path(__FILE__)));
add_filter('acf/settings/save_json', 'acf_json_save_point');

function acf_json_save_point($path)
{
    // Update path
    $path = MY_PLUGIN_DIR_PATH . '/acf-json';
    // Return path
    return $path;
}
