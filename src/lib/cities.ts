// Sample subset of US cities. Replace with a full dataset if needed.
// For production scale, consider dynamic fetch or incremental search.
export interface City {
  name: string;
  state?: string;
}

export const US_CITIES: City[] = [
  { name:'New York', state:'NY' },
  { name:'Los Angeles', state:'CA' },
  { name:'Chicago', state:'IL' },
  { name:'Houston', state:'TX' },
  { name:'Phoenix', state:'AZ' },
  { name:'Philadelphia', state:'PA' },
  { name:'San Antonio', state:'TX' },
  { name:'San Diego', state:'CA' },
  { name:'Dallas', state:'TX' },
  { name:'San Jose', state:'CA' },
  { name:'Austin', state:'TX' },
  { name:'Jacksonville', state:'FL' },
  { name:'Fort Worth', state:'TX' },
  { name:'Columbus', state:'OH' },
  { name:'Charlotte', state:'NC' },
  { name:'San Francisco', state:'CA' },
  { name:'Indianapolis', state:'IN' },
  { name:'Seattle', state:'WA' },
  { name:'Denver', state:'CO' },
  { name:'Washington', state:'DC' },
  // Add more or replace with full dataset
];