CREATE OR REPLACE FUNCTION get_cards_count_by_status_id(
  board_id TEXT,
  status_id TEXT
) RETURNS INTEGER AS $$
DECLARE
    record_count INTEGER;
BEGIN
    SELECT COUNT(*)
    INTO record_count
    FROM "Card"
    WHERE "Card"."statusId"::text = status_id AND "Card"."boardId"::text = board_id;
    RETURN record_count;
END;
$$ LANGUAGE plpgsql;