export interface IPost {
  id: string;
  url: string;
  "url-with-slug": string;
  type: string;
  date_gmt: string;
  date: string;
  unix_timestamp: string;
  format: string;
  reblog_key: string;
  slug: string;
  note_count: string;
  name: string;
  title: string;
  media_url: string[];
}

export interface IDataFound {
  account: string;
  total_nmber_of_posts: number;
  size: number;
  data: IPost[];
}

export interface IError {
  error: string;
}
