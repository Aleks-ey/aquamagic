import { useAuth } from "@/utils/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/router";
import DashboardCard from "@/components/dashboardCard";

export default function Dashboard() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) router.push("/auth/signin");
  }, [user]);

  if (!user) return null;

  return (
    <div className="max-w-6xl mx-auto px-6 pt-32 pb-20">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Swimmers / Registrations */}
        <DashboardCard
          title="Swimmers"
          description="Manage swimmer registrations and add new swimmers."
          buttonText="View Swimmers"
          onClick={() => router.push("/dashboard/swimmers")}
        />

        {/* Waivers */}
        <DashboardCard
          title="Waivers"
          description="View and complete required waivers for participation."
          buttonText="View Waivers"
          onClick={() => router.push("/dashboard/waivers")}
        />

        {/* Payments */}
        <DashboardCard
          title="Payments"
          description="Manage payments, invoices, and billing."
          buttonText="Go to Payments"
          onClick={() => router.push("/payments")}
        />
      </div>
    </div>
  );
}
