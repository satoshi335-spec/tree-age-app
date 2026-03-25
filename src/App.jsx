import { useState, useRef, useCallback } from "react";

const TREE_DATA = {
  "クスノキ": { growthRate: 3.5, emoji: "🌳", color: "#2d6a4f", desc: "常緑高木・公園や街路樹" },
  "ケヤキ": { growthRate: 2.5, emoji: "🌲", color: "#40916c", desc: "落葉高木・公園・並木" },
  "イチョウ": { growthRate: 2.0, emoji: "🍂", color: "#d4a017", desc: "落葉高木・街路樹・神社" },
  "サクラ（ソメイヨシノ）": { growthRate: 3.0, emoji: "🌸", color: "#f4acb7", desc: "落葉高木・公園・河川敷" },
  "マツ（クロマツ）": { growthRate: 1.5, emoji: "🌲", color: "#1b4332", desc: "常緑針葉樹・公園・海岸" },
  "スギ": { growthRate: 2.0, emoji: "🌲", color: "#081c15", desc: "常緑針葉樹・神社・山地" },
  "シラカシ": { growthRate: 2.5, emoji: "🌿", color: "#52b788", desc: "常緑高木・街路樹・生垣" },
  "トウカエデ": { growthRate: 2.8, emoji: "🍁", color: "#e76f51", desc: "落葉高木・街路樹" },
  "プラタナス": { growthRate: 4.0, emoji: "🌳", color: "#74c69d", desc: "落葉高木・並木・街路樹" },
  "ヒマラヤスギ": { growthRate: 3.5, emoji: "🌲", color: "#1d3557", desc: "常緑針葉樹・公園・庭園" },
};

const GROWTH_LABELS = [
  { max: 20, label: "幼木期", bg: "#d8f3dc" },
  { max: 50, label: "若木期", bg: "#b7e4c7" },
  { max: 100, label: "壮年期", bg: "#74c69d" },
  { max: 200, label: "老木期", bg: "#40916c" },
  { max: Infinity, label: "巨樹・古木", bg: "#1b4332" },
];

function getAgeLabel(age) {
  return GROWTH_LABELS.find(l => age <= l.max) || GROWTH_LABELS[GROWTH_LABELS.length - 1];
}

function getRings(age) {
  const rings = [];
  const count = Math.min(8, Math.max(3, Math.floor(age / 15)));
  for (let i = count; i >= 1; i--) {
    rings.push(i);
  }
  return rings;
}

export default function TreeAgeApp() {
  const [step, setStep] = useState("home"); // home | upload | manual | result
  const [imagePreview, setImagePreview] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [circumference, setCircumference] = useState("");
  const [selectedTree, setSelectedTree] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [aiSpecies, setAiSpecies] = useState(null);
  const [aiConfidence, setAiConfidence] = useState(null);
  const [aiNote, setAiNote] = useState("");
  const [inputMethod, setInputMethod] = useState(null); // 'photo' | 'manual'
  const fileRef = useRef();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setImagePreview(ev.target.result);
      setImageBase64(ev.target.result.split(",")[1]);
      setStep("upload");
      setInputMethod("photo");
    };
    reader.readAsDataURL(file);
  };

  const identifyTreeWithAI = async () => {
    if (!imageBase64) return;
    setLoading(true);
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: [
              {
                type: "image",
                source: { type: "base64", media_type: "image/jpeg", data: imageBase64 }
              },
              {
                type: "text",
                text: `この木の画像を見て、日本の緑化樹木として以下のリストから最も近い樹種を1つ選んでください。
リスト: ${Object.keys(TREE_DATA).join("、")}

以下のJSON形式のみで回答してください（他のテキスト不要）:
{"species": "樹種名", "confidence": "高/中/低", "note": "簡単な判断理由（20文字以内）"}`
              }
            ]
          }]
        })
      });
      const data = await response.json();
      const text = data.content?.map(i => i.text || "").join("") || "";
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      if (TREE_DATA[parsed.species]) {
        setAiSpecies(parsed.species);
        setAiConfidence(parsed.confidence);
        setAiNote(parsed.note || "");
        setSelectedTree(parsed.species);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const calcAge = () => {
    const tree = TREE_DATA[selectedTree];
    if (!tree || !circumference) return;
    const circ = parseFloat(circumference);
    const age = Math.round(circ / tree.growthRate);
    const label = getAgeLabel(age);
    setResult({ age, tree, species: selectedTree, circ, label });
    setStep("result");
  };

  const reset = () => {
    setStep("home");
    setImagePreview(null);
    setImageBase64(null);
    setCircumference("");
    setSelectedTree(null);
    setResult(null);
    setAiSpecies(null);
    setAiConfidence(null);
    setAiNote("");
    setInputMethod(null);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #0a1f14 0%, #1a3a26 40%, #0d2b1a 100%)",
      fontFamily: "'Georgia', 'Hiragino Mincho ProN', serif",
      color: "#e8f5e9",
      padding: "0",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Background texture */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        backgroundImage: "radial-gradient(circle at 20% 50%, rgba(52,168,83,0.07) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(116,198,157,0.05) 0%, transparent 40%)",
      }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 480, margin: "0 auto", padding: "0 16px 40px" }}>

        {/* Header */}
        <div style={{ textAlign: "center", paddingTop: 40, paddingBottom: 8 }}>
          <div style={{ fontSize: 48, marginBottom: 4 }}>🌳</div>
          <h1 style={{ fontSize: 22, fontWeight: "bold", letterSpacing: 3, color: "#a8d5b5", margin: 0 }}>
            樹齢推定システム
          </h1>
          <p style={{ fontSize: 11, color: "#6aab7e", letterSpacing: 2, marginTop: 4 }}>TREE AGE ESTIMATOR</p>
        </div>

        {/* HOME */}
        {step === "home" && (
          <div style={{ marginTop: 32 }}>
            <div style={{
              background: "rgba(255,255,255,0.04)", borderRadius: 16, border: "1px solid rgba(116,198,157,0.2)",
              padding: "20px 24px", marginBottom: 20, textAlign: "center"
            }}>
              <p style={{ fontSize: 14, lineHeight: 1.8, color: "#b2d8be", margin: 0 }}>
                木の写真または樹種を選択し、<br />幹周りを入力するだけで<br />おおよその樹齢を推定します。
              </p>
            </div>

            <button onClick={() => fileRef.current.click()} style={btnStyle("#1b4332", "#74c69d")}>
              📷　写真から樹種を判定する
            </button>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFileChange} />

            <button onClick={() => { setStep("upload"); setInputMethod("manual"); }} style={btnStyle("#0d2b1a", "#52b788")}>
              🌿　樹種を手動で選ぶ
            </button>

            <div style={{ marginTop: 32, borderTop: "1px solid rgba(116,198,157,0.15)", paddingTop: 20 }}>
              <p style={{ fontSize: 11, color: "#4a7c5a", textAlign: "center", letterSpacing: 1 }}>対応樹種 {Object.keys(TREE_DATA).length}種</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center", marginTop: 10 }}>
                {Object.keys(TREE_DATA).map(k => (
                  <span key={k} style={{ fontSize: 11, color: "#6aab7e", background: "rgba(116,198,157,0.1)", borderRadius: 20, padding: "3px 10px" }}>{k}</span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* UPLOAD / SELECT */}
        {step === "upload" && (
          <div style={{ marginTop: 24 }}>
            {imagePreview && (
              <div style={{ borderRadius: 14, overflow: "hidden", marginBottom: 16, border: "1px solid rgba(116,198,157,0.3)" }}>
                <img src={imagePreview} alt="tree" style={{ width: "100%", maxHeight: 220, objectFit: "cover", display: "block" }} />
              </div>
            )}

            {inputMethod === "photo" && !aiSpecies && (
              <button onClick={identifyTreeWithAI} disabled={loading} style={btnStyle("#1b4332", "#74c69d")}>
                {loading ? "🔍 AIが樹種を解析中..." : "🤖 AIで樹種を判定する"}
              </button>
            )}

            {aiSpecies && (
              <div style={{
                background: "rgba(116,198,157,0.12)", borderRadius: 12, border: "1px solid rgba(116,198,157,0.3)",
                padding: "14px 18px", marginBottom: 16
              }}>
                <p style={{ fontSize: 12, color: "#74c69d", margin: "0 0 4px", letterSpacing: 1 }}>AI判定結果 — 信頼度：{aiConfidence}</p>
                <p style={{ fontSize: 18, fontWeight: "bold", color: "#e8f5e9", margin: "0 0 4px" }}>
                  {TREE_DATA[aiSpecies]?.emoji} {aiSpecies}
                </p>
                {aiNote && <p style={{ fontSize: 12, color: "#8dbfa0", margin: 0 }}>{aiNote}</p>}
              </div>
            )}

            <p style={{ fontSize: 13, color: "#74c69d", marginBottom: 10, marginTop: 16 }}>樹種を選択してください：</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
              {Object.entries(TREE_DATA).map(([name, data]) => (
                <button key={name} onClick={() => setSelectedTree(name)} style={{
                  background: selectedTree === name ? `${data.color}cc` : "rgba(255,255,255,0.04)",
                  border: `1px solid ${selectedTree === name ? data.color : "rgba(116,198,157,0.2)"}`,
                  borderRadius: 10, padding: "10px 16px", cursor: "pointer", color: "#e8f5e9",
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  fontSize: 14, textAlign: "left", transition: "all 0.2s"
                }}>
                  <span>{data.emoji} {name}</span>
                  <span style={{ fontSize: 11, color: "#8dbfa0" }}>{data.desc}</span>
                </button>
              ))}
            </div>

            {selectedTree && (
              <>
                <p style={{ fontSize: 13, color: "#74c69d", marginBottom: 8 }}>幹周り（cm）を入力：</p>
                <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
                  <input
                    type="number"
                    value={circumference}
                    onChange={e => setCircumference(e.target.value)}
                    placeholder="例: 120"
                    style={{
                      flex: 1, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(116,198,157,0.4)",
                      borderRadius: 10, padding: "12px 16px", color: "#e8f5e9", fontSize: 18,
                      outline: "none", fontFamily: "inherit"
                    }}
                  />
                  <span style={{ color: "#74c69d", fontSize: 14 }}>cm</span>
                </div>
                <p style={{ fontSize: 11, color: "#4a7c5a", marginBottom: 16 }}>
                  ※ 地上1.3mの高さで計測した幹周りを入力してください
                </p>
                <button onClick={calcAge} disabled={!circumference} style={btnStyle("#1b4332", "#74c69d")}>
                  🌱　樹齢を推定する
                </button>
              </>
            )}

            <button onClick={reset} style={{ ...btnStyle("#000", "#4a7c5a"), marginTop: 8, fontSize: 13 }}>
              ← 最初に戻る
            </button>
          </div>
        )}

        {/* RESULT */}
        {step === "result" && result && (
          <div style={{ marginTop: 24 }}>
            <div style={{
              background: `linear-gradient(135deg, ${result.tree.color}55, ${result.tree.color}22)`,
              border: `1px solid ${result.tree.color}88`,
              borderRadius: 20, padding: "28px 24px", textAlign: "center", marginBottom: 16,
              position: "relative", overflow: "hidden"
            }}>
              {/* Year rings visual */}
              <div style={{ position: "relative", width: 120, height: 120, margin: "0 auto 20px" }}>
                {getRings(result.age).map((r, i) => (
                  <div key={i} style={{
                    position: "absolute",
                    inset: `${i * 7}px`,
                    borderRadius: "50%",
                    border: `2px solid ${result.tree.color}`,
                    opacity: 0.15 + (i * 0.1),
                  }} />
                ))}
                <div style={{
                  position: "absolute", inset: 0, display: "flex", alignItems: "center",
                  justifyContent: "center", flexDirection: "column"
                }}>
                  <span style={{ fontSize: 28 }}>{result.tree.emoji}</span>
                </div>
              </div>

              <p style={{ fontSize: 13, color: "#8dbfa0", margin: "0 0 4px", letterSpacing: 2 }}>推定樹齢</p>
              <p style={{ fontSize: 64, fontWeight: "bold", color: "#e8f5e9", margin: "0", lineHeight: 1, letterSpacing: -2 }}>
                {result.age}
              </p>
              <p style={{ fontSize: 18, color: "#74c69d", margin: "4px 0 12px" }}>年</p>
              <div style={{
                display: "inline-block", background: result.label.bg, color: "#1a3a26",
                borderRadius: 20, padding: "4px 16px", fontSize: 13, fontWeight: "bold"
              }}>
                {result.label.label}
              </div>
            </div>

            <div style={{
              background: "rgba(255,255,255,0.04)", borderRadius: 14, border: "1px solid rgba(116,198,157,0.15)",
              padding: "16px 20px", marginBottom: 16
            }}>
              <Row label="樹種" value={`${result.tree.emoji} ${result.species}`} />
              <Row label="幹周り" value={`${result.circ} cm`} />
              <Row label="年間成長量" value={`約 ${result.tree.growthRate} cm/年`} />
              <Row label="計算式" value={`${result.circ} ÷ ${result.tree.growthRate} ≈ ${result.age}年`} last />
            </div>

            <div style={{
              background: "rgba(255,193,7,0.08)", border: "1px solid rgba(255,193,7,0.2)",
              borderRadius: 12, padding: "12px 16px", marginBottom: 16
            }}>
              <p style={{ fontSize: 12, color: "#ffc107", margin: 0, lineHeight: 1.7 }}>
                ⚠️ この推定値は目安です。実際の樹齢は土壌・日照・管理状況により大きく異なります。
              </p>
            </div>

            {imagePreview && (
              <div style={{ borderRadius: 12, overflow: "hidden", marginBottom: 16, border: "1px solid rgba(116,198,157,0.2)" }}>
                <img src={imagePreview} alt="tree" style={{ width: "100%", maxHeight: 160, objectFit: "cover", display: "block" }} />
              </div>
            )}

            <button onClick={reset} style={btnStyle("#1b4332", "#74c69d")}>
              🌳　別の木を調べる
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Row({ label, value, last }) {
  return (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      borderBottom: last ? "none" : "1px solid rgba(116,198,157,0.1)",
      paddingBottom: last ? 0 : 10, marginBottom: last ? 0 : 10
    }}>
      <span style={{ fontSize: 12, color: "#6aab7e" }}>{label}</span>
      <span style={{ fontSize: 14, color: "#e8f5e9" }}>{value}</span>
    </div>
  );
}

function btnStyle(bg, border) {
  return {
    width: "100%", padding: "14px", background: bg,
    border: `1px solid ${border}`, borderRadius: 12, color: "#e8f5e9",
    fontSize: 15, cursor: "pointer", marginBottom: 10, letterSpacing: 1,
    fontFamily: "inherit", transition: "opacity 0.2s"
  };
}
