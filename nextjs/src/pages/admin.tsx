import { AdminDashboard } from "@ixeta/xams";
import React, { useEffect } from "react";
import { Avatar, Box, Button, Divider, NavLink } from "@mantine/core";
import { IconChevronRight, IconLogout } from "@tabler/icons-react";
import { useRouter } from "next/router";
import { useAuth } from "@ixeta/headless-auth-react";
import { useXamsFirebaseAuth } from "@ixeta/xams-firebase";

const Admin = () => {
  const router = useRouter();
  const auth = useAuth();
  const fbAuth = useXamsFirebaseAuth();

  if (!auth.isReady) {
    return <div>Loading...</div>;
  }

  if (!auth.isLoggedIn) {
    return <div>You are not logged in</div>;
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
      userCard={
        <Box>
          <Divider />
          <NavLink
            label={fbAuth.firebaseAuth?.currentUser?.email || "User"}
            leftSection={<Avatar size="sm" />}
            rightSection={<IconChevronRight size={14} stroke={1.5} />}
            onClick={() => router.push("/profile")}
            p="md"
          />
        </Box>
      }
      accessDeniedMessage={
        <div className="w-full h-full flex flex-col gap-2 justify-center items-center">
          You don&apos;t have permission to view this page. Please contact your
          system administrator.
          {fbAuth.firebaseApp != null && (
            <Button
              onClick={() => {
                auth.signOut();
                router.push("/");
              }}
            >
              Logout
            </Button>
          )}
        </div>
      }
    />
  );
};

export default Admin;
