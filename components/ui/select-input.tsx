"use client";
import React, { FC } from "react";
interface SelectInputProps {
  type: "checkbox" | "radio";
  id: string;
  text: string;
  selectedOptions: string[];
  setSelectedOption: (newValue: string[]) => void;
  allowMultiple?: boolean;
}
export const SelectInput: FC<SelectInputProps> = ({
  id,
  type,
  text,
  selectedOptions,
  setSelectedOption,
  allowMultiple,
}) => {
  const handelOptionChange = (option: string) => {
    if (allowMultiple) {
      const currentIndex = selectedOptions.indexOf(option);
      const newSelectedOption = [...selectedOptions];
      if (currentIndex === -1) {
        newSelectedOption.push(option);
      } else {
        newSelectedOption.splice(currentIndex, 1);
      }
      setSelectedOption(newSelectedOption);
    } else {
      const newSelectedOption = [option];
      setSelectedOption(newSelectedOption);
    }
  };
  return (
    <div className="flex items-center gap-x-2">
      <input
        className="w-[15px] h-[15px] !rounded-xl !bg-transparent"
        type={type}
        id={id}
        checked={selectedOptions.includes(id)}
        onChange={() => {
          handelOptionChange(id);
        }}
      ></input>
      <label htmlFor={id}>{text}</label>
    </div>
  );
};
