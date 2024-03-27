CREATE OR REPLACE FUNCTION public.get_cards_by_status_id(board_id text, status_id text, limitn bigint, offsetn bigint)
 RETURNS SETOF jsonb
 LANGUAGE plpgsql
AS $function$
BEGIN
  RETURN QUERY 
  SELECT jsonb_build_object(
    'id', c.id,
    'title', c.title,
    'description', c.description,
    'boardId', c."boardId",
    'createdAt', c."createdAt",
    'updatedAt', c."updatedAt",
    'statusId', c."statusId",
    'moveDate', h."moveDate",
    'tags', CASE 
       	WHEN COUNT(t.id) > 0 
       	THEN 
            jsonb_agg(jsonb_build_object(
               'id', t.id,
	      		'name', t.name,
	      		'color', t.color,
	      		'fontColor', t."fontColor"
            ))
        ELSE 
            '[]'::jsonb 
    END,
    'status', jsonb_build_object(
      'id', s.id,
      'name', s.name,
      'color', s.color,
      'createdAt', s."createdAt",
      'position', s.position,
      'boardId', s."boardId"
     ),
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
    )
  )
  FROM "Card" c
  LEFT JOIN "TagLinker" tL ON c.id = tL."cardId" AND tl."boardId"::text = board_id
  LEFT JOIN "Tag" t ON tL."tagId" = t."id"
  LEFT JOIN "Status" s ON c."statusId" = s.id
  JOIN "CardStatusHistory" h ON c.id = h."cardId"
  WHERE 
    c."statusId"::text = status_id
    AND
    c."boardId"::text = board_id
  GROUP BY c.id, c.title, c.description, c."boardId", c."createdAt", c."statusId", s.id, h."moveDate"
  ORDER BY h."moveDate" DESC
  OFFSET offsetN
  LIMIT limitN;
END;
$function$
