<?php

namespace Insights\Model;

use Insights\Database\Query;

class Room {

    private $id;
    private $table = 'rooms';

    public function __construct($id = null)
    {
        $this->id = $id;

        $db = new Query();
        $db->initialize();
    }

    public function getById($id)
    {
        $room = Query::table($this->table)
            ->where('roomId', '=', $id)
            ->get();
        return $room[0];
    }

    public function getByNr($id)
    {
        $room = Query::table($this->table)
            ->where('roomNrHumanShort', '=', $id)
            ->get();
        return $room;
    }

    public function searchByKey($key)
    {
        $room = Query::table($this->table)
            ->where('roomNrHumanShort', 'LIKE', '%' . $key . '%')
            ->orderBy('roomNrHumanShort', 'ASC')
            ->get();
        return $room;
    }

    public function getFiles()
    {
        $files = Query::table('files')
            ->where('roomId', '=', $this->id)
            ->orderBy('filePostedOn', 'DESC')
            ->get();
    }
}
