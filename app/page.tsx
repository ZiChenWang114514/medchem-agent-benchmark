'use client';

import { useState, type ReactNode } from 'react';
import { ArrowRight, Beaker, BookOpenCheck, BrainCircuit, Check, Database, FolderGit2 as GithubIcon, Globe2, Mail, ShieldCheck } from 'lucide-react';
import questionData from '../content/questions.json';

type Language = 'zh' | 'en';
type Rubric = { rubric_id: string; ordinal: number; criterion: string; score: number; scoring_anchor: string; reference: string };
type Question = { question_id: string; number: number; title: string; dimension: string; drug_modality: string; development_stage: string; difficulty: string; question_type: string; grading_method: string; stem_markdown: string; rubrics: Rubric[] };
type QuestionSet = { set_id: string; set_number: number; title: string; doi: string; questions: Question[] };
const sets = questionData as QuestionSet[];

const copy = {
  zh: {
    nav: ['数据概览', '评测结果', '能力覆盖', '架构与评测', '完整样例', '合作方案'], eyebrow: 'MEDICINAL CHEMISTRY · AI TRAINING & EVALUATION',
    title: '专家级药物化学推理数据，面向下一代科学智能体',
    intro: '500 个完整题组、约 2,000 个连续任务和约 10,000 条专家评分标准。数据围绕真实药物研发证据构建，可用于模型训练、强化学习、私有评测与科学智能体测试。',
    cta: '洽谈数据合作', samples: '查看完整样例', proof: '14 个 coding agent 与模型组合均完成同一批 20 个题组；每份回答均有三次独立评分。',
    resultsTitle: 'Pilot20 参赛系统总成绩', resultsText: '同一批 20 个题组；每个系统 20 份有效回答；每份回答由 Luna High 独立评分三次。柱形显示得分率，满分为 800。',
    scoreRate: '得分率', higherBetter: '越高越好', medianNote: '单题三次评分取中位数后汇总',
    overviewTitle: '为真实药物研发判断而设计', overviewText: '任务要求模型阅读化合物系列、结构证据与 DMPK 数据，提出可绘制的优化方案，识别竞争解释，并在多项约束下完成候选物决策。',
    coverageTitle: '从数据解释延伸到项目决策', coverageText: '每个题组包含四个相互衔接的任务，可作为独立训练样本，也可组成连续的 Agent 工作流。',
    architectureTitle: '从固定题目到可复查结果', architectureText: '项目将题目版本、作答环境、模型信息和评分记录贯通保存。潜在合作方既能比较最终成绩，也能检查每一道题的原始回答、评分证据和运行信息。',
    architectureNote: '当前公开结果对应 20 题组试验：14 个模型与 Coding Harness 组合均完成作答和三轮独立匿名评分。',
    principlesTitle: '评测可信度来自完整记录',
    sampleTitle: '两个完整题组', sampleText: '以下内容直接取自第 7 和第 11 题组，完整保留四问、题干数据、正向评分项、错误扣分项和证据引用。', sampleNote: '点击题目展开完整题干与评分答案',
    answer: '完整评分答案', positive: '正向评分项', penalty: '错误扣分项', evidence: '证据',
    cooperationTitle: '按研发目标选择合作方式', cooperationText: '从小规模付费试评开始，也可以直接采购完整数据或训练用途授权。所有方案均可按客户字段转换。',
    contactTitle: '把你的模型放到真实药物化学任务中检验', contactText: '欢迎模型团队、AI 制药公司、训练数据服务商和科研机构联系。',
    email: '发送合作邮件', github: 'GitHub 项目', sourceLanguage: '', setLabel: '完整题组', tasks: '个任务', footer: 'MedChem Agent Benchmark · Expert-curated data for scientific AI',
  },
  en: {
    nav: ['Dataset', 'Results', 'Coverage', 'Architecture', 'Full samples', 'Licensing'], eyebrow: 'MEDICINAL CHEMISTRY · AI TRAINING & EVALUATION',
    title: 'Expert medicinal chemistry reasoning data for the next generation of scientific agents',
    intro: '500 complete task sets, approximately 2,000 connected tasks, and approximately 10,000 expert rubric entries. Built from real drug-discovery evidence for model training, reinforcement learning, private evaluation, and scientific-agent testing.',
    cta: 'Discuss a partnership', samples: 'View full samples', proof: 'All 14 coding-agent and model combinations completed the same 20 task sets, with three independent scoring passes for every answer.',
    resultsTitle: 'Pilot20 overall system scores', resultsText: 'The same 20 task sets were used for every system. Each system produced 20 valid answers, and every answer was independently scored three times by Luna High. Bars show percent of the 800-point maximum.',
    scoreRate: 'Score rate', higherBetter: 'higher is better', medianNote: 'Aggregated after taking the median of three scores per task',
    overviewTitle: 'Designed for real drug-discovery judgment', overviewText: 'Tasks require models to read compound series, structural evidence, and DMPK data; propose explicit optimization ideas; distinguish competing explanations; and select candidates under multiple constraints.',
    coverageTitle: 'From evidence interpretation to project decisions', coverageText: 'Each set contains four connected tasks that can serve as independent training examples or as a continuous agent workflow.',
    architectureTitle: 'From fixed tasks to inspectable results', architectureText: 'The system preserves task versions, answering environments, model identities, and scoring records as one traceable workflow. Partners can compare final scores and inspect every raw answer, rubric decision, and run record.',
    architectureNote: 'The current public results cover a 20-set pilot: all 14 model and coding-harness combinations completed answering and three independent anonymized scoring passes.',
    principlesTitle: 'Credibility comes from complete records',
    sampleTitle: 'Two complete task sets', sampleText: 'The complete source-language content of Sets 7 and 11 is reproduced below, including all four tasks, data, positive criteria, error penalties, and evidence references.', sampleNote: 'Open each task to read the complete prompt and scoring answer',
    answer: 'Complete scoring answer', positive: 'Positive criteria', penalty: 'Error penalties', evidence: 'Evidence',
    cooperationTitle: 'Choose the engagement that fits your program', cooperationText: 'Begin with a paid pilot, license the complete collection, or add training rights. Delivery can be mapped to a client-defined schema.',
    contactTitle: 'Test your model on real medicinal chemistry work', contactText: 'We welcome inquiries from model teams, AI drug-discovery companies, expert-data providers, and research organizations.',
    email: 'Email for partnership', github: 'GitHub project', sourceLanguage: 'Full task content is presented in its original Chinese. Professional English adaptation is available with licensed delivery.', setLabel: 'Full task set', tasks: 'tasks', footer: 'MedChem Agent Benchmark · Expert-curated data for scientific AI',
  },
};

const metrics = [['500', '题组 / task sets'], ['≈2,000', '任务 / tasks'], ['≈10,000', '评分项 / rubric entries'], ['14', '模型组合 / model systems']];
const coverage = [['SAR', '结构—活性关系 / structure–activity relationships'], ['SBDD', '结构证据与结合模式 / structural evidence'], ['DMPK', '暴露、清除率与代谢 / exposure and metabolism'], ['Lead optimization', '多参数先导优化 / multiparameter optimization'], ['Candidate selection', '候选物优选 / candidate nomination'], ['Experimental design', '竞争假说与判别实验 / discriminating experiments']];
const plans = [['20-set pilot', '80 tasks · scored evaluation', '¥49,800'], ['100-set license', '≈400 tasks · 12 months', '¥198,000'], ['Complete internal license', '500 sets · 24 months', '¥598,000'], ['Training license', 'SFT / preference / RL use', '¥798,000'], ['Exclusive partnership', 'complete data + custom updates', '¥1,000,000']];
const workflowRows = {
  zh: [
    { label: '模型作答', note: '统一输入与独立会话', nodes: ['固定题目快照', '作答 Prompt 包', '统一工作流规格', 'Harness + 模型', '原始回答与运行信息'] },
    { label: '匿名评审', note: '逐项证据与重复评分', nodes: ['回答导入', '随机匿名化', '题面 + Rubric + 回答', '三轮独立评审', 'Rubric 得分与证据'] },
    { label: '分析展示', note: '从单题记录到总体比较', nodes: ['SQLite 评测数据', '中位数与一致性分析', '排行与题目统计', '回答比较', '可复查报告'] },
  ],
  en: [
    { label: 'Answering', note: 'Standardized inputs and isolated sessions', nodes: ['Fixed task snapshot', 'Prompt package', 'Workflow specification', 'Harness + model', 'Raw answers and run records'] },
    { label: 'Blind judging', note: 'Item-level evidence and repeated scoring', nodes: ['Answer import', 'Random anonymization', 'Task + rubric + answer', 'Three independent passes', 'Rubric scores and evidence'] },
    { label: 'Analysis', note: 'From item records to system comparison', nodes: ['SQLite evaluation data', 'Median and agreement analysis', 'Rankings and task statistics', 'Answer comparison', 'Inspectable reports'] },
  ],
};
const evaluationPrinciples = {
  zh: [
    ['固定版本', '题面、评分标准与 Prompt 版本保持一致，参赛系统面对相同输入。'],
    ['真实运行记录', '保存实际模型、推理强度、会话编号、耗时、工具使用与重试历史。'],
    ['匿名重复评分', '隐藏参赛者身份并改变顺序，以逐项证据完成三轮独立评分。'],
    ['可解释统计', '以单题中位数汇总成绩，同时展示评分一致性和需要人工复核的样本。'],
  ],
  en: [
    ['Fixed versions', 'Task statements, rubrics, and prompt versions stay identical across participating systems.'],
    ['Authentic run records', 'Actual model, reasoning effort, session ID, duration, tool use, and retry history are preserved.'],
    ['Repeated blind scoring', 'Participant identities are hidden and order is varied across three evidence-based scoring passes.'],
    ['Interpretable analysis', 'Per-task medians form aggregate scores while agreement and review candidates remain visible.'],
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
    <div className="results-head"><div><p className="kicker">PILOT20 · RESULTS</p><h2 id="results-title">{t.resultsTitle}</h2><p>{t.resultsText}</p></div><div className="results-facts"><span><b>14</b> systems</span><span><b>20</b> sets</span><span><b>60</b> judgements / system</span></div></div>
    <div className="results-scroll"><div className="results-plot">
      <div className="score-axis" aria-hidden="true">{scoreGrid.map((level) => <span key={level} style={{ bottom: `${level * 2.45 + 104}px` }}>{level}</span>)}</div>
      <div className="score-grid" aria-hidden="true">{scoreGrid.map((level) => <i key={level} style={{ bottom: `${level}%` }} />)}</div>
      <div className="result-bars">{pilotResults.map((entry, index) => <button type="button" className="result-column" key={`${entry.harness}-${entry.model}`} aria-label={`${index + 1}. ${entry.model}, ${entry.harness}, ${entry.score.toFixed(2)}%, ${entry.points} / 800`}>
        <div className="bar-track"><div className="result-bar" style={{ height: `${entry.score}%`, background: entry.color }}><strong>{entry.score.toFixed(1)}</strong></div></div>
        <div className="result-label"><span className="result-rank">#{index + 1}</span><b>{entry.model}</b><small>{entry.harness}</small></div>
        <div className="result-tip" role="tooltip"><b>{entry.model}</b><span>{entry.harness}</span><strong>{entry.score.toFixed(2)}% <small>{entry.points} / 800</small></strong></div>
      </button>)}</div>
    </div></div>
    <div className="results-caption"><span>{t.scoreRate} · {t.higherBetter}</span><span>{t.medianNote}</span></div>
  </section>;
}

export default function Home() {
  const [language, setLanguage] = useState<Language>('zh'); const t = copy[language];
  return <main>
    <header className="site-header"><a className="brand" href="#top"><span className="brand-mark"><Beaker size={18} /></span><span>MedChem Agent Benchmark</span></a><nav>{['overview', 'results', 'coverage', 'workflow', 'samples', 'licensing'].map((id, index) => <a href={`#${id}`} key={id}>{t.nav[index]}</a>)}</nav><div className="language-switch"><button className={language === 'zh' ? 'active' : ''} onClick={() => setLanguage('zh')}>中</button><button className={language === 'en' ? 'active' : ''} onClick={() => setLanguage('en')}>EN</button></div></header>
    <section className="hero" id="top"><div className="hero-copy"><p className="eyebrow">{t.eyebrow}</p><h1>{t.title}</h1><p className="hero-intro">{t.intro}</p><div className="hero-actions"><a className="primary-action" href="mailto:wangzc@stu.pku.edu.cn?subject=MedChem%20Agent%20Benchmark%20Partnership">{t.cta}<Mail size={17} /></a><a className="secondary-action" href="#samples">{t.samples}<ArrowRight size={17} /></a></div><p className="proof"><Check size={15} />{t.proof}</p></div><div className="metric-panel">{metrics.map(([value, label]) => <div className="metric" key={label}><strong>{value}</strong><span>{label}</span></div>)}</div><ResultsChart language={language} /></section>
    <section className="section" id="overview"><div className="section-lead"><p className="section-number">01 · DATASET</p><h2>{t.overviewTitle}</h2><p>{t.overviewText}</p></div><div className="feature-grid"><div className="feature"><Database /><h3>Evidence-grounded</h3><p>论文、补充材料、结构与实验数据共同支持任务设计。</p></div><div className="feature"><BrainCircuit /><h3>Reasoning-intensive</h3><p>考察定量比较、因果判断、结构设计与研发决策。</p></div><div className="feature"><ShieldCheck /><h3>Expert-scored</h3><p>每个任务含正向标准、严重错误项和证据引用。</p></div></div></section>
    <section className="section soft" id="coverage"><div className="section-lead compact"><p className="section-number">02 · COVERAGE</p><h2>{t.coverageTitle}</h2><p>{t.coverageText}</p></div><div className="coverage-grid">{coverage.map(([name, description], index) => <div className="coverage-item" key={name}><span>{String(index + 1).padStart(2, '0')}</span><div><strong>{name}</strong><p>{description}</p></div></div>)}</div></section>
    <section className="section architecture" id="workflow"><div className="section-lead"><p className="section-number">03 · ARCHITECTURE & EVALUATION</p><h2>{t.architectureTitle}</h2><p>{t.architectureText}</p><p className="architecture-note"><Check size={15} />{t.architectureNote}</p></div><div className="workflow-shell">{workflowRows[language].map((row, rowIndex) => <div className="flow-lane" key={row.label}><div className="flow-label"><span>0{rowIndex + 1}</span><strong>{row.label}</strong><small>{row.note}</small></div><div className="flow-nodes">{row.nodes.map((node, nodeIndex) => <div className="flow-node" key={node}><span>{node}</span>{nodeIndex < row.nodes.length - 1 && <ArrowRight size={15} aria-hidden="true" />}</div>)}</div></div>)}</div><div className="principles-head"><ShieldCheck size={19} /><h3>{t.principlesTitle}</h3></div><div className="principle-grid">{evaluationPrinciples[language].map(([title, description], index) => <div className="principle" key={title}><span>0{index + 1}</span><strong>{title}</strong><p>{description}</p></div>)}</div></section>
    <section className="section samples" id="samples"><div className="section-lead"><p className="section-number">04 · FULL SAMPLES</p><h2>{t.sampleTitle}</h2><p>{t.sampleText}</p><p className="sample-hint"><BookOpenCheck size={16} />{t.sampleNote}</p></div><div className="sample-stack">{sets.map((set) => <SampleSet key={set.set_id} set={set} language={language} />)}</div></section>
    <section className="section soft" id="licensing"><div className="section-lead compact"><p className="section-number">05 · LICENSING</p><h2>{t.cooperationTitle}</h2><p>{t.cooperationText}</p></div><div className="pricing-list">{plans.map(([name, description, price], index) => <div className={`price-row ${index === 2 ? 'recommended' : ''}`} key={name}><span className="plan-number">0{index + 1}</span><div><strong>{name}</strong><p>{description}</p></div><b>{price}</b></div>)}</div></section>
    <section className="contact-section"><div><p className="section-number">CONTACT</p><h2>{t.contactTitle}</h2><p>{t.contactText}</p></div><div className="contact-actions"><a href="mailto:wangzc@stu.pku.edu.cn?subject=MedChem%20Agent%20Benchmark%20Partnership"><Mail size={18} />{t.email}</a><a href="https://github.com/ZiChenWang114514/medchem-agent-benchmark" target="_blank" rel="noreferrer"><GithubIcon size={18} />{t.github}</a></div><p className="contact-person"><Globe2 size={15} /> 王子宸 · Zichen Wang · wangzc@stu.pku.edu.cn</p></section>
    <footer><span>{t.footer}</span><span>© 2026 Zichen Wang</span></footer>
  </main>;
}
