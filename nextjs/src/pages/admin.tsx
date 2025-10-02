import { AdminDashboard } from "@ixeta/xams";
import React, { useEffect } from "react";
import { NavLink } from "@mantine/core";
import { IconLogout } from "@tabler/icons-react";
import { useRouter } from "next/router";
import { useAuth } from "@ixeta/headless-auth-react";

const Admin = () => {
  const router = useRouter();
  const auth = useAuth();

  if (!auth.isReady) {
    return <div>Loading...</div>;
  }

  return (
    <AdminDashboard
      addMenuItems={[
        {
          order: 10000,
          navLink: (
            <NavLink
              label="Logout"
              leftSection={<IconLogout size={16} />}
              onClick={() => {
                auth.signOut();
                router.push("/");
              }}
            />
          ),
        },
      ]}
    />
  );
};

export default Admin;
