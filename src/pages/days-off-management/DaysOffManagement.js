import React, { useState } from 'react';

const AvailabilityCalendar = ({ staff12, month = 3, year=2025 }) => {
  const [currentMonth, setCurrentMonth] = useState({ month, year });

  const staff = [
    { id: "1", name: "Marko"},
    { id: "2", name: "Jelena"},
    { id: "3", name: "Ana"}
  ];
  const previousMonth = () => {
    const newMonth = currentMonth.month === 1 ? 12 : currentMonth.month - 1;
    const newYear = currentMonth.month === 1 ? currentMonth.year - 1 : currentMonth.year;
    setCurrentMonth({ month: newMonth, year: newYear });
  };

  const nextMonth = () => {
    const newMonth = currentMonth.month === 12 ? 1 : currentMonth.month + 1;
    const newYear = currentMonth.month === 12 ? currentMonth.year + 1 : currentMonth.year;
    setCurrentMonth({ month: newMonth, year: newYear });
  };

  const getMonthName = (monthNumber) => {
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    return months[monthNumber - 1];
  };


  const previousName = getMonthName(currentMonth.month === 1 ? 12 : currentMonth.month - 1);
  const nextName = getMonthName(currentMonth.month === 12 ? 1 : currentMonth.month + 1);
  const currentName = getMonthName(currentMonth.month);


  const getDaysInMonth = (month, year) => {
    return new Date(year, month, 0).getDate();
  };

  const daysCount = getDaysInMonth(currentMonth.month, currentMonth.year);


  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month - 1, 1).getDay();
  };

  const daysInMonth = Array.from({ length: daysCount }, (_, i) => i + 1);


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


  const availabilityData = {
    "M": [3, 4, 5]
  };


  const getAvailabilityStatus = (staffId, day) => {
    if (availabilityData[staffId] && availabilityData[staffId].includes(day)) {
      return "unavailable";
    }
    return "available";
  };

  const getClassForStatus = (staffId, day) => {
    const status = getAvailabilityStatus(staffId, day);
    if (isWeekend(day)) return "cell-weekend";
    if (isToday(day)) return "cell-today";
    if (status === "unavailable") return "cell-unavailable";
    return "cell-available";
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <div className="navigation">
          <button onClick={previousMonth} className="btn-navigation">
            <i className="la la-angle-left"></i>
            <span>
              Prev. month
              <p className="month-name">{previousName}</p>
            </span>
          </button>
        </div>

        <div className="current-month">
          <i className="fa flaticon-calendar"></i>
          <em>{currentName} {currentMonth.year}</em>
        </div>

        <div className="navigation">
          <button onClick={nextMonth} className="btn-navigation">
            <span>
              Next month
              <p className="month-name">{nextName}</p>
            </span>
            <i className="la la-angle-right"></i>
          </button>
        </div>
      </div>

      <div className="calendar-table-container">
        <table className="calendar-table">
          <thead>
          <tr>
            <th className="staff-header">Staff member</th>
            {daysInMonth.map(day => (
              <th key={day} className={`day-header ${isWeekend(day) ? 'weekend' : ''}`}>
                <div className="day-of-week">{(() => {
                  const date = new Date(currentMonth.year, currentMonth.month - 1, day);
                  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                  return days[date.getDay()];
                })()}</div>
                <span className={isToday(day) ? 'today' : ''}>{day}</span>
              </th>
            ))}
          </tr>
          </thead>
          <tbody>
          {staff.map(member => (
            <tr key={member.id} className="staff-row">
              <td className="staff-cell">
                <div className="staff-info">
                  <div className="staff-image">
                    <img src={member.image || "assets/app/media/img/users/user4.png"} alt={member.name} />
                  </div>
                  <div className="staff-details">
                    <span className="staff-name">{member.name}</span>
                  </div>
                </div>
              </td>

              {daysInMonth.map(day => (
                <td
                  key={day}
                  className={getClassForStatus(member.id, day)}
                >
                  {getAvailabilityStatus(member.id, day) === "unavailable" ? "D" : ""}
                </td>
              ))}
            </tr>
          ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AvailabilityCalendar;
