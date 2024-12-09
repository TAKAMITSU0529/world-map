export interface City {
  id: string;
  name: string;
  photos: Photo[];
}

export interface Country {
  id: string;
  name: string;
  code: string;
  cities: City[];
}

export interface Photo {
  id: string;
  url: string;
  caption?: string;
  date?: string;
}

export interface PhotoUpload {
  file: File;
  caption: string;
  previewUrl: string;
}