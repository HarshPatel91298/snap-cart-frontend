import "./globals.css";
import '../styles/style.css';
import { AuthContextProvider } from "../context/AuthContext";


export const metadata = {
  title: "SnapCart",
  description: "Your go-to e-commerce platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
      <AuthContextProvider>
        {children}
      </AuthContextProvider>
      </body>
    </html>
  );
}
