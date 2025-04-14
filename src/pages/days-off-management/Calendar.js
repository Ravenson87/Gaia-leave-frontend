import React, {useEffect, useState} from 'react';
import {getCalendar, updateCalendarByType} from "../../api/day-off-management/dayOffManagement";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Snackbar,
  TextField,
  Tooltip,
  Typography
} from "@mui/material";
import {ArrowBack, ArrowForward, Close, Event, Save} from '@mui/icons-material';

const YearlyAvailabilityCalendar = ({year = 2025}) => {
  const [currentYear, setCurrentYear] = useState(year);
  const [calendar, setCalendar] = useState([]);
  const [selectedDates, setSelectedDates] = useState([]);
  const [selectedType, setSelectedType] = useState(null);
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState("");
  const [open, setOpen] = useState(false);
  const [dateInfo, setDateInfo] = useState(null);
  const [notification, setNotification] = useState({open: false, message: "", severity: "success"});

  const dayTypes = [
    {id: 1, name: 'NATIONAL_HOLIDAY', label: 'National Holiday', color: '#FF9800'},
    {id: 2, name: 'RELIGIOUS_HOLIDAY', label: 'Religious Holiday', color: '#9C27B0'},
    {id: 3, name: 'WORKING_DAY', label: 'Working Day', color: '#4CAF50'}
  ];

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  useEffect(() => {
    fetchCalendarData();
  }, [currentYear]);

  const fetchCalendarData = () => {
    setLoading(true);
    getCalendar()
      .then(response => {
        if (response.status === 200) {
          setCalendar(response.data);
        }
      })
      .catch(error => {
        showNotification("Error", "error");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const showNotification = (message, severity = "success") => {
    setNotification({open: true, message, severity});
  };

  const handleCloseNotification = () => {
    setNotification({...notification, open: false});
  };

  const previousYear = () => {
    setCurrentYear(currentYear - 1);
    setSelectedDates([]);
  };

  const nextYear = () => {
    setCurrentYear(currentYear + 1);
    setSelectedDates([]);
  };

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    const firstDay = new Date(year, month, 1).getDay();
    return firstDay === 0 ? 6 : firstDay - 1;
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

  const formatDateString = (year, month, day) => {
    const formattedMonth = String(month + 1).padStart(2, '0');
    const formattedDay = String(day).padStart(2, '0');
    return `${year}-${formattedMonth}-${formattedDay}`;
  };

  const getDateInfo = (day, month) => {
    const dateString = formatDateString(currentYear, month, day);
    return calendar.find(item => item.date === dateString);
  };

  const getDayTypeName = (typeName) => {
    const type = dayTypes.find(t => t.name === typeName);
    return type ? type.label : "N/A";
  };

  const getDayTypeColor = (typeName) => {
    const type = dayTypes.find(t => t.name === typeName);
    return type ? type.color : "#E0E0E0";
  };

  const handleDayClick = (day, month) => {
    if (!day) return;

    const dateString = formatDateString(currentYear, month, day);
    const dateInfo = getDateInfo(day, month);

    if (dateInfo) {
      setDateInfo({
        ...dateInfo,
        label: getDayTypeName(dateInfo.type),
        formattedDate: new Date(dateInfo.date).toLocaleDateString('sr-RS'),
        day: new Date(dateInfo.date).getDate(),
        month: months[new Date(dateInfo.date).getMonth()]
      });
      setDescription(dateInfo.description || "");
      setOpen(true);
    } else {
      const isDateSelected = selectedDates.some(d => d.date === dateString);

      if (isDateSelected) {
        setSelectedDates(selectedDates.filter(d => d.date !== dateString));
      } else {
        setSelectedDates([...selectedDates, {date: dateString, day, month}]);
      }
    }
  };

  const handleDialogClose = () => {
    setOpen(false);
    setDateInfo(null);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const updateDateType = (id, type) => {
    setLoading(true);
    updateCalendarByType(id, type, description)
      .then(() => {
        showNotification("Successfully updated", "success");
        handleDialogClose();
        fetchCalendarData();
      })
      .catch(() => {
        showNotification("Error", "error");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const updateDateTypeWithoutApi = (id, newType) => {
    setSelectedType({id: id, type: newType})
    setCalendar(prevCalendar =>
      prevCalendar.map(day =>
        day.id === id ? {...day, type: newType} : day
      )
    );
  };

  const renderCalendarDay = (day, month) => {
    if (!day) return <div className="calendar-cell empty"></div>;

    const dateString = formatDateString(currentYear, month, day);
    const dateInfo = getDateInfo(day, month);
    const isSelected = selectedDates.some(d => d.date === dateString);

    let classes = "calendar-cell";
    let dayColor = "#000";
    let bgColor = "#fff";
    let borderColor = "#ddd";

    if (isToday(day, month)) {
      bgColor = "#BBDEFB";
      borderColor = "#2196F3";
    }

    if (isWeekend(day, month) && !dateInfo) {
      dayColor = "#9E9E9E";
      bgColor = "#F5F5F5";
    }

    if (dateInfo) {
      bgColor = getDayTypeColor(dateInfo.type);
      dayColor = "#fff";
    }

    if (isSelected) {
      borderColor = "#2196F3";
      bgColor = "#E3F2FD";
    }

    const style = {
      color: dayColor,
      backgroundColor: bgColor,
      borderColor: borderColor
    };

    const cellContent = (
      <div
        className={`calendar-cell ${isSelected ? 'selected' : ''}`}
        style={style}
        onClick={() => handleDayClick(day, month)}
      >
        <span>{day}</span>
        {dateInfo && (
          <Tooltip title={getDayTypeName(dateInfo.type)}>
            <div className="day-marker"></div>
          </Tooltip>
        )}
      </div>
    );

    // Ako postoji opis za taj datum, dodajemo tooltip
    if (dateInfo && dateInfo.description) {
      return (
        <Tooltip
          title={
            <div>
              <Typography variant="subtitle2">{getDayTypeName(dateInfo.type)}</Typography>
              <Typography variant="body2">{dateInfo.description}</Typography>
            </div>
          }
          arrow
          placement="top"
        >
          {cellContent}
        </Tooltip>
      );
    }

    return cellContent;
  };

  const renderMonth = (monthIndex) => {
    const daysInMonth = getDaysInMonth(monthIndex, currentYear);
    const firstDay = getFirstDayOfMonth(monthIndex, currentYear);

    const blanks = Array(firstDay).fill(null);
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

      if (cells.length < 7) {
        const remainingBlanks = 7 - cells.length;
        for (let i = 0; i < remainingBlanks; i++) {
          rows[rows.length - 1].push(null);
        }
      }
    }

    return (
      <div className="month-card">
        <Typography variant="h6" className="month-title">
          {months[monthIndex]}
        </Typography>
        <div className="weekdays-header">
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
          <div>Sun</div>
        </div>
        <div className="days-grid">
          {rows.map((row, rowIndex) => (
            <React.Fragment key={`row-${monthIndex}-${rowIndex}`}>
              {row.map((day, colIndex) => (
                <React.Fragment key={`cell-${monthIndex}-${rowIndex}-${colIndex}`}>
                  {renderCalendarDay(day, monthIndex)}
                </React.Fragment>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="yearly-calendar-container">
      {loading && (
        <div className="loading-overlay">
          <CircularProgress/>
        </div>
      )}

      <div className="calendar-header">
        <Typography variant="h4" component="h1">
          Calendar {currentYear}
        </Typography>

        <div className="year-navigation">
          <IconButton onClick={previousYear} color="primary" aria-label="Prethodna godina">
            <ArrowBack/>
          </IconButton>
          <Typography variant="h5" component="span">
            {currentYear}
          </Typography>
          <IconButton onClick={nextYear} color="primary" aria-label="Sledeća godina">
            <ArrowForward/>
          </IconButton>
        </div>
      </div>

      <div className="months-grid">
        {months.map((_, index) => (
          <React.Fragment key={`month-${index}`}>
            {renderMonth(index)}
          </React.Fragment>
        ))}
      </div>

      <div className="calendar-legend">
        <Typography variant="subtitle1" sx={{mb: 1}}>
          Legend:
        </Typography>
        <div className="legend-items">
          {dayTypes.map((type) => (
            <div key={type.id} className="legend-item">
              <Box sx={{width: 16, height: 16, borderRadius: '50%', backgroundColor: type.color}}/>
              <Typography variant="body2">{type.label}</Typography>
            </div>
          ))}
          <div className="legend-item">
            <Box sx={{width: 16, height: 16, borderRadius: '50%', backgroundColor: '#BBDEFB'}}/>
            <Typography variant="body2">Today</Typography>
          </div>
          <div className="legend-item">
            <Box sx={{
              width: 16,
              height: 16,
              borderRadius: '50%',
              backgroundColor: '#E3F2FD',
              border: '2px solid #2196F3'
            }}/>
            <Typography variant="body2">Choosen day</Typography>
          </div>
          <div className="legend-item">
            <Box sx={{
              width: 16,
              height: 16,
              position: 'relative',
              backgroundColor: '#fff',
              border: '1px dashed #2196F3'
            }}>
              <Box sx={{
                position: 'absolute',
                bottom: 0,
                width: '100%',
                height: '4px',
                backgroundColor: '#2196F3'
              }}/>
            </Box>
            <Typography variant="body2">Has description</Typography>
          </div>
        </div>
      </div>

      <Dialog open={open} onClose={handleDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
              <Event color="primary"/>
              <Typography variant="h6">
                {dateInfo?.day}. {dateInfo?.month} {currentYear}
              </Typography>
            </Box>
            <IconButton onClick={handleDialogClose}>
              <Close/>
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {dateInfo && (
            <>
              <Box sx={{mb: 2}}>
                <Typography variant="subtitle1" sx={{mb: 1}}>
                  Current status:
                </Typography>
                <Chip
                  label={dateInfo.label}
                  sx={{
                    backgroundColor: getDayTypeColor(dateInfo.type),
                    color: '#fff'
                  }}
                />
              </Box>

              <Typography variant="subtitle1" sx={{mb: 1}}>
                Change day type:
              </Typography>
              <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 1}}>
                {dayTypes.map((type) => (
                  <Chip
                    key={type.id}
                    label={type.label}
                    onClick={() => updateDateTypeWithoutApi(dateInfo.id, type.name)}
                    sx={{
                      backgroundColor: selectedType?.id === dateInfo?.id && selectedType?.type === type?.name
                        ? type.color
                        : selectedType ? 'transparent' : (type.name === dateInfo.type ? type.color : 'transparent'),
                      color: selectedType?.id === dateInfo?.id && selectedType?.type === type?.name
                        ? '#fff'
                        : (selectedType ? 'inherit' : (type.name === dateInfo.type ? '#fff' : 'inherit')),
                      border: selectedType?.id === dateInfo?.id && selectedType?.type === type?.name
                        ? `1px solid ${type.color}`
                        : (selectedType ? 'none' : (type.name !== dateInfo.type ? `1px solid ${type.color}` : 'none'))
                    }}
                  />
                ))}
              </Box>

              <TextField
                label="Description"
                multiline
                rows={3}
                value={description}
                onChange={handleDescriptionChange}
                fullWidth
                sx={{mt: 3}}
              />
            </>
          )}
        </DialogContent>
        <DialogActions sx={{padding: '16px 24px', gap: '12px', justifyContent: 'flex-end'}}>
          <Button
            onClick={handleDialogClose}
            variant="outlined"
            color="inherit"
            startIcon={<Close/>}
          >
            Close
          </Button>
          <Button
            onClick={() => {
              updateDateType(dateInfo.id, selectedType?.type || dateInfo.type);
            }}
            variant="contained"
            color="primary"
            startIcon={<Save/>}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={notification.open}
        autoHideDuration={5000}
        onClose={handleCloseNotification}
        anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
      >
        <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{width: '100%'}}>
          {notification.message}
        </Alert>
      </Snackbar>

      <style jsx>{`
        .yearly-calendar-container {
          position: relative;
          padding: 24px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .loading-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(255, 255, 255, 0.7);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .calendar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          flex-wrap: wrap;
          gap: 16px;
        }

        .year-navigation {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .control-panel {
          background-color: #f5f5f5;
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 24px;
        }

        .months-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 24px;
        }

        .month-card {
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        .month-title {
          background-color: #f5f5f5;
          padding: 12px;
          text-align: center;
          font-weight: 600;
        }

        .weekdays-header {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          text-align: center;
          font-weight: 500;
          border-bottom: 1px solid #eee;
          background-color: #fafafa;
        }

        .weekdays-header div {
          padding: 8px 0;
          font-size: 0.75rem;
        }

        .days-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
        }

        .calendar-cell {
          aspect-ratio: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          border: 1px solid #eee;
          position: relative;
          cursor: pointer;
          transition: all 0.2s;
        }

        .calendar-cell:hover {
          background-color: #f9f9f9;
          z-index: 1;
          transform: scale(1.05);
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
        }

        .calendar-cell.empty {
          background-color: #fafafa;
          cursor: default;
        }

        .calendar-cell.selected {
          border: 2px solid #2196F3;
        }

        .day-marker {
          position: absolute;
          bottom: 2px;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background-color: rgba(0, 0, 0, 0.3);
        }

        .calendar-legend {
          margin-top: 32px;
          background-color: #f5f5f5;
          border-radius: 8px;
          padding: 16px;
        }

        .legend-items {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        @media (max-width: 768px) {
          .year-navigation {
            width: 100%;
            justify-content: space-between;
          }

          .months-grid {
            grid-template-columns: 1fr;
          }
        }

        .has-description-indicator {
          position: absolute;
          bottom: 0;
          width: 100%;
          height: 3px;
          background-color: #2196F3;
        }
      `}</style>
    </div>
  );
};

export default YearlyAvailabilityCalendar;
