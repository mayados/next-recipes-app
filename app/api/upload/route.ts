import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

// Configuration de Cloudinary avec les variables d'environnement
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  try {
    // Get the file from the form
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file received' }, { status: 400 });
    }

    // When it's a file, we have to read it as a buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // create readable stream to transfer buffer to cloudiary
    const readableStream = Readable.from(buffer);

    // Upload of the file to Cloudinary
    const uploadResponse = await new Promise<CloudinaryResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { upload_preset: 'app_recipes_pictures' },
        (error, result) => {
          if (error) {
            reject(error); 
          } else {
            resolve(result as CloudinaryResponse);  
          }
        }
      );

      // Send readable stream to cliudinary
      readableStream.pipe(uploadStream);
    });

    // Return url from uploaded image
    return NextResponse.json({ url: uploadResponse.secure_url }, { status: 200 });
    // return NextResponse.json({ url: uploadResponse.secure_url }, { status: 200 });

  } catch (error) {
    console.error("Error with image's upload:", error);
    return NextResponse.json({ error: "Something went wrong with image's upload" }, { status: 500 });
  }
}
