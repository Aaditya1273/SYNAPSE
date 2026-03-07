"use client";

import { useEffect, ReactNode } from "react";
import { useWallet } from "@/lib/hooks";
import { useRouter, usePathname } from "next/navigation";

export function AuthGuard({ children }: { children: ReactNode }) {
    const { account } = useWallet();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // Only guard specific tactical routes
        const tacticalRoutes = ["/dashboard", "/network", "/vault"];
        const isTacticalRoute = tacticalRoutes.some(route => pathname.startsWith(route));

        if (isTacticalRoute && !account) {
            router.push("/");
        }
    }, [account, pathname, router]);

    return <>{children}</>;
}
