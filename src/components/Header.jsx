import './Header.css';

export default function Header({ carCount }) {
  return (
    <header className="header">
      <div className="header-inner">
        <div className="header-logo">
          <span className="logo-icon">🚗</span>
          <div>
            <h1 className="logo-title">Hannan Autot</h1>
            <p className="logo-subtitle">Perheautot yhdessä paikassa</p>
          </div>
        </div>
        <div className="header-stats">
          <div className="stat-badge">
            <span className="stat-number">{carCount}</span>
            <span className="stat-label">Autoa</span>
          </div>
        </div>
      </div>
    </header>
  );
}
