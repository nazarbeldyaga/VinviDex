"use client";

import { FC } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import "./Header.css";
import Button from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

const DesktopHeader: FC = () => {
    const pathname = usePathname() as string;
    const { isLoggedIn, connectWallet, disconnectWallet, account } = useAuth();

    const goToAccountPage = () => {
        window.location.href = "/profile";
    };

    return (
        <div className="header">
            <div className="header__navigation">
                <Link href="/">
                    <Image
                        src={"/images/logo.png"}
                        alt="Vinvi logo"
                        width={190}
                        height={50}
                    ></Image>
                </Link>
            </div>
            <div className="navigation__menu">
                <Link
                    className={"menu__link " + (pathname == "/" ? "menu__link_active" : "")}
                    href="/"
                >
                    Home
                </Link>
                <Link
                    className={"menu__link " + (pathname == "/trading" ? "menu__link_active" : "")}
                    href="/trading"
                >
                    Trading
                </Link>
            </div>
            <div className="header__settings">
                {isLoggedIn ? (
                    <div className="settings_authorized">
                        <Button
                            text={`Profile ${account ? `(${account.substring(0, 6)}...)` : ""}`}
                            size="large"
                            onClick={goToAccountPage}
                        />

                        <Button
                            text=""
                            size="small"
                            onClick={disconnectWallet}
                            className="button-disconnect"
                        >
                            <Image
                                src={"/images/xmark-solid.svg"}
                                alt=""
                                width={30}
                                height={30}
                            ></Image>
                        </Button>
                    </div>
                ) : (
                    <div className="settings_authorized">
                        <Button
                            text="Connect wallet"
                            size="large"
                            onClick={connectWallet}
                        ></Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DesktopHeader;
