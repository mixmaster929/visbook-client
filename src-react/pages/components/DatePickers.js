import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import images from "./Images";
// import "./styles.css";

const DatePickers = (props) => {
  const today = new Date();

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
            onMonthChange={props.handleEndMonthChange}
            icon={<img src={images.arrow} className="calendar-icon" />}
          />
        </div>
      </div>
    </div>
  );
};

export default DatePickers;
