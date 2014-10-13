<?php

namespace Insights\Model;

use Insights\Database\Query;

class Entry {

    private $table = 'entries';

    public function __construct()
    {
        $db = new Query();
        $db->initialize();
    }

    public function getEntries($roomId = null)
    {
        $entries = Query::table($this->table)
            ->leftJoin('files', 'entries.entryRefId', '=', 'files.id')
            ->leftJoin('texts', 'entries.entryRefId', '=', 'texts.id')
            ->where('entries.entryRoomId', '=', $roomId)
            ->get();

        return $entries;
        //print_r($entries);
    }

    public function insert($entryParams = array())
    {
        $entryId = Query::table($this->table)->insertGetId($entryParams);
        return $entryId;
    }
}
