const API_URL = "http://localhost:8080/auth";

export const loginUser = async (email, password) => {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) throw new Error("Login failed");

  const data = await response.json(); // { token: "..." }
  localStorage.setItem("jwt", data.token); // store token for authenticated requests
  return data;
};

export const signupUser = async (email, password, roles) => {
  const response = await fetch("http://localhost:8080/auth/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password, roles }),
  });

  if (!response.ok) {
    throw new Error("Signup failed");
  }

  return response.json();
};
