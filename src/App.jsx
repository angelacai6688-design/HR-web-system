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
  "1": {
    name: "中国内陆", flag: "🇨🇳", code: "CN", labour: "人社部", tax: "税务总局", visa: "外交部领事司",
    color: "#C84B2A",
    // 主链接（用于显示）
    links: {
      labour: "http://www.mohrss.gov.cn/",
      tax:    "https://etax.chinatax.gov.cn/",
      visa:   "https://cova.mfa.gov.cn/",
    },
    // 完整官网列表（注入 AI 上下文）
    allLinks: {
      labour: [
        { label: "人力资源和社会保障部（人社部）",         url: "http://www.mohrss.gov.cn/" },
        { label: "全国人社政务服务平台（12333）",           url: "https://www.12333.gov.cn/" },
        { label: "中华人民共和国劳动法（人大网）",          url: "http://www.npc.gov.cn/zgrdw/npc/xinwen/2019-01/07/content_2070261.htm" },
        { label: "天津市人社局",                            url: "https://hrss.tj.gov.cn/" },
        { label: "深圳市人社局",                            url: "http://hrss.sz.gov.cn/" },
      ],
      tax: [
        { label: "自然人电子税务局",                        url: "https://etax.chinatax.gov.cn/" },
        { label: "国家税务总局（总局官网）",                url: "http://www.chinatax.gov.cn/" },
        { label: "国家税务总局上海市税务局",               url: "https://shanghai.chinatax.gov.cn/" },
        { label: "国家税务总局上海电子税务局",             url: "https://etax.shanghai.chinatax.gov.cn/" },
        { label: "个人所得税法（人大网）",                  url: "http://www.npc.gov.cn/zgrdw/npc/xinwen/2011-07/01/content_1662341_6.htm" },
      ],
      visa: [
        { label: "中国签证在线填表系统（COVA）",            url: "https://cova.mfa.gov.cn/" },
        { label: "中国领事服务网（来华签证）",              url: "https://cs.mfa.gov.cn/wgrlh/lhqz/" },
        { label: "中国签证在线办理（领事服务）",            url: "http://consular.mfa.gov.cn/VISA/" },
        { label: "中国签证申请服务中心（海外申请）",        url: "https://www.visaforchina.cn/" },
        { label: "国家移民管理局（来华/出入境）",           url: "https://www.nia.gov.cn/" },
      ],
    },
  },
  "2": {
    name: "中国香港", flag: "🇭🇰", code: "HK", labour: "劳工处", tax: "税务局（IRD）", visa: "入境事务处",
    color: "#8B1A2A",
    links: {
      labour: "https://www.labour.gov.hk/",
      tax:    "https://www.ird.gov.hk/",
      visa:   "https://www.immd.gov.hk/",
    },
    allLinks: {
      labour: [
        { label: "香港劳工处（Labour Department）",         url: "https://www.labour.gov.hk/" },
        { label: "劳资关系专题网站",                        url: "https://www.lr.labour.gov.hk/" },
        { label: "香港政府一站通 – 劳工法例",              url: "https://www.gov.hk/tc/residents/employment/labour/" },
      ],
      tax: [
        { label: "税务局（Inland Revenue Department）",     url: "https://www.ird.gov.hk/" },
        { label: "eTAX 税务易平台",                         url: "https://etax.ird.gov.hk/" },
        { label: "政府一站通 – 税务服务",                   url: "https://www.gov.hk/tc/residents/taxes/" },
      ],
      visa: [
        { label: "香港入境事务处",                          url: "https://www.immd.gov.hk/" },
        { label: "电子化签证申请服务（eVisa）",             url: "https://www.immd.gov.hk/hks/evisaonline.html" },
        { label: "一般签证要求（GovHK）",                   url: "https://www.gov.hk/tc/nonresidents/visarequire/" },
      ],
    },
  },
  "3": {
    name: "新加坡", flag: "🇸🇬", code: "SG", labour: "MOM", tax: "IRAS", visa: "ICA",
    color: "#B02020",
    links: {
      labour: "https://www.mom.gov.sg/",
      tax:    "https://www.iras.gov.sg/",
      visa:   "https://www.ica.gov.sg/",
    },
    allLinks: {
      labour: [
        { label: "Ministry of Manpower (MOM)",              url: "https://www.mom.gov.sg/" },
        { label: "雇佣法令指南（MOM 中文）",                url: "https://www.mom.gov.sg/-/media/mom/documents/employment-practices/workright/workright-guideemployment-laws-mandarin.pdf" },
        { label: "Employment Act（雇佣法）",                url: "https://www.mom.gov.sg/employment-practices/employment-act" },
      ],
      tax: [
        { label: "Inland Revenue Authority of Singapore (IRAS)", url: "https://www.iras.gov.sg/" },
        { label: "个人所得税电子申报（myTax Portal）",     url: "https://www.iras.gov.sg/taxes/individual-income-tax/basics-of-individual-income-tax/understanding-myincome-tax-filing/e-filing-your-income-tax-return" },
        { label: "个人所得税基础说明",                     url: "https://www.iras.gov.sg/taxes/individual-income-tax" },
      ],
      visa: [
        { label: "Immigration & Checkpoints Authority (ICA)", url: "https://www.ica.gov.sg/" },
        { label: "签证要求查询（ICA）",                    url: "https://www.ica.gov.sg/enter-transit-depart/entering-singapore/visa_requirements" },
        { label: "工作准证（EP/SP/WP）– MOM",              url: "https://www.mom.gov.sg/passes-and-permits" },
      ],
    },
  },
  "4": {
    name: "美国", flag: "🇺🇸", code: "US", labour: "DOL", tax: "IRS", visa: "国务院/USCIS",
    color: "#2A4A8A",
    links: {
      labour: "https://www.dol.gov/",
      tax:    "https://www.irs.gov/",
      visa:   "https://travel.state.gov/content/travel/en/us-visas.html",
    },
    allLinks: {
      labour: [
        { label: "U.S. Department of Labor (DOL)",          url: "https://www.dol.gov/" },
        { label: "National Labor Relations Board (NLRB)",   url: "https://www.nlrb.gov/" },
        { label: "Worker.gov（劳工权益综合入口）",          url: "https://www.worker.gov/" },
        { label: "USCIS – 雇主合规",                        url: "https://www.uscis.gov/employers" },
      ],
      tax: [
        { label: "Internal Revenue Service (IRS)",          url: "https://www.irs.gov/" },
        { label: "如何报税（IRS 中文指南）",                url: "https://www.irs.gov/zh-hans/filing/individuals/how-to-file" },
        { label: "个人报税信息中心（IRS）",                 url: "https://www.irs.gov/individuals" },
      ],
      visa: [
        { label: "美国国务院签证官网",                      url: "https://travel.state.gov/content/travel/en/us-visas.html" },
        { label: "DS-160 在线申请系统",                     url: "https://ceac.state.gov/genniv/" },
        { label: "USCIS（移民与公民服务）",                 url: "https://www.uscis.gov/" },
        { label: "美国驻华使领馆签证信息",                  url: "https://china.usembassy-china.org.cn/zh/visas-zh/" },
      ],
    },
  },
  "5": {
    name: "加拿大", flag: "🇨🇦", code: "CA", labour: "ESDC", tax: "CRA", visa: "IRCC",
    color: "#C8001A",
    links: {
      labour: "https://www.canada.ca/en/employment-social-development.html",
      tax:    "https://www.canada.ca/en/revenue-agency.html",
      visa:   "https://www.canada.ca/en/immigration-refugees-citizenship.html",
    },
    allLinks: {
      labour: [
        { label: "Employment and Social Development Canada (ESDC)", url: "https://www.canada.ca/en/employment-social-development.html" },
        { label: "Canada Industrial Relations Board (CIRB)",        url: "https://www.cirb-ccri.gc.ca/en" },
        { label: "劳动标准（Employment Standards）",                url: "https://www.canada.ca/en/employment-social-development/services/labour-standards.html" },
        { label: "加拿大劳工法规综合入口",                          url: "https://laws-lois.justice.gc.ca/eng/acts/L-2/" },
      ],
      tax: [
        { label: "Canada Revenue Agency (CRA)",                     url: "https://www.canada.ca/en/revenue-agency.html" },
        { label: "在线报税与电子申报（NETFILE）",                   url: "https://www.canada.ca/en/revenue-agency/services/forms-publications/tax-packages-years/general-income-tax-benefit-package/5000-g.html" },
        { label: "个人报税指南（CRA）",                             url: "https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/about-your-tax-return.html" },
        { label: "My Account – CRA 个人账户",                       url: "https://www.canada.ca/en/revenue-agency/services/e-services/e-services-individuals/account-individuals.html" },
      ],
      visa: [
        { label: "Immigration, Refugees and Citizenship Canada (IRCC)", url: "https://www.canada.ca/en/immigration-refugees-citizenship.html" },
        { label: "签证及移民申请入口",                              url: "https://www.canada.ca/en/services/immigration-citizenship.html" },
        { label: "工作许可证（Work Permit）",                       url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/work-canada/permit.html" },
        { label: "IRCC 在线申请系统",                               url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/application.html" },
      ],
    },
  },
  "6": {
    name: "日本", flag: "🇯🇵", code: "JP", labour: "厚生労働省", tax: "国税庁", visa: "外務省/入管庁",
    color: "#BC002D",
    links: {
      labour: "https://www.mhlw.go.jp/index.html",
      tax:    "https://www.nta.go.jp/english/taxes/individual/index.htm",
      visa:   "https://www.mofa.go.jp/j_info/visit/visa/",
    },
    allLinks: {
      labour: [
        { label: "厚生労働省（MHLW）日文主页",                      url: "https://www.mhlw.go.jp/index.html" },
        { label: "厚生労働省英文主页",                              url: "https://www.mhlw.go.jp/english/" },
        { label: "劳动标准专页（Labour Standards）",                url: "https://www.mhlw.go.jp/stf/english/labour_standards_index.html" },
        { label: "东京外国人雇用服务中心（中文）",                  url: "https://jsite.mhlw.go.jp/tokyo-foreigner/chinese/spec/spec_1c.html" },
        { label: "法務省 – 外国人就业与在留资格",                   url: "https://www.moj.go.jp/ENGLISH/m_nyuukokukanri10_00011.html" },
      ],
      tax: [
        { label: "国税庁（NTA）英文主页",                           url: "https://www.nta.go.jp/english/taxes/individual/index.htm" },
        { label: "国税庁日文主页",                                  url: "https://www.nta.go.jp/" },
        { label: "确定申告（年度个税申报）说明 – JETRO",            url: "https://www.jetro.go.jp/sc/invest/setting_up/section3/page7.html" },
        { label: "个人住民税说明（地方税示例）",                    url: "https://www.city.matsudo.chiba.jp/InternationalPortal/zh-cn/forforeignresidents/shikenminnzei.html" },
      ],
      visa: [
        { label: "外務省 – 签证总入口",                             url: "https://www.mofa.go.jp/j_info/visit/visa/" },
        { label: "JAPAN eVISA（日本电子签证）",                     url: "https://www.mofa.go.jp/j_info/visit/visa/visaonline.html" },
        { label: "日本驻华大使馆 – 签证说明",                       url: "https://www.cn.emb-japan.go.jp/consular.htm" },
        { label: "就业/长期停留签证说明（驻华使馆）",               url: "https://www.cn.emb-japan.go.jp/itpr_zh/visa_shikaku.html" },
        { label: "Visit Japan Web（入境手续在线系统）",             url: "https://services.digital.go.jp/zh-cmn-hant/visit-japan-web/" },
        { label: "出入国在留管理庁（入管庁）",                      url: "https://www.moj.go.jp/isa/" },
      ],
    },
  },
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

const QUERY_SYSTEM = `你是专业的全球HR合规查询助手（Global HR Compliance Agent）。

职责：根据用户选择的司法区与查询类型，提供准确的政策信息；回答时优先引用用户消息中提供的【官方参考网站列表】中的链接作为来源；输出结构化政策摘要，如有多个相关官网，分别引用并说明各网站用途。

合规边界：仅提供公开政策信息，不作法律判断，所有结果必须附带"需人工最终确认"提示。

请用中文回复，格式清晰，结尾注明"⚠️ 以上信息仅供参考，具体申报须由人工确认后自行提交，并以官网最新公告为准。"`;

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
      const siteList = (jurisdiction.allLinks?.[queryType.key] || []).map(l => `- ${l.label}：${l.url}`).join("\n");
      const base = `司法区：${jurisdiction.name} ${jurisdiction.flag}
查询类型：${queryType.label}
申请场景：${scenario||"未指定"}
官方机构：${jurisdiction[queryType.key]}

【官方参考网站列表】
${siteList}
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
          <div style={{ display:"flex", flexWrap:"wrap", gap:"6px", marginTop:4 }}>
            {(jurisdiction?.allLinks?.[queryType?.key] || []).map((l,i) => (
              <a key={i} href={l.url} target="_blank" rel="noreferrer"
                style={{ fontSize:10, color:"var(--blue)", background:"rgba(42,106,184,0.07)", border:"1px solid rgba(42,106,184,0.2)", borderRadius:4, padding:"2px 7px", whiteSpace:"nowrap" }}>
                ↗ {l.label}
              </a>
            ))}
          </div>
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
                <div style={{ fontSize:16, fontWeight:800, color: jurisdiction?.key===key?reg.color:"var(--ink-light)", letterSpacing:"0.05em", fontFamily:"'IBM Plex Mono',monospace" }}>{reg.code}</div>
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
    setLoading(true); setResult(null); setAiAnswer(""); setStep(4);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:2000, system:QUERY_SYSTEM,
          messages:[{ role:"user", content:`司法区：${jurisdiction.name}
查询类型：${queryType.label}
问题：${question}

【官方参考网站列表】
${(jurisdiction.allLinks?.[queryType.key] || []).map(l => `- ${l.label}：${l.url}`).join("\n")}

请基于以上官方网站，详细回答用户问题。要求：
1. 提供完整、详细的政策制度说明，包括具体规定、数字、流程、条件等
2. 分段清晰，易于阅读
3. 回答结尾单独列出本次回答所依据的官方网站来源（名称+URL）` }] })
      });
      const data = await res.json();
      const text = data.content?.map(b=>b.text||"").join("\n")||"";
      setAiAnswer(text);
      setResult(true);
    } catch { setAiAnswer("（查询暂不可用，请稍后重试）"); setResult(true); }
    setLoading(false);
  };

  const reset = () => { setStep(1); setJurisdiction(null); setQueryType(null); setQuestion(""); setResult(null); setAiAnswer(""); };

  return (
    <div>
      {/* Step 1 */}
      <div className="section">
        <div className="step-label"><span className="step-num">01</span> 选择司法区</div>
        <div className="jgrid" style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(155px, 1fr))", gap:10 }}>
          {Object.entries(REGISTRY).map(([key,reg]) => (
            <button key={key} onClick={()=>pickJ(key)}
              className={`jcard${jurisdiction?.key===key?" active":""}`}
              style={{ opacity:1, cursor:"pointer" }}>
              <div className="jcard-accent" style={{ background: jurisdiction?.key===key?reg.color:"var(--cream-line)" }} />
              <div style={{ fontSize:20, fontWeight:800, color: jurisdiction?.key===key?reg.color:"var(--ink-light)", letterSpacing:"0.05em", fontFamily:"'IBM Plex Mono',monospace" }}>{reg.code}</div>
              <span style={{ fontSize:12, color:"var(--ink)", fontWeight:600 }}>{reg.name}</span>
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

      {step>=4 && (
        <div className="section">
          <div className="step-label"><span className="step-num">04</span> 查询结果</div>

          {/* Policy Info Card */}
          <div className="card" style={{ marginBottom:12 }}>
            <div className="card-header">
              📋 政策信息
              <span style={{ marginLeft:8, fontSize:10, color:"var(--ink-faint)", fontWeight:400, textTransform:"none", letterSpacing:0 }}>
                {jurisdiction?.name} · {queryType?.label}
              </span>
              {loading && <span style={{ display:"inline-block", width:6, height:6, background:"var(--neon-dim)", borderRadius:"50%", marginLeft:"auto", animation:"blink 1s step-end infinite" }} />}
            </div>
            {loading && !aiAnswer ? (
              <div style={{ display:"flex", alignItems:"center", gap:12, padding:"16px 0", color:"var(--ink-light)", fontSize:13 }}>
                <span style={{ width:16, height:16, border:"2px solid var(--cream-line)", borderTop:"2px solid var(--neon-dim)", borderRadius:"50%", animation:"spin 0.8s linear infinite", display:"inline-block", flexShrink:0 }} />
                正在从官方政策数据库检索详细信息，请稍候…
              </div>
            ) : (
              <div style={{ fontSize:13, color:"var(--ink)", lineHeight:2, whiteSpace:"pre-wrap" }}>{aiAnswer}</div>
            )}
          </div>

          {/* Source Links Card */}
          <div className="card" style={{ marginBottom:12 }}>
            <div className="card-header">🔗 网站来源</div>
            <div style={{ display:"flex", flexDirection:"column", gap:0 }}>
              {(jurisdiction?.allLinks?.[queryType?.key] || []).map((l,i) => (
                <a key={i} href={l.url} target="_blank" rel="noreferrer"
                  style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 0",
                    borderBottom: i < (jurisdiction?.allLinks?.[queryType?.key]||[]).length-1 ? "1px solid var(--cream-dark)" : "none",
                    textDecoration:"none", transition:"background 0.1s" }}>
                  <span style={{ width:24, height:24, background:"var(--ink)", color:"var(--neon)", borderRadius:4,
                    display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, flexShrink:0 }}>↗</span>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:13, color:"var(--ink)", fontWeight:500, marginBottom:1 }}>{l.label}</div>
                    <div style={{ fontSize:11, color:"var(--blue)", wordBreak:"break-all", opacity:0.8 }}>{l.url}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          <div className="compliance-box">
            <strong>⚖️ 合规提醒</strong>
            <p style={{ marginTop:6 }}>本系统仅提供公开政策查询，严禁自动登录或提交。所有结果仅供参考，具体申报须由<strong>人工确认</strong>后自行提交，并以官网最新公告为准。</p>
          </div>
          <button className="btn-secondary" onClick={reset} style={{ marginTop:12 }}>↩ 重新查询</button>
        </div>
      )}
    </div>
  );
}


// ─── Tax Engine (2026 FY) ─────────────────────────────────────────────────────

const TaxEngine = {
  // 中国内陆 — 综合所得，起征点6万/年，7档累进
  CN: {
    currency: "CNY", symbol: "¥",
    fields: [
      { key:"income",  label:"税前年度总薪酬 (CNY)",        placeholder:"如：300000" },
      { key:"social",  label:"社保公积金扣除 (CNY/年)",       placeholder:"如：30000，不确定可填0" },
      { key:"special", label:"其他专项附加扣除 (CNY/年)",     placeholder:"如：子女教育、房贷利息等" },
    ],
    notes: [
      "起征点：60,000 元/年（5,000元/月）",
      "应纳税所得额 = 年收入 − 60,000 − 社保公积金 − 专项附加扣除",
      "税率：3%–45% 共7档累进税率",
      "以上为估算，实际以个税APP汇算清缴结果为准",
    ],
    calc: (vals) => {
      const taxable = Math.max(0, (vals.income||0) - 60000 - (vals.social||0) - (vals.special||0));
      const rules = [
        {lim:36000,   r:0.03, q:0},
        {lim:144000,  r:0.10, q:2520},
        {lim:300000,  r:0.20, q:16920},
        {lim:420000,  r:0.25, q:31920},
        {lim:660000,  r:0.30, q:52920},
        {lim:960000,  r:0.35, q:85920},
        {lim:Infinity,r:0.45, q:181920},
      ];
      const band = rules.find(x => taxable <= x.lim);
      const tax = Math.max(0, taxable * band.r - band.q);
      return { tax, taxable, takeHome: (vals.income||0) - tax - (vals.social||0) };
    },
  },

  // 香港 — 薪俸税，累进 or 标准税率取低
  HK: {
    currency: "HKD", symbol: "HK$",
    fields: [
      { key:"income",  label:"税前年薪 (HKD)",                placeholder:"如：600000" },
      { key:"mpf",     label:"强积金MPF供款 (HKD/年)",         placeholder:"如：18000（上限18,000）" },
      { key:"special", label:"其他免税额/扣除 (HKD/年)",       placeholder:"如：子女免税额132000/名" },
    ],
    notes: [
      "基本免税额：132,000 HKD（2025/26年度）",
      "累进税率：2% / 6% / 10% / 14% / 17%（每级50,000起）",
      "标准税率：15%（年收入≤5,000,000）或 16%",
      "取累进税与标准税较低者",
      "MPF强积金上限：每月18,000 × 5% = 每年最多10,800雇员供款",
    ],
    calc: (vals) => {
      const net = Math.max(0, (vals.income||0) - 132000 - (vals.mpf||0) - (vals.special||0));
      let prog = 0, rem = net;
      const progRates = [0.02, 0.06, 0.10, 0.14, 0.17];
      for (let i = 0; i < 4; i++) {
        const chunk = Math.min(rem, 50000); prog += chunk * progRates[i]; rem -= chunk;
        if (rem <= 0) break;
      }
      if (rem > 0) prog += rem * 0.17;
      const stdRate = (vals.income||0) > 5000000 ? 0.16 : 0.15;
      const tax = Math.min(prog, (vals.income||0) * stdRate);
      return { tax, taxable: net, takeHome: (vals.income||0) - tax - (vals.mpf||0) };
    },
  },

  // 新加坡 — 居民个税，累进，无起征点（20k以下0%）
  SG: {
    currency: "SGD", symbol: "S$",
    fields: [
      { key:"income",  label:"税前年收入 (SGD)",               placeholder:"如：120000" },
      { key:"cpf",     label:"CPF公积金供款 (SGD/年)",          placeholder:"如：37740（55岁以下约20%）" },
      { key:"relief",  label:"个人所得税减免额 (SGD/年)",       placeholder:"如：薪亲假、技能培训等" },
    ],
    notes: [
      "20,000 SGD以下：0% 免税",
      "累进税率：0%–24%（2024课税年起最高24%）",
      "CPF供款：雇员部分（55岁以下约20%），不计入应税收入",
      "新加坡无遗产税、资本利得税",
      "外籍人士（非居民）统一税率15%或累进税率取高",
    ],
    calc: (vals) => {
      const taxable = Math.max(0, (vals.income||0) - (vals.cpf||0) - (vals.relief||0));
      const bands = [
        {from:0,      to:20000,  base:0,     rate:0},
        {from:20000,  to:30000,  base:0,     rate:0.02},
        {from:30000,  to:40000,  base:200,   rate:0.035},
        {from:40000,  to:80000,  base:550,   rate:0.07},
        {from:80000,  to:120000, base:3350,  rate:0.115},
        {from:120000, to:160000, base:7950,  rate:0.15},
        {from:160000, to:200000, base:13950, rate:0.18},
        {from:200000, to:240000, base:21150, rate:0.19},
        {from:240000, to:280000, base:28750, rate:0.195},
        {from:280000, to:320000, base:36550, rate:0.20},
        {from:320000, to:500000, base:44550, rate:0.22},
        {from:500000, to:1000000,base:84150, rate:0.23},
        {from:1000000,to:Infinity,base:199150,rate:0.24},
      ];
      let tax = 0;
      for (let i = bands.length-1; i >= 0; i--) {
        if (taxable > bands[i].from) {
          tax = bands[i].base + (taxable - bands[i].from) * bands[i].rate;
          break;
        }
      }
      return { tax, taxable, takeHome: (vals.income||0) - tax - (vals.cpf||0) };
    },
  },

  // 美国 — 联邦税，单身报税2026，标准扣除16,550
  US: {
    currency: "USD", symbol: "$",
    fields: [
      { key:"income",    label:"年度总收入 Gross Income (USD)",  placeholder:"如：120000" },
      { key:"standard",  label:"标准扣除额 (USD，2026单身约16,550)", placeholder:"留空则自动使用16,550" },
      { key:"other",     label:"其他扣除 401k/IRA 等 (USD/年)", placeholder:"如：23000（401k上限）" },
    ],
    notes: [
      "2026年标准扣除（单身）：约16,550 USD",
      "联邦税率：10% / 12% / 22% / 24% / 32% / 35% / 37%",
      "不含州税（各州税率0%–13.3%不等）",
      "不含FICA社保税（7.65%）",
      "已婚联合报税扣除额约33,100 USD",
    ],
    calc: (vals) => {
      const stdDed = (vals.standard||0) > 0 ? (vals.standard||0) : 16550;
      const taxable = Math.max(0, (vals.income||0) - stdDed - (vals.other||0));
      const brackets = [
        {from:0,       to:11925,  rate:0.10},
        {from:11925,   to:48475,  rate:0.12},
        {from:48475,   to:103350, rate:0.22},
        {from:103350,  to:197300, rate:0.24},
        {from:197300,  to:250525, rate:0.32},
        {from:250525,  to:626350, rate:0.35},
        {from:626350,  to:Infinity,rate:0.37},
      ];
      let tax = 0;
      brackets.forEach(b => {
        if (taxable > b.from) tax += (Math.min(taxable, b.to) - b.from) * b.rate;
      });
      return { tax, taxable, takeHome: (vals.income||0) - tax };
    },
  },

  // 加拿大 — 联邦税2026，基础个人免税额约16,129 CAD
  CA: {
    currency: "CAD", symbol: "CA$",
    fields: [
      { key:"income",  label:"年度总收入 (CAD)",                placeholder:"如：100000" },
      { key:"rrsp",    label:"RRSP退休储蓄扣除 (CAD/年)",       placeholder:"如：18000（上限为收入18%）" },
      { key:"other",   label:"其他联邦扣除额 (CAD/年)",         placeholder:"如：工会会费、托育费等" },
    ],
    notes: [
      "2026年基础个人免税额（BPA）：约16,129 CAD",
      "联邦税率：15% / 20.5% / 26% / 29% / 33%",
      "不含省税（各省税率约4%–21%不等）",
      "RRSP上限：收入×18%，最高31,560 CAD (2025)",
      "以上仅为联邦税估算",
    ],
    calc: (vals) => {
      const bpa = 16129;
      const taxable = Math.max(0, (vals.income||0) - bpa - (vals.rrsp||0) - (vals.other||0));
      const brackets = [
        {from:0,       to:57375,  rate:0.15},
        {from:57375,   to:114750, rate:0.205},
        {from:114750,  to:158519, rate:0.26},
        {from:158519,  to:220000, rate:0.29},
        {from:220000,  to:Infinity,rate:0.33},
      ];
      let tax = 0;
      brackets.forEach(b => {
        if (taxable > b.from) tax += (Math.min(taxable, b.to) - b.from) * b.rate;
      });
      const bpaTaxCredit = bpa * 0.15;
      const finalTax = Math.max(0, tax - bpaTaxCredit);
      return { tax: finalTax, taxable, takeHome: (vals.income||0) - finalTax - (vals.rrsp||0) };
    },
  },

  // 日本 — 所得税+复兴特别税(2.1%)，基础控除48万日元
  JP: {
    currency: "JPY", symbol: "¥",
    fields: [
      { key:"income",    label:"年度给与収入 (JPY / 日元)",       placeholder:"如：6000000" },
      { key:"social",    label:"社会保険料控除 (JPY/年)",          placeholder:"如：900000（约收入15%）" },
      { key:"other",     label:"その他控除 (JPY/年)",             placeholder:"如：配偶者控除、扶養控除等" },
    ],
    notes: [
      "基礎控除：480,000 JPY（合计所得2,400万以下）",
      "给与所得控除：按收入阶梯自动扣除（55万~195万）",
      "税率：5%–45% 共7档，另加2.1%复兴特别税",
      "不含住民税（约10%，地方税）",
      "外国人居住满1年起视为居住者，适用相同税率",
    ],
    calc: (vals) => {
      const grossIncome = vals.income || 0;
      // 给与所得控除 (employment income deduction)
      let empDed = 0;
      if      (grossIncome <= 1625000)  empDed = 550000;
      else if (grossIncome <= 1800000)  empDed = grossIncome * 0.4 - 100000;
      else if (grossIncome <= 3600000)  empDed = grossIncome * 0.3 + 80000;
      else if (grossIncome <= 6600000)  empDed = grossIncome * 0.2 + 440000;
      else if (grossIncome <= 8500000)  empDed = grossIncome * 0.1 + 1100000;
      else                              empDed = 1950000;
      const basicDed = 480000;
      const taxable = Math.max(0, grossIncome - empDed - basicDed - (vals.social||0) - (vals.other||0));
      const brackets = [
        {from:0,        to:1950000,  rate:0.05, ded:0},
        {from:1950000,  to:3300000,  rate:0.10, ded:97500},
        {from:3300000,  to:6950000,  rate:0.20, ded:427500},
        {from:6950000,  to:9000000,  rate:0.23, ded:636000},
        {from:9000000,  to:18000000, rate:0.33, ded:1536000},
        {from:18000000, to:40000000, rate:0.40, ded:2796000},
        {from:40000000, to:Infinity, rate:0.45, ded:4796000},
      ];
      let incomeTax = 0;
      for (let i = brackets.length-1; i >= 0; i--) {
        if (taxable > brackets[i].from) {
          incomeTax = taxable * brackets[i].rate - brackets[i].ded;
          break;
        }
      }
      const totalTax = Math.max(0, incomeTax) * 1.021; // 复兴特别税
      return { tax: totalTax, taxable, takeHome: grossIncome - totalTax - (vals.social||0) };
    },
  },
};

// ─── Tax Calculator Component ─────────────────────────────────────────────────

const TAX_JURISDICTIONS = [
  { id:"1", name:"中国内陆", code:"CN", engineKey:"CN" },
  { id:"2", name:"中国香港", code:"HK", engineKey:"HK" },
  { id:"3", name:"新加坡",   code:"SG", engineKey:"SG" },
  { id:"4", name:"美国",     code:"US", engineKey:"US" },
  { id:"5", name:"加拿大",   code:"CA", engineKey:"CA" },
  { id:"6", name:"日本",     code:"JP", engineKey:"JP" },
];

function fmt(n, sym) {
  if (!n && n !== 0) return "—";
  const abs = Math.abs(Math.round(n));
  return sym + abs.toLocaleString("en-US");
}

function BarChart({ items }) {
  const max = Math.max(...items.map(x => x.val), 1);
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:8, marginTop:4 }}>
      {items.map((item, i) => (
        <div key={i}>
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:"var(--ink-light)", marginBottom:3 }}>
            <span>{item.label}</span>
            <span style={{ fontWeight:600, color: item.accent || "var(--ink)" }}>{item.display}</span>
          </div>
          <div style={{ height:8, background:"var(--cream-dark)", borderRadius:4, overflow:"hidden" }}>
            <div style={{
              height:"100%", borderRadius:4,
              width: `${Math.min(100, (item.val / max) * 100)}%`,
              background: item.accent || "var(--ink-faint)",
              transition:"width 0.6s ease",
            }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function TaxCalculator() {
  const [jId, setJId] = useState("1");
  const [vals, setVals] = useState({});
  const [result, setResult] = useState(null);
  const [calcDone, setCalcDone] = useState(false);

  const j = TAX_JURISDICTIONS.find(x => x.id === jId);
  const engine = TaxEngine[j.engineKey];

  const setVal = (key, v) => setVals(prev => ({ ...prev, [key]: parseFloat(v) || 0 }));

  const handleCalc = () => {
    const r = engine.calc(vals);
    setResult(r);
    setCalcDone(true);
  };

  const handleReset = () => { setVals({}); setResult(null); setCalcDone(false); };

  const switchJ = (id) => { setJId(id); setVals({}); setResult(null); setCalcDone(false); };

  const effRate = result && (vals[engine.fields[0].key]||0) > 0
    ? ((result.tax / (vals[engine.fields[0].key]||1)) * 100).toFixed(1)
    : null;

  return (
    <div style={{ animation:"fadeUp 0.3s ease", maxWidth:800, margin:"0 auto" }}>

      {/* Jurisdiction selector */}
      <div className="card" style={{ marginBottom:16 }}>
        <div className="card-header">🌏 选择计税司法区</div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8 }}>
          {TAX_JURISDICTIONS.map(tj => (
            <button key={tj.id} onClick={() => switchJ(tj.id)} style={{
              padding:"12px 8px", borderRadius:"var(--radius)", border:"2px solid",
              borderColor: jId===tj.id ? "var(--neon-dim)" : "var(--cream-line)",
              background: jId===tj.id ? "var(--ink)" : "white",
              color: jId===tj.id ? "var(--neon)" : "var(--ink-mid)",
              cursor:"pointer", transition:"all 0.15s",
              fontFamily:"'IBM Plex Mono',monospace", fontWeight:600, fontSize:13,
              display:"flex", flexDirection:"column", alignItems:"center", gap:3,
              boxShadow: jId===tj.id ? "0 0 0 3px var(--neon-ghost)" : "var(--shadow-sm)",
            }}>
              <span style={{ fontSize:16, fontWeight:800 }}>{tj.code}</span>
              <span style={{ fontSize:11, opacity:0.8 }}>{tj.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Input fields — each jurisdiction has unique fields */}
      <div className="card" style={{ marginBottom:16 }}>
        <div className="card-header">
          💰 输入薪酬信息
          <span style={{ marginLeft:8, fontSize:10, color:"var(--ink-faint)", fontWeight:400, textTransform:"none", letterSpacing:0 }}>
            货币：{engine.currency}
          </span>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          {engine.fields.map(f => (
            <div key={f.key}>
              <div className="field-label">{f.label}</div>
              <input
                type="number" min="0"
                value={vals[f.key] || ""}
                onChange={e => setVal(f.key, e.target.value)}
                placeholder={f.placeholder}
                style={{ fontFamily:"'IBM Plex Mono',monospace" }}
              />
            </div>
          ))}
        </div>

        {/* Jurisdiction-specific notes */}
        <div style={{ marginTop:16, padding:"12px 14px", background:"var(--cream-dark)",
          border:"1.5px solid var(--cream-line)", borderRadius:"var(--radius)", fontSize:11,
          color:"var(--ink-light)", lineHeight:1.8 }}>
          <div style={{ fontWeight:700, color:"var(--ink)", marginBottom:6, fontSize:11, letterSpacing:"0.08em" }}>
            📌 {j.name} 计税规则说明
          </div>
          {engine.notes.map((n,i) => (
            <div key={i} style={{ display:"flex", gap:6 }}>
              <span style={{ color:"var(--neon-dim)", flexShrink:0 }}>·</span>
              <span>{n}</span>
            </div>
          ))}
        </div>

        <div style={{ display:"flex", gap:10, marginTop:16 }}>
          <button className="btn-primary" onClick={handleCalc}
            style={{ flex:1, justifyContent:"center", fontSize:14, padding:"13px" }}>
            🧮 计算预估个税
          </button>
          {calcDone && (
            <button className="btn-secondary" onClick={handleReset}>
              ↺ 重置
            </button>
          )}
        </div>
      </div>

      {/* Result panel */}
      {result && (
        <div style={{ animation:"fadeUp 0.35s ease" }}>
          <div className="card">
            <div className="card-header">📊 估算结果
              <span style={{ marginLeft:8, fontSize:10, color:"var(--ink-faint)", fontWeight:400, textTransform:"none", letterSpacing:0 }}>
                {j.name} · {engine.currency}
              </span>
            </div>

            {/* Big numbers */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12, marginBottom:20 }}>
              {[
                { label:"预估年纳税额", val: fmt(result.tax, engine.symbol), sub: `月均 ${fmt(result.tax/12, engine.symbol)}`, accent:"var(--rust)" },
                { label:"税后到手薪资", val: fmt(result.takeHome, engine.symbol), sub: `月均 ${fmt(result.takeHome/12, engine.symbol)}`, accent:"var(--neon-dim)" },
                { label:"综合税率",     val: effRate ? effRate+"%" : "—", sub: "应纳税 / 税前收入", accent:"var(--amber)" },
              ].map((item,i) => (
                <div key={i} style={{ background:"var(--cream-dark)", borderRadius:"var(--radius)", padding:"14px 12px",
                  border:"1.5px solid var(--cream-line)", textAlign:"center" }}>
                  <div style={{ fontSize:10, color:"var(--ink-light)", letterSpacing:"0.08em", marginBottom:6, fontWeight:600 }}>
                    {item.label}
                  </div>
                  <div style={{ fontSize:18, fontWeight:800, color:item.accent, fontFamily:"'IBM Plex Mono',monospace", lineHeight:1.2 }}>
                    {item.val}
                  </div>
                  <div style={{ fontSize:10, color:"var(--ink-faint)", marginTop:4 }}>{item.sub}</div>
                </div>
              ))}
            </div>

            {/* Bar chart breakdown */}
            <div style={{ marginBottom:16 }}>
              <div style={{ fontSize:11, color:"var(--ink-light)", fontWeight:600, letterSpacing:"0.08em", marginBottom:10 }}>
                收入构成分解
              </div>
              <BarChart items={[
                { label:"税前总收入", val: vals[engine.fields[0].key]||0, display: fmt(vals[engine.fields[0].key]||0, engine.symbol), accent:"var(--ink-light)" },
                { label:"预估纳税额", val: result.tax, display: fmt(result.tax, engine.symbol), accent:"var(--rust)" },
                ...(engine.fields[1] && (vals[engine.fields[1].key]||0) > 0 ? [
                  { label: engine.fields[1].label.split(" (")[0], val: vals[engine.fields[1].key]||0, display: fmt(vals[engine.fields[1].key]||0, engine.symbol), accent:"var(--amber)" }
                ] : []),
                { label:"税后到手", val: result.takeHome, display: fmt(result.takeHome, engine.symbol), accent:"var(--neon-dim)" },
              ]} />
            </div>

            {/* Disclaimer */}
            <div style={{ padding:"10px 12px", background:"rgba(212,134,10,0.07)", border:"1.5px solid rgba(212,134,10,0.2)",
              borderRadius:"var(--radius)", fontSize:11, color:"var(--amber)", lineHeight:1.7 }}>
              ⚠️ 本计算结果为估算，仅供参考。实际税额以官方申报为准，建议咨询注册税务师或会计师确认。
            </div>
          </div>
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
          padding:"0 40px", position:"sticky", top:0, zIndex:100
        }}>
          <div style={{ maxWidth:"100%", margin:"0 auto" }}>
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
                CN · HK · SG · US · CA · JP
              </div>
            </div>

            {/* Tabs */}
            <div style={{ display:"flex", gap:0, borderTop:"1px solid rgba(0,232,122,0.15)" }}>
              {[
                { key:"query",  label:"政策查询", icon:"🔍" },
                { key:"tax",    label:"个税计算", icon:"🧮" },
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
        <main style={{ maxWidth:"100%", margin:"0 auto", padding:"28px 40px 80px" }}>

          {/* Compliance banner */}
          {showBanner && tab !== "tax" && (
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

          {tab==="query"  && <PolicyQuery key="q" />}
          {tab==="tax"    && <TaxCalculator key="t" />}
          {tab==="review" && <DocumentReview key="r" />}
        </main>

        {/* Footer rule */}
        <div style={{ borderTop:"2px solid var(--ink)", background:"var(--cream-dark)", padding:"14px 40px",
          display:"flex", justifyContent:"space-between", alignItems:"center",
          fontSize:10, color:"var(--ink-faint)", letterSpacing:"0.1em" }}>
          <span>GLOBAL HR COMPLIANCE AGENT  ·  CN · HK · SG · US · CA · JP  ·  合规边界：仅查询，不提交，不登录</span>
          <span style={{ color:"var(--neon-dim)", fontWeight:600 }}>⚡ POWERED BY CLAUDE</span>
        </div>
      </div>
    </>
  );
}
