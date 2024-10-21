import type { NextApiRequest, NextApiResponse } from 'next';
import { Client } from "@googlemaps/google-maps-services-js";

const API_KEY = process.env.GOOGLE_MAPS_API_KEY;
const client = new Client({});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { query, autocomplete } = req.query;

  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  if (!API_KEY) {
    return res.status(500).json({ error: 'API key is not set' });
  }

  try {
    if (autocomplete) {
      console.log('Autocomplete request for:', query);
      const response = await client.placeAutocomplete({
        params: {
          input: query as string,
          key: API_KEY,
        },
      });

      const suggestions = response.data.predictions.map((prediction) => ({
        placeId: prediction.place_id,
        description: prediction.description,
      }));

      console.log('Autocomplete suggestions:', suggestions);
      res.status(200).json(suggestions);
    } else {
      console.log('Geocode request for:', query);
      const response = await client.geocode({
        params: {
          place_id: query as string,
          key: API_KEY,
        },
      });

      console.log('Geocode response:', response.data);

      if (response.data.results.length > 0) {
        const result = response.data.results[0];
        const responseData = {
          formatted: result.formatted_address,
          lat: result.geometry.location.lat,
          lng: result.geometry.location.lng,
          components: result.address_components,
        };
        console.log('Sending response:', responseData);
        res.status(200).json(responseData);
      } else {
        console.log('No results found');
        res.status(404).json({ error: 'Location not found' });
      }
    }
  } catch (error) {
    console.error('Error in geocode API:', error);
    res.status(500).json({ error: 'Failed to process location request' });
  }
}
