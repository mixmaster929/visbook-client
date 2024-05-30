import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import images from "./Images";

const DatePickers = (props) => {
  const today = new Date();
  today.setDate(today.getDate() + 7);

  const isWeekday = (date) => {
    const day = date.getDay();
    return day !== 0 && day !== 6;
  };

  return (
    <div className="date-pickers">
      <div className="d-flex flex-row">
        <div className="col-6">
          <DatePicker
            showIcon
            placeholderText="From"
            className="myDatePicker"
            onChange={(date) => props.setStartDate(date)}
            selected={props.startDate}
            startDate={props.startDate}
            minDate={today}
            filterDate={isWeekday}
            onMonthChange={props.handleStartMonthChange}
            icon={<img src={images.calendar} className="calendar-icon" />}
          />
        </div>
        <div className="col-6 border-start">
          <DatePicker
            showIcon
            selectsEnd
            selected={props.endDate}
            className="myDatePicker"
            placeholderText="To"
            onChange={(date) => props.setEndDate(date)}
            endDate={props.endDate}
            startDate={props.startDate}
            minDate={props.startDate}
            filterDate={isWeekday}
            onMonthChange={props.handleEndMonthChange}
            icon={<img src={images.arrow} className="calendar-icon" />}
          />
        </div>
      </div>
    </div>
  );
};

export default DatePickers;