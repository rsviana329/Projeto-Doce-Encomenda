import { Card, CardContent } from '@/components/ui/card';
import { Heart, Award, Clock } from 'lucide-react';

const Sobre = () => {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="gradient-hero py-20 md:py-32">
        <div className="container mx-auto px-4 text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold">
            Sobre a <span className="gradient-text">Doce Encomenda</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Transformando momentos especiais em doces memórias desde o primeiro bolo
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="prose prose-lg mx-auto text-muted-foreground space-y-6">
            <p>
              Na Doce Encomenda, acreditamos que cada celebração merece um bolo único e especial.
              Nossa paixão por confeitaria artesanal nos motiva a criar bolos que não são apenas
              deliciosos, mas verdadeiras obras de arte comestíveis.
            </p>
            <p>
              Cada bolo é cuidadosamente preparado com ingredientes selecionados e muito carinho.
              Nossa missão é transformar seus momentos especiais em memórias doces que durarão
              para sempre.
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12">
            <Card className="p-8 text-center space-y-4 gradient-card border-0 shadow-card">
              <div className="w-16 h-16 mx-auto rounded-full gradient-primary flex items-center justify-center shadow-soft">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold">Feito com Amor</h3>
              <p className="text-muted-foreground">
                Cada bolo é preparado artesanalmente, com dedicação e atenção aos mínimos detalhes.
              </p>
            </Card>

            <Card className="p-8 text-center space-y-4 gradient-card border-0 shadow-card">
              <div className="w-16 h-16 mx-auto rounded-full gradient-primary flex items-center justify-center shadow-soft">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold">Qualidade Premium</h3>
              <p className="text-muted-foreground">
                Usamos apenas ingredientes selecionados para garantir o melhor sabor e qualidade.
              </p>
            </Card>

            <Card className="p-8 text-center space-y-4 gradient-card border-0 shadow-card">
              <div className="w-16 h-16 mx-auto rounded-full gradient-primary flex items-center justify-center shadow-soft">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold">Pontualidade</h3>
              <p className="text-muted-foreground">
                Compromisso com prazos. Seu bolo estará pronto no dia e horário combinados.
              </p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Sobre;
