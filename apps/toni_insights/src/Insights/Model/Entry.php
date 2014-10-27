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
            ->leftJoin('files', 'entries.entryRefId', '=', 'files.fileId')
            ->leftJoin('texts', 'entries.entryRefId', '=', 'texts.textId')
            ->where('entries.entryRoomId', '=', $roomId)
            ->orderBy('entries.entryPostedOn', 'DESC')
            ->get();

        return $entries;
        //print_r($entries);
    }

    public function getRoomIdsByName($query = null)
    {
        $ids = Query::table('rooms')
            ->whereIn('roomNrHumanShort', $query)
            ->lists('roomId');

        return $ids;
    }

    public function getStream($query = null)
    {
        $ids = $this->getRoomIdsByName($query);

        $stream = Query::table($this->table)
            ->leftJoin('files', 'entries.entryRefId', '=', 'files.fileId')
            ->leftJoin('texts', 'entries.entryRefId', '=', 'texts.textId')
            ->whereIn('entryRoomId', $ids)
            ->get();

        return $stream;
    }

    public function insert($entryParams = array())
    {
        $entryId = Query::table($this->table)->insertGetId($entryParams);
        return $entryId;
    }
}
