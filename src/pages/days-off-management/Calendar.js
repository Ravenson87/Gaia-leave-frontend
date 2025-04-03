import React, {useEffect, useState} from 'react';
import {getCalendar, updateCalendarByType} from "../../api/day-off-management/dayOffManagement";
import {Button, FormControl, InputLabel, MenuItem, Select, useTheme} from "@mui/material";
import FullPageLoader from "../../components/Preloader";


const YearlyAvailabilityCalendar = ({year = 2025}) => {
  const theme = useTheme();
  const [currentYear, setCurrentYear] = useState(year);
  const [calendar, setCalendar] = useState([]);
  const [calendarChoose, setCalendarChoose] = useState([]);
  const [calendarData, setCalendarData] = useState([]);
  const [selectAction, setSelectAction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [type] = useState([
    {id: 1, name: 'NATIONAL_HOLIDAY', label: 'NATIONAL HOLIDAY'},
    {id: 2, name: 'RELIGIOUS_HOLIDAY', label: 'RELIGIOUS HOLIDAY'},
    {id: 3, name: 'WORKING_DAY', label: 'WORKING DAY'},
    {id: 4, name: 'WEEKEND_DAY', label: 'WEEKEND DAY'},
  ]);

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

  useEffect(() => {
    getCalendar().then(r => {
      if (r.status === 200) {
        setCalendar(r.data);
      }
    })
  }, []);

  const previousYear = () => {
    setCurrentYear(currentYear - 1);
  };

  const nextYear = () => {
    setCurrentYear(currentYear + 1);
  };

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  const isToday = (day, month) => {
    const today = new Date();
    return today.getDate() === day &&
      today.getMonth() === month &&
      today.getFullYear() === currentYear;
  };

  const isWeekend = (day, month) => {
    const date = new Date(currentYear, month, day);
    const dayOfWeek = date.getDay();
    return dayOfWeek === 0 || dayOfWeek === 6;
  };

  const isDateUnavailable = (day, month) => {
    const dateFormatted = formattedDate(currentYear, month, day);
    return calendarChoose.some(date => date.date === dateFormatted);
  };

  const getClassForDay = (day, month) => {
    const status = getAvailabilityStatus(day, month);
    if (isWeekend(day, month)) return "text-gray-400";
    if (isToday(day, month)) return "bg-blue-200 text-blue-800 font-bold";
    if (isDateUnavailable(day, month)) return "bg-red-200 text-red-800";
    if (status === "NATIONAL_HOLIDAY") {
      return "cell-toil";
    } else if (status === "RELIGIOUS_HOLIDAY") {
      return "cell-deleted";
    }
    return "bg-green-100 text-green-800";
  };

  const getAvailabilityStatus = (day, currentMonth) => {
    const date = formatedDate(currentMonth, day);
    const targetDate = calendar.find((day) => {
      return day?.date === date
    });
    return targetDate?.type || "available";
  };

  // 2025-03-15
  const formatedDate = (date, day) => {
    const formattedMonth = parseInt(date) < 10 ? `0${date}` : date
    const formattedDay = parseInt(day) < 10 ? `0${day}` : day
    return currentYear + "-" + formattedMonth + "-" + formattedDay;
  }


  const handleClick = (year, month, day) => {

    const dateFormatted = formattedDate(year, month, day);
    const calendarId = calendar.find((date) => {
      return date.date === dateFormatted
    });

    setCalendarChoose(prevState => {
      const exist = prevState.some(item => item.date === dateFormatted);
      if (exist) {
        return prevState.filter(item => !(item.date === dateFormatted))
      } else {
        return [...prevState, {date: dateFormatted}]
      }
    });

    setCalendarData(prevState => {
      const exist = prevState.some(item => item?.id === calendarId?.id);
      if (exist) {
        return prevState.filter(item => !(item?.id === calendarId?.id))
      } else {
        return [...prevState, calendarId]
      }
    });
  }

  const formattedDate = (year, month, day) => {
    const date = new Date(year + 1, month - 1, day);
    return date.toISOString().split('T')[0];
  };

  const renderMonth = (monthIndex) => {
    const daysInMonth = getDaysInMonth(monthIndex, currentYear);
    const firstDay = getFirstDayOfMonth(monthIndex, currentYear);

    const blanks = Array(firstDay === 0 ? 6 : firstDay - 1).fill(null);
    const days = Array.from({length: daysInMonth}, (_, i) => i + 1);
    const allCells = [...blanks, ...days];

    const rows = [];
    let cells = [];

    allCells.forEach((day, i) => {
      if (i > 0 && i % 7 === 0) {
        rows.push(cells);
        cells = [];
      }
      cells.push(day);
    });

    if (cells.length > 0) {
      rows.push(cells);
    }

    const lastRow = rows[rows.length - 1];
    if (lastRow.length < 7) {
      const remainingBlanks = 7 - lastRow.length;
      rows[rows.length - 1] = [...lastRow, ...Array(remainingBlanks).fill(null)];
    }

    return (
      <div key={monthIndex} className="p-2 border rounded shadow bg-white">
        <h3 className="text-center font-bold mb-2">{months[monthIndex]}</h3>
        <div className="grid grid-cols-7 gap-1 text-xs">
          <div className="text-center font-medium">Mo</div>
          <div className="text-center font-medium">Tu</div>
          <div className="text-center font-medium">We</div>
          <div className="text-center font-medium">Th</div>
          <div className="text-center font-medium">Fr</div>
          <div className="text-center font-medium">Sa</div>
          <div className="text-center font-medium">Su</div>

          {rows.map((row, rowIndex) => (
            row.map((day, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`text-center p-1 rounded ${day ? getClassForDay(day, monthIndex) : ''} ${selectAction?.name ? 'cursor-pointer' : ''} `}
                onClick={() => selectAction?.name ? handleClick(currentYear, monthIndex, day) : null}
              >
                {day || ''}
              </div>
            ))
          ))}
        </div>
      </div>
    );
  };


  const handleChange = (event) => {
    setSelectAction(event.target.value);
  }

  const getStyles = (name, theme) => {
    return {
      display: 'block',
      width: '100%',
      padding: theme.spacing(1),
      backgroundColor: theme.palette.background.paper,
    };
  };

  function create() {
    setLoading(true)
    try {
      const updateData = calendarData.map(item => (
        {
          ...item,
          type: selectAction.name
        }
      ))

      updateData.forEach(item => {
        updateCalendarByType(item.id, item.type);
      })
    } catch (e) {
      setTimeout(() => setLoading(false), 3000);
    } finally {
      setTimeout(() => setLoading(false), 3000);
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="row justify-content-between">
        <div className="row col-md-6">
          <div className="col-md-6">
            <FormControl className="w-100 mb-2">
              <InputLabel id="demo-simple-select-autowidth-label">Working day type</InputLabel>
              <Select
                labelId="demo-simple-select-autowidth-label"
                id="demo-simple-select-autowidth"
                value={selectAction}
                onChange={handleChange}
                label="Free days type"
                className="w-100"
              >
                {type?.map((item, index) => (
                  <MenuItem value={item}
                            className="w-100"
                            style={getStyles(name, theme)}
                  >
                    <em>{item?.label?.toUpperCase()}</em>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </div>
        <div className="col-md-3">
          <Button variant="contained" className="p-3 w-100"
                  onClick={() => {
                    create();
                  }}>{"Save"}</Button>
        </div>
      </div>
      <div className="flex justify-between items-center mb-6 p-4">
        <button
          onClick={previousYear}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {currentYear - 1}
        </button>

        <h2 className="text-2xl font-bold">{currentYear}</h2>

        <button
          onClick={nextYear}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {currentYear + 1}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {months.map((_, index) => renderMonth(index))}
      </div>

      <div className="mt-6 flex justify-center gap-4">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-100 mr-2 rounded"></div>
          <span>Available</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-red-200 mr-2 rounded"></div>
          <span>Unavailable</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-blue-200 mr-2 rounded"></div>
          <span>Today</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-white border mr-2 rounded"></div>
          <span className="text-gray-400">Weekend</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 cell-toil border mr-2 rounded"></div>
          <span className="text-gray-400">NATIONAL HOLIDAY</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 cell-deleted border mr-2 rounded"></div>
          <span className="text-gray-400">RELIGIOUS HOLIDAY</span>
        </div>
      </div>

      {loading && (<FullPageLoader/>)}
    </div>
  );
};

export default YearlyAvailabilityCalendar;
