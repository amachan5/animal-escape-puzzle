import { useState } from "react";
import {
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  RotateCcw,
} from "lucide-react";

const GRID_WIDTH = 4;
const GRID_HEIGHT = 7;

const goal = { x: 1, y: 5, w: 2, h: 2 };

// ゴール左右を2マスで1つの壁ブロックにまとめる
const lockedBlocks = [
  { id: "wallLeft", x: 0, y: 5, w: 1, h: 2, emoji: "🧱" },
  { id: "wallRight", x: 3, y: 5, w: 1, h: 2, emoji: "🧱" },
];

const movableBlocks = [
  { id: "elephant", x: 1, y: 0, w: 2, h: 2, emoji: "🐘" },
  { id: "lion", x: 0, y: 0, w: 1, h: 2, emoji: "🦁" },
  // { id: "monkey", x: 1, y: 3, w: 1, h: 1, emoji: "🐒" },
  { id: "tiger", x: 3, y: 0, w: 1, h: 2, emoji: "🐯" },
  { id: "giraffe", x: 1, y: 2, w: 2, h: 1, emoji: "🦒" },
  { id: "panda", x: 1, y: 3, w: 1, h: 1, emoji: "🐼" },
  { id: "koala", x: 1, y: 4, w: 1, h: 1, emoji: "🐨" },
  { id: "penguin", x: 2, y: 3, w: 1, h: 1, emoji: "🐧" },
  { id: "fox", x: 2, y: 4, w: 1, h: 1, emoji: "🦊" },
  // { id: "hippo", x: 2, y: 3, w: 1, h: 1, emoji: "🦛" },
  { id: "zebra", x: 3, y: 2, w: 1, h: 2, emoji: "🦓" }, 
  { id: "rhino", x: 0, y: 2, w: 1, h: 2, emoji: "🦏" }, 
  // { id: "bear", x: 4, y: 4, w: 1, h: 1, emoji: "🐻" }, 
];

const initialBlocks = [...movableBlocks, ...lockedBlocks];

// 省略（import部分と定数部分はそのまま）

export default function App() {
  const [blocks, setBlocks] = useState(initialBlocks);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isMoving, setIsMoving] = useState(false);

  const isCleared = blocks.find(
    (b) =>
      b.id === "elephant" &&
      b.x === goal.x &&
      b.y === goal.y &&
      b.w === goal.w &&
      b.h === goal.h
  );

  const moveBlock = (dx: number, dy: number) => {
    if (isMoving || !selectedId) return;
    setIsMoving(true);

    setBlocks((prev) => {
      const newBlocks = [...prev];
      const block = newBlocks.find((b) => b.id === selectedId);
      if (!block) return prev;

      const newX = block.x + dx;
      const newY = block.y + dy;

      const collision = newBlocks.some((b) => {
        if (b.id === block.id) return false;
        return (
          newX < b.x + b.w &&
          newX + block.w > b.x &&
          newY < b.y + b.h &&
          newY + block.h > b.y
        );
      });

      const inBounds =
        newX >= 0 &&
        newY >= 0 &&
        newX + block.w <= GRID_WIDTH &&
        newY + block.h <= GRID_HEIGHT;

      if (!collision && inBounds) {
        block.x = newX;
        block.y = newY;
      }

      return [...newBlocks];
    });

    setTimeout(() => setIsMoving(false), 100);
  };

  const resetGame = () => {
    setBlocks(initialBlocks);
    setSelectedId(null);
  };

  return (
    <div style={{ padding: "16px", fontFamily: "sans-serif" }}>
      <h1
        style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "16px" }}
      >
        動物脱出ゲーム 🐘
      </h1>

      <div
        style={{
          width: `${GRID_WIDTH * 64}px`,
          height: `${GRID_HEIGHT * 64}px`,
          margin: "0 auto",
          position: "relative",
          backgroundColor: "#d4f0d4",
          borderRadius: "8px",
        }}
      >
        {/* ゴール */}
        <div
          style={{
            position: "absolute",
            left: `${goal.x * 64}px`,
            top: `${goal.y * 64}px`,
            width: `${goal.w * 64}px`,
            height: `${goal.h * 64}px`,
            backgroundColor: "#fde68a",
            borderRadius: "8px",
            zIndex: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
            color: "#92400e",
            fontSize: "14px",
          }}
        >
          GOAL
        </div>

        {/* ブロック描画 */}
        {blocks.map((block) => (
          <div
            key={block.id}
            onClick={() =>
              !block.id.startsWith("wall") && setSelectedId(block.id)
            }
            style={{
              position: "absolute",
              left: `${block.x * 64}px`,
              top: `${block.y * 64}px`,
              width: `${block.w * 64}px`,
              height: `${block.h * 64}px`,
              backgroundColor: block.id.startsWith("wall") ? "#9ca3af" : "#fff",
              borderRadius: "8px",
              border:
                selectedId === block.id
                  ? "4px solid #60a5fa"
                  : "2px solid #d1d5db",
              boxSizing: "border-box",
              cursor: block.id.startsWith("wall") ? "default" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "32px",
              transition: "border 0.2s ease",
              userSelect: "none",
              zIndex: 1,
            }}
          >
            {block.emoji}
          </div>
        ))}
      </div>

      {/* 操作ボタン */}
      <div
        style={{
          marginTop: "16px",
          display: "flex",
          gap: "8px",
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        <button onClick={() => moveBlock(0, -1)} style={buttonStyle}>
          <ArrowUp />
        </button>
        <button onClick={() => moveBlock(-1, 0)} style={buttonStyle}>
          <ArrowLeft />
        </button>
        <button onClick={() => moveBlock(1, 0)} style={buttonStyle}>
          <ArrowRight />
        </button>
        <button onClick={() => moveBlock(0, 1)} style={buttonStyle}>
          <ArrowDown />
        </button>

        {/* リセットボタンを非表示に */}
        <div style={{ display: "none" }}>
          <button onClick={resetGame} style={buttonStyle}>
            <RotateCcw /> リセット
          </button>
        </div>
      </div>

      {/* メッセージ */}
      {!isCleared && (
        <div
          style={{
            marginTop: "16px",
            fontSize: "20px",
            fontWeight: "bold",
            color: "#1f2937",
            textAlign: "center",
          }}
        >
          👉 ゾウを下に移動しよう！
        </div>
      )}
      {isCleared && (
        <div
          style={{
            marginTop: "16px",
            fontSize: "28px",
            fontWeight: "bold",
            color: "#16a34a",
            textAlign: "center",
          }}
        >
          🎉 クリア！
        </div>
      )}
    </div>
  );
}

const buttonStyle: React.CSSProperties = {
  backgroundColor: "#3b82f6",
  border: "none",
  borderRadius: "6px",
  padding: "8px 12px",
  cursor: "pointer",
  color: "white",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "18px",
  userSelect: "none",
  gap: "4px",
  transition: "background-color 0.2s ease",
};
