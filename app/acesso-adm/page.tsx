'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const router = useRouter();
  const [erro, setErro] = useState('');

  async function entrar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const credentials = {
      email: String(form.get('email') ?? ''),
      password: String(form.get('password') ?? ''),
    };
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    if (response.ok) {
      router.push('/admin');
    } else {
      const result = (await response.json()) as { error?: string };
      setErro(result.error ?? 'Não foi possível entrar.');
    }
  }

  return (
    <form onSubmit={entrar} className="mx-auto mt-20 max-w-sm space-y-4 border border-ink/15 bg-white p-8">
      <h1 className="font-display text-3xl">Acesso administrativo</h1>
      <input name="email" type="email" required placeholder="E-mail" className="w-full border border-ink/30 p-3" />
      <input name="password" type="password" required placeholder="Senha" className="w-full border border-ink/30 p-3" />
      {erro && <p className="text-sm font-semibold text-alarm">{erro}</p>}
      <button className="w-full bg-sun py-3 font-bold hover:brightness-95">Entrar</button>
    </form>
  );
}
