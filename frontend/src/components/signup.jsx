import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (formData.password.length < 6) {
      setMessage("Password must be at least 6 characters long.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Signup successful! Redirecting...");
        setTimeout(() => {
          navigate("/");
          window.location.reload();
        }, 2000);
      } else {
        setMessage(data.error || "Signup failed.");
      }
    } catch (error) {
      setMessage("Error signing up. Try again later.");
    }
  };

  const handleGoogleSignup = () => {
    window.location.href = "http://localhost:3000/auth/google";
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-[#f9f9f9] space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Sign Up</h2>
      <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-sm">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 bg-gray-50"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 bg-gray-50"
        />
        <input
          type="password"
          name="password"
          placeholder="Password (min 6 characters)"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 bg-gray-50"
        />
        
        <button
          type="submit"
          className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-lg transition"
        >
          Sign Up
        </button>
      </form>

      <button
        onClick={handleGoogleSignup}
        className="flex items-center space-x-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg transition"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24" height="24"><path fill="#4285F4" d="M24 9.5c3.04 0 5.5.98 7.58 2.91l5.66-5.66C33.83 3.01 29.27 1 24 1 14.93 1 7.23 6.8 3.99 14.81l7.15 5.51C13.09 14.36 18.06 9.5 24 9.5z"/><path fill="#34A853" d="M46.5 24.52c0-1.61-.14-3.15-.4-4.65H24v9.51h12.76c-.9 4.46-3.88 8.16-7.76 10.3l7.15 5.52c6.51-6.02 10.35-14.92 10.35-25.68z"/><path fill="#FBBC05" d="M3.99 14.81C2.58 18.02 1.5 21.87 1.5 26c0 4.13 1.08 7.98 2.49 11.19l7.15-5.52c-.93-2.78-1.48-5.73-1.48-8.67s.55-5.89 1.48-8.67l-7.15-5.52z"/><path fill="#EA4335" d="M24 46.5c5.27 0 9.83-1.75 13.15-4.73l-7.15-5.52c-2.04 1.32-4.55 2.05-7.32 2.05-5.94 0-10.91-4.86-12.86-11.19l-7.15 5.52C7.23 41.2 14.93 46.5 24 46.5z"/></svg>
        <span>Sign up with Google</span>
      </button>

      {message && <p className="text-red-500 text-center">{message}</p>}
    </div>
  );
};

export default Signup;