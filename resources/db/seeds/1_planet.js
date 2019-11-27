exports.seed = async (knex) => {
  return knex('planet').insert([
    {
      name: 'Mercury',
      code: 'MER'
    },
    {
      name: 'Venus',
      code: 'VEN'
    },
    {
      name: 'Earth',
      code: 'EAR'
    },
    {
      name: 'Mars',
      code: 'MAR'
    },
    {
      name: 'Jupiter',
      code: 'JUP'
    },
    {
      name: 'Saturn',
      code: 'SAT'
    },
    {
      name: 'Uranus',
      code: 'URA'
    },
    {
      name: 'Neptune',
      code: 'NEP'
    },
    {
      name: 'Ceres',
      code: 'CER'
    },
    {
      name: 'Pluto',
      code: 'PLU'
    },
    {
      name: 'Eris',
      code: 'ERI'
    },
    {
      name: 'Enceladus',
      code: 'ENC'
    },
    {
      name: 'Titan',
      code: 'TIT'
    },
    {
      name: 'Ganymede',
      code: 'GAN'
    },
    {
      name: 'Europa',
      code: 'EUR'
    }
  ]);
};
