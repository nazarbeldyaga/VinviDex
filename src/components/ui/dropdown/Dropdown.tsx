import React from "react";

import "./Dropdown.css";

interface DropdownProps {
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

const Dropdown: React.FC<DropdownProps> = ({
    className,
    backgroundColor = "purple",
    color = "white",
    text,
    onClick,
    disabled = false,
    size = "medium"
}: DropdownProps) => {
    return (
        <>
            <div
                style={{
                    pointerEvents: disabled ? "none" : "auto",
                    background: disabled ? "lightgray" : backgroundColor,
                    color: disabled ? "gray" : color
                }}
                className={"dropdown " + (className ? className + " " : "") + size}
                onClick={onClick}
            >
                {text}
            </div>
        </>
    );
};

export default Dropdown;
