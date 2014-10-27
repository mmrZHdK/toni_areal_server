<?php

namespace Insights\Database;

use Illuminate\Database\Capsule\Manager as Capsule;

require BASE_DIR . 'config.php';

class Query extends Capsule {

    public function initialize()
    {
        $config = \Config::getConfig();

        $this->addConnection([
            'driver'    => $config['database']['driver'],
            'host'      => $config['database']['host'],
            'database'  => $config['database']['database'],
            'username'  => $config['database']['username'],
            'password'  => $config['database']['password'],
            'charset'   => $config['database']['charset'],
            'collation' => $config['database']['collation'],
            'prefix'    => $config['database']['prefix']
        ]);
        $this->setAsGlobal();
    }
}
