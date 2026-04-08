"use client";

import { useState } from "react";
import { pomodoroFaqs } from "@/lib/pomodoro-faq";

type FAQItem = {
    question: string;
    answer: string;
};

export default function PomodoroFaq() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section className="mt-16 w-full px-4 sm:px-6 lg:px-0">
            {/* Header */}
            <div className="mb-10 text-center">
                <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1.5 mb-4">
                    <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
                    <span className="text-xs font-semibold uppercase tracking-widest text-indigo-600">
                        FAQ
                    </span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
                    Frequently Asked{" "}
                    <span className="text-indigo-600">Questions</span>
                </h2>
                <p className="mt-3 text-base sm:text-lg text-gray-500 max-w-xl mx-auto">
                    Everything you need to know about using the ForgeCode Timer.
                </p>
            </div>

            {/* FAQ list */}
            <div className="max-w-3xl mx-auto space-y-3">
                {pomodoroFaqs?.map((faq: FAQItem, index: number) => {
                    const isOpen = openIndex === index;

                    return (
                        <div
                            key={index}
                            className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                                isOpen
                                    ? "border-indigo-300 bg-indigo-50 shadow-md shadow-indigo-100"
                                    : "border-gray-200 bg-white hover:border-indigo-200 hover:shadow-sm"
                            }`}
                        >
                            <button
                                type="button"
                                onClick={() =>
                                    setOpenIndex(isOpen ? null : index)
                                }
                                className="w-full flex items-center justify-between gap-4 px-5 sm:px-6 py-4 sm:py-5 text-left"
                            >
                                <div className="flex items-center gap-3">
                                    {/* Index number badge */}
                                    <span
                                        className={`hidden sm:flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                                            isOpen
                                                ? "bg-indigo-600 text-white"
                                                : "bg-gray-100 text-gray-400"
                                        }`}
                                    >
                                        {index + 1}
                                    </span>
                                    <span
                                        className={`text-base sm:text-lg font-semibold leading-snug transition-colors ${
                                            isOpen
                                                ? "text-indigo-700"
                                                : "text-gray-800"
                                        }`}
                                    >
                                        {faq.question}
                                    </span>
                                </div>

                                {/* Toggle icon */}
                                <span
                                    className={`shrink-0 h-8 w-8 flex items-center justify-center rounded-full text-lg font-bold transition-all duration-200 ${
                                        isOpen
                                            ? "bg-indigo-600 text-white"
                                            : "bg-gray-100 text-gray-500"
                                    }`}
                                >
                                    {isOpen ? "−" : "+"}
                                </span>
                            </button>

                            {/* Answer — shown when open */}
                            {isOpen && (
                                <div className="px-5 sm:px-6 pb-5 sm:pb-6">
                                    <div className="sm:pl-10">
                                        <p className="text-sm sm:text-base text-gray-600 leading-7 border-t border-indigo-100 pt-4">
                                            {faq.answer}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Bottom hint */}
            <div className="mt-10 text-center">
                <p className="text-sm text-gray-400">
                    Still have questions?{" "}
                    <a
                        href="mailto:support@forgecodehub.com"
                        className="text-indigo-600 font-semibold hover:underline"
                    >
                        Get in touch →
                    </a>
                </p>
            </div>
        </section>
    );
}