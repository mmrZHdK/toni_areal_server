<?php

namespace Insights\Entry;

use Insights\Model;
use Insights\File;
use Symfony\Component\HttpFoundation\Request;

class PictureEntry implements EntryInterface {

    private $roomId;
    private $contentType;
    private $data;

    public function __construct(Request $request, $contentType = 'picture', $roomId)
    {
        if (null !== $request->get('roomId') && count($request->files->all()) > 0) {

            $this->roomId = $roomId;
            $this->contentType = $contentType;

            $this->uploadedFile = $request->files->get('file');
        }
    }

    public function upload() {
        $file = new File\Upload($this->uploadedFile);
        $this->data = $file->saveFile();

        if (is_array($this->data)) {
            return true;
        }
        return false;
    }

    public function post()
    {
        $fileModel = new Model\File();
        $entryModel = new Model\Entry();

        $fileId = $fileModel->insert($this->data);

        $entryId = $entryModel->insert(array(
            'entryRoomId' => $this->roomId,
            'entryType' => $this->contentType,
            'entryRefId' => $fileId,
            'entryPostedOn' => date('Y-m-d H:m:s', strtotime('now')),
            'entryActive' => 1
        ));

        return $entryId;
    }
}
