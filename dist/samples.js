const sampleAngles = [
  ['front', 'Qiya old ko‘rinish', 'Вид спереди под углом'],
  ['top', 'Tepadan ko‘rinish', 'Вид сверху'],
  ['right', 'O‘ng tomondan ko‘rinish', 'Вид справа']
];

const uzbekCatalog = 'https://tillabor.uz/uz/catalog';
const earringCatalog = 'https://tillabor.uz/uz/categories/earrings';
const setCatalog = 'https://tillabor.uz/uz/categories/sets';
const tripleBandSource = 'https://tillabor.uz/ru/products/oltin-store-uch-qatorli';

// Prices are presentation estimates. Specifications describe the linked reference piece.
const referenceSpecs = {
  'wedding-band': [4_700_000, '585', 3.8, '', 'Klassik nikoh', 'Классическое обручальное', uzbekCatalog],
  'solitaire-ring': [14_800_000, '750', 2.6, '', 'Yakka toshli solitaire', 'Солитер с одним камнем', uzbekCatalog],
  'three-row-ring': [4_900_000, '585', 3.8, '18', 'Fianitli uch qator', 'Три дорожки с фианитами', tripleBandSource],
  'hoop-earrings': [3_800_000, '585', 3, '', 'Naqshli halqa', 'Кольца с узором', earringCatalog],
  'fianit-studs': [2_300_000, '585', 1.8, '', 'Fianitli puset', 'Пусеты с фианитами', earringCatalog],
  'pearl-drops': [3_100_000, '585', 2.4, '', 'Osma marvarid', 'Подвески с жемчугом', earringCatalog],
  'bismark-bracelet': [4_800_000, '585', 3.71, '', 'Bismark o‘rimi', 'Плетение «Бисмарк»', 'https://alifshop.uz/ru/moderated-offer/braslet-sokolov-zoloto-585-proba-1790143272'],
  'curb-bracelet': [14_300_000, '585', 11.2, '', 'Pansir o‘rimi', 'Панцирное плетение', 'https://tillabor.uz/uz/categories/bracelets'],
  'stone-bracelet': [9_800_000, '', null, '', 'Toshli tennis uslubi', 'Теннисный браслет с камнями', ''],
  'heart-pendant': [1_900_000, '585', 1.4, '', 'Yurak shaklidagi kulon', 'Подвеска в форме сердца', uzbekCatalog],
  'fianit-pendant': [2_100_000, '585', 1.6, '', 'Dumaloq fianitli kulon', 'Подвеска с круглым фианитом', uzbekCatalog],
  'venetian-chain': [5_800_000, '', null, '', 'Venetsiya o‘rimi', 'Венецианское плетение', ''],
  'petal-set': [13_800_000, '585', 9.9, '', 'Gul yaproqli garnitur', 'Гарнитур с лепестками', setCatalog],
  'leaf-set': [8_000_000, '585', 10.4, '', 'Teksturali barg garnituri', 'Гарнитур с текстурным листом', setCatalog],
  'three-row-set': [9_500_000, '585', 9.7, '18', 'Fianitli uch qatorli garnitur', 'Гарнитур с тремя дорожками фианитов', tripleBandSource]
};

const catalogReferences = Object.entries({
  rings: [
    ['wedding-band', 'Klassik nikoh uzugi', 'Классическое обручальное кольцо'],
    ['solitaire-ring', 'Yakka toshli uzuk', 'Кольцо с одним камнем'],
    ['three-row-ring', 'Uch qatorli uzuk', 'Кольцо «Три дорожки»']
  ],
  earrings: [
    ['hoop-earrings', 'Naqshli halqa sirg‘alar', 'Серьги-кольца с узором'],
    ['fianit-studs', 'Fianitli puset sirg‘alar', 'Серьги-гвоздики с фианитами'],
    ['pearl-drops', 'Osma marvarid sirg‘alar', 'Серьги с подвесным жемчугом']
  ],
  bracelets: [
    ['bismark-bracelet', 'Bismark o‘rimli bilaguzuk', 'Браслет плетения «Бисмарк»'],
    ['curb-bracelet', 'Yassi halqali zanjir bilaguzuk', 'Браслет с панцирным плетением'],
    ['stone-bracelet', 'Qator toshli bilaguzuk', 'Браслет с дорожкой камней']
  ],
  necklaces: [
    ['heart-pendant', 'Yurak shaklidagi kulon', 'Подвеска «Сердце»'],
    ['fianit-pendant', 'Dumaloq fianitli kulon', 'Подвеска с круглым фианитом'],
    ['venetian-chain', 'Venetsiya o‘rimli zanjir', 'Цепочка венецианского плетения']
  ],
  sets: [
    ['petal-set', 'Oltin yaproqlar to‘plami', 'Гарнитур «Золотые лепестки»'],
    ['leaf-set', 'Naqshli barg to‘plami', 'Гарнитур «Текстурный лист»'],
    ['three-row-set', 'Uch qatorli to‘plam', 'Гарнитур «Три дорожки»']
  ]
}).flatMap(([category, designs]) => designs.map(([id, uz, ru]) => {
  const photos = sampleAngles.map(([angle]) => `assets/samples/${id}-${angle}.webp`);
  const [price, purity, weight, size, styleUz, styleRu, source] = referenceSpecs[id];
  const sku = 'MG-REF-' + id.toUpperCase();
  return {id, uz, ru, category, photo: photos[0], photos, sku, price, purity, weight, size,
    styleUz, styleRu, source, available: false, reference: true};
}));
