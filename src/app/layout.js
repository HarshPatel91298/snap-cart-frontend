import "./globals.css";
import "../styles/style.css";
import { AuthContextProvider } from "../context/AuthContext";

export const metadata = {
  title: "SnapCart",
  description: "Your go-to e-commerce platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Meta and other head elements here */}
      </head>
      <body>
        <AuthContextProvider>
          {children}
        </AuthContextProvider>

        {/* External scripts */}
        <script src="https://cdn.jsdelivr.net/npm/preline@2.4.1/dist/preline.min.js"></script>
        <script
          src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min.js"
          integrity="sha512-WFN04846sdKMIP5LKNphMaWzU7YpMyCU245etK3g/2ARYbPK9Ub18eG+ljU96qKRCWh+quCY7yefSmlkQw1ANQ=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        ></script>
        <script
          src="https://cdnjs.cloudflare.com/ajax/libs/dropzone/5.9.3/dropzone.min.js"
          integrity="sha512-U2WE1ktpMTuRBPoCFDzomoIorbOyUv0sP8B+INA3EzNAhehbzED1rOJg6bCqPf/Tuposxb5ja/MAUnC8THSbLQ=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        ></script>

        {/* Inline script to initialize HSFileUpload with error handling */}
       
      </body>
    </html>
  );
}
