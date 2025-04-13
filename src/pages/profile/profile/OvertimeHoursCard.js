import React, {useEffect, useState} from 'react';
import {Button, Card, Form, Modal, Pagination, Table} from 'react-bootstrap';
import {updateOvertimeCompensationForOvertimeHours} from "../../../api/day-off-management/dayOffManagement";

const OvertimeHoursCard = ({ user, formatDate, setShowModal, removeOvertime, showModal , setToastMessage, setShowToast, setUser}) => {
  const [selectedOvertimes, setSelectedOvertimes] = useState([]);
  const [selectedOvertimesData, setSelectedOvertimesData] = useState([]);
  const [showConvertModal, setShowConvertModal] = useState(false);
  const [conversionType, setConversionType] = useState('');


  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [paginatedData, setPaginatedData] = useState([]);


  const unconvertedOvertimes = user.overtimeHours?.filter(overtime =>
    overtime.overtime_compensation === null) || [];


  const totalPages = user.overtimeHours ? Math.ceil(user.overtimeHours.length / itemsPerPage) : 0;

  useEffect(() => {
    if (user.overtimeHours && user.overtimeHours.length > 0) {
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      setPaginatedData(user.overtimeHours.slice(startIndex, endIndex));
    } else {
      setPaginatedData([]);
    }
  }, [currentPage, itemsPerPage, user.overtimeHours]);


  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const calculateTotalSelectedHours = () => {
    return selectedOvertimes.reduce((total, id) => {
      const overtime = user.overtimeHours.find(ot => ot.id === id);
      return total + (overtime ? overtime.overtime_hours : 0);
    }, 0);
  };

  const totalSelectedHours = calculateTotalSelectedHours();
  const isDivisibleBy8 = totalSelectedHours % 8 === 0;


  const handleCheckboxChange = (overtimeId, overtimeData) => {
    setSelectedOvertimes(prev =>
      prev.includes(overtimeId)
        ? prev.filter(id => id !== overtimeId)
        : [...prev, overtimeId]
    );

    setSelectedOvertimesData(prev =>
      prev.some(item => item.id === overtimeId)
        ? prev.filter(item => item.id !== overtimeId)
        : [...prev, overtimeData]
    );
  };


  const handleConvertOvertime = async () => {
    const filteredOvertimes = selectedOvertimesData.map(item => ({
      id: item.id,
      user_id: item.user_id,
      calendar_id: item.calendar_id,
      overtime_compensation: "converted to payed days"
    }));
    const res = await updateOvertimeCompensationForOvertimeHours(filteredOvertimes)

    if (res.status === 200) {
      setToastMessage('Successfully updated');
      setShowToast(true)
      setUser(prev => ({
        ...prev,
        overtimeHours: prev.overtimeHours.map(entry => {
          const matched = selectedOvertimesData.find(sel => sel.id === entry.id);
          return matched
            ? { ...entry, overtime_compensation: conversionType }
            : entry;
        })
      }));
    } else {
      setToastMessage(res?.response?.data.message);
      setShowToast(true)
    }
    setSelectedOvertimes([]);
    setShowConvertModal(false);

  };


  const renderPaginationItems = () => {
    let items = [];


    items.push(
      <Pagination.Prev
        key="prev"
        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
      />
    );


    if (currentPage > 2) {
      items.push(
        <Pagination.Item key={1} onClick={() => handlePageChange(1)}>
          1
        </Pagination.Item>
      );

      if (currentPage > 3) {
        items.push(<Pagination.Ellipsis key="ellipsis1" disabled />);
      }
    }


    for (let number = Math.max(1, currentPage - 1); number <= Math.min(totalPages, currentPage + 1); number++) {
      items.push(
        <Pagination.Item
          key={number}
          active={number === currentPage}
          onClick={() => handlePageChange(number)}
        >
          {number}
        </Pagination.Item>
      );
    }


    if (currentPage < totalPages - 1) {
      if (currentPage < totalPages - 2) {
        items.push(<Pagination.Ellipsis key="ellipsis2" disabled />);
      }

      items.push(
        <Pagination.Item key={totalPages} onClick={() => handlePageChange(totalPages)}>
          {totalPages}
        </Pagination.Item>
      );
    }

    items.push(
      <Pagination.Next
        key="next"
        onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages || totalPages === 0}
      />
    );

    return items;
  };


  return (
    <Card className="mb-4 shadow-sm border-0">
      <Card.Header className="bg-white border-bottom-0 pt-4 pb-0 px-4">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0 fw-bold">Overtime hours record</h5>
          <div>
            {selectedOvertimes.length > 0 && (
              <Button
                variant="outline-success"
                size="sm"
                className="rounded-pill px-3 me-2"
                onClick={() => setShowConvertModal(true)}
              >
                <i className="bi bi-arrow-clockwise me-1"></i>
                Convert Selected ({selectedOvertimes.length})
              </Button>
            )}
            <Button
              variant="outline-primary"
              size="sm"
              className="rounded-pill px-3"
              onClick={() => setShowModal({...showModal, overtimeEntry: true})}
            >
              <i className="bi bi-plus-circle me-1"></i>
              Add overtime hours
            </Button>
          </div>
        </div>
      </Card.Header>
      <Card.Body className="px-4 py-4">
        <div className="table-responsive">
          <Table hover className="align-middle">
            <thead className="table-light">
            <tr>
              {unconvertedOvertimes.length > 0 && (
                <th className="fw-medium text-muted" style={{fontSize: '0.9rem', width: '40px'}}>
                  {selectedOvertimes.length > 0 && (
                    <span className="badge rounded-pill bg-primary px-2 py-1">{selectedOvertimes.length}</span>
                  )}
                </th>
              )}
              <th className="fw-medium text-muted" style={{fontSize: '0.9rem'}}>Date</th>
              <th className="fw-medium text-muted" style={{fontSize: '0.9rem'}}>Hours</th>
              <th className="fw-medium text-muted" style={{fontSize: '0.9rem'}}>Overtime compensation</th>
              <th className="fw-medium text-muted" style={{fontSize: '0.9rem'}}>Actions</th>
            </tr>
            </thead>
            <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((overtime) => (
                <tr key={overtime.id}>
                  {unconvertedOvertimes.length > 0 && (
                    <td>
                      {overtime.overtime_compensation === null && (
                        <Form.Check
                          type="checkbox"
                          checked={selectedOvertimes.includes(overtime.id)}
                          onChange={() => handleCheckboxChange(overtime.id, overtime)}
                        />
                      )}
                    </td>
                  )}
                  <td className="fw-medium">{formatDate(overtime.calendars.date)}</td>
                  <td>
                      <span className="badge rounded-pill bg-success bg-opacity-10 text-success px-3 py-2 fw-medium">
                        {overtime.overtime_hours} h
                      </span>
                  </td>
                  <td>
                    {overtime.overtime_compensation ? (
                      overtime.overtime_compensation
                    ) : (
                      <span className="badge rounded-pill bg-secondary bg-opacity-10 text-secondary px-3 py-2">
                          Not converted
                        </span>
                    )}
                  </td>
                  <td>
                    <Button
                      variant="light"
                      size="sm"
                      className="rounded-pill text-danger"
                      onClick={() => removeOvertime(overtime.id)}
                    >
                      <i className="bi bi-trash me-1"></i>
                      Remove
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={unconvertedOvertimes.length > 0 ? "5" : "4"} className="text-center py-4">
                  <div className="d-flex flex-column align-items-center opacity-75">
                    <i className="bi bi-clock-history fs-1 text-muted mb-2"></i>
                    <p className="mb-0">There are still no overtime hours recorded.</p>
                  </div>
                </td>
              </tr>
            )}
            </tbody>
          </Table>
        </div>

        {totalPages > 1 && (
          <div className="d-flex justify-content-between align-items-center mt-4">
            <div className="text-muted small">
              Showing {Math.min(paginatedData.length, itemsPerPage)} of {user.overtimeHours.length} entries
            </div>
            <Pagination size="sm" className="mb-0">
              {renderPaginationItems()}
            </Pagination>
            <Form.Select
              className="ms-2"
              style={{width: '80px'}}
              size="sm"
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="20">20</option>
            </Form.Select>
          </div>
        )}
      </Card.Body>

      <Modal show={showConvertModal} onHide={() => setShowConvertModal(false)}>
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold">Convert Overtime Hours</Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-2">
          <div className="mb-3 p-3 bg-light rounded">
            <div className="d-flex align-items-center">
              <i className="bi bi-clock-history fs-4 text-primary me-3"></i>
              <div>
                <p className="mb-0 text-muted" style={{fontSize: '0.9rem'}}>Total selected hours</p>
                <h4 className="mb-0 fw-bold">{totalSelectedHours} hours</h4>
              </div>
            </div>
          </div>

          {conversionType === 'converted to days off' && !isDivisibleBy8 && (
            <div className="alert alert-warning d-flex align-items-center">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              <div>
                For conversion to days off, total hours must be divisible by 8.
                Current total ({totalSelectedHours}) is not divisible by 8.
              </div>
            </div>
          )}

          <Form>
            <Form.Group className="mb-3">
              <Form.Label className="fw-medium">Conversion Type</Form.Label>
              <Form.Select
                value={conversionType}
                onChange={(e) => setConversionType(e.target.value)}
                className="py-2"
              >
                <option value="">Select conversion type</option>
                <option value="converted to days off">Convert to days off</option>
                <option value="converted to payed days">Convert to paid days</option>
              </Form.Select>
            </Form.Group>

            {conversionType && (
              <div className="p-3 bg-light rounded mt-3">
                {conversionType === 'converted to days off' && isDivisibleBy8 && (
                  <div className="d-flex align-items-center">
                    <i className="bi bi-calendar-check fs-4 text-success me-3"></i>
                    <div>
                      <p className="mb-0 text-muted" style={{fontSize: '0.9rem'}}>Will be converted to</p>
                      <h5 className="mb-0 fw-bold">{totalSelectedHours / 8} day(s) off</h5>
                    </div>
                  </div>
                )}
                {conversionType === 'converted to payed days' && (
                  <div className="d-flex align-items-center">
                    <i className="bi bi-cash-coin fs-4 text-success me-3"></i>
                    <div>
                      <p className="mb-0 text-muted" style={{fontSize: '0.9rem'}}>Will be converted to</p>
                      <h5 className="mb-0 fw-bold">Paid compensation for {totalSelectedHours} hours</h5>
                    </div>
                  </div>
                )}
              </div>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer className="border-0 pt-2">
          <Button
            variant="light"
            className="rounded-pill px-3"
            onClick={() => setShowConvertModal(false)}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            className="rounded-pill px-4"
            onClick={handleConvertOvertime}
            disabled={!conversionType || (conversionType === 'converted to days off' && !isDivisibleBy8)}
          >
            Convert Hours
          </Button>
        </Modal.Footer>
      </Modal>
    </Card>
  );
};

export default OvertimeHoursCard;
