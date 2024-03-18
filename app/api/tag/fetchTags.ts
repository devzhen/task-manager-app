import { API_HOST } from '@/app/constants';
import type { TagLinkerType } from '@/app/types';

// Fetch available tags
const fetchTags = async (boardId: string): Promise<TagLinkerType[]> => {
  'use server';

  let tags: TagLinkerType[] = [];

  try {
    const url = new URL(`${API_HOST}/api/tag/list?board=${boardId}`);
    const response = await fetch(url.toString());
    tags = await response.json();

    if ('error' in tags) {
      // eslint-disable-next-line no-console
      console.log('Fetch tags error - ', tags.error);
      tags = [];
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log('Fetch tags error - ', err);
  } finally {
    return tags;
  }
};

export default fetchTags;
