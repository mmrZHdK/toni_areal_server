<?php

class Config {

    private static $config = array(
        'database' => array(
            'driver'    => 'mysql',
            'host'      => '',
            'database'  => '',
            'username'  => '',
            'password'  => '',
            'charset'   => 'utf8',
            'collation' => 'utf8_unicode_ci',
            'prefix'    => ''
        )
    );

    public static function getConfig()
    {
        return self::$config;
    }
}
