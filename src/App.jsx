import { useState, useRef, useCallback } from "react";

// ─── CSS Variables & Global Styles ───────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=IBM+Plex+Sans:wght@300;400;500;600&display=swap');

  :root {
    --cream:       #F5F0E8;
    --cream-dark:  #EDE7D9;
    --cream-deep:  #E0D8C8;
    --cream-line:  #D4CAB8;
    --ink:         #1A1810;
    --ink-mid:     #4A4538;
    --ink-light:   #8A8070;
    --ink-faint:   #B8B0A0;
    --neon:        #00E87A;
    --neon-dim:    #00C868;
    --neon-pale:   rgba(0,232,122,0.12);
    --neon-ghost:  rgba(0,232,122,0.06);
    --rust:        #C84B2A;
    --amber:       #D4860A;
    --blue:        #2A6AB8;
    --shadow-sm:   0 1px 3px rgba(26,24,16,0.08), 0 1px 2px rgba(26,24,16,0.06);
    --shadow-md:   0 4px 12px rgba(26,24,16,0.10), 0 2px 6px rgba(26,24,16,0.06);
    --shadow-lg:   0 8px 24px rgba(26,24,16,0.12);
    --radius:      6px;
    --radius-lg:   10px;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: var(--cream);
    color: var(--ink);
    font-family: 'IBM Plex Mono', monospace;
  }

  @keyframes spin    { to { transform: rotate(360deg); } }
  @keyframes blink   { 0%,100% { opacity:1; } 50% { opacity:0; } }
  @keyframes fadeUp  { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
  @keyframes scanline {
    0%   { transform: translateY(-100%); }
    100% { transform: translateY(100vh); }
  }

  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: var(--cream-dark); }
  ::-webkit-scrollbar-thumb { background: var(--cream-line); border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: var(--ink-faint); }

  .btn-primary {
    background: var(--ink);
    color: var(--neon);
    border: none;
    border-radius: var(--radius);
    padding: 12px 28px;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.06em;
    cursor: pointer;
    transition: all 0.15s;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    box-shadow: var(--shadow-sm);
  }
  .btn-primary:hover { background: #2A2820; transform: translateY(-1px); box-shadow: var(--shadow-md); }
  .btn-primary:active { transform: translateY(0); }
  .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

  .btn-secondary {
    background: transparent;
    color: var(--ink-mid);
    border: 1.5px solid var(--cream-line);
    border-radius: var(--radius);
    padding: 10px 20px;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 12px;
    cursor: pointer;
    transition: all 0.15s;
    letter-spacing: 0.04em;
  }
  .btn-secondary:hover { border-color: var(--ink-faint); color: var(--ink); background: var(--cream-dark); }

  .card {
    background: white;
    border: 1.5px solid var(--cream-line);
    border-radius: var(--radius-lg);
    padding: 18px;
    box-shadow: var(--shadow-sm);
  }

  .card-header {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 10px;
    letter-spacing: 0.15em;
    color: var(--ink-light);
    text-transform: uppercase;
    margin-bottom: 14px;
    padding-bottom: 10px;
    border-bottom: 1px solid var(--cream-dark);
    font-weight: 600;
  }

  .neon-tag {
    background: var(--neon-pale);
    border: 1px solid rgba(0,232,122,0.3);
    color: var(--neon-dim);
    border-radius: 4px;
    padding: 1px 7px;
    font-size: 10px;
    letter-spacing: 0.08em;
    font-weight: 600;
  }

  .field-label {
    font-size: 10px;
    letter-spacing: 0.12em;
    color: var(--ink-light);
    text-transform: uppercase;
    margin-bottom: 8px;
    font-weight: 600;
  }

  input, textarea {
    background: var(--cream);
    border: 1.5px solid var(--cream-line);
    border-radius: var(--radius);
    padding: 10px 12px;
    color: var(--ink);
    font-size: 13px;
    font-family: 'IBM Plex Mono', monospace;
    outline: none;
    transition: border-color 0.15s, box-shadow 0.15s;
    width: 100%;
  }
  input:focus, textarea:focus {
    border-color: var(--neon-dim);
    box-shadow: 0 0 0 3px var(--neon-ghost);
  }
  textarea { resize: vertical; line-height: 1.6; }

  .terminal-cursor::after {
    content: '_';
    animation: blink 1s step-end infinite;
    color: var(--neon);
    font-weight: 700;
  }

  .section { margin-bottom: 28px; animation: fadeUp 0.3s ease; }

  .step-label {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 10px;
    letter-spacing: 0.15em;
    color: var(--ink-faint);
    text-transform: uppercase;
    margin-bottom: 12px;
    font-weight: 600;
  }
  .step-num {
    color: var(--neon-dim);
    font-size: 15px;
    font-weight: 700;
  }

  .jcard {
    background: white;
    border: 2px solid var(--cream-line);
    border-radius: var(--radius-lg);
    padding: 16px 12px;
    cursor: pointer;
    text-align: center;
    transition: all 0.15s;
    font-family: inherit;
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 7px;
    box-shadow: var(--shadow-sm);
  }
  .jcard:hover { border-color: var(--ink-faint); box-shadow: var(--shadow-md); transform: translateY(-2px); }
  .jcard.active { border-color: var(--neon-dim); box-shadow: 0 0 0 3px var(--neon-ghost), var(--shadow-md); }
  .jcard-accent { position: absolute; top: 0; left: 0; right: 0; height: 3px; }

  .type-chip {
    background: white;
    border: 2px solid var(--cream-line);
    border-radius: var(--radius);
    padding: 10px 20px;
    cursor: pointer;
    font-family: inherit;
    font-size: 13px;
    transition: all 0.15s;
    display: flex;
    align-items: center;
    gap: 6px;
    color: var(--ink-mid);
    box-shadow: var(--shadow-sm);
  }
  .type-chip:hover { border-color: var(--ink-faint); box-shadow: var(--shadow-md); }
  .type-chip.active { border-color: var(--neon-dim); color: var(--ink); background: var(--neon-ghost); box-shadow: 0 0 0 3px var(--neon-ghost); }

  .drop-zone {
    border: 2px dashed var(--cream-line);
    border-radius: var(--radius-lg);
    padding: 28px 20px;
    text-align: center;
    cursor: pointer;
    transition: all 0.15s;
    background: var(--cream);
  }
  .drop-zone:hover, .drop-zone.over {
    border-color: var(--neon-dim);
    background: var(--neon-ghost);
  }

  .file-tag {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: white;
    border: 1.5px solid var(--cream-line);
    border-radius: 5px;
    padding: 4px 10px;
    font-size: 11px;
    color: var(--ink-mid);
    box-shadow: var(--shadow-sm);
  }
  .file-tag button { background: none; border: none; color: var(--ink-faint); cursor: pointer; font-size: 12px; padding: 0 2px; }
  .file-tag button:hover { color: var(--rust); }

  .compliance-box {
    background: var(--neon-ghost);
    border: 1.5px solid rgba(0,232,122,0.25);
    border-radius: var(--radius-lg);
    padding: 14px 18px;
    font-size: 12px;
    color: var(--neon-dim);
    line-height: 1.7;
  }
  .compliance-box strong { color: var(--ink); }

  .issue-item { border: 1.5px solid var(--cream-line); border-radius: var(--radius); padding: 14px; margin-bottom: 10px; }
  .pass-item { display: flex; gap: 10px; padding: 8px 0; border-bottom: 1px solid var(--cream-dark); }
  .pass-item:last-child { border-bottom: none; }

  .summary-box {
    display: flex;
    gap: 12px;
    align-items: flex-start;
    background: var(--cream-dark);
    border: 1.5px solid var(--cream-line);
    border-radius: var(--radius-lg);
    padding: 14px 16px;
    margin-bottom: 12px;
  }

  .warn-box {
    background: rgba(212,134,10,0.08);
    border: 1.5px solid rgba(212,134,10,0.25);
    border-radius: var(--radius);
    padding: 10px 12px;
    font-size: 12px;
    color: var(--amber);
    line-height: 1.6;
    margin-top: 10px;
  }

  .err-box {
    background: rgba(200,75,42,0.07);
    border: 1.5px solid rgba(200,75,42,0.25);
    border-radius: var(--radius);
    padding: 10px 14px;
    font-size: 12px;
    color: var(--rust);
    margin-bottom: 12px;
  }

  /* Scanline overlay on header */
  .scanline-wrap { position: relative; overflow: hidden; }
  .scanline-wrap::after {
    content: '';
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(
      0deg,
      transparent,
      transparent 3px,
      rgba(0,232,122,0.015) 3px,
      rgba(0,232,122,0.015) 4px
    );
    pointer-events: none;
    z-index: 1;
  }

  .score-ring {
    position: relative;
    width: 88px;
    height: 88px;
    flex-shrink: 0;
  }
  .score-ring svg { transform: rotate(-90deg); }
  .score-ring-text {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  @media (max-width: 640px) { .grid-2 { grid-template-columns: 1fr; } }
  @media (max-width: 700px) { .jgrid { grid-template-columns: 1fr 1fr !important; } }
`;

// ─── Data ─────────────────────────────────────────────────────────────────────

const REGISTRY = {
  "1": { name: "中国内陆", flag: "🇨🇳", labour: "人社部", tax: "税务总局", visa: "出入境管理局",
    links: { labour: "http://www.mohrss.gov.cn/", tax: "http://www.chinatax.gov.cn/", visa: "https://www.nia.gov.cn/" },
    color: "#C84B2A" },
  "2": { name: "中国香港", flag: "🇭🇰", labour: "劳工处", tax: "税务局", visa: "入境事务处",
    links: { labour: "https://www.labour.gov.hk/", tax: "https://www.ird.gov.hk/", visa: "https://www.immd.gov.hk/" },
    color: "#8B1A2A" },
  "3": { name: "新加坡", flag: "🇸🇬", labour: "MOM", tax: "IRAS", visa: "MOM",
    links: { labour: "https://www.mom.gov.sg/", tax: "https://www.iras.gov.sg/", visa: "https://www.mom.gov.sg/passes-and-permits" },
    color: "#B02020" },
  "4": { name: "美国", flag: "🇺🇸", labour: "DOL", tax: "IRS", visa: "USCIS",
    links: { labour: "https://www.dol.gov/", tax: "https://www.irs.gov/", visa: "https://www.uscis.gov/" },
    color: "#2A4A8A" },
  "5": { name: "加拿大", flag: "🇨🇦", labour: "ESDC", tax: "CRA", visa: "IRCC",
    links: { labour: "https://www.canada.ca/en/employment-social-development.html", tax: "https://www.canada.ca/en/revenue-agency.html", visa: "https://www.canada.ca/en/immigration-refugees-citizenship.html" },
    color: "#C8001A" },
  "6": { name: "日本", flag: "🇯🇵", labour: "厚生労働省", tax: "国税庁", visa: "出入国在留管理庁",
    links: { labour: "https://www.mhlw.go.jp/", tax: "https://www.nta.go.jp/", visa: "https://www.moj.go.jp/isa/" },
    color: "#BC002D" },
};

const QUERY_TYPES = {
  "1": { label: "劳动关系", icon: "⚖️", key: "labour" },
  "2": { label: "个税申报", icon: "🧾", key: "tax" },
  "3": { label: "签证办理", icon: "🛂", key: "visa" },
};

const MOCK_RESULTS = {
  labour: {
    summary: "根据官方劳动法规定，雇主须在法定期限内完成入职/离职程序，确保劳动合同合规签署，提供法定福利保障（含带薪年假、病假等）。",
    checklist: ["劳动合同（一式两份）", "身份证明文件", "学历及资质证明", "健康检查证明（如适用）", "银行账户信息"],
    notes: "离职补偿须按工龄计算，具体标准参考官网最新公告。",
  },
  tax: {
    summary: "企业需依法代扣代缴个人所得税，按月申报。外籍员工适用税收协定税率（如适用），年度汇算清缴须于次年3月31日前完成。",
    checklist: ["员工税务登记表", "工资条及收入证明", "税务登记号码", "纳税申报表（官方表格）", "银行代扣授权书"],
    notes: "税率以官网当期公告为准，建议咨询注册税务师。",
  },
  visa: {
    summary: "工作签证申请须由雇主作为担保方提交申请，员工本人无法单独申请。审批周期约为4-8周，具体以官方通知为准。",
    checklist: ["护照（有效期6个月以上）", "公司雇主担保函", "最近3个月工资单", "学历认证文件", "无犯罪记录证明", "官方申请表格"],
    notes: "续签须在签证到期前至少30天提交，逾期将产生罚款。",
  },
};

const QUERY_SYSTEM = `你是专业的全球HR合规查询助手。根据用户选择的司法区提供劳动法、税务或签证政策信息，输出结构化政策摘要及所需材料清单。仅提供公开政策信息，不提供法律意见。用中文回复，结尾注明"⚠️ 以上信息仅供参考，具体申报须由人工确认后自行提交。"`;

const REVIEW_SYSTEM = `你是专业的HR合规材料初审专家。仔细分析员工材料，对照该司法区官方要求，给出结构化初审报告。

严格输出以下JSON格式（纯JSON，不含任何markdown符号）：
{
  "overallScore": 75,
  "summary": "整体评估总结",
  "passedItems": [{ "item": "材料名称", "comment": "通过原因" }],
  "issueItems": [{ "item": "问题材料", "severity": "高", "issue": "问题描述", "suggestion": "修改建议" }],
  "missingItems": [{ "item": "缺失材料", "reason": "需要原因", "priority": "必须" }],
  "nextSteps": ["行动1", "行动2"],
  "estimatedPassRate": "预计完善后通过率约85%"
}
severity只能是"高"/"中"/"低"，priority只能是"必须"/"建议"。仅返回JSON。`;

// ─── Score Ring ───────────────────────────────────────────────────────────────

function ScoreRing({ score }) {
  const r = 36, circ = 2 * Math.PI * r;
  const filled = (score / 100) * circ;
  const color = score >= 80 ? "var(--neon-dim)" : score >= 60 ? "var(--amber)" : "var(--rust)";
  const label = score >= 80 ? "良好" : score >= 60 ? "需完善" : "需重做";
  return (
    <div className="score-ring">
      <svg width="88" height="88" viewBox="0 0 88 88">
        <circle cx="44" cy="44" r={r} fill="none" stroke="var(--cream-dark)" strokeWidth="6" />
        <circle cx="44" cy="44" r={r} fill="none" stroke={color} strokeWidth="6"
          strokeDasharray={`${filled} ${circ}`} strokeLinecap="round"
          style={{ transition: "stroke-dasharray 0.8s ease" }} />
      </svg>
      <div className="score-ring-text">
        <span style={{ fontSize: "22px", fontWeight: "800", color, lineHeight: 1 }}>{score}</span>
        <span style={{ fontSize: "9px", color, letterSpacing: "0.06em", marginTop: "2px" }}>{label}</span>
      </div>
    </div>
  );
}

function SeverityTag({ severity }) {
  const map = { "高": { bg: "rgba(200,75,42,0.1)", border: "rgba(200,75,42,0.3)", color: "var(--rust)" },
                "中": { bg: "rgba(212,134,10,0.1)", border: "rgba(212,134,10,0.3)", color: "var(--amber)" },
                "低": { bg: "rgba(42,106,184,0.1)", border: "rgba(42,106,184,0.3)", color: "var(--blue)" } };
  const s = map[severity] || map["低"];
  return (
    <span style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.color,
      borderRadius: "4px", padding: "1px 7px", fontSize: "10px", letterSpacing: "0.06em",
      fontWeight: "600", flexShrink: 0 }}>{severity}优先</span>
  );
}

// ─── Document Review ──────────────────────────────────────────────────────────

function DocumentReview() {
  const [jurisdiction, setJurisdiction] = useState(null);
  const [queryType, setQueryType] = useState(null);
  const [scenario, setScenario] = useState("");
  const [files, setFiles] = useState([]);
  const [desc, setDesc] = useState("");
  const [reviewing, setReviewing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef(null);
  const today = new Date().toISOString().split("T")[0];

  const addFiles = (fl) => {
    const ok = ["application/pdf","image/jpeg","image/png","image/jpg","text/plain",
      "application/msword","application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    setFiles(p => [...p, ...Array.from(fl).filter(f => ok.includes(f.type))].slice(0,10));
  };

  const toB64 = f => new Promise((res,rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result.split(",")[1]);
    r.onerror = rej;
    r.readAsDataURL(f);
  });

  const handleReview = async () => {
    if (!jurisdiction || !queryType) { setError("请选择司法区和查询类型"); return; }
    if (!files.length && !desc.trim()) { setError("请上传文件或填写材料说明"); return; }
    setError(""); setReviewing(true); setResult(null);
    try {
      const base = `司法区：${jurisdiction.name} ${jurisdiction.flag}
查询类型：${queryType.label}
申请场景：${scenario||"未指定"}
官方机构：${jurisdiction[queryType.key]}
参考网站：${jurisdiction.links[queryType.key]}
${desc.trim()?`\n材料说明：\n${desc}\n`:""}`;
      const imgs = files.filter(f=>f.type.startsWith("image/"));
      const others = files.filter(f=>!f.type.startsWith("image/"));
      const otherTxt = others.length ? `\n已上传文件：\n${others.map(f=>`- ${f.name} (${(f.size/1024).toFixed(0)}KB)`).join("\n")}\n` : "";

      let msgs;
      if (!imgs.length) {
        msgs = [{ role:"user", content: base+otherTxt+"\n请输出JSON初审报告。" }];
      } else {
        const parts = [{ type:"text", text: base+otherTxt+"\n以下是材料图片：" }];
        for (const img of imgs.slice(0,5)) {
          parts.push({ type:"image", source:{ type:"base64", media_type:img.type, data: await toB64(img) } });
          parts.push({ type:"text", text:`（${img.name}）` });
        }
        parts.push({ type:"text", text:"请输出JSON初审报告。" });
        msgs = [{ role:"user", content: parts }];
      }

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:2000, system:REVIEW_SYSTEM, messages:msgs })
      });
      const data = await res.json();
      const raw = data.content?.map(b=>b.text||"").join("\n")||"";
      setResult(JSON.parse(raw.replace(/```json|```/g,"").trim()));
    } catch(e) { setError("初审失败："+e.message); }
    setReviewing(false);
  };

  const reset = () => { setJurisdiction(null); setQueryType(null); setScenario(""); setFiles([]); setDesc(""); setResult(null); setError(""); };

  if (result) return (
    <div style={{ animation:"fadeUp 0.4s ease" }}>
      {/* Report header */}
      <div className="card" style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12, background:"var(--cream-dark)" }}>
        <div>
          <div style={{ fontSize:16, fontWeight:700, color:"var(--ink)", marginBottom:6, fontFamily:"'IBM Plex Sans',sans-serif" }}>材料初审报告</div>
          <div style={{ fontSize:12, color:"var(--ink-light)", marginBottom:4 }}>
            {jurisdiction?.flag} {jurisdiction?.name} · {queryType?.icon} {queryType?.label} · {today}
          </div>
          <a href={jurisdiction?.links[queryType?.key]} target="_blank" rel="noreferrer"
            style={{ fontSize:11, color:"var(--blue)", fontFamily:"'IBM Plex Mono',monospace" }}>
            ↗ {jurisdiction?.links[queryType?.key]}
          </a>
        </div>
        <ScoreRing score={result.overallScore||0} />
      </div>

      {/* Summary */}
      <div className="summary-box">
        <span style={{ fontSize:20 }}>💬</span>
        <div>
          <p style={{ fontSize:13, color:"var(--ink)", lineHeight:1.8, marginBottom:6 }}>{result.summary}</p>
          {result.estimatedPassRate && (
            <span style={{ fontSize:12, color:"var(--neon-dim)", fontWeight:600 }}>📈 {result.estimatedPassRate}</span>
          )}
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom:12 }}>
        {/* Passed */}
        {result.passedItems?.length>0 && (
          <div className="card">
            <div className="card-header">
              ✅ 审核通过项
              <span className="neon-tag" style={{ marginLeft:"auto" }}>{result.passedItems.length}</span>
            </div>
            {result.passedItems.map((item,i) => (
              <div key={i} className="pass-item">
                <div style={{ width:8, height:8, borderRadius:"50%", background:"var(--neon-dim)", flexShrink:0, marginTop:5 }} />
                <div>
                  <div style={{ fontSize:12, fontWeight:600, color:"var(--ink)" }}>{item.item}</div>
                  <div style={{ fontSize:11, color:"var(--ink-light)", marginTop:2 }}>{item.comment}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Missing */}
        {result.missingItems?.length>0 && (
          <div className="card">
            <div className="card-header">
              📋 缺失材料
              <span style={{ background:"rgba(200,75,42,0.1)", border:"1px solid rgba(200,75,42,0.25)", color:"var(--rust)", borderRadius:4, padding:"0 7px", fontSize:10, fontWeight:600, marginLeft:"auto" }}>
                {result.missingItems.length}
              </span>
            </div>
            {result.missingItems.map((item,i) => (
              <div key={i} className="pass-item">
                <div style={{ width:8, height:8, borderRadius:"50%", background: item.priority==="必须"?"var(--rust)":"var(--amber)", flexShrink:0, marginTop:5 }} />
                <div>
                  <div style={{ display:"flex", alignItems:"center", gap:6, flexWrap:"wrap" }}>
                    <span style={{ fontSize:12, fontWeight:600, color:"var(--ink)" }}>{item.item}</span>
                    <span style={{ fontSize:10, fontWeight:600, color: item.priority==="必须"?"var(--rust)":"var(--amber)",
                      background: item.priority==="必须"?"rgba(200,75,42,0.1)":"rgba(212,134,10,0.1)",
                      border: `1px solid ${item.priority==="必须"?"rgba(200,75,42,0.3)":"rgba(212,134,10,0.3)"}`,
                      borderRadius:4, padding:"0 5px" }}>{item.priority}</span>
                  </div>
                  <div style={{ fontSize:11, color:"var(--ink-light)", marginTop:2 }}>{item.reason}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Issues */}
      {result.issueItems?.length>0 && (
        <div className="card" style={{ marginBottom:12 }}>
          <div className="card-header">
            ⚠️ 问题项与修改建议
            <span style={{ background:"rgba(212,134,10,0.1)", border:"1px solid rgba(212,134,10,0.3)", color:"var(--amber)", borderRadius:4, padding:"0 7px", fontSize:10, fontWeight:600, marginLeft:"auto" }}>
              {result.issueItems.length}
            </span>
          </div>
          {result.issueItems.map((item,i) => (
            <div key={i} className="issue-item">
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
                <span style={{ fontSize:13, fontWeight:600, color:"var(--ink)", fontFamily:"'IBM Plex Sans',sans-serif" }}>{item.item}</span>
                <SeverityTag severity={item.severity} />
              </div>
              <div style={{ fontSize:12, color:"var(--ink-light)", marginBottom:8, lineHeight:1.6 }}>
                <span style={{ color:"var(--rust)", fontWeight:600 }}>问题：</span>{item.issue}
              </div>
              <div style={{ fontSize:12, color:"var(--ink)", background:"var(--neon-ghost)", border:"1.5px solid rgba(0,232,122,0.2)", borderRadius:6, padding:"8px 12px", lineHeight:1.7 }}>
                <span style={{ color:"var(--neon-dim)", fontWeight:600 }}>💡 建议：</span>{item.suggestion}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Next Steps */}
      {result.nextSteps?.length>0 && (
        <div className="card" style={{ marginBottom:16 }}>
          <div className="card-header">🚀 建议下一步行动</div>
          {result.nextSteps.map((step,i) => (
            <div key={i} style={{ display:"flex", gap:10, padding:"8px 0",
              borderBottom: i<result.nextSteps.length-1?"1px solid var(--cream-dark)":"none" }}>
              <span style={{ background:"var(--ink)", color:"var(--neon)", borderRadius:"50%",
                width:22, height:22, display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:11, fontWeight:700, flexShrink:0 }}>{i+1}</span>
              <span style={{ fontSize:13, color:"var(--ink)", lineHeight:1.6 }}>{step}</span>
            </div>
          ))}
        </div>
      )}

      <div className="compliance-box">
        <strong>⚖️ 合规提醒</strong>
        <p style={{ marginTop:6 }}>本初审报告仅基于官方公开政策，不构成法律建议。所有意见仅供参考，<strong>最终以官网最新公告为准</strong>，须由人工HR/法务确认后提交。</p>
      </div>
      <div style={{ display:"flex", gap:10, marginTop:14 }}>
        <button className="btn-secondary" onClick={reset}>↩ 重新审核</button>
        <button className="btn-secondary" onClick={()=>setResult(null)}>✏️ 修改后再审</button>
      </div>
    </div>
  );

  return (
    <div style={{ animation:"fadeUp 0.3s ease" }}>
      <div className="grid-2" style={{ marginBottom:20 }}>
        {/* Left: jurisdiction */}
        <div>
          <div className="field-label">🌏 选择司法区 <span style={{ color:"var(--rust)" }}>*</span></div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8 }}>
            {Object.entries(REGISTRY).map(([key,reg]) => (
              <button key={key} onClick={()=>setJurisdiction({key,...reg})}
                className={`jcard${jurisdiction?.key===key?" active":""}`}>
                <div className="jcard-accent" style={{ background: jurisdiction?.key===key?reg.color:"var(--cream-line)" }} />
                <span style={{ fontSize:24 }}>{reg.flag}</span>
                <span style={{ fontSize:12, color:"var(--ink)", fontWeight:600 }}>{reg.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right: type + scenario */}
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <div>
            <div className="field-label">📋 查询类型 <span style={{ color:"var(--rust)" }}>*</span></div>
            <div style={{ display:"flex", gap:8 }}>
              {Object.entries(QUERY_TYPES).map(([key,qt]) => (
                <button key={key} onClick={()=>setQueryType({key,...qt})}
                  className={`type-chip${queryType?.key===key?" active":""}`} style={{ flex:1, justifyContent:"center" }}>
                  {qt.icon} {qt.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="field-label">🎯 申请场景（选填）</div>
            <input value={scenario} onChange={e=>setScenario(e.target.value)}
              placeholder="如：新员工入职、工签续签…" />
          </div>
          <div style={{ background:"var(--cream-dark)", border:"1.5px solid var(--cream-line)", borderRadius:"var(--radius)", padding:"10px 12px", fontSize:11, color:"var(--ink-light)", lineHeight:1.7 }}>
            <strong style={{ color:"var(--ink)" }}>初审能力：</strong> 读取图片材料内容 · 核对材料完整性 · 识别问题 · 给出修改建议
          </div>
        </div>
      </div>

      {/* File Upload */}
      <div style={{ marginBottom:16 }}>
        <div className="field-label">
          📁 上传材料文件
          <span style={{ color:"var(--ink-faint)", fontWeight:400, marginLeft:6, textTransform:"none", letterSpacing:0 }}>
            — PDF / JPG / PNG / Word · 最多10个 · 图片将被AI直接读取
          </span>
        </div>
        <div className={`drop-zone${dragOver?" over":""}`}
          onDragOver={e=>{e.preventDefault();setDragOver(true)}}
          onDragLeave={()=>setDragOver(false)}
          onDrop={e=>{e.preventDefault();setDragOver(false);addFiles(e.dataTransfer.files)}}
          onClick={()=>fileRef.current?.click()}>
          <input ref={fileRef} type="file" multiple accept=".pdf,.jpg,.jpeg,.png,.txt,.doc,.docx"
            style={{ display:"none" }} onChange={e=>addFiles(e.target.files)} />
          <div style={{ fontSize:28, marginBottom:8 }}>📂</div>
          <div style={{ fontSize:13, color:"var(--ink-light)" }}>
            拖拽文件至此，或 <span style={{ color:"var(--neon-dim)", fontWeight:600 }}>点击选择</span>
          </div>
          <div style={{ fontSize:11, color:"var(--ink-faint)", marginTop:4 }}>
            图片文件 → AI视觉读取 · 其他文件 → 按文件名分析
          </div>
        </div>
        {files.length>0 && (
          <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginTop:10 }}>
            {files.map((f,i) => (
              <div key={i} className="file-tag">
                <span>{f.type.startsWith("image/")?"🖼️":f.type.includes("pdf")?"📄":"📝"}</span>
                <span style={{ maxWidth:130, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{f.name}</span>
                <span style={{ color:"var(--ink-faint)" }}>{(f.size/1024).toFixed(0)}K</span>
                <button onClick={()=>setFiles(p=>p.filter((_,j)=>j!==i))}>✕</button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Text description */}
      <div style={{ marginBottom:16 }}>
        <div className="field-label">✏️ 补充材料说明
          <span style={{ color:"var(--ink-faint)", fontWeight:400, textTransform:"none", letterSpacing:0, marginLeft:6 }}>— 可列举已准备材料及特殊情况</span>
        </div>
        <textarea value={desc} onChange={e=>setDesc(e.target.value)} rows={5}
          placeholder={"例如：\n1. 护照复印件（有效期至2027年3月）\n2. 公司offer letter（已盖章）\n3. 最近3个月工资单（仅有2个月）\n4. 学历证书（中文版，未经公证）"} />
      </div>

      {error && <div className="err-box">⚠️ {error}</div>}

      <button className="btn-primary" onClick={handleReview} disabled={reviewing} style={{ width:"100%", justifyContent:"center", padding:14, fontSize:14 }}>
        {reviewing ? (
          <>
            <span style={{ width:16, height:16, border:"2px solid rgba(0,232,122,0.3)", borderTop:"2px solid var(--neon)", borderRadius:"50%", animation:"spin 0.8s linear infinite", display:"inline-block" }} />
            AI正在对照官方要求逐项分析材料…
          </>
        ) : "🔍 开始材料初审"}
      </button>

      <div style={{ marginTop:12, padding:"10px 14px", background:"var(--cream-dark)", border:"1.5px solid var(--cream-line)", borderRadius:"var(--radius)", fontSize:11, color:"var(--ink-light)", lineHeight:1.7 }}>
        🔒 <strong>安全说明：</strong>文件仅用于本次AI分析，不存储至任何系统，不会自动提交至政府机构。结果须人工复核确认。
      </div>
    </div>
  );
}

// ─── Policy Query ─────────────────────────────────────────────────────────────

function PolicyQuery() {
  const [step, setStep] = useState(1);
  const [jurisdiction, setJurisdiction] = useState(null);
  const [queryType, setQueryType] = useState(null);
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [aiAnswer, setAiAnswer] = useState("");
  const inputRef = useRef(null);
  const today = new Date().toISOString().split("T")[0];

  const pickJ = (key) => { setJurisdiction({key,...REGISTRY[key]}); setQueryType(null); setQuestion(""); setResult(null); setAiAnswer(""); setStep(2); };
  const pickT = (key) => {
    setQueryType({key,...QUERY_TYPES[key]});
    // Reset downstream state so user can freely switch type even after step 3+
    setQuestion(""); setResult(null); setAiAnswer("");
    setStep(3);
    setTimeout(()=>inputRef.current?.focus(),150);
  };

  const submit = async () => {
    if (!question.trim()) return;
    setLoading(true); setResult(MOCK_RESULTS[queryType.key]); setAiAnswer(""); setStep(4);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:1000, system:QUERY_SYSTEM,
          messages:[{ role:"user", content:`司法区：${jurisdiction.name}\n查询类型：${queryType.label}\n问题：${question}` }] })
      });
      const data = await res.json();
      setAiAnswer(data.content?.map(b=>b.text||"").join("\n")||"");
    } catch { setAiAnswer("（AI分析暂不可用，请参考上方基础政策摘要）"); }
    setLoading(false);
  };

  const reset = () => { setStep(1); setJurisdiction(null); setQueryType(null); setQuestion(""); setResult(null); setAiAnswer(""); };

  return (
    <div>
      {/* Step 1 */}
      <div className="section">
        <div className="step-label"><span className="step-num">01</span> 选择司法区</div>
        <div className="jgrid" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10 }}>
          {Object.entries(REGISTRY).map(([key,reg]) => (
            <button key={key} onClick={()=>pickJ(key)}
              className={`jcard${jurisdiction?.key===key?" active":""}`}
              style={{ opacity:1, cursor:"pointer" }}>
              <div className="jcard-accent" style={{ background: jurisdiction?.key===key?reg.color:"var(--cream-line)" }} />
              <span style={{ fontSize:26 }}>{reg.flag}</span>
              <span style={{ fontSize:12, color:"var(--ink)", fontWeight:600 }}>{reg.name}</span>
              <span style={{ fontSize:10, color:"var(--ink-faint)" }}>{reg.labour} · {reg.tax}</span>
            </button>
          ))}
        </div>
      </div>

      {step>=2 && (
        <div className="section">
          <div className="step-label"><span className="step-num">02</span> 选择查询类型</div>
          <div style={{ display:"flex", gap:10 }}>
            {Object.entries(QUERY_TYPES).map(([key,qt]) => (
              <button key={key} onClick={()=>pickT(key)}
                className={`type-chip${queryType?.key===key?" active":""}`}
                style={{ fontSize:14, padding:"12px 28px" }}>
                {qt.icon} {qt.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {step>=3 && (
        <div className="section">
          <div className="step-label"><span className="step-num">03</span> 输入查询问题</div>
          <textarea ref={inputRef} value={question} onChange={e=>setQuestion(e.target.value)}
            disabled={step>3} rows={3} style={{ opacity:step>3?0.7:1 }}
            placeholder={queryType?.key==="labour"?"例如：离职补偿如何计算？试用期规定？":
              queryType?.key==="tax"?"例如：外籍员工个税申报流程？":
              "例如：工作签证续签需要哪些材料？"}
            onKeyDown={e=>{ if(e.key==="Enter"&&!e.shiftKey&&step===3){e.preventDefault();submit();} }} />
          {step===3 && (
            <button className="btn-primary" onClick={submit} disabled={!question.trim()}
              style={{ marginTop:10, opacity:question.trim()?1:0.5 }}>
              开始查询 →
            </button>
          )}
        </div>
      )}

      {step>=4 && result && (
        <div className="section">
          <div className="step-label"><span className="step-num">04</span> 查询结果</div>
          <div className="grid-2" style={{ marginBottom:12 }}>
            <div className="card">
              <div className="card-header">📋 政策摘要</div>
              <p style={{ fontSize:13, color:"var(--ink)", lineHeight:1.8 }}>{result.summary}</p>
            </div>
            <div className="card">
              <div className="card-header">
                🤖 AI 增强分析
                {loading && <span style={{ display:"inline-block", width:6, height:6, background:"var(--neon-dim)", borderRadius:"50%", marginLeft:6, animation:"blink 1s step-end infinite" }} />}
              </div>
              {aiAnswer
                ? <p style={{ fontSize:13, color:"var(--ink)", lineHeight:1.8 }}>{aiAnswer}</p>
                : <p style={{ fontSize:13, color:"var(--ink-faint)", fontStyle:"italic" }}>正在生成分析…</p>}
            </div>
            <div className="card">
              <div className="card-header">✅ 材料清单</div>
              <ol style={{ listStyle:"none", padding:0 }}>
                {result.checklist.map((item,i) => (
                  <li key={i} style={{ display:"flex", gap:10, padding:"6px 0", borderBottom:"1px solid var(--cream-dark)", fontSize:13, color:"var(--ink)" }}>
                    <span style={{ background:"var(--ink)", color:"var(--neon)", borderRadius:4, width:20, height:20,
                      display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:700, flexShrink:0 }}>{i+1}</span>
                    {item}
                  </li>
                ))}
              </ol>
            </div>
            <div className="card">
              <div className="card-header">🔗 来源与注意事项</div>
              <div style={{ marginBottom:10 }}>
                <div style={{ fontSize:11, color:"var(--ink-faint)", marginBottom:3 }}>官方机构</div>
                <div style={{ fontSize:13, fontWeight:600, color:"var(--ink)" }}>{jurisdiction?.[queryType?.key]}</div>
              </div>
              <div style={{ marginBottom:10 }}>
                <div style={{ fontSize:11, color:"var(--ink-faint)", marginBottom:3 }}>官网链接</div>
                <a href={jurisdiction?.links[queryType?.key]} target="_blank" rel="noreferrer"
                  style={{ fontSize:12, color:"var(--blue)", wordBreak:"break-all" }}>
                  {jurisdiction?.links[queryType?.key]}
                </a>
              </div>
              <div className="warn-box">⚠️ {result.notes}</div>
              <div style={{ fontSize:11, color:"var(--ink-faint)", marginTop:8 }}>更新时间：{today}</div>
            </div>
          </div>
          <div className="compliance-box">
            <strong>⚖️ 合规提醒</strong>
            <p style={{ marginTop:6 }}>本系统仅提供公开政策查询，严禁自动登录或提交。所有结果仅供参考，具体申报须由<strong>人工确认</strong>后自行提交。</p>
          </div>
          <button className="btn-secondary" onClick={reset} style={{ marginTop:12 }}>↩ 重新查询</button>
        </div>
      )}
    </div>
  );
}

// ─── App Shell ────────────────────────────────────────────────────────────────

export default function App() {
  const [tab, setTab] = useState("query");
  const [showBanner, setShowBanner] = useState(true);

  return (
    <>
      <style>{css}</style>
      <div style={{ minHeight:"100vh", background:"var(--cream)", fontFamily:"'IBM Plex Mono',monospace" }}>

        {/* Header */}
        <header className="scanline-wrap" style={{
          borderBottom:"2px solid var(--ink)", background:"var(--ink)",
          padding:"0 28px", position:"sticky", top:0, zIndex:100
        }}>
          <div style={{ maxWidth:960, margin:"0 auto" }}>
            {/* Top bar */}
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 0" }}>
              <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                {/* Logo mark */}
                <div style={{ width:36, height:36, background:"var(--neon)", borderRadius:4, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <span style={{ fontSize:18, filter:"invert(1)" }}>⚡</span>
                </div>
                <div>
                  <div style={{ fontSize:14, fontWeight:700, color:"var(--neon)", letterSpacing:"0.05em", lineHeight:1.2 }}>
                    GLOBAL HR COMPLIANCE AGENT
                  </div>
                  <div style={{ fontSize:10, color:"rgba(0,232,122,0.5)", letterSpacing:"0.15em" }}>
                    全球HR合规查询助手 <span className="terminal-cursor" />
                  </div>
                </div>
              </div>
              <div style={{ fontSize:11, color:"rgba(0,232,122,0.4)", letterSpacing:"0.1em" }}>
                🇨🇳 · 🇭🇰 · 🇸🇬 · 🇺🇸 · 🇨🇦 · 🇯🇵
              </div>
            </div>

            {/* Tabs */}
            <div style={{ display:"flex", gap:0, borderTop:"1px solid rgba(0,232,122,0.15)" }}>
              {[
                { key:"query", label:"政策查询", icon:"🔍" },
                { key:"review", label:"材料初审", icon:"📑", isNew:true },
              ].map(t => (
                <button key={t.key} onClick={()=>setTab(t.key)} style={{
                  background:"none", border:"none",
                  borderBottom:`3px solid ${tab===t.key?"var(--neon)":"transparent"}`,
                  padding:"11px 22px", cursor:"pointer",
                  fontSize:13, fontFamily:"'IBM Plex Mono',monospace",
                  display:"flex", alignItems:"center", gap:7,
                  color: tab===t.key?"var(--neon)":"rgba(0,232,122,0.4)",
                  letterSpacing:"0.04em", transition:"all 0.15s",
                }}>
                  <span>{t.icon}</span>
                  <span>{t.label}</span>
                  {t.isNew && (
                    <span style={{ background:"var(--neon)", color:"var(--ink)", fontSize:9,
                      borderRadius:3, padding:"1px 5px", fontWeight:700, letterSpacing:"0.08em" }}>
                      NEW
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* Main */}
        <main style={{ maxWidth:960, margin:"0 auto", padding:"28px 24px 80px" }}>

          {/* Compliance banner */}
          {showBanner && (
            <div style={{ background:"white", border:"2px solid var(--cream-line)", borderLeft:`4px solid var(--amber)`,
              borderRadius:"var(--radius-lg)", padding:"12px 16px", marginBottom:24,
              display:"flex", alignItems:"flex-start", gap:10, boxShadow:"var(--shadow-sm)" }}>
              <span style={{ fontSize:16, flexShrink:0 }}>🔒</span>
              <div style={{ flex:1, fontSize:12, color:"var(--ink-mid)", lineHeight:1.7 }}>
                <strong style={{ color:"var(--ink)" }}>合规声明：</strong>
                本系统仅提供公开政策查询与材料初审参考，严禁自动登录或提交政府系统。所有结果须由人工确认后自行提交。
              </div>
              <button onClick={()=>setShowBanner(false)}
                style={{ background:"none", border:"none", color:"var(--ink-faint)", cursor:"pointer", fontSize:16, padding:"0 2px", flexShrink:0 }}>✕</button>
            </div>
          )}

          {tab==="query" ? <PolicyQuery key="q" /> : <DocumentReview key="r" />}
        </main>

        {/* Footer rule */}
        <div style={{ borderTop:"2px solid var(--ink)", background:"var(--cream-dark)", padding:"14px 28px",
          display:"flex", justifyContent:"space-between", alignItems:"center",
          fontSize:10, color:"var(--ink-faint)", letterSpacing:"0.1em" }}>
          <span>GLOBAL HR COMPLIANCE AGENT · 合规边界：仅查询，不提交，不登录</span>
          <span style={{ color:"var(--neon-dim)", fontWeight:600 }}>⚡ POWERED BY CLAUDE</span>
        </div>
      </div>
    </>
  );
}


