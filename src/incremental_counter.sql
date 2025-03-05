
-- Função para incrementar um valor em uma coluna específica
CREATE OR REPLACE FUNCTION increment(row_id UUID, increment_amount INTEGER)
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE 
  current_value INTEGER;
  new_value INTEGER;
BEGIN
  -- Obtém o valor atual
  SELECT tickets INTO current_value FROM customers WHERE id = row_id;
  
  -- Calcula o novo valor
  new_value := current_value + increment_amount;
  
  -- Atualiza a tabela e retorna o novo valor
  UPDATE customers SET tickets = new_value WHERE id = row_id;
  
  RETURN new_value;
END;
$$;
