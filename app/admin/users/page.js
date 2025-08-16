"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export default function AdminUsers() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    const storedUser =
      typeof window !== "undefined" &&
      (localStorage.getItem("user") || sessionStorage.getItem("user"));

    if (!storedUser) {
      router.push("/signin");
      return;
    }

    fetchUsers();

    // Set up real-time polling every 5 seconds - only refresh table data
    const interval = setInterval(() => {
      refreshTableOnly(); // Only refresh table, no loading states
    }, 5000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [router]);

  const fetchUsers = async (showLoading = true) => {
    try {
      if (showLoading) {
        setLoading(true);
      }
      const res = await fetch("/api/users");
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      setUsers(data);
      setLastUpdate(new Date());
      setError(""); // Clear any previous errors
    } catch (err) {
      setError("Failed to load users");
      if (showLoading) {
        await Swal.fire({
          title: "Error!",
          text: "Failed to load users. Please try again.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  };

  const refreshTableOnly = async () => {
    try {
      const res = await fetch("/api/users");
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      setUsers(data);
      setLastUpdate(new Date());
    } catch (err) {
      // Silent error for background refresh
      console.error("Background refresh failed:", err);
    }
  };

  const handleDeleteUser = async (userId, username) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Do you want to delete user "${username}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`/api/users/${userId}`, {
          method: "DELETE",
        });

        if (!res.ok) throw new Error("Failed to delete user");

        await Swal.fire({
          title: "Deleted!",
          text: `User "${username}" has been deleted.`,
          icon: "success",
          confirmButtonText: "OK",
        });

        // Refresh the users list
        refreshTableOnly();
      } catch (err) {
        await Swal.fire({
          title: "Error!",
          text: "Failed to delete user. Please try again.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    }
  };

  const handleViewUser = (user) => {
    // Calculate age from birthday
    const calculateAge = (birthday) => {
      if (!birthday) return "N/A";
      const today = new Date();
      const birthDate = new Date(birthday);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }
      return age;
    };

    // Format birthday for display
    const formatBirthday = (birthday) => {
      if (!birthday) return "N/A";
      const date = new Date(birthday);
      return {
        full: date.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        short: date.toLocaleDateString(),
        age: calculateAge(birthday),
      };
    };

    const birthdayInfo = formatBirthday(user.birthday);
    const sexDisplay = user.sex || "N/A";
    const addressDisplay = user.address
      ? user.address.replace(/\n/g, "<br>")
      : "N/A";

    Swal.fire({
      title: "User Details",
      html: `
        <div class="text-start">
          <div class="row">
            <div class="col-md-6">
              <h6 class="text-primary mb-3">Basic Information</h6>
              <p><strong>ID:</strong> ${user.id || "N/A"}</p>
              <p><strong>Title:</strong> ${user.firstname || "N/A"}</p>
              <p><strong>Full Name:</strong> ${user.fullname || "N/A"}</p>
              <p><strong>Last Name:</strong> ${user.lastname || "N/A"}</p>
              <p><strong>Username:</strong> <span class="badge bg-secondary">${user.username || "N/A"}</span></p>
            </div>
            <div class="col-md-6">
              <h6 class="text-primary mb-3">Personal Details</h6>
                                                           <p><strong>Sex:</strong> <span class="badge ${
                                                             user.sex ===
                                                               "Male" ||
                                                             user.sex ===
                                                               "male" ||
                                                             user.sex === "ชาย"
                                                               ? "bg-primary"
                                                               : user.sex ===
                                                                     "Female" ||
                                                                   user.sex ===
                                                                     "female" ||
                                                                   user.sex ===
                                                                     "หญิง"
                                                                 ? "bg-danger"
                                                                 : "bg-secondary"
                                                           }">${sexDisplay}</span></p>
              <p><strong>Birthday:</strong> ${birthdayInfo.full}</p>
              <p><strong>Age:</strong> ${birthdayInfo.age} years old</p>
              <p><strong>Password:</strong> <span class="text-muted">[Encrypted]</span></p>
            </div>
          </div>
          <hr>
          <div class="mt-3">
            <h6 class="text-primary mb-2">Address Details</h6>
            <div class="bg-light p-3 rounded">
              ${addressDisplay}
            </div>
          </div>
        </div>
      `,
      icon: "info",
      confirmButtonText: "Close",
      width: "600px",
      customClass: {
        popup: "swal-wide",
      },
    });
  };

  if (loading) {
    return (
      <div className="d-flex vh-100 align-items-center justify-content-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h3 className="mb-0">
                <i className="fas fa-users me-2"></i>
                Admin - User Management
              </h3>
            </div>
            <div className="card-body">
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h5 className="mb-0">All Users ({users.length})</h5>
                  <small className="text-muted">
                    Last updated: {lastUpdate.toLocaleTimeString()}
                  </small>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <div className="d-flex align-items-center">
                    <div
                      className="spinner-border spinner-border-sm text-success me-2"
                      role="status"
                    >
                      <span className="visually-hidden">
                        Auto-refreshing...
                      </span>
                    </div>
                    <small className="text-muted">Auto-refreshing</small>
                  </div>
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => refreshTableOnly()}
                  >
                    <i className="fas fa-sync-alt me-1"></i>
                    Refresh Table
                  </button>
                </div>
              </div>

              {users.length === 0 ? (
                <div className="py-4 text-center">
                  <i className="fas fa-users fa-3x text-muted mb-3"></i>
                  <p className="text-muted">No users found</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table-striped table-hover table">
                    <thead className="table-dark">
                      <tr>
                        <th>ID</th>
                        <th>First Name</th>
                        <th>Full Name</th>
                        <th>Last Name</th>
                        <th>Username</th>
                        <th>Sex</th>
                        <th>Birthday</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id || user.username}>
                          <td>{user.id || "N/A"}</td>
                          <td>{user.firstname || "N/A"}</td>
                          <td>{user.fullname || "N/A"}</td>
                          <td>{user.lastname || "N/A"}</td>
                          <td>
                            <span className="badge bg-secondary">
                              {user.username || "N/A"}
                            </span>
                          </td>
                          <td>
                            <span
                              className={`badge ${
                                user.sex === "Male" ||
                                user.sex === "male" ||
                                user.sex === "ชาย"
                                  ? "bg-primary"
                                  : user.sex === "Female" ||
                                      user.sex === "female" ||
                                      user.sex === "หญิง"
                                    ? "bg-danger"
                                    : "bg-secondary"
                              }`}
                            >
                              {user.sex || "N/A"}
                            </span>
                          </td>
                          <td>
                            {user.birthday
                              ? new Date(user.birthday).toLocaleDateString()
                              : "N/A"}
                          </td>
                          <td>
                            <div className="btn-group" role="group">
                              <button
                                className="btn btn-outline-info btn-sm"
                                onClick={() => handleViewUser(user)}
                                title="View Details"
                              >
                                <i className="fas fa-eye"></i>
                              </button>
                              <button
                                className="btn btn-outline-danger btn-sm"
                                onClick={() =>
                                  handleDeleteUser(
                                    user.id || user.username,
                                    user.username,
                                  )
                                }
                                title="Delete User"
                              >
                                <i className="fas fa-trash"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
