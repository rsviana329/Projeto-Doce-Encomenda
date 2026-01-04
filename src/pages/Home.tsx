import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sparkles, Cake, Heart } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { AuroraBackground } from '@/components/ui/aurora-background';
import { DynamicFrameLayout } from '@/components/ui/dynamic-frame-layout';
import { TestimonialsColumn, Testimonial } from '@/components/ui/testimonials-column';
import ConfettiParticles from '@/components/ui/confetti-particles';
const testimonials: Testimonial[] = [{
  text: "O bolo de casamento foi simplesmente perfeito! Todos os convidados elogiaram muito. A Doce Momento superou todas as expectativas.",
  image: "https://randomuser.me/api/portraits/women/1.jpg",
  name: "Marina Santos",
  role: "Noiva"
}, {
  text: "Encomendo há 3 anos os bolos de aniversário dos meus filhos. Sempre capricham na decoração e o sabor é incrível!",
  image: "https://randomuser.me/api/portraits/women/2.jpg",
  name: "Carla Oliveira",
  role: "Mãe de família"
}, {
  text: "O bolo de chocolate com frutas vermelhas foi uma explosão de sabor. Atendimento impecável do início ao fim.",
  image: "https://randomuser.me/api/portraits/men/3.jpg",
  name: "Rafael Costa",
  role: "Aniversariante"
}, {
  text: "Profissionalismo exemplar! Fizeram um bolo temático incrível para a festa da minha empresa.",
  image: "https://randomuser.me/api/portraits/women/4.jpg",
  name: "Juliana Mendes",
  role: "Empresária"
}, {
  text: "Melhor red velvet que já comi na vida! Virei cliente fiel desde a primeira encomenda.",
  image: "https://randomuser.me/api/portraits/men/5.jpg",
  name: "Lucas Ferreira",
  role: "Cliente frequente"
}, {
  text: "O bolo do chá de bebê ficou lindo demais! Delicado e saboroso, exatamente como eu imaginava.",
  image: "https://randomuser.me/api/portraits/women/6.jpg",
  name: "Amanda Rocha",
  role: "Futura mamãe"
}, {
  text: "Recomendo de olhos fechados! Qualidade premium e preço justo. O bolo de morango é divino.",
  image: "https://randomuser.me/api/portraits/men/7.jpg",
  name: "Pedro Almeida",
  role: "Confeiteiro amador"
}, {
  text: "Nunca vi um bolo de unicórnio tão perfeito! Minha filha amou cada detalhe da decoração.",
  image: "https://randomuser.me/api/portraits/women/8.jpg",
  name: "Fernanda Lima",
  role: "Mãe orgulhosa"
}, {
  text: "Atendimento via WhatsApp super prático. Tirou todas as minhas dúvidas e o resultado foi maravilhoso!",
  image: "https://randomuser.me/api/portraits/men/9.jpg",
  name: "Gustavo Ribeiro",
  role: "Cliente satisfeito"
}];
const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);
const Home = () => {
  // Substitua os URLs abaixo por vídeos MP4 dos seus bolos
  // Coloque os vídeos na pasta public/videos/ e use o caminho /videos/nome-do-video.mp4
  const cakeVideos = [{
    id: 1,
    video: "/videos/bolo-1.mp4",
    // Substitua pelo seu vídeo
    defaultPos: {
      x: 0,
      y: 0,
      w: 4,
      h: 4
    },
    corner: "",
    edgeHorizontal: "",
    edgeVertical: "",
    mediaSize: 1,
    borderThickness: 0,
    borderSize: 100,
    isHovered: false
  }, {
    id: 2,
    video: "/videos/bolo-2.mp4",
    defaultPos: {
      x: 4,
      y: 0,
      w: 4,
      h: 4
    },
    corner: "",
    edgeHorizontal: "",
    edgeVertical: "",
    mediaSize: 1,
    borderThickness: 0,
    borderSize: 100,
    isHovered: false
  }, {
    id: 3,
    video: "/videos/bolo-3.mp4",
    defaultPos: {
      x: 8,
      y: 0,
      w: 4,
      h: 4
    },
    corner: "",
    edgeHorizontal: "",
    edgeVertical: "",
    mediaSize: 1,
    borderThickness: 0,
    borderSize: 100,
    isHovered: false
  }, {
    id: 4,
    video: "/videos/bolo-4.mp4",
    defaultPos: {
      x: 0,
      y: 4,
      w: 4,
      h: 4
    },
    corner: "",
    edgeHorizontal: "",
    edgeVertical: "",
    mediaSize: 1,
    borderThickness: 0,
    borderSize: 100,
    isHovered: false
  }, {
    id: 5,
    video: "/videos/bolo-5.mp4",
    defaultPos: {
      x: 4,
      y: 4,
      w: 4,
      h: 4
    },
    corner: "",
    edgeHorizontal: "",
    edgeVertical: "",
    mediaSize: 1,
    borderThickness: 0,
    borderSize: 100,
    isHovered: false
  }, {
    id: 6,
    video: "/videos/bolo-6.mp4",
    defaultPos: {
      x: 8,
      y: 4,
      w: 4,
      h: 4
    },
    corner: "",
    edgeHorizontal: "",
    edgeVertical: "",
    mediaSize: 1,
    borderThickness: 0,
    borderSize: 100,
    isHovered: false
  }, {
    id: 7,
    video: "/videos/bolo-7.mp4",
    defaultPos: {
      x: 0,
      y: 8,
      w: 4,
      h: 4
    },
    corner: "",
    edgeHorizontal: "",
    edgeVertical: "",
    mediaSize: 1,
    borderThickness: 0,
    borderSize: 100,
    isHovered: false
  }, {
    id: 8,
    video: "/videos/bolo-8.mp4",
    defaultPos: {
      x: 4,
      y: 8,
      w: 4,
      h: 4
    },
    corner: "",
    edgeHorizontal: "",
    edgeVertical: "",
    mediaSize: 1,
    borderThickness: 0,
    borderSize: 100,
    isHovered: false
  }, {
    id: 9,
    video: "/videos/bolo-9.mp4",
    defaultPos: {
      x: 8,
      y: 8,
      w: 4,
      h: 4
    },
    corner: "",
    edgeHorizontal: "",
    edgeVertical: "",
    mediaSize: 1,
    borderThickness: 0,
    borderSize: 100,
    isHovered: false
  }];
  return <div className="min-h-screen">
      {/* Hero Section */}
      <AuroraBackground className="h-auto py-20 md:py-32">
        <motion.div initial={{
        opacity: 0.0,
        y: 40
      }} whileInView={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.3,
        duration: 0.8,
        ease: "easeInOut"
      }} className="relative z-10 container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur shadow-soft">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">
                Bolos artesanais feitos com amor
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Transforme seus momentos especiais em{' '}
              <span className="gradient-text">memórias doces</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Crie o bolo perfeito para sua celebração. Escolha sabores, recheios,
              coberturas e decorações. Cada bolo é único, assim como seu momento especial.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/catalogo">
                <Button size="lg" variant="hero" className="text-base">
                  Ver Catálogo
                </Button>
              </Link>
              <Link to="/monte-seu-bolo">
                <Button size="lg" variant="outline" className="text-base">
                  Monte Seu Bolo
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </AuroraBackground>

      {/* About Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text Content - Left Side */}
            <div className="space-y-6">
              <h2 className="text-3xl md:text-5xl font-bold">
                Feito com <span className="gradient-text">Carinho e Dedicação</span>
              </h2>
              <p className="text-lg text-muted-foreground">
                Cada bolo que criamos é uma obra de arte única, preparada artesanalmente com ingredientes 
                selecionados e muito amor. Nossa paixão é transformar seus momentos especiais em memórias 
                inesquecíveis através de sabores autênticos e decorações impecáveis.
              </p>
              <p className="text-lg text-muted-foreground">
                Utilizamos apenas ingredientes frescos e de alta qualidade, garantindo que cada mordida 
                seja uma experiência memorável. Do clássico ao contemporâneo, criamos bolos que encantam 
                os olhos e o paladar.
              </p>
              <Link to="/sobre">
                <Button variant="outline" className="mt-4">
                  Conheça Nossa História
                </Button>
              </Link>
            </div>
            
            {/* Video Grid - Right Side */}
            <div className="h-[500px] lg:h-[600px] rounded-2xl overflow-hidden shadow-elegant">
              <DynamicFrameLayout frames={cakeVideos} className="w-full h-full" hoverSize={6} gapSize={4} showFrames={false} />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.8,
          delay: 0.1,
          ease: [0.16, 1, 0.3, 1]
        }} viewport={{
          once: true
        }} className="flex flex-col items-center justify-center max-w-[540px] mx-auto mb-12">
            <div className="flex justify-center">
              <div className="border border-border py-1 px-4 rounded-lg text-sm text-muted-foreground">Por que nos escolher</div>
            </div>

            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tighter mt-5 text-center">
              Nossa <span className="gradient-text">Experiência</span>
            </h2>
            <p className="text-center mt-5 text-muted-foreground">
              Descubra o que torna nossos bolos especiais e únicos.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.5,
            delay: 0.1
          }} viewport={{
            once: true
          }}>
              <Card className="p-8 text-center space-y-4 gradient-card border-0 shadow-card hover:shadow-hover transition-smooth h-full">
                <div className="w-16 h-16 mx-auto rounded-full gradient-primary flex items-center justify-center shadow-soft">
                  <Cake className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold">Personalização Total</h3>
                <p className="text-muted-foreground">
                  Monte seu bolo do seu jeito. Escolha cada detalhe para criar algo único e especial.
                </p>
              </Card>
            </motion.div>

            <motion.div initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.5,
            delay: 0.2
          }} viewport={{
            once: true
          }}>
              <Card className="p-8 text-center space-y-4 gradient-card border-0 shadow-card hover:shadow-hover transition-smooth h-full">
                <div className="w-16 h-16 mx-auto rounded-full gradient-primary flex items-center justify-center shadow-soft">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold">Feito com Carinho</h3>
                <p className="text-muted-foreground">
                  Cada bolo é preparado artesanalmente com ingredientes selecionados e muito amor.
                </p>
              </Card>
            </motion.div>

            <motion.div initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.5,
            delay: 0.3
          }} viewport={{
            once: true
          }}>
              <Card className="p-8 text-center space-y-4 gradient-card border-0 shadow-card hover:shadow-hover transition-smooth h-full">
                <div className="w-16 h-16 mx-auto rounded-full gradient-primary flex items-center justify-center shadow-soft">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold">Pedido Simples</h3>
                <p className="text-muted-foreground">
                  Finalize seu pedido facilmente pelo WhatsApp. Rápido, prático e seguro.
                </p>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-background relative">
        <div className="container z-10 mx-auto">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.8,
          delay: 0.1,
          ease: [0.16, 1, 0.3, 1]
        }} viewport={{
          once: true
        }} className="flex flex-col items-center justify-center max-w-[540px] mx-auto">
            <div className="flex justify-center">
              <div className="border border-border py-1 px-4 rounded-lg text-sm text-muted-foreground">Depoimentos</div>
            </div>

            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tighter mt-5 text-center">
              O que nossos <span className="gradient-text">clientes</span> dizem
            </h2>
            <p className="text-center mt-5 text-muted-foreground">
              Veja os depoimentos de quem já provou nossas delícias.
            </p>
          </motion.div>

          <div className="flex justify-center gap-6 mt-10 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] max-h-[740px] overflow-hidden">
            <TestimonialsColumn testimonials={firstColumn} duration={15} />
            <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={19} />
            <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={17} />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-background relative overflow-hidden">
        
        <ConfettiParticles />
        <div className="container z-10 mx-auto px-4">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.8,
          delay: 0.1,
          ease: [0.16, 1, 0.3, 1]
        }} viewport={{
          once: true
        }} className="flex flex-col items-center justify-center max-w-[600px] mx-auto text-center">
            <div className="flex justify-center">
              <div className="border border-border py-1 px-4 rounded-lg text-sm text-muted-foreground">
                Monte seu Bolo
              </div>
            </div>

            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tighter mt-5">
              Pronto para criar seu <span className="gradient-text">bolo dos sonhos</span>?
            </h2>
            <p className="mt-5 text-muted-foreground max-w-md">
              Personalize cada detalhe e crie um bolo único para tornar seu momento ainda mais especial.
            </p>

            <motion.div initial={{
            opacity: 0,
            y: 10
          }} whileInView={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.5,
            delay: 0.3
          }} viewport={{
            once: true
          }} className="mt-8">
              <Link to="/monte-seu-bolo">
                <Button size="lg" className="text-base px-8">
                  Começar Agora
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Admin Link - Discreto */}
      <div className="fixed bottom-4 right-4 z-50">
        <Link to="/admin/login">
          <Button variant="ghost" size="sm" className="text-xs text-muted-foreground/50 hover:text-muted-foreground hover:bg-transparent">
            Admin
          </Button>
        </Link>
      </div>
    </div>;
};
export default Home;