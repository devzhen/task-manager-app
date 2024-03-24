CREATE OR REPLACE FUNCTION update_card_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" := NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
