import React, { useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const PhoneNumberInput = ({handlePhoneNumberChange, phoneNumber}) => {
  
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <PhoneInput
        country="us"
        value={phoneNumber}
        onChange={handlePhoneNumberChange}
        placeholder="Enter phone number"
      />
    </div>
  );
};

export default PhoneNumberInput;