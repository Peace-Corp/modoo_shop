import { getUsers } from '@/data/users';
import AdminUsers from './AdminUsers';

export default async function AdminUsersPage() {
  const users = await getUsers();
  return <AdminUsers users={users} />;
}
