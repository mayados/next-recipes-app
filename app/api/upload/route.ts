import { NextResponse } from 'next/server';
import { IncomingForm } from 'formidable';
import cloudinary from '@/lib/cloudinary';

// Configuration de l'API pour désactiver le traitement par défaut de Next.js
export const config = {
    api: {
        bodyParser: false, // Important : désactiver le traitement par défaut de Next.js
    },
};

// Fonction handler pour la route API
export const POST = async (req) => {
    const form = new IncomingForm(); // Crée une nouvelle instance de IncomingForm

    return new Promise((resolve, reject) => {
        form.parse(req, async (err, fields, files) => {
            if (err) {
                console.error("Erreur lors du parsing du formulaire :", err);
                return resolve(NextResponse.json({ error: "Échec du parsing du formulaire" }, { status: 400 }));
            }

            const file = files.file; // Changez selon le nom du champ utilisé dans le formulaire
            if (!file) {
                return resolve(NextResponse.json({ error: "Aucun fichier téléchargé" }, { status: 400 }));
            }

            try {
                // Upload vers Cloudinary en utilisant le chemin du fichier
                const uploadResponse = await cloudinary.uploader.upload(file.filepath, {
                    upload_preset: 'ml_default', // Changez selon votre preset
                });
                return resolve(NextResponse.json({ url: uploadResponse.secure_url }));
            } catch (uploadError) {
                console.error("Erreur lors de l'upload vers Cloudinary :", uploadError);
                return resolve(NextResponse.json({ error: "Échec de l'upload" }, { status: 500 }));
            }
        });
    });
};