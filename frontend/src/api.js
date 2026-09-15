const BASE_URL = "http://127.0.0.1:8000";

export async function getIssues() {
    const response = await fetch(`${BASE_URL}/issues/`);
    if (!response.ok) {
        throw new Error(`Failed to fetch backlog: ${response.status}`);
    }
    return response.json();
}

export async function createIssue(item_data) {
    const response = await fetch(`${BASE_URL}/issues/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(item_data),
    });

    if (!response.ok) {
        const error = await response.text();

        console.error("CREATE ISSUE STATUS:", response.status);
        console.error("CREATE ISSUE RESPONSE:", error);
        console.error("CREATE ISSUE PAYLOAD:", item_data);

        throw new Error(
            error || `Failed to create item: ${response.status}`
        );
    }

    return response.json();
}

export async function updateIssue(item_id, item_data) {
    const response = await fetch(`${BASE_URL}/issues/${item_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item_data),
    });

    if (!response.ok) {
        throw new Error(`Failed to update item: ${response.status}`);
    }

    return response.json();
}

export async function deleteIssue(item_id) {
    const response = await fetch(`${BASE_URL}/issues/${item_id}`, { 
        method: "DELETE" 
    });
    if (!response.ok) {
        throw new Error(`Failed to delete item: ${response.status}`);
    }
}

export async function getServices() {
    const response = await fetch(`${BASE_URL}/services/`);
    if (!response.ok) {
        throw new Error(`Failed to fetch services: ${response.status}`);
    }
    return response.json();
}

export async function runTriage(rawText) {
    const response = await fetch(`${BASE_URL}/triage/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", },
        body: JSON.stringify({ raw_text: rawText, }),
    });
    if(!response.ok) {
        throw new Error(`AI triage failed: ${response.status}`);
    }
    return response.json();
}

export async function loginUser(email, password) {
    const response = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.detail || `Login failed: ${response.status}`);
    }
    return response.json();
}

export async function registerUser(email, password) {
    const response = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.detail || `Registration failed: ${response.status}`);
    }
    return response.json();
}

export async function updateTheme(theme, token) {
    const response = await fetch(`${BASE_URL}/users/theme`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ theme }),
    });
    if (!response.ok) {
        throw new Error(`Failed to update theme: ${response.status}`);
    }
    return response.json();
}