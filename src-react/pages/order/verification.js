import React from "react";
import PhoneNumberInput from "./PhoneNumberInput";

const Verification = ({status, phoneNumber, handlePhoneNumberChange, isEmailValid, conifirmEmail, statusHandler, onChangeEmailHandler, onChangePhoneHandler, onChangeConfirmHandler}) => {

    return(
        <div className="bg-white confirm-code-form p-5">
            {status === 1? <p className="motorhome-text1">Receive a code to confirm</p> : <p className="motorhome-text1">Confirm width code</p>}
            <div className="verification">
                <h4 className="mt-3 motorhome-text2">Please verify <b>one</b> of the following to continue</h4>
                <div className="row mt-3">
                    <div className="col-md-6">
                        <div className="motorhome-text2">Your e-mail address</div>
                        <input type="text" value={conifirmEmail} placeholder="E-mail" onChange={(e) => onChangeEmailHandler(e.target.value)} />
                        {!isEmailValid && <p style={{ color: 'red' }}>Invalid email address</p>}
                    </div>
                    <div className="col-md-6">
                        <div className="motorhome-text2">Your phone number</div>
                        {/* <input type="text" placeholder="E-mail" onChange={(e) => onChangePhoneHandler(e.target.value)} /> */}
                        <PhoneNumberInput handlePhoneNumberChange={handlePhoneNumberChange} phoneNumber={phoneNumber} />
                    </div>
                </div>
                <div>
                    {status === 1? <button className="mt-4 mb-5 motorhome-button motorhome-order-confirm-button" onClick={() => statusHandler(2)}>Send code</button> : <button className="mt-4 mb-5 motorhome-button motorhome-order-confirm-button number-persons-confirm" onClick={() => statusHandler(3)}>Re-send code</button>}
                </div>
            </div>
            {(status === 2 || status === 3) && <>
            <hr />
            <div className="verification">
                <div className="motorhome-text2">Please enter the code your received</div>
                <div><input type="text" placeholder="Code" onChange={(e) => onChangeConfirmHandler(e.target.value)} /></div>
                <div><button className="mt-4 motorhome-button motorhome-order-confirm-button" onClick={() => statusHandler(4)}>Confirm</button></div>
            </div></>}
        </div>
    );
}

export default Verification