const API_URL = "http://localhost:8080/api/wishlist";

export const fetchWishlist = async () => {
  const token = localStorage.getItem("jwtToken");
  if (!token) throw new Error("Not authenticated");

  const res = await fetch(`${API_URL}/buyer`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch wishlist");
  return res.json();
};


export const addToWishlist = async (productId) => {
  const token = localStorage.getItem("jwtToken");
  if (!token) throw new Error("Not authenticated");

  const response = await fetch(`${API_URL}/add/${productId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to add to wishlist");
  }

  return response.json();
};

export const removeFromWishlist = async (productId) => {
  const token = localStorage.getItem("jwtToken");
  if (!token) throw new Error("Not authenticated");

  const res = await fetch(`${API_URL}/remove/${productId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Failed to remove item");
  return res.json();
};
