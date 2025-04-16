import React, {useEffect, useState} from 'react';
import {Button, Card, Form, Modal} from 'react-bootstrap';
import {Briefcase, Calendar, Camera, Check, Mail, Pencil, Phone, ToggleLeft, ToggleRight} from 'lucide-react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/bootstrap.css';
import {updateUser, updateUserStatus} from "../../../api/user";

const UserProfile = ({
                       user,
                       editMode,
                       toggleEditMode,
                       handleInputChange,
                       saveChanges,
                       handleProfileImageChange,
                       jobPositionData,
                       roleData,
                       setToastMessage,
                       setShowToast
                     }) => {
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [errors, setErrors] = useState({});
  const [localUser, setLocalUser] = useState(null);

  useEffect(() => {
    if (user) {
      const updatedUser = {...user};

      if (updatedUser.job_position_id && typeof updatedUser.job_position_id === 'string') {
        updatedUser.job_position_id = parseInt(updatedUser.job_position_id, 10);
      }

      if (updatedUser.role_id && typeof updatedUser.role_id === 'string') {
        updatedUser.role_id = parseInt(updatedUser.role_id, 10);
      }

      setLocalUser(updatedUser);
    }
  }, [user]);


  const handleLocalInputChange = (section, field, value) => {

    setLocalUser(prev => ({
      ...prev,
      [field]: value
    }));

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }

    handleInputChange(section, field, value);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US');
  };

  const getInitials = () => {
    if (!localUser?.first_name && !localUser?.last_name) return '?';
    return `${localUser?.first_name?.charAt(0) || ''}${localUser?.last_name?.charAt(0) || ''}`;
  };

  const handleStatusToggle = () => {
    setShowStatusModal(true);
  };

  const confirmStatusChange = () => {
    handleLocalInputChange('personalInfo', 'status', !localUser?.status);
    updateUserStatus(localUser.id, !localUser?.status).then((r) => {
      if (r.status === 200) {
        showNotification(`User ${!localUser?.status ? 'activated' : 'deactivated'} successfully`);
      }
    });
    setShowStatusModal(false);
  };

  const showNotification = (message) => {
    setToastMessage(message);
    setShowToast(true);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!localUser?.first_name?.trim()) {
      newErrors.first_name = 'First name is required';
    }

    if (!localUser?.last_name?.trim()) {
      newErrors.last_name = 'Last name is required';
    }

    if (!localUser?.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(localUser?.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!localUser?.username?.trim()) {
      newErrors.username = 'Username is required';
    }

    if (!localUser?.role_id) {
      newErrors.role_id = 'Role is required';
    }

    if (!localUser?.job_position_id) {
      newErrors.job_position_id = 'Job position is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveChanges = (section) => {

    const obj = {
      id: localUser.id,
      first_name: localUser.first_name,
      last_name: localUser.last_name,
      email: localUser.email,
      username: localUser.username,
      role_id: Number(localUser.role_id),
      job_position_id: Number(localUser.job_position_id),
      status: localUser.status,
      date_of_birth: localUser.date_of_birth,
      personal_holiday: localUser.personal_holiday
    };

    if (section === 'personalInfo') {
      if (!validateForm()) {
        showNotification('Please fix the errors before saving');
        return;
      }

      updateUser(obj).then((res) => {
        if (res.status === 200) {
          saveChanges(section);
          showNotification(`${section === 'personalInfo' ? 'Personal information' : 'Contact information'} saved successfully`);
        }
      }).catch(err => {
        showNotification('Error saving changes');
      });
    } else {
      const emailErrors = {};
      if (!localUser?.email?.trim()) {
        emailErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(localUser?.email)) {
        emailErrors.email = 'Email is invalid';
      }

      setErrors(emailErrors);

      if (Object.keys(emailErrors).length === 0) {
        if (localUser?.phone) {
          obj.phone = localUser.phone;
        }
        updateUser(obj).then((res) => {
          if (res.status === 200) {
            saveChanges(section);
            showNotification(`${section === 'personalInfo' ? 'Personal information' : 'Contact information'} saved successfully`);
          }
        }).catch(err => {
          showNotification('Error saving changes');
        });
      } else {
        showNotification('Please fix the errors before saving');
      }
    }
  };

  const getJobPositionName = (id) => {
    if (!id || !jobPositionData) return 'Not specified';
    const position = jobPositionData.find(pos => pos.id === Number(id));
    return position ? position.title : 'Not specified';
  };

  const getRoleName = (id) => {
    if (!id || !roleData) return 'Not specified';
    const role = roleData.find(r => r.id === Number(id));
    return role ? role.name : 'Not specified';
  };

  if (!localUser) {
    return <div className="text-center p-5">Loading user data...</div>;
  }

  return (
    <div className="row mb-4 g-4 position-relative">

      <Modal
        show={showStatusModal}
        onHide={() => setShowStatusModal(false)}
        centered
        backdrop="static"
      >
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title>Confirm Status Change</Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-2">
          <div className="text-center mb-3">
            {localUser?.status ? (
              <div className="text-danger mb-3" style={{fontSize: '48px'}}>
                <ToggleLeft size={64}/>
              </div>
            ) : (
              <div className="text-success mb-3" style={{fontSize: '48px'}}>
                <ToggleRight size={64}/>
              </div>
            )}
            <p className="mb-0">
              Are you sure you want to <strong>{localUser?.status ? 'deactivate' : 'activate'}</strong> this user?
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0">
          <Button variant="outline-secondary" onClick={() => setShowStatusModal(false)}>
            Cancel
          </Button>
          <Button variant={localUser?.status ? "outline-danger" : "outline-success"} onClick={confirmStatusChange}>
            {localUser?.status ? 'Deactivate User' : 'Activate User'}
          </Button>
        </Modal.Footer>
      </Modal>

      <div className="col-md-4">
        <Card className="shadow-sm border-0 h-100">
          <Card.Body className="text-center p-4">
            <div className="position-relative d-inline-block mb-4">
              {localUser?.profile_image ? (
                <img
                  src={localUser.profile_image}
                  alt="Profile"
                  className="rounded-circle img-thumbnail shadow"
                  style={{
                    width: '160px',
                    height: '160px',
                    objectFit: 'cover',
                    borderWidth: '3px'
                  }}
                />
              ) : (
                <div
                  className="rounded-circle img-thumbnail shadow d-flex align-items-center justify-content-center bg-primary text-white"
                  style={{
                    width: '160px',
                    height: '160px',
                    borderWidth: '3px',
                    fontSize: '48px',
                    fontWeight: 'bold'
                  }}
                >
                  {getInitials()}
                </div>
              )}
              <div className="position-absolute bottom-0 end-0">
                <label
                  className="btn btn-primary rounded-circle shadow-sm"
                  style={{
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0'
                  }}
                >
                  <Camera size={20}/>
                  <input
                    type="file"
                    className="d-none"
                    onChange={handleProfileImageChange}
                    accept="image/*"
                  />
                </label>
              </div>
            </div>
            <h3 className="fw-bold mb-1">{localUser?.first_name} {localUser?.last_name}</h3>
            <p className="text-muted mb-3">{localUser?.role?.name || getRoleName(localUser?.role_id)}</p>

            <div className="border rounded-3 p-3 mb-2">
              <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center">
                  <div className={`bg-${localUser?.status ? 'success' : 'danger'} rounded-circle me-2 p-1`}>
                    <div className="bg-white rounded-circle" style={{width: '6px', height: '6px'}}></div>
                  </div>
                  <span className="fw-medium">Account Status:</span>
                  <span className={`ms-2 badge ${localUser?.status ? 'bg-success' : 'bg-danger'}`}>
                    {localUser?.status ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <Button
                  variant={localUser?.status ? "outline-danger" : "outline-success"}
                  size="sm"
                  className="rounded-pill px-3 d-flex align-items-center"
                  onClick={handleStatusToggle}
                  aria-label={localUser?.status ? "Deactivate user" : "Activate user"}
                >
                  {localUser?.status ?
                    <><ToggleRight size={18} className="me-1"/> Deactivate</> :
                    <><ToggleLeft size={18} className="me-1"/> Activate</>
                  }
                </Button>
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>

      <div className="col-md-8">
        <Card className="mb-4 shadow-sm border-0">
          <Card.Header className="bg-white border-bottom-0 pt-4 pb-0 px-4">
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0 fw-bold">Personal data</h5>
              <Button
                variant={editMode.personalInfo ? "success" : "outline-primary"}
                size="sm"
                className="rounded-pill px-3"
                onClick={() => editMode.personalInfo ? handleSaveChanges('personalInfo') : toggleEditMode('personalInfo')}
              >
                {editMode.personalInfo ? <Check size={16} className="me-1"/> : <Pencil size={16} className="me-1"/>}
                {editMode.personalInfo ? 'Save' : 'Edit'}
              </Button>
            </div>
          </Card.Header>
          <Card.Body className="px-4 py-4">
            <div className="row">
              <div className="col-md-6 mb-3">
                <Form.Group>
                  <Form.Label className="text-muted small mb-1">First name</Form.Label>
                  {editMode.personalInfo ? (
                    <>
                      <Form.Control
                        type="text"
                        value={localUser?.first_name || ''}
                        className={`border-0 bg-light rounded-3 ${errors.first_name ? 'is-invalid' : ''}`}
                        onChange={(e) => handleLocalInputChange('personalInfo', 'first_name', e.target.value)}
                      />
                      {errors.first_name && (
                        <div className="invalid-feedback d-block mt-1 ms-1 small text-danger">
                          {errors.first_name}
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="form-control-plaintext fw-medium">{localUser?.first_name}</p>
                  )}
                </Form.Group>
              </div>
              <div className="col-md-6 mb-3">
                <Form.Group>
                  <Form.Label className="text-muted small mb-1">Last name</Form.Label>
                  {editMode.personalInfo ? (
                    <>
                      <Form.Control
                        type="text"
                        value={localUser?.last_name || ''}
                        className={`border-0 bg-light rounded-3 ${errors.last_name ? 'is-invalid' : ''}`}
                        onChange={(e) => handleLocalInputChange('personalInfo', 'last_name', e.target.value)}
                      />
                      {errors.last_name && (
                        <div className="invalid-feedback d-block mt-1 ms-1 small text-danger">
                          {errors.last_name}
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="form-control-plaintext fw-medium">{localUser?.last_name}</p>
                  )}
                </Form.Group>
              </div>
              <div className="col-md-6 mb-3">
                <Form.Group>
                  <Form.Label className="text-muted small mb-1">Username</Form.Label>
                  {editMode.personalInfo ? (
                    <>
                      <Form.Control
                        type="text"
                        value={localUser?.username || ''}
                        className={`border-0 bg-light rounded-3 ${errors.username ? 'is-invalid' : ''}`}
                        onChange={(e) => handleLocalInputChange('personalInfo', 'username', e.target.value)}
                      />
                      {errors.username && (
                        <div className="invalid-feedback d-block mt-1 ms-1 small text-danger">
                          {errors.username}
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="form-control-plaintext fw-medium">{localUser?.username}</p>
                  )}
                </Form.Group>
              </div>
              <div className="col-md-6 mb-3">
                <Form.Group>
                  <Form.Label className="text-muted small mb-1">Date of birth</Form.Label>
                  {editMode.personalInfo ? (
                    <>
                      <Form.Control
                        type="date"
                        value={localUser?.date_of_birth || ''}
                        className="border-0 bg-light rounded-3"
                        onChange={(e) => handleLocalInputChange('personalInfo', 'date_of_birth', e.target.value)}
                      />
                    </>
                  ) : (
                    <p className="form-control-plaintext fw-medium">
                      <Calendar size={16} className="text-primary me-2"/>
                      {formatDate(localUser?.date_of_birth)}
                    </p>
                  )}
                </Form.Group>
              </div>
              <div className="col-md-6 mb-3">
                <Form.Group>
                  <Form.Label className="text-muted small mb-1">Personal holiday</Form.Label>
                  {editMode.personalInfo ? (
                    <>
                      <Form.Control
                        type="date"
                        value={localUser?.personal_holiday || ''}
                        className="border-0 bg-light rounded-3"
                        onChange={(e) => handleLocalInputChange('personalInfo', 'personal_holiday', e.target.value)}
                      />
                    </>
                  ) : (
                    <p className="form-control-plaintext fw-medium">
                      <Calendar size={16} className="text-primary me-2"/>
                      {formatDate(localUser?.personal_holiday)}
                    </p>
                  )}
                </Form.Group>
              </div>
              <div className="col-md-6 mb-3">
                <Form.Group>
                  <Form.Label className="text-muted small mb-1">Job position</Form.Label>
                  {editMode.personalInfo ? (
                    <>
                      <Form.Select
                        value={localUser?.job_position_id !== undefined ? Number(localUser.job_position_id) : ''}
                        className={`border-0 bg-light rounded-3 ${errors.job_position_id ? 'is-invalid' : ''}`}
                        onChange={(e) => handleLocalInputChange('personalInfo', 'job_position_id', e.target.value ? Number(e.target.value) : '')}
                      >
                        <option value="">Select position</option>
                        {jobPositionData && jobPositionData.map(position => (
                          <option key={position.id} value={position.id}>
                            {position.title}
                          </option>
                        ))}
                      </Form.Select>
                      {errors.job_position_id && (
                        <div className="invalid-feedback d-block mt-1 ms-1 small text-danger">
                          {errors.job_position_id}
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="form-control-plaintext fw-medium">
                      <Briefcase size={16} className="text-primary me-2"/>
                      {localUser?.job_position?.title || getJobPositionName(localUser?.job_position_id)}
                    </p>
                  )}
                </Form.Group>
              </div>
              <div className="col-md-6 mb-3">
                <Form.Group>
                  <Form.Label className="text-muted small mb-1">Role</Form.Label>
                  {editMode.personalInfo ? (
                    <>
                      <Form.Select
                        value={localUser?.role_id !== undefined ? Number(localUser.role_id) : ''}
                        className={`border-0 bg-light rounded-3 ${errors.role_id ? 'is-invalid' : ''}`}
                        onChange={(e) => handleLocalInputChange('personalInfo', 'role_id', e.target.value ? Number(e.target.value) : '')}
                      >
                        <option value="">Select role</option>
                        {roleData && roleData.map(role => (
                          <option key={role.id} value={role.id}>
                            {role.name}
                          </option>
                        ))}
                      </Form.Select>
                      {errors.role_id && (
                        <div className="invalid-feedback d-block mt-1 ms-1 small text-danger">
                          {errors.role_id}
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="form-control-plaintext fw-medium">
                      {localUser?.role?.name || getRoleName(localUser?.role_id)}
                    </p>
                  )}
                </Form.Group>
              </div>
            </div>
          </Card.Body>
        </Card>

        <Card className="shadow-sm border-0">
          <Card.Header className="bg-white border-bottom-0 pt-4 pb-0 px-4">
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0 fw-bold">Contact Info</h5>
              <Button
                variant={editMode.contactInfo ? "success" : "outline-primary"}
                size="sm"
                className="rounded-pill px-3"
                onClick={() => editMode.contactInfo ? handleSaveChanges('contactInfo') : toggleEditMode('contactInfo')}
              >
                {editMode.contactInfo ? <Check size={16} className="me-1"/> : <Pencil size={16} className="me-1"/>}
                {editMode.contactInfo ? 'Save' : 'Edit'}
              </Button>
            </div>
          </Card.Header>
          <Card.Body className="px-4 py-4">
            <div className="row">
              <div className="col-md-6 mb-3">
                <Form.Group>
                  <Form.Label className="text-muted small mb-1">Email</Form.Label>
                  {editMode.contactInfo ? (
                    <>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-0">
                          <Mail size={16} className="text-muted"/>
                        </span>
                        <Form.Control
                          type="email"
                          value={localUser?.email || ''}
                          className={`border-0 bg-light ${errors.email ? 'is-invalid' : ''}`}
                          onChange={(e) => handleLocalInputChange('contactInfo', 'email', e.target.value)}
                        />
                      </div>
                      {errors.email && (
                        <div className="invalid-feedback d-block mt-1 ms-1 small text-danger">
                          {errors.email}
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="form-control-plaintext fw-medium">
                      <Mail size={16} className="text-primary me-2"/>
                      {localUser?.email}
                    </p>
                  )}
                </Form.Group>
              </div>
              <div className="col-md-6 mb-3">
                <Form.Group>
                  <Form.Label className="text-muted small mb-1">Phone</Form.Label>
                  {editMode.contactInfo ? (
                    <>
                      <div className="phone-input-container" style={{maxHeight: '38px'}}>
                        <PhoneInput
                          country={'us'}
                          value={localUser?.phone || ''}
                          onChange={(value) => handleLocalInputChange('contactInfo', 'phone', value)}
                          containerClass="phone-input"
                          inputClass={`form-control border-0 bg-light phone-input-field ${errors.phone ? 'is-invalid' : ''}`}
                          buttonClass="bg-light border-0 phone-input-button"
                          buttonStyle={{borderRadius: '6px 0 0 6px'}}
                          inputStyle={{height: '38px', width: '100%'}}
                          containerStyle={{height: '38px'}}
                        />
                      </div>
                      {errors.phone && (
                        <div className="invalid-feedback d-block mt-1 ms-1 small text-danger">
                          {errors.phone}
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="form-control-plaintext fw-medium">
                      <Phone size={16} className="text-primary me-2"/>
                      {localUser?.phone || 'Not specified'}
                    </p>
                  )}
                </Form.Group>
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>

      <style jsx>{`
        .phone-input {
          width: 100% !important;
        }

        .phone-input .form-control {
          height: 38px !important;
          width: 100% !important;
        }

        .phone-input .flag-dropdown {
          height: 38px !important;
        }

        .phone-input-container .react-tel-input .selected-flag {
          height: 38px !important;
          padding: 0 0 0 8px !important;
        }

        .phone-input-container .react-tel-input .flag-dropdown.open .selected-flag {
          border-radius: 6px 0 0 0 !important;
        }

        .phone-input-container .react-tel-input .form-control {
          padding-top: 0 !important;
          padding-bottom: 0 !important;
        }
      `}</style>
    </div>
  );
};

export default UserProfile;
