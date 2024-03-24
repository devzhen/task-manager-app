CREATE TRIGGER trigger_update_card_updated_at
BEFORE UPDATE ON "Card"
FOR EACH ROW
EXECUTE FUNCTION update_card_updated_at();