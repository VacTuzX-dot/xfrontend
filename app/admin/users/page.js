"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2";
import { Modal, Button, Form, Badge, Spinner } from "react-bootstrap";

// Constants for user fields
const USER_FIELDS = {
  PREFIX: "prefix",
  FIRSTNAME: "firstname",
  LASTNAME: "lastname",
  FULLNAME: "fullname",
  GENDER: "gender",
  BIRTH_TEMPLE: "birthTemple",
  ADDRESS: "address",
};

const GENDER_OPTIONS = [
  { value: "", label: "เลือกเพศ" },
  { value: "ชาย", label: "ชาย" },
  { value: "หญิง", label: "หญิง" },
];

const PREFIX_OPTIONS = [
  "นาย",
  "นาง",
  "นางสาว",
  "เด็กชาย",
  "เด็กหญิง",
  "พระ",
  "สามเณร",
];

export default function AdminDashboard() {
  const [items, setItems] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("http://itdev.cmtc.ac.th:3000/api/users");
      const data = await res.json();
      setItems(data);
    } catch (error) {
      console.error("Failed to fetch users", error);
      Swal.fire({
        title: "เกิดข้อผิดพลาด",
        text: "ไม่สามารถโหลดข้อมูลผู้ใช้ได้",
        icon: "error",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
    const interval = setInterval(fetchUsers, 5000); // เพิ่มเวลาเป็น 5 วินาที
    return () => clearInterval(interval);
  }, [fetchUsers]);

  const handleCheckboxChange = useCallback((id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }, []);

  const handleSelectAll = useCallback(
    (checked) => {
      setSelectedIds(checked ? items.map((i) => i.id) : []);
    },
    [items]
  );

  const handleDeleteSelected = useCallback(async () => {
    if (selectedIds.length === 0) return;
    const result = await Swal.fire({
      title: "ยืนยันการลบ",
      text: `คุณต้องการลบผู้ใช้ ${selectedIds.length} คนใช่หรือไม่?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "ลบ",
      cancelButtonText: "ยกเลิก",
    });

    if (!result.isConfirmed) return;

    setLoading(true);
    try {
      await Promise.all(
        selectedIds.map((id) =>
          fetch(`http://itdev.cmtc.ac.th:3000/api/users/${id}`, {
            method: "DELETE",
          })
        )
      );
      Swal.fire({
        title: "สำเร็จ",
        text: "ลบข้อมูลสำเร็จ",
        icon: "success",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
      });
      setSelectedIds([]);
      fetchUsers();
    } catch (error) {
      console.error("Failed to delete users", error);
      Swal.fire({
        title: "เกิดข้อผิดพลาด",
        text: "ไม่สามารถลบข้อมูลได้",
        icon: "error",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
      });
    } finally {
      setLoading(false);
    }
  }, [selectedIds, fetchUsers]);

  const handleEdit = useCallback((user) => {
    setEditingUser({ ...user });
    setShowModal(true);
  }, []);

  const handleSave = useCallback(async () => {
    if (!editingUser) return;

    setLoading(true);
    try {
      await fetch(`http://itdev.cmtc.ac.th:3000/api/users/${editingUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingUser),
      });
      Swal.fire({
        title: "สำเร็จ",
        text: "อัปเดตข้อมูลสำเร็จ",
        icon: "success",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
      });
      setShowModal(false);
      fetchUsers();
    } catch (error) {
      console.error("Failed to update user", error);
      Swal.fire({
        title: "เกิดข้อผิดพลาด",
        text: "ไม่สามารถอัปเดตข้อมูลได้",
        icon: "error",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
      });
    } finally {
      setLoading(false);
    }
  }, [editingUser, fetchUsers]);

  const handleModalChange = useCallback((e) => {
    const { name, value } = e.target;
    setEditingUser((prev) => ({ ...prev, [name]: value }));
  }, []);

  const isAllSelected = useMemo(
    () => items.length > 0 && selectedIds.length === items.length,
    [items.length, selectedIds.length]
  );

  return (
    <div className="container-fluid py-4">
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="text-primary mb-1">
                <i className="fas fa-users me-2"></i>
                จัดการข้อมูลผู้ใช้
              </h2>
              <p className="text-muted mb-0">
                ทั้งหมด {items.length} คน
                {selectedIds.length > 0 && (
                  <Badge bg="info" className="ms-2">
                    เลือก {selectedIds.length} คน
                  </Badge>
                )}
              </p>
            </div>
            <div className="d-flex gap-2">
              {loading && <Spinner animation="border" size="sm" />}
              <button
                className="btn btn-danger"
                onClick={handleDeleteSelected}
                disabled={selectedIds.length === 0 || loading}
              >
                <i className="fas fa-trash me-1"></i>
                ลบที่เลือก ({selectedIds.length})
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="card shadow-sm border-0">
        <div className="card-header bg-gradient-primary text-white">
          <h5 className="mb-0">
            <i className="fas fa-table me-2"></i>
            รายชื่อผู้ใช้งาน
          </h5>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th
                    scope="col"
                    className="text-center"
                    style={{ width: "50px" }}
                  >
                    <input
                      type="checkbox"
                      className="form-check-input"
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      checked={isAllSelected}
                    />
                  </th>
                  <th className="text-center" style={{ width: "80px" }}>
                    ID
                  </th>
                  <th>คำนำหน้า</th>
                  <th>ชื่อต้น</th>
                  <th>นามสกุล</th>
                  <th>ชื่อเต็ม</th>
                  <th className="text-center">เพศ</th>
                  <th>วัดเกิด</th>
                  <th>ที่อยู่</th>
                  <th className="text-center" style={{ width: "100px" }}>
                    จัดการ
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr
                    key={item.id}
                    className={
                      selectedIds.includes(item.id) ? "table-active" : ""
                    }
                  >
                    <td className="text-center">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        checked={selectedIds.includes(item.id)}
                        onChange={() => handleCheckboxChange(item.id)}
                      />
                    </td>
                    <td className="text-center">
                      <Badge bg="secondary">{item.id}</Badge>
                    </td>
                    <td>
                      <span className="fw-medium">
                        {item[USER_FIELDS.PREFIX] || "-"}
                      </span>
                    </td>
                    <td>
                      <span className="text-primary fw-medium">
                        {item[USER_FIELDS.FIRSTNAME] || "-"}
                      </span>
                    </td>
                    <td>
                      <span className="fw-medium">
                        {item[USER_FIELDS.LASTNAME] || "-"}
                      </span>
                    </td>
                    <td>
                      <span className="text-dark">
                        {item[USER_FIELDS.FULLNAME] || "-"}
                      </span>
                    </td>
                    <td className="text-center">
                      {item[USER_FIELDS.GENDER] ? (
                        <Badge
                          bg={
                            item[USER_FIELDS.GENDER] === "ชาย"
                              ? "primary"
                              : "danger"
                          }
                        >
                          {item[USER_FIELDS.GENDER]}
                        </Badge>
                      ) : (
                        <span className="text-muted">-</span>
                      )}
                    </td>
                    <td>
                      <small className="text-muted">
                        {item[USER_FIELDS.BIRTH_TEMPLE] || "-"}
                      </small>
                    </td>
                    <td>
                      <small
                        className="text-muted"
                        style={{
                          maxWidth: "200px",
                          display: "block",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {item[USER_FIELDS.ADDRESS] || "-"}
                      </small>
                    </td>
                    <td className="text-center">
                      <button
                        className="btn btn-sm btn-outline-warning"
                        onClick={() => handleEdit(item)}
                        disabled={loading}
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                    </td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr>
                    <td colSpan={10} className="text-center py-5">
                      <div className="text-muted">
                        <i className="fas fa-users fa-3x mb-3 opacity-25"></i>
                        <p className="mb-0">ไม่พบข้อมูลผู้ใช้</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Edit Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
          <Modal.Header closeButton className="bg-primary text-white">
            <Modal.Title>
              <i className="fas fa-user-edit me-2"></i>
              แก้ไขข้อมูลผู้ใช้
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {editingUser && (
              <Form>
                <div className="row">
                  <div className="col-md-6">
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">
                        <i className="fas fa-user-tag me-1"></i>
                        คำนำหน้า
                      </Form.Label>
                      <Form.Select
                        name={USER_FIELDS.PREFIX}
                        value={editingUser[USER_FIELDS.PREFIX] || ""}
                        onChange={handleModalChange}
                      >
                        <option value="">เลือกคำนำหน้า</option>
                        {PREFIX_OPTIONS.map((prefix) => (
                          <option key={prefix} value={prefix}>
                            {prefix}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </div>
                  <div className="col-md-6">
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">
                        <i className="fas fa-user me-1"></i>
                        ชื่อต้น
                      </Form.Label>
                      <Form.Control
                        name={USER_FIELDS.FIRSTNAME}
                        value={editingUser[USER_FIELDS.FIRSTNAME] || ""}
                        onChange={handleModalChange}
                        placeholder="กรอกชื่อต้น"
                      />
                    </Form.Group>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">
                        <i className="fas fa-user me-1"></i>
                        นามสกุล
                      </Form.Label>
                      <Form.Control
                        name={USER_FIELDS.LASTNAME}
                        value={editingUser[USER_FIELDS.LASTNAME] || ""}
                        onChange={handleModalChange}
                        placeholder="กรอกนามสกุล"
                      />
                    </Form.Group>
                  </div>
                  <div className="col-md-6">
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">
                        <i className="fas fa-venus-mars me-1"></i>
                        เพศ
                      </Form.Label>
                      <Form.Select
                        name={USER_FIELDS.GENDER}
                        value={editingUser[USER_FIELDS.GENDER] || ""}
                        onChange={handleModalChange}
                      >
                        {GENDER_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </div>
                </div>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">
                    <i className="fas fa-id-card me-1"></i>
                    ชื่อเต็ม
                  </Form.Label>
                  <Form.Control
                    name={USER_FIELDS.FULLNAME}
                    value={editingUser[USER_FIELDS.FULLNAME] || ""}
                    onChange={handleModalChange}
                    placeholder="กรอกชื่อเต็ม"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">
                    <i className="fas fa-place-of-worship me-1"></i>
                    วัดเกิด
                  </Form.Label>
                  <Form.Control
                    name={USER_FIELDS.BIRTH_TEMPLE}
                    value={editingUser[USER_FIELDS.BIRTH_TEMPLE] || ""}
                    onChange={handleModalChange}
                    placeholder="กรอกชื่อวัดเกิด"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">
                    <i className="fas fa-map-marker-alt me-1"></i>
                    ที่อยู่
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name={USER_FIELDS.ADDRESS}
                    value={editingUser[USER_FIELDS.ADDRESS] || ""}
                    onChange={handleModalChange}
                    placeholder="กรอกที่อยู่"
                  />
                </Form.Group>
              </Form>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowModal(false)}
              disabled={loading}
            >
              <i className="fas fa-times me-1"></i>
              ยกเลิก
            </Button>
            <Button variant="primary" onClick={handleSave} disabled={loading}>
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-1" />
                  กำลังบันทึก...
                </>
              ) : (
                <>
                  <i className="fas fa-save me-1"></i>
                  บันทึกการเปลี่ยนแปลง
                </>
              )}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>{" "}
    </div>
  );
}
