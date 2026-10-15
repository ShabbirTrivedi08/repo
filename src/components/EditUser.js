import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function EditUser() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    id: id,
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // =========================
  // Get User Details
  // =========================
  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/get-singleuser/${id}`
        );

        console.log("Get User Response:", response.data);

        if (response.data.status === 1) {
          const user = response.data.data;

          setFormData({
            id: user.id || id,
            name: user.name || "",
            email: user.email || "",
            phone: user.phone || "",
            address: user.address || "",
          });
        } else {
          alert(response.data.message || "Failed to get user");
          navigate("/dashboard");
        }
      } catch (error) {
        console.error(
          "Get User Error:",
          error.response?.data?.message || error.message
        );

        alert(
          error.response?.data?.message ||
            "Server connection failed"
        );

        navigate("/dashboard");
      } finally {
        setFetching(false);
      }
    };

    if (id) {
      getUser();
    }
  }, [id, navigate]);

  // =========================
  // Validation
  // =========================
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
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = "Enter a valid email address";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone is required";
    } else if (!phoneRegex.test(formData.phone.trim())) {
      newErrors.phone = "Phone must be 6 to 15 digits";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    return newErrors;
  };

  // =========================
  // Handle Input Change
  // =========================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Remove error while typing
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  // =========================
  // Update User
  // =========================
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
      const response = await axios.put(
        `http://localhost:5000/api/update-user/${id}`,
        {
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          address: formData.address.trim(),
        }
      );

      console.log("Update User Response:", response.data);

      if (response.data.status === 1) {
        alert("User updated successfully");
        navigate("/dashboard");
      } else {
        alert(
          response.data.message || "Failed to update user"
        );
      }
    } catch (error) {
      console.error(
        "Update User Error:",
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

  // =========================
  // Cancel
  // =========================
  const handleCancel = () => {
    navigate("/dashboard");
  };

  // =========================
  // Input Class
  // =========================
  const inputClass = (field) =>
    `w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
      errors[field]
        ? "border-red-500"
        : "border-gray-300"
    }`;

  // =========================
  // Loading User
  // =========================
  if (fetching) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white px-6 py-4 rounded-lg shadow-md">
          <p className="text-gray-700">
            Loading user details...
          </p>
        </div>
      </div>
    );
  }

  // =========================
  // UI
  // =========================
  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Edit User
          </h2>

          <button
            type="button"
            onClick={handleCancel}
            className="text-sm text-blue-600 hover:underline"
          >
            &larr; Back to list
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate>

          {/* Name */}
          <div className="mb-4">
            <label
              htmlFor="edit-name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Name
            </label>

            <input
              type="text"
              id="edit-name"
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

          {/* Email */}
          <div className="mb-4">
            <label
              htmlFor="edit-email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>

            <input
              type="email"
              id="edit-email"
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

          {/* Phone */}
          <div className="mb-4">
            <label
              htmlFor="edit-phone"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Phone
            </label>

            <input
              type="text"
              id="edit-phone"
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

          {/* Address */}
          <div className="mb-6">
            <label
              htmlFor="edit-address"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Address
            </label>

            <textarea
              id="edit-address"
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

          {/* Buttons */}
          <div className="flex justify-end gap-3">

            <button
              type="button"
              onClick={handleCancel}
              disabled={loading}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md transition-colors disabled:bg-green-300"
            >
              {loading ? "Updating..." : "Update User"}
            </button>

          </div>
        </form>
      </div>
    </div>
  );
}

export default EditUser;
