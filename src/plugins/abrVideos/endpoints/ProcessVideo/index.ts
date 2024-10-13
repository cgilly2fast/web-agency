import { CollectionSlug, PayloadHandler, PayloadRequest } from 'payload'
import fs from 'fs'
import path from 'path'
import { createMasterManifest, createPlaylistManifests } from './utils/manifestUtils'
import { sliceVideo } from './service/sliceVideo'
import {} from 'payload'
import { PossibleBitrates, PossibleResolutions, ProcessVideoParams } from '../../types'
import { getUploadBuffer } from './utils/fileUploadUtils'
import { addDataAndFileToRequest } from '@payloadcms/next/utilities'

const processVideo: PayloadHandler = async (req) => {
  await addDataAndFileToRequest(req)

  try {
    const {
      inputPath,
      baseURL,
      keepOriginal,
      resolutions,
      originalID,
      originalData,
      segmentDuration,
      inputCollectionSlug,
      outputCollectionSlug,
    } = req.data as unknown as ProcessVideoParams
    console.log(req.data)

    const decodedInputPath = decodeURIComponent(baseURL + inputPath)

    const videoName = path.basename(decodedInputPath, path.extname(decodedInputPath))
    const tempDir = path.join(__dirname, 'temp')
    const tempOutputDir = path.join(tempDir, videoName)

    if (!fs.existsSync(tempOutputDir)) {
      fs.mkdirSync(tempOutputDir, { recursive: true })
    }
    let possibleBitrates: PossibleBitrates = {}
    let possibleResolutions: PossibleResolutions = []
    for (let i = 0; i < resolutions.length; i++) {
      const { size, bitrate } = resolutions[i]
      possibleBitrates[size] = bitrate
      possibleResolutions.push(size)
    }

    const uploadBufferToOutputCollection = getUploadBuffer(req.payload, outputCollectionSlug)
    const uploadBufferToInputCollection = getUploadBuffer(req.payload, inputCollectionSlug)

    const videoInfo = await sliceVideo(
      videoName,
      inputPath,
      tempOutputDir,
      possibleResolutions,
      possibleBitrates,
      baseURL,
      segmentDuration,
      uploadBufferToOutputCollection,
      outputCollectionSlug,
    )
    await createPlaylistManifests(
      videoName,
      videoInfo.playlists,
      segmentDuration,
      uploadBufferToOutputCollection,
    )
    await createMasterManifest(
      videoName,
      videoInfo,
      possibleBitrates,
      baseURL,
      uploadBufferToInputCollection,
      outputCollectionSlug,
      originalData,
    )

    fs.rmSync(tempDir, { recursive: true, force: true })

    if (!keepOriginal) {
      req.payload.delete({
        collection: inputCollectionSlug as CollectionSlug,
        id: originalID,
      })
    }
    console.log('Video processing done')
    return Response.json({ success: true })
  } catch (error: any) {
    console.error('Error in processing video:', error)
    return Response.json({ success: false, error: error.message })
  }
}

export default processVideo
