import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Slider } from "./ui/slider"; 
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Check, ArrowRight, Sparkles, TrendingUp, Heart, Shield, Timer } from "lucide-react";

// --- Utility helpers ---
const fmtUSD = (n) => n.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

// Future Value of a stream of monthly contributions at 10% nominal annual return
// FV = P * [((1+r/n)^(n*t) - 1) / (r/n)]
function futureValueMonthly({ monthly, currentAge }) {
  const rate = 0.10;
  const n = 12;
  const retireAge = 65;
  const tYears = Math.max(0, retireAge - currentAge);
  const monthlyRate = rate / n;
  const periods = n * tYears;
  if (periods === 0) return monthly * 1; // trivial edge case; show one month worth to avoid 0. 
  const fv = monthly * ((Math.pow(1 + monthlyRate, periods) - 1) / monthlyRate);
  return fv;
}

// --- Copy blocks (editable) ---
const COPY = {
  heroTitle: "Take control of your money—starting today",
  heroSub: "You don’t have to be stressed about money. Give it 18–24 months. We’ll show you the plan.",
  primingA:"Debt felt normal. But normal is broke. There’s a better way—and it’s simple.",
  primingB: "Live like no one else for 18–24 months. Then invest like no one else.",
  feelingsPrompt: "How has debt made you feel lately? (pick the best fit)",
  feelings: ["Stressed", "Stuck", "Ashamed", "Angry", "Numb", "Motivated"],
  identityPrompt: "Who do you want to be with money 2 years from now?",
  identities: ["Calm & in control", "Debt-free family", "First-time investor", "Generational changer"],
  dataIntro: "A couple of quick numbers so we can run the math.",
  ageLabel: "Your age",
  debtPayLabel: "Total monthly debt payments (all non-mortgage)",
  resultTitle: "Your debt payment is actually a million-dollar decision",
  decisionLead: "Redirect that same monthly debt payment into investing. By age 65 at 10%, it could become:",
  microCommit: "For the next 18–24 months, I will live like no one else so later I can live—and invest—like no one else.",
  guarantee: "Annual plan is $80. Cancel anytime.",
  disclaimer: "Estimates are hypothetical, not guarantees. 10% is a long-term market average; your results will vary.",
};

// --- Step component ---
const StepShell = ({ step, total, children }) => (
  <div className="max-w-2xl mx-auto p-4">
    <div className="mb-6">
      <Progress value={(step / total) * 100} />
      <div className="text-xs text-muted-foreground mt-2">Step {step} of {total}</div>
    </div>
    {children}
  </div>
);

export default function DebtToWealthExperience() {
  const TOTAL_STEPS = 5;
  const [step, setStep] = useState(1);

  // state
  const [feeling, setFeeling] = useState("");
  const [identity, setIdentity] = useState("");
  const [age, setAge] = useState(30);
  const [debtMonthly, setDebtMonthly] = useState(400);
  const [accept, setAccept] = useState(false);

  const fv = useMemo(() => futureValueMonthly({ monthly: debtMonthly, currentAge: age }), [debtMonthly, age]);
  const yearsTo65 = clamp(65 - age, 0, 100);

  // derived CTA copy
  const fvDisplay = fmtUSD(Math.max(0, Math.round(fv)));
  const investStartYear = new Date().getFullYear() + (yearsTo65 === 0 ? 0 : Math.min(2, yearsTo65));

  return (
    <div className="min-h-screen bg-[var(--ed-bg)]">
      <div className="max-w-3xl mx-auto p-6">
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center my-6">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight uppercase">
            <span className="inline-flex items-center gap-2">
                <Sparkles className="w-7 h-7" /> {COPY.heroTitle}
            </span>
        </h1>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto">{COPY.heroSub}</p>
        </motion.div>

        {/* Steps */}
        {step === 1 && (
          <StepShell step={1} total={TOTAL_STEPS}>
            <Card className="shadow-xl">
              <CardContent className="p-6 space-y-4">
                <p className="text-base">{COPY.primingA}</p>
                <p className="text-base">{COPY.primingB}</p>
                <div className="flex justify-end">
                  <Button size="lg" onClick={() => setStep(2)}>
                    Start <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </StepShell>
        )}

        {step === 2 && (
          <StepShell step={2} total={TOTAL_STEPS}>
            <Card className="shadow-xl">
              <CardContent className="p-6 space-y-6">
                <div>
                  <Label>{COPY.feelingsPrompt}</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                    {COPY.feelings.map((f) => (
                      <Button
                        key={f}
                        variant={feeling === f ? "default" : "secondary"}
                        className="justify-start"
                        onClick={() => setFeeling(f)}
                      >
                        <Heart className="mr-2 w-4 h-4" /> {f}
                      </Button>
                    ))}
                  </div>
                </div>
                <div>
                  <Label>{COPY.identityPrompt}</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                    {COPY.identities.map((i) => (
                      <Button
                        key={i}
                        variant={identity === i ? "default" : "secondary"}
                        className="justify-start"
                        onClick={() => setIdentity(i)}
                      >
                        <Shield className="mr-2 w-4 h-4" /> {i}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between">
                  <Button variant="ghost" onClick={() => setStep(1)}>Back</Button>
                  <Button size="lg" onClick={() => setStep(3)} disabled={!feeling || !identity}>
                    Continue <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </StepShell>
        )}

        {step === 3 && (
          <StepShell step={3} total={TOTAL_STEPS}>
            <Card className="shadow-xl">
              <CardContent className="p-6 space-y-6">
                <p>{COPY.dataIntro}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="age">{COPY.ageLabel}: <span className="font-medium">{age}</span></Label>
                    <Slider value={[age]} min={18} max={80} step={1} onValueChange={(v) => setAge(v[0])} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="debt">{COPY.debtPayLabel}</Label>
                    <Input
                        id="debt"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        placeholder="e.g., 400"
                        value={debtMonthly}
                        onChange={(e) => setDebtMonthly(clamp(parseInt(e.target.value || "0", 10), 0, 100000))}
                    />
                    <p className="text-xs text-[var(--ed-muted)] mt-1">
                        Include all non-mortgage debts such as car payments, credit cards, student loans, medical bills, and personal loans.
                    </p>
                </div>
                </div>
                <div className="flex justify-between">
                  <Button variant="ghost" onClick={() => setStep(2)}>Back</Button>
                  <Button size="lg" onClick={() => setStep(4)}>
                    See the math <TrendingUp className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </StepShell>
        )}

        {step === 4 && (
          <StepShell step={4} total={TOTAL_STEPS}>
            <Card className="shadow-xl overflow-hidden">
              <CardContent className="p-0">
                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-2">
                    <Timer className="w-5 h-5" />
                    <p className="text-sm text-muted-foreground">Years until 65: <span className="font-medium">{yearsTo65}</span></p>
                  </div>
                  <h2 className="text-2xl font-semibold">{COPY.resultTitle}</h2>
                  <p className="text-base text-muted-foreground">{COPY.decisionLead}</p>
                  <div className="bg-[var(--ed-primary-50)] border border-[var(--ed-primary)]/20 rounded-2xl p-5">
                    <div className="text-4xl font-extrabold tracking-tight text-[var(--ed-ink)]">{fvDisplay}</div>
                    <div className="text-sm text-[var(--ed-muted)] mt-2">
                        Assumes redirecting {fmtUSD(debtMonthly)}/mo to investing after debts are paid off, earning 10%/yr compounded monthly until age 65.
                    </div>
                </div>

                  {yearsTo65 <= 2 && (
                    <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-xl p-3">You're already near 65. The time horizon is short, so compounding has less time to work. The math still matters—freedom matters more.</p>
                  )}

                  <div className="text-sm text-muted-foreground">
                    <p>{COPY.disclaimer}</p>
                  </div>
                </div>
                <div className="p-6 border-t flex justify-between items-center gap-2">
                  <Button variant="ghost" onClick={() => setStep(3)}>Back</Button>
                  <Button size="lg" onClick={() => setStep(5)}>
                    I'm ready for a 24‑month sprint <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </StepShell>
        )}

        {step === 5 && (
          <StepShell step={5} total={TOTAL_STEPS}>
            <Card className="shadow-xl">
              <CardContent className="p-6 space-y-5">
                <h3 className="text-2xl font-semibold">Make the decision that changes everything</h3>
                <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                  <li>Personalized plan to pay off debt in 18–24 months.</li>
                  <li>Coaching prompts that keep you on track when motivation dips.</li>
                  <li>When the debts are gone, we guide you to invest that {fmtUSD(debtMonthly)}/mo. By {investStartYear + yearsTo65} you'd be {fmtUSD(Math.round(fv))} richer than "normal."</li>
                </ul>

                <label className="flex items-start gap-3 text-sm">
                  <input type="checkbox" className="mt-1" checked={accept} onChange={(e) => setAccept(e.target.checked)} />
                  <span>{COPY.microCommit}</span>
                </label>

                <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                  <div className="text-sm text-muted-foreground flex items-center gap-2"><Check className="w-4 h-4 text-green-600"/> {COPY.guarantee}</div>
                  <div className="flex gap-2">
                    <Button variant="secondary" onClick={() => setStep(4)}>Back</Button>
                    <Button
                        size="lg"
                        disabled={!accept}
                        onClick={() => {
                            window.location.href = process.env.NEXT_PUBLIC_CTA_URL;
                        }}
                    >
                        Start for $80/yr <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </StepShell>
        )}

        {/* Footer microcopy */}
        <div className="text-center text-xs text-muted-foreground mt-8">
          © {new Date().getFullYear()} EveryDollar • Built for clarity and momentum
        </div>
      </div>
    </div>
  );
}