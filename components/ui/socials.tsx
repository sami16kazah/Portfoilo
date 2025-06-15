"use client";
import { FaFacebook, FaGithub, FaLinkedin } from "react-icons/fa";

import React from "react";
import { Button } from "./button";

export default function Socials() {
  return (
    <div className="flex items center flex-wrap gap-3">
      {socials.map((social, i) => {
        return (
          <Button key={i} link={social.link} isIcon>
            <span className="w-7 h-7 grid place-items-center">
              {social.icon}
            </span>
          </Button>
        );
      })}
    </div>
  );
}

const socials = [
  {
    icon: <FaLinkedin className="w-5 h-5"></FaLinkedin>,
    link: "https://www.linkedin.com/in/sami-kazah-6aa67648/",
    userName: "Sami Kazah",
  },
  {
    icon: <FaFacebook className="w-5 h-5"></FaFacebook>,
    link: "https://www.facebook.com/profile.php?id=100004195625658",
    userName: "Sami Kazah",
  },
  {
    icon: <FaGithub className="w-5 h-5"></FaGithub>,
    link: "https://github.com/sami16kazah/",
    userName: "Sami Kazah",
  },
];
