import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Cake } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAdmin } from '@/contexts/AdminContext';
import { toast } from 'sonner';

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
    <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-card border-0">
        <CardHeader className="text-center space-y-4">
          <div className="w-20 h-20 mx-auto rounded-full gradient-primary flex items-center justify-center shadow-soft">
            <Cake className="w-10 h-10 text-white" />
          </div>
          <CardTitle className="text-2xl">Área Administrativa</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="username">Usuário</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Digite seu usuário"
                required
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha"
                required
              />
            </div>

            <Button type="submit" variant="hero" size="lg" className="w-full">
              <Lock className="w-5 h-5 mr-2" />
              Entrar
            </Button>
          </form>

          <Card className="mt-6 bg-muted/50 border-primary/20">
            <CardContent className="p-4 text-sm space-y-2">
              <p className="font-semibold">Credenciais padrão:</p>
              <p>
                <span className="font-medium">Usuário:</span> admin
              </p>
              <p>
                <span className="font-medium">Senha:</span> doce123
              </p>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
