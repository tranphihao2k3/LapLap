import React from "react";

type FooterLink = { label: string; href: string };

interface FooterProps {
    companyName?: string;
    links?: FooterLink[];
    className?: string;
}

const Footer: React.FC<FooterProps> = ({
    companyName = "Your Company",
    links = [
        { label: "Home", href: "/" },
        { label: "About", href: "/about" },
        { label: "Contact", href: "/contact" },
    ],
    className = "",
}) => {
    const year = new Date().getFullYear();

    return (
        <footer
            aria-label="Site footer"
            className={className}
            style={{
                padding: "1rem 1.5rem",
                background: "#0f172a",
                color: "#e6edf3",
                fontSize: "0.95rem",
            }}
        >
            <div
                style={{
                    maxWidth: 1100,
                    margin: "0 auto",
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                    gap: "0.75rem",
                    alignItems: "center",
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <strong style={{ fontSize: "1rem" }}>{companyName}</strong>
                    <span style={{ opacity: 0.8 }}> — building great experiences</span>
                </div>

                <nav aria-label="Footer navigation">
                    <ul
                        style={{
                            display: "flex",
                            gap: 12,
                            listStyle: "none",
                            margin: 0,
                            padding: 0,
                        }}
                    >
                        {links.map((l) => (
                            <li key={l.href}>
                                <a
                                    href={l.href}
                                    style={{ color: "#cfe7ff", textDecoration: "none" }}
                                >
                                    {l.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div style={{ opacity: 0.85 }}>© {year} {companyName}. All rights reserved.</div>
            </div>
        </footer>
    );
};

export default Footer;