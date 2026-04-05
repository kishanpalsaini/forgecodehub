export const statesData: Record<string, {
    name: string;
    code: string;
    capital: string;
    gdp: string;
    majorIndustries: string[];
    desc: string;
}> = {
    maharashtra: { name: "Maharashtra", code: "MH", capital: "Mumbai", gdp: "₹32 lakh crore", majorIndustries: ["Finance", "IT", "Manufacturing", "Textiles"], desc: "India's largest economy and financial capital, home to BSE and NSE." },
    delhi: { name: "Delhi", code: "DL", capital: "New Delhi", gdp: "₹9 lakh crore", majorIndustries: ["Trade", "Real Estate", "IT", "Government"], desc: "National capital and major commercial hub with one of India's highest per capita incomes." },
    karnataka: { name: "Karnataka", code: "KA", capital: "Bengaluru", gdp: "₹18 lakh crore", majorIndustries: ["IT", "Aerospace", "Silk", "Mining"], desc: "India's silicon valley, home to Infosys, Wipro and hundreds of tech startups." },
    gujarat: { name: "Gujarat", code: "GJ", capital: "Gandhinagar", gdp: "₹18 lakh crore", majorIndustries: ["Petrochemicals", "Textiles", "Diamonds", "Pharma"], desc: "One of India's most industrialized states with a strong business culture." },
    tamilnadu: { name: "Tamil Nadu", code: "TN", capital: "Chennai", gdp: "₹17 lakh crore", majorIndustries: ["Automobiles", "IT", "Textiles", "Agriculture"], desc: "Manufacturing powerhouse and home to India's automobile industry." },
    rajasthan: { name: "Rajasthan", code: "RJ", capital: "Jaipur", gdp: "₹11 lakh crore", majorIndustries: ["Tourism", "Mining", "Agriculture", "Handicrafts"], desc: "Largest state by area with booming tourism and mining sectors." },
    uttarpradesh: { name: "Uttar Pradesh", code: "UP", capital: "Lucknow", gdp: "₹17 lakh crore", majorIndustries: ["Agriculture", "Manufacturing", "IT", "Tourism"], desc: "Most populous state with the fastest growing economy in recent years." },
    westbengal: { name: "West Bengal", code: "WB", capital: "Kolkata", gdp: "₹14 lakh crore", majorIndustries: ["Jute", "Tea", "IT", "Engineering"], desc: "Eastern India's commercial hub with a strong manufacturing and cultural heritage." },
    telangana: { name: "Telangana", code: "TS", capital: "Hyderabad", gdp: "₹12 lakh crore", majorIndustries: ["IT", "Pharma", "Agriculture", "Mining"], desc: "One of India's fastest growing states, Hyderabad is a major IT and pharma hub." },
    andhrapradesh: { name: "Andhra Pradesh", code: "AP", capital: "Amaravati", gdp: "₹11 lakh crore", majorIndustries: ["Agriculture", "Aquaculture", "Mining", "IT"], desc: "Major agricultural state with growing industrial corridors along the coast." },
    kerala: { name: "Kerala", code: "KL", capital: "Thiruvananthapuram", gdp: "₹9 lakh crore", majorIndustries: ["Tourism", "Remittances", "Fisheries", "Spices"], desc: "Highest literacy rate in India with a thriving tourism and healthcare sector." },
    madhyapradesh: { name: "Madhya Pradesh", code: "MP", capital: "Bhopal", gdp: "₹11 lakh crore", majorIndustries: ["Agriculture", "Mining", "Tourism", "Manufacturing"], desc: "Heart of India with abundant mineral resources and growing manufacturing." },
};