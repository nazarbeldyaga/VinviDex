"use client";

import React, { ReactNode, useEffect } from "react";
import Head from "next/head";

import Header from "../header/Header";

import "./PageLayout.css";

interface PageLayoutProps {
    title?: string;
    children?: ReactNode;
    hasHeader?: boolean;
    className?: string;
}

const PageLayout: React.FC<PageLayoutProps> = ({
    title,
    children,
    hasHeader = true,
    className
}: PageLayoutProps) => {
    useEffect(() => {
        localStorage.setItem("isLoggedIn", "true");
    }, [])

    return (
        <>
            <Head>
                <meta
                    property="og:image"
                    content="/images/preview.jpg"
                />
                <meta
                    property="og:type"
                    content="website"
                />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0"
                />
                <meta
                    name="google-site-verification"
                    content="M93dY9EuPcQ5AzSYwxc6_el0GwZp_XlDHBhphP6z-7g"
                />
                <title>{title}</title>
            </Head>

            <div className={"page" + (className ? " " + className : "")}>
                {hasHeader && (
                    <Header />
                )}
                {children}
            </div>
        </>
    );
};

export default PageLayout;
