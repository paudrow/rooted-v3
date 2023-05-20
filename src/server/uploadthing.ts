/** server/uploadthing.ts */
import { type NextApiRequest, type NextApiResponse } from "next"
// import { currentUser } from "@clerk/nextjs/server"
import { createUploadthing, type FileRouter } from "uploadthing/next-legacy"

const f = createUploadthing()

// const auth = async (req: NextApiRequest, res: NextApiResponse) => {
//   const user = currentUser();
//   return user;
// }
const auth = (req: NextApiRequest, res: NextApiResponse) => ({ id: "fakeId" }) // Fake auth function

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f
    // Set permissions and file types for this FileRoute
    .fileTypes(["image", "video"])
    .maxSize("1GB")
    .middleware((req, res) => {
      // This code runs on your server before upload
      const user = auth(req, res)

      // If you throw, the user will not be able to upload
      if (!user) throw new Error("Unauthorized")

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: user.id }
    })
    .onUploadComplete(({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata.userId)

      console.log("file url", file.url)
    }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
