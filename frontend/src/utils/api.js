export const getToken = () => {
  const fromStorage = localStorage.getItem("userToken");
  if (fromStorage) return fromStorage;

  try {
    const userInfo = JSON.parse(localStorage.getItem("userInfo") || "null");
    return userInfo?.token || null;
  } catch {
    return null;
  }
};

export const getAuthHeaders = (isFormData = false) => {
  const token = getToken();
  const headers = {};
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
};

export const apiFetch = async (url, options = {}) => {
  const isFormData = options.body instanceof FormData;
  const response = await fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      ...getAuthHeaders(isFormData),
      ...options.headers,
    },
  });

  let data = {};
  const text = await response.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { message: text };
    }
  }

  if (response.status === 401) {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userInfo");
  }

  if (!response.ok) {
    throw new Error(data.message || `Request failed (${response.status})`);
  }

  return data;
};
