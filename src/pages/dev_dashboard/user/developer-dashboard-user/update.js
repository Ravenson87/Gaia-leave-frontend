import React, {useEffect, useState} from 'react';
import {getCalendar, getFreeDayType} from "../../../../api/day-off-management/dayOffManagement";
import {getJobPosition} from "../../../../api/jobPosition";
import {getRole} from "../../../../api/role";
import ProfileDaysOff from "../../../days-off-management/ProfileDaysOff";

const UpdateUser = ({setUpdateModal, get, editData}) => {
  const [freeDayTypes, setFreeDayTypes] = useState([]);
  const [jobPositionData, setJobPositionData] = useState([]);
  const [roleData, setRoleData] = useState([]);
  const [calendarData, setCalendarData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);


  const fetchData = () => {

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

  return (
    <>
      <ProfileDaysOff userData={editData}
                      freeDayTypes={freeDayTypes}
                      jobPositionData={jobPositionData}
                      roleData={roleData}
                      calendarData={calendarData}
                      setVisible={setUpdateModal}
      />
    </>
  );
};

export default UpdateUser;
