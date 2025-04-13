import React, {useEffect, useState} from 'react';
import {
  Alert,
  Avatar,
  Badge,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Snackbar,
  Typography
} from "@mui/material";
import {ArrowBack, ArrowForward, Close, Person} from '@mui/icons-material';
import {CButton} from "@coreui/react";

const EmployeeCalendarView = ({year = new Date().getFullYear(), initialData = [], close}) => {
  const [currentYear, setCurrentYear] = useState(year);
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [dayUsers, setDayUsers] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [notification, setNotification] = useState({open: false, message: "", severity: "success"});

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Process data when component mounts or initialData changes
  useEffect(() => {
    if (initialData && initialData.length > 0) {
      setData(initialData);
    }
  }, [initialData]);

  // Group data by date for efficient lookup
  const groupedByDate = data.reduce((acc, item) => {
    if (item && item.calendar && item.calendar.date) {
      const date = item.calendar.date;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(item);
    }
    return acc;
  }, {});

  useEffect(() => {
    setLoading(false);
  }, [currentYear]);

  const showNotification = (message, severity = "success") => {
    setNotification({open: true, message, severity});
  };

  const handleCloseNotification = () => {
    setNotification({...notification, open: false});
  };

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

  const getUsersForDate = (dateString) => {
    return groupedByDate[dateString] || [];
  };

  const getUniqueUserCount = (dateString) => {
    const users = getUsersForDate(dateString);
    const uniqueUserIds = [...new Set(users.map(item => item.user_id))];
    return uniqueUserIds.length;
  };

  const handleDayClick = (day, month) => {
    if (!day) return;

    const dateString = formatDateString(currentYear, month, day);
    const users = getUsersForDate(dateString);

    if (users.length > 0) {
      setDayUsers(users);
      setSelectedDate({day, month, year: currentYear, formattedDate: dateString});
      setOpen(true);
    }
  };

  const handleDialogClose = () => {
    setOpen(false);
    setDayUsers([]);
    setSelectedDate(null);
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 0:
        return {label: 'In progress', color: '#FFC107'};
      case 1:
        return {label: 'Approved', color: '#4CAF50'};
      case 2:
        return {label: 'Rejected', color: '#F44336'};
      default:
        return {label: 'Unknown', color: '#9E9E9E'};
    }
  };

  const renderCalendarDay = (day, month) => {
    if (!day) return <div className="calendar-cell empty"></div>;

    const dateString = formatDateString(currentYear, month, day);
    const userCount = getUniqueUserCount(dateString);

    let bgColor = "#fff";
    let borderColor = "#ddd";
    let dayColor = "#000";

    if (isToday(day, month)) {
      bgColor = "#BBDEFB";
      borderColor = "#2196F3";
    }

    if (isWeekend(day, month)) {
      dayColor = "#9E9E9E";
      bgColor = "#F5F5F5";
    }

    const style = {
      color: dayColor,
      backgroundColor: bgColor,
      borderColor: borderColor
    };

    return (
      <div
        className={`calendar-cell ${userCount > 0 ? 'has-users' : ''}`}
        style={style}
        onClick={() => handleDayClick(day, month)}
      >
        <span className="day-number">{day}</span>
        {userCount > 0 && (
          <Badge
            badgeContent={userCount}
            color="primary"
            className="user-badge"
          />
        )}
      </div>
    );
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

  const getUniqueUsers = (users) => {
    const uniqueUsers = {};
    users.forEach(item => {
      if (!uniqueUsers[item.user_id]) {
        uniqueUsers[item.user_id] = item;
      }
    });
    return Object.values(uniqueUsers);
  };

  return (
    <div className="employee-calendar-container">
      {loading && (
        <div className="loading-overlay">
          <CircularProgress/>
        </div>
      )}

      <div className="calendar-header">
        <div className="year-navigation">
          <IconButton onClick={previousYear} color="primary" aria-label="Previous year">
            <ArrowBack/>
          </IconButton>
          <Typography variant="h5" component="span">
            {currentYear}
          </Typography>
          <IconButton onClick={nextYear} color="primary" aria-label="Next year">
            <ArrowForward/>
          </IconButton>
        </div>
        <CButton color="secondary" onClick={() => close(false)}>
          Close
        </CButton>
      </div>

      <div className="months-grid">
        {months.map((_, index) => (
          <React.Fragment key={`month-${index}`}>
            {renderMonth(index)}
          </React.Fragment>
        ))}
      </div>

      <Dialog open={open} onClose={handleDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
              <Person color="primary"/>
              <Typography variant="h6">
                {selectedDate && `${selectedDate.day} ${months[selectedDate.month]} ${selectedDate.year}`}
              </Typography>
            </Box>
            <Chip
              label={`${getUniqueUsers(dayUsers).length} Employee${getUniqueUsers(dayUsers).length !== 1 ? 's' : ''}`}
              color="primary"
              size="small"
            />
            <IconButton onClick={handleDialogClose}>
              <Close/>
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <List>
            {getUniqueUsers(dayUsers).map((item, index) => (
              <React.Fragment key={`user-${item.user_id}`}>
                <ListItem alignItems="flex-start">
                  <ListItemAvatar>
                    <Avatar
                      src={item.user.profile_image}
                      alt={`${item.user.first_name} ${item.user.last_name}`}
                    >
                      {item.user.first_name[0]}{item.user.last_name[0]}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                        <Typography variant="subtitle1">
                          {item.user.first_name} {item.user.last_name}
                        </Typography>
                        <Chip
                          label={getStatusLabel(item.status).label}
                          size="small"
                          sx={{
                            backgroundColor: getStatusLabel(item.status).color,
                            color: '#fff'
                          }}
                        />
                      </Box>
                    }
                    secondary={
                      <>
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.primary"
                        >
                          {`Job position: ${item.user.job_position_id}`}
                        </Typography>
                        {item.user.role && (
                          <Typography component="p" variant="body2">
                            Role: {item.user.role.name}
                          </Typography>
                        )}
                        {item.description && (
                          <Typography component="p" variant="body2">
                            Description: {item.description}
                          </Typography>
                        )}
                      </>
                    }
                  />
                </ListItem>
                {index < getUniqueUsers(dayUsers).length - 1 && <Divider variant="inset" component="li"/>}
              </React.Fragment>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Close
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
        .employee-calendar-container {
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

        .calendar-cell.has-users {
          font-weight: bold;
        }

        .day-number {
          position: absolute;
          top: 5px;
          left: 5px;
          font-size: 0.8rem;
        }

        .user-badge {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
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
      `}</style>
    </div>
  );
};
export default EmployeeCalendarView
