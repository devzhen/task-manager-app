import { isEmpty, isNil } from 'ramda';

import type { AddBoardFormInputs } from '@/app/components/AddBoardForm/types';

/**
  Construct SQl query:
 
  UPDATE "Tag" AS Tag SET
    name = Temp.name,
    color = Temp.color,
    "fontColor" = Temp."fontColor" 
  FROM (VALUES
      ('cf8d69c3-4b7f-4f41-90b3-2733f70a3d1c', 'cf8d69c3-4b7f-4f41-90b3-2733f70a3d1c', 'test', '#000000', '#ffffff'),
  ) AS Temp(id, "boardId", name, color, "fontColor")
  WHERE Tag."boardId"::text = Temp."boardId" AND Tag.id::text = Temp.id;
 */
const createUpdateMultipleTagsQuery = (boardId: string, tags: AddBoardFormInputs['tags']) => {
  if (isNil(boardId) || isEmpty(boardId) || isNil(tags) || isEmpty(tags)) {
    return null;
  }

  let values = '';

  for (let i = 0; i < tags.length; i++) {
    const tag = tags[i];

    const end = i === tags.length - 1 ? '' : ',\n';

    values = `${values}('${tag.id}', '${boardId}', '${tag.name}', '${tag.color}', '${tag.fontColor}')${end}`;
  }

  const finalSql = `UPDATE "Tag" AS Tag SET
  name = Temp.name,
  color = Temp.color,
  "fontColor" = Temp."fontColor" 
FROM (VALUES
    ${values}
) AS Temp(id, "boardId", name, color, "fontColor")
WHERE Tag."boardId"::text = Temp."boardId" AND Tag.id::text = Temp.id;`;

  return finalSql;
};

export default createUpdateMultipleTagsQuery;
