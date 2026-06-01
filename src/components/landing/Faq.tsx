import { useEffect, useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { supabase } from "@/integrations/supabase/client";

const FALLBACK = [
  { id: "1", question: "Apakah RSLink gratis untuk civitas?", answer: "Ya, RSLink gratis untuk seluruh civitas SMA Riyadhussholihiin." },
];

export function Faq() {
  const [faqs, setFaqs] = useState<{ id: string; question: string; answer: string }[]>(FALLBACK);

  useEffect(() => {
    supabase.from("faqs").select("id, question, answer").order("sort_order", { ascending: true })
      .then(({ data }) => { if (data && data.length > 0) setFaqs(data); });
  }, []);

  return (
    <section id="faq" className="bg-gradient-subtle py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">FAQ</span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Pertanyaan yang sering diajukan</h2>
        </div>
        <Accordion type="single" collapsible className="mt-10 space-y-3">
          {faqs.map((f) => (
            <AccordionItem key={f.id} value={f.id} className="rounded-xl border border-border/60 bg-card px-5">
              <AccordionTrigger className="text-left text-base font-semibold hover:no-underline">
                {f.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground whitespace-pre-line">{f.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
