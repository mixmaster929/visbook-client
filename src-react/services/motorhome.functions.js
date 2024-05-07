import moment from "moment";

const getAllDatesBetweenMonths = (startMonth, endMonth) => {
  const startMoment = moment(startMonth, 'YYYY-MM-DD');
  const endMoment = moment(endMonth, 'YYYY-MM-DD');
  const allDates = [];
  let currentMoment = startMoment.clone();
  
  while (currentMoment.isSameOrBefore(endMoment, 'day')) {
    allDates.push(currentMoment.format('YYYY-MM-DD'));
    currentMoment.add(1, 'day');
  }

  return allDates?.length-1;
};

const getObjectPropertyValue = (obj, key) =>{
  return obj[key];
}

const MotorHomeFunctions = {
  getAllDatesBetweenMonths,
  getObjectPropertyValue
}

export default MotorHomeFunctions;