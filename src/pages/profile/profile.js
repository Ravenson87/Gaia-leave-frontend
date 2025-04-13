import React, {useEffect, useState} from 'react';
import {Briefcase, Calendar, Clock, Database, Eye, EyeOff, Mail, Server, Settings, Shield, User} from 'lucide-react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {getUserById, updateUploadProfileImage, updateUserPassword} from "../../api/user";
import Cookies from "universal-cookie";
import {jwtDecode} from "jwt-decode";
import GaiaLeaveLanding from "./GaiaLeaveLanding";
import ImageUploadField from "./ImageUploadFile";
import VacationBooking from "./VacationBooking";
import {validatePassword} from "../../helper/validation/Validation";
import {freeDaysBookingReadByUserId, getCalendar} from "../../api/day-off-management/dayOffManagement";

const UserProfile = () => {
  const cookies = new Cookies();

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [superAdmin, setSuperAdmin] = useState(false);
  const [userData, setUserData] = useState(null);
  const [freeDaysBookingData, setFreeDaysBooking] = useState([]);
  const [calendarData, setCalendarData] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordFeedback, setPasswordFeedback] = useState({
    type: '',
    message: ''
  });

  useEffect(() => {
    get();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

    if (passwordFeedback.message) {
      setPasswordFeedback({type: '', message: ''});
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationMessagePassword = "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character";
    if (validatePassword(formData.newPassword)) {
      setPasswordFeedback({type: 'danger', message: validationMessagePassword});
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setPasswordFeedback({
        type: 'danger',
        message: 'New passwords do not match'
      });
      return;
    }

    setIsSubmitting(true);
    updateUserPassword(userData.id, formData.currentPassword, formData.newPassword)
      .then(() => {
        setPasswordFeedback({
          type: 'success',
          message: 'Password updated successfully!'
        });
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      })
      .catch(error => {
        setPasswordFeedback({
          type: 'danger',
          message: error.message || 'Failed to update password'
        });
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const handleVacationBooking = () => {
    if (userData) {
      get();
    }

  };

  function get() {

    const token = cookies.get('token')
    const jwtDecodeToken = jwtDecode(token);

    if (jwtDecodeToken.role === "super_admin") {
      setSuperAdmin(true);
    } else {
      setSuperAdmin(false);
      getUserById(jwtDecodeToken?.id).then((data) => {
        setUserData(data.data)
      })

      freeDaysBookingReadByUserId(jwtDecodeToken?.id).then((res) => {
        if (res.status === 200) {
          setFreeDaysBooking(res.data)
        }
      })

      getCalendar().then(r => {
        if (r.status === 200) {
          setCalendarData(r.data);
        }
      })
    }
  }

  function onImageChange(file) {
    const token = cookies.get('token')
    const jwtDecodeToken = jwtDecode(token);
    updateUploadProfileImage(file, jwtDecodeToken?.id);
  }

  const ProgressCircle = ({value, total, color, label, unit}) => {
    const percentage = total > 0 ? (value / total) * 100 : 0;
    const circumference = 2 * Math.PI * 40;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="text-center">
        <div style={{width: '140px', height: '140px', margin: '0 auto', position: 'relative'}}>
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
              stroke={color}
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              transform="rotate(-90 50 50)"
              style={{transition: 'all 0.7s ease-out'}}
            />

            <text
              x="50"
              y="45"
              textAnchor="middle"
              fontSize="16"
              fontWeight="bold"
              fill="#212529"
            >
              {value}
            </text>

            <text
              x="50"
              y="65"
              textAnchor="middle"
              fontSize="12"
              fill="#6c757d"
            >
              {unit}
            </text>
          </svg>
        </div>
        <p className="mt-2 text-secondary small">
          {label} <span className="fw-bold">{value}</span> out of <span className="fw-bold">{total}</span> {unit}
        </p>
      </div>
    );
  };

  if (superAdmin) {
    return (
      <div className="bg-light min-vh-100 py-4">
        <div className="position-relative mb-5">
          <div
            className="position-absolute w-100 h-100"
            style={{
              background: 'linear-gradient(135deg, #4b6cb7 0%, #182848 100%)',
              opacity: 0.85
            }}
          ></div>

          <div className="container-fluid py-5 position-relative">
            <div className="row align-items-center">
              <div className="col-md-1 col-sm-2 text-center mb-3 mb-sm-0">
                <div className="bg-white rounded-circle p-3 d-inline-flex shadow">
                  <Shield className="text-primary" size={40}/>
                </div>
              </div>
              <div className="col">
                <h2 className="text-white fs-2 fw-bold mb-2">System Administrator Access</h2>
                <p className="text-white mb-0 opacity-90">
                  You have privileged access to all system functions and resources
                </p>
              </div>
            </div>
          </div>

          <div className="position-absolute bottom-0 end-0 d-none d-lg-block" style={{opacity: 0.2}}>
            <Database size={100} className="text-white mb-n3 me-4"/>
          </div>
          <div className="position-absolute top-0 start-0 d-none d-lg-block" style={{opacity: 0.1}}>
            <Server size={160} className="text-white mt-n5 ms-5"/>
          </div>
        </div>
        <div className="container">
          <GaiaLeaveLanding/>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-light min-vh-100 pb-5">
      <div className="position-relative mb-4">
        <div
          className="position-absolute w-100 h-100"
          style={{
            background: 'linear-gradient(to right, #4b79a1, #283e51)',
            opacity: 0.9
          }}
        ></div>

        <div className="container-fluid py-5 position-relative">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-auto">
                <div className="bg-white p-1 rounded-circle shadow mb-3 mb-md-0"
                     style={{width: '90px', height: '90px'}}>
                  {userData && userData.profile_image ? (
                    <img
                      src={userData.profile_image}
                      alt="Profile"
                      className="w-100 h-100 rounded-circle object-fit-cover"
                    />
                  ) : (
                    <div
                      className="w-100 h-100 d-flex align-items-center justify-content-center bg-light rounded-circle">
                      <User size={40} className="text-secondary"/>
                    </div>
                  )}
                </div>
              </div>
              <div className="col">
                <h1 className="text-white fs-3 fw-bold mb-1">
                  {userData?.first_name} {userData?.last_name}
                </h1>
                <p className="text-white-50 mb-0 d-flex align-items-center">
                  <Mail size={16} className="me-2"/>
                  {userData?.email}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container">

        <div className="mb-4">
          <ul className="nav nav-tabs nav-fill border-0">
            <li className="nav-item">
              <button
                className={`nav-link border-0 rounded-top ${activeTab === 'overview' ? 'active bg-white shadow-sm' : 'bg-light text-secondary'}`}
                onClick={() => setActiveTab('overview')}
              >
                <div className="d-flex align-items-center justify-content-center">
                  <User size={18} className="me-2"/>
                  <span>Overview</span>
                </div>
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link border-0 rounded-top ${activeTab === 'vacation' ? 'active bg-white shadow-sm' : 'bg-light text-secondary'}`}
                onClick={() => setActiveTab('vacation')}
              >
                <div className="d-flex align-items-center justify-content-center">
                  <Calendar size={18} className="me-2"/>
                  <span>Vacation</span>
                </div>
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link border-0 rounded-top ${activeTab === 'settings' ? 'active bg-white shadow-sm' : 'bg-light text-secondary'}`}
                onClick={() => setActiveTab('settings')}
              >
                <div className="d-flex align-items-center justify-content-center">
                  <Settings size={18} className="me-2"/>
                  <span>Settings</span>
                </div>
              </button>
            </li>
          </ul>
        </div>

        {activeTab === 'overview' && (
          <>
            <div className="card mb-4 shadow-sm border-0 rounded-3 overflow-hidden">
              <div className="card-header bg-white border-bottom py-3">
                <div className="d-flex align-items-center">
                  <Briefcase size={20} className="text-primary me-2"/>
                  <h2 className="card-title h5 fw-bold mb-0">Work Status</h2>
                </div>
              </div>

              <div className="card-body p-4">
                <div className="row g-4 align-items-center">
                  <div className="col-lg-4">
                    {userData && <ImageUploadField onImageChange={onImageChange} data={userData}/>}
                  </div>

                  <div className="col-md-6 col-lg-4">
                    <div className="card h-100 border bg-white rounded-3 shadow-sm">
                      <div className="card-body p-4">
                        <h3 className="card-title h6 mb-3 d-flex align-items-center">
                          <Clock size={18} className="me-2 text-primary"/>
                          <span className="fw-bold">Overtime</span>
                        </h3>
                        <ProgressCircle
                          value={userData?.userTotalAttendance?.overtime_hours_sum || 0}
                          total={userData?.overtime?.maximum || 0}
                          color="#0d6efd"
                          label="Used"
                          unit="hours"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6 col-lg-4">
                    <div className="card h-100 border bg-white rounded-3 shadow-sm">
                      <div className="card-body p-4">
                        <h3 className="card-title h6 mb-3 d-flex align-items-center">
                          <Calendar size={18} className="me-2 text-success"/>
                          <span className="fw-bold">Vacation Days</span>
                        </h3>
                        <ProgressCircle
                          value={userData?.vacationDays?.used || 0}
                          total={userData?.vacationDays?.total || 0}
                          color="#198754"
                          label="Used"
                          unit="days"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card shadow-sm border-0 rounded-3">
              <div className="card-header bg-white border-bottom py-3">
                <div className="d-flex align-items-center">
                  <User size={20} className="text-primary me-2"/>
                  <h2 className="card-title h5 fw-bold mb-0">Personal Data</h2>
                </div>
              </div>

              <div className="card-body p-4">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label small text-secondary">Full Name</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <User size={16} className="text-secondary"/>
                      </span>
                      <input
                        type="text"
                        className="form-control bg-light border-start-0"
                        value={userData?.first_name + " " + userData?.last_name}
                        readOnly
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small text-secondary">Username</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <User size={16} className="text-secondary"/>
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
                    <label className="form-label small text-secondary">Email Address</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <Mail size={16} className="text-secondary"/>
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
          </>
        )}

        {activeTab === 'vacation' && (
          <div className="card shadow-sm border-0 rounded-3">
            <div className="card-header bg-white border-bottom py-3">
              <div className="d-flex align-items-center">
                <Calendar size={20} className="text-success me-2"/>
                <h2 className="card-title h5 fw-bold mb-0">Vacation Management</h2>
              </div>
            </div>
            <div className="card-body p-4">
              <VacationBooking
                userData={userData}
                onBookVacation={handleVacationBooking}
                freeDaysBookingData={freeDaysBookingData}
                calendarData={calendarData}
              />
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="card shadow-sm border-0 rounded-3">
            <div className="card-header bg-white border-bottom py-3">
              <div className="d-flex align-items-center">
                <Settings size={20} className="text-primary me-2"/>
                <h2 className="card-title h5 fw-bold mb-0">Account Settings</h2>
              </div>
            </div>
            <div className="card-body p-4">
              <form onSubmit={handleSubmit}>
                {passwordFeedback.message && (
                  <div className={`alert alert-${passwordFeedback.type} alert-dismissible fade show py-2 px-3 mb-4`}
                       role="alert">
                    {passwordFeedback.message}
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setPasswordFeedback({type: '', message: ''})}
                    ></button>
                  </div>
                )}

                <div className="row g-4 justify-content-center">
                  <div className="col-lg-10 col-xl-8">
                    <div className="mb-3">
                      <label className="form-label small text-secondary">Current Password</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0">
                          <Shield size={16} className="text-secondary"/>
                        </span>
                        <input
                          type={showPassword ? "text" : "password"}
                          name="currentPassword"
                          value={formData.currentPassword}
                          onChange={handleChange}
                          className="form-control border-start-0"
                          required
                        />
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff size={16}/> : <Eye size={16}/>}
                        </button>
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label small text-secondary">New Password</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0">
                          <Shield size={16} className="text-secondary"/>
                        </span>
                        <input
                          type={showNewPassword ? "text" : "password"}
                          name="newPassword"
                          value={formData.newPassword}
                          onChange={handleChange}
                          className="form-control border-start-0"
                          required
                        />
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? <EyeOff size={16}/> : <Eye size={16}/>}
                        </button>
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="form-label small text-secondary">Confirm New Password</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0">
                          <Shield size={16} className="text-secondary"/>
                        </span>
                        <input
                          type={showNewPassword ? "text" : "password"}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className="form-control border-start-0"
                          required
                        />
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? <EyeOff size={16}/> : <Eye size={16}/>}
                        </button>
                      </div>
                    </div>

                    <div>
                      <button
                        type="submit"
                        className="btn btn-primary px-4 py-2"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status"
                                  aria-hidden="true"></span>
                            Updating...
                          </>
                        ) : (
                          'Change Password'
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
