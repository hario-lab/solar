import { useState, useCallback } from "react";
import { COUNTRY_META, TACTIC_ORDER, TACTIC_SHORT } from "./constants.js";
import { useAttackData } from "./hooks/useAttackData.js";
import { useSound } from "./hooks/useSound.js";
import { useWindowSize } from "./hooks/useWindowSize.js";
import SoundControl from "./components/SoundControl.jsx";
import Sidebar from "./components/Sidebar.jsx";
import ResizableHandle from "./components/ResizableHandle.jsx";
import NetworkGraph from "./components/NetworkGraph.jsx";
import DataUpdateModal from "./components/DataUpdateModal.jsx";
import SettingsModal from "./components/SettingsModal.jsx";
import AboutModal from "./components/AboutModal.jsx";
import KillChain from "./views/KillChain.jsx";
import ImpactAnalysis from "./views/ImpactAnalysis.jsx";
import DefenseGapMap from "./views/DefenseGapMap.jsx";
import ThreatBriefing from "./views/ThreatBriefing.jsx";

const TABS = [
  ["killchain",  "⬛ KILL CHAIN"],
  ["network",    "◉ NETWORK"],
  ["impact",     "⚡ IMPACT"],
  ["defense",    "🛡 DEFENSE"],
  ["briefing",   "🤖 AI BRIEF"],
];

const SIDEBAR_KEY = "solar_sidebar_w";
const SIDEBAR_MIN = 160;
const SIDEBAR_MAX = 400;

function clamp(v, min, max) { return Math.min(Math.max(v, min), max); }

function loadSidebarW(fallback) {
  try { const v = parseInt(localStorage.getItem(SIDEBAR_KEY)); return isNaN(v) ? fallback : clamp(v, SIDEBAR_MIN, SIDEBAR_MAX); } catch { return fallback; }
}

export default function App() {
  const { groups, links, techniques, metadata, loading, error, isStale, triggerUpdate } = useAttackData();
  const { soundType, setSoundType, playClick, SOUND_TYPES } = useSound();
  const { isMobile, isTablet, isDesktop } = useWindowSize();

  const [selId, setSelId]             = useState(null);
  const [view, setView]               = useState("killchain");
  const [search, setSearch]           = useState("");
  const [selectedCountries, setSelectedCountries] = useState(new Set());
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateLoading, setUpdateLoading]   = useState(false);
  const [showSettings, setShowSettings]     = useState(false);
  const [showAbout, setShowAbout]           = useState(false);
  const [sidebarOpen, setSidebarOpen]       = useState(false);
  const [showTabMenu, setShowTabMenu]       = useState(false);
  const [showToolMenu, setShowToolMenu]     = useState(false);

  const defaultSidebarW = isTablet ? 200 : 230;
  const [sidebarW, setSidebarW] = useState(() => loadSidebarW(defaultSidebarW));

  const handleSidebarDrag = useCallback((delta) => {
    setSidebarW(w => {
      const next = clamp(w + delta, SIDEBAR_MIN, SIDEBAR_MAX);
      try { localStorage.setItem(SIDEBAR_KEY, String(next)); } catch {}
      return next;
    });
  }, []);

  const effectiveSelId = selId || groups[0]?.id;
  const group = groups.find(g => g.id === effectiveSelId);

  const handleSelect = id => { setSelId(id); if (!isDesktop) setSidebarOpen(false); };

  const handleUpdate = async source => {
    setUpdateLoading(true);
    await triggerUpdate(source);
    setUpdateLoading(false);
    setShowUpdateModal(false);
  };

  const fmtDate = ts => ts ? new Date(ts).toLocaleDateString("ja-JP", { year:"numeric", month:"2-digit", day:"2-digit" }) : null;

  const toggleCountry = code => {
    if (code === "ALL") { setSelectedCountries(new Set()); return; }
    setSelectedCountries(prev => {
      const next = new Set(prev);
      next.has(code) ? next.delete(code) : next.add(code);
      return next;
    });
  };

  const networkGroups = selectedCountries.size === 0 ? groups : groups.filter(g => selectedCountries.has(g.country?.code));

  const showSidebar = view === "killchain" || view === "network";

  return (
    <div style={{ height: "100dvh", overflow: "hidden", background: "#070c12", color: "#c9d1d9", fontFamily: "monospace", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ background: "#0d1117", borderBottom: "1px solid #1e2d3d", flexShrink: 0 }}>
        {/* Row 1: logo + controls */}
        <div style={{ padding: "8px 12px", display: "flex", alignItems: "center", gap: 8 }}>
          {showSidebar && !isDesktop && (
            <button onClick={() => setSidebarOpen(o => !o)}
              style={{ background: "transparent", border: "1px solid #1e2d3d", borderRadius: 4, padding: "5px 9px", color: "#4a6378", cursor: "pointer", fontSize: 14, fontFamily: "monospace", flexShrink: 0 }}>
              ☰
            </button>
          )}
          <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.2, flexShrink: 0 }}>
            <div style={{ color: "#00ff88", fontWeight: "bold", fontSize: 13, letterSpacing: 3 }}>◈ SOLAR</div>
            <div style={{ color: "#8b949e", fontSize: 9, letterSpacing: 1, whiteSpace: "nowrap" }}>Structured Online Lateral Attack Reconnaissance</div>
          </div>
          {isDesktop && (
            <div style={{ color: "#3d5168", fontSize: 11, flexShrink: 0, marginLeft: 8 }}>MITRE ATT&CK® · {loading ? "…" : groups.length} groups</div>
          )}
          {metadata?.lastUpdated && isDesktop && (
            <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
              {isStale && (
                <span style={{ background: "#f59e0b22", border: "1px solid #f59e0b55", borderRadius: 3, padding: "2px 6px", color: "#f59e0b", fontSize: 9, letterSpacing: 1 }}>
                  ⚠ STALE
                </span>
              )}
              <span style={{ color: "#3d5168", fontSize: 10 }}>{fmtDate(metadata.lastUpdated)}</span>
            </div>
          )}
          {/* Desktop: ↻ ⚙ ⓘ + Sound individually */}
          {isDesktop ? (
            <div style={{ marginLeft: "auto", display: "flex", gap: 4, alignItems: "center" }}>
              <button onClick={() => { playClick(); setShowUpdateModal(true); }}
                style={{ background: isStale ? "#f59e0b22" : "transparent", border: `1px solid ${isStale ? "#f59e0b" : "#1e2d3d"}`, borderRadius: 4, padding: "4px 10px", fontSize: 11, color: isStale ? "#f59e0b" : "#4a6378", cursor: "pointer", fontFamily: "monospace" }}>
                ↻
              </button>
              <button onClick={() => { playClick(); setShowSettings(true); }}
                style={{ background: "transparent", border: "1px solid #1e2d3d", borderRadius: 4, padding: "4px 10px", fontSize: 11, color: "#4a6378", cursor: "pointer", fontFamily: "monospace" }}>
                ⚙
              </button>
              <button onClick={() => { playClick(); setShowAbout(true); }}
                style={{ background: "transparent", border: "1px solid #1e2d3d", borderRadius: 4, padding: "4px 10px", fontSize: 11, color: "#4a6378", cursor: "pointer", fontFamily: "monospace" }}>
                ⓘ
              </button>
              <SoundControl soundType={soundType} setSoundType={setSoundType} playClick={playClick} SOUND_TYPES={SOUND_TYPES} />
            </div>
          ) : (
            /* Tablet/Mobile: Sound center + collapsed tool menu + tab menu */
            <div style={{ marginLeft: "auto", display: "flex", gap: 4, alignItems: "center" }}>
              {isStale && (
                <span style={{ background: "#f59e0b22", border: "1px solid #f59e0b55", borderRadius: 3, padding: "2px 6px", color: "#f59e0b", fontSize: 9 }}>⚠</span>
              )}
              {/* Sound selector — center-ish */}
              <SoundControl soundType={soundType} setSoundType={setSoundType} playClick={playClick} SOUND_TYPES={SOUND_TYPES} />
              {/* Collapsed tool menu: ↻ ⚙ ⓘ */}
              <div style={{ position: "relative" }}>
                <button onClick={() => { setShowToolMenu(o => !o); setShowTabMenu(false); }}
                  style={{ background: showToolMenu ? "#1e2d3d" : "transparent", border: "1px solid #1e2d3d", borderRadius: 4, padding: "4px 10px", fontSize: 11, color: "#4a6378", cursor: "pointer", fontFamily: "monospace" }}>
                  ⚙
                </button>
                {showToolMenu && (
                  <>
                    <div onClick={() => setShowToolMenu(false)} style={{ position: "fixed", inset: 0, zIndex: 40 }} />
                    <div style={{ position: "absolute", top: "calc(100% + 6px)", right: 0, zIndex: 50, background: "#0d1117", border: "1px solid #1e2d3d", borderRadius: 6, overflow: "hidden", minWidth: 160, boxShadow: "0 8px 24px #00000088" }}>
                      <button onClick={() => { playClick(); setShowUpdateModal(true); setShowToolMenu(false); }}
                        style={{ display: "block", width: "100%", textAlign: "left", background: isStale ? "#f59e0b11" : "transparent", border: "none", borderBottom: "1px solid #1e2d3d", padding: "11px 14px", color: isStale ? "#f59e0b" : "#8b949e", cursor: "pointer", fontSize: 12, fontFamily: "monospace" }}>
                        ↻ データ更新
                      </button>
                      <button onClick={() => { playClick(); setShowSettings(true); setShowToolMenu(false); }}
                        style={{ display: "block", width: "100%", textAlign: "left", background: "transparent", border: "none", borderBottom: "1px solid #1e2d3d", padding: "11px 14px", color: "#8b949e", cursor: "pointer", fontSize: 12, fontFamily: "monospace" }}>
                        ⚙ 設定
                      </button>
                      <button onClick={() => { playClick(); setShowAbout(true); setShowToolMenu(false); }}
                        style={{ display: "block", width: "100%", textAlign: "left", background: "transparent", border: "none", padding: "11px 14px", color: "#8b949e", cursor: "pointer", fontSize: 12, fontFamily: "monospace" }}>
                        ⓘ About
                      </button>
                    </div>
                  </>
                )}
              </div>
              {/* Tab menu */}
              <div style={{ position: "relative" }}>
                <button onClick={() => { setShowTabMenu(o => !o); setShowToolMenu(false); }}
                  style={{ background: showTabMenu ? "#00ff8822" : "transparent", border: `1px solid ${showTabMenu ? "#00ff88" : "#1e2d3d"}`, borderRadius: 4, padding: "4px 10px", fontSize: 13, color: showTabMenu ? "#00ff88" : "#4a6378", cursor: "pointer", fontFamily: "monospace" }}>
                  ≡
                </button>
                {showTabMenu && (
                  <>
                    <div onClick={() => setShowTabMenu(false)} style={{ position: "fixed", inset: 0, zIndex: 40 }} />
                    <div style={{ position: "absolute", top: "calc(100% + 6px)", right: 0, zIndex: 50, background: "#0d1117", border: "1px solid #1e2d3d", borderRadius: 6, overflow: "hidden", minWidth: 180, boxShadow: "0 8px 24px #00000088" }}>
                      {TABS.map(([v, label]) => (
                        <button key={v} onClick={() => { playClick(); setView(v); setShowTabMenu(false); }}
                          style={{ display: "block", width: "100%", textAlign: "left", background: view === v ? "#00ff8822" : "transparent", border: "none", borderBottom: "1px solid #1e2d3d", padding: "12px 16px", color: view === v ? "#00ff88" : "#8b949e", cursor: "pointer", fontSize: 13, fontFamily: "monospace", letterSpacing: 1 }}>
                          {label}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
        {/* Row 2: inline tabs — desktop only */}
        {isDesktop && (
          <div style={{ display: "flex", gap: 4, padding: "0 12px 7px" }}>
            {TABS.map(([v, label]) => (
              <button key={v} onClick={() => { playClick(); setView(v); }}
                style={{ background: view === v ? "#00ff8822" : "transparent", border: `1px solid ${view === v ? "#00ff88" : "#1e2d3d"}`, borderRadius: 4, padding: "4px 12px", fontSize: 11, color: view === v ? "#00ff88" : "#4a6378", cursor: "pointer", fontFamily: "monospace", letterSpacing: 1, transition: "all 0.15s", whiteSpace: "nowrap", flexShrink: 0 }}>
                {label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Error banner */}
      {error && (
        <div style={{ background: "#ef444422", borderBottom: "1px solid #ef4444", padding: "8px 20px", color: "#ef4444", fontSize: 11 }}>
          ⚠ {error}
        </div>
      )}

      {/* Loading state */}
      {loading && !groups.length && (
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#3d5168", fontSize: 13 }}>
          Loading ATT&CK data...
        </div>
      )}

      {/* Main layout */}
      {!!groups.length && (
        <div style={{ display: "flex", flex: 1, overflow: "hidden", position: "relative" }}>
          {/* Overlay backdrop (mobile + tablet) */}
          {!isDesktop && sidebarOpen && showSidebar && (
            <div onClick={() => setSidebarOpen(false)}
              style={{ position: "absolute", inset: 0, background: "#00000088", zIndex: 20 }} />
          )}

          {/* Sidebar */}
          {showSidebar && (
            <>
              {!isDesktop ? (
                sidebarOpen && (
                  <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, zIndex: 30, display: "flex" }}>
                    <Sidebar
                      groups={groups}
                      selId={effectiveSelId}
                      onSelect={handleSelect}
                      search={search}
                      onSearch={setSearch}
                      selectedCountries={selectedCountries}
                      onCountryToggle={toggleCountry}
                      playClick={playClick}
                      width={300}
                      onClose={() => setSidebarOpen(false)}
                    />
                  </div>
                )
              ) : (
                <>
                  <Sidebar
                    groups={groups}
                    selId={effectiveSelId}
                    onSelect={handleSelect}
                    search={search}
                    onSearch={setSearch}
                    selectedCountries={selectedCountries}
                    onCountryToggle={toggleCountry}
                    playClick={playClick}
                    width={sidebarW}
                  />
                  <ResizableHandle onDrag={handleSidebarDrag} />
                </>
              )}
            </>
          )}

          {/* Content area */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            {view === "killchain" && (
              <KillChain group={group} groups={groups} onSelectGroup={handleSelect} playClick={playClick} />
            )}

            {view === "network" && (
              <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
                <div style={{ flex: 1, position: "relative", background: "#070c12" }}>
                  <div style={{ position: "absolute", top: 10, right: 10, zIndex: 10, background: "#0d1117cc", border: "1px solid #1e2d3d", borderRadius: 5, padding: "6px 8px" }}>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 8px", maxWidth: 140 }}>
                      {Object.entries(COUNTRY_META).map(([code, m]) => (
                        <div key={code} style={{ display: "flex", alignItems: "center", gap: 3 }}>
                          <div style={{ width: 7, height: 7, borderRadius: "50%", background: m.color + "55", border: `1.5px solid ${m.color}`, flexShrink: 0 }} />
                          <span style={{ fontSize: 9, color: "#6b7280", whiteSpace: "nowrap" }}>{m.flag} {code}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  {group && (
                    <div style={{ position: "absolute", top: 12, left: 12, zIndex: 10, background: "#0d1117ee", border: "1px solid #00ff8833", borderRadius: 6, padding: "10px 14px", maxWidth: 220 }}>
                      <div style={{ color: "#00ff88", fontWeight: "bold", fontSize: 12 }}>{group.country?.flag} {group.name}</div>
                      <div style={{ color: "#3d5168", fontSize: 10, marginBottom: 6 }}>{group.id}</div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, paddingBottom: 4, borderBottom: "1px solid #1e2d3d" }}>
                        <span style={{ fontSize: 9, color: "#3d5168" }}>関連グループ</span>
                        <span style={{ fontSize: 9, color: "#3d5168" }}>共有テクニック数</span>
                      </div>
                      {links
                        .filter(l => (l.source === effectiveSelId || l.target === effectiveSelId) && l.value >= 5)
                        .slice(0, 6)
                        .map(l => {
                          const oid = l.source === effectiveSelId ? l.target : l.source;
                          const g2 = groups.find(g => g.id === oid);
                          return g2 ? (
                            <div key={oid} onClick={() => handleSelect(oid)}
                              style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: "1px solid #1e2d3d", cursor: "pointer" }}
                              onMouseEnter={e => e.currentTarget.style.opacity = "0.6"}
                              onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
                              <span style={{ fontSize: 11, color: "#8b949e" }}>{g2.country?.flag} {g2.name}</span>
                              <span style={{ fontSize: 11, color: "#00ff88", fontWeight: "bold" }}>{l.value}</span>
                            </div>
                          ) : null;
                        })
                      }
                    </div>
                  )}
                  <NetworkGraph
                    groups={networkGroups}
                    links={links}
                    onSelectGroup={handleSelect}
                    selId={effectiveSelId}
                    playClick={playClick}
                  />
                </div>
              </div>
            )}

            {view === "impact" && (
              <ImpactAnalysis
                groups={groups}
                onSelectGroup={handleSelect}
                onSwitchToKillChain={() => setView("killchain")}
              />
            )}

            {view === "defense" && (
              <DefenseGapMap groups={groups} techniques={techniques} />
            )}

            {view === "briefing" && (
              <ThreatBriefing groups={groups} />
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{ background: "#0d1117", borderTop: "1px solid #1e2d3d", padding: "6px 20px", flexShrink: 0, textAlign: "center", fontSize: 10, color: "#3d5168" }}>
        Powered by MITRE ATT&amp;CK® &nbsp;|&nbsp; © {metadata?.mitreYear ?? new Date().getFullYear()} The MITRE Corporation. This work is reproduced and distributed with the permission of The MITRE Corporation. &nbsp;|&nbsp;
        <a href="https://attack.mitre.org/resources/legal-and-branding/terms-of-use/" target="_blank" rel="noreferrer" style={{ color: "#3d5168", textDecoration: "underline" }}>ATT&amp;CK Terms of Use</a>
        &nbsp;|&nbsp; © {metadata?.mitreYear ?? new Date().getFullYear()} <a href="https://hariolab.net" target="_blank" rel="noreferrer" style={{ color: "#3d5168", textDecoration: "underline" }}>hario-lab</a>
      </div>

      {showUpdateModal && (
        <DataUpdateModal
          metadata={metadata}
          isStale={isStale}
          loading={updateLoading}
          onClose={() => setShowUpdateModal(false)}
          onUpdate={handleUpdate}
        />
      )}

      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
      {showAbout    && <AboutModal    onClose={() => setShowAbout(false)} />}
    </div>
  );
}
