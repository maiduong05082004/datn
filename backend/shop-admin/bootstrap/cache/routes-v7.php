<?php

/*
|--------------------------------------------------------------------------
| Load The Cached Routes
|--------------------------------------------------------------------------
|
| Here we will decode and unserialize the RouteCollection instance that
| holds all of the route information for an application. This allows
| us to instantaneously load the entire route map into the router.
|
*/

app('router')->setCompiledRoutes(
    array (
  'compiled' => 
  array (
    0 => false,
    1 => 
    array (
      '/sanctum/csrf-cookie' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'sanctum.csrf-cookie',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/_ignition/health-check' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'ignition.healthCheck',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/_ignition/execute-solution' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'ignition.executeSolution',
          ),
          1 => NULL,
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/_ignition/update-config' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'ignition.updateConfig',
          ),
          1 => NULL,
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/api/client/auth/signup' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'client.auth.signup',
          ),
          1 => NULL,
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/api/client/auth/signin' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'client.auth.signin',
          ),
          1 => NULL,
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/api/client/auth/logout' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'client.auth.logout',
          ),
          1 => NULL,
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/api/client/auth/profile' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'client.auth.profile',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/api/client/auth/forgot-password' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'client.auth.password.email',
          ),
          1 => NULL,
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/api/client/auth/reset-password' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'client.auth.password.update',
          ),
          1 => NULL,
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/api/client/auth/google' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'client.auth.google.redirect',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/api/client/auth/callback/google' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'client.auth.google.callback',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/api/client/categories' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'client.categories.list',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/api/client/categories/colors' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'client.categories.',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/api/client/promotions' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'client.',
          ),
          1 => NULL,
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/api/client/promotions/available-promotions' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'client.generated::0SHc2nRriwdZZKfG',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/api/client/promotions/history' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'client.generated::EpzpG7iQhjqI8kpT',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/api/client/promotions/check' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'client.generated::qAHgk01RU32sXPcS',
          ),
          1 => NULL,
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/api/client/home' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'client.home.index',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/api/client/home/search' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'client.home.search',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/api/client/shippingaddress' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'client.shippingaddress.index',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
        1 => 
        array (
          0 => 
          array (
            '_route' => 'client.shippingaddress.store',
          ),
          1 => NULL,
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/api/client/products/purchase' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'client.products.purchase',
          ),
          1 => NULL,
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/api/client/products' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'client.products.index',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/api/client/cart' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'client.cart.index',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/api/client/cart/add' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'client.cart.add',
          ),
          1 => NULL,
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/api/client/wishlist/add' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'client.wishlist.wishlist.add',
          ),
          1 => NULL,
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/api/client/wishlist' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'client.wishlist.wishlist.index',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/api/client/checkout' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'client.checkout.submit',
          ),
          1 => NULL,
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/api/client/checkout/success' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'client.checkout.success',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/api/client/checkout/cancel' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'client.checkout.cancel',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/api/client/checkout/callback' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'client.checkout.callback',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/api/client/comment/store' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'client.comment.comment.store',
          ),
          1 => NULL,
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/api/client/comment/update' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'client.comment.comment.update',
          ),
          1 => NULL,
          2 => 
          array (
            'PUT' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/api/client/comment/destroy' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'client.comment.comment->destroy',
          ),
          1 => NULL,
          2 => 
          array (
            'DELETE' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/api/client/comment/rating' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'client.comment.comment.rating',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/api/admins/signin' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'admins.signin',
          ),
          1 => NULL,
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/api/admins/products' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'admins.products.index',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
        1 => 
        array (
          0 => 
          array (
            '_route' => 'admins.products.store',
          ),
          1 => NULL,
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/api/admins/attributes' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'admins.attributes.index',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
        1 => 
        array (
          0 => 
          array (
            '_route' => 'admins.attributes.store',
          ),
          1 => NULL,
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/api/admins/attribute_groups' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'admins.attribute_groups.index',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
        1 => 
        array (
          0 => 
          array (
            '_route' => 'admins.attribute_groups.store',
          ),
          1 => NULL,
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/api/admins/attribute_values' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'admins.attribute_values.index',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
        1 => 
        array (
          0 => 
          array (
            '_route' => 'admins.attribute_values.store',
          ),
          1 => NULL,
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/api/admins/categories/trash' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'admins.generated::oxuSDXXxRnlggsan',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/api/admins/categories' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'admins.categories.index',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
        1 => 
        array (
          0 => 
          array (
            '_route' => 'admins.categories.store',
          ),
          1 => NULL,
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/api/admins/users' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'admins.generated::UTaRfv8e3mOjCUrX',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
        1 => 
        array (
          0 => 
          array (
            '_route' => 'admins.generated::NOSXdVrIIzS8LACN',
          ),
          1 => NULL,
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/api/admins/promotions/new-users' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'admins.promotions.new-users',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/api/admins/promotions' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'admins.promotions.index',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
        1 => 
        array (
          0 => 
          array (
            '_route' => 'admins.promotions.store',
          ),
          1 => NULL,
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/api/admins/promotions/products/by-ids' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'admins.products.by-ids',
          ),
          1 => NULL,
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/api/admins/orders' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'admins.orders.index',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/api/admins/orders/pending' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'admins.orders.pending',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/api/admins/orders/processed' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'admins.orders.processed',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/api/admins/orders/shipped' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'admins.orders.shipped',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/api/admins/orders/delivered' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'admins.orders.delivered',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/api/admins/orders/canceled' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'admins.orders.canceled',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/api/admins/orders/search_order' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'admins.orders.searchorder',
          ),
          1 => NULL,
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/api/admins/orders/search-pending' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'admins.orders.searchpending',
          ),
          1 => NULL,
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/api/admins/orders/search-processed' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'admins.orders.searchprocessed',
          ),
          1 => NULL,
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/api/admins/orders/search-shipped' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'admins.orders.searchshipped',
          ),
          1 => NULL,
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/api/admins/orders/search-delivered' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'admins.orders.searchdelivered',
          ),
          1 => NULL,
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/api/admins/orders/search-canceled' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'admins.orders.searchcanceled',
          ),
          1 => NULL,
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/api/admins/comment/list' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'admins.comment.comment.list',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/api/admins/comment/approve' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'admins.comment.comment.approve',
          ),
          1 => NULL,
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/api/admins/comment/reply' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'admins.comment.comment.reply',
          ),
          1 => NULL,
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/api/admins/comment/hide' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'admins.comment.comment.hide',
          ),
          1 => NULL,
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/api/admins/comment/report' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'admins.comment.comment.report',
          ),
          1 => NULL,
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/api/admins/comment/manageUser' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'admins.comment.comment.manageUser',
          ),
          1 => NULL,
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/api/admins/inventory' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'admins.inventory.obsolete',
          ),
          1 => NULL,
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      '/' => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'generated::UMr308sq4wBnoQbb',
          ),
          1 => NULL,
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
    ),
    2 => 
    array (
      0 => '{^(?|/api/(?|client/(?|auth/reset\\-password/([^/]++)(*:54)|ca(?|tegories/([^/]++)(?|(*:86)|/(?|sizes(*:102)|children(*:118)))|rt/(?|update/([^/]++)(*:149)|([^/]++)(*:165)))|pro(?|motions/product/([^/]++)(*:205)|ducts/(?|showDetail(?|/([^/]++)(*:244)|Order/([^/]++)(*:266))|orders/c(?|ancel/([^/]++)(*:300)|onfirm/([^/]++)(*:323))))|shippingaddress/([^/]++)(?|(*:361))|wishlist/remove/([^/]++)(*:394))|admins/(?|pro(?|ducts/([^/]++)(?|(*:436))|motions/(?|([^/]++)(?|(*:467))|user/([^/]++)/product/([^/]++)(*:506)|event/([^/]++)(*:528)))|images/([^/]++)/([^/]++)(*:562)|attribute(?|s/([^/]++)(?|(*:595))|_(?|groups/([^/]++)(?|(*:626)|/attributes/([^/]++)(*:654))|values/([^/]++)(?|(*:681))))|categories/([^/]++)(?|/(?|soft\\-delete(*:730)|restore(*:745))|(*:754))|users/(?|([^/]++)(?|(*:783))|users(?|(*:800)|/([^/]++)(?|(*:820)))|([^/]++)/(?|block(*:847)|unblock(*:862)))|orders/(?|show_detailorder/([^/]++)(*:907)|update_order/([^/]++)(*:936)|ghn\\-(?|c(?|reate/([^/]++)(*:970)|ancel/([^/]++)(*:992))|detail/([^/]++)(*:1016)|update/([^/]++)(*:1040))))))/?$}sDu',
    ),
    3 => 
    array (
      54 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'client.auth.password.reset',
          ),
          1 => 
          array (
            0 => 'token',
          ),
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => true,
          6 => NULL,
        ),
      ),
      86 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'client.categories.generated::0UXelhpQyxgIdXSe',
          ),
          1 => 
          array (
            0 => 'id',
          ),
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => true,
          6 => NULL,
        ),
      ),
      102 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'client.categories.generated::jO5xZ43pLUfA9lUs',
          ),
          1 => 
          array (
            0 => 'id',
          ),
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      118 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'client.categories.generated::tgp0FmYPsWEMqGGH',
          ),
          1 => 
          array (
            0 => 'id',
          ),
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      149 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'client.cart.update',
          ),
          1 => 
          array (
            0 => 'id',
          ),
          2 => 
          array (
            'PUT' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => true,
          6 => NULL,
        ),
      ),
      165 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'client.cart.remove',
          ),
          1 => 
          array (
            0 => 'id',
          ),
          2 => 
          array (
            'DELETE' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => true,
          6 => NULL,
        ),
      ),
      205 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'client.generated::6yppc7Mt2rq9Iv9k',
          ),
          1 => 
          array (
            0 => 'productId',
          ),
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => true,
          6 => NULL,
        ),
      ),
      244 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'client.products.showDetail',
          ),
          1 => 
          array (
            0 => 'id',
          ),
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => true,
          6 => NULL,
        ),
      ),
      266 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'client.products.showDetailOrder',
          ),
          1 => 
          array (
            0 => 'oderId',
          ),
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => true,
          6 => NULL,
        ),
      ),
      300 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'client.products.',
          ),
          1 => 
          array (
            0 => 'orderId',
          ),
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => true,
          6 => NULL,
        ),
      ),
      323 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'client.products.generated::FN9hWtkA6hiEobMy',
          ),
          1 => 
          array (
            0 => 'orderId',
          ),
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => true,
          6 => NULL,
        ),
      ),
      361 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'client.shippingaddress.show',
          ),
          1 => 
          array (
            0 => 'shippingaddress',
          ),
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => true,
          6 => NULL,
        ),
        1 => 
        array (
          0 => 
          array (
            '_route' => 'client.shippingaddress.update',
          ),
          1 => 
          array (
            0 => 'shippingaddress',
          ),
          2 => 
          array (
            'PUT' => 0,
            'PATCH' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => true,
          6 => NULL,
        ),
        2 => 
        array (
          0 => 
          array (
            '_route' => 'client.shippingaddress.destroy',
          ),
          1 => 
          array (
            0 => 'shippingaddress',
          ),
          2 => 
          array (
            'DELETE' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => true,
          6 => NULL,
        ),
      ),
      394 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'client.wishlist.wishlist.remove',
          ),
          1 => 
          array (
            0 => 'id',
          ),
          2 => 
          array (
            'DELETE' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => true,
          6 => NULL,
        ),
      ),
      436 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'admins.products.show',
          ),
          1 => 
          array (
            0 => 'product',
          ),
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => true,
          6 => NULL,
        ),
        1 => 
        array (
          0 => 
          array (
            '_route' => 'admins.products.update',
          ),
          1 => 
          array (
            0 => 'product',
          ),
          2 => 
          array (
            'PUT' => 0,
            'PATCH' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => true,
          6 => NULL,
        ),
        2 => 
        array (
          0 => 
          array (
            '_route' => 'admins.products.destroy',
          ),
          1 => 
          array (
            0 => 'product',
          ),
          2 => 
          array (
            'DELETE' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => true,
          6 => NULL,
        ),
      ),
      467 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'admins.promotions.show',
          ),
          1 => 
          array (
            0 => 'id',
          ),
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => true,
          6 => NULL,
        ),
        1 => 
        array (
          0 => 
          array (
            '_route' => 'admins.promotions.update',
          ),
          1 => 
          array (
            0 => 'id',
          ),
          2 => 
          array (
            'PUT' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => true,
          6 => NULL,
        ),
        2 => 
        array (
          0 => 
          array (
            '_route' => 'admins.promotions.destroy',
          ),
          1 => 
          array (
            0 => 'id',
          ),
          2 => 
          array (
            'DELETE' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => true,
          6 => NULL,
        ),
      ),
      506 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'admins.promotions.user-product',
          ),
          1 => 
          array (
            0 => 'userId',
            1 => 'productId',
          ),
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => true,
          6 => NULL,
        ),
      ),
      528 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'admins.promotions.event',
          ),
          1 => 
          array (
            0 => 'eventName',
          ),
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => true,
          6 => NULL,
        ),
      ),
      562 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'admins.images.deleteByPath',
          ),
          1 => 
          array (
            0 => 'type',
            1 => 'encodedPath',
          ),
          2 => 
          array (
            'DELETE' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => true,
          6 => NULL,
        ),
      ),
      595 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'admins.attributes.show',
          ),
          1 => 
          array (
            0 => 'attribute',
          ),
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => true,
          6 => NULL,
        ),
        1 => 
        array (
          0 => 
          array (
            '_route' => 'admins.attributes.update',
          ),
          1 => 
          array (
            0 => 'attribute',
          ),
          2 => 
          array (
            'PUT' => 0,
            'PATCH' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => true,
          6 => NULL,
        ),
        2 => 
        array (
          0 => 
          array (
            '_route' => 'admins.attributes.destroy',
          ),
          1 => 
          array (
            0 => 'attribute',
          ),
          2 => 
          array (
            'DELETE' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => true,
          6 => NULL,
        ),
      ),
      626 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'admins.attribute_groups.show',
          ),
          1 => 
          array (
            0 => 'attribute_group',
          ),
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => true,
          6 => NULL,
        ),
        1 => 
        array (
          0 => 
          array (
            '_route' => 'admins.attribute_groups.update',
          ),
          1 => 
          array (
            0 => 'attribute_group',
          ),
          2 => 
          array (
            'PUT' => 0,
            'PATCH' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => true,
          6 => NULL,
        ),
        2 => 
        array (
          0 => 
          array (
            '_route' => 'admins.attribute_groups.destroy',
          ),
          1 => 
          array (
            0 => 'attribute_group',
          ),
          2 => 
          array (
            'DELETE' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => true,
          6 => NULL,
        ),
      ),
      654 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'admins.',
          ),
          1 => 
          array (
            0 => 'group_id',
            1 => 'attribute_id',
          ),
          2 => 
          array (
            'DELETE' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => true,
          6 => NULL,
        ),
      ),
      681 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'admins.attribute_values.show',
          ),
          1 => 
          array (
            0 => 'attribute_value',
          ),
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => true,
          6 => NULL,
        ),
        1 => 
        array (
          0 => 
          array (
            '_route' => 'admins.attribute_values.update',
          ),
          1 => 
          array (
            0 => 'attribute_value',
          ),
          2 => 
          array (
            'PUT' => 0,
            'PATCH' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => true,
          6 => NULL,
        ),
        2 => 
        array (
          0 => 
          array (
            '_route' => 'admins.attribute_values.destroy',
          ),
          1 => 
          array (
            0 => 'attribute_value',
          ),
          2 => 
          array (
            'DELETE' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => true,
          6 => NULL,
        ),
      ),
      730 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'admins.categories.soft-delete',
          ),
          1 => 
          array (
            0 => 'id',
          ),
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      745 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'admins.categories.restore',
          ),
          1 => 
          array (
            0 => 'id',
          ),
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      754 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'admins.categories.show',
          ),
          1 => 
          array (
            0 => 'category',
          ),
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => true,
          6 => NULL,
        ),
        1 => 
        array (
          0 => 
          array (
            '_route' => 'admins.categories.update',
          ),
          1 => 
          array (
            0 => 'category',
          ),
          2 => 
          array (
            'PUT' => 0,
            'PATCH' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => true,
          6 => NULL,
        ),
        2 => 
        array (
          0 => 
          array (
            '_route' => 'admins.categories.destroy',
          ),
          1 => 
          array (
            0 => 'category',
          ),
          2 => 
          array (
            'DELETE' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => true,
          6 => NULL,
        ),
      ),
      783 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'admins.generated::uM5KTIkPJOKXSpJk',
          ),
          1 => 
          array (
            0 => 'id',
          ),
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => true,
          6 => NULL,
        ),
        1 => 
        array (
          0 => 
          array (
            '_route' => 'admins.generated::8Cz7H7nBmxAucBmW',
          ),
          1 => 
          array (
            0 => 'id',
          ),
          2 => 
          array (
            'PUT' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => true,
          6 => NULL,
        ),
      ),
      800 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'admins.users.index',
          ),
          1 => 
          array (
          ),
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
        1 => 
        array (
          0 => 
          array (
            '_route' => 'admins.users.store',
          ),
          1 => 
          array (
          ),
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      820 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'admins.users.show',
          ),
          1 => 
          array (
            0 => 'user',
          ),
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => true,
          6 => NULL,
        ),
        1 => 
        array (
          0 => 
          array (
            '_route' => 'admins.users.update',
          ),
          1 => 
          array (
            0 => 'user',
          ),
          2 => 
          array (
            'PUT' => 0,
            'PATCH' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => true,
          6 => NULL,
        ),
        2 => 
        array (
          0 => 
          array (
            '_route' => 'admins.users.destroy',
          ),
          1 => 
          array (
            0 => 'user',
          ),
          2 => 
          array (
            'DELETE' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => true,
          6 => NULL,
        ),
      ),
      847 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'admins.generated::IgKZ82AA3Qz52zfV',
          ),
          1 => 
          array (
            0 => 'id',
          ),
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      862 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'admins.generated::pRTExIhSxJFiKInn',
          ),
          1 => 
          array (
            0 => 'id',
          ),
          2 => 
          array (
            'PUT' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => false,
          6 => NULL,
        ),
      ),
      907 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'admins.orders.showdetailorder',
          ),
          1 => 
          array (
            0 => 'id',
          ),
          2 => 
          array (
            'GET' => 0,
            'HEAD' => 1,
          ),
          3 => NULL,
          4 => false,
          5 => true,
          6 => NULL,
        ),
      ),
      936 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'admins.orders.updateorder',
          ),
          1 => 
          array (
            0 => 'id',
          ),
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => true,
          6 => NULL,
        ),
      ),
      970 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'admins.orders.createGHNOrder',
          ),
          1 => 
          array (
            0 => 'billId',
          ),
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => true,
          6 => NULL,
        ),
      ),
      992 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'admins.orders.cancelGHNOrder',
          ),
          1 => 
          array (
            0 => 'billId',
          ),
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => true,
          6 => NULL,
        ),
      ),
      1016 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'admins.orders.getGHNOrderDetail',
          ),
          1 => 
          array (
            0 => 'billId',
          ),
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => true,
          6 => NULL,
        ),
      ),
      1040 => 
      array (
        0 => 
        array (
          0 => 
          array (
            '_route' => 'admins.orders.updateGHNOrder',
          ),
          1 => 
          array (
            0 => 'billId',
          ),
          2 => 
          array (
            'POST' => 0,
          ),
          3 => NULL,
          4 => false,
          5 => true,
          6 => NULL,
        ),
        1 => 
        array (
          0 => NULL,
          1 => NULL,
          2 => NULL,
          3 => NULL,
          4 => false,
          5 => false,
          6 => 0,
        ),
      ),
    ),
    4 => NULL,
  ),
  'attributes' => 
  array (
    'sanctum.csrf-cookie' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'sanctum/csrf-cookie',
      'action' => 
      array (
        'uses' => 'Laravel\\Sanctum\\Http\\Controllers\\CsrfCookieController@show',
        'controller' => 'Laravel\\Sanctum\\Http\\Controllers\\CsrfCookieController@show',
        'namespace' => NULL,
        'prefix' => 'sanctum',
        'where' => 
        array (
        ),
        'middleware' => 
        array (
          0 => 'web',
        ),
        'as' => 'sanctum.csrf-cookie',
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'ignition.healthCheck' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => '_ignition/health-check',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'Spatie\\LaravelIgnition\\Http\\Middleware\\RunnableSolutionsEnabled',
        ),
        'uses' => 'Spatie\\LaravelIgnition\\Http\\Controllers\\HealthCheckController@__invoke',
        'controller' => 'Spatie\\LaravelIgnition\\Http\\Controllers\\HealthCheckController',
        'as' => 'ignition.healthCheck',
        'namespace' => NULL,
        'prefix' => '_ignition',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'ignition.executeSolution' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => '_ignition/execute-solution',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'Spatie\\LaravelIgnition\\Http\\Middleware\\RunnableSolutionsEnabled',
        ),
        'uses' => 'Spatie\\LaravelIgnition\\Http\\Controllers\\ExecuteSolutionController@__invoke',
        'controller' => 'Spatie\\LaravelIgnition\\Http\\Controllers\\ExecuteSolutionController',
        'as' => 'ignition.executeSolution',
        'namespace' => NULL,
        'prefix' => '_ignition',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'ignition.updateConfig' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => '_ignition/update-config',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'Spatie\\LaravelIgnition\\Http\\Middleware\\RunnableSolutionsEnabled',
        ),
        'uses' => 'Spatie\\LaravelIgnition\\Http\\Controllers\\UpdateConfigController@__invoke',
        'controller' => 'Spatie\\LaravelIgnition\\Http\\Controllers\\UpdateConfigController',
        'as' => 'ignition.updateConfig',
        'namespace' => NULL,
        'prefix' => '_ignition',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'client.auth.signup' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'api/client/auth/signup',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Client\\AuthController@register',
        'controller' => 'App\\Http\\Controllers\\Api\\Client\\AuthController@register',
        'as' => 'client.auth.signup',
        'namespace' => NULL,
        'prefix' => 'api/client/auth',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'client.auth.signin' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'api/client/auth/signin',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Client\\AuthController@login',
        'controller' => 'App\\Http\\Controllers\\Api\\Client\\AuthController@login',
        'as' => 'client.auth.signin',
        'namespace' => NULL,
        'prefix' => 'api/client/auth',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'client.auth.logout' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'api/client/auth/logout',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'auth:sanctum',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Client\\AuthController@logout',
        'controller' => 'App\\Http\\Controllers\\Api\\Client\\AuthController@logout',
        'as' => 'client.auth.logout',
        'namespace' => NULL,
        'prefix' => 'api/client/auth',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'client.auth.profile' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'api/client/auth/profile',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'auth:sanctum',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Client\\AuthController@user',
        'controller' => 'App\\Http\\Controllers\\Api\\Client\\AuthController@user',
        'as' => 'client.auth.profile',
        'namespace' => NULL,
        'prefix' => 'api/client/auth',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'client.auth.password.email' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'api/client/auth/forgot-password',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'guest',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Client\\AuthController@forgotPassword',
        'controller' => 'App\\Http\\Controllers\\Api\\Client\\AuthController@forgotPassword',
        'as' => 'client.auth.password.email',
        'namespace' => NULL,
        'prefix' => 'api/client/auth',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'client.auth.password.update' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'api/client/auth/reset-password',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'guest',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Client\\AuthController@resetPassword',
        'controller' => 'App\\Http\\Controllers\\Api\\Client\\AuthController@resetPassword',
        'as' => 'client.auth.password.update',
        'namespace' => NULL,
        'prefix' => 'api/client/auth',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'client.auth.password.reset' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'api/client/auth/reset-password/{token}',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'guest',
        ),
        'uses' => 'O:55:"Laravel\\SerializableClosure\\UnsignedSerializableClosure":1:{s:12:"serializable";O:46:"Laravel\\SerializableClosure\\Serializers\\Native":5:{s:3:"use";a:0:{}s:8:"function";s:96:"function ($token) {
                return \\response()->json([\'token\' => $token]);
            }";s:5:"scope";s:37:"Illuminate\\Routing\\RouteFileRegistrar";s:4:"this";N;s:4:"self";s:32:"00000000000007f20000000000000000";}}',
        'as' => 'client.auth.password.reset',
        'namespace' => NULL,
        'prefix' => 'api/client/auth',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'client.auth.google.redirect' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'api/client/auth/google',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Client\\AuthController@redirectToGoogle',
        'controller' => 'App\\Http\\Controllers\\Api\\Client\\AuthController@redirectToGoogle',
        'as' => 'client.auth.google.redirect',
        'namespace' => NULL,
        'prefix' => 'api/client/auth',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'client.auth.google.callback' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'api/client/auth/callback/google',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Client\\AuthController@handleGoogleCallback',
        'controller' => 'App\\Http\\Controllers\\Api\\Client\\AuthController@handleGoogleCallback',
        'as' => 'client.auth.google.callback',
        'namespace' => NULL,
        'prefix' => 'api/client/auth',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'client.categories.list' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'api/client/categories',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Client\\CategoryController@index',
        'controller' => 'App\\Http\\Controllers\\Api\\Client\\CategoryController@index',
        'as' => 'client.categories.list',
        'namespace' => NULL,
        'prefix' => 'api/client/categories',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'client.categories.' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'api/client/categories/colors',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Client\\CategoryController@getAllColors',
        'controller' => 'App\\Http\\Controllers\\Api\\Client\\CategoryController@getAllColors',
        'as' => 'client.categories.',
        'namespace' => NULL,
        'prefix' => 'api/client/categories',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'client.categories.generated::0UXelhpQyxgIdXSe' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'api/client/categories/{id}',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Client\\CategoryController@getFilterOptionsByCategory',
        'controller' => 'App\\Http\\Controllers\\Api\\Client\\CategoryController@getFilterOptionsByCategory',
        'as' => 'client.categories.generated::0UXelhpQyxgIdXSe',
        'namespace' => NULL,
        'prefix' => 'api/client/categories',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'client.categories.generated::jO5xZ43pLUfA9lUs' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'api/client/categories/{id}/sizes',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Client\\CategoryController@getCategoryAttributes',
        'controller' => 'App\\Http\\Controllers\\Api\\Client\\CategoryController@getCategoryAttributes',
        'as' => 'client.categories.generated::jO5xZ43pLUfA9lUs',
        'namespace' => NULL,
        'prefix' => 'api/client/categories',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'client.categories.generated::tgp0FmYPsWEMqGGH' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'api/client/categories/{id}/children',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Client\\CategoryController@getCategoryChildren',
        'controller' => 'App\\Http\\Controllers\\Api\\Client\\CategoryController@getCategoryChildren',
        'as' => 'client.categories.generated::tgp0FmYPsWEMqGGH',
        'namespace' => NULL,
        'prefix' => 'api/client/categories',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'client.' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'api/client/promotions',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'auth:sanctum',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Client\\PromotionController@applyPromotion',
        'controller' => 'App\\Http\\Controllers\\Api\\Client\\PromotionController@applyPromotion',
        'as' => 'client.',
        'namespace' => NULL,
        'prefix' => 'api/client/promotions',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'client.generated::0SHc2nRriwdZZKfG' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'api/client/promotions/available-promotions',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'auth:sanctum',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Client\\PromotionController@getAvailablePromotions',
        'controller' => 'App\\Http\\Controllers\\Api\\Client\\PromotionController@getAvailablePromotions',
        'as' => 'client.generated::0SHc2nRriwdZZKfG',
        'namespace' => NULL,
        'prefix' => 'api/client/promotions',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'client.generated::EpzpG7iQhjqI8kpT' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'api/client/promotions/history',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'auth:sanctum',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Client\\PromotionController@getPromotionHistory',
        'controller' => 'App\\Http\\Controllers\\Api\\Client\\PromotionController@getPromotionHistory',
        'as' => 'client.generated::EpzpG7iQhjqI8kpT',
        'namespace' => NULL,
        'prefix' => 'api/client/promotions',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'client.generated::qAHgk01RU32sXPcS' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'api/client/promotions/check',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'auth:sanctum',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Client\\PromotionController@checkPromotion',
        'controller' => 'App\\Http\\Controllers\\Api\\Client\\PromotionController@checkPromotion',
        'as' => 'client.generated::qAHgk01RU32sXPcS',
        'namespace' => NULL,
        'prefix' => 'api/client/promotions',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'client.generated::6yppc7Mt2rq9Iv9k' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'api/client/promotions/product/{productId}',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'auth:sanctum',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Client\\PromotionController@getProductPromotions',
        'controller' => 'App\\Http\\Controllers\\Api\\Client\\PromotionController@getProductPromotions',
        'as' => 'client.generated::6yppc7Mt2rq9Iv9k',
        'namespace' => NULL,
        'prefix' => 'api/client/promotions',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'client.home.index' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'api/client/home',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Client\\HomeController@index',
        'controller' => 'App\\Http\\Controllers\\Api\\Client\\HomeController@index',
        'as' => 'client.home.index',
        'namespace' => NULL,
        'prefix' => 'api/client/home',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'client.home.search' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'api/client/home/search',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Client\\HomeController@search',
        'controller' => 'App\\Http\\Controllers\\Api\\Client\\HomeController@search',
        'as' => 'client.home.search',
        'namespace' => NULL,
        'prefix' => 'api/client/home',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'client.shippingaddress.index' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'api/client/shippingaddress',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
        ),
        'as' => 'client.shippingaddress.index',
        'uses' => 'App\\Http\\Controllers\\Api\\Client\\Product\\ShippingController@index',
        'controller' => 'App\\Http\\Controllers\\Api\\Client\\Product\\ShippingController@index',
        'namespace' => NULL,
        'prefix' => 'api/client',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'client.shippingaddress.store' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'api/client/shippingaddress',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
        ),
        'as' => 'client.shippingaddress.store',
        'uses' => 'App\\Http\\Controllers\\Api\\Client\\Product\\ShippingController@store',
        'controller' => 'App\\Http\\Controllers\\Api\\Client\\Product\\ShippingController@store',
        'namespace' => NULL,
        'prefix' => 'api/client',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'client.shippingaddress.show' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'api/client/shippingaddress/{shippingaddress}',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
        ),
        'as' => 'client.shippingaddress.show',
        'uses' => 'App\\Http\\Controllers\\Api\\Client\\Product\\ShippingController@show',
        'controller' => 'App\\Http\\Controllers\\Api\\Client\\Product\\ShippingController@show',
        'namespace' => NULL,
        'prefix' => 'api/client',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'client.shippingaddress.update' => 
    array (
      'methods' => 
      array (
        0 => 'PUT',
        1 => 'PATCH',
      ),
      'uri' => 'api/client/shippingaddress/{shippingaddress}',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
        ),
        'as' => 'client.shippingaddress.update',
        'uses' => 'App\\Http\\Controllers\\Api\\Client\\Product\\ShippingController@update',
        'controller' => 'App\\Http\\Controllers\\Api\\Client\\Product\\ShippingController@update',
        'namespace' => NULL,
        'prefix' => 'api/client',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'client.shippingaddress.destroy' => 
    array (
      'methods' => 
      array (
        0 => 'DELETE',
      ),
      'uri' => 'api/client/shippingaddress/{shippingaddress}',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
        ),
        'as' => 'client.shippingaddress.destroy',
        'uses' => 'App\\Http\\Controllers\\Api\\Client\\Product\\ShippingController@destroy',
        'controller' => 'App\\Http\\Controllers\\Api\\Client\\Product\\ShippingController@destroy',
        'namespace' => NULL,
        'prefix' => 'api/client',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'client.products.showDetail' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'api/client/products/showDetail/{id}',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Client\\Product\\ProductController@showDetail',
        'controller' => 'App\\Http\\Controllers\\Api\\Client\\Product\\ProductController@showDetail',
        'as' => 'client.products.showDetail',
        'namespace' => NULL,
        'prefix' => 'api/client/products',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'client.products.purchase' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'api/client/products/purchase',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'auth:sanctum',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Client\\Product\\ProductController@purchase',
        'controller' => 'App\\Http\\Controllers\\Api\\Client\\Product\\ProductController@purchase',
        'as' => 'client.products.purchase',
        'namespace' => NULL,
        'prefix' => 'api/client/products',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'client.products.index' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'api/client/products',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Client\\Product\\ProductController@index',
        'controller' => 'App\\Http\\Controllers\\Api\\Client\\Product\\ProductController@index',
        'as' => 'client.products.index',
        'namespace' => NULL,
        'prefix' => 'api/client/products',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'client.products.showDetailOrder' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'api/client/products/showDetailOrder/{oderId}',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Client\\Product\\ProductController@showDetailOrder',
        'controller' => 'App\\Http\\Controllers\\Api\\Client\\Product\\ProductController@showDetailOrder',
        'as' => 'client.products.showDetailOrder',
        'namespace' => NULL,
        'prefix' => 'api/client/products',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'client.products.' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'api/client/products/orders/cancel/{orderId}',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Client\\Product\\ProductController@cancelOrder',
        'controller' => 'App\\Http\\Controllers\\Api\\Client\\Product\\ProductController@cancelOrder',
        'as' => 'client.products.',
        'namespace' => NULL,
        'prefix' => 'api/client/products',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'client.products.generated::FN9hWtkA6hiEobMy' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'api/client/products/orders/confirm/{orderId}',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Client\\Product\\ProductController@confirmOrder',
        'controller' => 'App\\Http\\Controllers\\Api\\Client\\Product\\ProductController@confirmOrder',
        'as' => 'client.products.generated::FN9hWtkA6hiEobMy',
        'namespace' => NULL,
        'prefix' => 'api/client/products',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'client.cart.index' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'api/client/cart',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'auth:sanctum',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Client\\Product\\CartController@getCartItems',
        'controller' => 'App\\Http\\Controllers\\Api\\Client\\Product\\CartController@getCartItems',
        'as' => 'client.cart.index',
        'namespace' => NULL,
        'prefix' => 'api/client/cart',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'client.cart.add' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'api/client/cart/add',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'auth:sanctum',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Client\\Product\\CartController@addToCart',
        'controller' => 'App\\Http\\Controllers\\Api\\Client\\Product\\CartController@addToCart',
        'as' => 'client.cart.add',
        'namespace' => NULL,
        'prefix' => 'api/client/cart',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'client.cart.update' => 
    array (
      'methods' => 
      array (
        0 => 'PUT',
      ),
      'uri' => 'api/client/cart/update/{id}',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'auth:sanctum',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Client\\Product\\CartController@updateCartItem',
        'controller' => 'App\\Http\\Controllers\\Api\\Client\\Product\\CartController@updateCartItem',
        'as' => 'client.cart.update',
        'namespace' => NULL,
        'prefix' => 'api/client/cart',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'client.cart.remove' => 
    array (
      'methods' => 
      array (
        0 => 'DELETE',
      ),
      'uri' => 'api/client/cart/{id}',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'auth:sanctum',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Client\\Product\\CartController@removeCartItem',
        'controller' => 'App\\Http\\Controllers\\Api\\Client\\Product\\CartController@removeCartItem',
        'as' => 'client.cart.remove',
        'namespace' => NULL,
        'prefix' => 'api/client/cart',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'client.wishlist.wishlist.add' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'api/client/wishlist/add',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'auth:sanctum',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Admin\\WishlistController@addToWishlist',
        'controller' => 'App\\Http\\Controllers\\Api\\Admin\\WishlistController@addToWishlist',
        'as' => 'client.wishlist.wishlist.add',
        'namespace' => NULL,
        'prefix' => 'api/client/wishlist',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'client.wishlist.wishlist.index' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'api/client/wishlist',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'auth:sanctum',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Admin\\WishlistController@index',
        'controller' => 'App\\Http\\Controllers\\Api\\Admin\\WishlistController@index',
        'as' => 'client.wishlist.wishlist.index',
        'namespace' => NULL,
        'prefix' => 'api/client/wishlist',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'client.wishlist.wishlist.remove' => 
    array (
      'methods' => 
      array (
        0 => 'DELETE',
      ),
      'uri' => 'api/client/wishlist/remove/{id}',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'auth:sanctum',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Admin\\WishlistController@destroy',
        'controller' => 'App\\Http\\Controllers\\Api\\Admin\\WishlistController@destroy',
        'as' => 'client.wishlist.wishlist.remove',
        'namespace' => NULL,
        'prefix' => 'api/client/wishlist',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'client.checkout.submit' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'api/client/checkout',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Client\\CheckoutController@submit',
        'controller' => 'App\\Http\\Controllers\\Api\\Client\\CheckoutController@submit',
        'as' => 'client.checkout.submit',
        'namespace' => NULL,
        'prefix' => 'api/client/checkout',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'client.checkout.success' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'api/client/checkout/success',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Client\\CheckoutController@success',
        'controller' => 'App\\Http\\Controllers\\Api\\Client\\CheckoutController@success',
        'as' => 'client.checkout.success',
        'namespace' => NULL,
        'prefix' => 'api/client/checkout',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'client.checkout.cancel' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'api/client/checkout/cancel',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Client\\CheckoutController@cancel',
        'controller' => 'App\\Http\\Controllers\\Api\\Client\\CheckoutController@cancel',
        'as' => 'client.checkout.cancel',
        'namespace' => NULL,
        'prefix' => 'api/client/checkout',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'client.checkout.callback' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'api/client/checkout/callback',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Client\\CheckoutController@vnpayCallback',
        'controller' => 'App\\Http\\Controllers\\Api\\Client\\CheckoutController@vnpayCallback',
        'as' => 'client.checkout.callback',
        'namespace' => NULL,
        'prefix' => 'api/client/checkout',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'client.comment.comment.store' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'api/client/comment/store',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Client\\CommentController@store',
        'controller' => 'App\\Http\\Controllers\\Api\\Client\\CommentController@store',
        'as' => 'client.comment.comment.store',
        'namespace' => NULL,
        'prefix' => 'api/client/comment',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'client.comment.comment.update' => 
    array (
      'methods' => 
      array (
        0 => 'PUT',
      ),
      'uri' => 'api/client/comment/update',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Client\\CommentController@update',
        'controller' => 'App\\Http\\Controllers\\Api\\Client\\CommentController@update',
        'as' => 'client.comment.comment.update',
        'namespace' => NULL,
        'prefix' => 'api/client/comment',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'client.comment.comment->destroy' => 
    array (
      'methods' => 
      array (
        0 => 'DELETE',
      ),
      'uri' => 'api/client/comment/destroy',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Client\\CommentController@destroy',
        'controller' => 'App\\Http\\Controllers\\Api\\Client\\CommentController@destroy',
        'as' => 'client.comment.comment->destroy',
        'namespace' => NULL,
        'prefix' => 'api/client/comment',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'client.comment.comment.rating' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'api/client/comment/rating',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Client\\CommentController@getProductRating',
        'controller' => 'App\\Http\\Controllers\\Api\\Client\\CommentController@getProductRating',
        'as' => 'client.comment.comment.rating',
        'namespace' => NULL,
        'prefix' => 'api/client/comment',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'admins.signin' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'api/admins/signin',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Admin\\AuthController@login',
        'controller' => 'App\\Http\\Controllers\\Api\\Admin\\AuthController@login',
        'as' => 'admins.signin',
        'namespace' => NULL,
        'prefix' => 'api/admins',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'admins.products.index' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'api/admins/products',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'auth:sanctum',
          2 => 'admin',
        ),
        'as' => 'admins.products.index',
        'uses' => 'App\\Http\\Controllers\\Api\\Admin\\Product\\ProductController@index',
        'controller' => 'App\\Http\\Controllers\\Api\\Admin\\Product\\ProductController@index',
        'namespace' => NULL,
        'prefix' => 'api/admins',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'admins.products.store' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'api/admins/products',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'auth:sanctum',
          2 => 'admin',
        ),
        'as' => 'admins.products.store',
        'uses' => 'App\\Http\\Controllers\\Api\\Admin\\Product\\ProductController@store',
        'controller' => 'App\\Http\\Controllers\\Api\\Admin\\Product\\ProductController@store',
        'namespace' => NULL,
        'prefix' => 'api/admins',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'admins.products.show' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'api/admins/products/{product}',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'auth:sanctum',
          2 => 'admin',
        ),
        'as' => 'admins.products.show',
        'uses' => 'App\\Http\\Controllers\\Api\\Admin\\Product\\ProductController@show',
        'controller' => 'App\\Http\\Controllers\\Api\\Admin\\Product\\ProductController@show',
        'namespace' => NULL,
        'prefix' => 'api/admins',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'admins.products.update' => 
    array (
      'methods' => 
      array (
        0 => 'PUT',
        1 => 'PATCH',
      ),
      'uri' => 'api/admins/products/{product}',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'auth:sanctum',
          2 => 'admin',
        ),
        'as' => 'admins.products.update',
        'uses' => 'App\\Http\\Controllers\\Api\\Admin\\Product\\ProductController@update',
        'controller' => 'App\\Http\\Controllers\\Api\\Admin\\Product\\ProductController@update',
        'namespace' => NULL,
        'prefix' => 'api/admins',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'admins.products.destroy' => 
    array (
      'methods' => 
      array (
        0 => 'DELETE',
      ),
      'uri' => 'api/admins/products/{product}',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'auth:sanctum',
          2 => 'admin',
        ),
        'as' => 'admins.products.destroy',
        'uses' => 'App\\Http\\Controllers\\Api\\Admin\\Product\\ProductController@destroy',
        'controller' => 'App\\Http\\Controllers\\Api\\Admin\\Product\\ProductController@destroy',
        'namespace' => NULL,
        'prefix' => 'api/admins',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'admins.images.deleteByPath' => 
    array (
      'methods' => 
      array (
        0 => 'DELETE',
      ),
      'uri' => 'api/admins/images/{type}/{encodedPath}',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'auth:sanctum',
          2 => 'admin',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Admin\\Product\\ProductController@deleteImageByPath',
        'controller' => 'App\\Http\\Controllers\\Api\\Admin\\Product\\ProductController@deleteImageByPath',
        'as' => 'admins.images.deleteByPath',
        'namespace' => NULL,
        'prefix' => 'api/admins',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'admins.attributes.index' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'api/admins/attributes',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'auth:sanctum',
          2 => 'admin',
        ),
        'as' => 'admins.attributes.index',
        'uses' => 'App\\Http\\Controllers\\Api\\Admin\\Product\\AttributeController@index',
        'controller' => 'App\\Http\\Controllers\\Api\\Admin\\Product\\AttributeController@index',
        'namespace' => NULL,
        'prefix' => 'api/admins',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'admins.attributes.store' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'api/admins/attributes',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'auth:sanctum',
          2 => 'admin',
        ),
        'as' => 'admins.attributes.store',
        'uses' => 'App\\Http\\Controllers\\Api\\Admin\\Product\\AttributeController@store',
        'controller' => 'App\\Http\\Controllers\\Api\\Admin\\Product\\AttributeController@store',
        'namespace' => NULL,
        'prefix' => 'api/admins',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'admins.attributes.show' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'api/admins/attributes/{attribute}',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'auth:sanctum',
          2 => 'admin',
        ),
        'as' => 'admins.attributes.show',
        'uses' => 'App\\Http\\Controllers\\Api\\Admin\\Product\\AttributeController@show',
        'controller' => 'App\\Http\\Controllers\\Api\\Admin\\Product\\AttributeController@show',
        'namespace' => NULL,
        'prefix' => 'api/admins',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'admins.attributes.update' => 
    array (
      'methods' => 
      array (
        0 => 'PUT',
        1 => 'PATCH',
      ),
      'uri' => 'api/admins/attributes/{attribute}',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'auth:sanctum',
          2 => 'admin',
        ),
        'as' => 'admins.attributes.update',
        'uses' => 'App\\Http\\Controllers\\Api\\Admin\\Product\\AttributeController@update',
        'controller' => 'App\\Http\\Controllers\\Api\\Admin\\Product\\AttributeController@update',
        'namespace' => NULL,
        'prefix' => 'api/admins',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'admins.attributes.destroy' => 
    array (
      'methods' => 
      array (
        0 => 'DELETE',
      ),
      'uri' => 'api/admins/attributes/{attribute}',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'auth:sanctum',
          2 => 'admin',
        ),
        'as' => 'admins.attributes.destroy',
        'uses' => 'App\\Http\\Controllers\\Api\\Admin\\Product\\AttributeController@destroy',
        'controller' => 'App\\Http\\Controllers\\Api\\Admin\\Product\\AttributeController@destroy',
        'namespace' => NULL,
        'prefix' => 'api/admins',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'admins.attribute_groups.index' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'api/admins/attribute_groups',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'auth:sanctum',
          2 => 'admin',
        ),
        'as' => 'admins.attribute_groups.index',
        'uses' => 'App\\Http\\Controllers\\Api\\Admin\\Product\\AttributeGroupController@index',
        'controller' => 'App\\Http\\Controllers\\Api\\Admin\\Product\\AttributeGroupController@index',
        'namespace' => NULL,
        'prefix' => 'api/admins',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'admins.attribute_groups.store' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'api/admins/attribute_groups',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'auth:sanctum',
          2 => 'admin',
        ),
        'as' => 'admins.attribute_groups.store',
        'uses' => 'App\\Http\\Controllers\\Api\\Admin\\Product\\AttributeGroupController@store',
        'controller' => 'App\\Http\\Controllers\\Api\\Admin\\Product\\AttributeGroupController@store',
        'namespace' => NULL,
        'prefix' => 'api/admins',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'admins.attribute_groups.show' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'api/admins/attribute_groups/{attribute_group}',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'auth:sanctum',
          2 => 'admin',
        ),
        'as' => 'admins.attribute_groups.show',
        'uses' => 'App\\Http\\Controllers\\Api\\Admin\\Product\\AttributeGroupController@show',
        'controller' => 'App\\Http\\Controllers\\Api\\Admin\\Product\\AttributeGroupController@show',
        'namespace' => NULL,
        'prefix' => 'api/admins',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'admins.attribute_groups.update' => 
    array (
      'methods' => 
      array (
        0 => 'PUT',
        1 => 'PATCH',
      ),
      'uri' => 'api/admins/attribute_groups/{attribute_group}',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'auth:sanctum',
          2 => 'admin',
        ),
        'as' => 'admins.attribute_groups.update',
        'uses' => 'App\\Http\\Controllers\\Api\\Admin\\Product\\AttributeGroupController@update',
        'controller' => 'App\\Http\\Controllers\\Api\\Admin\\Product\\AttributeGroupController@update',
        'namespace' => NULL,
        'prefix' => 'api/admins',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'admins.attribute_groups.destroy' => 
    array (
      'methods' => 
      array (
        0 => 'DELETE',
      ),
      'uri' => 'api/admins/attribute_groups/{attribute_group}',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'auth:sanctum',
          2 => 'admin',
        ),
        'as' => 'admins.attribute_groups.destroy',
        'uses' => 'App\\Http\\Controllers\\Api\\Admin\\Product\\AttributeGroupController@destroy',
        'controller' => 'App\\Http\\Controllers\\Api\\Admin\\Product\\AttributeGroupController@destroy',
        'namespace' => NULL,
        'prefix' => 'api/admins',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'admins.' => 
    array (
      'methods' => 
      array (
        0 => 'DELETE',
      ),
      'uri' => 'api/admins/attribute_groups/{group_id}/attributes/{attribute_id}',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'auth:sanctum',
          2 => 'admin',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Admin\\Product\\AttributeGroupController@destroyAttribute',
        'controller' => 'App\\Http\\Controllers\\Api\\Admin\\Product\\AttributeGroupController@destroyAttribute',
        'as' => 'admins.',
        'namespace' => NULL,
        'prefix' => 'api/admins',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'admins.attribute_values.index' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'api/admins/attribute_values',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'auth:sanctum',
          2 => 'admin',
        ),
        'as' => 'admins.attribute_values.index',
        'uses' => 'App\\Http\\Controllers\\Api\\Admin\\Product\\AttributeValueController@index',
        'controller' => 'App\\Http\\Controllers\\Api\\Admin\\Product\\AttributeValueController@index',
        'namespace' => NULL,
        'prefix' => 'api/admins',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'admins.attribute_values.store' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'api/admins/attribute_values',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'auth:sanctum',
          2 => 'admin',
        ),
        'as' => 'admins.attribute_values.store',
        'uses' => 'App\\Http\\Controllers\\Api\\Admin\\Product\\AttributeValueController@store',
        'controller' => 'App\\Http\\Controllers\\Api\\Admin\\Product\\AttributeValueController@store',
        'namespace' => NULL,
        'prefix' => 'api/admins',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'admins.attribute_values.show' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'api/admins/attribute_values/{attribute_value}',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'auth:sanctum',
          2 => 'admin',
        ),
        'as' => 'admins.attribute_values.show',
        'uses' => 'App\\Http\\Controllers\\Api\\Admin\\Product\\AttributeValueController@show',
        'controller' => 'App\\Http\\Controllers\\Api\\Admin\\Product\\AttributeValueController@show',
        'namespace' => NULL,
        'prefix' => 'api/admins',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'admins.attribute_values.update' => 
    array (
      'methods' => 
      array (
        0 => 'PUT',
        1 => 'PATCH',
      ),
      'uri' => 'api/admins/attribute_values/{attribute_value}',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'auth:sanctum',
          2 => 'admin',
        ),
        'as' => 'admins.attribute_values.update',
        'uses' => 'App\\Http\\Controllers\\Api\\Admin\\Product\\AttributeValueController@update',
        'controller' => 'App\\Http\\Controllers\\Api\\Admin\\Product\\AttributeValueController@update',
        'namespace' => NULL,
        'prefix' => 'api/admins',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'admins.attribute_values.destroy' => 
    array (
      'methods' => 
      array (
        0 => 'DELETE',
      ),
      'uri' => 'api/admins/attribute_values/{attribute_value}',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'auth:sanctum',
          2 => 'admin',
        ),
        'as' => 'admins.attribute_values.destroy',
        'uses' => 'App\\Http\\Controllers\\Api\\Admin\\Product\\AttributeValueController@destroy',
        'controller' => 'App\\Http\\Controllers\\Api\\Admin\\Product\\AttributeValueController@destroy',
        'namespace' => NULL,
        'prefix' => 'api/admins',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'admins.categories.soft-delete' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'api/admins/categories/{id}/soft-delete',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'auth:sanctum',
          2 => 'admin',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Admin\\CategoryController@softDestroy',
        'controller' => 'App\\Http\\Controllers\\Api\\Admin\\CategoryController@softDestroy',
        'as' => 'admins.categories.soft-delete',
        'namespace' => NULL,
        'prefix' => 'api/admins/categories',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'admins.categories.restore' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'api/admins/categories/{id}/restore',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'auth:sanctum',
          2 => 'admin',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Admin\\CategoryController@restore',
        'controller' => 'App\\Http\\Controllers\\Api\\Admin\\CategoryController@restore',
        'as' => 'admins.categories.restore',
        'namespace' => NULL,
        'prefix' => 'api/admins/categories',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'admins.generated::oxuSDXXxRnlggsan' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'api/admins/categories/trash',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'auth:sanctum',
          2 => 'admin',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Admin\\CategoryController@trash',
        'controller' => 'App\\Http\\Controllers\\Api\\Admin\\CategoryController@trash',
        'as' => 'admins.generated::oxuSDXXxRnlggsan',
        'namespace' => NULL,
        'prefix' => 'api/admins/categories',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'admins.categories.index' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'api/admins/categories',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'auth:sanctum',
          2 => 'admin',
        ),
        'as' => 'admins.categories.index',
        'uses' => 'App\\Http\\Controllers\\Api\\Admin\\CategoryController@index',
        'controller' => 'App\\Http\\Controllers\\Api\\Admin\\CategoryController@index',
        'namespace' => NULL,
        'prefix' => 'api/admins',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'admins.categories.store' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'api/admins/categories',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'auth:sanctum',
          2 => 'admin',
        ),
        'as' => 'admins.categories.store',
        'uses' => 'App\\Http\\Controllers\\Api\\Admin\\CategoryController@store',
        'controller' => 'App\\Http\\Controllers\\Api\\Admin\\CategoryController@store',
        'namespace' => NULL,
        'prefix' => 'api/admins',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'admins.categories.show' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'api/admins/categories/{category}',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'auth:sanctum',
          2 => 'admin',
        ),
        'as' => 'admins.categories.show',
        'uses' => 'App\\Http\\Controllers\\Api\\Admin\\CategoryController@show',
        'controller' => 'App\\Http\\Controllers\\Api\\Admin\\CategoryController@show',
        'namespace' => NULL,
        'prefix' => 'api/admins',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'admins.categories.update' => 
    array (
      'methods' => 
      array (
        0 => 'PUT',
        1 => 'PATCH',
      ),
      'uri' => 'api/admins/categories/{category}',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'auth:sanctum',
          2 => 'admin',
        ),
        'as' => 'admins.categories.update',
        'uses' => 'App\\Http\\Controllers\\Api\\Admin\\CategoryController@update',
        'controller' => 'App\\Http\\Controllers\\Api\\Admin\\CategoryController@update',
        'namespace' => NULL,
        'prefix' => 'api/admins',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'admins.categories.destroy' => 
    array (
      'methods' => 
      array (
        0 => 'DELETE',
      ),
      'uri' => 'api/admins/categories/{category}',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'auth:sanctum',
          2 => 'admin',
        ),
        'as' => 'admins.categories.destroy',
        'uses' => 'App\\Http\\Controllers\\Api\\Admin\\CategoryController@destroy',
        'controller' => 'App\\Http\\Controllers\\Api\\Admin\\CategoryController@destroy',
        'namespace' => NULL,
        'prefix' => 'api/admins',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'admins.generated::UTaRfv8e3mOjCUrX' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'api/admins/users',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'auth:sanctum',
          2 => 'admin',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Admin\\UserController@index',
        'controller' => 'App\\Http\\Controllers\\Api\\Admin\\UserController@index',
        'as' => 'admins.generated::UTaRfv8e3mOjCUrX',
        'namespace' => NULL,
        'prefix' => 'api/admins/users',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'admins.generated::NOSXdVrIIzS8LACN' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'api/admins/users',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'auth:sanctum',
          2 => 'admin',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Admin\\UserController@store',
        'controller' => 'App\\Http\\Controllers\\Api\\Admin\\UserController@store',
        'as' => 'admins.generated::NOSXdVrIIzS8LACN',
        'namespace' => NULL,
        'prefix' => 'api/admins/users',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'admins.generated::uM5KTIkPJOKXSpJk' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'api/admins/users/{id}',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'auth:sanctum',
          2 => 'admin',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Admin\\UserController@show',
        'controller' => 'App\\Http\\Controllers\\Api\\Admin\\UserController@show',
        'as' => 'admins.generated::uM5KTIkPJOKXSpJk',
        'namespace' => NULL,
        'prefix' => 'api/admins/users',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'admins.generated::8Cz7H7nBmxAucBmW' => 
    array (
      'methods' => 
      array (
        0 => 'PUT',
      ),
      'uri' => 'api/admins/users/{id}',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'auth:sanctum',
          2 => 'admin',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Admin\\UserController@update',
        'controller' => 'App\\Http\\Controllers\\Api\\Admin\\UserController@update',
        'as' => 'admins.generated::8Cz7H7nBmxAucBmW',
        'namespace' => NULL,
        'prefix' => 'api/admins/users',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'admins.users.index' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'api/admins/users/users',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'auth:sanctum',
          2 => 'admin',
        ),
        'as' => 'admins.users.index',
        'uses' => 'App\\Http\\Controllers\\Api\\Admin\\UserController@index',
        'controller' => 'App\\Http\\Controllers\\Api\\Admin\\UserController@index',
        'namespace' => NULL,
        'prefix' => 'api/admins/users',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'admins.users.store' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'api/admins/users/users',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'auth:sanctum',
          2 => 'admin',
        ),
        'as' => 'admins.users.store',
        'uses' => 'App\\Http\\Controllers\\Api\\Admin\\UserController@store',
        'controller' => 'App\\Http\\Controllers\\Api\\Admin\\UserController@store',
        'namespace' => NULL,
        'prefix' => 'api/admins/users',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'admins.users.show' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'api/admins/users/users/{user}',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'auth:sanctum',
          2 => 'admin',
        ),
        'as' => 'admins.users.show',
        'uses' => 'App\\Http\\Controllers\\Api\\Admin\\UserController@show',
        'controller' => 'App\\Http\\Controllers\\Api\\Admin\\UserController@show',
        'namespace' => NULL,
        'prefix' => 'api/admins/users',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'admins.users.update' => 
    array (
      'methods' => 
      array (
        0 => 'PUT',
        1 => 'PATCH',
      ),
      'uri' => 'api/admins/users/users/{user}',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'auth:sanctum',
          2 => 'admin',
        ),
        'as' => 'admins.users.update',
        'uses' => 'App\\Http\\Controllers\\Api\\Admin\\UserController@update',
        'controller' => 'App\\Http\\Controllers\\Api\\Admin\\UserController@update',
        'namespace' => NULL,
        'prefix' => 'api/admins/users',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'admins.users.destroy' => 
    array (
      'methods' => 
      array (
        0 => 'DELETE',
      ),
      'uri' => 'api/admins/users/users/{user}',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'auth:sanctum',
          2 => 'admin',
        ),
        'as' => 'admins.users.destroy',
        'uses' => 'App\\Http\\Controllers\\Api\\Admin\\UserController@destroy',
        'controller' => 'App\\Http\\Controllers\\Api\\Admin\\UserController@destroy',
        'namespace' => NULL,
        'prefix' => 'api/admins/users',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'admins.generated::IgKZ82AA3Qz52zfV' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'api/admins/users/{id}/block',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'auth:sanctum',
          2 => 'admin',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Admin\\UserController@blockUser',
        'controller' => 'App\\Http\\Controllers\\Api\\Admin\\UserController@blockUser',
        'as' => 'admins.generated::IgKZ82AA3Qz52zfV',
        'namespace' => NULL,
        'prefix' => 'api/admins/users',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'admins.generated::pRTExIhSxJFiKInn' => 
    array (
      'methods' => 
      array (
        0 => 'PUT',
      ),
      'uri' => 'api/admins/users/{id}/unblock',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'auth:sanctum',
          2 => 'admin',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Admin\\UserController@unblockUser',
        'controller' => 'App\\Http\\Controllers\\Api\\Admin\\UserController@unblockUser',
        'as' => 'admins.generated::pRTExIhSxJFiKInn',
        'namespace' => NULL,
        'prefix' => 'api/admins/users',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'admins.promotions.new-users' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'api/admins/promotions/new-users',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'auth:sanctum',
          2 => 'admin',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Admin\\PromotionsController@getNewUserPromotions',
        'controller' => 'App\\Http\\Controllers\\Api\\Admin\\PromotionsController@getNewUserPromotions',
        'as' => 'admins.promotions.new-users',
        'namespace' => NULL,
        'prefix' => 'api/admins/promotions',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'admins.promotions.index' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'api/admins/promotions',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'auth:sanctum',
          2 => 'admin',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Admin\\PromotionsController@index',
        'controller' => 'App\\Http\\Controllers\\Api\\Admin\\PromotionsController@index',
        'as' => 'admins.promotions.index',
        'namespace' => NULL,
        'prefix' => 'api/admins/promotions',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'admins.promotions.store' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'api/admins/promotions',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'auth:sanctum',
          2 => 'admin',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Admin\\PromotionsController@store',
        'controller' => 'App\\Http\\Controllers\\Api\\Admin\\PromotionsController@store',
        'as' => 'admins.promotions.store',
        'namespace' => NULL,
        'prefix' => 'api/admins/promotions',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'admins.promotions.show' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'api/admins/promotions/{id}',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'auth:sanctum',
          2 => 'admin',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Admin\\PromotionsController@show',
        'controller' => 'App\\Http\\Controllers\\Api\\Admin\\PromotionsController@show',
        'as' => 'admins.promotions.show',
        'namespace' => NULL,
        'prefix' => 'api/admins/promotions',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'admins.promotions.update' => 
    array (
      'methods' => 
      array (
        0 => 'PUT',
      ),
      'uri' => 'api/admins/promotions/{id}',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'auth:sanctum',
          2 => 'admin',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Admin\\PromotionsController@update',
        'controller' => 'App\\Http\\Controllers\\Api\\Admin\\PromotionsController@update',
        'as' => 'admins.promotions.update',
        'namespace' => NULL,
        'prefix' => 'api/admins/promotions',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'admins.promotions.destroy' => 
    array (
      'methods' => 
      array (
        0 => 'DELETE',
      ),
      'uri' => 'api/admins/promotions/{id}',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'auth:sanctum',
          2 => 'admin',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Admin\\PromotionsController@destroy',
        'controller' => 'App\\Http\\Controllers\\Api\\Admin\\PromotionsController@destroy',
        'as' => 'admins.promotions.destroy',
        'namespace' => NULL,
        'prefix' => 'api/admins/promotions',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'admins.promotions.user-product' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'api/admins/promotions/user/{userId}/product/{productId}',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'auth:sanctum',
          2 => 'admin',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Admin\\PromotionsController@getUserProductPromotions',
        'controller' => 'App\\Http\\Controllers\\Api\\Admin\\PromotionsController@getUserProductPromotions',
        'as' => 'admins.promotions.user-product',
        'namespace' => NULL,
        'prefix' => 'api/admins/promotions',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'admins.promotions.event' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'api/admins/promotions/event/{eventName}',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'auth:sanctum',
          2 => 'admin',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Admin\\PromotionsController@getEventPromotions',
        'controller' => 'App\\Http\\Controllers\\Api\\Admin\\PromotionsController@getEventPromotions',
        'as' => 'admins.promotions.event',
        'namespace' => NULL,
        'prefix' => 'api/admins/promotions',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'admins.products.by-ids' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'api/admins/promotions/products/by-ids',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'auth:sanctum',
          2 => 'admin',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Admin\\Product\\ProductController@getProductsByIds',
        'controller' => 'App\\Http\\Controllers\\Api\\Admin\\Product\\ProductController@getProductsByIds',
        'as' => 'admins.products.by-ids',
        'namespace' => NULL,
        'prefix' => 'api/admins/promotions',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'admins.orders.index' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'api/admins/orders',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'auth:sanctum',
          2 => 'admin',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Admin\\Product\\OrderController@index',
        'controller' => 'App\\Http\\Controllers\\Api\\Admin\\Product\\OrderController@index',
        'as' => 'admins.orders.index',
        'namespace' => NULL,
        'prefix' => 'api/admins/orders',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'admins.orders.pending' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'api/admins/orders/pending',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'auth:sanctum',
          2 => 'admin',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Admin\\Product\\OrderController@pendingOrders',
        'controller' => 'App\\Http\\Controllers\\Api\\Admin\\Product\\OrderController@pendingOrders',
        'as' => 'admins.orders.pending',
        'namespace' => NULL,
        'prefix' => 'api/admins/orders',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'admins.orders.processed' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'api/admins/orders/processed',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'auth:sanctum',
          2 => 'admin',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Admin\\Product\\OrderController@processedOrders',
        'controller' => 'App\\Http\\Controllers\\Api\\Admin\\Product\\OrderController@processedOrders',
        'as' => 'admins.orders.processed',
        'namespace' => NULL,
        'prefix' => 'api/admins/orders',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'admins.orders.shipped' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'api/admins/orders/shipped',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'auth:sanctum',
          2 => 'admin',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Admin\\Product\\OrderController@shippedOrders',
        'controller' => 'App\\Http\\Controllers\\Api\\Admin\\Product\\OrderController@shippedOrders',
        'as' => 'admins.orders.shipped',
        'namespace' => NULL,
        'prefix' => 'api/admins/orders',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'admins.orders.delivered' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'api/admins/orders/delivered',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'auth:sanctum',
          2 => 'admin',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Admin\\Product\\OrderController@deliveredOrders',
        'controller' => 'App\\Http\\Controllers\\Api\\Admin\\Product\\OrderController@deliveredOrders',
        'as' => 'admins.orders.delivered',
        'namespace' => NULL,
        'prefix' => 'api/admins/orders',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'admins.orders.canceled' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'api/admins/orders/canceled',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'auth:sanctum',
          2 => 'admin',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Admin\\Product\\OrderController@canceledOrders',
        'controller' => 'App\\Http\\Controllers\\Api\\Admin\\Product\\OrderController@canceledOrders',
        'as' => 'admins.orders.canceled',
        'namespace' => NULL,
        'prefix' => 'api/admins/orders',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'admins.orders.searchorder' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'api/admins/orders/search_order',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'auth:sanctum',
          2 => 'admin',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Admin\\Product\\OrderController@searchOrder',
        'controller' => 'App\\Http\\Controllers\\Api\\Admin\\Product\\OrderController@searchOrder',
        'as' => 'admins.orders.searchorder',
        'namespace' => NULL,
        'prefix' => 'api/admins/orders',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'admins.orders.searchpending' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'api/admins/orders/search-pending',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'auth:sanctum',
          2 => 'admin',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Admin\\Product\\OrderController@searchPendingOrder',
        'controller' => 'App\\Http\\Controllers\\Api\\Admin\\Product\\OrderController@searchPendingOrder',
        'as' => 'admins.orders.searchpending',
        'namespace' => NULL,
        'prefix' => 'api/admins/orders',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'admins.orders.searchprocessed' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'api/admins/orders/search-processed',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'auth:sanctum',
          2 => 'admin',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Admin\\Product\\OrderController@searchProcessedOrder',
        'controller' => 'App\\Http\\Controllers\\Api\\Admin\\Product\\OrderController@searchProcessedOrder',
        'as' => 'admins.orders.searchprocessed',
        'namespace' => NULL,
        'prefix' => 'api/admins/orders',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'admins.orders.searchshipped' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'api/admins/orders/search-shipped',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'auth:sanctum',
          2 => 'admin',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Admin\\Product\\OrderController@searchShippedOrder',
        'controller' => 'App\\Http\\Controllers\\Api\\Admin\\Product\\OrderController@searchShippedOrder',
        'as' => 'admins.orders.searchshipped',
        'namespace' => NULL,
        'prefix' => 'api/admins/orders',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'admins.orders.searchdelivered' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'api/admins/orders/search-delivered',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'auth:sanctum',
          2 => 'admin',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Admin\\Product\\OrderController@searchDeliveredOrder',
        'controller' => 'App\\Http\\Controllers\\Api\\Admin\\Product\\OrderController@searchDeliveredOrder',
        'as' => 'admins.orders.searchdelivered',
        'namespace' => NULL,
        'prefix' => 'api/admins/orders',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'admins.orders.searchcanceled' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'api/admins/orders/search-canceled',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'auth:sanctum',
          2 => 'admin',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Admin\\Product\\OrderController@searchCanceledOrder',
        'controller' => 'App\\Http\\Controllers\\Api\\Admin\\Product\\OrderController@searchCanceledOrder',
        'as' => 'admins.orders.searchcanceled',
        'namespace' => NULL,
        'prefix' => 'api/admins/orders',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'admins.orders.showdetailorder' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'api/admins/orders/show_detailorder/{id}',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'auth:sanctum',
          2 => 'admin',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Admin\\Product\\OrderController@showDetailOrder',
        'controller' => 'App\\Http\\Controllers\\Api\\Admin\\Product\\OrderController@showDetailOrder',
        'as' => 'admins.orders.showdetailorder',
        'namespace' => NULL,
        'prefix' => 'api/admins/orders',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'admins.orders.updateorder' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'api/admins/orders/update_order/{id}',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'auth:sanctum',
          2 => 'admin',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Admin\\Product\\OrderController@updateOrderStatus',
        'controller' => 'App\\Http\\Controllers\\Api\\Admin\\Product\\OrderController@updateOrderStatus',
        'as' => 'admins.orders.updateorder',
        'namespace' => NULL,
        'prefix' => 'api/admins/orders',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'admins.orders.createGHNOrder' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'api/admins/orders/ghn-create/{billId}',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'auth:sanctum',
          2 => 'admin',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Admin\\Product\\ShippingController@createGHNOrderFromBill',
        'controller' => 'App\\Http\\Controllers\\Api\\Admin\\Product\\ShippingController@createGHNOrderFromBill',
        'as' => 'admins.orders.createGHNOrder',
        'namespace' => NULL,
        'prefix' => 'api/admins/orders',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'admins.orders.getGHNOrderDetail' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'api/admins/orders/ghn-detail/{billId}',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'auth:sanctum',
          2 => 'admin',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Admin\\Product\\ShippingController@getGHNOrderDetail',
        'controller' => 'App\\Http\\Controllers\\Api\\Admin\\Product\\ShippingController@getGHNOrderDetail',
        'as' => 'admins.orders.getGHNOrderDetail',
        'namespace' => NULL,
        'prefix' => 'api/admins/orders',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'admins.orders.cancelGHNOrder' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'api/admins/orders/ghn-cancel/{billId}',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'auth:sanctum',
          2 => 'admin',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Admin\\Product\\ShippingController@cancelGHNOrder',
        'controller' => 'App\\Http\\Controllers\\Api\\Admin\\Product\\ShippingController@cancelGHNOrder',
        'as' => 'admins.orders.cancelGHNOrder',
        'namespace' => NULL,
        'prefix' => 'api/admins/orders',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'admins.orders.updateGHNOrder' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'api/admins/orders/ghn-update/{billId}',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'auth:sanctum',
          2 => 'admin',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Admin\\Product\\ShippingController@updateGHNOrder',
        'controller' => 'App\\Http\\Controllers\\Api\\Admin\\Product\\ShippingController@updateGHNOrder',
        'as' => 'admins.orders.updateGHNOrder',
        'namespace' => NULL,
        'prefix' => 'api/admins/orders',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'admins.comment.comment.list' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => 'api/admins/comment/list',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'auth:sanctum',
          2 => 'admin',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Client\\CommentController@index',
        'controller' => 'App\\Http\\Controllers\\Api\\Client\\CommentController@index',
        'as' => 'admins.comment.comment.list',
        'namespace' => NULL,
        'prefix' => 'api/admins/comment',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'admins.comment.comment.approve' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'api/admins/comment/approve',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'auth:sanctum',
          2 => 'admin',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Client\\CommentController@approve',
        'controller' => 'App\\Http\\Controllers\\Api\\Client\\CommentController@approve',
        'as' => 'admins.comment.comment.approve',
        'namespace' => NULL,
        'prefix' => 'api/admins/comment',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'admins.comment.comment.reply' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'api/admins/comment/reply',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'auth:sanctum',
          2 => 'admin',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Client\\CommentController@reply',
        'controller' => 'App\\Http\\Controllers\\Api\\Client\\CommentController@reply',
        'as' => 'admins.comment.comment.reply',
        'namespace' => NULL,
        'prefix' => 'api/admins/comment',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'admins.comment.comment.hide' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'api/admins/comment/hide',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'auth:sanctum',
          2 => 'admin',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Client\\CommentController@hideComment',
        'controller' => 'App\\Http\\Controllers\\Api\\Client\\CommentController@hideComment',
        'as' => 'admins.comment.comment.hide',
        'namespace' => NULL,
        'prefix' => 'api/admins/comment',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'admins.comment.comment.report' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'api/admins/comment/report',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'auth:sanctum',
          2 => 'admin',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Client\\CommentController@report',
        'controller' => 'App\\Http\\Controllers\\Api\\Client\\CommentController@report',
        'as' => 'admins.comment.comment.report',
        'namespace' => NULL,
        'prefix' => 'api/admins/comment',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'admins.comment.comment.manageUser' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'api/admins/comment/manageUser',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'auth:sanctum',
          2 => 'admin',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Client\\CommentController@manageUser',
        'controller' => 'App\\Http\\Controllers\\Api\\Client\\CommentController@manageUser',
        'as' => 'admins.comment.comment.manageUser',
        'namespace' => NULL,
        'prefix' => 'api/admins/comment',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'admins.inventory.obsolete' => 
    array (
      'methods' => 
      array (
        0 => 'POST',
      ),
      'uri' => 'api/admins/inventory',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'api',
          1 => 'auth:sanctum',
          2 => 'admin',
        ),
        'uses' => 'App\\Http\\Controllers\\Api\\Admin\\InventoryController@getObsoleteProducts',
        'controller' => 'App\\Http\\Controllers\\Api\\Admin\\InventoryController@getObsoleteProducts',
        'as' => 'admins.inventory.obsolete',
        'namespace' => NULL,
        'prefix' => 'api/admins/inventory',
        'where' => 
        array (
        ),
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
    'generated::UMr308sq4wBnoQbb' => 
    array (
      'methods' => 
      array (
        0 => 'GET',
        1 => 'HEAD',
      ),
      'uri' => '/',
      'action' => 
      array (
        'middleware' => 
        array (
          0 => 'web',
        ),
        'uses' => 'O:55:"Laravel\\SerializableClosure\\UnsignedSerializableClosure":1:{s:12:"serializable";O:46:"Laravel\\SerializableClosure\\Serializers\\Native":5:{s:3:"use";a:0:{}s:8:"function";s:44:"function () {
    return \\view(\'welcome\');
}";s:5:"scope";s:37:"Illuminate\\Routing\\RouteFileRegistrar";s:4:"this";N;s:4:"self";s:32:"00000000000007e90000000000000000";}}',
        'namespace' => NULL,
        'prefix' => '',
        'where' => 
        array (
        ),
        'as' => 'generated::UMr308sq4wBnoQbb',
      ),
      'fallback' => false,
      'defaults' => 
      array (
      ),
      'wheres' => 
      array (
      ),
      'bindingFields' => 
      array (
      ),
      'lockSeconds' => NULL,
      'waitSeconds' => NULL,
      'withTrashed' => false,
    ),
  ),
)
);
