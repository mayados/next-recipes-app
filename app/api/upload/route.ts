import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

// Configuration of cloudinary with the different env variables
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  try {
    // We retrieve the datas from the form
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'Aucun fichier reçu' }, { status: 400 });
    }

    // We read the fil as a buffer : it's an important point in the case of file's uploading
    const buffer = Buffer.from(await file.arrayBuffer());

    // We create a readable flux from the buffer so we'll be able to transfer it to cloudinary
    const readableStream = Readable.from(buffer);

    // Cloudinary upload
    const uploadResponse = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { upload_preset: 'app_recipes_pictures' },
        (error, result) => {
          if (error) {
            reject(error); 
          } else {
            resolve(result);  
          }
        }
      );

      // We send the flux to Cloudinary
      readableStream.pipe(uploadStream);
    });

    return NextResponse.json({ url: uploadResponse.secure_url }, { status: 200 });

  } catch (error) {
    console.error("Error with image's upload :", error);
    return NextResponse.json({ error: "Something went wrong with image's upload" }, { status: 500 });
  }
}
