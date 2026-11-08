export type PersonnelRole = 'PS' | 'NSP';

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

export const ROLE_DEFINITIONS: Record<PersonnelRole, { label: string; fullTitle: string; description: string }> = {
  PS: {
    label: 'PS',
    fullTitle: 'Permanent Staff',
    description: 'Full-time company personnel managing regular kitchen & order operations',
  },
  NSP: {
    label: 'NSP',
    fullTitle: 'National Service Personnel',
    description: 'National service personnel assigned to dispatch and logistics support',
  },
};
