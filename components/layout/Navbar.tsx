import { checkIsAdmin } from '@/lib/actions/user.actions';   
import NavbarClient from './NavbarClient';

 export default async function Navbar() {
   const isAdmin = await checkIsAdmin();

   return <NavbarClient isAdmin={isAdmin} />;
}