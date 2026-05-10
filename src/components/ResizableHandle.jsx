import { useCallback, useRef, useState } from "react";

export default function ResizableHandle({ onDrag }) {
  const [active, setActive] = useState(false);
  const dragging = useRef(false);

  const startDrag = useCallback((startX) => {
    dragging.current = true;
    setActive(true);
    let lastX = startX;

    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
    document.body.style.webkitUserSelect = "none";

    const move = (x) => {
      if (!dragging.current) return;
      onDrag(x - lastX);
      lastX = x;
    };

    const stop = () => {
      dragging.current = false;
      setActive(false);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      document.body.style.webkitUserSelect = "";
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", stop);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", stop);
      window.removeEventListener("touchcancel", stop);
    };

    const onMouseMove = (e) => move(e.clientX);
    const onTouchMove = (e) => { e.preventDefault(); move(e.touches[0].clientX); };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", stop);
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", stop);
    window.addEventListener("touchcancel", stop);
  }, [onDrag]);

  return (
    <div
      onMouseDown={(e) => { e.preventDefault(); startDrag(e.clientX); }}
      onTouchStart={(e) => { startDrag(e.touches[0].clientX); }}
      style={{
        width: 16,
        flexShrink: 0,
        cursor: "col-resize",
        touchAction: "none",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10,
        background: active ? "#00ff8811" : "transparent",
        transition: "background 0.1s",
      }}
    >
      {/* Visual line */}
      <div style={{
        width: 2,
        height: "100%",
        position: "absolute",
        background: active ? "#00ff8888" : "#1e2d3d",
        transition: "background 0.15s",
        pointerEvents: "none",
      }} />
      {/* Grip dots */}
      <div style={{
        position: "absolute",
        top: "50%",
        transform: "translateY(-50%)",
        display: "flex",
        flexDirection: "column",
        gap: 4,
        pointerEvents: "none",
      }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: 4,
            height: 4,
            borderRadius: "50%",
            background: active ? "#00ff88" : "#3d5168",
            transition: "background 0.15s",
          }} />
        ))}
      </div>
    </div>
  );
}
