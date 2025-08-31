import React from 'react';
import './Alert.css';

const Alert = ({ alert }) => {
  if (!alert) return <div style={{ height: "50px" }}></div>;

  return (
    <div className={`alert-box ${alert.type}`}>
      <strong>{alert.type.charAt(0).toUpperCase() + alert.type.slice(1)}</strong>: {alert.msg}
    </div>
  );
};

export default Alert;
