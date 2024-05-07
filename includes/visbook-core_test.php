<?php

// Connect to the VisBook API
function visbook_fetch_data_from_api($language_code = '')
{
    $webident = get_option('visbook_webentity');
    $api_url = "https://ws.visbook.com/api/{$webident}/webproducts";

    // Prepare the request args including the Accept-Language header if a language code is provided
    $args = [];
    if (!empty($language_code)) {
        $args['headers'] = [
            'Accept-Language' => $language_code,
        ];
    }

    $response = wp_remote_get($api_url, $args);
    if (is_wp_error($response)) {
        return ['error' => $response->get_error_message()];
    }

    $body = wp_remote_retrieve_body($response);
    $data = json_decode($body, true);
    if (empty($data)) {
        return ['error' => 'No data received from the API'];
    }
    return $data;
}  // end visbook_fetch_data_from_api



// Main Load json function
function visbook_load_json($language_code = '')
{
    update_option('visbook_process_status', 'running');

    error_log('Starting to load JSON.');
    if (!current_user_can('manage_options')) {
        wp_die('Unauthorized user');
    }

    $products_data = visbook_fetch_data_from_api($language_code);
    if ($products_data) {
        if (isset($products_data['error'])) {
            wp_die($products_data['error']);
        }

        // Assuming $products_data is an array of products data
        error_log('JSON data successfully loaded. Language code:' . $language_code);
        return $products_data; // Return the products data directly

    } else {
        error_log('Error: JSON data not loaded.');
        wp_die('Failed to fetch or parse JSON data.');
    }
    update_option('visbook_process_status', 'completed');
} // End visbook_load_json



function visbook_sync_products_with_posts($products, $language_code = 'EN', $sync_images = true)
{
    update_option('visbook_process_status', 'running');

    if (!$products) {
        error_log('Error: No products to sync.');
        return;
    }

    foreach ($products as $product) {
        $post_id = visbook_find_post_by_product_id($product['webProductId']);

        // Insert or update post
        if (!$post_id) {
            $post_data = [
                'post_title' => wp_strip_all_tags($product['name']),
                'post_content' => $language_code === 'EN' ? ($product['description']['long'] ?: '') : '',
                'post_excerpt' => $language_code === 'EN' ? ($product['description']['short'] ?: '') : '',
                'post_status' => 'publish',
                'post_type' => 'product',
            ];

            $post_id = wp_insert_post($post_data);
        }


        // Update common fields applicable to all languages
        if ($language_code === 'EN') {
            visbook_update_common_fields($post_id, $product);
        } else {
            // Update language-specific fields
            visbook_update_language_specific_fields($post_id, $product, $language_code);
        }
        // Optionally track progress here if necessary
    }
    update_option('visbook_process_status', 'completed');
}


// 
// Helper functions
// 

// function to match products with posts
function visbook_find_post_by_product_id($webProductId)
{
    $args = [
        'post_type' => 'product',
        'post_status' => 'any',
        'posts_per_page' => 1,
        'meta_query' => [
            [
                'key' => 'web_product_id',
                'value' => $webProductId,
                'compare' => '=',
            ],
        ],
    ];

    $query = new WP_Query($args);
    return $query->have_posts() ? $query->posts[0]->ID : 0;
}


// function to udate fields that are not language-specific
function visbook_update_common_fields($post_id, $product)
{
    update_option('visbook_process_status', 'running');

    // Update ACF fields
    update_field('field_web_product_id', $product['webProductId'], $post_id);
    update_field('field_65e03f8a4318d', $product['unitName'], $post_id);
    update_field('field_65e03f3a4318c', $product['sortIndex'], $post_id);
    update_field('field_name', $product['type'], $post_id);
    update_field('field_65e03c409a847', $product['maxPeople'], $post_id);
    update_field('field_65e03c609a848', $product['minPeople'], $post_id);
    update_field('field_65e03c759a849', $product['defaultPeople'], $post_id);

    error_log('Inserted values in fields for : ' . $product['name']);


    // Assuming $product['additionalServices'] is an array of services
    if (isset($product['additionalServices']) && is_array($product['additionalServices'])) {
        $services = array();
        foreach ($product['additionalServices'] as $service) {
            $service_entry = array(
                'field_price' => $service['price'],
                'field_65e03d56b6fbd' => $service['id'],
                'field_service_name' => $service['name'],
                'field_service_type' => $service['serviceType'],
                'field_service_relation_type' => $service['serviceRelationType'],
            );

            // Directly access 'rules' without a loop since it's not an array of arrays
            if (isset($service['rules']) && is_array($service['rules'])) {
                $rules = $service['rules']; // Assuming 'rules' is a directly accessible array

                // Directly create the rules array for ACF
                $rules_entry = array(
                    'field_65e03d99b6fbe' => $rules['minValue'],
                    'field_65e03dcab6fbf' => $rules['maxValue'],
                    'field_65e03de7b6fc0' => $rules['selectedByDefault'],
                    'field_65e5a51cfc73e' => $rules['maxValueType'],
                    'field_65e5a558fc73f' => $rules['minValueType'],
                    // Add other rule fields here
                );

                // Assuming 'field_rules' is a repeater field in ACF and expects an array of arrays
                $service_entry['field_rules'] = array($rules_entry);
            }

            $services[] = $service_entry;
        }
        update_field('field_additional_services', $services, $post_id);
        update_option('visbook_process_status', 'completed');
    }

  // Update properties based on new ACF structure
  if (isset($product['properties']) && is_array($product['properties'])) {
    $properties = array();
    foreach ($product['properties'] as $key => $property) {
        $properties[] = array(
            // Assuming 'propertyKey' and other fields are directly mapped
            'propertyKey' => $key,
            'propertyName' => $property['name'],
            'propertyType' => $property['type'],
            'propertyValue' => ($property['type'] === 'integer' && isset($property['value'])) ? (int) $property['value'] : null,
            'propertyText' => $property['text'],
            'propertyDescription' => $property['description'],
            // Assuming direct mapping for other fields; adjust as necessary
        );
    }
    // Assuming 'field_properties' is the correct key for the updated structure
    update_field('field_properties', $properties, $post_id);
    }

      // Assuming $product['images'] is an array of images
      if (isset($product['images']) && is_array($product['images'])) {
        $images = array();
        
        // run function visbook-file-handling, pass $product['images'];
        // visbook_file_handling($product['images'], $webProductId);

            foreach ($product['images'] as $image) {
                // error_log( print_r( 'Bilde her: ' . $image['imagePath'], true ) );
                $images[] = array(
                    'field_image_type' => $image['imageType'], // Adjust the array keys based on your actual data structure
                    'field_image_path' => $image['imagePath']
                );
            }
            update_field('field_images', $images, $post_id);

        } else {
            error_log('No images here:');
        }

    
    update_option('visbook_process_status', 'completed');
}

// Helper function to update language-specific fields
function visbook_update_language_specific_fields($post_id, $product, $language_code) {
    update_option('visbook_process_status', 'running');

    // No changes needed for the basic setup
    if ($language_code !== 'EN') { // Assuming 'EN' is the default language and doesn't need suffix
        error_log('Language found, updating fields. Language: ' . $language_code);

        // Update basic language-specific name field
        $field_name = 'name_' . strtolower($language_code); // Ensure lowercase for consistency
        update_field($field_name, $product['name'], $post_id);

        // Assuming $product['properties'] is an associative array of properties
        if (isset($product['properties']) && is_array($product['properties'])) {
            $properties = array();
            foreach ($product['properties'] as $property_key => $property) {
                // Construct property entry with language-specific fields
                $property_entry = array(
                    // Basic property fields remain unchanged
                    'propertyKey' => $property_key,
                    'propertyType' => $property['type'],
                    'propertyValue' => ($property['type'] === 'integer' && isset($property['value'])) ? (int)$property['value'] : null,
                    // Language-specific fields
                    "propertyName_{$language_code}" => $property['name'], // Assuming field keys are correctly named as in new_acf.txt
                    "propertyText_{$language_code}" => isset($property['text']) ? $property['text'] : '',
                    "propertyDescription_{$language_code}" => $property['description'],
                );

                // Append this property entry to the properties array
                $properties[] = $property_entry;
            }

            // Update the properties repeater field for the post
            // Note: Ensure the field key 'field_65d8b24e03f45' is correct for the properties repeater
            update_field('field_65d8b24e03f45', $properties, $post_id);
        }
    }

    update_option('visbook_process_status', 'completed');
}



function visbook_cleanup_posts($valid_web_product_ids)
{
    update_option('visbook_process_status', 'running');

    // Step 1: Query all posts of your custom post type
    $args = [
        'post_type' => 'product', // Replace with your actual custom post type slug
        'posts_per_page' => -1, // Query all posts
        'fields' => 'ids', // Only get post IDs to improve performance
        'meta_query' => [ // Optional: Directly filter posts that have a web_product_id meta key
            [
                'key' => 'web_product_id',
                'value' => $valid_web_product_ids,
                'compare' => 'NOT IN',
            ],
        ],
    ];

    $query = new WP_Query($args);
    $post_ids_to_delete = $query->posts;

    // Step 2: Delete posts not in the list of valid webProductIds
    foreach ($post_ids_to_delete as $post_id) {
        wp_delete_post($post_id, true); // Set to true to bypass trash
    }
    update_option('visbook_process_status', 'completed');
}


// Languages sync function
function visbook_sync_languages($products_data, $language_code)
{
    update_option('visbook_process_status', 'running');
    foreach ($products_data as $product) {
        $post_id = visbook_find_post_by_product_id($product['webProductId']);

        // Skip if no post found
        if (!$post_id)
            continue;

        // Update language-specific fields
        visbook_update_language_specific_fields($post_id, $product, $language_code);
    }
    update_option('visbook_process_status', 'completed');
}

add_action('wp_ajax_visbook_check_completion', 'visbook_check_completion_callback');
function visbook_check_completion_callback() {
    $status = get_option('visbook_process_status', 'running'); // Assume 'running' as default
    echo $status; // Echo the status for AJAX call to use
    wp_die(); // Terminate AJAX request correctly
}