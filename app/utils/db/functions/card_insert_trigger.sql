CREATE TRIGGER card_insert_trigger
AFTER INSERT ON "Card"
FOR EACH ROW EXECUTE FUNCTION insert_into_card_status_history();