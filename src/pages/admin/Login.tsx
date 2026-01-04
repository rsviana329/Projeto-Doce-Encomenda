import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Cake, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAdmin } from '@/contexts/AdminContext';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { AuroraBackground } from '@/components/ui/aurora-background';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAdmin();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (login(username, password)) {
      toast.success('Login realizado com sucesso!');
      navigate('/admin/dashboard');
    } else {
      toast.error('Usuário ou senha incorretos');
    }
  };

  return (
    <AuroraBackground className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-md relative z-10"
      >
        {/* Botão Voltar */}
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Voltar ao site</span>
        </Link>

        <Card className="w-full shadow-elegant border-0 bg-background/95 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4 pb-2">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="w-20 h-20 mx-auto rounded-full gradient-primary flex items-center justify-center shadow-soft"
            >
              <Cake className="w-10 h-10 text-white" />
            </motion.div>
            <div className="space-y-1">
              <CardTitle className="text-2xl font-bold">Área Administrativa</CardTitle>
              <p className="text-sm text-muted-foreground">
                Gerencie seus produtos, pedidos e opções
              </p>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium">
                  Usuário
                </Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Digite seu usuário"
                  className="h-11 bg-muted/50 border-border/50 focus:border-primary/50"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Senha
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite sua senha"
                  className="h-11 bg-muted/50 border-border/50 focus:border-primary/50"
                  required
                />
              </div>

              <Button 
                type="submit" 
                size="lg" 
                className="w-full h-12 text-base font-medium gradient-primary hover:opacity-90 transition-all hover:scale-[1.02] hover:-translate-y-0.5"
              >
                <Lock className="w-5 h-5 mr-2" />
                Entrar
              </Button>
            </form>

            <div className="mt-6 p-4 rounded-xl bg-muted/30 border border-border/50">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Credenciais padrão
              </p>
              <div className="space-y-1 text-sm">
                <p className="flex items-center justify-between">
                  <span className="text-muted-foreground">Usuário:</span>
                  <code className="px-2 py-0.5 rounded bg-primary/10 text-primary font-mono text-xs">admin</code>
                </p>
                <p className="flex items-center justify-between">
                  <span className="text-muted-foreground">Senha:</span>
                  <code className="px-2 py-0.5 rounded bg-primary/10 text-primary font-mono text-xs">doce123</code>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground/60 mt-6">
          Doce Momento © {new Date().getFullYear()}
        </p>
      </motion.div>
    </AuroraBackground>
  );
};

export default Login;
