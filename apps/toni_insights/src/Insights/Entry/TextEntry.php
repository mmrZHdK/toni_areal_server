<?php

namespace Insights\Entry;

use Insights\Model;
use Symfony\Component\HttpFoundation\Request;

class TextEntry implements EntryInterface {

    private $roomId;
    private $contentType;
    private $data;

    public function __construct(Request $request, $contentType = 'text', $roomId)
    {
        if (null !== $request->get('textContent')) {
            $this->roomId = $roomId;
            $this->contentType = $contentType;
            $this->data = array(
                'textContent' => $request->get('textContent'),
                'textTeaser' => $request->get('textTeaser'),
                'textColor' => $request->get('textColor'),
                'textBackground' => $request->get('textBackground')
            );
        }
    }

    public function post()
    {
        $textModel = new Model\Text();
        $entryModel = new Model\Entry();

        $textId = $textModel->insert($this->data);

        $entryId = $entryModel->insert(array(
            'entryRoomId' => $this->roomId,
            'entryType' => $this->contentType,
            'entryRefId' => $textId,
            'entryPostedOn' => date('Y-m-d H:m:s', strtotime('now')),
            'entryActive' => 1
        ));

        return $entryId;
    }
}
