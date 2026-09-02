"use client";

import { Bounded } from "@/components/Bounded";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { View } from "@react-three/drei";
import Scene from "./Scene";
import { BlogTeaser } from "./BlogTeaser";
import { ContactTeaser } from "./ContactTeaser";
import clsx from "clsx";

/**
 * Props for `AlternatingText`.
 */
export type AlternatingTextProps =
  SliceComponentProps<Content.AlternatingTextSlice>;

type TextItem =
  | { heading: string; body: string; items?: undefined; steps?: undefined }
  | {
      heading: string;
      body?: undefined;
      items: { label: string; text: string }[];
      steps?: undefined;
    }
  | {
      heading: string;
      body?: undefined;
      items?: undefined;
      steps: string[];
    };

const TEXT_GROUP: TextItem[] = [
  {
    heading: "Our Services",
    items: [
      {
        label: "Skincare & Haircare Manufacturing",
        text: "Distinctive, high-performance products crafted with top-tier ingredients and modern techniques, for both established and emerging brands.",
      },
      {
        label: "New Product Development",
        text: "A personalized formulation process guided by expert chemists from concept to final sampling, with no one-size-fits-all solutions.",
      },
      {
        label: "Quality Assurance & Testing",
        text: "Rigorous PET, Stability, Micro, and Preservative Efficacy Testing conducted with accredited labs, ensuring every product is safe and market-ready.",
      },
      {
        label: "Switching Manufacturers",
        text: "A smooth, confidential transition at your own pace, with support around product IP ownership.",
      },
    ],
  },
  {
    heading: "Who We Serve",
    body: "From budding entrepreneurs to established brands, we support businesses across the EU region, MENA region, and GCC spanning skincare, cosmetics, cosmeceuticals, haircare, and even petcare, with cost-effective, flexible solutions tailored to each partner's goals.",
  },
  {
    heading: "Why Choose Us",
    body: "State-of-the-art automated machinery, an in-house quality lab, 500+ ethically sourced ingredients, and GMP/ISO/FDA-compliant operations. Backed by seven proprietary raw-material facilities and ongoing R&D, we offer competitive direct factory pricing, deep OEM expertise, full customization from formulation to packaging, and reliable, uninterrupted supply with transparent communication every step of the way.",
  },
  {
    heading: "How It Works",
    steps: [
      "Order samples & choose your products",
      "Consult on packaging",
      "Design your label",
      "Add finishing touches (boxes, shrink-wrap, inserts)",
    ],
  },
];

/**
 * Component for "AlternatingText" Slices.
 */
const AlternatingText = ({ slice }: AlternatingTextProps): JSX.Element => {
  return (
    <>
      <Bounded
        data-slice-type={slice.slice_type}
        data-slice-variation={slice.variation}
        className="alternating-text-container relative bg-[#EDE3DD] text-[#2B302B]"
      >
        <div>
          <div className="relative z-[100] grid">
            <View className="alternating-text-view absolute left-0 top-0 h-screen w-full">
              <Scene />
            </View>

            {TEXT_GROUP.map((item, index) => (
              <div
                key={item.heading}
                className="alternating-section grid min-h-screen place-items-center gap-x-12 py-16 lg:grid-cols-2"
              >
                <div
                  className={clsx(
                    index % 2 === 0 ? "col-start-1" : "lg:col-start-2",

                    "rounded-lg p-4 backdrop-blur-lg max-lg:bg-white/30",
                  )}
                >
                  <h2 className="text-balance text-6xl font-bold">
                    {item.heading}
                  </h2>
                  {item.items ? (
                    <div className="mt-4 space-y-4 text-xl">
                      {item.items.map((service) => (
                        <p key={service.label}>
                          <span className="font-bold">{service.label}: </span>
                          {service.text}
                        </p>
                      ))}
                    </div>
                  ) : item.steps ? (
                    <ol className="mt-4 space-y-4 text-xl">
                      {item.steps.map((step, stepIndex) => (
                        <li key={step} className="flex items-start gap-4">
                          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#6B8F71] text-base font-bold text-white">
                            {stepIndex + 1}
                          </span>
                          <span className="pt-0.5">{step}</span>
                        </li>
                      ))}
                    </ol>
                  ) : (
                    <div className="mt-4 text-xl">
                      <p>{item.body}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Bounded>
      <BlogTeaser />
      <ContactTeaser />
    </>
  );
};

export default AlternatingText;
