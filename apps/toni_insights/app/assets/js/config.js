module.exports = {
  uploadTypes: [
      {
        'id': 1,
        'name': 'Text',
        'type': 'text',
        'view': 'UploadText',
        'buttonText': 'Text posten',
        'iconId': 'icon-speech-bubble'
      },
      {
        'id': 2,
        'name': 'Bild',
        'type': 'picture',
        'view': 'UploadPicture',
        'buttonText': 'Bild posten',
        'iconId': 'icon-camera'
      },
      {
        'id': 3,
        'name': 'Video',
        'type': 'video',
        'view': 'UploadVideo',
        'buttonText': 'Video posten',
        'iconId': 'icon-video'
      },
      {
        'id': 4,
        'name': 'Sound',
        'type': 'sound',
        'view': 'UploadSound',
        'buttonText': 'Sound posten',
        'iconId': 'icon-microphone'
      }/*,
      {
        'id': 5,
        'name': 'Farbe',
        'type': 'color',
        'view': 'UploadColor',
        'buttonText': 'Farbe posten'
      }*/
  ]
};
