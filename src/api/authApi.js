const BASE_URL = import.meta.env.VITE_API_URL ?? '';

async function request(endpoint, options = {}) {
    const token = localStorage.getItem('bike360_token');

    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
    };

    const res = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
        throw new Error(
            data?.message ?? data?.errors?.[0] ?? `Error ${res.status}`
        );
    }

    return data;
}

export async function loginUser({ email, password }) {
    return request('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
    });
}

export async function registerCustomer({ fullName, email, phone, password }) {
    return request('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({
            fullName,
            email,
            phoneNumber: phone,   // backend expects phoneNumber not phone
            password,
            role: 'Customer',
        }),
    });
}

export async function getMe() {
    return request('/api/auth/me');
}