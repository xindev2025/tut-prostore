import { createUploadthing, type FileRouter } from 'uploadthing/next'
import { UploadThingError } from 'uploadthing/server'
const f = createUploadthing()
import { auth } from '@/auth'

export const ourFileRouter = {
  imageUploader: f({
    image: {
      /**
       * For full list of options and defaults, see the File Route API reference
       * @see https://docs.uploadthing.com/file-routes#route-config
       */
      maxFileSize: '4MB'
    }
  })
    // Set permissions and file types for this FileRoute
    .middleware(async () => {
      const session = await auth()

      if (!session) {
        throw new UploadThingError('Unauthorized')
      }

      return {
        userId: session.user.id
      }
    })
    .onUploadComplete(async ({ metadata }) => {
      return { uploadedBy: metadata.userId }
    })
} satisfies FileRouter
export type OurFileRouter = typeof ourFileRouter
