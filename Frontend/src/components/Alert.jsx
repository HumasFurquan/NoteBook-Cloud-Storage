export default function Alert({ alert }) {
  return (
    <div style={{ height: 50 }}>
      {alert && (
        <div className={`alert alert-${alert.type} m-2`} role="alert">
          <strong>{alert.type}</strong>: {alert.msg}
        </div>
      )}
    </div>
  );
}
