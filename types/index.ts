export interface Photo {
  id: string;
  filename: string;
  caption: string;
}

export interface FilmRoll {
  id: string;
  filmStock: string;
  rollNumber: number;
  date: string;
  location: string;
  camera: string;
  description: string;
  photos: Photo[];
}

export interface FilmStockGroup {
  filmStock: string;
  rolls: FilmRoll[];
}
