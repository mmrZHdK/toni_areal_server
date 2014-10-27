<?php

namespace Insights\Api;

use Insights\Model;
use Insights\File\Upload;
use Insights\Entry;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class ApiController {

    private $request;
    private $result = null;

    public function searchAction(Request $request, $query = null)
    {
        if (null !== $request->get('query')) {
            $search_key = $request->get('query');

            $room = new Model\Room();
            $this->result = $room->searchByKey($search_key);
        }

        return $this->sendResult();
    }

    public function searchIndex(Request $request, $query = null)
    {
        return $this->searchAction($request, $query);
    }

    public function roomAction(Request $request, $id = null)
    {
        if (null !== $request->get('id')) {
            $id = $request->get('id');

            $room = new Model\Room();
            $this->result = $room->getById($id);
        }

        return $this->sendResult();
    }

    public function entriesAction(Request $request, $id = null)
    {
        if (null !== $request->get('id')) {
            $id = $request->get('id');

            $entries = new Model\Entry();
            $this->result = $entries->getEntries($id);
        }

        return $this->sendResult();
    }

    public function postAction(Request $request, $action = null)
    {
        $this->result = array(
            'result' => 'error',
            'message' => 'Es ist ein Fehler aufgetreten'
        );

        /**
         * Sort out post type
         */
        if (null !== $request->get('contentType')) {

            $contentType = $request->get('contentType');

            if (null !== $request->get('roomId')) {

                $roomId = $request->get('roomId');

                switch ($contentType) {
                    case 'text':
                        $entry = new Entry\TextEntry($request, $contentType, $roomId);
                        $this->result = $entry->post();
                        break;
                    case 'picture':
                        $picture = new Entry\PictureEntry($request, $contentType, $roomId);

                        /**
                         * post picture into database only if pictury was successfully uploaded
                         */
                        if ($picture->upload()) {
                            $this->result = $picture->post();
                        }
                        break;
                    case 'video':
                        $video = new Entry\VideoEntry($request, $contentType, $roomId);
                        $this->result = $video->post();
                        break;
                    case 'sound':
                        $sound = new Entry\SoundEntry($request, $contentType, $roomId);
                        $this->result = $sound->post();
                        break;
                    case 'color':
                        $color = new Entry\ColorEntry($request, $contentType, $roomId);
                        $this->result = $color->post();
                }
            }
        }

        return $this->sendResult();
    }

    public function streamAction(Request $request, $query = null) {
        if (null !== $request->get('query')) {
            $query = $request->get('query');

            $entries = new Model\Entry();
            $this->result = $entries->getStream($query);
        }

        return $this->sendResult();
    }

    private function handleRequest()
    {
        if (isset($this->request->query) && count($this->request->query) > 0) {
            switch ($this->request->query->get('source')) {
                case 'room':
                    $this->handleRoomRequest();
                    break;
                case 'file':
                    $this->handleFileRequest();
                    break;
            }
        }
        /**
         * Check if we have a POST request
         */
        else if (isset($this->request->request) && count($this->request->request) > 0) {
            switch ($this->request->request->get('source')) {
                case 'file':
                    $this->handleFileUpload();
            }
        }
    }

    private function handleFileRequest()
    {
        //switch $this->request->query->get('')
    }

    private function handleFileUpload()
    {

    }

    /**
     * Send result as a JSON response
     */
    private function sendResult()
    {
        $response = new Response();
        $response->setContent(json_encode($this->result));

        /**
         * TODO: make this secure!
         */
        $response->headers->set('Access-Control-Allow-Headers', 'origin, content-type, accept');
        $response->headers->set('Access-Control-Allow-Origin', '*');
        $response->headers->set('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE OPTIONS');

        $response->headers->set('Content-Type', 'application/json');

        return $response;
    }
}
