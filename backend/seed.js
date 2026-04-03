require('dotenv').config();
const mongoose = require('mongoose');
const Artist = require('./models/Artist');
const Album = require('./models/Album');
const SiteConfig = require('./models/SiteConfig');

const artistsData = [
  { name: 'Тёмный Принц', genre: 'Trap / Dark Hip-Hop', country: 'Россия', bio: 'Один из пионеров мрачного трэпа в русском рэпе. Его треки — это смесь тяжёлых битов и откровенных текстов о жизни.', image: '/covers/tm.png', formedYear: 2016 },
  { name: 'Heronwater', genre: 'Cloud Rap / Emo Rap', country: 'Россия', bio: 'Андеграундный исполнитель, известный атмосферными битами и глубокими текстами. 1000bars — его главный проект.', image: '/covers/heron.jpg', formedYear: 2017 },
  { name: 'Bushido Zho', genre: 'Rap / Trap', country: 'Россия', bio: 'Молодой московский рэпер, ставший популярным благодаря честным текстам о жизни и уличной культуре.', image: '/covers/bz.jpg', formedYear: 2018 },
  { name: 'Gone.Fludd', genre: 'Cloud Rap / Alternative', country: 'Россия', bio: 'Один из самых узнаваемых голосов русского клауд-рэпа. Его тексты о эмоциях нашли отклик у целого поколения.', image: '/covers/gf.jpg', formedYear: 2016 },
  { name: 'Juice WRLD', genre: 'Emo Rap / Trap', country: 'США', bio: 'Легендарный американский рэпер, чьё влияние на emo rap огромно. Goodbye & Good Riddance сделал его звездой.', image: '/covers/jw.jpg', formedYear: 2017 },
  { name: 'Chief Keef', genre: 'Drill / Trap', country: 'США', bio: 'Один из основателей чикагского дрилла. Finally Rich — альбом с которого началась целая эпоха в хип-хопе.', image: '/covers/ck.jpg', formedYear: 2011 },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB подключена');

    await Artist.deleteMany({});
    await Album.deleteMany({});
    await SiteConfig.deleteMany({});
    console.log('Старые данные удалены');

    const artists = await Artist.insertMany(artistsData);
    console.log(`Создано ${artists.length} исполнителей`);

    const find = (name) => artists.find((a) => a.name === name);

    const albumsData = [
      {
        title: 'Мрачные Треды', artist: find('Тёмный Принц')._id, artistName: 'Тёмный Принц',
        year: 2021, genre: 'Trap / Dark Hip-Hop', cover: '/covers/mt.jpg',
        description: 'Дебютный проект Тёмного Принца — альбом о мрачной стороне жизни, сделанный на тяжёлых битах с атмосферными семплами. Каждый трек — как страница дневника.',
        tracks: [
        { title: 'web 2.0', duration: '1:23', audioFile: '/music/tp1.mp3', feat: 'silver gloria' },
        { title: 'pedobearᶴᵒᵏ', duration: '1:23', audioFile: '' },
        { title: 'губы', duration: '1:34', audioFile: '' },
        { title: 'вклубе', duration: '1:39', audioFile: '' },
        { title: 'свалка', duration: '1:21', audioFile: ''},
        { title: 'автозаправка', duration: '1:33', audioFile: '' },
        { title: 'французы', duration: '1:06', audioFile: '' },
        { title: 'цветы', duration: '1:38', audioFile: '' }
        ],
      },
      {
        title: '1000bars', artist: find('Heronwater')._id, artistName: 'Heronwater',
        year: 2025, genre: 'Cloud Rap / Emo Rap', cover: '/covers/1000bars.jpg',
        description: 'Масштабный проект Heronwater — 1000 строчек текста, вылитых в один альбом. Атмосферные биты, откровенные тексты, никакой фальши.',
        tracks: [
        { title: 'WANT SOME MORE', duration: '1:58', audioFile: '/music/h1.mp3' },
        { title: 'I LOVE MY OPPS', duration: '2:36', audioFile: '/music/h2.mp3' },
        { title: 'CASPIAN LOVE', duration: '2:04', audioFile: '/music/h3.mp3' },
        { title: 'FANTASY', duration: '1:36', audioFile: '/music/h4.mp3' },
        { title: 'INTERLUDE BARS', duration: '2:58', audioFile: '/music/h5.mp3' },
        { title: 'ВЕЧНО МОЛОДОЙ', duration: '2:28', audioFile: '/music/h6.mp3' },
        { title: 'ЛУЧШИЕ ГОДЫ', duration: '1:59', audioFile: '/music/h7.mp3' },
        { title: 'ВЫПЕЙ ЗА МЕНЯ', duration: '2:20', audioFile: '/music/h8.mp3' },
        { title: 'VOGUE WATER', duration: '1:44', audioFile: '/music/h9.mp3' },
        { title: 'Я ЛЮБЛЮ', duration: '2:06', audioFile: '/music/h10.mp3' },
        { title: 'DJ', duration: '2:20', audioFile: '/music/h11.mp3' },
        { title: 'ЦАРИЦУ', duration: '2:02', audioFile: '/music/h12.mp3' },
        { title: 'TAXIO', duration: '1:45', audioFile: '/music/h13.mp3' },
        { title: 'ЖАН ПОЛЬ ГОТЬЕ', duration: '2:10', audioFile: '/music/h14.mp3' },
        { title: 'НА ПЕРВОМ СВИДАНИИ', duration: '1:56', audioFile: '/music/h15.mp3' },
        { title: 'SEX IN THE CLUB', duration: '2:12', audioFile: '/music/h16.mp3' },
        { title: 'DARK NIGHT', duration: '1:42', audioFile: '/music/h17.mp3' },
        { title: 'АИР АУТРО', duration: '2:01', audioFile: '/music/h18.mp3' }
        ],
      },
      {
        title: 'We Live Only Once', artist: find('Bushido Zho')._id, artistName: 'Bushido Zho',
        year: 2022, genre: 'Rap / Trap', cover: '/covers/wloo.png',
        description: 'Философский альбом о смысле жизни, молодости и ошибках. Bushido Zho говорит о том, что волнует каждого — честно и без прикрас.',
        tracks: [
          { title: 'WLYO Intro', duration: '1:55', audioFile: '' },
          { title: 'We Live Only Once', duration: '3:22', audioFile: '' },
          { title: 'Не Жди', duration: '2:48', audioFile: '' },
          { title: 'Молодость', duration: '3:15', audioFile: '' },
          { title: 'Секунды', duration: '2:59', audioFile: '' },
          { title: 'Последний Шанс', duration: '3:44', audioFile: '' },
          { title: 'Жить', duration: '4:01', audioFile: '' },
        ],
      },
      {
        title: "Boys Don't Cry", artist: find('Gone.Fludd')._id, artistName: 'Gone.Fludd',
        year: 2019, genre: 'Cloud Rap / Alternative', cover: '/covers/images (4).jpg',
        description: 'Один из самых важных альбомов русского клауд-рэпа. Gone.Fludd говорит о боли, потерях и силе двигаться дальше.',
        tracks: [
          { title: 'Intro', duration: '1:32', audioFile: '' },
          { title: "Boys Don't Cry", duration: '3:05', audioFile: '' },
          { title: 'Слёзы', duration: '2:51', audioFile: '' },
          { title: 'Один', duration: '3:28', audioFile: '' },
          { title: 'Не Говори', duration: '2:44', audioFile: '' },
          { title: 'Больно', duration: '3:17', audioFile: '' },
          { title: 'Подожди', duration: '3:52', audioFile: '' },
          { title: 'Outro', duration: '2:20', audioFile: '' },
        ],
      },
      {
        title: 'Goodbye & Good Riddance', artist: find('Juice WRLD')._id, artistName: 'Juice WRLD',
        year: 2018, genre: 'Emo Rap / Trap', cover: '/covers/ggr.jpg',
        description: 'Дебютный альбом Juice WRLD о разбитых сердцах и потерянной молодости. Lucid Dreams — один из главных гимнов emo rap поколения.',
        tracks: [
          { title: 'All Girls Are the Same', duration: '2:53', audioFile: '' },
          { title: 'Lucid Dreams', duration: '3:59', audioFile: '' },
          { title: 'Wishing Well', duration: '3:19', audioFile: '' },
          { title: 'Lean Wit Me', duration: '3:22', audioFile: '' },
          { title: 'Scared of Love', duration: '3:01', audioFile: '' },
          { title: 'Used to', duration: '3:12', audioFile: '' },
          { title: 'Robbery', duration: '3:47', audioFile: '' },
          { title: 'Fluid', duration: '2:41', audioFile: '' },
          { title: 'Fast', duration: '2:27', audioFile: '' },
          { title: 'Hide', duration: '3:05', audioFile: '' },
          { title: 'Smile', duration: '2:58', audioFile: '' },
          { title: 'Come & Go', duration: '3:14', audioFile: '' },
        ],
      },
      {
        title: 'Finally Rich', artist: find('Chief Keef')._id, artistName: 'Chief Keef',
        year: 2012, genre: 'Drill / Trap', cover: '/covers/fr.jpg',
        description: "Дебютный мейджор-альбом Chief Keef, с которого началась эпоха чикагского дрилла. I Don't Like и Love Sosa стали гимнами целого поколения.",
        tracks: [
          { title: 'Take It', duration: '3:18', audioFile: '' },
          { title: "I Don't Like", duration: '3:26', audioFile: '' },
          { title: "Hate Bein' Sober", duration: '3:51', audioFile: '' },
          { title: "Laughin' to the Bank", duration: '3:02', audioFile: '' },
          { title: 'Love Sosa', duration: '3:44', audioFile: '' },
          { title: 'Understand Me', duration: '3:15', audioFile: '' },
          { title: 'Kay Kay', duration: '2:58', audioFile: '' },
          { title: 'Hallelujah', duration: '3:33', audioFile: '' },
          { title: 'Kobe', duration: '3:07', audioFile: '' },
          { title: 'Bars', duration: '2:44', audioFile: '' },
          { title: 'Finally Rich', duration: '4:01', audioFile: '' },
        ],
      },
    ];

    const albums = await Album.insertMany(albumsData);
    console.log(`Создано ${albums.length} альбомов`);

    const featured = albums.find((a) => a.title === 'Мрачные Треды');
    await SiteConfig.create({ key: 'featuredAlbum', value: featured._id });
    console.log(`Альбом месяца: ${featured.title}`);

    console.log('\n✅ База данных успешно заполнена!');
    process.exit(0);
  } catch (error) {
    console.error('Ошибка:', error);
    process.exit(1);
  }
}

seed();
