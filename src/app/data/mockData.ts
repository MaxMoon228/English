export type MaterialType =
  | 'worksheet'
  | 'lesson-plan'
  | 'speaking-card'
  | 'grammar-task'
  | 'writing-template'
  | 'audio'
  | 'test'
  | 'checklist';

export type SectionKey = 'textbooks' | 'olympiads' | 'ege' | 'lessons';
export type SubsectionKey =
  | 'rf-textbooks'
  | 'olymp-grammar'
  | 'olymp-uoe'
  | 'olymp-culture'
  | 'olymp-writing'
  | 'olymp-speaking'
  | 'ege-grammar'
  | 'ege-writing'
  | 'ege-speaking'
  | 'lesson-handouts'
  | 'lesson-clil'
  | 'lesson-selta';

export interface MaterialFile {
  name: string;
  type: 'pdf' | 'zip' | 'doc' | 'mp3';
  size: string;
}

export interface Material {
  id: string;
  title: string;
  section: SectionKey;
  subsection: SubsectionKey;
  type: MaterialType;
  level: string;
  grade?: string;
  description: string;
  author: string;
  date: string;
  tags: string[];
  difficulty?: 1 | 2 | 3;
  files: MaterialFile[];
  related?: string[];
  views?: number;
  status?: 'published' | 'draft' | 'hidden';
}

export interface Textbook {
  id: string;
  title: string;
  series: string;
  author: string;
  publisher: string;
  grade: string;
  level: string;
  description: string;
  coverColor: string;
  components: string[];
  tags: string[];
  isGrif: boolean;
}

export const textbooks: Textbook[] = [
  {
    id: 'tb-spotlight-10',
    title: 'Spotlight 10',
    series: 'Spotlight',
    author: 'Афанасьева О.В., Дули Дж., Михеева И.В.',
    publisher: 'Просвещение',
    grade: '10',
    level: 'B1+',
    description: 'Учебник английского языка для 10 класса общеобразовательных организаций. Содержит 8 тематических модулей с упором на коммуникативные навыки.',
    coverColor: '#1E2A44',
    components: ['Учебник', 'Рабочая тетрадь', 'Teacher\'s Book', 'Audio', 'Extra Materials'],
    tags: ['Spotlight', 'Грифованные РФ', '10 класс', 'B1+'],
    isGrif: true,
  },
  {
    id: 'tb-spotlight-11',
    title: 'Spotlight 11',
    series: 'Spotlight',
    author: 'Афанасьева О.В., Дули Дж., Михеева И.В.',
    publisher: 'Просвещение',
    grade: '11',
    level: 'B2',
    description: 'Учебник английского языка для 11 класса. Углублённая подготовка к ЕГЭ, академическое письмо, развитие критического мышления.',
    coverColor: '#2B4A7A',
    components: ['Учебник', 'Рабочая тетрадь', 'Teacher\'s Book', 'Audio', 'DVD'],
    tags: ['Spotlight', 'Грифованные РФ', '11 класс', 'B2'],
    isGrif: true,
  },
  {
    id: 'tb-rainbow-9',
    title: 'Rainbow English 9',
    series: 'Rainbow English',
    author: 'Афанасьева О.В., Михеева И.В.',
    publisher: 'Дрофа',
    grade: '9',
    level: 'B1',
    description: 'Учебник серии Rainbow English для 9 класса. Культурологический подход, работа с аутентичными текстами, подготовка к ОГЭ.',
    coverColor: '#A9445B',
    components: ['Учебник', 'Рабочая тетрадь', 'Audio', 'Teacher\'s Book'],
    tags: ['Rainbow English', 'Грифованные РФ', '9 класс', 'B1'],
    isGrif: true,
  },
  {
    id: 'tb-forward-8',
    title: 'Forward 8',
    series: 'Forward',
    author: 'Вербицкая М.В.',
    publisher: 'Вентана-Граф',
    grade: '8',
    level: 'A2+',
    description: 'Учебник Forward для 8 класса с проектной деятельностью и межпредметными связями.',
    coverColor: '#3D6B4F',
    components: ['Учебник', 'Рабочая тетрадь', 'Teacher\'s Book', 'Audio CD'],
    tags: ['Forward', 'Грифованные РФ', '8 класс', 'A2+'],
    isGrif: true,
  },
];

export const materials: Material[] = [
  // Textbooks
  {
    id: 'tb-m-1',
    title: 'Spotlight 10 — полный комплект',
    section: 'textbooks',
    subsection: 'rf-textbooks',
    type: 'lesson-plan',
    level: 'B1+',
    grade: '10',
    description: 'Полный методический комплект для работы с учебником Spotlight 10: учебник, рабочая тетрадь, книга для учителя, аудиоматериалы и дополнительные ресурсы.',
    author: 'Афанасьева О.В., Дули Дж.',
    date: '2024-09-01',
    tags: ['Spotlight', 'Грифованные', '10 класс', 'Полный комплект'],
    files: [
      { name: 'Учебник', type: 'pdf', size: '45 MB' },
      { name: 'Рабочая тетрадь', type: 'pdf', size: '18 MB' },
      { name: "Teacher's Book", type: 'pdf', size: '22 MB' },
      { name: 'Audio', type: 'zip', size: '320 MB' },
    ],
    views: 1240,
    status: 'published',
  },
  {
    id: 'tb-m-2',
    title: 'Rainbow English 9 — комплект',
    section: 'textbooks',
    subsection: 'rf-textbooks',
    type: 'lesson-plan',
    level: 'B1',
    grade: '9',
    description: 'Комплект материалов для работы с Rainbow English 9. Культурологический подход с интегрированными заданиями.',
    author: 'Афанасьева О.В., Михеева И.В.',
    date: '2024-09-01',
    tags: ['Rainbow', 'Грифованные', '9 класс'],
    files: [
      { name: 'Учебник', type: 'pdf', size: '38 MB' },
      { name: 'Рабочая тетрадь', type: 'pdf', size: '15 MB' },
      { name: 'Audio', type: 'zip', size: '280 MB' },
    ],
    views: 860,
    status: 'published',
  },
  // Olympiad
  {
    id: 'ol-gr-1',
    title: 'Verb Tenses: Complex Cases — олимпиадный уровень',
    section: 'olympiads',
    subsection: 'olymp-grammar',
    type: 'grammar-task',
    level: 'C1',
    description: 'Задания по сложным случаям употребления временных форм для олимпиадного уровня. Перфектные аспекты, смешанные времена, стилистическое использование.',
    author: 'Петрова М.С.',
    date: '2025-01-15',
    tags: ['Grammar', 'Tenses', 'Олимпиада', 'C1'],
    difficulty: 3,
    files: [
      { name: 'Задания', type: 'pdf', size: '2.1 MB' },
      { name: 'Ответы', type: 'pdf', size: '0.8 MB' },
    ],
    related: ['ol-gr-2', 'ol-uoe-1'],
    views: 430,
    status: 'published',
  },
  {
    id: 'ol-gr-2',
    title: 'Conditionals & Inversion: Advanced Practice',
    section: 'olympiads',
    subsection: 'olymp-grammar',
    type: 'grammar-task',
    level: 'C1',
    description: 'Продвинутые условные конструкции и инверсия. Includes mixed conditionals, subjunctive mood, formal inversion structures.',
    author: 'Иванов А.Н.',
    date: '2025-02-10',
    tags: ['Conditionals', 'Inversion', 'Subjunctive', 'Олимпиада', 'C1'],
    difficulty: 3,
    files: [
      { name: 'Материалы', type: 'pdf', size: '1.8 MB' },
    ],
    views: 318,
    status: 'published',
  },
  {
    id: 'ol-gr-3',
    title: 'Passive Voice & Causative: Олимпиадный банк',
    section: 'olympiads',
    subsection: 'olymp-grammar',
    type: 'grammar-task',
    level: 'C1',
    description: 'Систематизированные задания по пассивному залогу и каузативным конструкциям. 80+ упражнений с ключами.',
    author: 'Петрова М.С.',
    date: '2025-03-05',
    tags: ['Passive Voice', 'Causative', 'Олимпиада', 'C1'],
    difficulty: 2,
    files: [
      { name: 'Task Bank', type: 'pdf', size: '2.4 MB' },
      { name: 'Answer Key', type: 'pdf', size: '1.0 MB' },
    ],
    views: 275,
    status: 'published',
  },
  {
    id: 'ol-uoe-1',
    title: 'Word Formation Bank — Advanced',
    section: 'olympiads',
    subsection: 'olymp-uoe',
    type: 'grammar-task',
    level: 'C1+',
    description: 'Тематический банк заданий по словообразованию: суффиксы, префиксы, конверсия, переходные случаи. Уровень межмуниципального и регионального этапов.',
    author: 'Смирнова Е.В.',
    date: '2025-03-01',
    tags: ['Word Formation', 'Use of English', 'Олимпиада', 'C1+'],
    difficulty: 3,
    files: [
      { name: 'Task Bank', type: 'pdf', size: '3.2 MB' },
      { name: 'Answer Key', type: 'pdf', size: '1.1 MB' },
    ],
    views: 512,
    status: 'published',
  },
  {
    id: 'ol-uoe-2',
    title: 'Open Cloze & Multiple Choice Cloze',
    section: 'olympiads',
    subsection: 'olymp-uoe',
    type: 'test',
    level: 'C1',
    description: 'Comprehensive task bank for Use of English section. Open cloze, multiple choice cloze, and key word transformation exercises.',
    author: 'Смирнова Е.В.',
    date: '2025-02-14',
    tags: ['Cloze', 'Use of English', 'Олимпиада'],
    difficulty: 3,
    files: [
      { name: 'Tasks PDF', type: 'pdf', size: '2.6 MB' },
      { name: 'Keys', type: 'pdf', size: '0.9 MB' },
    ],
    views: 389,
    status: 'published',
  },
  {
    id: 'ol-cult-1',
    title: 'British Literary Traditions',
    section: 'olympiads',
    subsection: 'olymp-culture',
    type: 'worksheet',
    level: 'C1',
    description: 'Editorial-style материал по британским литературным традициям: от викторианской литературы до современных авторов. Тексты + задания.',
    author: 'Козлова Н.П.',
    date: '2025-02-20',
    tags: ['Culture', 'Literature', 'Britain', 'Олимпиада', 'Editorial'],
    difficulty: 2,
    files: [
      { name: 'Reading & Tasks', type: 'pdf', size: '4.5 MB' },
    ],
    views: 287,
    status: 'published',
  },
  {
    id: 'ol-cult-2',
    title: 'Cultural Icons of the English-Speaking World',
    section: 'olympiads',
    subsection: 'olymp-culture',
    type: 'worksheet',
    level: 'B2+',
    description: 'Обзор ключевых культурных явлений англоязычного мира: искусство, музыка, кино, архитектура. Задания олимпиадного типа.',
    author: 'Козлова Н.П.',
    date: '2025-01-10',
    tags: ['Culture', 'Icons', 'English-Speaking World'],
    difficulty: 2,
    files: [
      { name: 'Materials', type: 'pdf', size: '3.8 MB' },
    ],
    views: 201,
    status: 'published',
  },
  {
    id: 'ol-wr-1',
    title: 'Argumentative Essay: Structure & Criteria',
    section: 'olympiads',
    subsection: 'olymp-writing',
    type: 'writing-template',
    level: 'C1',
    description: 'Полный разбор структуры аргументативного эссе с критериями оценивания и образцами олимпиадного уровня.',
    author: 'Петрова М.С.',
    date: '2025-01-30',
    tags: ['Essay', 'Argumentation', 'Writing', 'Олимпиада', 'Criteria'],
    difficulty: 3,
    files: [
      { name: 'Templates & Criteria', type: 'pdf', size: '2.7 MB' },
      { name: 'Sample Essays', type: 'pdf', size: '3.1 MB' },
    ],
    views: 634,
    status: 'published',
  },
  {
    id: 'ol-wr-2',
    title: 'Linking Devices & Cohesion — Writing Toolkit',
    section: 'olympiads',
    subsection: 'olymp-writing',
    type: 'writing-template',
    level: 'C1',
    description: 'Toolbox для продвинутого академического письма: linking devices, discourse markers, cohesion strategies.',
    author: 'Иванов А.Н.',
    date: '2025-03-12',
    tags: ['Writing', 'Linking', 'Cohesion', 'Academic'],
    difficulty: 2,
    files: [
      { name: 'Writing Toolkit', type: 'pdf', size: '1.9 MB' },
    ],
    views: 422,
    status: 'published',
  },
  {
    id: 'ol-sp-1',
    title: 'Speaking Prompts: Debate Topics',
    section: 'olympiads',
    subsection: 'olymp-speaking',
    type: 'speaking-card',
    level: 'C1',
    description: 'Карточки для монологического и диалогического высказывания. Темы олимпиадного уровня с подсказками, discourse vocabulary и критериями.',
    author: 'Иванов А.Н.',
    date: '2025-03-05',
    tags: ['Speaking', 'Debate', 'Олимпиада', 'Prompts'],
    difficulty: 3,
    files: [
      { name: 'Speaking Cards', type: 'pdf', size: '1.5 MB' },
    ],
    related: ['ol-sp-2', 'ol-wr-1'],
    views: 488,
    status: 'published',
  },
  {
    id: 'ol-sp-2',
    title: 'Monologue Strategies: Structure & Fluency',
    section: 'olympiads',
    subsection: 'olymp-speaking',
    type: 'speaking-card',
    level: 'C1',
    description: 'Стратегии и техники для устного монолога: структурирование, academic phrases, fluency markers.',
    author: 'Козлова Н.П.',
    date: '2025-02-18',
    tags: ['Speaking', 'Monologue', 'Fluency', 'Олимпиада'],
    difficulty: 2,
    files: [
      { name: 'Strategy Guide', type: 'pdf', size: '2.0 MB' },
    ],
    views: 356,
    status: 'published',
  },
  // EGE
  {
    id: 'ege-gr-1',
    title: 'ЕГЭ: Grammar Tasks Bank (Задания 22–31)',
    section: 'ege',
    subsection: 'ege-grammar',
    type: 'grammar-task',
    level: 'B2',
    description: 'Систематизированный банк грамматических заданий формата ЕГЭ. Охватывает все подтипы заданий 22–31 с ключами и разборами.',
    author: 'Сорокина Т.Л.',
    date: '2025-04-01',
    tags: ['ЕГЭ', 'Grammar', 'Bank', 'Задания 22-31'],
    difficulty: 2,
    files: [
      { name: 'Tasks PDF', type: 'pdf', size: '5.2 MB' },
      { name: 'Answer Key', type: 'pdf', size: '1.3 MB' },
    ],
    views: 1120,
    status: 'published',
  },
  {
    id: 'ege-gr-2',
    title: 'ЕГЭ Grammar: Типичные ошибки и разбор',
    section: 'ege',
    subsection: 'ege-grammar',
    type: 'checklist',
    level: 'B2',
    description: 'Анализ типичных грамматических ошибок в ЕГЭ. Разборы реальных заданий, системные объяснения.',
    author: 'Новикова Р.М.',
    date: '2025-03-20',
    tags: ['ЕГЭ', 'Grammar', 'Ошибки', 'Разбор'],
    difficulty: 2,
    files: [
      { name: 'Error Analysis', type: 'pdf', size: '2.8 MB' },
    ],
    views: 783,
    status: 'published',
  },
  {
    id: 'ege-wr-1',
    title: 'ЕГЭ Writing: Личное письмо + Эссе',
    section: 'ege',
    subsection: 'ege-writing',
    type: 'writing-template',
    level: 'B2',
    description: 'Шаблоны и образцы личного письма и эссе для ЕГЭ с детальным разбором критериев оценивания. Практические упражнения и чек-листы.',
    author: 'Сорокина Т.Л.',
    date: '2025-02-25',
    tags: ['ЕГЭ', 'Writing', 'Letter', 'Essay', 'Criteria'],
    difficulty: 2,
    files: [
      { name: 'Templates', type: 'pdf', size: '2.0 MB' },
      { name: 'Criteria', type: 'pdf', size: '0.9 MB' },
      { name: 'Checklist', type: 'pdf', size: '0.3 MB' },
    ],
    views: 945,
    status: 'published',
  },
  {
    id: 'ege-sp-1',
    title: 'ЕГЭ Speaking Cards (Tasks 1–4)',
    section: 'ege',
    subsection: 'ege-speaking',
    type: 'speaking-card',
    level: 'B2',
    description: 'Карточки для устной части ЕГЭ. Все 4 задания с таймингом, критериями и тренировочными версиями.',
    author: 'Новикова Р.М.',
    date: '2025-03-15',
    tags: ['ЕГЭ', 'Speaking', 'Cards', 'Timing'],
    difficulty: 2,
    files: [
      { name: 'Speaking Cards', type: 'pdf', size: '1.8 MB' },
      { name: 'Checklist', type: 'pdf', size: '0.4 MB' },
    ],
    related: ['ege-sp-2', 'ege-wr-1'],
    views: 1034,
    status: 'published',
  },
  {
    id: 'ege-sp-2',
    title: 'ЕГЭ Speaking: Photo Description Script',
    section: 'ege',
    subsection: 'ege-speaking',
    type: 'speaking-card',
    level: 'B2',
    description: 'Структурированные шаблоны для описания фотографий в ЕГЭ. Task 3 — монолог с готовыми речевыми структурами.',
    author: 'Сорокина Т.Л.',
    date: '2025-04-05',
    tags: ['ЕГЭ', 'Speaking', 'Photo', 'Script'],
    difficulty: 1,
    files: [
      { name: 'Script Templates', type: 'pdf', size: '1.2 MB' },
    ],
    views: 670,
    status: 'published',
  },
  // Lessons
  {
    id: 'ls-hw-1',
    title: 'Vocabulary Worksheets: Technology',
    section: 'lessons',
    subsection: 'lesson-handouts',
    type: 'worksheet',
    level: 'B1–B2',
    description: 'Раздаточный материал для работы с лексикой по теме "Технологии". Упражнения на введение, закрепление и активизацию словарного запаса.',
    author: 'Белова О.К.',
    date: '2025-03-20',
    tags: ['Worksheet', 'Vocabulary', 'Technology', 'B1', 'B2'],
    files: [
      { name: 'Worksheets', type: 'pdf', size: '1.2 MB' },
    ],
    views: 342,
    status: 'published',
  },
  {
    id: 'ls-hw-2',
    title: 'Grammar Drills: Mixed Tenses (Print-Ready)',
    section: 'lessons',
    subsection: 'lesson-handouts',
    type: 'worksheet',
    level: 'B1',
    description: 'Готовые для печати тренировочные листы по смешанным временам. Подходят для контроля и отработки.',
    author: 'Белова О.К.',
    date: '2025-02-10',
    tags: ['Worksheet', 'Grammar', 'Print-Ready', 'Tenses'],
    files: [
      { name: 'Grammar Drills', type: 'pdf', size: '0.9 MB' },
    ],
    views: 290,
    status: 'published',
  },
  {
    id: 'ls-clil-1',
    title: 'CLIL: Science & English — Climate Change',
    section: 'lessons',
    subsection: 'lesson-clil',
    type: 'lesson-plan',
    level: 'B1+',
    description: 'Интегрированный урок по методике CLIL: английский + природоведение/география. Тема: изменение климата. Содержит планирование урока, материалы для учеников и оценочные листы.',
    author: 'Зайцева Л.В.',
    date: '2025-02-28',
    tags: ['CLIL', 'Science', 'Climate Change', 'Integrated', 'B1+'],
    files: [
      { name: 'Lesson Plan', type: 'pdf', size: '2.3 MB' },
      { name: 'Student Materials', type: 'pdf', size: '1.7 MB' },
      { name: 'Assessment Sheet', type: 'pdf', size: '0.5 MB' },
    ],
    views: 187,
    status: 'published',
  },
  {
    id: 'ls-clil-2',
    title: 'CLIL: History & English — Industrial Revolution',
    section: 'lessons',
    subsection: 'lesson-clil',
    type: 'lesson-plan',
    level: 'B2',
    description: 'CLIL-урок по теме "Промышленная революция": английский + история. Аутентичные тексты, задания на критическое мышление.',
    author: 'Зайцева Л.В.',
    date: '2025-03-10',
    tags: ['CLIL', 'History', 'Industrial Revolution', 'B2'],
    files: [
      { name: 'Lesson Plan', type: 'pdf', size: '2.7 MB' },
      { name: 'Reading Materials', type: 'pdf', size: '3.1 MB' },
    ],
    views: 143,
    status: 'published',
  },
  {
    id: 'ls-selta-1',
    title: 'SELTA: Reflective Teaching Practice Module',
    section: 'lessons',
    subsection: 'lesson-selta',
    type: 'lesson-plan',
    level: 'B2',
    description: 'Методическая разработка по программе SELTA с акцентом на рефлексивную практику. Включает дневник наблюдений и peer feedback format.',
    author: 'Громова С.А.',
    date: '2025-01-20',
    tags: ['SELTA', 'Methodology', 'Reflective Practice', 'PD'],
    files: [
      { name: 'SELTA Materials', type: 'pdf', size: '3.8 MB' },
    ],
    views: 98,
    status: 'published',
  },
];

export interface SkillNode {
  id: string;
  label: string;
  x: number;
  y: number;
  category: 'grammar' | 'vocabulary' | 'writing' | 'culture' | 'speaking';
  goals: ('olympiad' | 'ege' | 'lesson' | 'general')[];
  progress: number;
  materialCount: number;
  description: string;
}

export const skillNodes: SkillNode[] = [
  { id: 'tenses', label: 'Tenses', x: 130, y: 120, category: 'grammar', goals: ['olympiad', 'ege', 'general'], progress: 75, materialCount: 8, description: 'Все временные формы: Present Perfect, Past Perfect, Future forms' },
  { id: 'passive', label: 'Passive Voice', x: 130, y: 260, category: 'grammar', goals: ['olympiad', 'ege', 'general'], progress: 60, materialCount: 5, description: 'Пассивный залог и каузативные конструкции' },
  { id: 'conditionals', label: 'Conditionals', x: 130, y: 400, category: 'grammar', goals: ['olympiad', 'ege', 'general'], progress: 45, materialCount: 6, description: 'Условные конструкции 1–4 и Mixed Conditionals' },
  { id: 'word-formation', label: 'Word Formation', x: 350, y: 80, category: 'vocabulary', goals: ['olympiad', 'ege', 'general'], progress: 80, materialCount: 7, description: 'Словообразование: суффиксы, префиксы, конверсия' },
  { id: 'linking', label: 'Linking Devices', x: 350, y: 230, category: 'writing', goals: ['olympiad', 'ege', 'lesson', 'general'], progress: 55, materialCount: 4, description: 'Discourse markers и связующие средства' },
  { id: 'essay-structure', label: 'Essay Structure', x: 350, y: 380, category: 'writing', goals: ['olympiad', 'ege', 'general'], progress: 70, materialCount: 9, description: 'Структура эссе: от тезиса до заключения' },
  { id: 'argumentation', label: 'Argumentation', x: 570, y: 140, category: 'writing', goals: ['olympiad', 'general'], progress: 40, materialCount: 6, description: 'Аргументация и риторические стратегии' },
  { id: 'cultural', label: 'Cultural Context', x: 570, y: 300, category: 'culture', goals: ['olympiad', 'lesson', 'general'], progress: 35, materialCount: 5, description: 'Культурный контекст англоязычного мира' },
  { id: 'speaking-fluency', label: 'Speaking Fluency', x: 570, y: 450, category: 'speaking', goals: ['olympiad', 'ege', 'lesson', 'general'], progress: 50, materialCount: 7, description: 'Беглость и стратегии устной речи' },
  { id: 'pronunciation', label: 'Pronunciation Patterns', x: 780, y: 290, category: 'speaking', goals: ['ege', 'lesson', 'general'], progress: 30, materialCount: 3, description: 'Произношение, интонация и ритм английской речи' },
];

export const skillConnections: [string, string][] = [
  ['tenses', 'passive'],
  ['passive', 'conditionals'],
  ['tenses', 'word-formation'],
  ['passive', 'linking'],
  ['conditionals', 'essay-structure'],
  ['word-formation', 'linking'],
  ['linking', 'essay-structure'],
  ['linking', 'argumentation'],
  ['essay-structure', 'argumentation'],
  ['argumentation', 'cultural'],
  ['cultural', 'speaking-fluency'],
  ['speaking-fluency', 'pronunciation'],
  ['cultural', 'pronunciation'],
];

export const sections = [
  {
    key: 'textbooks' as SectionKey,
    label: 'Учебники',
    icon: 'BookOpen',
    color: '#1E2A44',
    subsections: [
      { key: 'rf-textbooks' as SubsectionKey, label: 'Грифованные РФ' },
    ],
  },
  {
    key: 'olympiads' as SectionKey,
    label: 'Подготовка к олимпиадам',
    icon: 'Trophy',
    color: '#A9445B',
    subsections: [
      { key: 'olymp-grammar' as SubsectionKey, label: 'Grammar' },
      { key: 'olymp-uoe' as SubsectionKey, label: 'Use of English' },
      { key: 'olymp-culture' as SubsectionKey, label: 'Cultural Awareness' },
      { key: 'olymp-writing' as SubsectionKey, label: 'Writing' },
      { key: 'olymp-speaking' as SubsectionKey, label: 'Speaking' },
    ],
  },
  {
    key: 'ege' as SectionKey,
    label: 'Подготовка к ЕГЭ',
    icon: 'FileCheck',
    color: '#2B5E8A',
    subsections: [
      { key: 'ege-grammar' as SubsectionKey, label: 'Grammar' },
      { key: 'ege-writing' as SubsectionKey, label: 'Writing' },
      { key: 'ege-speaking' as SubsectionKey, label: 'Speaking' },
    ],
  },
  {
    key: 'lessons' as SectionKey,
    label: 'Подготовка к урокам',
    icon: 'GraduationCap',
    color: '#3D6B4F',
    subsections: [
      { key: 'lesson-handouts' as SubsectionKey, label: 'Раздаточный материал' },
      { key: 'lesson-clil' as SubsectionKey, label: 'Уроки по методике CLIL' },
      { key: 'lesson-selta' as SubsectionKey, label: 'Уроки по SELTA' },
    ],
  },
];

export const popularTopics = [
  'Tenses', 'Passive Voice', 'Conditionals', 'Word Formation',
  'Essay Writing', 'Speaking Strategies', 'Linking Devices', 'Argumentation',
  'Cultural Context', 'Grammar Rules', 'Phrasal Verbs', 'Idioms',
];

export const collections = [
  {
    id: 'col-1',
    title: 'Олимпиадный старт',
    description: 'Базовый набор материалов для начала олимпиадной подготовки. Grammar + Use of English + Writing.',
    count: 12,
    tags: ['Олимпиада', 'Starter Pack'],
    color: '#A9445B',
  },
  {
    id: 'col-2',
    title: 'ЕГЭ за 60 дней',
    description: 'Структурированная подборка для интенсивной подготовки к ЕГЭ. Все разделы, шаблоны, чек-листы.',
    count: 18,
    tags: ['ЕГЭ', 'Интенсив'],
    color: '#2B5E8A',
  },
  {
    id: 'col-3',
    title: 'CLIL & SELTA toolkit',
    description: 'Профессиональный набор для учителей, работающих по современным методикам.',
    count: 9,
    tags: ['Урок', 'Методика'],
    color: '#3D6B4F',
  },
];
