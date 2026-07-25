// NjangiGuard SMS NLP Scanner — keyword-based risk scorer

const SMS_RISK_KEYWORDS = {
  high:   ["gagné", "prix", "frais", "envoyez", "cliquez", "bit.ly", "tinyurl", "urgent", "suspendu"],
  medium: ["vérifier", "confirmer", "code", "lien", "gratuit"],
};

export function scanSms(message) {
  let score = 0;
  const flags = [];
  const lower = message.toLowerCase();

  SMS_RISK_KEYWORDS.high.forEach((kw) => {
    if (lower.includes(kw)) { score += 20; flags.push(kw); }
  });
  SMS_RISK_KEYWORDS.medium.forEach((kw) => {
    if (lower.includes(kw)) { score += 8; flags.push(kw); }
  });

  return {
    score: Math.min(score, 100),
    level: score >= 70 ? "ARNAQUE PROBABLE" : score >= 40 ? "SUSPECT" : "Légitime",
    flags,
  };
}
