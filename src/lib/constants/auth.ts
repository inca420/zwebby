export const SUPERADMIN_EMAILS = [
    'jack@incatrailterpenes.com',
    'jack@smokeshowlabs.com',
    'dan@incatrailterpenes.com',
    'dan@smokeshowlabs.com',
    'scot@smokeshowlabs.com',
    'info@sdrproductions.com',
    'scot.robnett@sdrproductions.com',
    'sdrproductionsinfo@gmail.com',
];

export function isSuperAdmin(email?: string): boolean {
    if (!email) return false;
    return SUPERADMIN_EMAILS.includes(email.toLowerCase());
}
