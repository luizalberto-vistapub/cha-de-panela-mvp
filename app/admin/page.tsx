import { isAdminRequest } from "@/lib/admin-auth";
import { AdminPanel } from "@/components/AdminPanel";

export default function AdminPage() {
  return <AdminPanel initialIsAuthed={isAdminRequest()} />;
}
