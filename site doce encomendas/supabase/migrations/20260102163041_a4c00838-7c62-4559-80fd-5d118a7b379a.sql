-- Criar bucket público para imagens de bolos
INSERT INTO storage.buckets (id, name, public)
VALUES ('bolos', 'bolos', true)
ON CONFLICT (id) DO NOTHING;

-- Política para permitir uploads anônimos no bucket bolos
CREATE POLICY "Anyone can upload to bolos bucket"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'bolos');

-- Política para permitir visualização pública das imagens
CREATE POLICY "Public read access to bolos bucket"
ON storage.objects
FOR SELECT
USING (bucket_id = 'bolos');

-- Política para permitir deleção (opcional, para limpeza futura)
CREATE POLICY "Anyone can delete from bolos bucket"
ON storage.objects
FOR DELETE
USING (bucket_id = 'bolos');