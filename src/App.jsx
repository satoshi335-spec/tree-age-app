import { useState, useRef } from "react";

const CATEGORIES = [
  { id: "evergreen_broad", label: "常緑広葉樹", emoji: "🌿", color: "#2d6a4f", desc: "一年中緑の広葉樹" },
  { id: "deciduous_broad", label: "落葉広葉樹", emoji: "🍂", color: "#d4a017", desc: "秋に葉が落ちる広葉樹" },
  { id: "conifer", label: "針葉樹", emoji: "🌲", color: "#1b4332", desc: "常緑の針状葉を持つ樹木" },
];

const TREE_DATA = {
  // 常緑広葉樹
  "クスノキ":        { cat: "evergreen_broad", growthRate: 3.5, emoji: "🌳", desc: "公園・街路樹・神社" },
  "シラカシ":        { cat: "evergreen_broad", growthRate: 2.5, emoji: "🌿", desc: "街路樹・生垣・公園" },
  "アラカシ":        { cat: "evergreen_broad", growthRate: 2.3, emoji: "🌿", desc: "公園・社叢・防風林" },
  "タブノキ":        { cat: "evergreen_broad", growthRate: 2.0, emoji: "🌳", desc: "海岸・神社・公園" },
  "モッコク":        { cat: "evergreen_broad", growthRate: 1.5, emoji: "🌿", desc: "庭園・公園・街路樹" },
  "ウバメガシ":      { cat: "evergreen_broad", growthRate: 1.5, emoji: "🌿", desc: "海岸・防風林・公園" },
  "ヤマモモ":        { cat: "evergreen_broad", growthRate: 2.0, emoji: "🍒", desc: "公園・街路樹・庭園" },
  "マテバシイ":      { cat: "evergreen_broad", growthRate: 2.5, emoji: "🌳", desc: "公園・防火樹・街路樹" },
  "トウネズミモチ":  { cat: "evergreen_broad", growthRate: 3.0, emoji: "🌿", desc: "街路樹・公園・生垣" },
  "クロガネモチ":    { cat: "evergreen_broad", growthRate: 2.0, emoji: "🌿", desc: "公園・街路樹・庭園" },
  "オリーブ":        { cat: "evergreen_broad", growthRate: 1.5, emoji: "🫒", desc: "公園・庭園・街路樹" },
  "キョウチクトウ":  { cat: "evergreen_broad", growthRate: 2.0, emoji: "🌸", desc: "街路樹・公園・海岸" },

  // 落葉広葉樹
  "ケヤキ":          { cat: "deciduous_broad", growthRate: 2.5, emoji: "🍂", desc: "公園・並木・街路樹" },
  "イチョウ":        { cat: "deciduous_broad", growthRate: 2.0, emoji: "🍂", desc: "街路樹・神社・公園" },
  "サクラ（ソメイヨシノ）": { cat: "deciduous_broad", growthRate: 3.0, emoji: "🌸", desc: "公園・河川敷・学校" },
  "プラタナス":      { cat: "deciduous_broad", growthRate: 4.0, emoji: "🌳", desc: "並木・街路樹・公園" },
  "トウカエデ":      { cat: "deciduous_broad", growthRate: 2.8, emoji: "🍁", desc: "街路樹・公園・並木" },
  "ユリノキ":        { cat: "deciduous_broad", growthRate: 3.5, emoji: "🌳", desc: "公園・街路樹・並木" },
  "ハナミズキ":      { cat: "deciduous_broad", growthRate: 1.8, emoji: "🌸", desc: "街路樹・公園・庭園" },
  "コブシ":          { cat: "deciduous_broad", growthRate: 2.0, emoji: "🌸", desc: "公園・庭園・山地" },
  "エノキ":          { cat: "deciduous_broad", growthRate: 2.5, emoji: "🍂", desc: "公園・神社・河川敷" },
  "ムクノキ":        { cat: "deciduous_broad", growthRate: 2.5, emoji: "🍂", desc: "公園・神社・街路樹" },
  "アキニレ":        { cat: "deciduous_broad", growthRate: 2.0, emoji: "🍂", desc: "街路樹・公園・河川" },
  "センダン":        { cat: "deciduous_broad", growthRate: 3.0, emoji: "🌳", desc: "公園・街路樹・海岸" },
  "クヌギ":          { cat: "deciduous_broad", growthRate: 2.5, emoji: "🍂", desc: "公園・里山・雑木林" },
  "コナラ":          { cat: "deciduous_broad", growthRate: 2.0, emoji: "🍂", desc: "公園・里山・雑木林" },
  "シダレヤナギ":    { cat: "deciduous_broad", growthRate: 4.0, emoji: "🌿", desc: "河川・公園・池畔" },

  // 針葉樹
  "マツ（クロマツ）": { cat: "conifer", growthRate: 1.5, emoji: "🌲", desc: "公園・海岸・神社" },
  "マツ（アカマツ）": { cat: "conifer", growthRate: 1.8, emoji: "🌲", desc: "公園・山地・神社" },
  "スギ":            { cat: "conifer", growthRate: 2.0, emoji: "🌲", desc: "神社・山地・公園" },
  "ヒノキ":          { cat: "conifer", growthRate: 1.8, emoji: "🌲", desc: "神社・公園・庭園" },
  "ヒマラヤスギ":    { cat: "conifer", growthRate: 3.5, emoji: "🌲", desc: "公園・庭園・街路樹" },
  "メタセコイア":    { cat: "conifer", growthRate: 4.0, emoji: "🌲", desc: "公園・並木・河川敷" },
  "ラクウショウ":    { cat: "conifer", growthRate: 3.0, emoji: "🌲", desc: "公園・池畔・河川" },
  "コウヤマキ":      { cat: "conifer", growthRate: 1.2, emoji: "🌲", desc: "神社・公園・庭園" },
  "イチイ":          { cat: "conifer", growthRate: 1.0, emoji: "🌲", desc: "庭園・生垣・神社" },
  "カイヅカイブキ":  { cat: "conifer", growthRate: 1.5, emoji: "🌲", desc: "生垣・公園・街路樹" },
};

const ALL_SPECIES = Object.keys(TREE_DATA);

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
  const count = Math.min(8, Math.max(3, Math.floor(age / 15)));
  return Array.from({ length: count }, (_, i) => i);
}

export default function TreeAgeApp() {
  const [step, setStep] = useState("home");
  const [imagePreview, setImagePreview] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [circumference, setCircumference] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedTree, setSelectedTree] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [aiSpecies, setAiSpecies] = useState(null);
  const [aiConfidence, setAiConfidence] = useState(null);
  const [aiNote, setAiNote] = useState("");
  const [inputMethod, setInputMethod] = useState(null);
  const fileRef = useRef();

  const currentCat = CATEGORIES.find(c => c.id === selectedCategory);
  const catColor = currentCat?.color || "#2d6a4f";
  const filteredTrees = selectedCategory
    ? Object.entries(TREE_DATA).filter(([, v]) => v.cat === selectedCategory)
    : [];

  const handleFileChange = (e) => {
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
              { type: "image", source: { type: "base64", media_type: "image/jpeg", data: imageBase64 } },
              {
                type: "text",
                text: `この木の画像を見て、日本の緑化樹木として以下のリストから最も近い樹種を1つ選んでください。
リスト: ${ALL_SPECIES.join("、")}
以下のJSON形式のみで回答してください（他テキスト不要）:
{"species": "樹種名", "confidence": "高/中/低", "note": "判断理由（20文字以内）"}`
              }
            ]
          }]
        })
      });
      const data = await response.json();
      const text = data.content?.map(i => i.text || "").join("") || "";
      const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
      if (TREE_DATA[parsed.species]) {
        setAiSpecies(parsed.species);
        setAiConfidence(parsed.confidence);
        setAiNote(parsed.note || "");
        setSelectedTree(parsed.species);
        setSelectedCategory(TREE_DATA[parsed.species].cat);
      }
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const calcAge = () => {
    const tree = TREE_DATA[selectedTree];
    if (!tree || !circumference) return;
    const circ = parseFloat(circumference);
    const age = Math.round(circ / tree.growthRate);
    setResult({ age, tree, species: selectedTree, circ, label: getAgeLabel(age) });
    setStep("result");
  };

  const reset = () => {
    setStep("home");
    setImagePreview(null); setImageBase64(null);
    setCircumference(""); setSelectedTree(null); setSelectedCategory(null);
    setResult(null); setAiSpecies(null); setAiConfidence(null); setAiNote("");
    setInputMethod(null);
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg, #0a1f14 0%, #1a3a26 40%, #0d2b1a 100%)", fontFamily: "'Georgia', 'Hiragino Mincho ProN', serif", color: "#e8f5e9", padding: "0" }}>
      <div style={{ maxWidth: 480, margin: "0 auto", padding: "0 16px 40px" }}>

        {/* Header */}
        <div style={{ textAlign: "center", paddingTop: 36, paddingBottom: 8 }}>
          <div style={{ fontSize: 44, marginBottom: 4 }}>🌳</div>
          <h1 style={{ fontSize: 21, fontWeight: "bold", letterSpacing: 3, color: "#a8d5b5", margin: 0 }}>樹齢推定システム</h1>
          <p style={{ fontSize: 11, color: "#6aab7e", letterSpacing: 2, marginTop: 4 }}>TREE AGE ESTIMATOR</p>
        </div>

        {/* HOME */}
        {step === "home" && (
          <div style={{ marginTop: 28 }}>
            <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 16, border: "1px solid rgba(116,198,157,0.2)", padding: "18px 20px", marginBottom: 20, textAlign: "center" }}>
              <p style={{ fontSize: 13, lineHeight: 1.9, color: "#b2d8be", margin: 0 }}>
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
            <div style={{ marginTop: 28, borderTop: "1px solid rgba(116,198,157,0.15)", paddingTop: 18 }}>
              <p style={{ fontSize: 11, color: "#4a7c5a", textAlign: "center", letterSpacing: 1, marginBottom: 12 }}>対応樹種 {ALL_SPECIES.length}種 ／ 3分類</p>
              <div style={{ display: "flex", gap: 8 }}>
                {CATEGORIES.map(cat => (
                  <div key={cat.id} style={{ flex: 1, background: `${cat.color}33`, border: `1px solid ${cat.color}66`, borderRadius: 10, padding: "10px 8px", textAlign: "center" }}>
                    <div style={{ fontSize: 20 }}>{cat.emoji}</div>
                    <div style={{ fontSize: 11, color: "#a8d5b5", marginTop: 4, lineHeight: 1.3 }}>{cat.label}</div>
                    <div style={{ fontSize: 10, color: "#6aab7e", marginTop: 2 }}>{Object.values(TREE_DATA).filter(t => t.cat === cat.id).length}種</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* UPLOAD / SELECT */}
        {step === "upload" && (
          <div style={{ marginTop: 20 }}>
            {imagePreview && (
              <div style={{ borderRadius: 14, overflow: "hidden", marginBottom: 14, border: "1px solid rgba(116,198,157,0.3)" }}>
                <img src={imagePreview} alt="tree" style={{ width: "100%", maxHeight: 200, objectFit: "cover", display: "block" }} />
              </div>
            )}
            {inputMethod === "photo" && !aiSpecies && (
              <button onClick={identifyTreeWithAI} disabled={loading} style={btnStyle("#1b4332", "#74c69d")}>
                {loading ? "🔍 AIが樹種を解析中..." : "🤖 AIで樹種を判定する"}
              </button>
            )}
            {aiSpecies && (
              <div style={{ background: "rgba(116,198,157,0.12)", borderRadius: 12, border: "1px solid rgba(116,198,157,0.3)", padding: "12px 16px", marginBottom: 14 }}>
                <p style={{ fontSize: 11, color: "#74c69d", margin: "0 0 4px", letterSpacing: 1 }}>AI判定結果 — 信頼度：{aiConfidence}</p>
                <p style={{ fontSize: 17, fontWeight: "bold", color: "#e8f5e9", margin: "0 0 2px" }}>{TREE_DATA[aiSpecies]?.emoji} {aiSpecies}</p>
                <p style={{ fontSize: 11, color: "#8dbfa0", margin: 0 }}>{aiNote}</p>
              </div>
            )}

            {/* ① Category */}
            <p style={{ fontSize: 13, color: "#74c69d", margin: "16px 0 10px" }}>① 大分類を選んでください：</p>
            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              {CATEGORIES.map(cat => (
                <button key={cat.id} onClick={() => { setSelectedCategory(cat.id); setSelectedTree(null); }} style={{
                  flex: 1, padding: "12px 4px", borderRadius: 10, cursor: "pointer",
                  background: selectedCategory === cat.id ? `${cat.color}cc` : "rgba(255,255,255,0.04)",
                  border: `1px solid ${selectedCategory === cat.id ? cat.color : "rgba(116,198,157,0.2)"}`,
                  color: "#e8f5e9", fontSize: 12, textAlign: "center", transition: "all 0.2s"
                }}>
                  <div style={{ fontSize: 22, marginBottom: 4 }}>{cat.emoji}</div>
                  <div style={{ lineHeight: 1.3 }}>{cat.label}</div>
                </button>
              ))}
            </div>

            {/* ② Species */}
            {selectedCategory && (
              <>
                <p style={{ fontSize: 13, color: "#74c69d", margin: "0 0 10px" }}>② 樹種を選んでください：</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 16, maxHeight: 280, overflowY: "auto" }}>
                  {filteredTrees.map(([name, data]) => (
                    <button key={name} onClick={() => setSelectedTree(name)} style={{
                      background: selectedTree === name ? `${catColor}cc` : "rgba(255,255,255,0.04)",
                      border: `1px solid ${selectedTree === name ? catColor : "rgba(116,198,157,0.2)"}`,
                      borderRadius: 10, padding: "10px 14px", cursor: "pointer", color: "#e8f5e9",
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      fontSize: 14, textAlign: "left", transition: "all 0.2s", flexShrink: 0
                    }}>
                      <span>{data.emoji} {name}</span>
                      <span style={{ fontSize: 10, color: "#8dbfa0" }}>{data.desc}</span>
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* ③ Circumference */}
            {selectedTree && (
              <>
                <p style={{ fontSize: 13, color: "#74c69d", margin: "0 0 8px" }}>③ 幹周り（cm）を入力：</p>
                <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
                  <input type="number" value={circumference} onChange={e => setCircumference(e.target.value)} placeholder="例: 120"
                    style={{ flex: 1, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(116,198,157,0.4)", borderRadius: 10, padding: "12px 16px", color: "#e8f5e9", fontSize: 18, outline: "none", fontFamily: "inherit" }} />
                  <span style={{ color: "#74c69d", fontSize: 14 }}>cm</span>
                </div>
                <p style={{ fontSize: 11, color: "#4a7c5a", marginBottom: 14 }}>※ 地上1.3mの高さで計測した幹周り</p>
                <button onClick={calcAge} disabled={!circumference} style={btnStyle("#1b4332", "#74c69d")}>🌱　樹齢を推定する</button>
              </>
            )}
            <button onClick={reset} style={{ ...btnStyle("#000", "#4a7c5a"), marginTop: 6, fontSize: 13 }}>← 最初に戻る</button>
          </div>
        )}

        {/* RESULT */}
        {step === "result" && result && (
          <div style={{ marginTop: 20 }}>
            <div style={{ background: `linear-gradient(135deg, ${catColor}55, ${catColor}22)`, border: `1px solid ${catColor}88`, borderRadius: 20, padding: "24px 20px", textAlign: "center", marginBottom: 14 }}>
              <div style={{ position: "relative", width: 110, height: 110, margin: "0 auto 16px" }}>
                {getRings(result.age).map((_, i) => (
                  <div key={i} style={{ position: "absolute", inset: `${i * 7}px`, borderRadius: "50%", border: `2px solid ${catColor}`, opacity: 0.15 + i * 0.1 }} />
                ))}
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: 26 }}>{result.tree.emoji}</span>
                </div>
              </div>
              <p style={{ fontSize: 12, color: "#8dbfa0", margin: "0 0 2px", letterSpacing: 2 }}>推定樹齢</p>
              <p style={{ fontSize: 60, fontWeight: "bold", color: "#e8f5e9", margin: 0, lineHeight: 1, letterSpacing: -2 }}>{result.age}</p>
              <p style={{ fontSize: 17, color: "#74c69d", margin: "4px 0 10px" }}>年</p>
              <div style={{ display: "inline-block", background: result.label.bg, color: "#1a3a26", borderRadius: 20, padding: "4px 16px", fontSize: 12, fontWeight: "bold" }}>{result.label.label}</div>
            </div>

            <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 14, border: "1px solid rgba(116,198,157,0.15)", padding: "14px 18px", marginBottom: 12 }}>
              <Row label="分類" value={CATEGORIES.find(c => c.id === result.tree.cat)?.label || ""} />
              <Row label="樹種" value={`${result.tree.emoji} ${result.species}`} />
              <Row label="幹周り" value={`${result.circ} cm`} />
              <Row label="年間成長量" value={`約 ${result.tree.growthRate} cm/年`} />
              <Row label="計算式" value={`${result.circ} ÷ ${result.tree.growthRate} ≈ ${result.age}年`} last />
            </div>

            <div style={{ background: "rgba(255,193,7,0.08)", border: "1px solid rgba(255,193,7,0.2)", borderRadius: 12, padding: "10px 14px", marginBottom: 14 }}>
              <p style={{ fontSize: 11, color: "#ffc107", margin: 0, lineHeight: 1.7 }}>⚠️ この推定値は目安です。実際の樹齢は土壌・日照・管理状況により大きく異なります。</p>
            </div>

            {imagePreview && (
              <div style={{ borderRadius: 12, overflow: "hidden", marginBottom: 14, border: "1px solid rgba(116,198,157,0.2)" }}>
                <img src={imagePreview} alt="tree" style={{ width: "100%", maxHeight: 140, objectFit: "cover", display: "block" }} />
              </div>
            )}
            <button onClick={reset} style={btnStyle("#1b4332", "#74c69d")}>🌳　別の木を調べる</button>
          </div>
        )}
      </div>
    </div>
  );
}

function Row({ label, value, last }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: last ? "none" : "1px solid rgba(116,198,157,0.1)", paddingBottom: last ? 0 : 8, marginBottom: last ? 0 : 8 }}>
      <span style={{ fontSize: 11, color: "#6aab7e" }}>{label}</span>
      <span style={{ fontSize: 13, color: "#e8f5e9" }}>{value}</span>
    </div>
  );
}

function btnStyle(bg, border) {
  return { width: "100%", padding: "13px", background: bg, border: `1px solid ${border}`, borderRadius: 12, color: "#e8f5e9", fontSize: 14, cursor: "pointer", marginBottom: 8, letterSpacing: 1, fontFamily: "inherit" };
}
