import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "default" | "outline";
}

export default function Button({
  children,
  className = "",
  variant = "default",
  ...props
}: ButtonProps) {
  const baseClasses = variant === "outline" 
    ? 'w-fit px-10 py-3 font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg cursor-pointer transition-all duration-200 ease-in-out shadow-md min-h-12 inline-flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed'
    : 'w-fit px-10 py-3 font-semibold text-white bg-gradient-to-br from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 rounded-lg cursor-pointer transition-all duration-200 ease-in-out shadow-md min-h-12 inline-flex items-center justify-center border-none disabled:opacity-50 disabled:cursor-not-allowed';

  return (
    <button className={`${baseClasses} ${className}`} {...props}>
      {children}
    </button>
  );
}
