CREATE OR REPLACE FUNCTION get_has_more_cards_by_status_id(
  board_id TEXT,
  status_id TEXT,
  limit_n bigint,
  offset_n bigint
) 
RETURNS BOOLEAN AS 
$$
DECLARE
    total_records INT;
BEGIN
    SELECT COUNT(*)
    INTO total_records
    FROM "Card"
    WHERE "Card"."statusId"::text = status_id AND "Card"."boardId"::text = board_id;

    RETURN total_records > (offset_n + limit_n);
END;
$$ 
LANGUAGE plpgsql;