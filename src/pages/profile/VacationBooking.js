import React, {useEffect, useState} from 'react';
import {AlertCircle, Calendar, Check, ChevronDown, ChevronUp, Clock} from 'lucide-react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import {freeDaysRequest} from "../../api/day-off-management/dayOffManagement";

const ITEMS_PER_PAGE = 10;
const VacationBooking = ({userData, onBookVacation, freeDaysBookingData, calendarData}) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reason, setReason] = useState('');
  const [message, setMessage] = useState({text: '', type: ''});
  const [vacationHistory, setVacationHistory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (Array.isArray(freeDaysBookingData)) {
      const transformedData = freeDaysBookingData.map(item => {
        let statusText = 'pending';
        switch (item.status) {
          case 1:
            statusText = 'pending';
            break;
          case 2:
            statusText = 'approved';
            break;
          default:
            statusText = 'pending';
        }

        return {
          id: item.id,
          startDate: new Date(item.calendar.date),
          endDate: new Date(item.calendar.date),
          status: statusText,
          reason: item.description || 'No reason provided'
        };
      });

      setVacationHistory(transformedData);
    }
  }, [freeDaysBookingData]);

  const totalPages = Math.ceil(vacationHistory.length / ITEMS_PER_PAGE);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  const paginatedData = vacationHistory.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const calculateDays = (start, end) => {
    if (!start || !end) return 0;
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!startDate || !endDate) {
      setMessage({text: 'Please select dates', type: 'danger'});
      return;
    }

    const daysRequested = calculateDays(startDate, endDate);
    const daysAvailable = userData?.vacationDays?.total - userData?.vacationDays?.used;

    if (daysRequested > daysAvailable) {
      setMessage({
        text: `Not enough vacation days. Requested ${daysRequested}, available ${daysAvailable}.`,
        type: 'danger'
      });
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const newVacation = {
        id: Date.now(),
        startDate: startDate,
        endDate: endDate,
        reason: reason,
        status: 'pending'
      };

      setVacationHistory(prev => [newVacation, ...prev]);
      setStartDate(null);
      setEndDate(null);
      setReason('');
      setMessage({text: 'Vacation request successfully submitted!', type: 'success'});
      setLoading(false);

      if (onBookVacation) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const result = calendarData
          .filter(item => {
            const date = new Date(item.date);
            return date >= start && date <= end;
          })
          .map(item => ({
            calendar_id: item.id,
            status: 0,
            description: reason
          }));

        freeDaysRequest(userData.id, result).then((res) => {
          if (res.status === 201) {
            onBookVacation(newVacation);
          }
        })
      }
    }, 1000);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return <span className="badge bg-success-subtle text-success rounded-pill">Approved</span>;
      case 'pending':
        return <span className="badge bg-warning-subtle text-warning rounded-pill">Pending</span>;
      case 'rejected':
        return <span className="badge bg-danger-subtle text-danger rounded-pill">Rejected</span>;
      default:
        return <span className="badge bg-secondary-subtle text-secondary rounded-pill">Unknown</span>;
    }
  };

  const formatDate = (date) => {
    if (!date) return '';
    return new Intl.DateTimeFormat('en-US').format(date);
  };

  return (
    <div className="card shadow rounded-4 border-0">
      <div className="card-header bg-white p-4 border-0">
        <div className="d-flex justify-content-end align-items-center">
          <button
            className="btn btn-sm btn-outline-primary rounded-pill px-3 d-flex align-items-center"
            onClick={() => setShowHistory(!showHistory)}
          >
            {showHistory ? 'Hide History' : 'View History'}
            {showHistory ?
              <ChevronUp size={16} className="ms-1"/> :
              <ChevronDown size={16} className="ms-1"/>
            }
          </button>
        </div>
      </div>

      <div className="card-body p-4">
        {message.text && (
          <div className={`alert alert-${message.type} d-flex align-items-center mb-4`} role="alert">
            {message.type === 'success' ? (
              <Check size={18} className="me-2"/>
            ) : (
              <AlertCircle size={18} className="me-2"/>
            )}
            <div>{message.text}</div>
            <button
              type="button"
              className="btn-close ms-auto"
              onClick={() => setMessage({text: '', type: ''})}
              aria-label="Close"
            ></button>
          </div>
        )}

        <div className="row g-4">
          {/* Stats Card */}
          <div className="col-lg-6">
            <div className="card h-100 bg-light border-0 rounded-4">
              <div className="card-body p-4">
                <div className="text-center mb-4">
                  <h6 className="text-primary fw-semibold mb-1">Vacation Overview</h6>
                  <div className="position-relative pt-2">
                    <div className="d-flex justify-content-between small mb-2">
                      <span className="text-primary fw-semibold">Available Days</span>
                    </div>
                    {/*<div className="progress rounded-pill" style={{height: "8px"}}>*/}
                    {/*  <div*/}
                    {/*    className="progress-bar bg-primary"*/}
                    {/*    role="progressbar"*/}
                    {/*    style={{*/}
                    {/*      width: `${(userData?.vacationDays?.used / userData?.vacationDays?.total) * 100}%`*/}
                    {/*    }}*/}
                    {/*    aria-valuenow={userData?.vacationDays?.used}*/}
                    {/*    aria-valuemin="0"*/}
                    {/*    aria-valuemax={userData?.vacationDays?.total}*/}
                    {/*  ></div>*/}
                    {/*</div>*/}
                  </div>
                  <h2 className="display-6 fw-bold mt-3 mb-0">
                    {isNaN(parseFloat(userData?.vacationDays?.total) - parseFloat(userData?.vacationDays?.used)) ?
                      0 :
                      parseFloat(userData?.vacationDays?.total) - parseFloat(userData?.vacationDays?.used)
                    }
                  </h2>
                  <p className="text-muted small">days available</p>
                </div>

                <div className="row g-3 mt-2">
                  <div className="col-4">
                    <div className="card border-0 shadow-sm h-100">
                      <div className="card-body text-center p-3">
                        <div className="rounded-circle bg-primary bg-opacity-10 p-3 d-inline-flex mb-2">
                          <Calendar size={20} className="text-primary"/>
                        </div>
                        <h4 className="mb-1 fs-5">{userData?.vacationDays?.used}</h4>
                        <p className="mb-0 text-muted small">Days Used</p>
                      </div>
                    </div>
                  </div>

                  <div className="col-4">
                    <div className="card border-0 shadow-sm h-100">
                      <div className="card-body text-center p-3">
                        <div className="rounded-circle bg-warning bg-opacity-10 p-3 d-inline-flex mb-2">
                          <Clock size={20} className="text-warning"/>
                        </div>
                        <h4 className="mb-1 fs-5">
                          {vacationHistory.filter(v => v.status === 'pending').length}
                        </h4>
                        <p className="mb-0 text-muted small">Pending</p>
                      </div>
                    </div>
                  </div>

                  <div className="col-4">
                    <div className="card border-0 shadow-sm h-100">
                      <div className="card-body text-center p-3">
                        <div className="rounded-circle bg-success bg-opacity-10 p-3 d-inline-flex mb-2">
                          <Check size={20} className="text-success"/>
                        </div>
                        <h4 className="mb-1 fs-5">
                          {vacationHistory.filter(v => v.status === 'approved').length}
                        </h4>
                        <p className="mb-0 text-muted small">Approved</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="card border-0 shadow-sm h-100 rounded-4">
              <div className="card-body p-4">
                <h6 className="card-title mb-3">Request Time Off</h6>
                <form onSubmit={handleSubmit}>
                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-medium">Start Date</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0">
                          <Calendar size={16} className="text-primary"/>
                        </span>
                        <DatePicker
                          selected={startDate}
                          onChange={date => setStartDate(date)}
                          selectsStart
                          startDate={startDate}
                          endDate={endDate}
                          minDate={new Date()}
                          dateFormat="MM/dd/yyyy"
                          className="form-control border-start-0 bg-light"
                          placeholderText="Select date"
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-medium">End Date</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0">
                          <Calendar size={16} className="text-primary"/>
                        </span>
                        <DatePicker
                          selected={endDate}
                          onChange={date => setEndDate(date)}
                          selectsEnd
                          startDate={startDate}
                          endDate={endDate}
                          minDate={startDate || new Date()}
                          dateFormat="MM/dd/yyyy"
                          className="form-control border-start-0 bg-light"
                          placeholderText="Select date"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-medium">Reason for leave</label>
                    <textarea
                      className="form-control bg-light"
                      rows="3"
                      value={reason}
                      onChange={e => setReason(e.target.value)}
                      placeholder="Enter the reason for your leave request"
                      required
                    ></textarea>
                  </div>

                  <div className="d-flex justify-content-between align-items-center mt-4">
                    <div>
                      {startDate && endDate && (
                        <div className="text-primary small d-flex align-items-center">
                          <Clock size={14} className="me-1"/>
                          <span>Total days: <strong>{calculateDays(startDate, endDate)}</strong></span>
                        </div>
                      )}
                    </div>
                    <button
                      type="submit"
                      className="btn btn-primary rounded-pill px-4"
                      disabled={loading || !startDate || !endDate || !reason.trim()}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"
                                aria-hidden="true"></span>
                          Processing...
                        </>
                      ) : 'Submit Request'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        {showHistory && (
          <div className="mt-4 pt-4 border-top">
            <h6 className="mb-3">Vacation History</h6>
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                <tr>
                  <th scope="col" className="fw-semibold small text-uppercase">Period</th>
                  <th scope="col" className="fw-semibold small text-uppercase">Days</th>
                  <th scope="col" className="fw-semibold small text-uppercase">Reason</th>
                  <th scope="col" className="fw-semibold small text-uppercase">Status</th>
                  <th scope="col" className="fw-semibold small text-uppercase">Day Type</th>
                </tr>
                </thead>
                <tbody className="small">
                {paginatedData.map(vacation => (
                  <tr key={vacation.id}>
                    <td>{formatDate(vacation.startDate)}</td>
                    <td>1</td>
                    <td>{vacation.reason}</td>
                    <td>{getStatusBadge(vacation.status)}</td>
                    <td>
                      {vacation.dayType && (
                        <span
                          className={`badge ${vacation.dayType === 'WORKING_DAY' ? 'bg-info-subtle text-info' : 'bg-secondary-subtle text-secondary'} rounded-pill`}>
                          {vacation.dayType === 'WORKING_DAY' ? 'Working Day' : vacation.dayType.replace('_', ' ')}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="d-flex justify-content-between align-items-center mt-3">
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={handlePrev}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>

                <span className="small">Page {currentPage} of {totalPages}</span>

                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VacationBooking;
