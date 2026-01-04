import { Card } from '@/components/ui/card';
import { Heart, Award, Clock, Cake, Users, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { AuroraBackground } from '@/components/ui/aurora-background';

// Import cake images
import boloAniversario from '@/assets/bolo-aniversario.jpg';
import boloCasamentoRosa from '@/assets/bolo-casamento-rosa.jpg';
import boloChocolate from '@/assets/bolo-chocolate.jpg';
import boloMorango from '@/assets/bolo-morango.jpg';
import boloRedVelvet from '@/assets/bolo-red-velvet.jpg';
import boloUnicornio from '@/assets/bolo-unicornio.jpg';

const galleryImages = [
  { src: boloAniversario, alt: "Bolo de Aniversário" },
  { src: boloCasamentoRosa, alt: "Bolo de Casamento Rosa" },
  { src: boloChocolate, alt: "Bolo de Chocolate" },
  { src: boloMorango, alt: "Bolo de Morango" },
  { src: boloRedVelvet, alt: "Bolo Red Velvet" },
  { src: boloUnicornio, alt: "Bolo Unicórnio" },
];

const Sobre = () => {
  const features = [
    {
      icon: Heart,
      title: "Feito com Amor",
      description: "Cada bolo é preparado artesanalmente, com dedicação e atenção aos mínimos detalhes."
    },
    {
      icon: Award,
      title: "Qualidade Premium",
      description: "Usamos apenas ingredientes selecionados para garantir o melhor sabor e qualidade."
    },
    {
      icon: Clock,
      title: "Pontualidade",
      description: "Compromisso com prazos. Seu bolo estará pronto no dia e horário combinados."
    }
  ];

  const stats = [
    { icon: Cake, value: "500+", label: "Bolos Entregues" },
    { icon: Users, value: "300+", label: "Clientes Felizes" },
    { icon: Sparkles, value: "5", label: "Anos de Experiência" }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <AuroraBackground className="min-h-[60vh] flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="container mx-auto px-4 text-center space-y-6 relative z-10"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4"
          >
            Nossa História
          </motion.span>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground">
            Sobre a <span className="gradient-text">Doce Encomenda</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Transformando momentos especiais em doces memórias desde o primeiro bolo
          </p>
        </motion.div>
      </AuroraBackground>

      {/* Story Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center space-y-8"
          >
            <h2 className="text-3xl md:text-4xl font-bold">
              Nossa <span className="gradient-text">Paixão</span>
            </h2>
            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
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
          </motion.div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Nossa <span className="gradient-text">Galeria</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Confira algumas das nossas criações mais especiais
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {galleryImages.map((image, index) => (
              <motion.div
                key={image.alt}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative aspect-square overflow-hidden rounded-2xl"
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-white font-medium text-sm md:text-base">{image.alt}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 mx-auto rounded-full gradient-primary flex items-center justify-center shadow-soft mb-4">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-4xl font-bold gradient-text mb-2">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Por que <span className="gradient-text">nos escolher?</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Dedicação, qualidade e carinho em cada detalhe
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="p-8 text-center space-y-4 bg-card/50 backdrop-blur-sm border-border/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full">
                <div className="w-16 h-16 mx-auto rounded-full gradient-primary flex items-center justify-center shadow-soft">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Sobre;