// export const financeTools = [
//     {
//         href: "/finance-calculators",
//         icon: "🏦",
//         tag: "Live",
//         tagClass: "tag-live",
//         name: "Financial Calculators Hub",
//         desc: "All-in-one hub for EMI, GST, SIP, Tax, FD, Loan and more. Open the full calculator suite.",
//         path: "/finance-calculators",
//         cat: "finance",
//         related: ["gst", "sip", "tax", "loan", "fd"],
//     },
//     {
//         href: "/finance-calculators/emi",
//         icon: "🧮",
//         tag: "Live",
//         tagClass: "tag-live",
//         name: "EMI Calculator",
//         desc: "Monthly installments for home, car & personal loans with amortization breakdown.",
//         path: "/finance-calculators/emi",
//         cat: "finance",
//         related: ["gst", "sip", "tax", "loan", "fd"],
//         guide: {
//             slug: "how-to-calculate-emi",
//             title: "How to Calculate EMI — Formula, Examples & Calculator",
//             metaDesc: "Learn how EMI is calculated with formula and worked examples. Use our free EMI calculator for instant results.",
//             whatIs: "EMI (Equated Monthly Instalment) is the fixed amount you pay every month to repay a loan. It includes both principal and interest.",
//             formula: "EMI = P × r × (1+r)^n / ((1+r)^n - 1)",
//             formulaVars: [
//                 { var: "P", meaning: "Principal loan amount" },
//                 { var: "r", meaning: "Monthly interest rate (annual rate ÷ 12 ÷ 100)" },
//                 { var: "n", meaning: "Total number of monthly payments" },
//             ],
//             useCases: ["Home loans", "Car loans", "Personal loans", "Education loans"],
//             faqs: [
//                 { q: "Does EMI change if interest rate changes?", a: "For floating rate loans yes, for fixed rate loans no." },
//                 { q: "Can I reduce my EMI?", a: "Yes, by increasing the tenure or making a partial prepayment." },
//             ],
//         },
//     },
//     {
//         href: "/finance-calculators/gst",
//         icon: "🧾",
//         tag: "Live",
//         tagClass: "tag-live",
//         name: "GST Calculator",
//         desc: "Add or remove GST instantly. Full CGST/SGST/IGST split for all Indian tax rates.",
//         path: "/finance-calculators/gst",
//         cat: "finance",
//         related: ["emi", "sip", "tax", "loan", "fd"],
//     },
//     {
//         href: "/finance-calculators/tax",
//         icon: "📋",
//         tag: "Live",
//         tagClass: "tag-live",
//         name: "Income Tax",
//         desc: "FY 2025–26 tax computation. Old vs New regime comparison with net take-home.",
//         path: "/finance-calculators/tax",
//         cat: "finance",
//         related: ["emi", "gst", "sip", "loan", "fd"],
//     },
//     {
//         href: "/finance-calculators/sip",
//         icon: "📈",
//         tag: "Live",
//         tagClass: "tag-live",
//         name: "SIP Calculator",
//         desc: "Project SIP wealth over time with step-up mode, milestones & inflation-adjusted returns.",
//         path: "/finance-calculators/sip",
//         cat: "finance",
//         related: ["emi", "gst", "tax", "loan", "fd"],
//     },
//     {
//         href: "/finance-calculators/loan",
//         icon: "🏛️",
//         tag: "Live",
//         tagClass: "tag-live",
//         name: "Loan Eligibility",
//         desc: "Know your maximum loan amount. FOIR-based with CIBIL score adjustment.",
//         path: "/finance-calculators/loan",
//         cat: "finance",
//         related: ["emi", "gst", "tax", "sip", "fd"],
//     },
//     {
//         href: "/finance-calculators/fd",
//         icon: "💰",
//         tag: "Live",
//         tagClass: "tag-live",
//         name: "FD / RD Calculator",
//         desc: "Fixed & recurring deposit maturity, compounding frequency comparison.",
//         path: "/finance-calculators/fd",
//         cat: "finance",
//         related: ["emi", "gst", "tax", "sip", "loan"],
//     },
//     {
//         href: "/finance-calculators/retirement",
//         icon: "🌅",
//         tag: "Live",
//         tagClass: "tag-live",
//         name: "Retirement Planner",
//         desc: "Corpus needed, SIP gap analysis and inflation-adjusted projections.",
//         path: "/finance-calculators/retirement",
//         cat: "finance",
//         related: ["emi", "gst", "tax", "sip", "loan", "fd"],
//     },
//     {
//         href: "/finance-calculators/networth",
//         icon: "💎",
//         tag: "Live",
//         tagClass: "tag-live",
//         name: "Net Worth Tracker",
//         desc: "Track assets vs liabilities, donut breakdown and financial health score.",
//         path: "/finance-calculators/networth",
//         cat: "finance",
//         related: ["emi", "gst", "tax", "sip", "loan", "fd"],
//     },
//     {
//         href: "/finance-calculators/goal",
//         icon: "🎯",
//         tag: "Live",
//         tagClass: "tag-live",
//         name: "Goal-Based Savings",
//         desc: "Plan for home, car, education — with inflation-adjusted SIP targets.",
//         path: "/finance-calculators/goal",
//         cat: "finance",
//         related: ["emi", "gst", "tax", "sip", "loan", "fd"],
//     },
// ];



export const financeTools = [
    {
        href: "/finance-calculators",
        icon: "🏦",
        tag: "Live",
        tagClass: "tag-live",
        name: "Financial Calculators Hub",
        desc: "All-in-one hub for EMI, GST, SIP, Tax, FD, Loan and more. Open the full calculator suite.",
        path: "/finance-calculators",
        cat: "finance",
        related: ["emi", "gst", "sip", "tax", "loan", "fd", "retirement", "networth", "goal"],
        guide: {
            slug: "best-financial-calculators-india",
            title: "Best Financial Calculators for EMI, SIP, GST, Tax & Loans",
            metaDesc:
                "Explore all financial calculators including EMI, SIP, GST, tax, FD and retirement tools in one place.",
            whatIs:
                "A financial calculator hub helps users estimate loans, taxes, investments, and savings goals quickly and accurately.",
            useCases: [
                "Loan planning",
                "Tax calculations",
                "Investment projections",
                "Retirement planning",
            ],
            faqs: [
                {
                    q: "Which financial calculator should I use?",
                    a: "Choose based on your need: EMI for loans, SIP for investments, GST for tax calculations.",
                },
            ],
        },
    },

    {
        href: "/finance-calculators/emi",
        icon: "🧮",
        tag: "Live",
        tagClass: "tag-live",
        name: "EMI Calculator",
        desc: "Monthly installments for home, car & personal loans with amortization breakdown.",
        path: "/finance-calculators/emi",
        cat: "finance",
        related: ["gst", "sip", "tax", "loan", "fd"],
        guide: {
            slug: "how-to-calculate-emi",
            title: "How to Calculate EMI — Formula, Examples & Calculator",
            metaDesc:
                "Learn how EMI is calculated with formula and worked examples. Use our free EMI calculator for instant results.",
            whatIs:
                "EMI (Equated Monthly Instalment) is the fixed amount you pay every month to repay a loan.",
            formula: "EMI = P × r × (1+r)^n / ((1+r)^n - 1)",
            formulaVars: [
                { var: "P", meaning: "Principal loan amount" },
                { var: "r", meaning: "Monthly interest rate" },
                { var: "n", meaning: "Total number of monthly payments" },
            ],
            useCases: ["Home loans", "Car loans", "Personal loans"],
            faqs: [
                {
                    q: "Can EMI be reduced?",
                    a: "Yes, by increasing tenure or making prepayments.",
                },
            ],
        },
    },

    {
        href: "/finance-calculators/gst",
        icon: "🧾",
        tag: "Live",
        tagClass: "tag-live",
        name: "GST Calculator",
        desc: "Add or remove GST instantly. Full CGST/SGST/IGST split for all Indian tax rates.",
        path: "/finance-calculators/gst",
        cat: "finance",
        related: ["emi", "sip", "tax", "loan", "fd"],
        guide: {
            slug: "how-to-calculate-gst",
            title: "How to Calculate GST in India",
            metaDesc:
                "Learn how to calculate GST including CGST, SGST and IGST with examples.",
            whatIs:
                "GST is an indirect tax applied on goods and services in India.",
            formula: "GST = (Amount × GST Rate) / 100",
            formulaVars: [
                { var: "Amount", meaning: "Base amount" },
                { var: "GST Rate", meaning: "Applicable percentage" },
            ],
            useCases: ["Invoices", "Business billing", "Tax filing"],
            faqs: [
                {
                    q: "How to remove GST?",
                    a: "Divide total amount by (1 + GST rate / 100).",
                },
            ],
        },
    },

    {
        href: "/finance-calculators/tax",
        icon: "📋",
        tag: "Live",
        tagClass: "tag-live",
        name: "Income Tax",
        desc: "FY 2025–26 tax computation. Old vs New regime comparison with net take-home.",
        path: "/finance-calculators/tax",
        cat: "finance",
        related: ["emi", "gst", "sip", "loan", "fd"],
        guide: {
            slug: "income-tax-calculation-guide",
            title: "How to Calculate Income Tax in India",
            metaDesc:
                "Compare old vs new tax regime and calculate income tax instantly.",
            whatIs:
                "Income tax is levied on annual earnings based on slab rates.",
            useCases: ["Salary tax", "Tax planning", "Annual filing"],
            faqs: [
                {
                    q: "Which tax regime is better?",
                    a: "It depends on your deductions and salary structure.",
                },
            ],
        },
    },

    {
        href: "/finance-calculators/sip",
        icon: "📈",
        tag: "Live",
        tagClass: "tag-live",
        name: "SIP Calculator",
        desc: "Project SIP wealth over time with step-up mode, milestones & inflation-adjusted returns.",
        path: "/finance-calculators/sip",
        cat: "finance",
        related: ["emi", "gst", "tax", "loan", "fd"],
        guide: {
            slug: "how-to-calculate-sip-returns",
            title: "How to Calculate SIP Returns",
            metaDesc:
                "Use compound growth formula to calculate SIP returns with examples.",
            whatIs:
                "SIP allows fixed monthly investments in mutual funds.",
            formula: "M = P × [((1+r)^n - 1) / r] × (1+r)",
            formulaVars: [
                { var: "P", meaning: "Monthly SIP amount" },
                { var: "r", meaning: "Monthly return rate" },
                { var: "n", meaning: "Number of months" },
            ],
            useCases: ["Wealth creation", "Retirement", "Goal planning"],
            faqs: [
                {
                    q: "Can SIP beat FD?",
                    a: "Historically SIP offers better returns but with market risk.",
                },
            ],
        },
    },

    {
        href: "/finance-calculators/loan",
        icon: "🏛️",
        tag: "Live",
        tagClass: "tag-live",
        name: "Loan Eligibility",
        desc: "Know your maximum loan amount. FOIR-based with CIBIL score adjustment.",
        path: "/finance-calculators/loan",
        cat: "finance",
        related: ["emi", "gst", "tax", "sip", "fd"],
        guide: {
            slug: "loan-eligibility-guide",
            title: "How to Check Loan Eligibility",
            metaDesc:
                "Calculate your maximum eligible loan amount using salary and FOIR.",
            whatIs:
                "Loan eligibility depends on salary, credit score, and obligations.",
            useCases: ["Home loan", "Personal loan", "Car loan"],
            faqs: [
                {
                    q: "Does CIBIL affect loan eligibility?",
                    a: "Yes, higher scores improve eligibility and rates.",
                },
            ],
        },
    },

    {
        href: "/finance-calculators/fd",
        icon: "💰",
        tag: "Live",
        tagClass: "tag-live",
        name: "FD / RD Calculator",
        desc: "Fixed & recurring deposit maturity, compounding frequency comparison.",
        path: "/finance-calculators/fd",
        cat: "finance",
        related: ["emi", "gst", "tax", "sip", "loan"],
        guide: {
            slug: "fd-rd-calculator-guide",
            title: "How to Calculate FD and RD Maturity",
            metaDesc:
                "Calculate fixed deposit and recurring deposit maturity with compounding.",
            whatIs:
                "FD and RD calculators estimate maturity value and interest earned.",
            useCases: ["Short-term savings", "Emergency fund"],
            faqs: [
                {
                    q: "Is FD safer than SIP?",
                    a: "FD is safer but usually offers lower returns.",
                },
            ],
        },
    },

    {
        href: "/finance-calculators/retirement",
        icon: "🌅",
        tag: "Live",
        tagClass: "tag-live",
        name: "Retirement Planner",
        desc: "Corpus needed, SIP gap analysis and inflation-adjusted projections.",
        path: "/finance-calculators/retirement",
        cat: "finance",
        related: ["sip", "fd", "goal"],
        guide: {
            slug: "retirement-planning-guide",
            title: "How to Plan Retirement Corpus",
            metaDesc:
                "Estimate retirement corpus and monthly SIP required.",
            whatIs:
                "Retirement planning helps estimate future corpus needs adjusted for inflation.",
            useCases: ["Early retirement", "Pension planning"],
            faqs: [
                {
                    q: "How much should I save?",
                    a: "Depends on retirement age and expected expenses.",
                },
            ],
        },
    },

    {
        href: "/finance-calculators/networth",
        icon: "💎",
        tag: "Live",
        tagClass: "tag-live",
        name: "Net Worth Tracker",
        desc: "Track assets vs liabilities, donut breakdown and financial health score.",
        path: "/finance-calculators/networth",
        cat: "finance",
        related: ["goal", "retirement", "sip"],
        guide: {
            slug: "net-worth-guide",
            title: "How to Calculate Net Worth",
            metaDesc:
                "Track your assets and liabilities to calculate net worth.",
            whatIs:
                "Net worth is total assets minus total liabilities.",
            formula: "Net Worth = Assets - Liabilities",
            useCases: ["Personal finance tracking", "Wealth planning"],
            faqs: [
                {
                    q: "What is a good net worth?",
                    a: "It depends on age, income, and financial goals.",
                },
            ],
        },
    },

    {
        href: "/finance-calculators/goal",
        icon: "🎯",
        tag: "Live",
        tagClass: "tag-live",
        name: "Goal-Based Savings",
        desc: "Plan for home, car, education — with inflation-adjusted SIP targets.",
        path: "/finance-calculators/goal",
        cat: "finance",
        related: ["sip", "retirement", "fd"],
        guide: {
            slug: "goal-based-savings-guide",
            title: "How to Plan Goal-Based Savings",
            metaDesc:
                "Plan savings for home, education and future goals.",
            whatIs:
                "Goal-based planning helps estimate monthly investments required.",
            useCases: ["Home purchase", "Education", "Marriage"],
            faqs: [
                {
                    q: "Should I use SIP for goals?",
                    a: "Yes, SIP is ideal for long-term financial goals.",
                },
            ],
        },
    },
];