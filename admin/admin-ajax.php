<?php
if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly.
}

add_action('wp_ajax_my_custom_function', 'my_custom_function');
add_action('wp_ajax_nopriv_my_custom_function', 'my_custom_function'); // For non-logged-in users

function my_custom_function()
{
    if (function_exists('pll_current_language')) {
        // echo pll_current_language('locale');
        echo json_encode(array('result' => pll_current_language('locale')));
    } else {
        echo 'Current language: ' . get_bloginfo("language");
    }
    // Return the result you want to pass to the React plugin
    // echo json_encode(array('result' => 'Hello from PHP!'));
    wp_die(); // Always include wp_die() to terminate the script
}
