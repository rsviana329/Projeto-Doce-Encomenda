import { FaInstagram, FaFacebook, FaWhatsapp } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
  const sections = [
    {
      title: "Navegação",
      links: [
        { name: "Início", href: "/" },
        { name: "Catálogo", href: "/catalogo" },
        { name: "Monte seu Bolo", href: "/monte-seu-bolo" },
        { name: "Sobre Nós", href: "/sobre" },
      ],
    },
    {
      title: "Atendimento",
      links: [
        { name: "Segunda a Sexta: 09h - 18h", href: "#" },
        { name: "Sábado: 10h - 14h", href: "#" },
        { name: "Domingo: Fechado", href: "#" },
      ],
    },
    {
      title: "Contato",
      links: [
        { name: "(11) 99999-9999", href: "tel:+5511999999999" },
        { name: "contato@doceencomenda.com.br", href: "mailto:contato@doceencomenda.com.br" },
        { name: "Rua das Flores, 123 - Centro", href: "#" },
      ],
    },
  ];

  const socialLinks = [
    { icon: <FaInstagram className="size-5" />, href: "#", label: "Instagram" },
    { icon: <FaFacebook className="size-5" />, href: "#", label: "Facebook" },
    { icon: <FaWhatsapp className="size-5" />, href: "#", label: "WhatsApp" },
  ];

  const legalLinks = [
    { name: "Termos de Uso", href: "#" },
    { name: "Política de Privacidade", href: "#" },
  ];

  return (
    <footer className="py-16 bg-muted/30 border-t border-border/40">
      <div className="container mx-auto px-4">
        <div className="flex w-full flex-col justify-between gap-10 lg:flex-row lg:items-start lg:text-left">
          <div className="flex w-full flex-col justify-between gap-6 lg:items-start">
            {/* Logo */}
            <div className="flex items-center gap-2 lg:justify-start">
              <Link to="/">
                <span className="text-2xl">🎂</span>
              </Link>
              <h2 className="text-xl font-semibold gradient-text">Doce Encomenda</h2>
            </div>
            <p className="max-w-[70%] text-sm text-muted-foreground">
              Bolos artesanais feitos com amor e dedicação. Transformamos momentos especiais em memórias doces e inesquecíveis.
            </p>
            <ul className="flex items-center space-x-6 text-muted-foreground">
              {socialLinks.map((social, idx) => (
                <li key={idx} className="font-medium hover:text-primary transition-colors">
                  <a href={social.href} aria-label={social.label}>
                    {social.icon}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="grid w-full gap-6 md:grid-cols-3 lg:gap-20">
            {sections.map((section, sectionIdx) => (
              <div key={sectionIdx}>
                <h3 className="mb-4 font-bold text-foreground">{section.title}</h3>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  {section.links.map((link, linkIdx) => (
                    <li
                      key={linkIdx}
                      className="font-medium hover:text-primary transition-colors"
                    >
                      {link.href.startsWith('/') ? (
                        <Link to={link.href}>{link.name}</Link>
                      ) : (
                        <a href={link.href}>{link.name}</a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-8 flex flex-col justify-between gap-4 border-t border-border/40 py-8 text-xs font-medium text-muted-foreground md:flex-row md:items-center md:text-left">
          <p className="order-2 lg:order-1">© {new Date().getFullYear()} Doce Encomenda. Todos os direitos reservados.</p>
          <ul className="order-1 flex flex-col gap-2 md:order-2 md:flex-row md:gap-4">
            {legalLinks.map((link, idx) => (
              <li key={idx} className="hover:text-primary transition-colors">
                <a href={link.href}>{link.name}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
