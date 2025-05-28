"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import TrxHistoryTable from "@/components/profile/TrxHistoryTable";
import "./ProfilePage.css";

const ProfilePage: React.FC = () => {
    const { account, isLoggedIn } = useAuth();

    return (
        <div className="profile-page">
            <div className="profile-header">
                <h1>Profile</h1>
                {isLoggedIn ? (
                    <div className="wallet-info">
                        <span className="wallet-label">Connected Wallet:</span>
                        <span className="wallet-address">{account}</span>
                    </div>
                ) : (
                    <p className="connect-wallet-message">Please connect your wallet to view your profile.</p>
                )}
            </div>
            
            <TrxHistoryTable />
        </div>
    );
};

export default ProfilePage;