import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AddUser() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{6,15}$/;

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 3) {
      newErrors.name = "Name must be at least 3 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone is required";
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = "Phone must be 6 to 15 digits";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    return newErrors;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/add-user",
        formData
      );

      console.log("Add User Response:", response.data);

      if (response.data.status === 1) {
        alert("User added successfully");
        navigate("/dashboard");
      } else {
        alert(
          response.data.message || "Failed to add user"
        );
      }
    } catch (error) {
      console.error(
        "Add User Error:",
        error.response?.data?.message || error.message
      );

      alert(
        error.response?.data?.message ||
          "Server connection failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/dashboard");
  };

  const inputClass = (field) =>
    `w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
      errors[field]
        ? "border-red-500"
        : "border-gray-300"
    }`;

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Add User
          </h2>

          <button
            type="button"
            onClick={handleCancel}
            className="text-sm text-blue-600 hover:underline"
          >
            &larr; Back to list
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={inputClass("name")}
              placeholder="Enter full name"
            />

            {errors.name && (
              <p className="text-red-500 text-sm mt-1">
                {errors.name}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={inputClass("email")}
              placeholder="you@example.com"
            />

            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>

            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={inputClass("phone")}
              placeholder="Enter phone number"
            />

            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">
                {errors.phone}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>

            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows="3"
              className={inputClass("address")}
              placeholder="Enter address"
            />

            {errors.address && (
              <p className="text-red-500 text-sm mt-1">
                {errors.address}
              </p>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={inputClass("password")}
              placeholder="Enter password"
            />

            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md disabled:bg-blue-300"
            >
              {loading ? "Adding..." : "Add User"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default AddUser;
