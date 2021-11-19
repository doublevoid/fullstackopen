import React from 'react';
const Notification = ({ message }) => {
    console.log(typeof(message));
    if (message === null) {
        return null;
    }
    if(message.toLowerCase().includes('error')){
        return <div className="error">{message}</div>;
    }
    return <div className="notification">{message}</div>;
};

export default Notification; 