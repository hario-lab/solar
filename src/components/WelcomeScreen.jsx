export default function WelcomeScreen({ onDismiss }) {
  return (
    <div
      onClick={onDismiss}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        background: "rgba(7,12,18,0.96)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        backdropFilter: "blur(4px)",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "#0d1117",
          border: "1px solid #1e2d3d",
          borderRadius: 12,
          padding: "40px 36px",
          maxWidth: 520,
          width: "100%",
          boxShadow: "0 24px 64px #000000cc",
          textAlign: "center",
          fontFamily: "monospace",
        }}
      >
        {/* Logo */}
        <div style={{ color: "#00ff88", fontSize: 26, fontWeight: "bold", letterSpacing: 5, marginBottom: 6 }}>
          ◈ SOLAR
        </div>
        <div style={{ color: "#4a6378", fontSize: 11, letterSpacing: 2, marginBottom: 28 }}>
          Structured Online Lateral Attack Reconnaissance
        </div>

        {/* Divider */}
        <div style={{ borderTop: "1px solid #1e2d3d", marginBottom: 24 }} />

        {/* English description */}
        <div style={{ color: "#8b949e", fontSize: 13, lineHeight: 1.8, marginBottom: 8 }}>
          Explore APT group tactics and techniques<br />
          based on MITRE ATT&amp;CK data.
        </div>
        <div style={{
          color: "#ff69b4",
          fontSize: 13,
          fontWeight: "bold",
          letterSpacing: 1,
          marginBottom: 24,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
        }}>
          <span>Tap Filter by Origin to get started</span>
        </div>

        {/* Divider */}
        <div style={{ borderTop: "1px solid #1e2d3d", marginBottom: 24 }} />

        {/* Japanese description */}
        <div style={{ color: "#8b949e", fontSize: 13, lineHeight: 1.8, marginBottom: 8 }}>
          MITRE ATT&amp;CKデータをもとに、APTグループの<br />
          戦術・テクニックを可視化するツールです。
        </div>
        <div style={{
          color: "#ff69b4",
          fontSize: 13,
          fontWeight: "bold",
          letterSpacing: 0.5,
          marginBottom: 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
        }}>
          <span>画面左上のフィルターから国・グループを選択してください</span>
        </div>

        {/* CTA button */}
        <button
          onClick={onDismiss}
          style={{
            background: "#00ff88",
            border: "none",
            borderRadius: 6,
            padding: "12px 40px",
            color: "#0d1117",
            fontSize: 13,
            fontWeight: "bold",
            letterSpacing: 2,
            cursor: "pointer",
            fontFamily: "monospace",
            transition: "opacity 0.15s",
          }}
          onMouseEnter={e => { e.currentTarget.style.opacity = "0.85"; }}
          onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
        >
          GET STARTED →
        </button>

        <div style={{ color: "#3d5168", fontSize: 10, marginTop: 16 }}>
          Powered by MITRE ATT&amp;CK®
        </div>
      </div>
    </div>
  );
}
