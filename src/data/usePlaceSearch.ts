import { useQuery } from '@tanstack/react-query';
import ky from 'ky';
import { Place, nominatimResponseSchema } from '../models/Address';

const searchPlace = async (term: string): Promise<Place[]> => {
  const results = await ky
    .get('https://nominatim.openstreetmap.org/search', {
      searchParams: {
        q: term,
        format: 'json',
        accept_language: [navigator.language, 'en'].join(','),
      },
    })
    .catch((err) => {
      return Promise.reject(err);
    });

  const json = await results.json<Place[]>();

  return nominatimResponseSchema.parseAsync(json);
};

const usePlaceSearch = (term: string) => {
  return useQuery({
    queryKey: ['placeSearch', term],
    queryFn: () => searchPlace(term),
  });
};

export default usePlaceSearch;
