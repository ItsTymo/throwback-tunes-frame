  // src/data.ts
export const songsByDecade = {
    '50s': [
      { title: 'Johnny B. Goode', artist: 'Chuck Berry', youtubeId: '6ROwVrF0Ceg' },
      { title: 'Jailhouse Rock', artist: 'Elvis Presley', youtubeId: 'gj0Rz-uP4Mk' },
    ],
    '60s': [
      { title: 'My Girl', artist: 'The Temptations', youtubeId: 'C_CSjcm-z1w' },
      { title: 'Like a Rolling Stone', artist: 'Bob Dylan', youtubeId: 'IwOfCgkyEj0' },
    ],
    '70s': [
      { title: 'Bohemian Rhapsody', artist: 'Queen', youtubeId: 'fJ9rUzIMcZQ' },
      { title: 'Stayin\' Alive', artist: 'Bee Gees', youtubeId: 'I_izvAbhExY' },
    ],
    // Add more decades and sample songs
    '80s': [ /* songs */ ],
    '90s': [ /* songs */ ],
    '00s': [ /* songs */ ],
    '10s': [ /* songs */ ]
  };
  
  // Define the structure of a song (optional but good practice in TypeScript)
  export interface Song {
    title: string;
    artist: string;
    youtubeId: string;
  }