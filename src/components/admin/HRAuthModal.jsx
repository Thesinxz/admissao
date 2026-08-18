import React, { useState } from 'react';
import { Lock, Eye, EyeOff, ShieldCheck, AlertCircle, ArrowLeft, KeyRound } from 'lucide-react';

const DEFAULT_PASSWORD = "rh1234";

export default function HRAuthModal({ onAuthenticated, onCancel }) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [currentPwdInput, setCurrentPwdInput] = useState('');
  const [newPwdInput, setNewPwdInput] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const getSavedPassword = () => {
    return localStorage.getItem('rh_access_password') || DEFAULT_PASSWORD;
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const correctPassword = getSavedPassword();
    
    if (password === correctPassword) {
      setError('');
      onAuthenticated();
    } else {
      setError('Senha incorreta. Acesso restrito aos administradores do RH.');
    }
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    const correctPassword = getSavedPassword();

    if (currentPwdInput !== correctPassword) {
      setError('A senha atual está incorreta.');
      return;
    }

    if (newPwdInput.length < 4) {
      setError('A nova senha deve conter pelo menos 4 caracteres.');
      return;
    }

    localStorage.setItem('rh_access_password', newPwdInput);
    setSuccessMsg('Senha alterada com sucesso! Utilize-a para entrar.');
    setIsChangingPassword(false);
    setCurrentPwdInput('');
    setNewPwdInput('');
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200">
        
        {/* Top Header */}
        <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-6 text-center relative">
          <button
            type="button"
            onClick={onCancel}
            className="absolute left-4 top-4 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 transition-colors"
            title="Voltar"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="w-14 h-14 rounded-2xl bg-indigo-600/30 border border-indigo-400/30 flex items-center justify-center mx-auto mb-3 shadow-inner">
            <Lock className="w-7 h-7 text-indigo-400" />
          </div>

          <h3 className="text-lg font-bold">Área Restrita do RH</h3>
          <p className="text-xs text-slate-300 mt-1 max-w-xs mx-auto">
            Acesso protegido por senha para privacidade dos dados dos funcionários.
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          {successMsg && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center space-x-2 animate-shake">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {!isChangingPassword ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Senha de Acesso do RH
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Digite a senha do RH"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError('');
                    }}
                    autoFocus
                    className="w-full pl-4 pr-11 py-3 rounded-xl border border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none text-slate-900 text-sm font-medium transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <div className="flex justify-end items-center mt-1.5 text-[11px] text-slate-400">
                  <button
                    type="button"
                    onClick={() => {
                      setIsChangingPassword(true);
                      setError('');
                    }}
                    className="text-indigo-600 hover:underline font-medium"
                  >
                    Alterar Senha de Acesso
                  </button>
                </div>
              </div>

              <div className="pt-2 flex items-center space-x-3">
                <button
                  type="button"
                  onClick={onCancel}
                  className="flex-1 py-3 px-4 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-bold shadow-md shadow-indigo-600/25 transition-all"
                >
                  Entrar no Painel
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleChangePassword} className="space-y-4">
              <h4 className="font-bold text-slate-800 text-sm flex items-center">
                <KeyRound className="w-4 h-4 mr-1.5 text-indigo-600" />
                Alterar Senha do RH
              </h4>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Senha Atual
                </label>
                <input
                  type="password"
                  placeholder="Senha atual (ex: rh1234)"
                  value={currentPwdInput}
                  onChange={(e) => setCurrentPwdInput(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-600 outline-none text-slate-900 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Nova Senha
                </label>
                <input
                  type="password"
                  placeholder="Mínimo 4 caracteres"
                  value={newPwdInput}
                  onChange={(e) => setNewPwdInput(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-600 outline-none text-slate-900 text-sm"
                />
              </div>

              <div className="pt-2 flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => setIsChangingPassword(false)}
                  className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-colors"
                >
                  Voltar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow transition-all"
                >
                  Salvar Nova Senha
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
