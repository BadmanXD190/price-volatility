import "./globals.css";

export const metadata = {
  title: "Food Price Volatility",
  description: "Hybrid LSTM + GARCH demo"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif", background: "#0b0e14", color: "#e5e7eb" }}>
        {children}
      </body>
    </html>
  );
}
