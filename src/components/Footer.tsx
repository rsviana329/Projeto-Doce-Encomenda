import { MapPin, Phone, Clock } from 'lucide-react';
<<<<<<< HEAD

const Footer = () => {
  const settings = {
    address: 'Rua das Flores, 123 - Centro',
    phone: '(11) 99999-9999',
    email: 'contato@doceencomenda.com.br',
    opening_hours: {
      monday: { open: '09:00', close: '18:00' },
      tuesday: { open: '09:00', close: '18:00' },
      wednesday: { open: '09:00', close: '18:00' },
      thursday: { open: '09:00', close: '18:00' },
      friday: { open: '09:00', close: '18:00' },
      saturday: { open: '10:00', close: '14:00' },
      sunday: { closed: true },
    }
  };
=======
import { useBakerySettings } from '@/hooks/useBakerySettings';
import { Skeleton } from './ui/skeleton';

const Footer = () => {
  const { data: settings, isLoading } = useBakerySettings();
>>>>>>> a5f3e25425b43f1284c9f6eddb51fd037d4f240b

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
<<<<<<< HEAD
            <p className="text-muted-foreground">{settings.address}</p>
=======
            {isLoading ? (
              <Skeleton className="h-12 w-full" />
            ) : (
              <p className="text-muted-foreground">{settings?.address}</p>
            )}
>>>>>>> a5f3e25425b43f1284c9f6eddb51fd037d4f240b
          </div>

          {/* Contato */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Phone className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-lg">Contato</h3>
            </div>
<<<<<<< HEAD
            <div className="space-y-2 text-muted-foreground">
              <p>{settings.phone}</p>
              <p>{settings.email}</p>
            </div>
=======
            {isLoading ? (
              <Skeleton className="h-16 w-full" />
            ) : (
              <div className="space-y-2 text-muted-foreground">
                <p>{settings?.phone}</p>
                <p>{settings?.email}</p>
              </div>
            )}
>>>>>>> a5f3e25425b43f1284c9f6eddb51fd037d4f240b
          </div>

          {/* Horário */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-lg">Horário de Funcionamento</h3>
            </div>
<<<<<<< HEAD
            <div className="space-y-1 text-sm text-muted-foreground">
              {Object.entries(settings.opening_hours).map(([day, hours]: [string, any]) => (
                <div key={day} className="flex justify-between">
                  <span>{dayNames[day]}:</span>
                  <span>
                    {hours.closed ? 'Fechado' : `${hours.open} - ${hours.close}`}
                  </span>
                </div>
              ))}
            </div>
=======
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
>>>>>>> a5f3e25425b43f1284c9f6eddb51fd037d4f240b
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
