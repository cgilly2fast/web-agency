export const imageFilterOption = {
  mimeType: {
    in: [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/svg+xml',
      'image/bmp',
      'image/tiff',
      'image/x-icon',
      'image/avif',
    ],
  },
}

export const videoFilterOption = {
  mimeType: {
    in: ['video/mp4', 'video/webm', 'video/ogg'],
  },
}
