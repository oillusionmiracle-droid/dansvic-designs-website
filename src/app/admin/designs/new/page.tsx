import { AdminHeader } from "@/components/admin/ui";
import { DesignForm } from "@/components/admin/DesignForm";

export default function NewDesign() {
  return (
    <>
      <AdminHeader title="Add design" />
      <DesignForm />
    </>
  );
}
