import { useState } from 'react';
import { motion } from 'framer-motion';
import { LogIn, Eye, EyeOff, Shield, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAdminStore } from '../../stores';
import { authApi } from '../../services/api';
import Button from '../../components/ui/Button';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAdminStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await authApi.login(email, password);
      login(data.access_token);
      navigate('/admin');
    } catch (err) {
      setError(err.message || 'Credenciais inválidas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-primary)] p-4">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[var(--color-primary)]/10 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="w-full max-w-md relative"
      >
        <div className="card p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)]
              flex items-center justify-center shadow-lg">
              <Shield size={24} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Admin Panel</h1>
            <p className="text-sm text-[var(--color-text-tertiary)] mt-1">Acesse o painel de gerenciamento</p>
          </div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-sm text-[var(--color-error)] bg-[var(--color-error)]/10 p-3 rounded-xl mb-6"
            >
              <AlertCircle size={16} />
              {error}
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="admin-email" className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                Email
              </label>
              <input
                id="admin-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)]
                  text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)]
                  focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]
                  outline-none transition-all text-sm"
                placeholder="admin@email.com"
              />
            </div>

            <div>
              <label htmlFor="admin-password" className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                Senha
              </label>
              <div className="relative">
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)]
                    text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)]
                    focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]
                    outline-none transition-all text-sm"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              icon={LogIn}
              className="w-full"
              loading={loading}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>

          {/* Back link */}
          <div className="text-center mt-6">
            <a
              href="/"
              className="text-xs text-[var(--color-text-tertiary)] hover:text-[var(--color-primary)] transition-colors"
            >
              ← Voltar ao portfolio
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
