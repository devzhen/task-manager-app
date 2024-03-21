CREATE OR REPLACE FUNCTION get_cards_by_status_id(
  board_id TEXT,
  status_id TEXT,
  limitN bigint,
  offsetN bigint
) RETURNS SETOF JSONB AS 
$$
BEGIN
  RETURN QUERY 
  SELECT jsonb_build_object(
    'id', c.id,
    'title', c.title,
    'description', c.description,
    'position', c.position,
    'boardId', c."boardId",
    'createdAt', c."createdAt",
    'statusId', c."statusId",
    'tags', jsonb_agg(jsonb_build_object(
      'id', t.id,
      'name', t.name,
      'color', t.color,
      'fontColor', t."fontColor"
    )),
    'attachments', ARRAY(
      SELECT json_build_object(
        'id', "Attachment".id,
        'name', "Attachment".name,
        'url', "Attachment".url,
        'cardId', "Attachment"."cardId",
        'createdAt', "Attachment"."createdAt"
      )
      FROM "Attachment"
      WHERE c.id = "Attachment"."cardId"
    ),
    'status',
    SELECT json_build_object(
      'id', "Status".id,
      'name', "Status".name,
      'color', "Status".color,
      'createdAt', "Status"."createdAt",
      'position', "Status"."position",
      'boardId', "Status"."boardId",
    )
    FROM "Status"
    WHERE c."statusId" = "Status"."id"
  )
  FROM "Card" c
  LEFT JOIN "TagLinker" tL ON c.id = tL."cardId"
  LEFT JOIN "Tag" t ON tL."tagId" = t."id"
  WHERE 
    c."statusId"::text = status_id
    AND
    c."boardId"::text = board_id
  GROUP BY c.id, c.title, c.description, c.position, c."boardId", c."createdAt", c."statusId"
  ORDER BY c.position
  OFFSET offsetN
  LIMIT limitN;
END;
$$ 
LANGUAGE plpgsql;