"use client";

import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ContactCard } from "@/components/cards/Contact";
import { Heading } from "@/components/heading/heading";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { SelectInput } from "@/components/ui/select-input";
import { TextArea } from "@/components/ui/TextArea";
import { FaPhoneVolume, FaProjectDiagram, FaUser } from "react-icons/fa";
import { MdEmail, MdSubject } from "react-icons/md";
import { SiMinutemailer } from "react-icons/si";
import { useLocale } from "@/app/context/LocalContext";
import Link from "next/link";

export default function ContactSection() {
  const { t } = useLocale();
  const [services, setServices] = useState<string[]>([]);
  const [budgets, setBudgets] = useState<string[]>([]);
  const formRef = useRef<HTMLFormElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const form = formRef.current;
    const formData = new FormData(form!);

    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      subject: formData.get("subject"),
      message: formData.get("message"),
      service: services.join(", "),
      budget: budgets[0] || "",
    };

    try {
      const res = await fetch("/api/Email", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (res.ok) {
        router.push(
          `/?show=true&title=Message Sent&message=${encodeURIComponent(
            "Your message has been sent successfully!"
          )}`
        );
      } else {
        router.push(
          `/?show=true&title=Error&message=${encodeURIComponent(
            data.message || "Something went wrong"
          )}`
        );
      }
    } catch (error: any) {
      router.push(
        `/?show=true&title=Error&message=${encodeURIComponent(
          error.message || "Unexpected error"
        )}`
      );
    }
  };

  return (
    <div className="pt-24 px-3 lg:px-8">
      <Heading number="05" title_1={t.contact} title_2={t.me} />
      <Card>
        <div className="grid gap-8 grid-cols-1 lg:grid-cols-3">
          {/* Left side */}
          <div className="flex flex-col gap-8">
            <ContactCard
              title={t.call_us_dir}
              icon={<FaPhoneVolume className="fill-[#333] text-lg" />}
              text={
                <div className=" flex flex-col gap-y-4 ">
                  <p> +49-152-151-09694</p> <p>+49-176-321-93910</p>
                  <p> +963-937-590-305</p>
                </div>
              }
            />
            <ContactCard
              title={t.chat_with_us}
              icon={<MdEmail className="fill-[#333] text-lg" />}
              text={
                <div className=" flex flex-col gap-y-4 ">
                  <p> samkazah444@gmail.com</p>{" "}
                  <Link
                    className=" cursor-pointer"
                    href="https://linkedin.com/in/sami-kazah-6aa67648/"
                  >
                    {" "}
                    linkedin/sami-kazah-6aa67648
                  </Link>
                </div>
              }
            />
          </div>

          {/* Form */}
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="lg:col-span-2 bg-secondary-background border border-border rounded-lg space-y-6 p-6 shadow-md"
          >
            <div className="flex flex-col lg:flex-row gap-6">
              <Input
                name="name"
                type="text"
                placeholder={t.full_name}
                icon={<FaUser />}
              />
              <Input
                type="email"
                name="email"
                placeholder={t.email}
                icon={<MdEmail />}
              />
            </div>

            <Input
              type="text"
              placeholder={t.subject}
              name="subject"
              icon={<MdSubject />}
            />

            <div className="space-y-4">
              <h2 className="font-bold text-lg">{t.q1}</h2>
              <div className="flex flex-wrap gap-4">
                {servicesOption.map((service) => (
                  <SelectInput
                    key={service.id}
                    type="checkbox"
                    id={service.id}
                    text={service.text}
                    selectedOptions={services}
                    setSelectedOption={setServices}
                    allowMultiple
                  />
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="font-bold text-lg">{t.q2}</h2>
              <div className="flex flex-wrap gap-4">
                {BudgetOption.map((budget) => (
                  <SelectInput
                    key={budget.id}
                    type="radio"
                    id={budget.id}
                    text={budget.text}
                    selectedOptions={budgets}
                    setSelectedOption={setBudgets}
                  />
                ))}
              </div>
            </div>

            <TextArea
              placeholder={t.q3}
              name="message"
              icon={<FaProjectDiagram />}
            />

            <div className="w-full flex justify-end">
              <Button
                onClick={() => btnRef.current?.click()}
                type="submit"
                className="!w-44 !py-3 !text-xl"
              >
                {t.send} <SiMinutemailer />
              </Button>
            </div>

            {/* Hidden Inputs */}
            <div className="hidden">
              <input
                value={services.join(", ")}
                name="services"
                readOnly
                hidden
              />
              <input value={budgets[0] || ""} name="budget" readOnly hidden />
            </div>
            <button type="submit" ref={btnRef} hidden>
              Hidden Submit
            </button>
          </form>
        </div>
      </Card>
    </div>
  );
}

const servicesOption = [
  { text: "Front End", id: "1" },
  { text: "Back End", id: "2" },
  { text: "Full Stack", id: "3" },
];

const BudgetOption = [
  { text: "< 500", id: "less-than-500" },
  { text: "500 - 2000", id: "between-500-2000" },
  { text: "< 2000", id: "more-than-2000" },
];
