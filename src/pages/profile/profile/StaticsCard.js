import React from 'react';
import {Button, Card} from 'react-bootstrap';

const StatisticsCards = ({ user, setShowModal, showModal }) => {
  return (
    <div className="row mb-4 g-4">
      <div className="col-md-4">
        <Card className="h-100 shadow-sm border-0 position-relative overflow-hidden">
          <div className="position-absolute top-0 end-0 bg-primary opacity-10 rounded-circle"
               style={{ width: '120px', height: '120px', transform: 'translate(30%, -30%)' }}></div>
          <Card.Body className="d-flex flex-column justify-content-center align-items-center p-4">
            <div className="text-primary mb-3 p-3 bg-primary bg-opacity-10 rounded-circle">
              <i className="bi bi-calendar-check fs-2"></i>
            </div>
            <h5 className="text-center fw-bold mb-3">Total free days</h5>
            <h2 className="text-center fw-bold mb-0">{user?.userTotalAttendance?.total_free_days}</h2>
            <div className="mt-3 text-center">
              <Button
                variant="outline-primary"
                size="sm"
                className="rounded-pill px-3"
                onClick={() => setShowModal({...showModal, addFreeDaysModal: true})}
              >
                Change days off
              </Button>
            </div>
          </Card.Body>
        </Card>
      </div>
      <div className="col-md-4">
        <Card className="h-100 shadow-sm border-0 position-relative overflow-hidden">
          <div className="position-absolute top-0 end-0 bg-success opacity-10 rounded-circle"
               style={{ width: '120px', height: '120px', transform: 'translate(30%, -30%)' }}></div>
          <Card.Body className="d-flex flex-column justify-content-center align-items-center p-4">
            <div className="text-success mb-3 p-3 bg-success bg-opacity-10 rounded-circle">
              <i className="bi bi-clock-history fs-2"></i>
            </div>
            <h5 className="text-center fw-bold mb-3">Total working hours</h5>
            <h2 className="text-center fw-bold mb-0">{user?.userTotalAttendance?.total_working_hours}</h2>
            <div className="mt-3 text-center">
              <Button
                variant="outline-primary"
                size="sm"
                className="rounded-pill px-3"
                onClick={() => setShowModal({...showModal, addWorkingHoursModal: true})}
              >
                Change total working hours
              </Button>
            </div>
          </Card.Body>
        </Card>
      </div>
      <div className="col-md-4">
        <Card className="h-100 shadow-sm border-0 position-relative overflow-hidden">
          <div className="position-absolute top-0 end-0 bg-warning opacity-10 rounded-circle"
               style={{ width: '120px', height: '120px', transform: 'translate(30%, -30%)' }}></div>
          <Card.Body className="d-flex flex-column justify-content-center align-items-center p-4">
            <div className="text-warning mb-3 p-3 bg-warning bg-opacity-10 rounded-circle">
              <i className="bi bi-clock-fill fs-2"></i>
            </div>
            <h5 className="text-center fw-bold mb-3">Overtime hours</h5>
            <h2 className="text-center fw-bold mb-0">{user?.userTotalAttendance?.overtime_hours_sum}</h2>
            <div className="mt-3 text-center">
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};
export { StatisticsCards };
