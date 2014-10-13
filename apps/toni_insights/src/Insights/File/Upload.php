<?php

namespace Insights\File;

use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\Filesystem\Exception\IOException;

class Upload {

    private $file;
    private $name;
    private $uniqueName;
    private $extension;

    private $roomId;

    private $uploadFolder = 'uploads/';

    private $allowedMimeTypes = array(
        'image/jpeg',
        'image/gif',
        'image/png',
        'audio/mpeg3',
        'video/mpeg'
    );

    public function __construct(UploadedFile $file)
    {
        $this->file = $file;
        $this->extension = $file->getClientOriginalExtension();
        $this->name = $file->getClientOriginalName();
        $this->uniqueName = $this->generateUniqueFileName() . '.' . $this->extension;
    }

    public function saveFile() {
        if ($this->file->isValid()) {
            return $this->moveUploadedFile();
        }
        return false;
    }

    private function moveUploadedFile()
    {
        $fs = new Filesystem();
        try {
            if ($fs->exists(FILE_UPLOADS_FOLDER)) {
                if (!$fs->exists(FILE_UPLOADS_FOLDER . $this->uniqueName)) {
                    $this->file->move(FILE_UPLOADS_FOLDER, $this->uniqueName);
                }
                else {
                    throw new IOException("File \"$this->uniqueName\" already exists.");
                }
            }
            else {
                throw new IOException("Upload folder does not exist.");
            }
        } catch (FileException $e) {
            echo "The file could not be moved: " . $e->getMessage();
        }

        return $this->returnFileData();
    }

    public function returnFileData() {
        return array(
            'fileName' => $this->uniqueName,
            'fileNameOriginal' => $this->name,
            'fileUrl' => $this->uploadFolder,
            'fileMime' => $this->file->getClientMimeType(),
            'fileType' => $this->file->getClientOriginalExtension(),
            'fileSize' => $this->file->getClientSize(),
        );
    }

    public function generateUniqueFileName()
    {
        return uniqid();
    }
}
