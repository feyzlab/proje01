"use client";

import { useCallback } from "react";
import { DownloadSimple } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

type Props = {
  name: string;
  role: string;
  email?: string;
  phone?: string;
  url: string;
  org?: string;
};

function digitsOnly(phone: string) {
  return phone.replace(/[^\d+]/g, "");
}

function buildVCard(p: Props) {
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${p.name}`,
    `N:${p.name};;;;`,
    p.org ? `ORG:${p.org}` : null,
    p.role ? `TITLE:${p.role}` : null,
    p.email ? `EMAIL;TYPE=INTERNET:${p.email}` : null,
    p.phone ? `TEL;TYPE=CELL:${digitsOnly(p.phone)}` : null,
    `URL:${p.url}`,
    "END:VCARD",
  ].filter(Boolean);
  return lines.join("\r\n");
}

export function SaveContactButton(props: Props) {
  const onSave = useCallback(() => {
    const blob = new Blob([buildVCard(props)], {
      type: "text/vcard;charset=utf-8",
    });
    const href = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = href;
    a.download = `${props.name.toLowerCase().replace(/\s+/g, "-")}.vcf`;
    a.click();
    URL.revokeObjectURL(href);
  }, [props]);

  return (
    <Button type="button" variant="outline" size="lg" onClick={onSave} className="w-full sm:w-auto">
      <DownloadSimple className="size-4" weight="bold" />
      Rehbere kaydet
    </Button>
  );
}
