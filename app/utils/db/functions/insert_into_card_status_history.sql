CREATE OR REPLACE FUNCTION insert_into_card_status_history()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO "CardStatusHistory" ("cardId", "statusId", "moveDate", "cardTitle")
    VALUES (NEW.id, NEW."statusId", CURRENT_TIMESTAMP, NEW."title");
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;