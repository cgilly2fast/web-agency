import { CollectionAfterOperationHook, CollectionSlug } from 'payload'
import { GetAfterOperationHookParams } from '../types'

export const getAfterOperationHook =
  ({
    keepOriginal,
    resolutions,
    segmentDuration,
    outputCollectionSlug,
  }: GetAfterOperationHookParams): CollectionAfterOperationHook =>
  async ({ operation, result, req, collection }) => {
    if (operation === 'create') {
      const { id, filename, mimeType, url, createdAt, updatedAt, ...data } = result as any
      if (!mimeType.startsWith('video/')) {
        return result
      }

      const baseURL = process.env.PAYLOAD_PUBLIC_SERVER_URL

      setTimeout(async () => {
        const body = JSON.stringify({
          baseURL,
          inputPath: baseURL + url,
          keepOriginal,
          originalID: id,
          originalData: data,
          resolutions,
          segmentDuration,
          inputCollectionSlug: collection.slug,
          outputCollectionSlug,
        })
        const contentLength = new TextEncoder().encode(body).length
        console.log(body)
        fetch(`${baseURL}/api/process-video`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': contentLength.toString(),
          },
          body,
        })
      }, 1000)
      return result
    }
    if (operation === 'deleteByID') {
      const { filename, mimeType } = result as any
      if (!mimeType.startsWith('application/x-mpegURL')) {
        return result
      }

      const videoName = filename.split('.')[0]

      req.payload.delete({
        collection: outputCollectionSlug as CollectionSlug,
        where: {
          filename: {
            contains: videoName,
          },
        },
      })
      return result
    }

    if (operation === 'delete') {
      const { docs } = result as any
      for (let i = 0; i < docs.length; i++) {
        const { filename, mimeType } = docs[i]
        if (!mimeType.startsWith('application/x-mpegURL')) {
          continue
        }

        const videoName = filename.split('.')[0]

        req.payload.delete({
          collection: outputCollectionSlug as CollectionSlug,
          where: {
            filename: {
              contains: videoName,
            },
          },
        })
      }
      return result
    }
    return result
  }
