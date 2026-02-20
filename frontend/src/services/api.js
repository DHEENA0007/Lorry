const API_URL = 'http://localhost:5000/api';

export const fetchData = async (endpoint) => {
    const response = await fetch(`${API_URL}/${endpoint}`);
    if (!response.ok) throw new Error('Failed to fetch data');
    return response.json();
};

export const postData = async (endpoint, data) => {
    const response = await fetch(`${API_URL}/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to post data');
    return response.json();
};

export const updateData = async (endpoint, data) => {
    const response = await fetch(`${API_URL}/${endpoint}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update data');
    return response.json();
}

export const deleteData = async (endpoint) => {
    const response = await fetch(`${API_URL}/${endpoint}`, {
        method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete data');
    return response.json();
}
