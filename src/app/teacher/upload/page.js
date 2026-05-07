'use client';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { UploadContentForm } from '@/components/content/UploadContentForm';
import { ROLES } from '@/lib/constants';

export default function UploadPage() {
  return (
    <DashboardLayout
      title="Upload Content"
      subtitle="Create and schedule educational content for students"
      allowedRole={ROLES.TEACHER}
    >
      <UploadContentForm />
    </DashboardLayout>
  );
}
