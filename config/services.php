<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'key' => env('POSTMARK_API_KEY'),
    ],

    'resend' => [
        'key' => env('RESEND_API_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    'youtube' => [
        'key' => env('GOOGLE_API_KEY'),
    ],

    'gemini' => [
        'key' => env('GOOGLE_API_KEY'),
    ],

    'minimax' => [
        'key' => env('MINIMAX_API_KEY'),
        'model' => env('MINIMAX_MODEL', 'MiniMax-M2.1'),
    ],

    'kie' => [
        'key' => env('KIE_API_KEY'),
    ],

    'newebpay' => [
        'merchant_id' => env('NEWEBPAY_MERCHANT_ID'),
        'hash_key' => env('NEWEBPAY_HASH_KEY'),
        'hash_iv' => env('NEWEBPAY_HASH_IV'),
        'is_production' => env('NEWEBPAY_IS_PRODUCTION', false),
    ],

    'giveme' => [
        'merchant_id' => env('GIVEME_MERCHANT_ID'),
        'api_key' => env('GIVEME_API_KEY'),
    ],

    'google' => [
        'client_id' => env('GOOGLE_CLIENT_ID'),
        'client_secret' => env('GOOGLE_CLIENT_SECRET'),
        'redirect' => env('GOOGLE_REDIRECT_URI'),
    ],

];
