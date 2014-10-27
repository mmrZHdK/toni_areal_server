<?php

namespace Insights\File;

use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\Filesystem\Exception\IOException;
use Imagine\Image\Box;
use Imagine\Image\Point;

class Upload {

    private $file;
    private $name;
    private $uniqueName;
    private $filePath;
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
        $this->uniqueNameRaw = $this->generateUniqueFileName();
        $this->uniqueName = $this->uniqueNameRaw . '.' . $this->extension;
        $this->filePath = null;
    }

    public function saveFile()
    {
        if ($this->file->isValid()) {

            $fileData = $this->moveUploadedFile();

            if (is_array($fileData) && $this->saveScaledCopy(512)) {
                return $fileData;
            }
            else {
                return false;
            }
        }
        return false;
    }

    private function saveScaledCopy($maxWidth = 512)
    {
        $imagine = new \Imagine\Gd\Imagine();
        $image = $imagine->open($this->filePath);

        $size = $image->getSize();
        $width = $size->getWidth();
        $height = $size->getHeight();

        $newWidth = $maxWidth;
        $newHeight = $newWidth / ($width/$height);

        $image
            ->resize(new Box($newWidth, $newHeight))
            ->save(FILE_UPLOADS_FOLDER . $this->uniqueNameRaw . '_' . $maxWidth . '.' . $this->extension);

        return true;
    }

    private function moveUploadedFile()
    {
        $fs = new Filesystem();
        try {
            if ($fs->exists(FILE_UPLOADS_FOLDER)) {
                if (!$fs->exists(FILE_UPLOADS_FOLDER . $this->uniqueName)) {
                    $this->filePath = FILE_UPLOADS_FOLDER . $this->uniqueName;
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

    public function returnFileData()
    {
        return array(
            'fileName' => $this->uniqueNameRaw,
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
