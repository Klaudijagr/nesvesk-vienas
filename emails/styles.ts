// Site colors (matching the dark theme)
export const colors = {
  // slate-900
  background: "#0F172A",
  // slate-800
  cardBg: "#1E293B",
  // slate-700
  border: "#334155",
  // slate-300
  text: "#CBD5E1",
  // slate-400
  textMuted: "#94A3B8",
  // slate-50
  textLight: "#F8FAFC",
  // amber-500
  amber: "#F59E0B",
  // amber-300
  amberLight: "#FCD34D",
  // green-500
  green: "#22C55E",
  // green-300
  greenLight: "#86EFAC",
};

// Styles - Dark theme matching site. Declarations are written into each
// `style` attribute in key order, so reordering keys changes the sent HTML.
export const styles = {
  main: {
    backgroundColor: colors.background,
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif',
  },
  container: {
    backgroundColor: colors.cardBg,
    margin: "0 auto",
    padding: "0",
    marginTop: "40px",
    marginBottom: "40px",
    maxWidth: "600px",
    borderRadius: "16px",
    border: `1px solid ${colors.border}`,
    overflow: "hidden",
  },
  header: {
    padding: "24px 32px",
    borderBottom: `1px solid ${colors.border}`,
    backgroundColor: colors.background,
  },
  logo: {
    color: colors.amber,
    fontSize: "24px",
    fontWeight: "bold" as const,
    margin: "0",
    fontFamily: "Georgia, serif",
  },
  content: {
    padding: "32px",
  },
  footer: {
    padding: "24px 32px",
    borderTop: `1px solid ${colors.border}`,
    textAlign: "center" as const,
    backgroundColor: colors.background,
  },
  footerTagline: {
    color: colors.textMuted,
    fontSize: "14px",
    lineHeight: "24px",
    margin: "0 0 16px",
    fontStyle: "italic" as const,
  },
  footerLinks: {
    color: colors.textMuted,
    fontSize: "12px",
    lineHeight: "20px",
    margin: "0 0 8px",
  },
  footerLink: {
    color: colors.amber,
    textDecoration: "none",
  },
  copyright: {
    color: colors.textMuted,
    fontSize: "12px",
    lineHeight: "20px",
    margin: "0",
  },
  iconContainer: {
    textAlign: "center" as const,
    marginBottom: "16px",
  },
  iconText: {
    fontSize: "56px",
    margin: "0",
  },
  heading: {
    fontSize: "28px",
    fontWeight: "bold" as const,
    textAlign: "center" as const,
    margin: "0 0 24px",
    fontFamily: "Georgia, serif",
  },
  paragraph: {
    color: colors.text,
    fontSize: "16px",
    lineHeight: "28px",
    margin: "0 0 16px",
  },
  paragraphCenter: {
    color: colors.text,
    fontSize: "16px",
    lineHeight: "28px",
    margin: "0 0 16px",
    textAlign: "center" as const,
  },
  buttonContainer: {
    textAlign: "center" as const,
    margin: "32px 0",
  },
  buttonAmber: {
    backgroundColor: colors.amber,
    borderRadius: "8px",
    color: colors.background,
    fontSize: "16px",
    fontWeight: "bold" as const,
    textDecoration: "none",
    textAlign: "center" as const,
    display: "inline-block",
    padding: "14px 32px",
  },
  buttonGreen: {
    backgroundColor: colors.green,
    borderRadius: "8px",
    color: colors.background,
    fontSize: "16px",
    fontWeight: "bold" as const,
    textDecoration: "none",
    textAlign: "center" as const,
    display: "inline-block",
    padding: "14px 32px",
  },
  tipBox: {
    backgroundColor: colors.background,
    borderRadius: "8px",
    color: colors.text,
    fontSize: "14px",
    lineHeight: "22px",
    padding: "16px",
    margin: "24px 0 0",
    border: `1px solid ${colors.border}`,
  },
  nextStepsBox: {
    backgroundColor: "rgba(34, 197, 94, 0.1)",
    borderRadius: "8px",
    padding: "20px",
    marginTop: "24px",
    border: `1px solid ${colors.green}`,
  },
  nextStepsTitle: {
    color: colors.greenLight,
    fontSize: "14px",
    fontWeight: "bold" as const,
    margin: "0 0 12px",
  },
  nextStepsItem: {
    color: colors.text,
    fontSize: "14px",
    lineHeight: "26px",
    margin: "0",
  },
  encouragementBox: {
    backgroundColor: "rgba(245, 158, 11, 0.1)",
    borderRadius: "8px",
    color: colors.amberLight,
    fontSize: "14px",
    lineHeight: "22px",
    padding: "16px",
    margin: "24px 0 0",
    textAlign: "center" as const,
    border: `1px solid ${colors.amber}`,
  },
  timestamp: {
    color: colors.textMuted,
    fontSize: "12px",
    textAlign: "center" as const,
    margin: "24px 0 0",
  },
};
