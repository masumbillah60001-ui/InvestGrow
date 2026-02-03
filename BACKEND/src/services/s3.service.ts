import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { AppError } from '../middleware/errorHandler';

const s3Client = new S3Client({
    region: process.env.AWS_REGION || 'ap-south-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'dummy',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'dummy',
    },
});

export class S3Service {
    async uploadFile(file: Express.Multer.File, key: string, bucketName: string) {
        try {
            const command = new PutObjectCommand({
                Bucket: bucketName,
                Key: key,
                Body: file.buffer,
                ContentType: file.mimetype,
            });

            await s3Client.send(command);

            return key;
        } catch (error) {
            console.error('S3 Upload Error:', error);
            throw new AppError('File upload failed', 500);
        }
    }

    async getSignedUrl(key: string, bucketName: string, expiresIn = 3600) {
        try {
            const command = new GetObjectCommand({
                Bucket: bucketName,
                Key: key,
            });

            const url = await getSignedUrl(s3Client, command, { expiresIn });
            return url;
        } catch (error) {
            console.error('S3 Signed URL Error:', error);
            throw new AppError('Failed to generate file URL', 500);
        }
    }
}

export const s3Service = new S3Service();
