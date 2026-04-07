"use client";

import { useState } from "react";
import { onlineNotepadFaqs } from "@/lib/online-notepad-faqs";

type FAQItem = {
    question: string;
    answer: string;
};

export default function OnlineNotepadFaq({
    faqs,
}: {
    faqs?: FAQItem[];
}) {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section className="mt-16 max-w-4xl rounded-3xl bg-white p-8 shadow-xl border border-gray-200">
            <h2 className="text-4xl font-bold text-gray-900">
                Frequently Asked Questions
            </h2>

            <p className="mt-3 mb-8 text-lg text-gray-500">
                Everything you need to know about using the Online Notepad.
            </p>

            <div className="space-y-4">
                {onlineNotepadFaqs?.map((faq, index) => {
                    const isOpen = openIndex === index;

                    return (
                        <div
                            key={index}
                            className="rounded-2xl border border-gray-200 bg-gray-50 overflow-hidden"
                        >
                            <button
                                type="button"
                                onClick={() =>
                                    setOpenIndex(isOpen ? null : index)
                                }
                                className="w-full flex items-center justify-between px-6 py-5 text-left"
                            >
                                <span className="text-lg font-semibold text-gray-900">
                                    {faq.question}
                                </span>

                                <span className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
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