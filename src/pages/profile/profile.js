import React, {useEffect, useState} from 'react';
import {Eye, EyeOff, Mail, User, Calendar, Clock, Shield, X, Sliders, Database, Server, Info} from 'lucide-react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {getUserById, updateUploadProfileImage, updateUserPassword} from "../../api/user";
import Cookies from "universal-cookie";
import {jwtDecode} from "jwt-decode";
import GaiaLeaveLanding from "./GaiaLeaveLanding";
import ImageUploadField from "./ImageUploadFile";

const UserProfile = () => {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [superAdmin, setSuperAdmin] = useState(false);
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    get();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateUserPassword(userData.id, formData.currentPassword, formData.newPassword).then(r => {
      alert('Password change request submitted!');
    })

  };

  function get() {
    const cookies = new Cookies();
    const token = cookies.get('token')
    const jwtDecodeToken = jwtDecode(token);

    if (jwtDecodeToken.role === "super_admin") {
      setSuperAdmin(true);
    } else {
      setSuperAdmin(false);
      getUserById(jwtDecodeToken?.id).then((data) => {
        setUserData(data.data)
      })
    }

  }

  function onImageChange(file) {
    updateUploadProfileImage(file, 2);
  }

  return (
    <>
      {!superAdmin ? (
        <>
          <div className="position-relative mb-5 mt-n3 mx-n4">
            <div className="bg-dark position-absolute w-100 h-100 opacity-75"
                 style={{background: 'linear-gradient(135deg, #3a1c71 0%, #d76d77 50%, #ffaf7b 100%)'}}></div>

            <div className="container-fluid py-4 position-relative">
              <div className="row align-items-center">
                <div className="col-md-1 col-sm-2 text-center mb-3 mb-sm-0">
                  <div className="bg-white rounded-circle p-3 d-inline-flex shadow">
                    <Shield className="text-primary" size={32}/>
                  </div>
                </div>
                <div className="col-md-7 col-sm-10">
                  <h2 className="text-white fs-4 mb-1">System Administrator Access</h2>
                  <p className="text-white mb-0 opacity-90">You have privileged access to all system functions and
                    resources</p>
                </div>
              </div>
            </div>

            <div className="position-absolute bottom-0 end-0 d-none d-lg-block" style={{opacity: '0.2'}}>
              <Database size={80} className="text-white mb-n3 me-4"/>
            </div>
            <div className="position-absolute top-0 start-0 d-none d-lg-block" style={{opacity: '0.1'}}>
              <Server size={120} className="text-white mt-n5 ms-5"/>
            </div>

          </div>
          <GaiaLeaveLanding/>
        </>
      ) : (
        <div className="container py-4">
          <h1 className="mb-4 fw-bold">User Profile</h1>

          <div className="card mb-4 shadow-sm">
            <div className="card-body">
              <h2 className="card-title mb-4">Work Status</h2>

              <div className="row">
                <div className="col-md-3">
                  {userData && <ImageUploadField onImageChange={onImageChange} data={userData}/>}
                </div>
                <div className="col-md-4 mb-4 mb-md-0">
                  <div className="card h-100 border-0">
                    <div className="card-body">
                      <h3 className="card-title h5 mb-3 d-flex align-items-center">
                        <Clock size={20} className="me-2 text-primary"/>
                        Overtime
                      </h3>
                      <div className="text-center">
                        <div style={{width: '180px', height: '180px', margin: '0 auto', position: 'relative'}}>

                          <svg className="w-100 h-100" viewBox="0 0 100 100">

                            <circle
                              cx="50"
                              cy="50"
                              r="40"
                              fill="none"
                              stroke="#e9ecef"
                              strokeWidth="10"
                            />

                            <circle
                              cx="50"
                              cy="50"
                              r="40"
                              fill="none"
                              stroke="#0d6efd"
                              strokeWidth="10"
                              strokeDasharray={`${100 * 2.51} 251`}
                              strokeDashoffset="62.75"
                              transform="rotate(-90 50 50)"
                            />

                            <text
                              x="50"
                              y="45"
                              textAnchor="middle"
                              fontSize="16"
                              fontWeight="bold"
                              fill="#212529"
                            >
                              {userData?.userTotalAttendance?.overtime_hours_sum}
                            </text>

                            <text
                              x="50"
                              y="65"
                              textAnchor="middle"
                              fontSize="12"
                              fill="#6c757d"
                            >
                              hours
                            </text>
                          </svg>
                        </div>

                        <div className="mt-3">
                          <p className="text-secondary">
                            Used <span className="fw-bold">{userData?.overtime?.current}</span> out of
                            a total of <span className="fw-bold">{userData?.overtime?.maximum}</span> overtime hours.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="card h-100 border-0">
                    <div className="card-body">
                      <h3 className="card-title h5 mb-3 d-flex align-items-center">
                        <Calendar size={20} className="me-2 text-success"/>
                        Vacation Days
                      </h3>
                      <div className="text-center">
                        <div style={{width: '180px', height: '180px', margin: '0 auto', position: 'relative'}}>

                          <svg className="w-100 h-100" viewBox="0 0 100 100">

                            <circle
                              cx="50"
                              cy="50"
                              r="40"
                              fill="none"
                              stroke="#e9ecef"
                              strokeWidth="10"
                            />

                            <circle
                              cx="50"
                              cy="50"
                              r="40"
                              fill="none"
                              stroke="#198754"
                              strokeWidth="10"
                              strokeDasharray={`${100 * 2.51} 251`}
                              strokeDashoffset="62.75"
                              transform="rotate(-90 50 50)"
                            />

                            <text
                              x="50"
                              y="45"
                              textAnchor="middle"
                              fontSize="16"
                              fontWeight="bold"
                              fill="#212529"
                            >
                              {userData?.userTotalAttendance?.total_free_days}
                            </text>

                            <text
                              x="50"
                              y="65"
                              textAnchor="middle"
                              fontSize="12"
                              fill="#6c757d"
                            >
                               days
                            </text>
                          </svg>
                        </div>

                        <div className="mt-3">
                          <p className="text-secondary">
                            Used <span className="fw-bold">{userData?.vacationDays?.used}</span> out of
                            a total of <span className="fw-bold">{userData?.vacationDays?.total}</span> vacation days.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-12 row justify-content-between">

            <div className="mb-4 shadow-sm col-md-6 p-2">
              <div className="card" style={{minHeight: '100%'}}>
                <div className="card-body">
                  <h2 className="card-title mb-4">Personal Data</h2>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Full Name</label>
                      <div className="input-group bg-light">
                <span className="input-group-text bg-light border-end-0">
                  <User size={18} className="text-secondary"/>
                </span>
                        <input
                          type="text"
                          className="form-control bg-light border-start-0"
                          value={userData?.first_name + " " + userData?.last_name}
                          readOnly
                        />
                      </div>
                    </div>

                    <div className="col-md-5">
                      <label className="form-label">Username</label>
                      <div className="input-group bg-light">
                <span className="input-group-text bg-light border-end-0">
                  <User size={18} className="text-secondary"/>
                </span>
                        <input
                          type="text"
                          className="form-control bg-light border-start-0"
                          value={userData?.username}
                          readOnly
                        />
                      </div>
                    </div>

                    <div className="col-12">
                      <label className="form-label">Email Address</label>
                      <div className="input-group bg-light">
                <span className="input-group-text bg-light border-end-0">
                  <Mail size={18} className="text-secondary"/>
                </span>
                        <input
                          type="email"
                          className="form-control bg-light border-start-0"
                          value={userData?.email}
                          readOnly
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-4 shadow-sm col-md-6 p-2">
              <div className="card h-100">
                <div className="card-body h-100">
                  <h2 className="card-title mb-4">Change Password</h2>
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label className="form-label">Current Password</label>
                      <div className="input-group">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="currentPassword"
                          value={formData?.currentPassword}
                          onChange={handleChange}
                          className="form-control"
                          required
                        />
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                        </button>
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">New Password</label>
                      <div className="input-group">
                        <input
                          type={showNewPassword ? "text" : "password"}
                          name="newPassword"
                          value={formData.newPassword}
                          onChange={handleChange}
                          className="form-control"
                          required
                        />
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                        </button>
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Confirm New Password</label>
                      <div className="input-group">
                        <input
                          type={showNewPassword ? "text" : "password"}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className="form-control"
                          required
                        />
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                        </button>
                      </div>
                    </div>

                    <div className="d-grid mt-4">
                      <button
                        type="submit"
                        className="btn btn-primary"
                      >
                        Change Password
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserProfile;
