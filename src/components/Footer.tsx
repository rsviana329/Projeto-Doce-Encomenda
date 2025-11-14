import { MapPin, Phone, Clock } from 'lucide-react';
import { useBakerySettings } from '@/hooks/useBakerySettings';
import { Skeleton } from './ui/skeleton';

const Footer = () => {
  const { data: settings, isLoading } = useBakerySettings();

  const dayNames: { [key: string]: string } = {
    monday: 'Segunda',
    tuesday: 'Terça',
    wednesday: 'Quarta',
    thursday: 'Quinta',
    friday: 'Sexta',
    saturday: 'Sábado',
    sunday: 'Domingo',
  };

  return (
    <footer className="border-t border-border/40 bg-muted/30 mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Localização */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-lg">Localização</h3>
            </div>
            {isLoading ? (
              <Skeleton className="h-12 w-full" />
            ) : (
              <p className="text-muted-foreground">{settings?.address}</p>
            )}
          </div>

          {/* Contato */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Phone className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-lg">Contato</h3>
            </div>
            {isLoading ? (
              <Skeleton className="h-16 w-full" />
            ) : (
              <div className="space-y-2 text-muted-foreground">
                <p>{settings?.phone}</p>
                <p>{settings?.email}</p>
              </div>
            )}
          </div>

          {/* Horário */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-lg">Horário de Funcionamento</h3>
            </div>
            {isLoading ? (
              <Skeleton className="h-32 w-full" />
            ) : (
              <div className="space-y-1 text-sm text-muted-foreground">
                {settings?.opening_hours &&
                  Object.entries(settings.opening_hours).map(([day, hours]) => (
                    <div key={day} className="flex justify-between">
                      <span>{dayNames[day]}:</span>
                      <span>
                        {hours.closed ? 'Fechado' : `${hours.open} - ${hours.close}`}
                      </span>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border/40 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Doce Encomenda. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
