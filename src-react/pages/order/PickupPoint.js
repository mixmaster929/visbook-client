// src-react/pages/order/PickupPoint.js
import React from 'react';
import PickUp from '../components/Pickup';

const PickupPoint = ({ currentLocation, onPickupPoint }) => {
  return (
    <div className="pickup-point p-5 pt-2">
      <PickUp current={currentLocation} onClickSelect={onPickupPoint} />
    </div>
  );
};

export default PickupPoint;
