import React, {useEffect, useState} from 'react';
import {Button, Card, Pagination, Table} from 'react-bootstrap';

const FreeDaysCard = ({ user, formatDate, setShowModal, removeFreeDay, showModal }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [paginatedFreeDays, setPaginatedFreeDays] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {

    const calculatedTotalPages = Math.ceil(user.userUsedFreeDays.length / itemsPerPage);
    setTotalPages(calculatedTotalPages || 1);

    if (currentPage > calculatedTotalPages) {
      setCurrentPage(1);
    }

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = user.userUsedFreeDays.slice(indexOfFirstItem, indexOfLastItem);

    setPaginatedFreeDays(currentItems);
  }, [user.userUsedFreeDays, currentPage, itemsPerPage]);


  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const getFreeDayBadgeStyle = (type) => {
    switch (type) {
      case 'vacation leave':
        return { bgClass: 'bg-success', textClass: 'text-success', label: 'Vacation Leave' };
      case 'sick leave':
        return { bgClass: 'bg-danger', textClass: 'text-danger', label: 'Sick Leave' };
      case 'toil':
        return { bgClass: 'bg-warning', textClass: 'text-warning', label: 'Days Off' };
      default:
        return { bgClass: 'bg-info', textClass: 'text-info', label: type };
    }
  };


  const renderPaginationItems = () => {
    const items = [];

    items.push(
      <Pagination.Prev
        key="prev"
        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
      />
    );

    for (let number = 1; number <= totalPages; number++) {
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

    items.push(
      <Pagination.Next
        key="next"
        onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
      />
    );

    return items;
  };

  return (
    <Card className="mb-4 shadow-sm border-0">
      <Card.Header className="bg-white border-bottom-0 pt-4 pb-0 px-4">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0 fw-bold">Used days off</h5>
          <Button
            variant="outline-primary"
            size="sm"
            className="rounded-pill px-3"
            onClick={() => setShowModal({ ...showModal, freeDay: true })}
          >
            <i className="bi bi-plus-circle me-1"></i>
            Add day off
          </Button>
        </div>
      </Card.Header>
      <Card.Body className="px-4 py-4">
        <div className="table-responsive">
          <Table hover className="align-middle">
            <thead className="table-light">
            <tr>
              <th className="fw-medium text-muted" style={{ fontSize: '0.9rem' }}>Date</th>
              <th className="fw-medium text-muted" style={{ fontSize: '0.9rem' }}>Day</th>
              <th className="fw-medium text-muted" style={{ fontSize: '0.9rem' }}>Type</th>
              <th className="fw-medium text-muted" style={{ fontSize: '0.9rem' }}>Description</th>
              <th className="fw-medium text-muted" style={{ fontSize: '0.9rem' }}>Actions</th>
            </tr>
            </thead>
            <tbody>
            {paginatedFreeDays.map((freeDay) => {
              const badgeStyle = getFreeDayBadgeStyle(freeDay.freeDayType.type);
              return (
                <tr key={freeDay.id}>
                  <td className="fw-medium">{formatDate(freeDay.calendar.date)}</td>
                  <td>{freeDay.calendar.days}</td>
                  <td>
                      <span
                        className={`badge rounded-pill ${badgeStyle.bgClass} bg-opacity-10 ${badgeStyle.textClass} px-3 py-2 fw-medium`}
                      >
                        {badgeStyle.label}
                      </span>
                  </td>
                  <td>{freeDay.freeDayType.description}</td>
                  <td>
                    <Button
                      variant="light"
                      size="sm"
                      className="rounded-pill text-danger"
                      onClick={() => removeFreeDay(freeDay.id)}
                    >
                      <i className="bi bi-trash me-1"></i>
                      Remove
                    </Button>
                  </td>
                </tr>
              );
            })}
            {user.userUsedFreeDays.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-4">
                  <div className="d-flex flex-column align-items-center opacity-75">
                    <i className="bi bi-calendar-x fs-1 text-muted mb-2"></i>
                    <p className="mb-0">There is no free days</p>
                  </div>
                </td>
              </tr>
            )}
            </tbody>
          </Table>
        </div>

        {user.userUsedFreeDays.length > 0 && (
          <div className="d-flex justify-content-center mt-4">
            <Pagination>{renderPaginationItems()}</Pagination>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default FreeDaysCard;
