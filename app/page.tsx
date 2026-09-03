'use client';

import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import { ArrowRight, Beaker, BookOpenCheck, BrainCircuit, Check, Database, FolderGit2 as GithubIcon, Globe2, Mail, ShieldCheck } from 'lucide-react';
import questionData from '../content/questions.json';
import diversityData from '../content/diversity.json';

type Language = 'zh' | 'en';
type Rubric = { rubric_id: string; ordinal: number; criterion: string; score: number; scoring_anchor: string; reference: string };
type Question = { question_id: string; number: number; title: string; dimension: string; drug_modality: string; development_stage: string; difficulty: string; question_type: string; grading_method: string; stem_markdown: string; rubrics: Rubric[] };
type QuestionSet = { set_id: string; set_number: number; title: string; doi: string; questions: Question[] };
const sets = questionData as QuestionSet[];

type DimStat = { key: string; zh: string; en: string; count: number; ratio: number; target: number | null; gap: number | null; status: string };
type ModStat = DimStat & { color: string };
type Batch = { id: string; zh: string; en: string; range: number[]; status: string; statusZh: string; sets: number; plannedSets: number; trackedSets: number; questions: number; shares: { zh: string; en: string; ratio: number }[] };
type Diversity = {
  generated: string;
  scope: { total_sets: number; total_questions: number; authored_sets: number; authored_questions: number };
  radar: DimStat[];
  modalities: ModStat[];
  stages: DimStat[];
  difficulties: DimStat[];
  questionTypes: { key: string; zh: string; en: string; count: number; ratio: number }[];
  batches: Batch[];
  crosstab: { rows: { key: string; zh: string; en: string }[]; cols: { key: string; zh: string; en: string }[]; counts: number[][] };
  literature: { downloaded: number; formal: number; uniqueDoi: number; eligible: number; modality: Record<string, number>; rounds: { round: string; zh: string; en: string; downloaded: number; formal: number; modality: Record<string, number> }[] };
};
const dv = diversityData as Diversity;
const DIM_COLORS = ['#205d47', '#4d82bd', '#7a62be', '#3a9aa5', '#d9864f', '#c46a78', '#8f8a4f', '#5b6770'];

const copy = {
  zh: {
    nav: ['数据概览', '评测结果', '能力覆盖', '数据多样性', '架构与评测', '完整样例', '合作方案'], eyebrow: 'MEDICINAL CHEMISTRY · AI TRAINING & EVALUATION',
    title: '用真实药物研发难题，\n训练和检验科学智能体',
    intro: '由药物化学专家逐题命题、逐项制定评分标准：500 个完整题组、约 2,000 个环环相扣的任务、约 10,000 条评分细则，全部锚定真实药物研发文献与实验数据，可直接用于模型训练、偏好优化、强化学习与内部评测。',
    cta: '洽谈合作与授权', samples: '查看两个完整题组', proof: '14 个「模型 × Coding Agent」组合已完成同一批 20 个题组的试测，每份作答均经三轮独立匿名评分。',
    resultsTitle: 'Pilot20：14 个系统同场实测', resultsText: '同一批 20 个题组，同一套评分标准。每个系统完成 20 份有效作答，每份作答由 Luna High 独立评分三次，取单题中位数汇总。柱形为得分率，满分 800 分。',
    scoreRate: '得分率', higherBetter: '越高越好', medianNote: '单题三次评分取中位数后汇总',
    overviewTitle: '不是选择题，而是真实的研发判断', overviewText: '任务基于真实化合物系列、结构证据与 DMPK 数据构建，要求模型提出可论证的优化方案、甄别相互竞争的解释，并在多重约束下完成候选物决策——这正是药化专家每天的工作。',
    coverageTitle: '从数据解读到项目决策的完整链条', coverageText: '每个题组包含四个环环相扣的任务：既可拆作独立训练样本，也可串联成一条完整的智能体工作流。',
    architectureTitle: '榜单上的每一分，都能回溯到原始证据', architectureText: '题目版本、作答环境、模型身份与评分记录全链路留存：任何成绩都可回溯到原始回答、逐条评分依据与完整运行日志，合作方可随时复查。',
    architectureNote: '已公开的 Pilot20 结果：14 个「模型 × Coding Harness」组合全部完成作答，并经三轮独立匿名评分。',
    principlesTitle: '可信度，来自被完整记录的每一步',
    sampleTitle: '两个完整题组，逐字呈现', sampleText: '以下内容完整取自第 7 和第 11 题组：四个任务、全部题干数据、正向评分项、错误扣分项与证据引用，均未删减。', sampleNote: '点击任意题目，展开完整题干与评分细则',
    answer: '完整评分细则', positive: '正向评分项', penalty: '错误扣分项', evidence: '证据',
    cooperationTitle: '按你的研发目标，选择合作方式', cooperationText: '从小规模付费试评起步，或直接采购完整数据与训练用途授权。所有方案均支持按你的数据字段与格式交付，可出具美元报价并支持美元结算。',
    contactTitle: '让你的模型，先过药化专家这一关', contactText: '欢迎大模型团队、AI 制药公司、训练数据服务商与科研机构联系洽谈。',
    email: '发送合作邮件', github: 'GitHub 项目', sourceLanguage: '', setLabel: '完整题组', tasks: '个任务', footer: 'MedChem Agent Benchmark · Expert-curated data for scientific AI',
    facts: [['14', '参赛系统'], ['20', '题组'], ['60', '次独立评分 / 系统']],
    features: [
      ['Evidence-grounded', '每道题都锚定真实论文、补充材料、结构数据与实验结果。'],
      ['Reasoning-intensive', '覆盖定量比较、因果推断、结构设计与真实研发决策。'],
      ['Expert-scored', '每个任务配备正向评分标准、严重错误扣分项与证据引用。'],
    ] as const,
    diversityTitle: '题库与文献的多样性全景',
    diversityText: '1,120 道已登记子题覆盖八项能力维度：项目决策与 ADMET/DMPK 占比最高，SAR 解读与分子设计紧随其后，平均每道题串联约 1.9 个维度——正是真实药化评审的思考方式。模态构成 77% 小分子 / 11% 大环多肽 / 11% 抗体 ADC，直接映射当前研发管线；近九成题目达到 L2+ 难度，专家级 L3 占 48%。',
    diversityNote: `统计口径：截至 ${dv.generated}，280 个题组 / 1,120 道子题已完成命题并登记全部元数据，以下图表均为实际统计；第三、四批共 220 个题组按计划推进。`,
    radarTitle: '八项能力维度的实际构成',
    legendActual: '实际占比（多维可叠加）',
    modalityTitle: '药物模态', stageTitle: '研发阶段', difficultyTitle: '难度', qTypeTitle: '题型分布',
    batchTitle: '四批生产进度', setsUnit: '题组',
    statusText: { AUTHORED: '已完成命题', AUTHORING: '命题进行中', PLANNED: '已规划' } as Record<string, string>,
    crossTitle: '药物模态 × 研发阶段（子题数）',
    litTitle: '支撑文献分布',
    litLabels: { downloaded: '下载文献', formal: '正式入库', doi: '独立 DOI', eligible: '可作题源' },
  },
  en: {
    nav: ['Dataset', 'Results', 'Coverage', 'Diversity', 'Architecture', 'Full samples', 'Licensing'], eyebrow: 'MEDICINAL CHEMISTRY · AI TRAINING & EVALUATION',
    title: 'Real drug-discovery problems, built to train and test scientific agents',
    intro: 'Written and scored by practicing medicinal chemists: 500 complete task sets, ~2,000 connected tasks, and ~10,000 rubric entries — all grounded in real drug-discovery literature and experimental data. Ready for model training, preference optimization, reinforcement learning, and private evaluation.',
    cta: 'Discuss licensing & partnership', samples: 'View two full task sets', proof: 'All 14 model × coding-agent combinations completed the same 20 task sets; every answer was scored in three independent blind passes.',
    resultsTitle: 'Pilot20: 14 systems, one playing field', resultsText: 'Same 20 task sets, same rubric. Each system produced 20 valid answers, each independently scored three times by Luna High and aggregated as per-task medians. Bars show the score rate against the 800-point maximum.',
    scoreRate: 'Score rate', higherBetter: 'higher is better', medianNote: 'Aggregated from the median of three scores per task',
    overviewTitle: 'Not multiple choice — real program judgment', overviewText: 'Tasks are built from real compound series, structural evidence, and DMPK data. Models must propose defensible optimization strategies, adjudicate competing explanations, and make candidate decisions under multiple constraints — the work a medicinal chemist does every day.',
    coverageTitle: 'The full chain from data interpretation to project decisions', coverageText: 'Each set contains four interconnected tasks — use them as standalone training examples, or chain them into a complete agent workflow.',
    architectureTitle: 'Every point on the board traces back to raw evidence', architectureText: 'Task versions, answering environments, model identities, and scoring records are preserved end to end. Any score can be traced back to the raw answer, item-level rubric decisions, and complete run logs — open for partners to inspect at any time.',
    architectureNote: 'Now public — Pilot20: all 14 model × coding-harness combinations completed the benchmark and three independent anonymized scoring passes.',
    principlesTitle: 'Credibility comes from recording every step',
    sampleTitle: 'Two complete task sets, reproduced in full', sampleText: 'Taken verbatim from Sets 7 and 11: all four tasks, complete prompt data, positive criteria, error penalties, and evidence references — nothing abridged.', sampleNote: 'Expand any task to read the full prompt and scoring rubric',
    answer: 'Complete scoring rubric', positive: 'Positive criteria', penalty: 'Error penalties', evidence: 'Evidence',
    cooperationTitle: 'Choose the engagement that fits your program', cooperationText: 'Start with a paid pilot, or license the complete dataset with training rights. Every plan can be delivered against your own schema and format, with USD pricing and invoicing available.',
    contactTitle: 'Put your model in front of a medicinal chemistry expert', contactText: 'We welcome inquiries from foundation-model teams, AI drug-discovery companies, training-data providers, and research organizations.',
    email: 'Email for partnership', github: 'GitHub project', sourceLanguage: 'Full task content is presented in its original Chinese. Professional English adaptation is available with licensed delivery.', setLabel: 'Full task set', tasks: 'tasks', footer: 'MedChem Agent Benchmark · Expert-curated data for scientific AI',
    facts: [['14', 'systems'], ['20', 'sets'], ['60', 'blind judgements / system']],
    features: [
      ['Evidence-grounded', 'Every task is anchored in real papers, supplementary data, molecular structures, and experimental results.'],
      ['Reasoning-intensive', 'Quantitative comparison, causal inference, structural design, and real program decisions.'],
      ['Expert-scored', 'Positive criteria, critical-error penalties, and evidence references for every task.'],
    ] as const,
    diversityTitle: 'A diversity panorama across tasks and literature',
    diversityText: 'The actual composition of 1,120 registered sub-questions: program decisions and ADMET/DMPK lead the eight capability dimensions, with SAR interpretation and molecular design close behind — each question weaves about 1.9 dimensions together, the way real medicinal-chemistry reviews think. The modality mix (77% small molecules, 11% macrocycles/peptides, 11% antibodies/ADC) mirrors current pipelines; nearly 9 in 10 questions are L2+ difficulty and 48% are expert-level L3.',
    diversityNote: `As of ${dv.generated}, 280 sets / 1,120 sub-questions are fully authored with complete metadata and every chart below shows actual registered data; batches 3–4 (220 more sets) progress on schedule.`,
    radarTitle: 'Actual mix across eight capability dimensions',
    legendActual: 'Actual share (multi-label)',
    modalityTitle: 'Drug modality', stageTitle: 'Development stage', difficultyTitle: 'Difficulty', qTypeTitle: 'Question types',
    batchTitle: 'Four-batch production', setsUnit: 'sets',
    statusText: { AUTHORED: 'authored', AUTHORING: 'authoring', PLANNED: 'planned' } as Record<string, string>,
    crossTitle: 'Modality × stage (sub-questions)',
    litTitle: 'Supporting literature',
    litLabels: { downloaded: 'downloaded', formal: 'formalized', doi: 'unique DOIs', eligible: 'question-source eligible' },
  },
};

const metrics = [['500', '题组 / task sets'], ['≈2,000', '任务 / tasks'], ['≈10,000', '评分项 / rubric entries'], ['14', '模型组合 / model systems']];
const coverage = [['SAR', '构效关系分析 / structure–activity relationships'], ['SBDD', '结构证据与结合模式 / structural evidence & binding mode'], ['DMPK', '暴露、清除与代谢 / exposure, clearance & metabolism'], ['Lead optimization', '多参数先导优化 / multiparameter optimization'], ['Candidate selection', '候选物优选与提名 / candidate nomination'], ['Experimental design', '竞争假说与判别性实验 / discriminating experiments']];
const plansByLanguage = {
  zh: [
    ['付费试评', '20 题组 · 80 个任务 · 含完整评分报告', '¥49,800'],
    ['标准授权', '100 题组 · 约 400 个任务 · 授权 12 个月', '¥198,000'],
    ['完整内部授权', '全部 500 题组 · 授权 24 个月', '¥598,000'],
    ['训练用途授权', '支持 SFT / 偏好优化 / 强化学习', '¥798,000'],
    ['独家战略合作', '完整数据 + 定制更新与联合共建', '¥1,000,000'],
  ],
  en: [
    ['Paid pilot', '20 sets · 80 tasks · full scoring report', 'USD quote'],
    ['Standard license', '100 sets · ~400 tasks · 12-month term', 'USD quote'],
    ['Complete internal license', 'All 500 sets · 24-month term', 'USD quote'],
    ['Training license', 'SFT / preference optimization / RL', 'USD quote'],
    ['Exclusive partnership', 'Complete data + custom updates & co-development', 'USD quote'],
  ],
};
const workflowRows = {
  zh: [
    { label: '模型作答', note: '统一输入，独立会话', nodes: ['固定题目快照', '作答 Prompt 包', '统一工作流规格', 'Harness + 模型', '原始回答与运行信息'] },
    { label: '匿名评审', note: '逐项核对证据，三轮重复评分', nodes: ['回答导入', '随机匿名化', '题面 + Rubric + 回答', '三轮独立评审', 'Rubric 得分与证据'] },
    { label: '分析展示', note: '从单题记录到系统横向比较', nodes: ['SQLite 评测数据', '中位数与一致性分析', '排行与题目统计', '回答比较', '可复查报告'] },
  ],
  en: [
    { label: 'Answering', note: 'Standardized inputs, isolated sessions', nodes: ['Fixed task snapshot', 'Prompt package', 'Workflow specification', 'Harness + model', 'Raw answers and run records'] },
    { label: 'Blind judging', note: 'Item-level evidence, three repeated passes', nodes: ['Answer import', 'Random anonymization', 'Task + rubric + answer', 'Three independent passes', 'Rubric scores and evidence'] },
    { label: 'Analysis', note: 'From item records to system comparison', nodes: ['SQLite evaluation data', 'Median and agreement analysis', 'Rankings and task statistics', 'Answer comparison', 'Inspectable reports'] },
  ],
};
const evaluationPrinciples = {
  zh: [
    ['版本锁定', '题面、评分标准与 Prompt 全程版本一致，所有参赛系统面对完全相同的输入。'],
    ['真实运行记录', '完整保存实际模型、推理强度、会话编号、耗时、工具调用与重试历史。'],
    ['匿名三轮评分', '隐藏参赛者身份并打乱作答顺序，基于逐项证据完成三轮独立评分。'],
    ['可解释统计', '以单题得分中位数汇总成绩，同时公开评分一致性与需人工复核的样本。'],
  ],
  en: [
    ['Fixed versions', 'Task statements, rubrics, and prompts are version-locked — every system faces identical inputs.'],
    ['Authentic run records', 'Model, reasoning effort, session IDs, duration, tool calls, and retry history are preserved in full.'],
    ['Triple blind scoring', 'Participant identities are hidden and answer order is shuffled across three independent, evidence-based passes.'],
    ['Interpretable statistics', 'Scores aggregate per-task medians, with agreement metrics and human-review candidates kept visible.'],
  ],
};
const pilotResults = [
  { model: 'Kimi K3', harness: 'Kimi Code', score: 80.31, points: 642.5, color: '#1080f8' },
  { model: 'Muse Spark 1.2', harness: 'OpenCode', score: 80.12, points: 641.0, color: '#7050f8' },
  { model: 'Grok 4.6', harness: 'Grok Build', score: 79.88, points: 639.0, color: '#202124' },
  { model: 'GLM-5.3', harness: 'ZCode', score: 79.00, points: 632.0, color: '#e11d48' },
  { model: 'GPT-5.6 Sol', harness: 'Codex', score: 78.31, points: 626.5, color: '#0f614d' },
  { model: 'GPT-5.6 Sol', harness: 'Pi', score: 77.75, points: 622.0, color: '#2f7d68' },
  { model: 'DeepSeek V4 Flash', harness: 'DeepSeek Harness', score: 76.12, points: 609.0, color: '#4868f8' },
  { model: 'Qwen 3.8 Max', harness: 'OpenCode', score: 74.81, points: 598.5, color: '#615ced' },
  { model: 'Grok 4.5', harness: 'Grok Build', score: 73.00, points: 584.0, color: '#52525b' },
  { model: 'GPT-5.6 Luna', harness: 'Codex', score: 70.06, points: 560.5, color: '#3b7768' },
  { model: 'HY 3 Free', harness: 'OpenCode', score: 69.44, points: 555.5, color: '#0891b2' },
  { model: 'Qwen 3.7 Max', harness: 'OpenCode', score: 65.25, points: 522.0, color: '#7b77e8' },
  { model: 'GLM-5 Turbo', harness: 'ZCode', score: 64.56, points: 516.5, color: '#d24b69' },
  { model: 'GPT-5.3 Spark', harness: 'Codex', score: 57.69, points: 461.5, color: '#759188' },
];
const scoreGrid = [100, 80, 60, 40, 20, 0];

function inline(text: string): ReactNode[] {
  return text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g).filter(Boolean).map((part, index) => {
    if (part.startsWith('`') && part.endsWith('`')) return <code key={index}>{part.slice(1, -1)}</code>;
    if (part.startsWith('**') && part.endsWith('**')) return <strong key={index}>{part.slice(2, -2)}</strong>;
    return <span key={index}>{part}</span>;
  });
}

function MarkdownContent({ value }: { value: string }) {
  const lines = value.replace(/\r/g, '').split('\n'); const blocks: ReactNode[] = []; let i = 0;
  while (i < lines.length) {
    const line = lines[i].trim(); if (!line) { i += 1; continue; }
    if (line.startsWith('|') && i + 1 < lines.length && /^\|?[\s:|-]+\|?$/.test(lines[i + 1].trim())) {
      const rows: string[][] = [line.split('|').slice(1, -1).map((cell) => cell.trim())]; i += 2;
      while (i < lines.length && lines[i].trim().startsWith('|')) { rows.push(lines[i].trim().split('|').slice(1, -1).map((cell) => cell.trim())); i += 1; }
      blocks.push(<div className="table-scroll" key={`table-${i}`}><table><thead><tr>{rows[0].map((cell, n) => <th key={n}>{inline(cell)}</th>)}</tr></thead><tbody>{rows.slice(1).map((row, r) => <tr key={r}>{row.map((cell, c) => <td key={c}>{inline(cell)}</td>)}</tr>)}</tbody></table></div>); continue;
    }
    if (line.startsWith('>')) { const quote: string[] = []; while (i < lines.length && lines[i].trim().startsWith('>')) { quote.push(lines[i].trim().replace(/^>\s?/, '')); i += 1; } blocks.push(<blockquote key={`quote-${i}`}>{inline(quote.join(' '))}</blockquote>); continue; }
    if (/^[-*]\s+/.test(line)) { const items: string[] = []; while (i < lines.length && /^[-*]\s+/.test(lines[i].trim())) { items.push(lines[i].trim().replace(/^[-*]\s+/, '')); i += 1; } blocks.push(<ul key={`list-${i}`}>{items.map((item, n) => <li key={n}>{inline(item)}</li>)}</ul>); continue; }
    if (line.startsWith('#')) { blocks.push(<h4 key={`heading-${i}`}>{inline(line.replace(/^#+\s*/, ''))}</h4>); i += 1; continue; }
    const paragraph = [line]; i += 1;
    while (i < lines.length && lines[i].trim() && !lines[i].trim().startsWith('|') && !lines[i].trim().startsWith('>') && !/^[-*]\s+/.test(lines[i].trim()) && !lines[i].trim().startsWith('#')) { paragraph.push(lines[i].trim()); i += 1; }
    blocks.push(<p key={`p-${i}`}>{inline(paragraph.join(' '))}</p>);
  }
  return <div className="markdown-body">{blocks}</div>;
}

function SampleSet({ set, language }: { set: QuestionSet; language: Language }) {
  const t = copy[language];
  return <article className="sample-set">
    <div className="sample-head"><div><p className="kicker">{t.setLabel} {String(set.set_number).padStart(2, '0')} · {set.set_id}</p><h3>{set.title}</h3><p className="doi">DOI {set.doi}</p></div><span className="task-count">4 {t.tasks}</span></div>
    {t.sourceLanguage && <p className="language-note">{t.sourceLanguage}</p>}
    <div className="question-list">{set.questions.map((question) => <details key={question.question_id} className="question-card">
      <summary><span className="q-index">Q{question.number}</span><span><strong>{question.title}</strong><small>{question.dimension} · {question.difficulty} · {question.development_stage}</small></span><span className="summary-plus">＋</span></summary>
      <div className="question-content"><div className="meta-line"><span>{question.drug_modality}</span><span>{question.question_type}</span><span>{question.grading_method}</span></div><MarkdownContent value={question.stem_markdown} />
        <div className="rubric-title"><BookOpenCheck size={17} /> {t.answer}</div><div className="rubrics">{question.rubrics.map((rubric) => <div className={`rubric ${rubric.score < 0 ? 'negative' : 'positive'}`} key={rubric.rubric_id}><div className="score">{rubric.score > 0 ? '+' : ''}{rubric.score}</div><div><p className="rubric-kind">{rubric.score < 0 ? t.penalty : t.positive}</p><p>{rubric.criterion}</p><p className="reference"><strong>{t.evidence}：</strong>{rubric.reference}</p></div></div>)}</div>
      </div></details>)}</div>
  </article>;
}

function ResultsChart({ language }: { language: Language }) {
  const t = copy[language];
  return <section className="results-card" id="results" aria-labelledby="results-title">
    <div className="results-head"><div><p className="kicker">PILOT20 · RESULTS</p><h2 id="results-title">{t.resultsTitle}</h2><p>{t.resultsText}</p></div><div className="results-facts">{t.facts.map(([value, label]) => <span key={label}><b>{value}</b> {label}</span>)}</div></div>
    <div className="results-scroll"><div className="results-plot">
      <div className="score-axis" aria-hidden="true">{scoreGrid.map((level) => <span key={level} style={{ bottom: `${level * 2.45 + 104}px` }}>{level}</span>)}</div>
      <div className="score-grid" aria-hidden="true">{scoreGrid.map((level) => <i key={level} style={{ bottom: `${level}%` }} />)}</div>
      <div className="result-bars">{pilotResults.map((entry, index) => <button type="button" className="result-column" key={`${entry.harness}-${entry.model}`} aria-label={`${index + 1}. ${entry.model}, ${entry.harness}, ${entry.score.toFixed(2)}%, ${entry.points} / 800`}>
        <div className="bar-track"><div className="result-bar" style={{ '--score': `${entry.score}%`, background: entry.color } as CSSProperties}><strong>{entry.score.toFixed(1)}</strong></div></div>
        <div className="result-label"><span className="result-rank">#{index + 1}</span><b>{entry.model}</b><small>{entry.harness}</small></div>
        <div className="result-tip" role="tooltip"><b>{entry.model}</b><span>{entry.harness}</span><strong>{entry.score.toFixed(2)}% <small>{entry.points} / 800</small></strong></div>
      </button>)}</div>
    </div></div>
    <div className="results-caption"><span>{t.scoreRate} · {t.higherBetter}</span><span>{t.medianNote}</span></div>
  </section>;
}

function DiversitySection({ language }: { language: Language }) {
  const t = copy[language];
  const name = (x: { zh: string; en: string }) => (language === 'zh' ? x.zh : x.en);
  const pct = (v: number) => `${Math.round(v * 100)}%`;
  const maxCross = Math.max(...dv.crosstab.counts.flat());
  const modColor: Record<string, string> = {};
  dv.modalities.forEach((m) => { modColor[m.zh] = m.color; });
  const modEn: Record<string, string> = {};
  dv.modalities.forEach((m) => { modEn[m.zh] = m.en; });
  const modLabel = (zhKey: string) => (language === 'zh' ? zhKey : modEn[zhKey] ?? zhKey);

  const size = 400; const c = size / 2; const R = 128; const SCALE = 0.5;
  const axisPt = (i: number, v: number): [number, number] => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / dv.radar.length;
    return [c + Math.cos(a) * R * (v / SCALE), c + Math.sin(a) * R * (v / SCALE)];
  };
  const poly = (key: 'ratio' | 'target') => dv.radar.map((d, i) => axisPt(i, d[key] ?? 0).join(',')).join(' ');
  const kpis = language === 'zh'
    ? [['500', '题组'], ['2,000', '任务'], ['8', '能力维度'], ['540', '支撑文献']]
    : [['500', 'sets'], ['2,000', 'tasks'], ['8', 'dimensions'], ['540', 'papers']];
  const groups: [string, DimStat[]][] = [[t.modalityTitle, dv.modalities], [t.stageTitle, dv.stages], [t.difficultyTitle, dv.difficulties]];

  return <section className="section soft" id="diversity">
    <div className="section-lead"><p className="section-number">03 · DIVERSITY</p><h2>{t.diversityTitle}</h2><p>{t.diversityText}</p><p className="architecture-note"><Check size={15} />{t.diversityNote}</p></div>
    <div className="dv-kpis">{kpis.map(([value, label]) => <div className="dv-kpi" key={label}><strong>{value}</strong><span>{label}</span></div>)}</div>
    <div className="dv-grid">
      <div className="dv-card dv-radar-card">
        <p className="kicker">{t.radarTitle}</p>
        <svg className="dv-radar" viewBox="-124 -10 648 420" aria-hidden="true">
          {[0.1, 0.2, 0.3, 0.4, 0.5].map((level) => <polygon key={level} className="dv-radar-ring" points={dv.radar.map((_, i) => axisPt(i, level).join(',')).join(' ')} />)}
          {dv.radar.map((_, i) => { const [x, y] = axisPt(i, SCALE); return <line key={i} className="dv-radar-spoke" x1={c} y1={c} x2={x} y2={y} />; })}
          <polygon className="dv-radar-actual" points={poly('ratio')} />
          {dv.radar.map((d, i) => { const [x, y] = axisPt(i, SCALE + 0.075); return <text key={d.key} className="dv-radar-label" x={x} y={y} textAnchor={x > c + 8 ? 'start' : x < c - 8 ? 'end' : 'middle'} dominantBaseline="middle">{language === 'zh' ? d.zh : d.en}</text>; })}
        </svg>
        <div className="dv-legend"><span><i className="dv-swatch is-actual" />{t.legendActual}</span></div>
      </div>
      <div className="dv-groups">
        {groups.map(([title, rows]) => <div className="dv-card dv-group" key={title}>
          <p className="kicker">{title}</p>
          {rows.map((row) => <div className="dv-row" key={row.key}>
            <span className="dv-row-name">{name(row)}</span>
            <div className="dv-row-bars"><div className="dv-track"><i className="dv-actual" style={{ width: pct(row.ratio) }} /></div><span className="dv-nums">{pct(row.ratio)} · {row.count}</span></div>
          </div>)}
        </div>)}
        <div className="dv-card dv-group">
          <p className="kicker">{t.qTypeTitle}</p>
          {dv.questionTypes.map((row) => <div className="dv-row" key={row.key}>
            <span className="dv-row-name">{name(row)}</span>
            <div className="dv-row-bars"><div className="dv-track"><i className="dv-actual" style={{ width: pct(row.ratio) }} /></div><span className="dv-nums">{pct(row.ratio)} · {row.count}</span></div>
          </div>)}
        </div>
      </div>
    </div>
    <div className="dv-card dv-batches">
      <p className="kicker">{t.batchTitle}</p>
      {dv.batches.map((b) => <div className="dv-batch" key={b.id}>
        <div className="dv-batch-head"><strong>{name(b)}</strong><span className="dv-batch-range">{b.range[0]}–{b.range[1]}</span><span className={`dv-status is-${b.status.toLowerCase()}`}>{t.statusText[b.status]}</span><span className="dv-batch-sets">{b.sets || b.trackedSets || b.plannedSets} {t.setsUnit}</span></div>
        <div className="dv-stack">{b.shares.length > 0 ? b.shares.map((s, i) => <i key={s.en} style={{ width: pct(s.ratio), background: DIM_COLORS[i % DIM_COLORS.length] }} title={`${name(s)} ${pct(s.ratio)}`} />) : <i className="is-planned" style={{ width: '100%' }} title={t.statusText[b.status]} />}</div>
      </div>)}
    </div>
    <div className="dv-bottom-grid">
      <div className="dv-card">
        <p className="kicker">{t.crossTitle}</p>
        <div className="dv-heat-wrap"><table className="dv-heat"><colgroup><col style={{ width: '24%' }} /><col style={{ width: '25.33%' }} /><col style={{ width: '25.33%' }} /><col style={{ width: '25.34%' }} /></colgroup><thead><tr><th aria-hidden="true" />{dv.crosstab.cols.map((col) => <th key={col.key}>{name(col)}</th>)}</tr></thead>
          <tbody>{dv.crosstab.rows.map((row, ri) => <tr key={row.key}><th>{name(row)}</th>{dv.crosstab.counts[ri].map((v, ci) => <td key={ci}><span className="dv-heat-cell" style={{ background: `color-mix(in srgb, var(--accent) ${Math.round(10 + Math.sqrt(v / maxCross) * 68)}%, transparent)` }}>{v}</span></td>)}</tr>)}</tbody></table></div>
      </div>
      <div className="dv-card dv-lit">
        <p className="kicker">{t.litTitle}</p>
        <div className="dv-lit-kpis"><span><b>{dv.literature.downloaded}</b> {t.litLabels.downloaded}</span><span><b>{dv.literature.formal}</b> {t.litLabels.formal}</span><span><b>{dv.literature.uniqueDoi}</b> {t.litLabels.doi}</span><span><b>{dv.literature.eligible}</b> {t.litLabels.eligible}</span></div>
        {dv.literature.rounds.map((r) => <div className="dv-row" key={r.round}>
          <span className="dv-row-name">{name(r)}</span>
          <div className="dv-row-bars"><div className="dv-stack">{Object.entries(r.modality).map(([k, v]) => <i key={k} style={{ width: pct(v / r.downloaded), background: modColor[k] ?? 'var(--line-strong)' }} title={`${modLabel(k)} ${v}`} />)}</div><span className="dv-nums">{r.downloaded}</span></div>
        </div>)}
        <div className="dv-legend">{dv.modalities.map((m) => <span key={m.key}><i className="dv-swatch" style={{ background: m.color }} />{name(m)}</span>)}</div>
      </div>
    </div>
  </section>;
}

export default function Home() {
  const [language, setLanguage] = useState<Language>(() => (typeof localStorage !== 'undefined' && localStorage.getItem('mcab-lang') === 'en' ? 'en' : 'zh'));
  const [theme, setTheme] = useState<'light' | 'dark'>(() => (typeof localStorage !== 'undefined' && localStorage.getItem('mcab-theme') === 'dark' ? 'dark' : 'light'));
  useEffect(() => {
    localStorage.setItem('mcab-lang', language);
    document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en';
  }, [language]);
  useEffect(() => {
    localStorage.setItem('mcab-theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);
  const t = copy[language];
  return <main>
    <header className="site-header"><a className="brand" href="#top"><span className="brand-mark"><Beaker size={15} /></span><span>MedChem Agent Benchmark</span></a><nav aria-label="Sections">{['overview', 'results', 'coverage', 'diversity', 'workflow', 'samples', 'licensing'].map((id, index) => <a href={`#${id}`} key={id}>{t.nav[index]}</a>)}</nav><div className="header-tools"><button type="button" className="theme-toggle" aria-label="切换深浅主题 / Toggle color theme" title="切换深浅主题 / Toggle color theme" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}><span aria-hidden="true">◐</span></button><fieldset className="language-switch" aria-label="Language / 语言"><button type="button" className={language === 'zh' ? 'active' : ''} aria-pressed={language === 'zh'} onClick={() => setLanguage('zh')}>中</button><button type="button" className={language === 'en' ? 'active' : ''} aria-pressed={language === 'en'} lang="en" onClick={() => setLanguage('en')}>EN</button></fieldset></div></header>
    <section className="hero" id="top"><div className="hero-copy"><p className="eyebrow">{t.eyebrow}</p><h1>{t.title}</h1><p className="hero-intro">{t.intro}</p><div className="hero-actions"><a className="primary-action" href="mailto:wangzc@stu.pku.edu.cn?subject=MedChem%20Agent%20Benchmark%20Partnership">{t.cta}<Mail size={17} /></a><a className="secondary-action" href="#samples">{t.samples}<ArrowRight size={17} /></a></div><p className="proof"><Check size={15} />{t.proof}</p></div><div className="metric-panel">{metrics.map(([value, label]) => <div className="metric" key={label}><strong>{value}</strong><span>{label}</span></div>)}</div><ResultsChart language={language} /></section>
    <section className="section" id="overview"><div className="section-lead"><p className="section-number">01 · DATASET</p><h2>{t.overviewTitle}</h2><p>{t.overviewText}</p></div><div className="feature-grid">{t.features.map(([heading, text], index) => { const Icon = [Database, BrainCircuit, ShieldCheck][index]; return <div className="feature" key={heading}><Icon /><h3>{heading}</h3><p>{text}</p></div>; })}</div></section>
    <section className="section soft" id="coverage"><div className="section-lead compact"><p className="section-number">02 · COVERAGE</p><h2>{t.coverageTitle}</h2><p>{t.coverageText}</p></div><div className="coverage-grid">{coverage.map(([name, description], index) => <div className="coverage-item" key={name}><span>{String(index + 1).padStart(2, '0')}</span><div><strong>{name}</strong><p>{description}</p></div></div>)}</div></section>
    <DiversitySection language={language} />
    <section className="section architecture" id="workflow"><div className="section-lead"><p className="section-number">04 · ARCHITECTURE & EVALUATION</p><h2>{t.architectureTitle}</h2><p>{t.architectureText}</p><p className="architecture-note"><Check size={15} />{t.architectureNote}</p></div><div className="workflow-shell">{workflowRows[language].map((row, rowIndex) => <div className="flow-lane" key={row.label}><div className="flow-label"><span>0{rowIndex + 1}</span><strong>{row.label}</strong><small>{row.note}</small></div><div className="flow-nodes">{row.nodes.map((node, nodeIndex) => <div className="flow-node" key={node}><span>{node}</span>{nodeIndex < row.nodes.length - 1 && <ArrowRight size={15} aria-hidden="true" />}</div>)}</div></div>)}</div><div className="principles-head"><ShieldCheck size={19} /><h3>{t.principlesTitle}</h3></div><div className="principle-grid">{evaluationPrinciples[language].map(([title, description], index) => <div className="principle" key={title}><span>0{index + 1}</span><strong>{title}</strong><p>{description}</p></div>)}</div></section>
    <section className="section samples" id="samples"><div className="section-lead"><p className="section-number">05 · FULL SAMPLES</p><h2>{t.sampleTitle}</h2><p>{t.sampleText}</p><p className="sample-hint"><BookOpenCheck size={16} />{t.sampleNote}</p></div><div className="sample-stack">{sets.map((set) => <SampleSet key={set.set_id} set={set} language={language} />)}</div></section>
    <section className="section soft" id="licensing"><div className="section-lead compact"><p className="section-number">06 · LICENSING</p><h2>{t.cooperationTitle}</h2><p>{t.cooperationText}</p></div><div className="pricing-list">{plansByLanguage[language].map(([name, description, price], index) => <div className={`price-row ${index === 2 ? 'recommended' : ''}`} key={name}><span className="plan-number">0{index + 1}</span><div><strong>{name}</strong><p>{description}</p></div><b>{price}</b></div>)}</div></section>
    <section className="contact-section"><div><p className="section-number">CONTACT</p><h2>{t.contactTitle}</h2><p>{t.contactText}</p></div><div className="contact-actions"><a href="mailto:wangzc@stu.pku.edu.cn?subject=MedChem%20Agent%20Benchmark%20Partnership"><Mail size={18} />{t.email}</a><a href="https://github.com/ZiChenWang114514/medchem-agent-benchmark" target="_blank" rel="noreferrer"><GithubIcon size={18} />{t.github}</a></div><p className="contact-person"><Globe2 size={15} /> 王子宸 · Zichen Wang · wangzc@stu.pku.edu.cn</p></section>
    <footer><span>{t.footer}</span><span>© 2026 Zichen Wang</span></footer>
  </main>;
}
