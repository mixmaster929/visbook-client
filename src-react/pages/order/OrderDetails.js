// src-react/pages/order/OrderDetails.js
import React from 'react';

const OrderDetails = ({ formData, onChangeclickHandler, isEmailValid }) => {
  return (
    <div className="col-md-7 d-flex flex-column pt-3">
      <select className="p-2 mt-2 w-25 form-select" name="gender" value={formData.gender} onChange={onChangeclickHandler}>
        <option value="0">Mr.</option>
        <option value="1">Mrs.</option>
      </select>
      <input className="mt-2 w-75" type="text" placeholder="Name" name="name" value={formData.name} onChange={onChangeclickHandler} />
      <input className="mt-2 w-75" type="text" name="surname" value={formData.surname} placeholder="Surname" onChange={onChangeclickHandler} />
      <input className="mt-2 w-75" type="text" name="address" value={formData.address} placeholder="Address" onChange={onChangeclickHandler} />
      <select className="country p-2 mt-2 w-50 form-select" name="country" value={formData.country} onChange={onChangeclickHandler}>
        <option value="Norway">Norway</option>
        <option value="German">Germany</option>
        <option value="Sweden">Sweden</option>
      </select>
      <input className="mt-2 w-75" type="text" value={formData.cell} placeholder="Cell" name="cell" onChange={onChangeclickHandler} />
      <input className="mt-2 w-75" type="email" value={formData.mail} name="mail" placeholder="Mail" onChange={onChangeclickHandler} />
      {!isEmailValid && <p style={{ color: 'red' }}>Invalid email address</p>}
      <input className="mt-2 w-75" type="email" value={formData.repeatmail} name="repeatmail" placeholder="Repeat mail" onChange={onChangeclickHandler} />
      <div className="mb-3 text-box pt-3">
        <label htmlFor="notes" className="form-label"></label>
        <textarea className="form-control notes" name="message" value={formData.message} onChange={onChangeclickHandler} id="notes" rows="8" placeholder="Notes (optional)"></textarea>
      </div>
    </div>
  );
};

export default OrderDetails;