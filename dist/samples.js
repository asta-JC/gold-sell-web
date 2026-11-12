const sampleAngles = [
  ['front', 'Qiya old ko‘rinish', 'Вид спереди под углом'],
  ['top', 'Tepadan ko‘rinish', 'Вид сверху'],
  ['right', 'O‘ng tomondan ko‘rinish', 'Вид справа']
];

const jewelrySamples = Object.entries({
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
  return {id, uz, ru, category, photo: photos[0], photos};
}));
