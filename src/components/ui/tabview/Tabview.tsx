import React from "react";

import "./Tabview.css";

interface TabviewProps {
    className?: string;
    backgroundColor?:
        | "purple"
        | "blue"
        | "white"
        | "black"
        | "lightgray";
    color?: "black" | "white";
    text: string;
    onClick: () => void;
    disabled?: boolean;
    size?: "small" | "medium" | "large";
}

const Tabview: React.FC<TabviewProps> = ({
    className,
    backgroundColor = "purple",
    color = "white",
    text,
    onClick,
    disabled = false,
    size = "medium"
}: TabviewProps) => {
    return (
        <>
            <div
                style={{
                    pointerEvents: disabled ? "none" : "auto",
                    background: backgroundColor,
                    color: color
                }}
                className={"button " + (className ? className + " " : "") + size}
                onClick={onClick}
            >
                {text}
            </div>
        </>
    );
};

export default Tabview;
