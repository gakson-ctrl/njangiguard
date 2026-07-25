// NjangiGuard AI Engine — rules-based MVP (honest representation of ML logic)

const RISK_RULES = {
  unusualAmount: (amount, avgAmount) => {
    const ratio = amount / avgAmount;
    if (ratio > 10) return { flag: true, score: 49, reason: "Montant inhabituel (+340% vs. moyenne)" };
    if (ratio > 3)  return { flag: true, score: 40, reason: "Montant inhabituel (+300% vs. moyenne)" };
    if (ratio > 2)  return { flag: true, score: 20, reason: "Montant élevé (+200% vs. moyenne)" };
    return { flag: false, score: 0 };
  },
  unusualTime: (hour, minute = 0) => {
    if (hour >= 0 && hour < 5) {
      const t = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
      return { flag: true, score: 25, reason: `Heure anormale (${t})` };
    }
    if (hour >= 22 || hour < 7) return { flag: true, score: 10, reason: "Heure inhabituelle" };
    return { flag: false, score: 0 };
  },
  newRecipient: (isNew) => {
    if (isNew) return { flag: true, score: 20, reason: "Nouveau destinataire inconnu" };
    return { flag: false, score: 0 };
  },
  rapidSuccession: (txnCount, windowMinutes) => {
    if (txnCount >= 3 && windowMinutes <= 10)
      return { flag: true, score: 30, reason: "Transactions rapides suspectes" };
    return { flag: false, score: 0 };
  },
};

export function analyzeTransaction(txn, userProfile) {
  let totalScore = 0;
  const reasons = [];
  const checks = [
    RISK_RULES.unusualAmount(txn.amount, userProfile.avgTxnAmount),
    RISK_RULES.unusualTime(txn.hour, txn.minute),
    RISK_RULES.newRecipient(txn.isNewRecipient),
    RISK_RULES.rapidSuccession(txn.rapidCount, txn.windowMinutes),
  ];
  checks.forEach((result) => {
    if (result.flag) {
      totalScore += result.score;
      reasons.push(result.reason);
    }
  });
  return {
    score: Math.min(totalScore, 100),
    level: totalScore >= 70 ? "ÉLEVÉ" : totalScore >= 40 ? "MOYEN" : "FAIBLE",
    color: totalScore >= 70 ? "#D32F2F" : totalScore >= 40 ? "#F57C00" : "#1B7A43",
    reasons,
    shouldBlock: totalScore >= 70,
  };
}

// SMS Scanner (used in S4)
const SMS_RISK_KEYWORDS = {
  high: ["gagné", "prix", "frais", "envoyez", "cliquez", "bit.ly", "tinyurl", "urgent", "suspendu"],
  medium: ["vérifier", "confirmer", "code", "lien", "gratuit"],
};

export function scanSms(message) {
  let score = 0;
  const flags = [];
  SMS_RISK_KEYWORDS.high.forEach((kw) => {
    if (message.toLowerCase().includes(kw)) { score += 15; flags.push(kw); }
  });
  SMS_RISK_KEYWORDS.medium.forEach((kw) => {
    if (message.toLowerCase().includes(kw)) { score += 8; flags.push(kw); }
  });
  return {
    score: Math.min(score, 100),
    level: score >= 70 ? "ARNAQUE PROBABLE" : score >= 40 ? "SUSPECT" : "Légitime",
    flags,
  };
}
