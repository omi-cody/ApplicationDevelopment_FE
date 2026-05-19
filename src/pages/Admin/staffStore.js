const STAFF_STORAGE_KEY = 'bike360.admin.staff.v1';

const DEFAULT_STAFF = [
    { id: 1, name: 'Aaryan Jha', email: 'aaryan@bike360.com', role: 'Admin', status: 'Active' },
    { id: 2, name: 'Sita Sharma', email: 'sita@bike360.com', role: 'Staff', status: 'Active' },
    { id: 3, name: 'Rahul Thapa', email: 'rahul@bike360.com', role: 'Staff', status: 'Inactive' },
];

function safeParseJson(value, fallback) {
    if (!value) return fallback;
    try {
        return JSON.parse(value);
    } catch {
        return fallback;
    }
}

export function loadStaffList() {
    if (typeof window === 'undefined') return [...DEFAULT_STAFF];

    const stored = safeParseJson(window.localStorage?.getItem(STAFF_STORAGE_KEY), null);
    if (Array.isArray(stored) && stored.length) return stored;
    return [...DEFAULT_STAFF];
}

export function saveStaffList(nextList) {
    if (typeof window === 'undefined') return;
    window.localStorage?.setItem(STAFF_STORAGE_KEY, JSON.stringify(nextList));
}

export function nextStaffId(staffList) {
    const maxId = staffList.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0);
    return maxId + 1;
}

