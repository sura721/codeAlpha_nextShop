import { checkIsAdmin } from '@/lib/actions/user.actions'; // Adjust path if needed
import NavbarClient from './NavbarClient';

// This is an async Server Component. It has no 'use client' directive.
export default async function Navbar() {
  // Data fetching happens here, isolated to this component.
  const isAdmin = await checkIsAdmin();

  // Render the Client Component and pass the server-fetched data as a prop.
  return <NavbarClient isAdmin={isAdmin} />;
}