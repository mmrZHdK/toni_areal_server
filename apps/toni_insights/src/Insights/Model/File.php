<?php

namespace Insights\Model;

use Insights\Database\Query;

class File {

    private $table = 'files';

    public function __construct()
    {
        $db = new Query();
        $db->initialize();
    }

    public function insert($fileParams = array())
    {
        $fileId = Query::table($this->table)->insertGetId($fileParams);
        return $fileId;
    }
}
