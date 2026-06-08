/**
 * База типовых управленческих архивных документов.
 * Источник: Приказ Росархива от 20.12.2019 № 236 (Перечень типовых
 * управленческих документов со сроками хранения).
 *
 * Поля:
 *   id            — уникальный код
 *   name          — наименование документа
 *   category      — крупная категория (для фильтра)
 *   perechen      — { years: число|'permanent'|'until_obsolete'|'50_75',
 *                     article: '№ ст. Перечня',
 *                     epk: bool — требует решения ЭПК,
 *                     check_required: bool — хранится «при условии проведения проверки»,
 *                     note: пояснение }
 *   nk            — { years: число|null, basis: 'ссылка на НК', applicable: bool }
 *   fz402         — { years: число|null, basis: 'ссылка на 402-ФЗ', applicable: bool }
 *   legalText     — развёрнутое правовое обоснование (HTML)
 */
const DOCUMENTS = [
  // ============ БУХГАЛТЕРИЯ ============
  {
    id: "buh-otch-god",
    name: "Бухгалтерская (финансовая) отчётность годовая",
    category: "Бухгалтерия",
    perechen: { years: "permanent", article: "ст. 268", epk: false, check_required: false, note: "Хранится постоянно" },
    nk:    { years: 5, basis: "пп. 8 п. 1 ст. 23 НК РФ", applicable: true },
    fz402: { years: 5, basis: "ч. 1 ст. 29 Закона № 402-ФЗ", applicable: true },
    legalText: "<p>Годовая бухгалтерская отчётность относится к документам <strong>постоянного хранения</strong> (ст. 268 Перечня 2019 г.).</p><p>НК РФ устанавливает минимум 5 лет, 402-ФЗ — не менее 5 лет после отчётного года, но по Перечню срок строже — <strong>постоянно</strong>.</p>"
  },
  {
    id: "buh-otch-prom",
    name: "Бухгалтерская отчётность промежуточная (квартальная, месячная)",
    category: "Бухгалтерия",
    perechen: { years: 5, article: "ст. 268", epk: false, check_required: false, note: "При отсутствии годовой — постоянно" },
    nk:    { years: 5, basis: "пп. 8 п. 1 ст. 23 НК РФ", applicable: true },
    fz402: { years: 5, basis: "ч. 1 ст. 29 Закона № 402-ФЗ", applicable: true },
    legalText: "<p>Промежуточная отчётность — <strong>5 лет</strong> (ст. 268 Перечня). Если годовая отчётность отсутствует, промежуточная переходит в категорию <strong>постоянного хранения</strong>.</p>"
  },
  {
    id: "buh-pervich",
    name: "Первичные учётные документы (накладные, акты, кассовые, авансовые отчёты)",
    category: "Бухгалтерия",
    perechen: { years: 5, article: "ст. 277", epk: false, check_required: true, note: "При условии проведения проверки; при споре — до решения по делу" },
    nk:    { years: 5, basis: "пп. 8 п. 1 ст. 23 НК РФ", applicable: true },
    fz402: { years: 5, basis: "ч. 1 ст. 29 Закона № 402-ФЗ", applicable: true },
    legalText: "<p>Первичные документы хранятся <strong>5 лет при условии проведения проверки</strong> (ст. 277 Перечня).</p><p>Если налоговая или иная проверка за соответствующий период не проводилась, срок продлевается до её проведения. При наличии разногласий или судебных споров — до принятия окончательного решения по делу.</p>"
  },
  {
    id: "buh-registry",
    name: "Регистры бухгалтерского учёта",
    category: "Бухгалтерия",
    perechen: { years: 5, article: "ст. 276", epk: false, check_required: true, note: "При условии проведения проверки" },
    nk:    { years: 5, basis: "пп. 8 п. 1 ст. 23 НК РФ", applicable: true },
    fz402: { years: 5, basis: "ч. 1 ст. 29 Закона № 402-ФЗ", applicable: true },
    legalText: "<p>Регистры бухучёта (главная книга, журналы-ордера и т. д.) — <strong>5 лет при условии проведения проверки</strong> (ст. 276 Перечня).</p>"
  },
  {
    id: "buh-uch-pol",
    name: "Документы учётной политики",
    category: "Бухгалтерия",
    perechen: { years: 5, article: "ст. 267", epk: false, check_required: false, note: "После замены новыми" },
    nk:    { years: 5, basis: "пп. 8 п. 1 ст. 23 НК РФ", applicable: true },
    fz402: { years: 5, basis: "ч. 1 ст. 29 Закона № 402-ФЗ", applicable: true },
    legalText: "<p>Учётная политика — <strong>5 лет после замены новыми</strong> (ст. 267 Перечня). Срок отсчитывается с момента введения нового варианта учётной политики.</p>"
  },
  {
    id: "audit",
    name: "Аудиторские заключения по годовой отчётности",
    category: "Бухгалтерия",
    perechen: { years: "permanent", article: "ст. 286", epk: false, check_required: false, note: "По годовой отчётности — постоянно; по промежуточной — 5 лет" },
    nk:    { years: null, basis: "—", applicable: false },
    fz402: { years: 5, basis: "ч. 1 ст. 29 Закона № 402-ФЗ", applicable: true },
    legalText: "<p>Аудиторские заключения по <strong>годовой</strong> отчётности — <strong>постоянно</strong> (ст. 286 Перечня).</p><p>Заключения по промежуточной отчётности — 5 лет.</p>"
  },
  {
    id: "debit-kredit",
    name: "Документы о дебиторской и кредиторской задолженности",
    category: "Бухгалтерия",
    perechen: { years: 5, article: "ст. 266", epk: false, check_required: false, note: "После погашения задолженности" },
    nk:    { years: 5, basis: "пп. 8 п. 1 ст. 23, п. 1 ст. 252 НК РФ", applicable: true },
    fz402: { years: 5, basis: "ч. 1 ст. 29 Закона № 402-ФЗ", applicable: true },
    legalText: "<p>Документы хранятся <strong>5 лет после погашения долга</strong> (ст. 266 Перечня). При списании безнадёжной задолженности — ещё 5 лет после периода списания (пп. 8 п. 1 ст. 23 НК РФ).</p>"
  },
  {
    id: "os-amort",
    name: "Документы о переоценке, амортизации, списании ОС и НМА",
    category: "Бухгалтерия",
    perechen: { years: 5, article: "ст. 323", epk: false, check_required: false, note: "После выбытия основных средств / НМА" },
    nk:    { years: 5, basis: "пп. 8 п. 1 ст. 23 НК РФ", applicable: true },
    fz402: { years: 5, basis: "ч. 1 ст. 29 Закона № 402-ФЗ", applicable: true },
    legalText: "<p>Документы по ОС и НМА — <strong>5 лет после выбытия</strong> объекта (ст. 323 Перечня).</p>"
  },

  // ============ НАЛОГИ ============
  {
    id: "scheta-faktury",
    name: "Счета-фактуры",
    category: "Налоги",
    perechen: { years: 5, article: "ст. 317", epk: false, check_required: false, note: "Бумажные и электронные" },
    nk:    { years: 5, basis: "пп. 8 п. 1 ст. 23, пп. 5 п. 3 ст. 24 НК РФ", applicable: true },
    fz402: { years: null, basis: "—", applicable: false },
    legalText: "<p>Счета-фактуры — <strong>5 лет</strong> (ст. 317 Перечня; пп. 8 п. 1 ст. 23 НК РФ). Срок отсчитывается с окончания периода, в котором счёт-фактура был в последний раз использован для составления отчётности.</p>"
  },
  {
    id: "knigi-pokupok",
    name: "Книги покупок и продаж",
    category: "Налоги",
    perechen: { years: 5, article: "ст. 317–318", epk: false, check_required: false, note: "" },
    nk:    { years: 5, basis: "пп. 8 п. 1 ст. 23 НК РФ", applicable: true },
    fz402: { years: null, basis: "—", applicable: false },
    legalText: "<p>Книги покупок и продаж — <strong>5 лет</strong>.</p>"
  },
  {
    id: "deklaracii",
    name: "Налоговые декларации (расчёты) по всем видам налогов",
    category: "Налоги",
    perechen: { years: 5, article: "ст. 310", epk: false, check_required: false, note: "ИП по 2002 год включительно — 75 лет" },
    nk:    { years: 5, basis: "пп. 8 п. 1 ст. 23, пп. 5 п. 3 ст. 24 НК РФ", applicable: true },
    fz402: { years: null, basis: "—", applicable: false },
    legalText: "<p>Налоговые декларации — <strong>5 лет</strong> (ст. 310 Перечня). Срок изменён с 4 на 5 лет Федеральным законом от 17.02.2021 № 6-ФЗ.</p>"
  },
  {
    id: "kudir",
    name: "Книга учёта доходов и расходов (КУДиР) при УСН",
    category: "Налоги",
    perechen: { years: 5, article: "ст. 318", epk: false, check_required: false, note: "" },
    nk:    { years: 5, basis: "пп. 8 п. 1 ст. 23 НК РФ", applicable: true },
    fz402: { years: null, basis: "—", applicable: false },
    legalText: "<p>КУДиР — <strong>5 лет</strong> (ст. 318 Перечня).</p>"
  },
  {
    id: "nalog-registry",
    name: "Налоговые регистры",
    category: "Налоги",
    perechen: { years: 5, article: "ст. 303, 311", epk: false, check_required: false, note: "5 лет после снятия задолженности; по НДФЛ без лицевых счетов — 50/75 лет" },
    nk:    { years: 5, basis: "пп. 8 п. 1 ст. 23 НК РФ", applicable: true },
    fz402: { years: null, basis: "—", applicable: false },
    legalText: "<p>Налоговые регистры — <strong>5 лет после снятия задолженности</strong>. Регистры по НДФЛ при отсутствии лицевых счетов или ведомостей начисления зарплаты: <strong>50 лет</strong> (документы с 2003 г.) или <strong>75 лет</strong> (до 2003 г.).</p>"
  },
  {
    id: "lgoty",
    name: "Документы об освобождении от налогов, предоставлении льгот, отсрочек",
    category: "Налоги",
    perechen: { years: 5, article: "ст. 304", epk: false, check_required: false, note: "" },
    nk:    { years: 5, basis: "пп. 8 п. 1 ст. 23 НК РФ", applicable: true },
    fz402: { years: null, basis: "—", applicable: false },
    legalText: "<p>Документы о налоговых льготах — <strong>5 лет</strong> (ст. 304 Перечня).</p>"
  },
  {
    id: "akty-proverok",
    name: "Акты налоговых проверок и проверок контролирующих органов",
    category: "Налоги",
    perechen: { years: 5, article: "ст. 139", epk: false, check_required: false, note: "" },
    nk:    { years: null, basis: "—", applicable: false },
    fz402: { years: null, basis: "—", applicable: false },
    legalText: "<p>Акты налоговых проверок — <strong>5 лет</strong> (ст. 139 Перечня).</p>"
  },
  {
    id: "doh-fizlic",
    name: "Сведения о доходах физических лиц (справки 2-НДФЛ и др.)",
    category: "Налоги",
    perechen: { years: 5, article: "ст. 312", epk: false, check_required: false, note: "Если нет лицевых счетов — 50/75 лет" },
    nk:    { years: 5, basis: "пп. 8 п. 1 ст. 23 НК РФ", applicable: true },
    fz402: { years: null, basis: "—", applicable: false },
    legalText: "<p>Сведения о доходах физлиц — <strong>5 лет</strong> (ст. 312 Перечня). Если в организации отсутствуют лицевые счета: <strong>50 лет</strong> (с 2003 г.) или <strong>75 лет</strong> (до 2003 г.).</p>"
  },
  {
    id: "strah-vznosy-raschet",
    name: "Расчёты по страховым взносам",
    category: "Налоги",
    perechen: { years: "50_75", article: "ст. 308", epk: false, check_required: false, note: "50 лет (с 2003 г.) / 75 лет (до 2003 г.)" },
    nk:    { years: 6, basis: "пп. 6 п. 3.4 ст. 23 НК РФ", applicable: true },
    fz402: { years: 5, basis: "ч. 1 ст. 29 Закона № 402-ФЗ", applicable: true },
    legalText: "<p>Расчёты по страховым взносам — <strong>50/75 лет</strong> по ст. 308 Перечня. НК РФ требует только 6 лет (пп. 6 п. 3.4 ст. 23), но <strong>применяется более длительный срок Перечня</strong>.</p><p>50 лет — для документов с 1 января 2003 года; 75 лет — для оформленных до 2003 года.</p>"
  },
  {
    id: "strah-vznosy-doc",
    name: "Документы, подтверждающие расчёт и уплату страховых взносов",
    category: "Налоги",
    perechen: { years: 6, article: "—", epk: false, check_required: false, note: "Согласовано с НК" },
    nk:    { years: 6, basis: "пп. 6 п. 3.4 ст. 23 НК РФ", applicable: true },
    fz402: { years: 5, basis: "ч. 1 ст. 29 Закона № 402-ФЗ", applicable: true },
    legalText: "<p>Документы, подтверждающие расчёт и уплату страховых взносов — <strong>6 лет</strong> (пп. 6 п. 3.4 ст. 23 НК РФ).</p>"
  },

  // ============ КАДРЫ ============
  {
    id: "prikazy-ls",
    name: "Приказы (распоряжения) по личному составу (приём, перевод, увольнение)",
    category: "Кадры",
    perechen: { years: "50_75", article: "ст. 434а", epk: false, check_required: false, note: "50 лет — с 2003 г., 75 лет — до 2003 г." },
    nk:    { years: null, basis: "—", applicable: false },
    fz402: { years: null, basis: "—", applicable: false },
    legalText: "<p>Приказы по личному составу — <strong>50 лет</strong> (с 1 января 2003 г.) или <strong>75 лет</strong> (до 2003 г.). Регламентируется ст. 22.1 Закона № 125-ФЗ и ст. 434 Перечня 2019 г.</p>"
  },
  {
    id: "prikazy-od",
    name: "Приказы по основной (профильной) деятельности",
    category: "Кадры",
    perechen: { years: "permanent", article: "ст. 19а", epk: false, check_required: false, note: "" },
    nk:    { years: null, basis: "—", applicable: false },
    fz402: { years: null, basis: "—", applicable: false },
    legalText: "<p>Приказы по основной деятельности — <strong>постоянно</strong> (ст. 19а Перечня).</p>"
  },
  {
    id: "prikazy-ahd",
    name: "Приказы по административно-хозяйственным вопросам",
    category: "Кадры",
    perechen: { years: 5, article: "ст. 19б", epk: false, check_required: false, note: "" },
    nk:    { years: null, basis: "—", applicable: false },
    fz402: { years: null, basis: "—", applicable: false },
    legalText: "<p>Приказы по АХД — <strong>5 лет</strong> (ст. 19б Перечня).</p>"
  },
  {
    id: "trud-dogovory",
    name: "Трудовые договоры и дополнительные соглашения к ним",
    category: "Кадры",
    perechen: { years: "50_75", article: "ст. 435", epk: false, check_required: false, note: "50 лет — с 2003 г., 75 лет — до 2003 г." },
    nk:    { years: null, basis: "—", applicable: false },
    fz402: { years: null, basis: "—", applicable: false },
    legalText: "<p>Трудовые договоры хранятся <strong>50/75 лет</strong>. После 1 января 2003 г. — 50 лет, ранее — 75 лет (Закон № 125-ФЗ, ст. 22.1).</p>"
  },
  {
    id: "lichnye-dela",
    name: "Личные дела работников",
    category: "Кадры",
    perechen: { years: "50_75", article: "ст. 445", epk: false, check_required: false, note: "Руководителей — постоянно" },
    nk:    { years: null, basis: "—", applicable: false },
    fz402: { years: null, basis: "—", applicable: false },
    legalText: "<p>Личные дела работников — <strong>50/75 лет</strong>. Личные дела руководителей организации — <strong>постоянно</strong>.</p>"
  },
  {
    id: "raschet-platej-vedomost",
    name: "Расчётно-платёжные ведомости, расчётные листы (зарплата)",
    category: "Кадры",
    perechen: { years: 6, article: "ст. 295", epk: false, check_required: false, note: "Если нет лицевых счетов — 50/75 лет" },
    nk:    { years: null, basis: "—", applicable: false },
    fz402: { years: 5, basis: "ч. 1 ст. 29 Закона № 402-ФЗ", applicable: true },
    legalText: "<p>Расчётно-платёжные ведомости — <strong>6 лет</strong> (ст. 295 Перечня). При отсутствии лицевых счетов: <strong>50 лет</strong> (с 2003 г.) или <strong>75 лет</strong> (до 2003 г.).</p>"
  },
  {
    id: "tabel",
    name: "Табели (графики), журналы учёта рабочего времени",
    category: "Кадры",
    perechen: { years: 5, article: "ст. 402", epk: false, check_required: false, note: "При тяжёлых, вредных условиях труда — 50/75 лет" },
    nk:    { years: null, basis: "—", applicable: false },
    fz402: { years: null, basis: "—", applicable: false },
    legalText: "<p>Табели рабочего времени — <strong>5 лет</strong>. При тяжёлых, вредных и опасных условиях труда — 50/75 лет.</p>"
  },

  // ============ УПРАВЛЕНИЕ ============
  {
    id: "ustav",
    name: "Устав, учредительные документы организации",
    category: "Управление",
    perechen: { years: "permanent", article: "ст. 28а", epk: false, check_required: false, note: "" },
    nk:    { years: null, basis: "—", applicable: false },
    fz402: { years: null, basis: "—", applicable: false },
    legalText: "<p>Уставы и учредительные документы — <strong>постоянно</strong> (ст. 28 Перечня).</p>"
  },
  {
    id: "protokoly-sd",
    name: "Протоколы собраний (совета директоров, общего собрания)",
    category: "Управление",
    perechen: { years: "permanent", article: "ст. 18", epk: false, check_required: false, note: "" },
    nk:    { years: null, basis: "—", applicable: false },
    fz402: { years: null, basis: "—", applicable: false },
    legalText: "<p>Протоколы заседаний коллегиальных органов управления — <strong>постоянно</strong>.</p>"
  },
  {
    id: "plany-godovye",
    name: "Годовые планы работы организации",
    category: "Управление",
    perechen: { years: "permanent", article: "ст. 197а", epk: false, check_required: false, note: "По месту утверждения; в др. организациях — 5 лет" },
    nk:    { years: null, basis: "—", applicable: false },
    fz402: { years: null, basis: "—", applicable: false },
    legalText: "<p>Годовые планы — <strong>постоянно</strong> по месту утверждения, <strong>5 лет</strong> в других организациях.</p>"
  },
  {
    id: "plany-meropriatii",
    name: "Планы мероприятий по отдельным направлениям деятельности",
    category: "Управление",
    perechen: { years: 5, article: "ст. 200", epk: true, check_required: false, note: "ЭПК" },
    nk:    { years: null, basis: "—", applicable: false },
    fz402: { years: null, basis: "—", applicable: false },
    legalText: "<p>Планы мероприятий — <strong>5 лет ЭПК</strong> (ст. 200 Перечня). По истечении срока экспертно-проверочная комиссия принимает решение о продлении срока или передаче на постоянное хранение.</p>"
  },
  {
    id: "perepiska-deloprozvodstvo",
    name: "Переписка по вопросам делопроизводства и архивного дела",
    category: "Управление",
    perechen: { years: 5, article: "ст. 181", epk: false, check_required: false, note: "" },
    nk:    { years: null, basis: "—", applicable: false },
    fz402: { years: null, basis: "—", applicable: false },
    legalText: "<p>Переписка — <strong>5 лет</strong> (ст. 181 Перечня).</p>"
  },
  {
    id: "zhurnaly-reg",
    name: "Журналы регистрации поступающих и отправляемых документов",
    category: "Управление",
    perechen: { years: 5, article: "ст. 182г", epk: false, check_required: false, note: "" },
    nk:    { years: null, basis: "—", applicable: false },
    fz402: { years: null, basis: "—", applicable: false },
    legalText: "<p>Журналы регистрации входящей/исходящей корреспонденции — <strong>5 лет</strong> (ст. 182г Перечня).</p>"
  },
  {
    id: "obrasheniya-grazhdan",
    name: "Обращения граждан и документы по их рассмотрению",
    category: "Управление",
    perechen: { years: 5, article: "ст. 183", epk: true, check_required: false, note: "ЭПК — при содержании сведений важного характера" },
    nk:    { years: null, basis: "—", applicable: false },
    fz402: { years: null, basis: "—", applicable: false },
    legalText: "<p>Обращения граждан — <strong>5 лет</strong>. При содержании важных сведений — с пометкой <strong>ЭПК</strong> и возможностью передачи на постоянное хранение.</p>"
  },

  // ============ ДОГОВОРЫ ============
  {
    id: "dogovory-typical",
    name: "Договоры, соглашения, контракты (не указанные в отдельных статьях)",
    category: "Договоры",
    perechen: { years: 5, article: "ст. 11", epk: true, check_required: false, note: "ЭПК; после истечения срока действия / прекращения обязательств" },
    nk:    { years: 5, basis: "пп. 8 п. 1 ст. 23 НК РФ", applicable: true },
    fz402: { years: 5, basis: "ч. 1 ст. 29 Закона № 402-ФЗ", applicable: true },
    legalText: "<p>Договоры (общая статья) — <strong>5 лет ЭПК</strong> после истечения срока действия или прекращения обязательств (ст. 11 Перечня).</p><p>Отметка ЭПК означает, что по истечении срока экспертно-проверочная комиссия рассматривает возможность продления хранения или передачи на постоянное хранение в государственный архив.</p>"
  },
  {
    id: "dogovory-prilozh",
    name: "Документы (расчёты, заключения, справки, переписка) к договорам",
    category: "Договоры",
    perechen: { years: 5, article: "ст. 12", epk: false, check_required: false, note: "" },
    nk:    { years: 5, basis: "пп. 8 п. 1 ст. 23 НК РФ", applicable: true },
    fz402: { years: 5, basis: "ч. 1 ст. 29 Закона № 402-ФЗ", applicable: true },
    legalText: "<p>Документы к договорам — <strong>5 лет</strong> (ст. 12 Перечня).</p>"
  },
  {
    id: "dogovory-gph",
    name: "Акты приёмки услуг/работ по договорам ГПХ",
    category: "Договоры",
    perechen: { years: "50_75", article: "ст. 301", epk: false, check_required: false, note: "50 лет — с 2003 г., 75 лет — до 2003 г." },
    nk:    { years: 5, basis: "пп. 8 п. 1 ст. 23 НК РФ", applicable: true },
    fz402: { years: 5, basis: "ч. 1 ст. 29 Закона № 402-ФЗ", applicable: true },
    legalText: "<p>Акты по договорам ГПХ — <strong>50/75 лет</strong> (ст. 301 Перечня), поскольку служат для подтверждения трудового стажа.</p>"
  },
  {
    id: "dogovory-arenda",
    name: "Договоры аренды имущества организации",
    category: "Договоры",
    perechen: { years: 10, article: "ст. 88", epk: true, check_required: false, note: "ЭПК; недвижимости — постоянно" },
    nk:    { years: 5, basis: "пп. 8 п. 1 ст. 23 НК РФ", applicable: true },
    fz402: { years: 5, basis: "ч. 1 ст. 29 Закона № 402-ФЗ", applicable: true },
    legalText: "<p>Договоры аренды — <strong>10 лет ЭПК</strong>. Договоры аренды недвижимого имущества — <strong>постоянно</strong>.</p>"
  },

  // ============ ПРОЧЕЕ ============
  {
    id: "doc-otkr-schetov",
    name: "Документы на открытие, закрытие, переоформление расчётных счетов",
    category: "Прочее",
    perechen: { years: 5, article: "ст. 257–258", epk: false, check_required: false, note: "После закрытия счёта" },
    nk:    { years: 5, basis: "пп. 8 п. 1 ст. 23 НК РФ", applicable: true },
    fz402: { years: 5, basis: "ч. 1 ст. 29 Закона № 402-ФЗ", applicable: true },
    legalText: "<p>Документы по расчётным счетам — <strong>5 лет</strong> после закрытия счёта (ст. 257–258 Перечня).</p>"
  },
  {
    id: "perepiska-proverki",
    name: "Документы (справки, планы, переписка) по результатам проверок организаций",
    category: "Прочее",
    perechen: { years: 5, article: "ст. 147", epk: true, check_required: false, note: "ЭПК" },
    nk:    { years: null, basis: "—", applicable: false },
    fz402: { years: null, basis: "—", applicable: false },
    legalText: "<p>Документы по результатам проверок — <strong>5 лет ЭПК</strong> (ст. 147 Перечня).</p>"
  },
  {
    id: "perepiska-oper",
    name: "Оперативные планы (квартальные, месячные) работы",
    category: "Прочее",
    perechen: { years: 0, article: "ст. 201", epk: false, check_required: false, note: "До минования надобности (не менее 1 года)" },
    nk:    { years: null, basis: "—", applicable: false },
    fz402: { years: null, basis: "—", applicable: false },
    legalText: "<p>Оперативные планы — <strong>до минования надобности</strong> (но не менее 1 года) — ст. 201 Перечня.</p>"
  },
  {
    id: "lokalnye-akty",
    name: "Локальные нормативные акты организации",
    category: "Прочее",
    perechen: { years: "permanent", article: "ст. 8", epk: false, check_required: false, note: "По месту разработки и/или утверждения" },
    nk:    { years: null, basis: "—", applicable: false },
    fz402: { years: null, basis: "—", applicable: false },
    legalText: "<p>Локальные нормативные акты — <strong>постоянно</strong> по месту утверждения (ст. 8 Перечня).</p>"
  },
  {
    id: "bso",
    name: "Журналы учёта бланков строгой отчётности",
    category: "Прочее",
    perechen: { years: 3, article: "ст. 183в", epk: false, check_required: false, note: "После уничтожения бланков" },
    nk:    { years: null, basis: "—", applicable: false },
    fz402: { years: null, basis: "—", applicable: false },
    legalText: "<p>Журналы учёта БСО — <strong>3 года</strong> после уничтожения бланков (ст. 183в Перечня).</p>"
  },
];
