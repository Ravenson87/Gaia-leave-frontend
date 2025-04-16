import React, {useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Alert, Button, Card, Form, Modal, Toast} from 'react-bootstrap';
import {Check} from 'lucide-react';
import UserProfile from "../profile/profile/UserProfile";
import {DocumentsCard} from "../profile/profile/DocumentCard";
import {StatisticsCards} from "../profile/profile/StaticsCard";
import OvertimeHoursCard from "../profile/profile/OvertimeHoursCard";
import FreeDaysCard from "../profile/profile/FreeDaysCard";
import {Box, CardContent, Tab, Tabs} from "@mui/material";
import {Group, Settings, Today} from "@mui/icons-material";
import {
  createUserTotalAttendance,
  documentDelete,
  documentUpload,
  updateUploadProfileImage,
  updateUserTotalAttendance
} from "../../api/user";
import {
  createOvertimeHours,
  createUserUsedFreeDays,
  deleteOvertimeHours,
  deleteUserUsedFreeDaysById,
  subtractDaysFromFreeDays
} from "../../api/day-off-management/dayOffManagement";

function ProfileDaysOff({userData, freeDayTypes, jobPositionData, roleData, calendarData, setVisible, get}) {
  const [activeTab, setActiveTab] = useState(0);
  const [overtimeEntry, setOvertimeEntry] = useState({
    date: '',
    hours: '',
    status: ''
  });
  const [freeDaysEntry, setFreeDaysEntry] = useState(parseFloat(userData?.userTotalAttendance?.total_free_days));
  const [workingHoursEntry, setWorkingHoursEntry] = useState(parseFloat(userData?.userTotalAttendance?.total_working_hours));
  const [user, setUser] = useState(userData);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('')


  const [itemToDelete, setItemToDelete] = useState({
    id: null,
    type: null
  });

  const [editMode, setEditMode] = useState({
    personalInfo: false,
    contactInfo: false
  });

  const [showModal, setShowModal] = useState({
    document: false,
    freeDay: false,
    overtime: false,
    overtimeEntry: false,
    addFreeDaysModal: false,
    addWorkingHoursModal: false,
    convertOvertimeModal: false,
    deleteConfirmation: false
  });

  const [newDocument, setNewDocument] = useState(null);

  const [newFreeDay, setNewFreeDay] = useState({
    date: "",
    type_id: ""
  });

  const [overtimeConversion, setOvertimeConversion] = useState({
    hours: 0,
    conversionType: "free_day"
  });

  const confirmDelete = (id, type) => {
    setItemToDelete({id, type});
    setShowModal({...showModal, deleteConfirmation: true});
  };


  const handleConfirmedDelete = async () => {
    const {id, type} = itemToDelete;

    if (type === 'document') {
      const res = await documentDelete(id);
      if (res.status === 200) {
        setToastMessage('Successfully deleted');
        setShowToast(true)
        setUser(prev => ({
          ...prev,
          userDocuments: prev.userDocuments.filter(doc => doc.id !== id)
        }));
      } else {
        setToastMessage(res.response.data.message);
        setShowToast(true)
      }
    } else if (type === 'freeDay') {
      const res = await deleteUserUsedFreeDaysById(id);
      if (res.status === 200) {
        setToastMessage('Successfully deleted');
        setShowToast(true)
        setUser(prev => ({
          ...prev,
          userUsedFreeDays: prev.userUsedFreeDays.filter(day => day.id !== id),
          userTotalAttendance: {
            ...prev.userTotalAttendance,
            total_free_days: prev.userTotalAttendance.total_free_days - 1
          }
        }));
      } else {
        setToastMessage(res.response.data.message);
        setShowToast(true)
      }
    } else if (type === 'overtime') {
      const res = await deleteOvertimeHours(id);
      const overtimeToRemove = user.overtimeHours.find(oh => oh.id === id);
      if (overtimeToRemove) {
        if (res.status === 200) {
          setToastMessage('Successfully deleted');
          setShowToast(true)
          setUser(prev => ({
            ...prev,
            overtimeHours: prev.overtimeHours.filter(oh => oh.id !== id),
            userTotalAttendance: {
              ...prev.userTotalAttendance,
              overtime_hours_sum: prev.userTotalAttendance?.overtime_hours_sum - overtimeToRemove.hours
            }
          }));
        } else {
          setToastMessage(res.response.data.message);
          setShowToast(true)
        }
      }
    }

    setShowModal({...showModal, deleteConfirmation: false});
    setItemToDelete({id: null, type: null});
  };

  const handleOvertimeEntry = async () => {
    const calendarId = calendarData.find((item) => item.date === overtimeEntry.date);
    const json = [
      {
        user_id: user.id,
        calendar_id: calendarId.id,
        overtime_hours: parseFloat(overtimeEntry.hours)
        // overtime_hours: (overtimeEntry.status === 'positive' ? '+' : '-') + overtimeEntry.hours
      }
    ]
    const res = await createOvertimeHours(json)
    if (res.status === 200) {
      setToastMessage('Successfully created');
      setShowToast(true)
      setUser(prev => ({
        ...prev,
        overtimeHours: [...prev.overtimeHours, res.data[0]]
      }));
    } else {
      setToastMessage(res?.response?.data?.message);
      setShowToast(true)
    }
    setShowModal({...showModal, overtimeEntry: false});
    setOvertimeEntry({date: '', hours: '', status: ''});
  };

  const handelAddUserUsedFreeDays = () => {
    const calendarId = calendarData.find((item) => item.date === newFreeDay.date)
    const freeDayType = freeDayTypes.find((item) => item.id === newFreeDay.type_id)
    if (calendarId) {
      createUserUsedFreeDays([{
        user_id: user.id,
        calendar_id: calendarId.id,
        free_day_type_id: parseInt(freeDayType.id)
      }]).then((res) => {
        setShowModal({...showModal, freeDay: false})
        if (res.status === 200) {
          setUser(prevData => ({
            ...prevData,
            userUsedFreeDays: [...prevData.userUsedFreeDays, res.data[0]]
          }));
        } else {
          console.log(res?.response?.data?.message, "sssssssssss");
        }
      })
    }
  };

  const handleInputChange = (section, field, value) => {
    setUser(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const toggleEditMode = (section) => {
    setEditMode(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const saveChanges = (section) => {
    toggleEditMode(section);
  };

  const handleDocumentUpload = () => {
    documentUpload(userData.id, newDocument).then(response => {
      setShowModal({...showModal, document: false})
      if (response.status === 201) {
        setUser(prevUser => ({
          ...prevUser,
          userDocuments: [...prevUser.userDocuments, response.data]
        }));
        setToastMessage("Saved successfully.");
        setShowToast(true);
      } else {
        setToastMessage(response?.response?.data?.message || 'Error. Something went wrong.');
        setShowToast(true);
      }
    });
  };

  const handleOvertimeConversion = () => {
    const hoursToConvert = parseInt(overtimeConversion.hours);
    subtractDaysFromFreeDays()
    if (hoursToConvert > 0 && hoursToConvert <= user?.userTotalAttendance?.overtime_hours_sum) {
      if (overtimeConversion.conversionType === "free_day") {

        const daysToAdd = Math.floor(hoursToConvert / 8);

        if (daysToAdd > 0) {
          setUser(prev => ({
            ...prev,
            userTotalAttendance: {
              ...prev.userTotalAttendance,
              total_free_days: prev.userTotalAttendance.total_free_days + daysToAdd,
              overtime_hours_sum: prev.userTotalAttendance?.overtime_hours_sum - (daysToAdd * 8)
            }
          }));
        }
      } else {

        setUser(prev => ({
          ...prev,
          userTotalAttendance: {
            ...prev.userTotalAttendance,
            overtime_hours_sum: prev.userTotalAttendance?.overtime_hours_sum - hoursToConvert
          }
        }));
      }

      setOvertimeConversion({
        hours: 0,
        conversionType: "free_day"
      });

      setShowModal({...showModal, convertOvertimeModal: false});
    }
  };

  const removeDocument = (docId) => {
    confirmDelete(docId, 'document');
  };

  const removeFreeDay = (freeDayId) => {
    confirmDelete(freeDayId, 'freeDay');
  };

  const removeOvertime = (overtimeId) => {
    confirmDelete(overtimeId, 'overtime');
  };

  const formatDate = (dateString) => {
    const options = {year: 'numeric', month: 'long', day: 'numeric'};
    return new Date(dateString).toLocaleDateString('sr-RS', options);
  };

  const handleAddFreeDays = () => {

    const updated = {
      ...user,
      userTotalAttendance: {
        ...user.userTotalAttendance,
        total_free_days: freeDaysEntry
      },
    };
    setUser(updated);

    saveData(freeDaysEntry, user?.userTotalAttendance?.total_working_hours || userData?.userTotalAttendance?.total_working_hours)
  };

  const handleAddWorkingHours = () => {
    const updated = {
      ...user,
      userTotalAttendance: {
        ...user.userTotalAttendance,
        total_working_hours: parseFloat(workingHoursEntry)
      }
    };
    setUser(updated);
    saveData(user.userTotalAttendance.total_free_days || userData.userTotalAttendance.total_free_days, workingHoursEntry)
  };

  const saveData = async (totalFreeDays, totalWorkingHours) => {
    if (totalFreeDays === "" || totalWorkingHours === "") {
      return;
    }

    const jsonData = {
      user_id: userData?.id,
      total_free_days: totalFreeDays,
      total_working_hours: totalWorkingHours
    };

    try {
      const response = !userData?.userTotalAttendance?.total_free_days ? await createUserTotalAttendance(jsonData) : await updateUserTotalAttendance(jsonData, user?.userTotalAttendance?.id);
      if (response.status === 201 || 200) {
        setToastMessage(!userData?.userTotalAttendance?.total_free_days ? "Successfully created." : "Successfully updated.");
        setShowToast(true)
      } else {
        setToastMessage(response?.response?.data?.message)
        setShowToast(true)
      }
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateUploadProfileImage(file, userData.id).then((res) => {
          if (res.status === 200) {
            setUser(prev => ({
              ...prev,
              profile_image: res.data
            }));
          }
        })
      };
      reader.readAsDataURL(file);
    }
  };

  const getDeleteConfirmationContent = () => {
    const {type} = itemToDelete;

    switch (type) {
      case 'document':
        return {
          title: "Delete Document",
          text: "Are you sure you want to delete this document? This action cannot be undone."
        };
      case 'freeDay':
        return {
          title: "Delete Day Off",
          text: "Are you sure you want to delete this day off? This action cannot be undone."
        };
      case 'overtime':
        return {
          title: "Delete Overtime Hours",
          text: "Are you sure you want to delete these overtime hours? This action cannot be undone."
        };
      default:
        return {
          title: "Confirm Deletion",
          text: "Are you sure you want to delete this item? This action cannot be undone."
        };
    }
  };


  const deleteConfirmationContent = getDeleteConfirmationContent();

  return (
    <Card sx={{borderRadius: 2, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.08)'}}>
      <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
        <h5 className="mb-0">User Details</h5>
        <Button
          variant="outline-light"
          size="sm"
          onClick={() => {
            get()
            setVisible(false)
          }}
        >
          <i className="bi bi-x-lg me-1"></i>
          Close
        </Button>
      </Card.Header>

      <Box sx={{borderBottom: 1, borderColor: 'divider', mb: 2}}>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          variant="fullWidth"
          sx={{'& .MuiTab-root': {textTransform: 'none'}}}
        >
          <Tab icon={<Group/>} iconPosition="start" label="User profile"/>
          <Tab icon={<Today/>} iconPosition="start" label="Documents"/>
          <Tab icon={<Settings/>} iconPosition="start" label="Statistics"/>
          <Tab icon={<Settings/>} iconPosition="start" label="Overtime Hours"/>
          <Tab icon={<Settings/>} iconPosition="start" label="Free Days"/>
        </Tabs>
      </Box>
      <CardContent sx={{p: 2}}>
        <div>
          {activeTab === 0 &&
            <UserProfile
              user={user}
              editMode={editMode}
              toggleEditMode={toggleEditMode}
              handleInputChange={handleInputChange}
              saveChanges={saveChanges}
              handleProfileImageChange={handleProfileImageChange}
              jobPositionData={jobPositionData}
              roleData={roleData}
              setToastMessage={setToastMessage}
              setShowToast={setShowToast}
            />
          }
          {activeTab === 1 &&
            <DocumentsCard
              user={user}
              setShowModal={setShowModal}
              showModal={showModal}
              removeDocument={removeDocument}
            />
          }
          {activeTab === 2 &&
            <StatisticsCards
              user={user}
              setShowModal={setShowModal}
              showModal={showModal}
            />
          }
          {activeTab === 3 &&
            <OvertimeHoursCard
              user={user}
              setShowModal={setShowModal}
              formatDate={formatDate}
              removeOvertime={removeOvertime}
              showModal={showModal}
              setToastMessage={setToastMessage}
              setShowToast={setShowToast}
              setUser={setUser}
            />
          }
          {activeTab === 4 &&
            <FreeDaysCard
              user={user}
              setShowModal={setShowModal}
              showModal={showModal}
              formatDate={formatDate}
              removeFreeDay={removeFreeDay}
            />
          }

          <Modal
            show={showModal.deleteConfirmation}
            onHide={() => setShowModal({...showModal, deleteConfirmation: false})}
            centered
          >
            <Modal.Header closeButton className="border-0">
              <Modal.Title>{deleteConfirmationContent.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="text-center mb-4">
                <i className="bi bi-exclamation-triangle text-warning" style={{fontSize: '3rem'}}></i>
                <p className="mt-3">{deleteConfirmationContent.text}</p>
              </div>
            </Modal.Body>
            <Modal.Footer className="border-0">
              <Button
                variant="outline-secondary"
                onClick={() => setShowModal({...showModal, deleteConfirmation: false})}
                className="px-4"
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={handleConfirmedDelete}
                className="px-4"
              >
                Delete
              </Button>
            </Modal.Footer>
          </Modal>

          <Modal
            show={showModal.document}
            onHide={() => setShowModal({...showModal, document: false})}>
            <Modal.Header closeButton>
              <Modal.Title>Add new document</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Group className="mb-3">
                <Form.Label>Choose document</Form.Label>
                <Form.Control
                  type="file"
                  onChange={(e) => setNewDocument(e.target.files[0])}
                />
                <Form.Text className="text-muted">
                  Supported formats: PDF, DOC, DOCX
                </Form.Text>
              </Form.Group>
              {newDocument && (
                <Alert variant="info">
                  <i className="bi bi-file-earmark me-2"></i>
                  {newDocument.name}
                </Alert>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowModal({...showModal, document: false})}>
                Close
              </Button>
              <Button
                variant="primary"
                onClick={handleDocumentUpload}
                disabled={!newDocument}
              >
                Upload
              </Button>
            </Modal.Footer>
          </Modal>

          <Modal
            show={showModal.freeDay}
            onHide={() => setShowModal({...showModal, freeDay: false})}>
            <Modal.Header closeButton>
              <Modal.Title>Add day off</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Group className="mb-3">
                <Form.Label>Date</Form.Label>
                <Form.Control
                  type="date"
                  value={newFreeDay.date}
                  onChange={(e) => setNewFreeDay({...newFreeDay, date: e.target.value})}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Type of day off</Form.Label>
                <Form.Select
                  value={newFreeDay.type_id}
                  onChange={(e) => setNewFreeDay({...newFreeDay, type_id: e.target.value})}
                >
                  <option value="">Select type</option>
                  {freeDayTypes
                    .filter((type) => type.type !== "personal_holiday")
                    .map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.description} ({type.type})
                      </option>
                    ))}
                </Form.Select>
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowModal({...showModal, freeDay: false})}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handelAddUserUsedFreeDays}
                disabled={newFreeDay.type_id === '' || newFreeDay.date === ''}
              >
                Save
              </Button>
            </Modal.Footer>
          </Modal>

          <Modal
            show={showModal.convertOvertimeModal}
            onHide={() => setShowModal({...showModal, convertOvertimeModal: false})}>
            <Modal.Header closeButton>
              <Modal.Title>Convert overtime hours</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Alert variant="info">
                Currently, you have a total of <strong>{user?.userTotalAttendance?.overtime_hours_sum} overtime
                hours</strong> that you can convert.
              </Alert>

              <Form.Group className="mb-3">
                <Form.Label>Number of hours for conversion</Form.Label>
                <Form.Control
                  type="number"
                  min="1"
                  max={user?.userTotalAttendance?.overtime_hours_sum}
                  value={overtimeConversion.hours}
                  onChange={(e) => setOvertimeConversion({...overtimeConversion, hours: e.target.value})}
                />
                <Form.Text className="text-muted">
                  Enter the number of hours you want to convert (maximum {user?.userTotalAttendance?.overtime_hours_sum})
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Conversion type</Form.Label>
                <div>
                  <Form.Check
                    type="radio"
                    id="free-day-conversion"
                    name="conversion-type"
                    label="Convert to days off (8 hours = 1 day)"
                    checked={overtimeConversion.conversionType === "free_day"}
                    onChange={() => setOvertimeConversion({...overtimeConversion, conversionType: "free_day"})}
                    className="mb-2"
                  />
                  <Form.Check
                    type="radio"
                    id="paid-day-conversion"
                    name="conversion-type"
                    label="Convert to paid hours"
                    checked={overtimeConversion.conversionType === "paid_day"}
                    onChange={() => setOvertimeConversion({...overtimeConversion, conversionType: "paid_day"})}
                  />
                </div>
              </Form.Group>

              {overtimeConversion.conversionType === "free_day" && parseInt(overtimeConversion.hours) > 0 && (
                <Alert variant="success">
                  <i className="bi bi-calculator me-2"></i>
                  You will receive <strong>{Math.floor(parseInt(overtimeConversion.hours) / 8)}</strong> days off
                  {parseInt(overtimeConversion.hours) % 8 > 0 && (
                    <span> and you have <strong>{parseInt(overtimeConversion.hours) % 8}</strong> unused hours remaining</span>
                  )}
                </Alert>
              )}

              {overtimeConversion.conversionType === "paid_day" && parseInt(overtimeConversion.hours) > 0 && (
                <Alert variant="success">
                  <i className="bi bi-currency-dollar me-2"></i>
                  <strong>{overtimeConversion.hours}</strong> hours will be paid
                </Alert>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowModal({...showModal, convertOvertimeModal: false})}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleOvertimeConversion}
                disabled={parseInt(overtimeConversion.hours) <= 0 || parseInt(overtimeConversion.hours) > user?.userTotalAttendance?.overtime_hours_sum}
              >
                Convert
              </Button>
            </Modal.Footer>
          </Modal>
          <Modal
            show={showModal.overtimeEntry}
            onHide={() => setShowModal({...showModal, overtimeEntry: false})}
          >
            <Modal.Header closeButton>
              <Modal.Title>Enter overtime/negative hours</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Group className="mb-3">
                <Form.Label>Date</Form.Label>
                <Form.Control
                  type="date"
                  value={overtimeEntry?.date}
                  onChange={(e) =>
                    setOvertimeEntry({...overtimeEntry, date: e.target.value})
                  }
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Number of hours</Form.Label>
                <Form.Control
                  type="number"
                  min="1"
                  step="1"
                  max='24'
                  value={overtimeEntry?.hours}
                  onChange={(e) =>
                    setOvertimeEntry({...overtimeEntry, hours: e.target.value})
                  }
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Status</Form.Label>
                <div>
                  <Form.Check
                    type="radio"
                    id="positive-hours"
                    name="overtime-status"
                    label="Prekovremeni sati"
                    checked={overtimeEntry.status === "positive"}
                    onChange={() =>
                      setOvertimeEntry({...overtimeEntry, status: "positive"})
                    }
                    className="mb-2"
                  />
                  <Form.Check
                    type="radio"
                    id="negative-hours"
                    name="overtime-status"
                    label="Sati u minusu"
                    checked={overtimeEntry?.status === "negative"}
                    onChange={() =>
                      setOvertimeEntry({...overtimeEntry, status: "negative"})
                    }
                  />
                </div>
              </Form.Group>

              {overtimeEntry?.hours && overtimeEntry?.status && (
                <Alert variant={overtimeEntry?.status === "positive" ? "success" : "warning"}>
                  <i className="bi bi-clock-history me-2"></i>
                  {overtimeEntry.status === "positive"
                    ? `You are adding ${overtimeEntry?.hours} overtime hours for the date ${overtimeEntry?.date}`
                    : `You are adding ${overtimeEntry?.hours} negative hours for the date ${overtimeEntry?.date}`}
                </Alert>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() =>
                  setShowModal({...showModal, overtimeEntry: false})
                }
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleOvertimeEntry}
                disabled={
                  !overtimeEntry.date ||
                  !overtimeEntry.hours ||
                  !overtimeEntry.status
                }
              >
                Save
              </Button>
            </Modal.Footer>
          </Modal>

          <Modal
            show={showModal.addFreeDaysModal}
            onHide={() => setShowModal({...showModal, addFreeDaysModal: false})}
          >
            <Modal.Header closeButton>
              <Modal.Title>Add days off</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Group className="mb-3">
                <Form.Label>Number of days</Form.Label>
                <Form.Control
                  type="number"
                  min="1"
                  value={freeDaysEntry}
                  onChange={(e) => setFreeDaysEntry(e.target.value)}
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => setShowModal({...showModal, addFreeDaysModal: false})}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  handleAddFreeDays();
                  setShowModal({...showModal, addFreeDaysModal: false});
                }}
                disabled={!freeDaysEntry}
              >
                Save
              </Button>
            </Modal.Footer>
          </Modal>

          <Modal
            show={showModal.addWorkingHoursModal}
            onHide={() => setShowModal({...showModal, addWorkingHoursModal: false})}
          >
            <Modal.Header closeButton>
              <Modal.Title>Add working hours</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Group className="mb-3">
                <Form.Label>Number of hours</Form.Label>
                <Form.Control
                  type="number"
                  min="1"
                  max="24"
                  step="1"
                  value={workingHoursEntry}
                  onChange={(e) => {
                    setWorkingHoursEntry(e.target.value)
                  }}
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => setShowModal({...showModal, addWorkingHoursModal: false})}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  if (workingHoursEntry > 24) return;
                  handleAddWorkingHours();
                  setShowModal({...showModal, addWorkingHoursModal: false});
                }}
                disabled={!workingHoursEntry || workingHoursEntry > 24}
              >
                Save
              </Button>
            </Modal.Footer>
          </Modal>

          <div className="position-fixed top-0 end-0 p-3" style={{
            zIndex: 1050,
            width: '100%',
            display: 'flex',
            justifyContent: 'end'
          }}>
            <Toast
              onClose={() => setShowToast(false)}
              show={showToast}
              delay={3000}
              autohide
              bg={
                toastMessage?.toLowerCase().includes('successfully') ? "success" : "danger"}
              className="shadow-lg border-0"
            >
              <div className="d-flex align-items-center p-3">
                <div className="me-3">
                  <Check size={24} className="text-white"/>
                </div>
                <div className="text-white">{toastMessage}</div>
              </div>
            </Toast>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default ProfileDaysOff;
