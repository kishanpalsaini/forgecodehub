"use client";

import { useState } from "react";

type FAQItem = {
    question: string;
    answer: string;
};

export default function ToolFaq({
    faqs,
    title = "Frequently Asked Questions",
    subtitle,
}: {
    faqs: FAQItem[];
    title?: string;
    subtitle?: string;
}) {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section
            className="mt-16 rounded-3xl bg-white p-8 shadow-xl border border-gray-200"
            style={{ margin: "auto", width: "100%", maxWidth: "1600px" }}
        >
            <h2 className="text-4xl font-bold text-gray-900">{title}</h2>

            <p className="mt-3 mb-8 text-lg text-gray-500">
                {subtitle ?? `Everything you need to know about using this tool.`}
            </p>

            <div className="space-y-4">
                {faqs.map((faq, index) => {
                    const isOpen = openIndex === index;
                    return (
                        <div
                            key={index}
                            className="rounded-2xl border border-gray-200 bg-gray-50 overflow-hidden"
                        >
                            <button
                                type="button"
                                onClick={() => setOpenIndex(isOpen ? null : index)}
                                className="w-full flex items-center justify-between px-6 py-5 text-left"
                            >
                                <span className="text-lg font-semibold text-gray-900">
                                    {faq.question}
                                </span>
                                <span className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold flex-shrink-0" style={{display:"none"}}>
                                    {isOpen ? "−" : "+"}
                                </span>
                            </button>

                            {isOpen && (
                                <div className="px-6 pb-5 text-gray-600 leading-7">
                                    {faq.answer}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </section>
    );
}