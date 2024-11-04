import "../../globals.css";
import '../../../styles/style.css';
import ProfileSidebar from '../components/ProfileSidebar';



export default function ProfileLayout({ children }) {
  return (
    <>
    <ProfileSidebar/>
    <div className="container mx-auto p-6 flex">
        {children}
    </div>
    </>
  );
}
