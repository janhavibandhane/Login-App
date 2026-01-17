// src/utils/authHeaders.js
export const authHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    Authorization: token ? `Bearer ${token}` : "",
  };
};
