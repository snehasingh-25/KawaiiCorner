import { cn } from "../lib/utils";
import { cva } from "class-variance-authority";
import React, { useCallback, useEffect, useState } from "react";

const buttonVariants = cva(
  [
    "relative",
    "rounded-md",
    "px-7",
    "py-3",
    "w-fit",
    "transition-all",
    "duration-100",
    "disabled:cursor-not-allowed",
    "disabled:opacity-50",
    "font-bold",
    "text-xl",
  ],
  {
    variants: {
      variant: {
        clicky: "",
      },
      isPressed: {
        true: "",
        false: "",
      },
    },
    compoundVariants: [
      {
        variant: "clicky",
        isPressed: true,
        className: [
          "translate-y-[5px]",
          "translate-x-[5px]",
          "border-b-[4px]",
          "border-r-[4px]",
        ],
      },
      {
        variant: "clicky",
        isPressed: false,
        className: ["border-b-[9px]", "border-r-[9px]"],
      },
    ],
    defaultVariants: {
      variant: "clicky",
      isPressed: false,
    },
  }
);

const useClickSound = (volume = 1) => {
  const [sound] = useState(() =>
    typeof window !== "undefined" ? new Audio("/sound/click.mp3") : null
  );

  useEffect(() => {
    if (!sound) return;
    sound.volume = volume;
    sound.load();
    return () => {
      sound.pause();
    };
  }, [sound, volume]);

  const play = useCallback(() => {
    if (sound) {
      sound.currentTime = 0;
      sound.play().catch((err) => {
        console.error("Audio playback failed:", err);
      });
    }
  }, [sound]);

  return play;
};

export default function Button({
  variant = "clicky",
  volume = 1,
  children,
  className,
  onMouseDown,
  onMouseUp,
  disabled,
  ...props
}) {
  const playClick = useClickSound(volume);
  const [isPressed, setIsPressed] = useState(false);

  const handleMouseDown = useCallback(
    (e) => {
      if (!disabled && variant === "clicky") playClick();
      setIsPressed(true);
      onMouseDown?.(e);
    },
    [disabled, variant, playClick, onMouseDown]
  );

  const handleMouseUp = useCallback(
    (e) => {
      setIsPressed(false);
      onMouseUp?.(e);
    },
    [onMouseUp]
  );

  return (
    <button
      className={cn(
        "border-2 shadow-xl",
        "bg-[#CAEDF7] text-[#02151A] border-[#02151A]",
        buttonVariants({ variant, isPressed }),
        className
      )}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={() => setIsPressed(false)}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
