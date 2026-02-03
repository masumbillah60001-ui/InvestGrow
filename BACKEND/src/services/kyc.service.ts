import { prisma } from '../config/database';
import { s3Service } from './s3.service';
import { AppError } from '../middleware/errorHandler';
import { DocumentType, VerificationStatus } from '@prisma/client';

const KYC_BUCKET = process.env.S3_BUCKET_KYC || 'investgrow-kyc-documents-dev';

export class KycService {
    async uploadDocument(userId: string, file: Express.Multer.File, data: any) {
        const { documentType, documentNumber } = data;

        // Check if user has already uploaded this document
        const existingDoc = await prisma.kycDocument.findFirst({
            where: {
                userId,
                documentType: documentType as DocumentType,
                verificationStatus: { in: [VerificationStatus.PENDING, VerificationStatus.VERIFIED] },
            },
        });

        if (existingDoc) {
            throw new AppError('Document of this type already exists and is pending or verified', 409);
        }

        // Generate unique file path: userId/documentType_timestamp.ext
        const fileExt = file.originalname.split('.').pop();
        const key = `${userId}/${documentType}_${Date.now()}.${fileExt}`;

        // Upload to S3
        await s3Service.uploadFile(file, key, KYC_BUCKET);

        // Save to DB
        const kycDoc = await prisma.kycDocument.create({
            data: {
                userId,
                documentType: documentType as DocumentType,
                documentNumber,
                documentUrl: key, // Store S3 key, not full URL
                verificationStatus: VerificationStatus.PENDING,
            },
        });

        // Notify admin (placeholder for notification service)

        return kycDoc;
    }

    async getKycStatus(userId: string) {
        const documents = await prisma.kycDocument.findMany({
            where: { userId },
        });

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { kycStatus: true },
        });

        return {
            overallStatus: user?.kycStatus,
            documents,
        };
    }
}

export const kycService = new KycService();
