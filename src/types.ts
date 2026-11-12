export type PersonnelRole = 'PS' | 'NSP';

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: PersonnelRole;
  station?: string;
}

export interface SignUpFormData {
  role: PersonnelRole;
  fullName: string;
  email: string;
  password: string;
  phoneNumber: string;
}

export interface FormErrors {
  fullName?: string;
  email?: string;
  password?: string;
  phoneNumber?: string;
}

export const ROLE_DEFINITIONS: Record<
  PersonnelRole,
  { label: string; fullTitle: string; description: string }
> = {
  PS: {
    label: 'PS',
    fullTitle: 'Permanent Staff',
    description: 'Browse food joints, place orders, and assign dispatch personnel',
  },
  NSP: {
    label: 'NSP',
    fullTitle: 'National Service Personnel',
    description: 'View assigned orders, manage deliveries, and mark orders completed',
  },
};
