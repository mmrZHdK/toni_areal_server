<?php

namespace Insights\Model;

use Insights\Database\Query;

class Text {

    private $table = 'texts';

    public function __construct()
    {
        $db = new Query();
        $db->initialize();
    }

    public function insert($textParams = array())
    {
        $textId = Query::table($this->table)->insertGetId($textParams);
        return $textId;
    }
}
