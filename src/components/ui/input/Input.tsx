import React from "react";

import "./Input.css";

interface InputProps {
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

const Input: React.FC<InputProps> = ({
    className,
    backgroundColor = "purple",
    color = "white",
    text,
    onClick,
    disabled = false,
    size = "medium"
}: InputProps) => {
    return (
        <>
            <div
                style={{
                    pointerEvents: disabled ? "none" : "auto",
                    background: backgroundColor,
                    color: color
                }}
                className={"input " + (className ? className + " " : "") + size}
                onClick={onClick}
            >
                {text}
            </div>
        </>
    );
};

export default Input;
