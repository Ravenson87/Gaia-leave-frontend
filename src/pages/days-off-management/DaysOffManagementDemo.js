import React, {useEffect, useState} from 'react';
import {getUser} from "../../api/user";
import {Pagination} from 'react-bootstrap';
import {Calendar, ChevronLeft, ChevronRight} from 'lucide-react';
import ProfileDaysOff from "./ProfileDaysOff";
import {getCalendar, getFreeDayType} from "../../api/day-off-management/dayOffManagement";
import {getJobPosition} from "../../api/jobPosition";
import {getRole} from "../../api/role";

const StaffCalendar = ({month = new Date().getMonth() + 1, year = new Date().getFullYear()}) => {
  const [currentMonth, setCurrentMonth] = useState({month, year});
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [visibleUser, setVisibleUser] = useState(null);
  const [freeDayTypes, setFreeDayTypes] = useState([]);
  const [jobPositionData, setJobPositionData] = useState([]);
  const [calendarData, setCalendarData] = useState([]);
  const [roleData, setRoleData] = useState([]);
  const [overtimeData, setOvertimeData] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);

  const statusTypes = [
    {code: 'V', name: 'Vacation', color: '#28a745'},
    {code: 'SL', name: 'Sick Leave', color: '#007bff'},
    {code: 'DO', name: 'Day Off', color: '#6f42c1'},
    {code: 'H', name: 'Holiday', color: '#fd7e14'},
    {code: 'T', name: 'TOIL', color: '#e83e8c'},
    {code: 'PH', name: 'Personal Holiday', color: '#20c997'}
  ];

  useEffect(() => {
    fetchData();
  }, []);


  const fetchData = () => {
    getUser().then((res) => {
      if (res?.status === 200) {
        setUsers(res.data);

        const calculatedOvertimeData = {};
        res.data.forEach(user => {
          let sum = 0;
          if (user.overtimeHours && Array.isArray(user.overtimeHours)) {
            user.overtimeHours.forEach(entry => {
              sum += entry.overtime_hours || 0;
            });
          }
          calculatedOvertimeData[user.id] = sum;
        });
        setOvertimeData(calculatedOvertimeData);
      }
    });

    getFreeDayType().then((res) => {
      if (res.status === 200) {
        setFreeDayTypes(res.data);
      }
    })

    getJobPosition().then((res) => {
      if (res.status === 200) {
        setJobPositionData(res.data);
      }
    })

    getRole().then((res) => {
      if (res.status === 200) {
        setRoleData(res.data);
      }
    })
    getCalendar().then((res) => {
      if (res.status === 200) {
        setCalendarData(res.data);
      }
    })
  };

  const previousMonth = () => {
    const newMonth = currentMonth.month === 1 ? 12 : currentMonth.month - 1;
    const newYear = currentMonth.month === 1 ? currentMonth.year - 1 : currentMonth.year;
    setCurrentMonth({month: newMonth, year: newYear});
  };

  const nextMonth = () => {
    const newMonth = currentMonth.month === 12 ? 1 : currentMonth.month + 1;
    const newYear = currentMonth.month === 12 ? currentMonth.year + 1 : currentMonth.year;
    setCurrentMonth({month: newMonth, year: newYear});
  };

  const getMonthName = (monthNumber) => {
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    return months[monthNumber - 1];
  };

  const getDaysInMonth = (month, year) => {
    return new Date(year, month, 0).getDate();
  };

  const daysCount = getDaysInMonth(currentMonth.month, currentMonth.year);
  const daysInMonth = Array.from({length: daysCount}, (_, i) => i + 1);

  const isToday = (day) => {
    const today = new Date();
    return today.getDate() === day &&
      today.getMonth() === currentMonth.month - 1 &&
      today.getFullYear() === currentMonth.year;
  };

  const isWeekend = (day) => {
    const date = new Date(currentMonth.year, currentMonth.month - 1, day);
    const dayOfWeek = date.getDay();
    return dayOfWeek === 0 || dayOfWeek === 6;
  };

  const getAvailabilityStatus = (staffId, day) => {
    const date = formatDate(currentMonth, day);
    const user = users.find(u => u.id === staffId);
    if (user && user.userUsedFreeDays && Array.isArray(user.userUsedFreeDays)) {
      const freeDay = user.userUsedFreeDays.find(
        d => d?.calendar?.date === date);
      if (freeDay) {
        return {
          type: freeDay.freeDayType?.type || "unavailable",
          description: freeDay.freeDayType?.description || "",
          date: freeDay.calendar?.date
        };
      }
    }

    return null;
  };

  const formatDate = (date, day) => {
    const formattedMonth = date.month < 10 ? `0${date.month}` : date.month;
    const formattedDay = day < 10 ? `0${day}` : day;
    return `${date.year}-${formattedMonth}-${formattedDay}`;
  };

  const getStatusCode = (status) => {
    if (!status) return "";
    switch (status.type) {
      case "unavailable":
        return "DO";
      case "sick leave":
        return "SL";
      case "vacation leave":
        return "V";
      case "toil":
        return "T";
      case "personal_holiday":
        return "PH";
      default:
        return "";
    }
  };

  const getUserInitials = (user) => {
    return `${user.first_name?.charAt(0) || ''}${user.last_name?.charAt(0) || ''}`;
  };

  const handleUserClick = (user, userData) => {
    setSelectedUserId(user === selectedUserId ? null : user);
    setSelectedUser(userData)
    setVisibleUser(true);
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentMonth({
      month: today.getMonth() + 1,
      year: today.getFullYear()
    });
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / usersPerPage);

  const paginationItems = [];
  for (let number = 1; number <= totalPages; number++) {
    paginationItems.push(
      <Pagination.Item
        key={number}
        active={number === currentPage}
        onClick={() => setCurrentPage(number)}
      >
        {number}
      </Pagination.Item>
    );
  }


  return (
    <>
      {!visibleUser ? (
        <>
          <div className="card shadow">
            <div className="card-header bg-white">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">Staff Calendar</h5>
              </div>
              <div className="card shadow-sm border-0 mb-4">
                <div className="card-body p-3">
                  <div className="row align-items-center">
                    <div className="col-lg-6 mb-3 mb-lg-0">
                      <div className="d-flex align-items-center">
                        <div className="btn-group btn-group-sm shadow-sm me-3">
                          <button
                            onClick={previousMonth}
                            className="btn btn-light"
                            aria-label="Previous month"
                          >
                            <ChevronLeft size={20}/>
                          </button>
                          <button className="btn btn-light px-3 fw-medium">
                            {getMonthName(currentMonth.month)} {currentMonth.year}
                          </button>
                          <button
                            onClick={nextMonth}
                            className="btn btn-light"
                            aria-label="Next month"
                          >
                            <ChevronRight size={20}/>
                          </button>
                        </div>
                        <button
                          onClick={goToToday}
                          className="btn btn-sm btn-primary shadow-sm d-flex align-items-center"
                        >
                          <Calendar size={16} className="mr-1"/>
                          <span>Today</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-bordered m-0" style={{tableLayout: 'fixed'}}>
                  <thead className="table-light">
                  <tr>
                    <th style={{width: '200px'}}>Staff</th>
                    {daysInMonth.map(day => {
                      const date = new Date(currentMonth.year, currentMonth.month - 1, day);
                      const dayName = ['S', 'M', 'T', 'W', 'T', 'F', 'S'][date.getDay()];
                      const isWeekendDay = isWeekend(day);
                      const isTodayDay = isToday(day);

                      return (
                        <th
                          key={day}
                          className={`text-center p-1 ${isWeekendDay ? 'table-light' : ''} ${isTodayDay ? 'table-primary' : ''}`}
                          style={{width: `calc((100% - 200px) / ${daysCount})`}}
                        >
                          <small className="d-block text-muted">{dayName}</small>
                          <span className={isTodayDay ? 'fw-bold' : ''}>{day}</span>
                        </th>
                      );
                    })}
                  </tr>
                  </thead>
                  <tbody>
                  {currentUsers.map(user => {
                    const isSelected = selectedUserId === user.id;

                    return (
                      <tr key={user.id} className={isSelected ? 'table-active' : ''}>
                        <td
                          className="align-middle cursor-pointer"
                          onClick={() => handleUserClick(user.id, user)}
                          style={{width: '200px'}}
                        >
                          <div className="d-flex align-items-center">
                            <div
                              className={`rounded-circle d-flex align-items-center justify-content-center me-2 ${isSelected ? 'bg-primary text-white' : 'bg-light'}`}
                              style={{width: '36px', height: '36px', flexShrink: 0}}
                            >
                              {getUserInitials(user)}
                            </div>
                            <div style={{minWidth: 0}}>
                              <div className="fw-medium text-truncate">{user.first_name} {user.last_name}</div>
                              <small className="text-muted d-flex align-items-center">
                                <i className="bi bi-clock me-1"></i> {overtimeData[user.id] || 0}h OT
                              </small>
                            </div>
                          </div>
                        </td>

                        {daysInMonth.map(day => {
                          const cellStatus = getAvailabilityStatus(user.id, day);
                          const statusText = getStatusCode(cellStatus);
                          const statusInfo = statusTypes.find(type => type.code === statusText);
                          const isWeekendDay = isWeekend(day);
                          const isTodayDay = isToday(day);
                          return (
                            <td
                              key={`${user.id}-${day}`}
                              className={`text-center p-1 ${isWeekendDay ? 'table-light' : ''} ${isTodayDay ? 'border-primary' : ''}`}
                              style={{
                                backgroundColor: statusInfo ? statusInfo.color : undefined,
                                cursor: 'pointer',
                                width: `calc((100% - 200px) / ${daysCount})`,
                                height: '40px'
                              }}
                              title={cellStatus ? cellStatus.description : ''}
                            >
                              {statusText && (
                                <span className="badge" style={{backgroundColor: statusInfo?.color}}>
                              {statusText}
                            </span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="card-footer bg-light d-flex justify-content-between align-items-center">
              <small className="text-muted">
                Showing {indexOfFirstUser + 1}-{Math.min(indexOfLastUser, users.length)} of {users.length} staff members
              </small>
              <div className="d-flex align-items-center">
                <button className="btn btn-sm btn-outline-secondary me-3">
                  <i className="bi bi-download"></i> Export
                </button>
                <Pagination size="sm" className="mb-0">
                  <Pagination.First onClick={() => setCurrentPage(1)} disabled={currentPage === 1}/>
                  <Pagination.Prev onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                   disabled={currentPage === 1}/>
                  {paginationItems}
                  <Pagination.Next onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                   disabled={currentPage === totalPages}/>
                  <Pagination.Last onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}/>
                </Pagination>
              </div>
            </div>
            <div className="col-md-12 m-3">
              <div className="d-flex flex-wrap gap-2 justify-content-md-center">
                {statusTypes.map(type => (
                  <span key={type.code} className="badge rounded-pill"
                        style={{backgroundColor: type.color, color: '#fff'}}>
                    {type.code} - {type.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <ProfileDaysOff userData={selectedUser}
                           freeDayTypes={freeDayTypes}
                           jobPositionData={jobPositionData}
                           roleData={roleData}
                           calendarData={calendarData}
                          setVisible={setVisibleUser}
          />
        </>
      )}
    </>
  );
};

export default StaffCalendar;
