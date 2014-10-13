<?php

namespace Insights\Database;

use Illuminate\Database\Capsule\Manager as Capsule;

class Query extends Capsule {

    public function initialize()
    {
        $this->addConnection([
            'driver'    => 'mysql',
            'host'      => 'localhost',
            'database'  => 'insights',
            'username'  => 'root',
            'password'  => 'root',
            'charset'   => 'utf8',
            'collation' => 'utf8_unicode_ci',
            'prefix'    => '',
        ]);
        $this->setAsGlobal();
    }
}
