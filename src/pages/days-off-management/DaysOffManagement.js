import React, {useEffect, useState} from 'react';
import {getUser} from "../../api/user";
import {
  createOvertimeHours, createUserUsedFreeDays, deleteUserUsedFreeDaysByIds,
  getCalendar,
  getFreeDayType,
   workingHoursAssign
} from "../../api/day-off-management/dayOffManagement";
import {Button, FormControl, Input, InputLabel, MenuItem, Select, useTheme} from "@mui/material";
import {RefreshCw, DollarSign, Coffee, X} from 'lucide-react';

const AvailabilityCalendar = ({month = 3, year = 2025}) => {
  const theme = useTheme();
  const [currentMonth, setCurrentMonth] = useState({month, year});
  const [users, setUsers] = useState([]);
  const [calendar, setCalendar] = useState([]);
  const [userUsedFreeDaysData, setUserUsedFreeDaysData] = useState([]);
  const [userUsedFreeDaysDataDeleted, setUserUsedFreeDaysDataDeleted] = useState([]);
  const [userUsedFreeDays, setUserUsedFreeDays] = useState([]);
  const [overtimeHours, setOvertimeHours] = useState([]);
  const [overtimeHoursData, setOvertimeHoursData] = useState([]);
  const [userUsedFreeDaysDeleted, setUserUsedFreeDaysDeleted] = useState([]);
  const [freeDayTypeData, setFreeDayTypeData] = useState([]);
  const [freeDayType, setFreeDayType] = useState(null);
  const [actionData] = useState([{name: 'Create', id: 0}, {name: 'Delete', id: 1}, {name: 'Overtime hours', id: 2}]);
  const [action, setAction] = useState(null);
  const [showConversionModal, setShowConversionModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [conversionType, setConversionType] = useState('');
  const [hoursToConvert, setHoursToConvert] = useState(0);

  useEffect(() => {
    get();
  }, []);

  function get() {
    getUser().then((res) => {
      if (res.status === 200) {
        setUsers(res.data);
      }
    })
    getCalendar().then(r => {
      if (r.status === 200) {
        setCalendar(r.data);
      }
    })
    getFreeDayType().then((res) => {
      if (res.status === 200) {
        setFreeDayTypeData(res.data);
      }
    });
  }

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
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
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
    const date = formatedDate(currentMonth, day);
    let check = null;
    const targetDate = users.find((user) => user?.userUsedFreeDays.find(day => {
      if (user.id === staffId) {
        check = day?.freeDayType?.type
        return day?.calendar?.date === date
      }
    }));

    const userUsedFreeDaysTargetData = userUsedFreeDays.find((d) => {
      if (d.user_id === staffId) {
        return d.date === date;
      }
    });

    const userUsedFreeDaysTargetDataDeleted = userUsedFreeDaysDeleted.find((d) => {
      if (d.user_id === staffId) {
        return d.date === date;
      }
    });

    const userOvertimeHours = overtimeHours.find((d) => {
      if (d.user_id === staffId) {
        return d.date === date;
      }
    });

    if (userUsedFreeDaysTargetDataDeleted) {
      return userUsedFreeDaysTargetDataDeleted.type === "deleted" ? "deleted" : "unavailable";
    } else if (targetDate) {
      return check ? check : "unavailable";
    } else if (userUsedFreeDaysTargetData) {
      return userUsedFreeDaysTargetData.type === "new" ? "new" : "unavailable";
    } else if (userOvertimeHours) {
      return "overtime";
    }
    return "available";
  };

  function addUserUsedFreeDays(day, member) {
    const calendarId = calendar.find((date) => date.date === day);
    setUserUsedFreeDays(prevState => {
      const exist = prevState.some(item => item.date === day && item.user_id === member.id);
      if (exist) {
        return prevState.filter(item => !(item.date === day && item.user_id === member.id))
      } else {
        return [...prevState, {date: day, user_id: member.id, type: 'new'}]
      }
    });

    setUserUsedFreeDaysData(prevState => {
      const exist = prevState.some(item => item.calendar_id === calendarId.id && item.user_id === member.id);
      if (exist) {
        return prevState?.filter(item => !(item.calendar_id === calendarId.id && item.user_id === member.id))
      } else {
        return [...prevState, {
          calendar_id: calendarId.id,
          user_id: member.id,
          free_day_type_id: freeDayType?.id || " "
        }]
      }
    });
  }

  function addUserOvertimeHours(day, member) {
    const calendarId = calendar.find((date) => date.date === day);
    setOvertimeHours(prevState => {
      const exist = prevState.some(item => item.date === day && item.user_id === member.id);
      if (exist) {
        return prevState.filter(item => !(item.date === day && item.user_id === member.id))
      } else {
        return [...prevState, {date: day, user_id: member.id, type: 'overtime'}]
      }
    });

    setOvertimeHoursData(prevState => {
      const exist = prevState.some(item => item.calendar_id === calendarId.id && item.user_id === member.id);
      if (exist) {
        return prevState?.filter(item => !(item.calendar_id === calendarId.id && item.user_id === member.id))
      } else {
        return [...prevState, {calendar_id: calendarId.id, user_id: member.id}]
      }
    });
  }

  function deleteUserUsedFreeDays(day, member) {

    const calendarId = calendar.find((date) => date.date === day);

    setUserUsedFreeDaysDeleted(prevState => {
      const exist = prevState.some(item => item.date === day && item.user_id === member.id);
      if (exist) {
        return prevState.filter(item => !(item.date === day && item.user_id === member.id))
      } else {
        return [...prevState, {date: day, user_id: member.id, type: 'deleted'}]
      }
    });

    setUserUsedFreeDaysDataDeleted(prevState => {
      const exist = prevState.some(item => item.calendar_id === calendarId.id && item.user_id === member.id);
      if (exist) {
        return prevState?.filter(item => !(item.calendar_id === calendarId.id && item.user_id === member.id))
      } else {
        return [...prevState, {calendar_id: calendarId.id, user_id: member.id, free_day_type_id: "delete"}]
      }
    });

  }

  // 2025-03-15
  const formatedDate = (date, day) => {
    const formattedMonth = parseInt(date.month) < 10 ? `0${date.month}` : date.month
    const formattedDay = parseInt(day) < 10 ? `0${day}` : day
    return date.year + "-" + formattedMonth + "-" + formattedDay;
  }

  const getClassForStatus = (staffId, day) => {
    const status = getAvailabilityStatus(staffId, day);
    if (isWeekend(day)) return "cell-weekend";
    if (isToday(day)) return "cell-today";
    if (status === "unavailable") return "cell-unavailable";
    if (status === "vacation leave") return "cell-vacation-leave";
    if (status === "toil") return "cell-toil";
    if (status === "new") return "cell-new";
    if (status === "deleted") return "cell-deleted";
    if (status === "overtime") return "cell-overtime";
    return "cell-available";
  };

  function status(status) {
    switch (status) {
      case "unavailable":
        return "D";
      case "sick leave":
        return "SL";
      case "vacation leave":
        return "VL";
      case "toil":
        return "TOIL";
      case "new":
        return "NEW";
      case "deleted":
        return "DEL";
      case "overtime":
        return "OT";
      default:
        return "";
    }
  }

  const getStyles = (name, theme) => {
    return {
      display: 'block',
      width: '100%',
      padding: theme.spacing(1),
      backgroundColor: theme.palette.background.paper,
    };
  };

  const handleChange = (event) => {
    setFreeDayType(event.target.value);
  }

  function create() {

    if (action.id === 2 && overtimeHoursData.length > 0) {
      createOvertimeHours(overtimeHoursData).then(() => get());
    } else if (userUsedFreeDaysData.length > 0) {
      createUserUsedFreeDays(userUsedFreeDaysData).then(() => get());
    }

  }


  function deleteFunction() {

    const matchedIds = [];

    users.forEach(user => {
      user?.userUsedFreeDays.forEach(freeDay => {
        if (userUsedFreeDaysDataDeleted.some(criteria =>
          criteria.user_id === freeDay.user_id && criteria.calendar_id === freeDay.calendar.id
        )) {
          matchedIds.push(freeDay.id);
        }
      });
    });
    deleteUserUsedFreeDaysByIds(matchedIds).then(() => get())
  }

  function selectAction(event) {
    setAction(event.target.value)
  }

  const handleConvertClick = (user) => {
    setSelectedUser(user);
    setHoursToConvert(0);
    setConversionType('');
    setShowConversionModal(true);
  };

  const handleConversion = () => {
    if (!selectedUser || hoursToConvert <= 0 || !conversionType) return;
    if (hoursToConvert >= selectedUser?.userTotalAttendance?.overtime_hours_sum) return;
    workingHoursAssign(selectedUser.id, hoursToConvert, conversionType === "timeoff");
  };

  const getUserInitials = (user) => {
    return `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`;
  };

  const getAvatarColor = (userId) => {

    const colors = [
      'rgba(86, 204, 242, 0.2)',
      'rgba(235, 131, 131, 0.2)',
      'rgba(144, 237, 125, 0.2)',
      'rgba(247, 220, 111, 0.2)',
      'rgba(187, 143, 206, 0.2)'
    ];

    const textColors = [
      'rgb(41, 128, 185)',
      'rgb(192, 57, 43)',
      'rgb(39, 174, 96)',
      'rgb(211, 159, 8)',
      'rgb(142, 68, 173)'
    ];

    const index = userId % colors.length;
    return {
      backgroundColor: colors[index],
      color: textColors[index]
    };
  };

  function onIncrease(hours, day, member) {

    const calendarId = calendar.find((date) => date.date === day);

    setOvertimeHoursData(prevState => {
      const exist = prevState.some(item => item.calendar_id === calendarId.id && item.user_id === member.id);
      const existingIndex = prevState.findIndex(
        item => item.calendar_id === calendarId.id && item.user_id === member.id
      );
      if (exist) {
        return prevState.map((item, index) =>
          index === existingIndex
            ? {...item, overtime_hours: hours}
            : item
        );
      } else {
        return [...prevState, {overtime_hours: hours, calendar_id: calendarId.id, user_id: member.id}];
      }
    });
  }

  function onDecrease(hours, day, member) {

    const calendarId = calendar.find((date) => date.date === day);

    setOvertimeHoursData(prevState => {
      const exist = prevState.some(item => item.calendar_id === calendarId.id && item.user_id === member.id);
      const existingIndex = prevState.findIndex(
        item => item.calendar_id === calendarId.id && item.user_id === member.id
      );
      if (exist) {
        return prevState.map((item, index) =>
          index === existingIndex
            ? {...item, overtime_hours: hours}
            : item
        );
      } else {
        return [...prevState, {overtime_hours: hours, calendar_id: calendarId.id, user_id: member.id}];
      }
    });
  }

  function conversationModal() {

    return (
      <>
        {showConversionModal && (
          <div className="modal d-block" tabIndex="-1" role="dialog" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content border-0 shadow">
                <div className="modal-header border-bottom-0">
                  <h5 className="modal-title">Overtime Hours Conversion</h5>
                  <button type="button" className="btn-close" onClick={() => setShowConversionModal(false)}
                          aria-label="Close"></button>
                </div>
                <div className="modal-body">
                  <p>
                    <span className="fw-medium">{selectedUser?.first_name} {selectedUser?.last_name}</span>{' '}
                    {/*<span className="fw-medium">{selectedUser}</span> overtime hours.*/}
                  </p>

                  <div className="mb-4">
                    <label htmlFor="hoursToConvert" className="form-label fw-medium">
                      Hours to Convert
                    </label>
                    <input
                      type="number"
                      className="form-control form-control-lg"
                      id="hoursToConvert"
                      min="1"
                      max={selectedUser?.overtimeHours}
                      value={hoursToConvert}
                      onChange={(e) => setHoursToConvert(parseInt(e.target.value) || 0)}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-medium">
                      Conversion Type
                    </label>
                    <div className="d-flex gap-3">
                      <div
                        className={`card flex-grow-1 p-3 text-center border ${conversionType === 'payment' ? 'border-success bg-success bg-opacity-10' : 'border-light'}`}
                        onClick={() => setConversionType('payment')}
                        style={{cursor: 'pointer'}}
                      >
                        <div className="d-flex flex-column align-items-center">
                          <DollarSign size={30} className="text-success mb-2"/>
                          <span className="fw-medium">Payment</span>
                          {hoursToConvert > 0 && (
                            <span className="badge bg-success mt-2">{hoursToConvert}h</span>
                          )}
                        </div>
                      </div>
                      <div
                        className={`card flex-grow-1 p-3 text-center border ${conversionType === 'timeoff' ? 'border-warning bg-warning bg-opacity-10' : 'border-light'}`}
                        onClick={() => setConversionType('timeoff')}
                        style={{cursor: 'pointer'}}
                      >
                        <div className="d-flex flex-column align-items-center">
                          <Coffee size={30} className="text-warning mb-2"/>
                          <span className="fw-medium">Time Off</span>
                          {hoursToConvert > 0 && (
                            <span
                              className="badge bg-warning text-dark mt-2">{hoursToConvert} days</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-top-0">
                  <button type="button" className="btn btn-light" onClick={() => setShowConversionModal(false)}>
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary px-4 rounded-pill"
                    onClick={handleConversion}
                    disabled={!conversionType || hoursToConvert <= 0}
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    )
  }

  return (
    <>
      <div className="row justify-content-between">
        <div className="col-md-6 row">
          <div className="col-md-6">
            <FormControl className="w-100 mb-2">
              <InputLabel id="demo-simple-select-autowidth-label">Action</InputLabel>
              <Select
                labelId="demo-simple-select-autowidth-label"
                id="demo-simple-select-autowidth"
                value={action}
                onChange={selectAction}
                label="Free days type"
                className="w-100"
              >
                {actionData?.map((item, index) => (
                  <MenuItem value={item}
                            className="w-100"
                            style={getStyles(name, theme)}
                  >
                    <em>{item?.name?.toUpperCase()}</em>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div className="col-md-6">
            <FormControl className="w-100 mb-2">
              <InputLabel id="demo-simple-select-autowidth-label">Free days type</InputLabel>
              <Select
                labelId="demo-simple-select-autowidth-label"
                id="demo-simple-select-autowidth"
                value={freeDayType}
                onChange={handleChange}
                label="Free days type"
                className="w-100"
                disabled={action?.id === 1}
              >
                {freeDayTypeData?.map((item, index) => (
                  <MenuItem value={item}
                            className="w-100"
                            style={getStyles(name, theme)}
                  >
                    <em>{item?.type?.toUpperCase()}</em>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </div>
        <div className="col-md-3">
          <Button variant="contained" color={action?.id === 1 ? "error" : ""} className="p-3 w-100"
                  onClick={() => action?.id === 1 ? deleteFunction() : create()}>{action?.id === 1 ? "Delete" : "Create"}</Button>
        </div>
      </div>
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
            {users.map(member => {
              const avatarStyle = getAvatarColor(member.id);
              return (
                <tr key={member.id} className="staff-row">
                  <td className="staff-cell">
                    <div className="staff-info d-flex justify-content-between">
                      <div
                        className="staff-avatar d-flex align-items-center justify-content-center rounded-circle fw-bold"
                        style={{
                          width: "60px",
                          height: "45px",
                          backgroundColor: avatarStyle.backgroundColor,
                          color: avatarStyle.color
                        }}
                      >
                        {getUserInitials(member)}
                      </div>
                      <div className="staff-details">
                        <span className="staff-name"
                              style={{whiteSpace: "nowrap"}}>{member?.first_name + ' ' + member?.last_name}</span>
                      </div>
                      <button
                        onClick={() => handleConvertClick(member)}
                        className="btn btn-outline-primary rounded-pill d-inline-flex align-items-center mx-lg-2"
                      >
                        <RefreshCw size={16} className="me-2"/>
                        <span
                          style={{whiteSpace: "nowrap"}}>{member?.userTotalAttendance?.overtime_hours_sum || 0} hours</span>
                      </button>
                    </div>
                  </td>

                  {daysInMonth.map(day => (
                    <td
                      key={day}
                      className={`${getClassForStatus(member.id, day)} ${action !== null ? (action.id === 0 ? 'cursor-pointer' : getAvailabilityStatus(member.id, day) !== 'available' ? 'cursor-pointer' : "") : ''}`}
                      onClick={() => {
                        if (action !== null) {
                          action.id === 1 ? deleteUserUsedFreeDays(formatedDate(currentMonth, day), member) : action.id === 0 ? addUserUsedFreeDays(formatedDate(currentMonth, day), member) : status(getAvailabilityStatus(member.id, day)) !== "OT" && addUserOvertimeHours(formatedDate(currentMonth, day), member)
                        }
                      }}
                    >
                      {status(getAvailabilityStatus(member.id, day)) === "OT" && <OvertimeInput
                        onIncrease={onIncrease}
                        onDecrease={onDecrease}
                        onClose={() => addUserOvertimeHours(formatedDate(currentMonth, day), member)}
                        day={formatedDate(currentMonth, day)}
                        member={member}
                      />}
                      {status(getAvailabilityStatus(member.id, day))}
                    </td>
                  ))}
                  <td className="text-end pe-4">

                  </td>
                </tr>
              )
            })}
            </tbody>
          </table>
        </div>
        {conversationModal()}
      </div>
    </>
  );
};
const OvertimeInput = ({
                         onIncrease,
                         onDecrease,
                         onClose,
                         min = 24,
                         day,
                         member
                       }) => {
  const [hours, setHours] = useState(0);

  const handleIncrease = () => {
    if (hours < 24) {
      onIncrease(hours, day, member);
      setHours(prevState => prevState + 1);
    }
  };

  const handleDecrease = () => {
    if (hours > 0) {
      onDecrease(hours, day, member);
      setHours(prevState => prevState - 1);
    }
  };

  return (
    <div className="relative flex items-center space-x-2 bg-blue-50 p-2 rounded-lg shadow-sm">
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-0 right-0 w-5 h-5 p-0"
        style={{
          position: 'absolute',
          top: '2px',
          right: '-1.2rem'
        }}
        onClick={onClose}
      >
        <X className="w-4 h-4 text-danger hover:text-danger-dark"/>
      </Button>
      <Input
        type="number"
        value={hours}
        onChange={(e) => setHours(Number(e.target.value))}
        min="0"
        className="w-16 h-8"
        placeholder="Hours"
      />
      <div className="flex flex-col space-y-1">
        <Button
          variant="outline"
          size="sm"
          className="h-4 px-2 py-0 bg-green-100 hover:bg-green-200"
          onClick={handleIncrease}
        >
          +
        </Button>
        <span>{hours}</span>
        <Button
          variant="outline"
          size="sm"
          className="h-4 px-2 py-0 bg-red-100 hover:bg-red-200"
          onClick={handleDecrease}
        >
          -
        </Button>
      </div>
    </div>
  );
};
<style jsx>
  {`
    .modal {
      overflow-y: auto;
    }

    .form-control {
      border-radius: 0.5rem;
    }

    .form-control:focus {
      box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.15);
    }


  `}
</style>

export default AvailabilityCalendar;
