export const mockUser = {
  name: "Amina Bello",
  phone: "+237 698 XX XX XX",
  location: "Yaoundé, Cameroun",
  mainBalance: 245000,
  spendingBalance: 15000,
  dailyLimit: 25000,
  avgMonthlyTxn: 35000,
  avgTxnAmount: 8500,
  riskScore: 8,
  accountStatus: "ACTIF",
};

export const mockTransactions = [
  { id: 1, type: "reçu",   amount: 50000, from: "Jean-Paul K.",  time: "Aujourd'hui, 11:20", status: "safe" },
  { id: 2, type: "envoyé", amount: 5000,  to:   "Marché Central", time: "Hier, 09:15",        status: "safe" },
  { id: 3, type: "reçu",   amount: 12000, from: "MTN-Airtime",   time: "22 juil., 16:44",     status: "safe" },
];

export const mockSuspiciousTxn = {
  amount: 180000,
  recipient: "+237 699 XX XX XX",
  hour: 2,
  minute: 47,
  isNewRecipient: true,
  rapidCount: 0,
  windowMinutes: 0,
};

export const mockSmsQueue = [
  {
    id: 1,
    sender: "+237 655 XX XX XX",
    text: "Félicitations! Vous avez gagné 500.000 XAF. Envoyez 2.000 XAF de frais au 677XXXXXX pour recevoir votre prix. Code: WIN2026",
  },
  {
    id: 2,
    sender: "MTN-MOMO",
    text: "Votre compte a été suspendu. Cliquez: bit.ly/mtn-verify-cm pour réactiver",
  },
  {
    id: 3,
    sender: "ORANGE-CM",
    text: "Transaction confirmée: 5.000 XAF reçus de +237 699 XX XX XX. Solde: 15.000 XAF",
  },
];
