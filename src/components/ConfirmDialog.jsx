import './ConfirmDialog.css';

export default function ConfirmDialog({ car, onConfirm, onCancel }) {
  if (!car) return null;
  return (
    <div className="confirm-overlay" onClick={e => e.target === e.currentTarget && onCancel()}>
      <div className="confirm-box">
        <div className="confirm-icon">🗑️</div>
        <h3 className="confirm-title">Poista auto?</h3>
        <p className="confirm-text">
          Haluatko varmasti poistaa auton <strong>{car.make} {car.model}</strong> ({car.year})?<br />
          Tätä toimintoa ei voi peruuttaa.
        </p>
        <div className="confirm-actions">
          <button className="conf-cancel" onClick={onCancel}>Peruuta</button>
          <button className="conf-delete" onClick={onConfirm}>Poista</button>
        </div>
      </div>
    </div>
  );
}
