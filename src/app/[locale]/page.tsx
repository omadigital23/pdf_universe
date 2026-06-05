import { getTranslations } from "next-intl/server";
import {
  BadgeCheck,
  Edit3,
  FileImage,
  FileStack,
  Globe,
  ImageIcon,
  Layers2,
  Lock,
  PenLine,
  Scissors,
} from "lucide-react";
import { CtaSection } from "@/components/landing/CtaSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { HeroSection } from "@/components/landing/HeroSection";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingJsonLd } from "@/components/landing/LandingJsonLd";
import { PricingSection } from "@/components/landing/PricingSection";
import { WhySection } from "@/components/landing/WhySection";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function LandingPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "landing" });
  const tn = await getTranslations({ locale, namespace: "nav" });
  const tf = await getTranslations({ locale, namespace: "footer" });

  const tools = [
    {
      icon: FileStack,
      tone: "bg-[var(--tool-merge-bg)] text-[var(--tool-merge-accent)] border-[var(--accent-light)]",
      label: t("featureMergeLabel"),
      desc: t("featureMergeDesc"),
    },
    {
      icon: Scissors,
      tone: "bg-[var(--tool-organize-bg)] text-[var(--tool-organize-accent)] border-[var(--line)]",
      label: t("featureOrganizeLabel"),
      desc: t("featureOrganizeDesc"),
    },
    {
      icon: ImageIcon,
      tone: "bg-[var(--tool-images-bg)] text-[var(--tool-images-accent)] border-[var(--warning-line)]",
      label: t("featureImagesLabel"),
      desc: t("featureImagesDesc"),
    },
    {
      icon: FileImage,
      tone: "bg-[var(--tool-pdf-images-bg)] text-[var(--tool-pdf-images-accent)] border-[var(--info-line)]",
      label: t("featurePdfImagesLabel"),
      desc: t("featurePdfImagesDesc"),
    },
    {
      icon: PenLine,
      tone: "bg-[var(--tool-sign-bg)] text-[var(--tool-sign-accent)] border-[var(--danger-line)]",
      label: t("featureSignLabel"),
      desc: t("featureSignDesc"),
    },
    {
      icon: Edit3,
      tone: "bg-[var(--tool-edit-bg)] text-[var(--tool-edit-accent)] border-[var(--line)]",
      label: t("featureEditLabel"),
      desc: t("featureEditDesc"),
    },
  ];

  const whyItems = [
    { icon: Lock, title: t("why1Title"), desc: t("why1Desc") },
    { icon: BadgeCheck, title: t("why2Title"), desc: t("why2Desc") },
    { icon: Globe, title: t("why3Title"), desc: t("why3Desc") },
    { icon: Layers2, title: t("why4Title"), desc: t("why4Desc") },
  ];

  const freeFeatures = [
    t("planFreeFeature1"),
    t("planFreeFeature2"),
    t("planFreeFeature3"),
    t("planFreeFeature4"),
    t("planFreeFeature5"),
    t("planFreeFeature6"),
  ];

  const proFeatures = [
    t("planProFeature1"),
    t("planProFeature2"),
    t("planProFeature3"),
    t("planProFeature4"),
    t("planProFeature5"),
  ];

  const altLocale = tn("localeSwitchTarget") as "fr" | "en";

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-[var(--background)] text-[var(--foreground)]">
      <LandingHeader
        agencyLabel={tn("agencyLink")}
        brand={tn("brand")}
        tagline={tn("tagline")}
        primaryNavigation={tn("primaryNavigation")}
        localeSwitch={tn("localeSwitch")}
        altLocale={altLocale}
        appLabel={tn("app")}
      />

      <main className="flex-1">
        <LandingJsonLd
          locale={locale}
          brand={tn("brand")}
          featureList={[
            ...freeFeatures,
            ...proFeatures,
            t("why1Title"),
            t("why2Title"),
          ]}
          schemaAudience={t("schemaAudience")}
          schemaSenegal={t("schemaSenegal")}
          schemaCanada={t("schemaCanada")}
          schemaWorldwide={t("schemaWorldwide")}
        />

        <HeroSection
          heroTag={t("heroTag")}
          heroTitle={t("heroTitle")}
          heroSubtitle={t("heroSubtitle")}
          heroCta={t("heroCta")}
          heroSecondaryCta={t("heroSecondaryCta")}
          proofItems={[t("heroProof1"), t("heroProof2"), t("heroProof3")]}
          stats={[
            { value: t("statTools"), label: t("statToolsDesc") },
            { value: t("statLocal"), label: t("statLocalDesc") },
            { value: t("statPrice"), label: t("statPriceDesc") },
          ]}
          preview={{
            title: t("previewTitle"),
            status: t("previewStatus"),
            drop: t("previewDrop"),
            action: t("previewAction"),
            privacy: t("previewPrivacy"),
          }}
          tools={tools}
        />

        <FeaturesSection
          title={t("featuresTitle")}
          subtitle={t("featuresSubtitle")}
          tools={tools}
        />

        <WhySection
          title={t("whyTitle")}
          subtitle={t("whySubtitle")}
          items={whyItems}
        />

        <PricingSection
          title={t("pricingTitle")}
          subtitle={t("pricingSubtitle")}
          freePlan={{
            title: t("planFreeTitle"),
            price: t("planFreePrice"),
            period: t("planFreePeriod"),
            features: freeFeatures,
            action: t("planFreeBtn"),
          }}
          proPlan={{
            title: t("planProTitle"),
            price: t("planProPrice"),
            period: t("planProPeriod"),
            badge: t("planProBadge"),
            features: proFeatures,
            action: t("planProBtn"),
          }}
        />

        <CtaSection
          title={t("ctaTitle")}
          subtitle={t("ctaSubtitle")}
          action={t("ctaBtn")}
        />
      </main>

      <LandingFooter
        agency={tf("agency")}
        privacy={tf("privacy")}
        copyright={tf("copyright")}
        contact={tf("contact")}
      />
    </div>
  );
}
