// types/security.ts

export interface BiometricData {
    id: string;
    type: 'Fingerprint' | 'Face';
    publicKey: string;
    enrolledDate: string;
}

export interface LoginAttempt {
    id: string;
    userId: string;
    userName: string;
    timestamp: string;
    ipAddress: string;
    success: boolean;
}

export interface SynapticVault {
    id: string;
    ownerIds: string[];
    ownerNames: string[];
    status: 'pending' | 'active' | 'locked';
    masterPrivateKeyFragment: string;
    generatedPublicKey?: string;
    creationDate: string;
}