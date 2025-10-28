const API_URL = "http://localhost:8080/auth";

export const loginUser = async (email, password) => {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) throw new Error("Login failed. Check your credentials.");

  const data = await response.json(); // { token: "..." }
  localStorage.setItem("jwt", data.token); // store token for authenticated requests
  return data;
};

export const signupUser = async (email, password, roles) => {
  const response = await fetch("http://localhost:8080/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, roles }),
  });

  const data = await response.json(); // get backend response

  if (!response.ok) {
    // throw an error with the backend message
    throw new Error(data.message || "Email already in use!");
  }

  return data;
};
