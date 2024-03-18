import { isEmpty, isNil } from 'ramda';

import type { AddBoardFormInputs } from '@/app/components/AddBoardForm/types';

/**
  Construct SQl query:
 
  UPDATE "Status" AS Status SET
    name = Temp.name,
    color = Temp.color,
    position = Temp.position
  FROM (VALUES
      ('cf8d69c3-4b7f-4f41-90b3-2733f70a3d1c', 'cf8d69c3-4b7f-4f41-90b3-2733f70a3d1c', 'test', '#fffff', 1),
  ) AS Temp(id, "boardId", "name", "color", "position")
  WHERE Status."boardId"::text = Temp."boardId" AND Status.id::text = Temp.id;
 */
const createUpdateMultipleStatusesQuery = (
  boardId: string,
  statuses: AddBoardFormInputs['statuses'],
) => {
  if (isNil(boardId) || isEmpty(boardId) || isNil(statuses) || isEmpty(statuses)) {
    return null;
  }

  let values = '';

  for (let i = 0; i < statuses.length; i++) {
    const status = statuses[i];

    const end = i === statuses.length - 1 ? '' : ',\n';

    values = `${values}('${status.id}', '${boardId}', '${status.name}', '${status.color}', ${status.position})${end}`;
  }

  const finalSql = `UPDATE "Status" AS Status SET
    name = Temp.name,
    color = Temp.color,
    position = Temp.position
FROM (
  VALUES
    ${values}
  ) 
AS Temp(id, "boardId", "name", "color", "position")
WHERE Status."boardId"::text = Temp."boardId"::text AND Status.id::text = Temp.id;`;

  return finalSql;
};

export default createUpdateMultipleStatusesQuery;
