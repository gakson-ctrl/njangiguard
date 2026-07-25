'use client';
import { useState, useEffect } from 'react';
import { mockUser, mockTransactions, mockSuspiciousTxn, mockSmsQueue } from '../lib/mockData';
import { analyzeTransaction } from '../lib/aiEngine';
import { scanSms } from '../lib/smsScanner';

const alertResult = analyzeTransaction(mockSuspiciousTxn, mockUser);
const scannedSms = mockSmsQueue.map((msg) => ({ ...msg, result: scanSms(msg.text) }));

const SCREENS = [
  { key: 'home',     label: 'HomeScreen',     bg: '#E8F5EE', color: '#1B7A43' },
  { key: 'cooldown', label: 'CooldownScreen', bg: '#FFF3E0', color: '#F57C00' },
  { key: 'freeze',   label: 'FreezeScreen',   bg: '#FFEBEE', color: '#D32F2F' },
  { key: 'sms',      label: 'SmsScreen',      bg: '#E3F2FD', color: '#1565C0' },
  { key: 'alert',    label: 'AlertScreen',    bg: '#FCE4EC', color: '#AD1457' },
];

function fmt(n) {
  return n.toLocaleString('fr-FR');
}

// ─── HomeScreen ───────────────────────────────────────────────────────────────

function HomeScreen() {
  return (
    <div className="flex flex-col" style={{ backgroundColor: '#F5F5F5', minHeight: '100%' }}>
      <div className="bg-white border-b border-gray-100 px-5 pt-5 pb-4 flex-shrink-0">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <span className="text-xl font-extrabold" style={{ color: '#1B7A43' }}>NjangiGuard</span>
            <span className="text-xl leading-none">🛡</span>
          </div>
          <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
            <span className="text-xl">🔔</span>
          </button>
        </div>
        <p className="text-sm font-semibold" style={{ color: '#555' }}>{mockUser.name}</p>
      </div>

      <div className="flex-1 p-4 flex flex-col gap-3">
        <div
          className="rounded-2xl p-5 text-white relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg,#1B7A43 0%,#145C32 55%,#0D3D20 100%)' }}
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-0.5" style={{ opacity: 0.65 }}>COMPTE PRINCIPAL</p>
              <p className="text-xs" style={{ opacity: 0.5 }}>MTN Mobile Money</p>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full flex-shrink-0"
              style={{ backgroundColor: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)' }}>
              Protégé ✓
            </span>
          </div>
          <p className="text-3xl font-black tracking-tight leading-none mb-1">
            {fmt(mockUser.mainBalance)}{' '}
            <span className="text-base font-semibold" style={{ opacity: 0.7 }}>XAF</span>
          </p>
          <p className="text-xs" style={{ opacity: 0.45 }}>Mis à jour aujourd&apos;hui</p>
        </div>

        <div className="bg-white rounded-2xl p-5" style={{ border: '1px solid #D4EAD9' }}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#888' }}>SOLDE DÉPENSES ISOLÉ</p>
              <p className="text-2xl font-black leading-none" style={{ color: '#1A1A1A' }}>
                {fmt(mockUser.spendingBalance)}{' '}
                <span className="text-sm font-semibold" style={{ color: '#888' }}>XAF</span>
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
              style={{ backgroundColor: '#E8F5EE' }}>🔒</div>
          </div>
          <div className="rounded-xl px-3 py-2 flex items-center gap-2" style={{ backgroundColor: '#E8F5EE' }}>
            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: '#1B7A43' }} />
            <p className="text-xs font-bold" style={{ color: '#1B7A43' }}>Séparé du compte principal · Transferts limités</p>
          </div>
        </div>

        <div className="flex">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold text-white"
            style={{ backgroundColor: '#1B7A43' }}>
            <span>🛡</span>
            <span>Score de Risque: FAIBLE — {mockUser.riskScore} / 100</span>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between px-1 mb-2">
            <h2 className="font-bold text-base" style={{ color: '#1A1A1A' }}>Activité Récente</h2>
            <span className="text-xs font-semibold" style={{ color: '#1B7A43' }}>Voir tout →</span>
          </div>
          <div className="flex flex-col gap-2">
            {mockTransactions.map((txn) => {
              const isIncoming = txn.type === 'reçu';
              return (
                <div key={txn.id} className="bg-white rounded-2xl px-4 py-3 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                    style={{ backgroundColor: isIncoming ? '#E8F5EE' : '#FFF3E0' }}>
                    {isIncoming ? '📲' : '💸'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate" style={{ color: '#1A1A1A' }}>
                      {isIncoming ? txn.from : txn.to}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: '#999' }}>{txn.time}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-sm" style={{ color: isIncoming ? '#1B7A43' : '#D32F2F' }}>
                      {isIncoming ? '+' : '−'}{fmt(txn.amount)} XAF
                    </p>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-md"
                      style={{ color: isIncoming ? '#1B7A43' : '#F57C00', backgroundColor: isIncoming ? '#E8F5EE' : '#FFF3E0' }}>
                      Vérifié ✓
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Alert Modal ──────────────────────────────────────────────────────────────

function AlertModal({ setScreen }) {
  return (
    <div
      className="fixed inset-x-0 top-0 z-[100] flex flex-col items-center justify-center px-4 py-6 overflow-y-auto"
      style={{ bottom: '64px', backgroundColor: 'rgba(211,47,47,0.10)', backdropFilter: 'blur(3px)' }}
    >
      <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl" style={{ border: '1px solid #FFCDD2' }}>
        <div className="flex justify-center mb-4">
          <span className="text-5xl animate-pulse" style={{ filter: 'hue-rotate(120deg) saturate(2)' }}>🛡</span>
        </div>
        <h2 className="text-xl font-extrabold text-center mb-4" style={{ color: '#1A1A1A' }}>
          ⚠️ Transfert Suspect Détecté
        </h2>
        <div className="rounded-2xl p-4 mb-3" style={{ backgroundColor: '#FFEBEE' }}>
          <p className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: '#D32F2F' }}>
            Motifs détectés par NjangiGuard AI:
          </p>
          {alertResult.reasons.map((reason, i) => (
            <p key={i} className="text-sm font-semibold mb-1.5 flex items-start gap-1.5" style={{ color: '#C62828' }}>
              <span className="flex-shrink-0">✗</span><span>{reason}</span>
            </p>
          ))}
        </div>
        <p className="text-center font-black text-base mb-3" style={{ color: '#D32F2F' }}>
          Score de risque: {alertResult.score} / 100 — {alertResult.level}
        </p>
        <div className="rounded-xl px-4 py-3 mb-4 text-center"
          style={{ backgroundColor: '#F5F5F5', border: '1px solid #E0E0E0' }}>
          <p className="text-sm font-semibold" style={{ color: '#1A1A1A' }}>
            Tentative: {fmt(mockSuspiciousTxn.amount)} XAF → {mockSuspiciousTxn.recipient}
          </p>
        </div>
        <div className="flex gap-3 mb-3">
          <button className="flex-1 py-3 rounded-xl text-sm font-bold text-white"
            style={{ backgroundColor: '#1B7A43' }} onClick={() => setScreen('home')}>
            ✅ C&apos;est moi, continuer
          </button>
          <button className="flex-1 py-3 rounded-xl text-sm font-bold text-white"
            style={{ backgroundColor: '#D32F2F' }} onClick={() => setScreen('freeze')}>
            🚫 Annuler &amp; Geler
          </button>
        </div>
        <p className="text-xs text-center" style={{ color: '#999' }}>
          Cette vérification est gratuite. NjangiGuard protège votre argent.
        </p>
      </div>
    </div>
  );
}

// ─── Cooldown Screen ──────────────────────────────────────────────────────────

function CooldownScreen() {
  const [seconds, setSeconds] = useState(600);

  useEffect(() => {
    const id = setInterval(() => {
      setSeconds((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');
  const isExpired = seconds === 0;

  return (
    <div className="flex flex-col" style={{ backgroundColor: '#FFFDF5', minHeight: '100%' }}>

      {/* Warning banner */}
      <div className="px-5 pt-5 pb-4 flex items-center gap-3" style={{ backgroundColor: '#F57C00' }}>
        <span className="text-2xl">⚠️</span>
        <div>
          <p className="text-white font-extrabold text-lg leading-tight">Nouveau Destinataire</p>
          <p className="text-white text-xs font-semibold" style={{ opacity: 0.85 }}>Protection NjangiGuard activée</p>
        </div>
      </div>

      <div className="flex-1 p-4 flex flex-col gap-4">

        {/* Recipient info card */}
        <div className="bg-white rounded-2xl px-5 py-4 flex items-center gap-3"
          style={{ border: '1px solid #FFE0B2' }}>
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
            style={{ backgroundColor: '#FFF3E0' }}>👤</div>
          <div>
            <p className="font-bold text-base" style={{ color: '#1A1A1A' }}>+237 677 XX XX XX</p>
            <p className="text-xs font-semibold mt-0.5" style={{ color: '#F57C00' }}>Premier transfert vers ce numéro</p>
          </div>
        </div>

        {/* Protection info box */}
        <div className="rounded-2xl p-4" style={{ backgroundColor: '#FFF3E0', border: '1px solid #FFE0B2' }}>
          <p className="text-sm font-bold mb-3" style={{ color: '#E65100' }}>Protection NjangiGuard Active:</p>
          <div className="flex flex-col gap-2">
            {[
              'Limite aujourd\'hui: 5 000 XAF (premier transfert)',
              'Délai de confirmation: 10 minutes',
              '73% des arnaques MoMo ciblent les nouveaux destinataires',
            ].map((line, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-sm flex-shrink-0" style={{ color: '#F57C00' }}>•</span>
                <p className="text-sm font-semibold" style={{ color: '#BF360C' }}>{line}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Countdown */}
        <div className="flex flex-col items-center py-4">
          <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#999' }}>
            {isExpired ? 'Délai expiré' : 'Confirmation dans'}
          </p>
          <p className="text-6xl font-black tabular-nums"
            style={{ color: isExpired ? '#1B7A43' : '#F57C00', fontVariantNumeric: 'tabular-nums' }}>
            {mm}:{ss}
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          <button className="flex-1 py-3 rounded-xl text-sm font-bold"
            style={{ backgroundColor: '#F0F0F0', color: '#555' }}>
            Annuler
          </button>
          <button className="flex-1 py-3 rounded-xl text-sm font-bold text-white"
            style={{ backgroundColor: '#F57C00' }}>
            Confirmer quand même (risque)
          </button>
        </div>

        {/* Trust link */}
        <p className="text-center text-sm font-semibold" style={{ color: '#F57C00' }}>
          Ajouter à mes contacts de confiance →
        </p>

      </div>
    </div>
  );
}

// ─── Freeze Screen ────────────────────────────────────────────────────────────

function FreezeScreen() {
  const [frozen, setFrozen] = useState(false);
  const [freezeTime, setFreezeTime] = useState('');

  const handleFreeze = () => {
    const now = new Date();
    const day = now.getDate();
    const month = now.toLocaleDateString('fr-FR', { month: 'long' });
    const year = now.getFullYear();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const sec = String(now.getSeconds()).padStart(2, '0');
    setFreezeTime(`${day} ${month} ${year} — ${hh}:${mm}:${sec}`);
    setFrozen(true);
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6 px-6 py-10"
      style={{ backgroundColor: '#1A1A1A', minHeight: '100%' }}>

      {/* Shield with red circle */}
      <div className="w-28 h-28 rounded-full flex items-center justify-center text-5xl flex-shrink-0"
        style={{
          backgroundColor: frozen ? '#1B5E20' : '#D32F2F',
          boxShadow: frozen
            ? '0 0 48px rgba(27,94,32,0.55)'
            : '0 0 48px rgba(211,47,47,0.55)',
        }}>
        🛡
      </div>

      {!frozen ? (
        <>
          {/* Pre-freeze */}
          <div className="text-center">
            <p className="text-white font-extrabold text-xl mb-2">Geler mon compte</p>
            <p className="text-sm font-semibold text-center" style={{ color: '#999', maxWidth: 280 }}>
              En cas de vol ou de contrainte, gelez votre compte immédiatement
            </p>
          </div>

          <button
            onClick={handleFreeze}
            className="w-full max-w-xs py-5 rounded-2xl text-white font-extrabold text-lg tracking-wide transition-transform active:scale-95"
            style={{ backgroundColor: '#D32F2F', boxShadow: '0 6px 24px rgba(211,47,47,0.5)' }}
          >
            🔴 GELER MON COMPTE
          </button>

          {/* USSD box */}
          <div className="w-full max-w-xs rounded-2xl px-5 py-4" style={{ backgroundColor: '#1A237E' }}>
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.55)' }}>
              Code USSD
            </p>
            <p className="text-white text-sm leading-relaxed font-mono">
              Sans smartphone: composez 126# (MTN) ou #150# (Orange) → menu Mon Compte → NjangiGuard
            </p>
          </div>
        </>
      ) : (
        <>
          {/* Post-freeze */}
          <div className="text-center">
            <p className="text-5xl mb-3">✅</p>
            <p className="text-white font-extrabold text-xl mb-1">Compte gelé avec succès</p>
            <p className="text-sm font-semibold" style={{ color: '#888' }}>{freezeTime}</p>
          </div>

          <div className="w-full max-w-xs rounded-2xl px-4 py-4 text-center"
            style={{ backgroundColor: '#2A2A2A', border: '1px solid #333' }}>
            <p className="text-sm font-semibold text-white">Toutes les transactions ont été suspendues</p>
          </div>

          <div className="flex flex-col gap-3 w-full max-w-xs">
            <button className="py-3 rounded-xl font-bold text-sm transition-opacity hover:opacity-80"
              style={{ border: '2px solid #1B7A43', color: '#4CAF50', backgroundColor: 'transparent' }}>
              Contacter Support
            </button>
            <button
              onClick={() => alert('Saisissez votre PIN')}
              className="py-3 rounded-xl font-bold text-sm"
              style={{ backgroundColor: '#2A2A2A', color: '#666', border: '1px solid #333' }}>
              Dégeler mon compte
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ─── SMS Screen ───────────────────────────────────────────────────────────────

function SmsScreen() {
  const [filter, setFilter] = useState('tous');

  const visible = filter === 'suspects'
    ? scannedSms.filter((m) => m.result.score >= 40)
    : filter === 'sûrs'
    ? scannedSms.filter((m) => m.result.score < 40)
    : scannedSms;

  return (
    <div className="flex flex-col" style={{ backgroundColor: '#F5F5F5', minHeight: '100%' }}>

      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-5 pt-5 pb-4 flex-shrink-0">
        <h1 className="text-xl font-extrabold" style={{ color: '#1A1A1A' }}>📩 Détection SMS Frauduleux</h1>
        <p className="text-xs font-semibold mt-0.5" style={{ color: '#888' }}>
          NjangiGuard analyse vos messages en temps réel
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 px-4 py-3 bg-white border-b border-gray-100 flex-shrink-0">
        {['tous', 'suspects', 'sûrs'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className="px-4 py-1.5 rounded-full text-sm font-bold capitalize transition-all"
            style={
              filter === tab
                ? { backgroundColor: '#1B7A43', color: '#fff' }
                : { backgroundColor: '#F0F0F0', color: '#555' }
            }
          >
            {tab === 'tous' ? 'Tous' : tab === 'suspects' ? 'Suspects' : 'Sûrs'}
          </button>
        ))}
      </div>

      {/* SMS card list */}
      <div className="flex-1 p-4 flex flex-col gap-3">
        {visible.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 gap-2">
            <span className="text-4xl">✅</span>
            <p className="font-semibold text-sm" style={{ color: '#888' }}>Aucun message dans cette catégorie</p>
          </div>
        )}

        {visible.map((msg) => {
          const { result } = msg;
          const isArnaque = result.score >= 70;
          const isSuspect = result.score >= 40 && result.score < 70;
          const isSafe    = result.score < 40;

          const accent    = isArnaque ? '#D32F2F' : isSuspect ? '#F57C00' : '#1B7A43';
          const accentBg  = isArnaque ? '#FFEBEE' : isSuspect ? '#FFF3E0' : '#E8F5EE';
          const icon      = isArnaque ? '🚨' : isSuspect ? '⚠️' : '✅';

          return (
            <div key={msg.id} className="bg-white rounded-2xl p-4"
              style={{ border: `1px solid ${accentBg}` }}>

              {/* Sender row */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm flex-shrink-0"
                    style={{ backgroundColor: accentBg }}>
                    {icon}
                  </div>
                  <p className="font-bold text-sm" style={{ color: '#1A1A1A' }}>{msg.sender}</p>
                </div>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: accentBg, color: accent }}>
                  {result.score}/100
                </span>
              </div>

              {/* Message preview — 2-line clamp */}
              <p className="text-sm mb-3 line-clamp-2" style={{ color: '#555' }}>{msg.text}</p>

              {/* AI verdict chip */}
              <div className="rounded-xl px-3 py-2 mb-3" style={{ backgroundColor: accentBg }}>
                <p className="text-xs font-bold" style={{ color: accent }}>
                  NjangiGuard AI: {isSafe ? '✅' : '⚠️'} {result.level} (Score: {result.score}/100)
                </p>
                {result.flags.length > 0 && (
                  <p className="text-xs mt-0.5" style={{ color: accent, opacity: 0.75 }}>
                    Motifs: {result.flags.join(', ')}
                  </p>
                )}
              </div>

              {/* Action buttons by risk tier */}
              {isArnaque && (
                <div className="flex gap-2">
                  <button className="flex-1 py-2 rounded-xl text-xs font-bold text-white"
                    style={{ backgroundColor: '#D32F2F' }}>Signaler</button>
                  <button className="flex-1 py-2 rounded-xl text-xs font-bold text-white"
                    style={{ backgroundColor: '#1A1A1A' }}>Bloquer</button>
                  <button className="flex-1 py-2 rounded-xl text-xs font-bold"
                    style={{ backgroundColor: '#F0F0F0', color: '#555' }}>Ignorer</button>
                </div>
              )}
              {isSuspect && (
                <div className="flex gap-2">
                  <button className="flex-1 py-2 rounded-xl text-xs font-bold text-white"
                    style={{ backgroundColor: '#F57C00' }}>Vérifier sur mtn.cm</button>
                  <button className="flex-1 py-2 rounded-xl text-xs font-bold"
                    style={{ backgroundColor: '#F0F0F0', color: '#555' }}>Ignorer</button>
                </div>
              )}
              {isSafe && (
                <div className="flex">
                  <span className="text-xs font-bold px-3 py-1.5 rounded-full"
                    style={{ backgroundColor: '#E8F5EE', color: '#1B7A43' }}>✅ Sûr</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Placeholder Screen ───────────────────────────────────────────────────────

function PlaceholderScreen({ screenKey }) {
  const s = SCREENS.find((x) => x.key === screenKey);
  return (
    <div className="flex flex-col items-center justify-center gap-4"
      style={{ backgroundColor: s.bg, minHeight: '60vh' }}>
      <p className="text-xs font-bold uppercase tracking-widest opacity-40" style={{ color: s.color }}>
        NjangiGuard · placeholder
      </p>
      <h1 className="text-5xl font-extrabold" style={{ color: s.color }}>{s.label}</h1>
      <code className="text-sm px-3 py-1 rounded-full font-mono opacity-60"
        style={{ background: s.color + '22', color: s.color }}>
        screen = &quot;{screenKey}&quot;
      </code>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Page() {
  const [screen, setScreen] = useState('home');

  const showHome = screen === 'home' || screen === 'alert';

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F5F5F5' }}>

      <div className="flex-1 pb-16">
        {showHome                  && <HomeScreen />}
        {screen === 'cooldown'     && <CooldownScreen />}
        {screen === 'freeze'       && <FreezeScreen />}
        {screen === 'sms'          && <SmsScreen />}
      </div>

      {screen === 'alert' && <AlertModal setScreen={setScreen} />}

      <div className="fixed bottom-0 inset-x-0 z-[200] bg-white border-t border-gray-200 flex flex-wrap gap-2 justify-center px-4 py-3">
        {SCREENS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setScreen(key)}
            className="px-4 py-2 rounded-lg text-sm font-semibold transition-all"
            style={
              screen === key
                ? { backgroundColor: '#1B7A43', color: '#fff', boxShadow: '0 2px 8px rgba(27,122,67,0.35)' }
                : { backgroundColor: '#F0F0F0', color: '#555' }
            }
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
