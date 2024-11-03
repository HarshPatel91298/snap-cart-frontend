import "./globals.css";
import '../styles/style.css';


export const metadata = {
  title: "SnapCart",
  description: "Your go-to e-commerce platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
