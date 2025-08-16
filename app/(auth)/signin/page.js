'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    rememberMe: false
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateForm = () => {
    if (!formData.username.trim()) {
      Swal.fire('Error', 'กรุณากรอกชื่อผู้ใช้', 'error');
      return false;
    }
    if (!formData.password.trim()) {
      Swal.fire('Error', 'กรุณากรอกรหัสผ่าน', 'error');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
          action: 'login'
        }),
      });

      if (response.ok) {
        await response.json();
        
        // Store user data if remember me is checked
        if (formData.rememberMe) {
          localStorage.setItem('user', JSON.stringify({
            username: formData.username,
            rememberMe: true
          }));
        } else {
          sessionStorage.setItem('user', JSON.stringify({
            username: formData.username,
            rememberMe: false
          }));
        }

        await Swal.fire({
          title: 'เข้าสู่ระบบสำเร็จ!',
          text: `ยินดีต้อนรับ ${formData.username}`,
          icon: 'success',
          confirmButtonText: 'ตกลง',
          timer: 2000,
          timerProgressBar: true
        });
        
        router.push('/');
      } else if (response.status === 404) {
        await Swal.fire({
          title: 'ไม่พบผู้ใช้!',
          text: 'กรุณาสมัครสมาชิกก่อนเข้าสู่ระบบ',
          icon: 'warning',
          confirmButtonText: 'ไปสมัครสมาชิก'
        });
        router.push('/signup');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
      }
    } catch (error) {
      console.error('Login error:', error);
      Swal.fire({
        title: 'เข้าสู่ระบบไม่สำเร็จ!',
        text: error.message || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ',
        icon: 'error',
        confirmButtonText: 'ตกลง'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    Swal.fire({
      title: 'ลืมรหัสผ่าน?',
      text: 'กรุณาติดต่อผู้ดูแลระบบเพื่อรีเซ็ตรหัสผ่าน',
      icon: 'info',
      confirmButtonText: 'ตกลง'
    });
  };

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center">
      <div className="row w-100 justify-content-center">
        <div className="col-md-6 col-lg-4 col-xl-3">
          <div className="card shadow-lg border-0">
            <div className="card-header bg-primary text-white text-center py-3">
              <h3 className="mb-0">
                <i className="bi bi-box-arrow-in-right me-2"></i>
                เข้าสู่ระบบ
              </h3>
            </div>
            <div className="card-body p-4">
              <form onSubmit={handleSubmit}>
                {/* Username */}
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">
                    <i className="bi bi-person me-1"></i>
                    ชื่อผู้ใช้
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="bi bi-person"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      placeholder="กรอกชื่อผู้ใช้"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    <i className="bi bi-lock me-1"></i>
                    รหัสผ่าน
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="bi bi-lock"></i>
                    </span>
                    <input
                      type={showPassword ? "text" : "password"}
                      className="form-control"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="กรอกรหัสผ่าน"
                      required
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                    </button>
                  </div>
                </div>

                {/* Remember Me */}
                <div className="mb-3">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="rememberMe"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleInputChange}
                    />
                    <label className="form-check-label" htmlFor="rememberMe">
                      <i className="bi bi-check-circle me-1"></i>
                      จำฉันไว้
                    </label>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="d-grid mb-3">
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        กำลังเข้าสู่ระบบ...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-box-arrow-in-right me-2"></i>
                        เข้าสู่ระบบ
                      </>
                    )}
                  </button>
                </div>

                {/* Links */}
                <div className="text-center">
                  <div className="row">
                    <div className="col-6">
                      <a 
                        href="/signup" 
                        className="text-decoration-none text-primary"
                      >
                        <i className="bi bi-person-plus me-1"></i>
                        สมัครสมาชิก
                      </a>
                    </div>
                    <div className="col-6">
                      <button
                        type="button"
                        className="btn btn-link text-decoration-none text-primary p-0"
                        onClick={handleForgotPassword}
                      >
                        <i className="bi bi-question-circle me-1"></i>
                        ลืมรหัสผ่าน
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Additional Info Card */}
          <div className="card mt-3 border-0 ">
            <div className="card-body text-center py-2">
              <small className="text-muted">
                <i className="bi bi-info-circle me-1"></i>
                ยังไม่มีบัญชี? <a href="/signup" className="text-decoration-none">สมัครสมาชิก</a> ได้เลย
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
