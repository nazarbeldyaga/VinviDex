import React, { ReactElement } from "react";

import "./Button.css";

interface ButtonProps {
    className?: string;
    backgroundColor?: "purple" | "blue" | "white" | "black" | "lightgray";
    color?: "black" | "white";
    text: string;
    onClick: () => void;
    disabled?: boolean;
    size?: "small" | "medium" | "large";
    children?: ReactElement;
}

const Button: React.FC<ButtonProps> = ({
    className,
    backgroundColor = "purple",
    color = "white",
    text,
    onClick,
    disabled = false,
    size = "medium",
    children
}: ButtonProps) => {
    return (
        <div
            style={{
                pointerEvents: disabled ? "none" : "auto",
                background: disabled ? "lightgray" : backgroundColor,
                color: disabled ? "gray" : color
            }}
            className={"button " + (className ? className + " " : "") + size}
            onClick={onClick}
        >
            {text}
            {children ? children : null}
        </div>
    );
};

export default Button;
