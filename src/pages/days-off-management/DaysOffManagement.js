import React, {useEffect, useState} from 'react';
import {getUser} from "../../api/user";
import {getCalendar, getFreeDayType} from "../../api/day-off-management/dayOffManagement";
import * as res from "autoprefixer";
import {Button, FormControl, InputLabel, MenuItem, Select, useTheme} from "@mui/material";

const AvailabilityCalendar = ({month = 3, year = 2025}) => {
  const theme = useTheme();
  const [currentMonth, setCurrentMonth] = useState({month, year});
  const [users, setUsers] = useState([]);
  const [calendar, setCalendar] = useState([]);
  const [userUsedFreeDaysData, setUserUsedFreeDaysData] = useState([]);
  const [userUsedFreeDaysDataDeleted, setUserUsedFreeDaysDataDeleted] = useState([]);
  const [userUsedFreeDays, setUserUsedFreeDays] = useState([]);
  const [userUsedFreeDaysDeleted, setUserUsedFreeDaysDeleted] = useState([]);
  const [freeDayTypeData, setFreeDayTypeData] = useState([]);
  const [freeDayType, setFreeDayType] = useState(null);
  const [actionData] = useState([{name: 'Create', id: 0}, {name: 'Delete', id: 1}]);
  const [action, setAction] = useState(null);

  useEffect(() => {
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
  }, []);

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


  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month - 1, 1).getDay();
  };

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

    if (userUsedFreeDaysTargetDataDeleted) {
      return userUsedFreeDaysTargetDataDeleted.type === "deleted" ? "deleted" : "unavailable";
    } else if (targetDate) {
      return check ? check : "unavailable";
    } else if (userUsedFreeDaysTargetData) {
      return userUsedFreeDaysTargetData.type === "new" ? "new" : "unavailable";
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
        return [...prevState, {calendar_id: calendarId.id, user_id: member.id, free_day_type_id: freeDayType.id}]
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
    console.log(userUsedFreeDaysData)
  }

  function deleteFunction() {
    console.log(userUsedFreeDaysDataDeleted)
  }

  function selectAction(event) {
    setAction(event.target.value)
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
            {users.map(member => (
              <tr key={member.id} className="staff-row">
                <td className="staff-cell">
                  <div className="staff-info">
                    {/*<div className="staff-image">*/}
                    {/*  <img src={member.image || "assets/app/media/img/users/user4.png"} alt={member.name} />*/}
                    {/*</div>*/}
                    <div className="staff-details">
                      <span className="staff-name">{member?.first_name + ' ' + member?.last_name}</span>
                    </div>
                  </div>
                </td>

                {daysInMonth.map(day => (
                  <td
                    key={day}
                    className={`${getClassForStatus(member.id, day)} ${action !== null ? (action.id === 0 ? 'cursor-pointer' : getAvailabilityStatus(member.id, day) !== 'available' ? 'cursor-pointer' : "") : ''}`}
                    onClick={() => {
                      if (action !== null) {
                        action.id === 1 ? deleteUserUsedFreeDays(formatedDate(currentMonth, day), member) : addUserUsedFreeDays(formatedDate(currentMonth, day), member)
                      }
                    }}
                  >
                    {status(getAvailabilityStatus(member.id, day))}
                  </td>
                ))}
              </tr>
            ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default AvailabilityCalendar;
