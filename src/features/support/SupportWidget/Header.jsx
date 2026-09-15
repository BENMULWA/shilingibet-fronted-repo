export default function Header() {
  return (
    <div className="support-header">
      {/* Top Row: Logo + Avatars */}
      <div className="support-header-top">
        {/* Logo */}
        <div className="support-header-logo">
          <img src="/shilingibet.png" alt="logo" />
        </div>

        {/* Avatars - Support Team */}
        <div className="support-header-avatars">
          <div className="support-avatar">N1</div>
          <div className="support-avatar">N2</div>
          <div className="support-avatar">N3</div>
          <div className="support-status">
            <span className="support-status-dot"></span>
            <span className="support-status-text">Online</span>
          </div>
        </div>
      </div>

      {/* Greeting */}
      <h1 className="support-header-greeting">
        Hi there! <span>👋</span>
      </h1>

      <p className="support-header-subtitle">How can we help you today?</p>
    </div>
  );
}
